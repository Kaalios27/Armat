"use client";

import Link from "next/link";
import { PageError, PageLoading, useLoad } from "@/components/data";
import { ExamStartButton } from "@/components/exam/exam-start";
import { useI18n } from "@/components/i18n";
import { Note, PageTitle, Section, Tag } from "@/components/ui/primitives";
import { EXAM_PARTS, PART_MINUTES, PART_POINTS } from "@/core/exam/types";
import { examOverview } from "@/core/services/exam";
import { formatDate, formatScore } from "@/lib/format";

export default function ExamOverviewPage() {
  const { t, lang } = useI18n();
  const { data: o, error, reload } = useLoad(() => examOverview(), []);
  if (error) return <PageError onRetry={reload} />;
  if (!o) return <PageLoading />;
  const name = (kind: string, n: number) => (kind === "monthly" ? t("overview.monthlyExam", { n }) : t("overview.weeklyExam", { n }));

  return (
    <div className="enter flex flex-col gap-10">
      <PageTitle>{t("exam.title")}</PageTitle>

      <Section title={o.current ? name(o.current.kind, o.current.number) : t("exam.title")}>
        {!o.current ? (
          <Note>{t("overview.examAfterFirst")}</Note>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="text-[17px]">{formatDate(o.current.weekOf, lang)}</div>
                {o.current.kind === "monthly" && <p className="mt-1 text-[14px] text-ink-2">{t("exam.monthlyNote")}</p>}
              </div>
              {o.current.status === "graded" && o.current.id ? (
                <Link href={`/exam/results?id=${o.current.id}`} className="tabular text-[17px] font-medium hover:underline">
                  {formatScore(o.current.score)} / {o.current.maxScore}
                </Link>
              ) : o.current.status === "submitted" && o.current.id ? (
                <Link href={`/exam/results?id=${o.current.id}`} className="text-[15px] text-ink-2 hover:text-ink">
                  {t("exam.grading")}
                </Link>
              ) : o.current.canStart ? (
                <ExamStartButton
                  weekOf={o.current.weekOf}
                  examId={o.current.id}
                  status={o.current.status}
                  label={o.current.status === "in_progress" ? t("exam.continueExam") : t("exam.startExam")}
                />
              ) : (
                <span className="text-[15px] text-ink-2">{t("exam.availableOn", { date: formatDate(o.current.weekOf, lang, { weekday: "long", day: "numeric", month: "long" }) })}</span>
              )}
            </div>
          </div>
        )}
      </Section>

      {o.late && (
        <Section title={name(o.late.kind, o.late.number)}>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-[15px] text-ink-2">{formatDate(o.late.weekOf, lang)}</span>
              <Tag tone="caution">{t("exam.late")}</Tag>
            </div>
            <ExamStartButton weekOf={o.late.weekOf} examId={o.late.id} status={o.late.status} label={t("overview.takeNow")} variant="secondary" />
          </div>
        </Section>
      )}

      <Section title={t("exam.structure")}>
        <table className="w-full text-[15px]">
          <tbody>
            {EXAM_PARTS.map((p, i) => (
              <tr key={p} className="border-b border-line last:border-0">
                <td className="w-8 py-2.5 text-ink-3">{i + 1}</td>
                <td className="py-2.5">{t(`exam.parts.${p}`)}</td>
                <td className="tabular py-2.5 text-right text-ink-2">{t("common.minutes", { n: PART_MINUTES[p] })}</td>
                <td className="tabular w-24 py-2.5 text-right text-ink-2">{t("exam.points", { n: PART_POINTS[p] })}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Section>

      <Section title={t("exam.history")}>
        {o.history.length === 0 ? (
          <p className="text-[15px] text-ink-2">{t("exam.noHistory")}</p>
        ) : (
          <ul className="divide-y divide-line">
            {o.history.map((h) => (
              <li key={h.id}>
                <Link href={`/exam/results?id=${h.id}`} className="grid grid-cols-[1fr_auto] items-center gap-4 py-3 hover:bg-subtle/60 sm:grid-cols-[200px_1fr_auto]">
                  <span className="text-[15px]">{formatDate(h.weekOf, lang, { day: "numeric", month: "long", year: "numeric" })}</span>
                  <span className="hidden text-[15px] text-ink-2 sm:block">{name(h.kind, h.number)}</span>
                  <span className="tabular text-[15px] font-medium">{h.status === "graded" ? `${formatScore(h.score)} / ${h.maxScore}` : t("exam.grading")}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Section>
    </div>
  );
}
