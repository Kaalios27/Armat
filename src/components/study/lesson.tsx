"use client";

import type { LessonContent } from "@/content/types";
import type { Tense } from "@/lib/conjugation/types";
import { useI18n } from "../i18n";
import { Button } from "../ui/primitives";
import { ParadigmTable } from "./conj";
import { useKey } from "./shared";

export function LessonBody({ content, tables, mode }: { content: LessonContent; tables?: Array<{ verb: string; tense: Tense; forms: Array<string | null> }>; mode: "full" | "recap" }) {
  const { t } = useI18n();
  return (
    <div className="flex flex-col gap-7">
      <p className="text-[18px] leading-relaxed">{content.summary}</p>
      {content.rules.length > 0 && (
        <div>
          <h3 className="mb-2 text-[14px] font-medium text-ink-2">{t("study.rules")}</h3>
          <ul className="flex flex-col gap-2">
            {content.rules.map((r, i) => (
              <li key={i} className="grid grid-cols-[18px_1fr] text-[16px] leading-relaxed">
                <span className="text-ink-3">{i + 1}</span>
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      {tables && tables.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-3">
          {tables.map((tb) => (
            <ParadigmTable key={tb.verb} verb={tb.verb} tense={tb.tense} forms={tb.forms} />
          ))}
        </div>
      )}
      {content.examples.length > 0 && (
        <div>
          <h3 className="mb-2 text-[14px] font-medium text-ink-2">{t("study.examples")}</h3>
          <ul className="flex flex-col gap-3">
            {content.examples.map((e, i) => (
              <li key={i}>
                <p className="text-[17px] leading-relaxed" lang="es">
                  {e.es}
                </p>
                <p className="text-[15px] leading-relaxed text-ink-2">{e.tr}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
      {mode === "full" && content.exceptions.length > 0 && (
        <div>
          <h3 className="mb-2 text-[14px] font-medium text-ink-2">{t("study.exceptions")}</h3>
          <ul className="flex flex-col gap-2 text-[16px] leading-relaxed">
            {content.exceptions.map((x, i) => (
              <li key={i}>{x}</li>
            ))}
          </ul>
        </div>
      )}
      {content.pitfalls.length > 0 && (
        <div>
          <h3 className="mb-2 text-[14px] font-medium text-ink-2">{t("study.pitfalls")}</h3>
          <ul className="flex flex-col gap-2 text-[16px] leading-relaxed">
            {content.pitfalls.map((x, i) => (
              <li key={i}>{x}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export function LessonView({
  title,
  content,
  tables,
  mode,
  busy,
  onContinue,
}: {
  title: string;
  content: LessonContent;
  tables?: Array<{ verb: string; tense: Tense; forms: Array<string | null> }>;
  mode: "full" | "recap";
  busy: boolean;
  onContinue: () => void;
}) {
  const { t } = useI18n();
  useKey(["Enter"], (e) => {
    e.preventDefault();
    if (!busy) onContinue();
  });
  return (
    <div className="enter">
      <div className="mb-2 text-[13px] font-medium text-accent">{mode === "full" ? t("study.lesson") : t("study.recap")}</div>
      <h2 className="mb-6 text-[28px] font-semibold leading-tight tracking-[-0.015em]">{title}</h2>
      <LessonBody content={content} tables={tables} mode={mode} />
      <div className="mt-10">
        <Button size="lg" onClick={onContinue} disabled={busy}>
          {t("study.startExercises")}
        </Button>
      </div>
    </div>
  );
}
