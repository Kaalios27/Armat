"use client";

import { useState } from "react";
import { api } from "@/core/api";
import { WRITING_CRITERIA, WRITING_CRITERION_MAX } from "@/core/exam/grade";
import type { MessageKey } from "@/lib/i18n/messages";
import { useI18n } from "../i18n";
import { Button, cn } from "../ui/primitives";

/** The learner scores the writing on the rubric after comparing it with the model answer. */
export function WritingAssessment({
  examId,
  saved,
  onSaved,
}: {
  examId: string;
  saved: Array<{ key: string; score: number }> | null;
  onSaved: () => void;
}) {
  const { t } = useI18n();
  const [scores, setScores] = useState<Record<string, number | null>>(() =>
    Object.fromEntries(WRITING_CRITERIA.map((k) => [k, saved?.find((c) => c.key === k)?.score ?? null])),
  );
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);
  const complete = WRITING_CRITERIA.every((k) => scores[k] !== null);
  const total = WRITING_CRITERIA.reduce((s, k) => s + (scores[k] ?? 0), 0);

  async function save() {
    setBusy(true);
    setFailed(false);
    try {
      await api.exam.assessWriting(examId, scores as Record<string, number>);
      onSaved();
    } catch {
      setFailed(true);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col gap-4 border-t border-line pt-5">
      <div>
        <h3 className="text-[16px] font-medium">{t("exam.selfAssessment")}</h3>
        <p className="mt-1 text-[14px] leading-relaxed text-ink-2">{t("exam.selfAssessmentNote")}</p>
      </div>
      <div className="flex flex-col divide-y divide-line border-y border-line">
        {WRITING_CRITERIA.map((k) => (
          <div key={k} className="grid gap-2 py-3 sm:grid-cols-[1fr_auto] sm:items-center sm:gap-6">
            <div>
              <div className="text-[15px] font-medium">{t(`exam.criteria.${k}` as MessageKey)}</div>
              <div className="text-[13px] leading-snug text-ink-3">{t(`exam.criteriaHelp.${k}` as MessageKey)}</div>
            </div>
            <div className="flex gap-1" role="radiogroup" aria-label={t(`exam.criteria.${k}` as MessageKey)}>
              {Array.from({ length: WRITING_CRITERION_MAX + 1 }, (_, v) => (
                <button
                  key={v}
                  type="button"
                  role="radio"
                  aria-checked={scores[k] === v}
                  onClick={() => setScores((s) => ({ ...s, [k]: v }))}
                  className={cn(
                    "tabular h-10 w-10 rounded-md border text-[15px] transition-colors",
                    scores[k] === v ? "border-ink bg-ink text-bg" : "border-line-strong text-ink-2 hover:bg-subtle",
                  )}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <Button onClick={save} disabled={!complete || busy}>
          {saved ? t("exam.updateAssessment") : t("exam.saveAssessment")}
        </Button>
        <span className="tabular text-[15px] text-ink-2">
          {total} / {WRITING_CRITERIA.length * WRITING_CRITERION_MAX}
        </span>
        {saved && <span className="text-[14px] text-ink-3">{t("exam.assessed")}</span>}
        {failed && <span className="text-[14px] text-negative">{t("common.error")}</span>}
      </div>
    </div>
  );
}
