"use client";

import Link from "next/link";
import { PageError, PageLoading, useLoad } from "@/components/data";
import { ExamStartButton } from "@/components/exam/exam-start";
import { useI18n } from "@/components/i18n";
import { ButtonLink, Note, Section, Stat, Tag } from "@/components/ui/primitives";
import { overviewData } from "@/core/services/stats";
import { daysBetween, formatDate, formatScore } from "@/lib/format";
import { loc } from "@/lib/i18n/types";

export default function OverviewPage() {
  const { t, lang } = useI18n();
  const { data: d, error, reload } = useLoad(() => overviewData(), [lang]);
  if (error) return <PageError onRetry={reload} />;
  if (!d) return <PageLoading />;
  const s = d.session;
  const plan = s?.plan;
  const exam = d.exam.current;

  const sessionAction = () => {
    if (!s) return null;
    if (s.status === "completed") return <Tag tone="positive">{t("overview.sessionComplete")}</Tag>;
    return (
      <ButtonLink href="/study" size="lg">
        {s.status === "planned" ? (d.firstDay ? t("overview.firstDay") : t("common.start")) : t("common.continue")}
      </ButtonLink>
    );
  };

  const examLine = () => {
    if (!exam) return <Note>{t("overview.examAfterFirst")}</Note>;
    const days = daysBetween(d.today, exam.weekOf);
    const name = exam.kind === "monthly" ? t("overview.monthlyExam", { n: exam.number }) : t("overview.weeklyExam", { n: exam.number });
    return (
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="text-[17px] font-medium">{name}</div>
          <div className="text-[14px] text-ink-2">
            {formatDate(exam.weekOf, lang)}
            {exam.status === "graded" ? "" : days === 0 ? `, ${t("overview.examAvailable").toLowerCase()}` : days === 1 ? `, ${t("overview.examTomorrow").toLowerCase()}` : `, ${t("overview.examIn", { n: days }).toLowerCase()}`}
          </div>
        </div>
        {exam.status === "graded" && exam.id ? (
          <Link href={`/exam/results?id=${exam.id}`} className="tabular text-[17px] font-medium hover:underline">
            {formatScore(exam.score)} / {exam.maxScore}
          </Link>
        ) : exam.canStart ? (
          <ExamStartButton weekOf={exam.weekOf} examId={exam.id} status={exam.status} label={exam.status === "in_progress" ? t("exam.continueExam") : t("exam.startExam")} />
        ) : null}
      </div>
    );
  };

  return (
    <div className="enter flex flex-col gap-10">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h1 className="text-[26px] font-semibold tracking-[-0.015em]">{formatDate(d.today, lang)}</h1>
        {d.stats.daysStudied > 0 && <span className="text-[14px] text-ink-3">{t("overview.daysStudied")}{t("common.colon")}{d.stats.daysStudied}</span>}
      </div>

      {d.dayKind === "exam" ? (
        <Section title={t("overview.exam")}>
          <div className="flex flex-col gap-4">
            <Note>{t("overview.examDay")}</Note>
            {examLine()}
          </div>
        </Section>
      ) : (
        <Section title={t("overview.session")} aside={s && s.minutes > 0 ? t("overview.studied", { n: s.minutes }) : undefined}>
          {plan && (
            <dl className="divide-y divide-line">
              <div className="grid grid-cols-[1fr_auto] items-center gap-4 py-3 sm:grid-cols-[180px_1fr_auto]">
                <dt className="text-[17px] font-medium">{t("modules.vocab")}</dt>
                <dd className="col-span-2 flex gap-6 text-[15px] text-ink-2 sm:col-span-1">
                  <span>
                    <span className="tabular text-ink">{plan.newWords}</span> {t("overview.newWords")}
                  </span>
                  <span>
                    <span className="tabular text-ink">{plan.due}</span> {t("overview.due")}
                  </span>
                </dd>
                <dd className="hidden text-[14px] text-ink-3 sm:block">{t("common.minutes", { n: 20 })}</dd>
              </div>
              <div className="grid grid-cols-[1fr_auto] items-center gap-4 py-3 sm:grid-cols-[180px_1fr_auto]">
                <dt className="text-[17px] font-medium">{t("modules.conjugation")}</dt>
                <dd className="col-span-2 flex items-center gap-3 text-[15px] text-ink-2 sm:col-span-1">
                  <span className="text-ink">{loc(plan.conjugation.title, lang)}</span>
                  <Tag tone={plan.conjugation.isNew ? "accent" : "neutral"}>{plan.conjugation.isNew ? t("common.new") : t("common.consolidation")}</Tag>
                </dd>
                <dd className="hidden text-[14px] text-ink-3 sm:block">{t("common.minutes", { n: 20 })}</dd>
              </div>
              <div className="grid grid-cols-[1fr_auto] items-center gap-4 py-3 sm:grid-cols-[180px_1fr_auto]">
                <dt className="text-[17px] font-medium">{t("modules.grammar")}</dt>
                <dd className="col-span-2 flex items-center gap-3 text-[15px] text-ink-2 sm:col-span-1">
                  <span className="text-ink">{loc(plan.grammar.title, lang) || "–"}</span>
                  {plan.grammar.title && <Tag tone={plan.grammar.isNew ? "accent" : "neutral"}>{plan.grammar.isNew ? t("common.new") : t("common.revision")}</Tag>}
                </dd>
                <dd className="hidden text-[14px] text-ink-3 sm:block">{t("common.minutes", { n: 20 })}</dd>
              </div>
            </dl>
          )}
          <div className="mt-6 flex flex-wrap items-center gap-4">
            {sessionAction()}
            {s?.status === "completed" && <span className="text-[15px] text-ink-2">{t("overview.sessionDone")}</span>}
          </div>
          {plan?.grammar.needsAi && (
            <div className="mt-4">
              <Note tone="caution">{t("overview.grammarNeedsAi")}</Note>
            </div>
          )}
        </Section>
      )}

      {d.exam.late && (
        <Section title={t("overview.exam")}>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Note>{t("overview.lateExam")}</Note>
            <ExamStartButton weekOf={d.exam.late.weekOf} examId={d.exam.late.id} status={d.exam.late.status} label={t("overview.takeNow")} variant="secondary" />
          </div>
        </Section>
      )}

      {d.dayKind !== "exam" && <Section title={t("overview.exam")}>{examLine()}</Section>}

      <Section title={t("nav.progress")}>
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
          <Stat label={t("overview.level")} value={d.level.label === "Pre-A1" ? t("overview.preA1") : t("overview.levelEstimate", { level: d.level.label })} />
          <Stat label={t("overview.wordsLearned")} value={d.stats.wordsLearned} />
          <Stat label={t("overview.conceptsMastered")} value={`${d.stats.conceptsMastered} / ${d.stats.conceptsTotal}`} />
          <Stat label={t("overview.unitsMastered")} value={`${d.stats.unitsMastered} / ${d.stats.unitsTotal}`} />
        </div>
      </Section>

    </div>
  );
}
