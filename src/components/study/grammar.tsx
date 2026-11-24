"use client";

import { useRef, useState } from "react";
import type { GrammarExerciseType } from "@/content/types";
import { loc, type Localized } from "@/lib/i18n/types";
import { useI18n } from "../i18n";
import { Button, TextArea, cn } from "../ui/primitives";
import { AccentBar, categoryKey, Feedback } from "./shared";

export interface ExerciseView {
  type: GrammarExerciseType;
  prompt: Localized | null;
  es: string | null;
  tokens: string[] | null;
  options: string[] | null;
  blanks: number;
  hint?: Localized | null;
}

export type ExerciseValue = string | string[];

export function initialValue(ex: ExerciseView): ExerciseValue {
  if (ex.type === "fill" || ex.type === "distinguish") return Array.from({ length: ex.blanks }, () => "");
  if (ex.type === "correct") return ex.es ?? "";
  return "";
}

export function hasAnswer(ex: ExerciseView, v: ExerciseValue | undefined): boolean {
  if (v === undefined) return false;
  if (Array.isArray(v)) return v.some((x) => x.trim());
  if (ex.type === "correct") return v.trim() !== "" && v.trim() !== (ex.es ?? "").trim();
  return v.trim() !== "";
}

/** Input controls for any grammar exercise type (shared by sessions and exams). */
export function ExerciseInputs({
  ex,
  value,
  onChange,
  readOnly,
  perBlank,
  autoFocus = true,
}: {
  ex: ExerciseView;
  value: ExerciseValue;
  onChange: (v: ExerciseValue) => void;
  readOnly?: boolean;
  perBlank?: boolean[];
  autoFocus?: boolean;
}) {
  const { t } = useI18n();
  const blankRefs = useRef<Array<HTMLInputElement | null>>([]);
  const areaRef = useRef<HTMLTextAreaElement>(null);
  const [focused, setFocused] = useState(0);

  if (ex.type === "fill" || ex.type === "distinguish") {
    const parts = (ex.es ?? "").split("___");
    const vals = Array.isArray(value) ? value : [value];
    return (
      <div className="flex flex-col gap-4">
        <p className="text-[22px] leading-[2.1] tracking-[-0.005em]" lang="es">
          {parts.map((part, i) => (
            <span key={i}>
              {part}
              {i < parts.length - 1 && (
                <input
                  ref={(el) => {
                    blankRefs.current[i] = el;
                  }}
                  value={vals[i] ?? ""}
                  size={Math.max(5, (vals[i] ?? "").length + 2)}
                  onFocus={() => setFocused(i)}
                  onChange={(e) => onChange(vals.map((v, j) => (j === i ? e.target.value : v)))}
                  readOnly={readOnly}
                  autoFocus={autoFocus && i === 0}
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck={false}
                  lang="es"
                  aria-label={`${i + 1}`}
                  className={cn(
                    "mx-1 inline-block h-10 rounded-md border border-line-strong bg-surface px-2 text-center text-[20px] outline-none transition-colors focus:border-accent",
                    perBlank && (perBlank[i] ? "border-positive" : "border-negative"),
                  )}
                />
              )}
            </span>
          ))}
        </p>
        {!readOnly && <AccentBar target={() => blankRefs.current[focused] ?? null} onInsert={(v) => onChange(vals.map((x, j) => (j === focused ? v : x)))} />}
      </div>
    );
  }

  if (ex.type === "choose") {
    return (
      <div className="flex flex-col gap-4">
        {ex.es && (
          <p className="text-[22px] leading-snug" lang="es">
            {ex.es}
          </p>
        )}
        <div className="flex flex-wrap gap-2">
          {(ex.options ?? []).map((o) => (
            <button
              key={o}
              type="button"
              disabled={readOnly}
              onClick={() => onChange(o)}
              aria-pressed={value === o}
              className={cn(
                "h-11 rounded-lg border px-4 text-[17px] transition-colors",
                value === o ? "border-ink bg-ink text-bg" : "border-line-strong hover:bg-subtle",
              )}
            >
              {o}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (ex.type === "reconstruct") {
    const tokens = ex.tokens ?? [];
    const chosen: number[] = typeof value === "string" && value ? value.split("\u0001").map(Number).filter((n) => !Number.isNaN(n)) : [];
    const sentence = chosen.map((i) => tokens[i]).join(" ");
    const set = (next: number[]) => onChange(next.join("\u0001"));
    return (
      <div className="flex flex-col gap-4">
        <div className="min-h-14 rounded-lg border border-line-strong bg-surface px-3 py-2">
          <div className="flex flex-wrap gap-1.5">
            {chosen.map((i, pos) => (
              <button
                key={`${i}-${pos}`}
                type="button"
                disabled={readOnly}
                onClick={() => set(chosen.filter((_, p) => p !== pos))}
                className="h-9 rounded-md bg-subtle px-3 text-[17px]"
              >
                {tokens[i]}
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {tokens.map((tok, i) =>
            chosen.includes(i) ? null : (
              <button key={i} type="button" disabled={readOnly} onClick={() => set([...chosen, i])} className="h-9 rounded-md border border-line-strong px-3 text-[17px] hover:bg-subtle">
                {tok}
              </button>
            ),
          )}
        </div>
        {!readOnly && chosen.length > 0 && (
          <div>
            <Button variant="ghost" size="sm" onClick={() => set([])}>
              {t("study.reset")}
            </Button>
          </div>
        )}
        <input type="hidden" value={sentence} readOnly />
      </div>
    );
  }

  // correct / translate / write
  return (
    <div className="flex flex-col gap-3">
      {ex.type === "correct" && ex.es && (
        <p className="text-[20px] leading-snug text-ink-2" lang="es">
          {ex.es}
        </p>
      )}
      <TextArea ref={areaRef} rows={ex.type === "write" ? 3 : 2} value={typeof value === "string" ? value : ""} onChange={(e) => onChange(e.target.value)} readOnly={readOnly} autoFocus={autoFocus} lang="es" />
      {!readOnly && <AccentBar target={areaRef} onInsert={(v) => onChange(v)} />}
    </div>
  );
}

/** Reconstruct answers are stored as token indices; convert to the sentence for grading. */
export function answerForSubmit(ex: ExerciseView, v: ExerciseValue): ExerciseValue {
  if (ex.type === "reconstruct" && typeof v === "string") {
    return v ? v.split("\u0001").map((i) => ex.tokens?.[Number(i)] ?? "").join(" ") : "";
  }
  return v;
}

interface GrammarResult {
  correct: boolean;
  category: string | null;
  expected: string;
  accepted: string[];
  explanation: Localized;
  aiExplanation?: string | null;
  correction?: string | null;
  perBlank?: boolean[];
  unverified?: boolean;
  overridden?: boolean;
}

export function GrammarExerciseView({
  ex,
  conceptTitle,
  result,
  busy,
  onSubmit,
  onContinue,
  onOverride,
}: {
  ex: ExerciseView;
  conceptTitle: Localized;
  result: GrammarResult | null;
  busy: boolean;
  onSubmit: (body: { answer: ExerciseValue; responseMs: number }) => void;
  onContinue: () => void;
  onOverride: (answer: ExerciseValue) => void;
}) {
  const { t, lang } = useI18n();
  const shownAt = useRef(Date.now());
  const [value, setValue] = useState<ExerciseValue>(() => initialValue(ex));

  const submit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (busy || result || !hasAnswer(ex, value)) return;
    onSubmit({ answer: answerForSubmit(ex, value), responseMs: Date.now() - shownAt.current });
  };

  const label = (() => {
    if (result?.unverified && !result.correct) return t("study.categories.unverified");
    const k = categoryKey(result?.category);
    return k ? t(k) : null;
  })();

  return (
    <div className="enter">
      <div className="mb-6 flex flex-wrap items-baseline justify-between gap-2 text-[13px] text-ink-3">
        <span>{loc(conceptTitle, lang)}</span>
        <span className="text-ink-2">{t(`study.instructions.${ex.type}`)}</span>
      </div>
      {ex.prompt && (ex.type === "translate" || ex.type === "write") && <p className="mb-5 text-[22px] leading-snug tracking-[-0.01em]">{loc(ex.prompt, lang)}</p>}
      {ex.hint && ex.type !== "translate" && ex.type !== "write" && <p className="mb-4 text-[15px] text-ink-2">{loc(ex.hint, lang)}</p>}
      <form onSubmit={submit} className="flex flex-col gap-4">
        <ExerciseInputs ex={ex} value={value} onChange={setValue} readOnly={!!result} perBlank={result?.perBlank} />
        {!result && (
          <div className="flex justify-end">
            <Button type="submit" disabled={busy || !hasAnswer(ex, value)}>
              {busy ? t("study.checking") : t("common.check")}
            </Button>
          </div>
        )}
      </form>
      {result && (
        <Feedback
          correct={result.correct}
          overridden={result.overridden}
          label={label}
          expected={!result.correct || result.category === "alternative" || result.category === "style" ? result.correction || result.expected : null}
          onContinue={onContinue}
          onOverride={result.correct ? null : () => onOverride(answerForSubmit(ex, value))}
        >
          <p>{loc(result.explanation, lang)}</p>
          {result.unverified && !result.correct && <p className="text-[14px] text-ink-3">{t("study.unverified")}</p>}
        </Feedback>
      )}
    </div>
  );
}
