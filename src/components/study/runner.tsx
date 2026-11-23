"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { LessonContent } from "@/content/types";
import type { ConjDrill } from "@/lib/conjugation/drills";
import type { Tense } from "@/lib/conjugation/types";
import { formatClock } from "@/lib/format";
import { loc, type Localized } from "@/lib/i18n/types";
import { useI18n } from "../i18n";
import { Bar, Button, ButtonLink, cn } from "../ui/primitives";
import { ConjDrillView } from "./conj";
import { GrammarExerciseView, type ExerciseView } from "./grammar";
import { LessonView } from "./lesson";
import { VocabCard, VocabIntro, type WordPayload } from "./vocab";

type ModuleKey = "vocab" | "conjugation" | "grammar";
const MODULES: ModuleKey[] = ["vocab", "conjugation", "grammar"];

interface Item {
  id: string;
  module: ModuleKey;
  kind: string;
  seq: number;
  payload: Record<string, unknown>;
  status: string;
  result: Record<string, unknown> | null;
}

type NextResponse =
  | { type: "item"; item: Item; elapsedMs: number; moduleMs: number }
  | { type: "module-complete"; module: ModuleKey; nextModule: ModuleKey | null; sessionComplete: boolean }
  | { type: "exhausted"; elapsedMs: number }
  | { type: "wrong-module"; currentModule: ModuleKey | null };

export interface RunnerProps {
  sessionId: string;
  initialModule: number;
  initialElapsed: number[];
  moduleMs: number;
  titles: Record<string, Localized>;
  aiEnabled: boolean;
}

/** Stopwatch based on performance.now(), immune to clock changes. */
function useStopwatch(initial: number, running: boolean) {
  const base = useRef(initial);
  const start = useRef<number | null>(null);
  const [, setTick] = useState(0);
  useEffect(() => {
    if (!running) return;
    start.current = performance.now();
    const id = window.setInterval(() => setTick((t) => t + 1), 500);
    return () => {
      window.clearInterval(id);
      if (start.current !== null) base.current += performance.now() - start.current;
      start.current = null;
    };
  }, [running]);
  const get = useCallback(() => base.current + (start.current !== null ? performance.now() - start.current : 0), []);
  const reset = useCallback((ms: number) => {
    base.current = ms;
    if (start.current !== null) start.current = performance.now();
  }, []);
  // Stable identity: callers use it in effect dependencies (heartbeat interval).
  return useMemo(() => ({ get, reset }), [get, reset]);
}

async function post<T>(url: string, body: unknown): Promise<T> {
  const res = await fetch(url, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return (await res.json()) as T;
}

export function StudyRunner({ sessionId, initialModule, initialElapsed, moduleMs, titles, aiEnabled }: RunnerProps) {
  const { t, lang } = useI18n();
  const router = useRouter();
  const [moduleIndex, setModuleIndex] = useState(initialModule);
  const [phase, setPhase] = useState<"running" | "transition" | "complete">(initialModule >= MODULES.length ? "complete" : "running");
  const [item, setItem] = useState<Item | null>(null);
  const [result, setResult] = useState<Record<string, unknown> | null>(null);
  const [busy, setBusy] = useState(false);
  const [paused, setPaused] = useState(false);
  const [exhausted, setExhausted] = useState(false);
  const [error, setError] = useState(false);
  const [elapsedByModule, setElapsedByModule] = useState(initialElapsed);
  const module = MODULES[Math.min(moduleIndex, MODULES.length - 1)]!;
  const running = phase === "running" && !paused && !error;
  const watch = useStopwatch(initialElapsed[initialModule] ?? 0, running);
  // The stopwatch re-renders every 500 ms while running; read the value during render.
  const now = watch.get();
  const inFlight = useRef(false);

  const beat = useCallback(
    (beacon = false) => {
      const body = JSON.stringify({ module, elapsedMs: Math.round(watch.get()) });
      const url = `/api/session/${sessionId}/heartbeat`;
      if (beacon && navigator.sendBeacon) navigator.sendBeacon(url, body);
      else void fetch(url, { method: "POST", headers: { "content-type": "application/json" }, body, keepalive: true }).catch(() => {});
    },
    [module, sessionId, watch],
  );

  // Heartbeat while studying; pause when the page is hidden.
  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => beat(), 15_000);
    return () => window.clearInterval(id);
  }, [running, beat]);
  useEffect(() => {
    const onHide = () => {
      if (document.visibilityState === "hidden") {
        beat(true);
        if (phase === "running") setPaused(true);
      }
    };
    const onPageHide = () => beat(true);
    document.addEventListener("visibilitychange", onHide);
    window.addEventListener("pagehide", onPageHide);
    return () => {
      document.removeEventListener("visibilitychange", onHide);
      window.removeEventListener("pagehide", onPageHide);
    };
  }, [beat, phase]);

  const fetchNext = useCallback(async () => {
    if (inFlight.current) return;
    inFlight.current = true;
    setBusy(true);
    setError(false);
    try {
      const res = await post<NextResponse>(`/api/session/${sessionId}/next`, { module, elapsedMs: Math.round(watch.get()) });
      if (res.type === "item") {
        setItem(res.item);
        setResult(res.item.status === "done" ? res.item.result : null);
        setExhausted(false);
      } else if (res.type === "exhausted") {
        setItem(null);
        setExhausted(true);
      } else if (res.type === "module-complete") {
        setItem(null);
        setExhausted(false);
        setElapsedByModule((prev) => prev.map((v, i) => (i === moduleIndex ? watch.get() : v)));
        setPhase(res.sessionComplete ? "complete" : "transition");
      } else if (res.type === "wrong-module") {
        if (res.currentModule === null) setPhase("complete");
        else {
          const idx = MODULES.indexOf(res.currentModule);
          setModuleIndex(idx);
          watch.reset(0);
          setPhase("transition");
        }
      }
    } catch {
      setError(true);
    } finally {
      inFlight.current = false;
      setBusy(false);
    }
  }, [module, moduleIndex, sessionId, watch]);

  useEffect(() => {
    if (phase === "running" && !item && !exhausted && !busy && !error) void fetchNext();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, moduleIndex]);

  async function answer(body: Record<string, unknown>, then: "result" | "next") {
    if (!item) return;
    setBusy(true);
    try {
      const res = await post<{ result: Record<string, unknown> }>(`/api/session/${sessionId}/answer`, { itemId: item.id, elapsedMs: Math.round(watch.get()), ...body });
      if (then === "next") {
        setItem(null);
        setResult(null);
        setBusy(false);
        await fetchNext();
        return;
      }
      setResult(res.result);
    } catch {
      setError(true);
    } finally {
      setBusy(false);
    }
  }

  async function next() {
    setItem(null);
    setResult(null);
    await fetchNext();
  }

  async function finishModule() {
    setBusy(true);
    try {
      const res = await post<NextResponse>(`/api/session/${sessionId}/complete`, { module, exhausted: true });
      if (res.type === "module-complete") setPhase(res.sessionComplete ? "complete" : "transition");
    } catch {
      setError(true);
    } finally {
      setBusy(false);
      setExhausted(false);
    }
  }

  function startNextModule() {
    const idx = Math.min(moduleIndex + 1, MODULES.length - 1);
    setModuleIndex(idx);
    watch.reset(initialElapsed[idx] && idx === initialModule ? initialElapsed[idx]! : 0);
    setItem(null);
    setResult(null);
    setPhase("running");
  }

  function exit() {
    beat(true);
    router.push("/");
  }

  const remaining = Math.max(0, moduleMs - now);
  const timeUp = now >= moduleMs;

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="sticky top-0 z-10 border-b border-line bg-bg">
        <div className="mx-auto flex h-14 max-w-[760px] items-center gap-4 px-4 sm:px-6">
          <Button variant="ghost" size="sm" onClick={exit} className="-ml-3">
            {t("common.exit")}
          </Button>
          <nav className="flex flex-1 items-center justify-center gap-4 text-[14px] sm:gap-6" aria-label="Modules">
            {MODULES.map((m, i) => (
              <span
                key={m}
                aria-current={i === moduleIndex && phase !== "complete" ? "step" : undefined}
                className={cn(
                  "whitespace-nowrap",
                  i === moduleIndex && phase !== "complete" ? "font-medium text-ink" : i < moduleIndex || phase === "complete" ? "text-ink-3" : "text-ink-3",
                  i !== moduleIndex && "hidden sm:inline",
                )}
              >
                {t(`modules.${m}`)}
              </span>
            ))}
          </nav>
          {phase === "running" ? (
            <div className="flex items-center gap-2">
              <span className={cn("tabular w-14 text-right font-mono text-[15px]", timeUp ? "text-caution" : "text-ink-2")} aria-label="Time remaining">
                {formatClock(remaining)}
              </span>
              <Button variant="ghost" size="sm" onClick={() => setPaused(true)} className="-mr-3">
                {t("common.pause")}
              </Button>
            </div>
          ) : (
            <span className="w-24" />
          )}
        </div>
        {phase === "running" && <Bar value={now / moduleMs} className="h-[2px] rounded-none" tone="ink" />}
      </header>

      <main className="mx-auto w-full max-w-[680px] flex-1 px-4 pb-20 pt-10 sm:px-6 sm:pt-14">
        {error && (
          <div className="mb-6 flex items-center justify-between gap-4 border-b border-line pb-4">
            <span className="text-[15px] text-caution">{t("common.offline")}</span>
            <Button variant="secondary" size="sm" onClick={() => (item ? setError(false) : void fetchNext())}>
              {t("common.retry")}
            </Button>
          </div>
        )}

        {phase === "transition" && (
          <div className="enter flex flex-col gap-6 pt-10">
            <p className="text-[15px] text-ink-3">{t("study.moduleComplete", { module: t(`modules.${MODULES[Math.max(0, moduleIndex)]!}`) })}</p>
            <h2 className="text-[30px] font-semibold tracking-[-0.02em]">{t(`modules.${MODULES[Math.min(moduleIndex + 1, 2)]!}`)}</h2>
            <div>
              <Button size="lg" onClick={startNextModule} autoFocus>
                {t("common.continue")}
              </Button>
            </div>
          </div>
        )}

        {phase === "complete" && (
          <div className="enter flex flex-col gap-8 pt-10">
            <h2 className="text-[30px] font-semibold tracking-[-0.02em]">{t("study.sessionComplete")}</h2>
            <dl className="divide-y divide-line border-y border-line">
              {MODULES.map((m, i) => (
                <div key={m} className="flex justify-between py-3 text-[16px]">
                  <dt>{t(`modules.${m}`)}</dt>
                  <dd className="tabular text-ink-2">{t("common.minutes", { n: Math.round((elapsedByModule[i] ?? 0) / 60_000) })}</dd>
                </div>
              ))}
            </dl>
            <div>
              <ButtonLink href="/" size="lg">
                {t("study.backToOverview")}
              </ButtonLink>
            </div>
          </div>
        )}

        {phase === "running" && exhausted && (
          <div className="enter flex flex-col gap-6 pt-10">
            <p className="text-[17px] text-ink-2">{t("study.nothingLeft")}</p>
            <div>
              <Button size="lg" onClick={finishModule} disabled={busy}>
                {t("study.finishModule")}
              </Button>
            </div>
          </div>
        )}

        {phase === "running" && item && (
          <div key={item.id}>
            {item.kind === "vocab-intro" && <VocabIntro word={item.payload as unknown as WordPayload} busy={busy} onContinue={() => answer({ action: "seen" }, "next")} />}
            {item.kind === "vocab-card" && (
              <VocabCard
                card={item.payload as never}
                result={result as never}
                busy={busy}
                onSubmit={(b) => answer(b, "result")}
                onContinue={next}
                onOverride={() => answer({ override: true }, "result")}
              />
            )}
            {(item.kind === "conj-lesson" || item.kind === "grammar-lesson") && (
              <LessonView
                title={loc(titles[String(item.payload.conceptId)], lang)}
                content={item.payload.content as LessonContent}
                tables={item.payload.tables as Array<{ verb: string; tense: Tense; forms: Array<string | null> }>}
                mode={item.payload.mode as "full" | "recap"}
                busy={busy}
                onContinue={() => answer({ action: "continue" }, "next")}
              />
            )}
            {item.kind === "conj-drill" && (
              <ConjDrillView
                drill={item.payload.drill as ConjDrill}
                unitTitle={item.payload.unitTitle as Localized}
                result={result as never}
                busy={busy}
                onSubmit={(b) => answer(b, "result")}
                onContinue={next}
                onOverride={() => answer({ override: true }, "result")}
              />
            )}
            {item.kind === "grammar-exercise" && (
              <GrammarExerciseView
                ex={item.payload as unknown as ExerciseView}
                conceptTitle={item.payload.conceptTitle as Localized}
                result={result as never}
                busy={busy}
                aiEnabled={aiEnabled}
                onSubmit={(b) => answer(b, "result")}
                onContinue={next}
                onOverride={(a) => answer({ override: true, answer: a }, "result")}
              />
            )}
            {timeUp && result && <p className="mt-6 text-[14px] text-ink-3">{t("study.timeUp")}</p>}
          </div>
        )}

        {phase === "running" && !item && !exhausted && !error && <div className="pt-10 text-[15px] text-ink-3">{busy ? t("common.loading") : ""}</div>}
      </main>

      {paused && phase === "running" && (
        <div className="reveal fixed inset-0 z-30 flex items-center justify-center bg-bg/95 px-6" role="dialog" aria-modal="true">
          <div className="flex w-full max-w-[360px] flex-col gap-6">
            <div>
              <h2 className="text-[26px] font-semibold tracking-[-0.015em]">{t("common.paused")}</h2>
              <p className="mt-2 text-[15px] text-ink-2">{t("study.exitConfirm")}</p>
            </div>
            <div className="flex gap-3">
              <Button size="lg" onClick={() => setPaused(false)} autoFocus>
                {t("common.resume")}
              </Button>
              <Button size="lg" variant="secondary" onClick={exit}>
                {t("common.exit")}
              </Button>
            </div>
          </div>
        </div>
      )}
      <Link href="/" className="sr-only">
        {t("study.backToOverview")}
      </Link>
    </div>
  );
}
