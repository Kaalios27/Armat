"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "@/core/api";
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
  | { type: "wrong-module"; currentModule: ModuleKey | null; elapsed: number[] };

export interface RunnerProps {
  sessionId: string;
  initialModule: number;
  initialElapsed: number[];
  moduleMs: number;
  titles: Record<string, Localized>;
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

/** After this long without any input the timer pauses; idle time beyond the grace period is not counted. */
const IDLE_PAUSE_MS = 3 * 60_000;
const IDLE_GRACE_MS = 30_000;
const INPUT_EVENTS = ["pointerdown", "keydown", "wheel", "touchstart", "scroll"] as const;

export function StudyRunner({ sessionId, initialModule, initialElapsed, moduleMs, titles }: RunnerProps) {
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
  // Elapsed time per module as last reported by the server (page load or a resync).
  const serverElapsed = useRef(initialElapsed);
  // Stopwatch value at the last keyboard, pointer or scroll input. The time reported to the server never
  // runs more than the grace period past it, so an unattended screen does not use up the module.
  const lastInput = useRef(initialElapsed[initialModule] ?? 0);
  const counted = useCallback(() => Math.round(Math.min(watch.get(), lastInput.current + IDLE_GRACE_MS)), [watch]);

  // Saves the elapsed time of the current module (also when the page is hidden or closed).
  const beat = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (_final = false) => {
      void api.session.heartbeat(sessionId, module, counted()).catch(() => {});
    },
    [module, sessionId, counted],
  );

  // Heartbeat while studying; pause when the page is hidden.
  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => beat(), 15_000);
    return () => window.clearInterval(id);
  }, [running, beat]);

  // Pause after a stretch without input and roll the clock back to the last input plus the grace period.
  useEffect(() => {
    if (!running) return;
    lastInput.current = watch.get();
    const mark = () => {
      lastInput.current = watch.get();
    };
    for (const e of INPUT_EVENTS) window.addEventListener(e, mark, { capture: true, passive: true });
    const id = window.setInterval(() => {
      if (watch.get() - lastInput.current < IDLE_PAUSE_MS) return;
      watch.reset(lastInput.current + IDLE_GRACE_MS);
      setPaused(true);
    }, 5_000);
    return () => {
      window.clearInterval(id);
      for (const e of INPUT_EVENTS) window.removeEventListener(e, mark, { capture: true });
    };
  }, [running, watch]);
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
      const res = (await api.session.next(sessionId, module, counted())) as NextResponse;
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
        setElapsedByModule((prev) => prev.map((v, i) => (i === moduleIndex ? counted() : v)));
        setPhase(res.sessionComplete ? "complete" : "transition");
      } else if (res.type === "wrong-module") {
        // Another tab or device moved the session on: resume at the server's module with its elapsed time.
        serverElapsed.current = res.elapsed;
        setElapsedByModule(res.elapsed);
        setItem(null);
        setResult(null);
        if (res.currentModule === null) setPhase("complete");
        else {
          const idx = MODULES.indexOf(res.currentModule);
          if (idx === 0) {
            setModuleIndex(0);
            watch.reset(res.elapsed[0] ?? 0);
          } else {
            // The transition screen names the module just finished and starts moduleIndex + 1.
            setModuleIndex(idx - 1);
            setPhase("transition");
          }
        }
      }
    } catch {
      setError(true);
    } finally {
      inFlight.current = false;
      setBusy(false);
    }
  }, [module, moduleIndex, sessionId, watch, counted]);

  useEffect(() => {
    if (phase === "running" && !item && !exhausted && !busy && !error) void fetchNext();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, moduleIndex]);

  async function answer(body: Record<string, unknown>, then: "result" | "next") {
    if (!item) return;
    setBusy(true);
    try {
      const res = (await api.session.answer(sessionId, item.id, body, counted())) as unknown as { result: Record<string, unknown> };
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
      const res = (await api.session.complete(sessionId, module, true)) as NextResponse;
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
    watch.reset(serverElapsed.current[idx] ?? 0);
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
  // During the transition screen the header already points at the module that comes next.
  const activeIndex = phase === "transition" ? Math.min(moduleIndex + 1, MODULES.length - 1) : moduleIndex;

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
                aria-current={i === activeIndex && phase !== "complete" ? "step" : undefined}
                className={cn(
                  "whitespace-nowrap",
                  i === activeIndex && phase !== "complete" ? "font-medium text-ink" : "text-ink-3",
                  i !== activeIndex && "hidden sm:inline",
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
