"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { personLabel, tenseName } from "@/lib/conjugation/labels";
import { formatClock } from "@/lib/format";
import { loc } from "@/lib/i18n/types";
import { wordCount } from "@/lib/text";
import type { ExamContent, ExamPlayback, ExamResponses } from "@/server/exam/types";
import { useI18n } from "../i18n";
import { answerForSubmit, ExerciseInputs, hasAnswer, initialValue, type ExerciseValue } from "../study/grammar";
import { AccentBar } from "../study/shared";
import { Button, TextArea, TextInput, cn } from "../ui/primitives";
import { Dictation } from "./dictation";

type PartKey = "dictation" | "conjugation" | "grammar" | "translation" | "writing";
const PARTS: PartKey[] = ["dictation", "conjugation", "grammar", "translation", "writing"];
const POINTS: Record<PartKey, number> = { dictation: 15, conjugation: 20, grammar: 20, translation: 15, writing: 30 };
const MINUTES: Record<PartKey, number> = { dictation: 10, conjugation: 10, grammar: 10, translation: 10, writing: 20 };

export interface ExamState {
  id: string;
  weekOf: string;
  number: number;
  kind: string;
  status: string;
  error: string | null;
  content: ExamContent | null;
  responses: ExamResponses;
  playback: ExamPlayback;
  elapsedMs: number;
  minutes: number;
}

function localKey(id: string) {
  return `armat-exam-${id}`;
}

function readLocal(id: string): { responses: ExamResponses; savedAt: number } | null {
  try {
    const raw = window.localStorage.getItem(localKey(id));
    return raw ? (JSON.parse(raw) as { responses: ExamResponses; savedAt: number }) : null;
  } catch {
    return null;
  }
}

function writeLocal(id: string, responses: ExamResponses) {
  try {
    window.localStorage.setItem(localKey(id), JSON.stringify({ responses, savedAt: Date.now() }));
  } catch {
    // Storage unavailable (private mode); the server copy remains.
  }
}

export function ExamRunner({ initial }: { initial: ExamState }) {
  const { t, lang } = useI18n();
  const router = useRouter();
  const [exam, setExam] = useState(initial);
  const [responses, setResponses] = useState<ExamResponses>(() => initial.responses ?? {});
  const [part, setPart] = useState<PartKey>("dictation");
  const [save, setSave] = useState<"saved" | "saving" | "local">("saved");
  const [confirm, setConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [starting, setStarting] = useState(false);
  const [startError, setStartError] = useState(false);
  const base = useRef(initial.elapsedMs);
  const started = useRef<number | null>(null);
  const [, setTick] = useState(0);
  const dirty = useRef(false);
  const limit = (initial.minutes ?? 60) * 60_000;

  const elapsed = useCallback(() => base.current + (started.current !== null ? performance.now() - started.current : 0), []);

  // Poll while the exam is being prepared.
  useEffect(() => {
    if (exam.status !== "generating") return;
    const id = window.setInterval(async () => {
      const res = await fetch(`/api/exam/${exam.id}`);
      if (res.ok) setExam((await res.json()) as ExamState);
    }, 3000);
    return () => window.clearInterval(id);
  }, [exam.id, exam.status]);

  useEffect(() => {
    if (exam.status === "submitted" || exam.status === "graded") router.replace(`/exam/${exam.id}/results`);
  }, [exam.status, exam.id, router]);

  // Restore a newer local copy (e.g. after a lost connection).
  useEffect(() => {
    const local = readLocal(exam.id);
    if (local && local.responses && JSON.stringify(local.responses) !== JSON.stringify(initial.responses)) {
      setResponses((prev) => ({ ...prev, ...local.responses }));
      dirty.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Timer: counts while the exam page is open.
  const running = exam.status === "in_progress" && !submitting;
  useEffect(() => {
    if (!running) return;
    started.current = performance.now();
    const id = window.setInterval(() => setTick((x) => x + 1), 1000);
    return () => {
      window.clearInterval(id);
      if (started.current !== null) base.current += performance.now() - started.current;
      started.current = null;
    };
  }, [running]);

  const persist = useCallback(
    async (beacon = false) => {
      const body = JSON.stringify({ responses, elapsedMs: Math.round(elapsed()) });
      writeLocal(exam.id, responses);
      if (beacon && navigator.sendBeacon) {
        navigator.sendBeacon(`/api/exam/${exam.id}/save`, body);
        return;
      }
      setSave("saving");
      try {
        const res = await fetch(`/api/exam/${exam.id}/save`, { method: "POST", headers: { "content-type": "application/json" }, body, keepalive: true });
        if (!res.ok) throw new Error();
        const json = (await res.json()) as { status: string };
        dirty.current = false;
        setSave("saved");
        if (json.status === "submitted") router.replace(`/exam/${exam.id}/results`);
      } catch {
        setSave("local");
      }
    },
    [responses, exam.id, elapsed, router],
  );

  // Debounced autosave after changes, plus a periodic save of the elapsed time.
  useEffect(() => {
    if (exam.status !== "in_progress" || !dirty.current) return;
    const id = window.setTimeout(() => void persist(), 1200);
    return () => window.clearTimeout(id);
  }, [responses, exam.status, persist]);
  useEffect(() => {
    if (exam.status !== "in_progress") return;
    const id = window.setInterval(() => void persist(), 20_000);
    const onHide = () => {
      if (document.visibilityState === "hidden") void persist(true);
    };
    window.addEventListener("pagehide", onHide);
    document.addEventListener("visibilitychange", onHide);
    return () => {
      window.clearInterval(id);
      window.removeEventListener("pagehide", onHide);
      document.removeEventListener("visibilitychange", onHide);
    };
  }, [exam.status, persist]);

  const update = (patch: ExamResponses) => {
    dirty.current = true;
    setResponses((prev) => ({
      ...prev,
      ...patch,
      conjugation: { ...(prev.conjugation ?? {}), ...(patch.conjugation ?? {}) },
      grammar: { ...(prev.grammar ?? {}), ...(patch.grammar ?? {}) },
      translation: { ...(prev.translation ?? {}), ...(patch.translation ?? {}) },
    }));
  };

  const submit = useCallback(async () => {
    setSubmitting(true);
    writeLocal(exam.id, responses);
    try {
      const res = await fetch(`/api/exam/${exam.id}/submit`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ responses, elapsedMs: Math.round(elapsed()) }) });
      if (!res.ok) throw new Error();
      router.replace(`/exam/${exam.id}/results`);
    } catch {
      setSubmitting(false);
      setSave("local");
    }
  }, [exam.id, responses, elapsed, router]);

  const remaining = Math.max(0, limit - elapsed());
  useEffect(() => {
    if (running && remaining <= 0) void submit();
  }, [running, remaining, submit]);

  const content = exam.content;
  const unanswered = useMemo(() => {
    if (!content) return 0;
    let n = 0;
    if (!responses.dictation?.trim()) n++;
    n += content.conjugation.filter((c) => !responses.conjugation?.[c.id]?.trim()).length;
    n += content.grammar.filter((g) => !hasAnswer({ ...g, prompt: g.instruction }, responses.grammar?.[`${g.id}:raw`] ?? responses.grammar?.[g.id])).length;
    n += content.translation.filter((x) => !responses.translation?.[x.id]?.trim()).length;
    if (!responses.writing?.trim()) n++;
    return n;
  }, [content, responses]);

  async function start() {
    setStarting(true);
    setStartError(false);
    try {
      const res = await fetch(`/api/exam/${exam.id}/start`, { method: "POST" });
      if (!res.ok) throw new Error();
      setExam((await res.json()) as ExamState);
    } catch {
      setStartError(true);
    } finally {
      setStarting(false);
    }
  }

  async function retry() {
    const res = await fetch("/api/exam/ensure", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ weekOf: exam.weekOf }) });
    if (res.ok) setExam({ ...exam, status: "generating" });
  }

  const title = exam.kind === "monthly" ? t("overview.monthlyExam", { n: exam.number }) : t("overview.weeklyExam", { n: exam.number });

  if (exam.status === "generating" || exam.status === "failed") {
    return (
      <div className="mx-auto flex min-h-dvh max-w-[560px] flex-col justify-center gap-4 px-4">
        <h1 className="text-[26px] font-semibold tracking-[-0.015em]">{exam.status === "failed" ? t("exam.failed") : t("exam.preparing")}</h1>
        <p className="text-[15px] text-ink-2">{exam.status === "failed" ? exam.error : t("exam.preparingNote")}</p>
        {exam.status === "failed" && (
          <div>
            <Button onClick={retry}>{t("common.retry")}</Button>
          </div>
        )}
      </div>
    );
  }

  if (exam.status === "ready" || !content) {
    return (
      <div className="mx-auto flex min-h-dvh max-w-[620px] flex-col justify-center gap-8 px-4 py-12">
        <div>
          <div className="text-[14px] text-ink-3">{t("exam.title")}</div>
          <h1 className="mt-1 text-[30px] font-semibold tracking-[-0.02em]">{title}</h1>
          {exam.kind === "monthly" && <p className="mt-2 text-[15px] text-ink-2">{t("exam.monthlyNote")}</p>}
        </div>
        <table className="w-full text-[15px]">
          <tbody>
            {PARTS.map((p, i) => (
              <tr key={p} className="border-t border-line">
                <td className="w-8 py-2.5 text-ink-3">{i + 1}</td>
                <td className="py-2.5">{t(`exam.parts.${p}`)}</td>
                <td className="tabular py-2.5 text-right text-ink-2">{t("common.minutes", { n: MINUTES[p] })}</td>
                <td className="tabular w-24 py-2.5 text-right text-ink-2">{t("exam.points", { n: POINTS[p] })}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="text-[15px] leading-relaxed text-ink-2">{t("exam.rules")}</p>
        <div className="flex items-center gap-4">
          <Button size="lg" onClick={start} disabled={starting}>
            {t("exam.startExam")}
          </Button>
          {starting && <span className="text-[14px] text-ink-3">{t("common.loading")}</span>}
          {startError && <span className="text-[14px] text-negative">{t("common.error")}</span>}
        </div>
      </div>
    );
  }

  const grammarValue = (id: string, ex: Parameters<typeof initialValue>[0]): ExerciseValue => {
    const raw = responses.grammar?.[`${id}:raw`];
    if (raw !== undefined) return raw;
    const v = responses.grammar?.[id];
    return v !== undefined ? v : initialValue(ex);
  };

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="sticky top-0 z-10 border-b border-line bg-bg">
        <div className="mx-auto flex h-14 max-w-[880px] items-center gap-4 px-4 sm:px-6">
          <span className="truncate text-[15px] font-medium">{title}</span>
          <span className="ml-auto text-[13px] text-ink-3">{save === "saving" ? t("common.saving") : save === "local" ? t("exam.savedLocal") : t("common.saved")}</span>
          <span className={cn("tabular font-mono text-[15px]", remaining < 5 * 60_000 ? "text-caution" : "text-ink-2")} aria-label={t("exam.remaining")}>
            {formatClock(remaining)}
          </span>
          <Button size="sm" onClick={() => setConfirm(true)} disabled={submitting}>
            {t("common.submit")}
          </Button>
        </div>
        <nav className="mx-auto flex max-w-[880px] gap-1 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:px-6">
          {PARTS.map((p, i) => (
            <button
              key={p}
              type="button"
              onClick={() => setPart(p)}
              aria-current={part === p ? "step" : undefined}
              className={cn("shrink-0 rounded-md px-2.5 py-1.5 text-[14px] transition-colors", part === p ? "bg-subtle font-medium text-ink" : "text-ink-2 hover:text-ink")}
            >
              <span className="mr-1.5 text-ink-3">{i + 1}</span>
              {t(`exam.parts.${p}`)}
            </button>
          ))}
        </nav>
      </header>

      <main className="mx-auto w-full max-w-[760px] flex-1 px-4 pb-24 pt-8 sm:px-6">
        <div className="mb-6 flex items-baseline justify-between gap-4">
          <h2 className="text-[22px] font-semibold tracking-[-0.01em]">{t(`exam.parts.${part}`)}</h2>
          <span className="text-[13px] text-ink-3">
            {t("exam.points", { n: POINTS[part] })}, {t("common.minutes", { n: MINUTES[part] })}
          </span>
        </div>

        {part === "dictation" && (
          <>
            <p className="mb-5 text-[15px] text-ink-2">{t("exam.dictationInstruction")}</p>
            <Dictation
              examId={exam.id}
              segments={content.dictation.segments}
              tts={content.dictation.tts}
              encoded={content.dictation.encoded}
              playback={exam.playback}
              onPlayback={(p) => setExam((e) => ({ ...e, playback: p }))}
              value={responses.dictation ?? ""}
              onChange={(v) => update({ dictation: v })}
            />
          </>
        )}

        {part === "conjugation" && (
          <>
            <p className="mb-5 text-[15px] text-ink-2">{t("exam.conjugationInstruction")}</p>
            <ol className="flex flex-col divide-y divide-line border-y border-line">
              {content.conjugation.map((c, i) => (
                <li key={c.id} className="grid grid-cols-[28px_1fr] gap-x-3 gap-y-2 py-4 sm:grid-cols-[28px_1fr_240px] sm:items-center">
                  <span className="tabular pt-0.5 text-[13px] text-ink-3">{i + 1}</span>
                  <div className="text-[17px] leading-snug">
                    {c.type === "direct" ? (
                      <span>
                        <span className="font-medium">{c.verb}</span>
                        <span className="ml-3 text-ink-2">{c.subject ?? (c.person !== null ? personLabel(c.person, c.tense ?? undefined) : "")}</span>
                        {c.tense && <span className="ml-3 text-[14px] text-ink-3">{tenseName(c.tense)}</span>}
                      </span>
                    ) : (
                      <span lang="es">
                        {c.before} <span className="inline-block min-w-12 border-b border-ink-3">&nbsp;</span> <span className="text-ink-3">({c.verb})</span> {c.after}
                        {c.tense && <span className="ml-2 text-[14px] text-ink-3">{tenseName(c.tense)}</span>}
                      </span>
                    )}
                  </div>
                  <div className="col-start-2 sm:col-start-3">
                    <TextInput value={responses.conjugation?.[c.id] ?? ""} onChange={(e) => update({ conjugation: { [c.id]: e.target.value } })} lang="es" aria-label={`${i + 1}`} />
                  </div>
                </li>
              ))}
            </ol>
          </>
        )}

        {part === "grammar" && (
          <>
            <p className="mb-5 text-[15px] text-ink-2">{t("exam.grammarInstruction")}</p>
            <ol className="flex flex-col gap-10">
              {content.grammar.map((g, i) => {
                const ex = { type: g.type, prompt: g.instruction, es: g.es, tokens: g.tokens, options: g.options, blanks: g.blanks };
                return (
                  <li key={g.id} className="grid grid-cols-[28px_1fr] gap-3">
                    <span className="tabular pt-1 text-[13px] text-ink-3">{i + 1}</span>
                    <div className="flex min-w-0 flex-col gap-3">
                      <div className="text-[14px] text-ink-2">{t(`study.instructions.${g.type}`)}</div>
                      {g.instruction && (g.type === "translate" || g.type === "write") && <p className="text-[18px] leading-snug">{loc(g.instruction, lang)}</p>}
                      <ExerciseInputs
                        ex={ex}
                        value={grammarValue(g.id, ex)}
                        autoFocus={false}
                        onChange={(v) => update({ grammar: { [g.id]: answerForSubmit(ex, v), ...(g.type === "reconstruct" ? { [`${g.id}:raw`]: v } : {}) } })}
                      />
                    </div>
                  </li>
                );
              })}
            </ol>
          </>
        )}

        {part === "translation" && (
          <>
            <p className="mb-5 text-[15px] text-ink-2">{t("exam.translationInstruction")}</p>
            <ol className="flex flex-col gap-8">
              {content.translation.map((x, i) => (
                <TranslationItem key={x.id} index={i} source={x.source} value={responses.translation?.[x.id] ?? ""} onChange={(v) => update({ translation: { [x.id]: v } })} />
              ))}
            </ol>
          </>
        )}

        {part === "writing" && (
          <WritingPart content={content} value={responses.writing ?? ""} onChange={(v) => update({ writing: v })} />
        )}

        <div className="mt-12 flex justify-between border-t border-line pt-5">
          <Button variant="ghost" onClick={() => setPart(PARTS[Math.max(0, PARTS.indexOf(part) - 1)]!)} disabled={part === PARTS[0]}>
            {t("common.back")}
          </Button>
          {part !== "writing" ? (
            <Button variant="secondary" onClick={() => setPart(PARTS[PARTS.indexOf(part) + 1]!)}>
              {t("common.next")}
            </Button>
          ) : (
            <Button onClick={() => setConfirm(true)}>{t("common.submit")}</Button>
          )}
        </div>
      </main>

      {confirm && (
        <div className="reveal fixed inset-0 z-30 flex items-center justify-center bg-bg/90 px-6" role="dialog" aria-modal="true">
          <div className="w-full max-w-[400px] rounded-xl border border-line bg-surface p-6">
            <h2 className="text-[20px] font-semibold">{t("exam.submitTitle")}</h2>
            <p className="mt-2 text-[15px] text-ink-2">{t("exam.submitBody")}</p>
            {unanswered > 0 && <p className="mt-2 text-[15px] text-caution">{t("exam.unanswered", { n: unanswered })}</p>}
            <div className="mt-6 flex justify-end gap-3">
              <Button variant="ghost" onClick={() => setConfirm(false)} disabled={submitting}>
                {t("common.cancel")}
              </Button>
              <Button onClick={submit} disabled={submitting}>
                {t("common.submit")}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function TranslationItem({ index, source, value, onChange }: { index: number; source: string; value: string; onChange: (v: string) => void }) {
  const ref = useRef<HTMLTextAreaElement>(null);
  return (
    <li className="grid grid-cols-[28px_1fr] gap-3">
      <span className="tabular pt-1 text-[13px] text-ink-3">{index + 1}</span>
      <div className="flex flex-col gap-3">
        <p className="text-[18px] leading-snug">{source}</p>
        <TextArea ref={ref} rows={2} value={value} onChange={(e) => onChange(e.target.value)} lang="es" />
        <AccentBar target={ref} onInsert={onChange} />
      </div>
    </li>
  );
}

function WritingPart({ content, value, onChange }: { content: ExamContent; value: string; onChange: (v: string) => void }) {
  const { t } = useI18n();
  const ref = useRef<HTMLTextAreaElement>(null);
  const n = wordCount(value);
  return (
    <div className="flex flex-col gap-5">
      <p className="text-[19px] leading-relaxed">{content.writing.prompt}</p>
      {content.writing.guidance.length > 0 && (
        <ul className="flex flex-col gap-1.5 text-[15px] text-ink-2">
          {content.writing.guidance.map((g, i) => (
            <li key={i}>{g}</li>
          ))}
        </ul>
      )}
      <TextArea ref={ref} rows={14} value={value} onChange={(e) => onChange(e.target.value)} lang="es" aria-label={t("exam.parts.writing")} />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <AccentBar target={ref} onInsert={onChange} />
        <span className={cn("tabular text-[14px]", n >= content.writing.minWords ? "text-ink-2" : "text-ink-3")}>
          {t("exam.wordCount", { n })}, {t("exam.minWords", { n: content.writing.minWords }).toLowerCase()}
        </span>
      </div>
    </div>
  );
}
