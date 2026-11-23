"use client";

import { useRef, useState } from "react";
import type { ConjDrill } from "@/lib/conjugation/drills";
import { personLabel, tenseName } from "@/lib/conjugation/labels";
import type { Person, Tense } from "@/lib/conjugation/types";
import { loc, type Localized } from "@/lib/i18n/types";
import { useI18n } from "../i18n";
import { Button, TextInput, cn } from "../ui/primitives";
import { AccentBar, categoryKey, Feedback } from "./shared";

interface ConjResult {
  correct: boolean;
  category: string | null;
  expected: string;
  explanation: Localized | null;
  note: Localized | null;
  perPerson?: Array<{ person: number; correct: boolean; expected: string; answer: string }>;
  overridden?: boolean;
}

/** Compact person labels for narrow tables (Ud. and Uds. are the standard abbreviations). */
function tableLabel(p: Person, tense: Tense): string {
  if (tense === "imper_aff" || tense === "imper_neg") return personLabel(p, tense);
  return ["yo", "tú", "él, ella, Ud.", "nosotros", "vosotros", "ellos, ellas, Uds."][p]!;
}

export function ParadigmTable({ verb, tense, forms }: { verb: string; tense: Tense; forms: Array<string | null> }) {
  return (
    <div className="min-w-0">
      <div className="mb-2 flex items-baseline gap-2">
        <span className="text-[16px] font-medium">{verb}</span>
        <span className="text-[13px] text-ink-3">{tenseName(tense)}</span>
      </div>
      <table className="w-full text-[15px]">
        <tbody>
          {forms.map((f, p) =>
            f === null ? null : (
              <tr key={p} className="border-t border-line">
                <td className="w-[52%] py-1.5 pr-3 text-[14px] text-ink-3">{tableLabel(p as Person, tense)}</td>
                <td className="py-1.5 font-medium">{f}</td>
              </tr>
            ),
          )}
        </tbody>
      </table>
    </div>
  );
}

export function ConjDrillView({
  drill,
  unitTitle,
  result,
  busy,
  onSubmit,
  onContinue,
  onOverride,
}: {
  drill: ConjDrill;
  unitTitle: Localized;
  result: ConjResult | null;
  busy: boolean;
  onSubmit: (body: { answer: string | string[]; responseMs: number }) => void;
  onContinue: () => void;
  onOverride: () => void;
}) {
  const { t, lang } = useI18n();
  const shownAt = useRef(Date.now());
  const [answer, setAnswer] = useState("");
  const [table, setTable] = useState<string[]>(() => (drill.persons ?? []).map(() => ""));
  const inputRef = useRef<HTMLInputElement>(null);
  const tableRefs = useRef<Array<HTMLInputElement | null>>([]);
  const [focused, setFocused] = useState(0);
  const focusTarget = () => (drill.type === "table" ? (tableRefs.current[focused] ?? null) : inputRef.current);

  const submit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (busy || result) return;
    onSubmit({ answer: drill.type === "table" ? table : answer, responseMs: Date.now() - shownAt.current });
  };

  const instruction =
    drill.type === "context" ? t("study.chooseTense") : drill.type === "error" ? t("study.correctTheVerb") : drill.type === "table" ? t("study.completeTable") : null;

  return (
    <div className="enter">
      <div className="mb-6 flex flex-wrap items-baseline justify-between gap-2 text-[13px] text-ink-3">
        <span>{loc(unitTitle, lang)}</span>
        {instruction && <span className="text-ink-2">{instruction}</span>}
      </div>

      {drill.type === "direct" || drill.type === "table" ? (
        <div>
          <div className="text-[40px] font-medium leading-tight tracking-[-0.02em]">{drill.verb}</div>
          <div className="mt-1 text-[14px] text-ink-3">{loc(drill.translation, lang)}</div>
          <div className="mt-5 flex flex-wrap gap-x-8 gap-y-2 text-[16px]">
            {drill.type === "direct" && drill.subject && <span className="font-medium">{drill.subject}</span>}
            {drill.type === "direct" && !drill.subject && drill.person !== null && <span className="font-medium">{personLabel(drill.person, drill.tense)}</span>}
            <span className="text-ink-2">{tenseName(drill.tense)}</span>
          </div>
        </div>
      ) : (
        <div>
          <p className="text-[24px] leading-snug tracking-[-0.01em]">
            {drill.before}{" "}
            {drill.type === "error" ? (
              <span className="text-negative underline decoration-negative/50 decoration-2 underline-offset-4">{drill.wrong}</span>
            ) : (
              <span className="mx-1 inline-block min-w-20 border-b-2 border-ink-3 align-baseline">&nbsp;</span>
            )}{" "}
            <span className="text-ink-3">({drill.verb})</span> {drill.after}
          </p>
          <div className="mt-3 flex flex-wrap gap-x-6 text-[14px] text-ink-3">
            <span>{loc(drill.translation, lang)}</span>
            {drill.showTense && <span>{tenseName(drill.tense)}</span>}
            {(drill.tense === "imper_aff" || drill.tense === "imper_neg") && drill.person !== null && <span>{personLabel(drill.person, drill.tense)}</span>}
          </div>
        </div>
      )}

      <form onSubmit={submit} className="mt-8 flex flex-col gap-3">
        {drill.type === "table" ? (
          <div className="flex flex-col divide-y divide-line border-y border-line">
            {(drill.persons ?? []).map((p, i) => {
              const row = result?.perPerson?.[i];
              return (
                <label key={p} className="grid grid-cols-[minmax(110px,40%)_1fr] items-center gap-3 py-2">
                  <span className="text-[15px] text-ink-2">{personLabel(p, drill.tense)}</span>
                  <div className="flex flex-col">
                    <TextInput
                      ref={(el) => {
                        tableRefs.current[i] = el;
                      }}
                      value={table[i] ?? ""}
                      onFocus={() => setFocused(i)}
                      onChange={(e) => setTable((prev) => prev.map((v, j) => (j === i ? e.target.value : v)))}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && i < table.length - 1 && !result) {
                          e.preventDefault();
                          tableRefs.current[i + 1]?.focus();
                        }
                      }}
                      readOnly={!!result}
                      autoFocus={i === 0}
                      lang="es"
                      className={cn(row && (row.correct ? "border-positive" : "border-negative"))}
                    />
                    {row && !row.correct && <span className="mt-1 text-[14px] text-positive">{row.expected}</span>}
                  </div>
                </label>
              );
            })}
          </div>
        ) : (
          <TextInput
            ref={inputRef}
            large
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            readOnly={!!result}
            autoFocus
            lang="es"
            className={cn(result && (result.correct ? "border-positive" : "border-negative"))}
          />
        )}
        {!result && (
          <div className="flex flex-wrap items-center justify-between gap-3">
            <AccentBar
              target={focusTarget}
              onInsert={(v) => {
                if (drill.type === "table") setTable((prev) => prev.map((x, j) => (j === focused ? v : x)));
                else setAnswer(v);
              }}
            />
            <Button type="submit" disabled={busy || (drill.type === "table" ? table.every((x) => !x.trim()) : !answer.trim())}>
              {t("common.check")}
            </Button>
          </div>
        )}
      </form>

      {result && (
        <Feedback
          correct={result.correct}
          overridden={result.overridden}
          label={result.correct ? null : (() => {
            const k = categoryKey(result.category);
            return k ? t(k) : null;
          })()}
          expected={drill.type === "table" ? null : result.expected}
          onContinue={onContinue}
          onOverride={result.correct ? null : onOverride}
        >
          {result.explanation && <p>{loc(result.explanation, lang)}</p>}
          {result.note && <p>{loc(result.note, lang)}</p>}
        </Feedback>
      )}
    </div>
  );
}
