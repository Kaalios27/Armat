"use client";

import Link from "next/link";
import { ConsistencyGrid, LineChart } from "@/components/charts";
import { PageError, PageLoading, useLoad } from "@/components/data";
import { useI18n } from "@/components/i18n";
import { Bar, PageTitle, Section, Stat } from "@/components/ui/primitives";
import { progressData, vocabularyData } from "@/core/services/stats";
import { formatScore, formatShortDate } from "@/lib/format";
import type { MessageKey } from "@/lib/i18n/messages";

export default function ProgressPage() {
  const { t, lang } = useI18n();
  const { data, error, reload } = useLoad(() => Promise.all([progressData(lang), vocabularyData(lang)]), [lang]);
  if (error) return <PageError onRetry={reload} />;
  if (!data) return <PageLoading />;
  const [d, v] = data;
  const weekly = d.exams.filter((e) => e.kind === "weekly");
  const monthly = d.exams.filter((e) => e.kind === "monthly");
  const retentionPoints = d.weeks.map((w) => ({ label: formatShortDate(w.week, lang), value: w.retention }));
  const hasRetention = retentionPoints.filter((p) => p.value !== null).length >= 2;

  return (
    <div className="enter flex flex-col gap-10">
      <PageTitle>{t("progress.title")}</PageTitle>

      <Section title={t("progress.consistency")} aside={`${t("progress.sessionsCompleted")}${t("common.colon")}${d.sessionsCompleted}`}>
        <ConsistencyGrid days={d.days} today={d.today} />
      </Section>

      <Section title={t("progress.vocabulary")}>
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
          <Stat label={t("vocab.learned")} value={v.learned} />
          <Stat label={t("vocab.mature")} value={v.mature} />
          <Stat label={t("vocab.retention")} value={v.retention === null ? "–" : `${Math.round(v.retention * 100)}%`} />
          <Stat label={t("progress.dueTomorrow")} value={d.dueTomorrow} />
        </div>
        {hasRetention && (
          <div className="mt-6">
            <div className="mb-2 text-[13px] text-ink-3">{t("progress.retentionByWeek")}</div>
            <LineChart points={retentionPoints} max={1} format={(x) => `${Math.round(x * 100)}%`} />
          </div>
        )}
      </Section>

      <Section title={t("progress.exams")}>
        {weekly.length === 0 ? (
          <p className="text-[15px] text-ink-2">{t("exam.noHistory")}</p>
        ) : (
          <div className="flex flex-col gap-6">
            {weekly.length >= 2 && <LineChart points={weekly.map((e) => ({ label: formatShortDate(e.weekOf, lang), value: e.score === null ? null : (e.score / e.maxScore) * 100 }))} max={100} format={(x) => String(Math.round(x))} />}
            <table className="w-full text-[15px]">
              <thead>
                <tr className="text-left text-[13px] text-ink-3">
                  <th className="py-2 font-normal">{t("progress.date")}</th>
                  {(["dictation", "conjugation", "grammar", "translation", "writing"] as const).map((p) => (
                    <th key={p} className="hidden py-2 text-right font-normal sm:table-cell">
                      {t(`exam.parts.${p}`)}
                    </th>
                  ))}
                  <th className="py-2 text-right font-normal">{t("exam.score")}</th>
                </tr>
              </thead>
              <tbody>
                {weekly.map((e) => (
                  <tr key={e.id} className="border-t border-line">
                    <td className="py-2">
                      <Link href={`/exam/results?id=${e.id}`} className="hover:underline">
                        {formatShortDate(e.weekOf, lang)}
                      </Link>
                    </td>
                    {(["dictation", "conjugation", "grammar", "translation", "writing"] as const).map((p) => (
                      <td key={p} className="tabular hidden py-2 text-right text-ink-2 sm:table-cell">
                        {formatScore(e.sectionScores?.[p] ?? null)}
                      </td>
                    ))}
                    <td className="tabular py-2 text-right font-medium">{formatScore(e.score)}{e.maxScore < 100 && <span className="text-ink-3"> / {e.maxScore}</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Section>

      <Section title={t("progress.monthly")}>
        {monthly.length === 0 ? (
          <p className="text-[15px] text-ink-2">{t("exam.noHistory")}</p>
        ) : (
          <ul className="divide-y divide-line">
            {monthly.map((e) => (
              <li key={e.id} className="flex justify-between py-2 text-[15px]">
                <Link href={`/exam/results?id=${e.id}`} className="hover:underline">
                  {t("overview.monthlyExam", { n: e.number })}, {formatShortDate(e.weekOf, lang)}
                </Link>
                <span className="tabular font-medium">{formatScore(e.score)}{e.maxScore < 100 && <span className="text-ink-3"> / {e.maxScore}</span>}</span>
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section title={t("progress.grammar")}>
        <div className="grid gap-x-10 gap-y-3 sm:grid-cols-2">
          {d.chapters.map((ch) => {
            const introduced = ch.concepts.filter((c) => c.status !== "locked");
            const avg = introduced.length ? introduced.reduce((s, c) => s + c.mastery, 0) / ch.concepts.length : 0;
            return (
              <div key={ch.id} className="grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1.5">
                <span className="text-[15px]">{ch.title[lang]}</span>
                <span className="tabular text-[13px] text-ink-3">
                  {ch.concepts.filter((c) => c.status === "mastered").length}/{ch.concepts.length}
                </span>
                <span className="col-span-2">
                  <Bar value={avg} />
                </span>
              </div>
            );
          })}
        </div>
      </Section>

      <Section title={t("progress.conjugation")}>
        <div className="grid gap-x-10 gap-y-3 sm:grid-cols-2">
          {d.units
            .filter((u) => u.status !== "locked")
            .map((u) => (
              <div key={u.id} className="grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1.5">
                <span className="truncate text-[15px]">{u.title[lang]}</span>
                <span className="tabular text-[13px] text-ink-3">{Math.round(u.mastery * 100)}%</span>
                <span className="col-span-2">
                  <Bar value={u.mastery} tone={u.status === "mastered" ? "positive" : "ink"} />
                </span>
              </div>
            ))}
          {d.units.every((u) => u.status === "locked") && <p className="text-[15px] text-ink-2">{t("common.none")}</p>}
        </div>
      </Section>

      <Section title={t("progress.weaknesses")}>
        {d.weaknesses.length === 0 ? (
          <p className="text-[15px] text-ink-2">{t("progress.noWeaknesses")}</p>
        ) : (
          <ul className="divide-y divide-line">
            {d.weaknesses.map((w) => (
              <li key={w.key} className="grid grid-cols-[1fr_auto] gap-4 py-2.5 sm:grid-cols-[140px_1fr_auto]">
                <span className="hidden text-[13px] text-ink-3 sm:block">{t(`progress.kinds.${w.kind}` as MessageKey)}</span>
                <span className="text-[15px]" lang={w.kind === "verb" || w.kind === "vocab" ? "es" : undefined}>
                  {w.kind === "error" && (["wrong_person", "wrong_tense", "ending", "irregular", "accent", "stem_change", "pronoun", "other", "grammar", "conjugation", "vocabulary", "orthography"] as string[]).includes(w.id)
                    ? t(`study.categories.${w.id}` as MessageKey)
                    : w.label}
                </span>
                <span className="text-[13px] text-ink-3">{t("progress.occurrences", { n: w.occurrences })}</span>
              </li>
            ))}
          </ul>
        )}
      </Section>
    </div>
  );
}
