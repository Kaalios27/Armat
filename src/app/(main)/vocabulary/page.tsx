"use client";

import { PageError, PageLoading, useLoad } from "@/components/data";
import { useI18n } from "@/components/i18n";
import { PageTitle, Section, Stat } from "@/components/ui/primitives";
import { WordList } from "@/components/vocab-list";
import { vocabularyData } from "@/core/services/stats";
import { formatPercent } from "@/lib/format";

export default function VocabularyPage() {
  const { t, lang } = useI18n();
  const { data: d, error, reload } = useLoad(() => vocabularyData(lang), [lang]);
  if (error) return <PageError onRetry={reload} />;
  if (!d) return <PageLoading />;
  return (
    <div className="enter flex flex-col gap-10">
      <PageTitle>{t("vocab.title")}</PageTitle>
      <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6">
        <Stat label={t("vocab.dueToday")} value={d.due} />
        <Stat label={t("vocab.learning")} value={d.learning} />
        <Stat label={t("vocab.learned")} value={d.learned} />
        <Stat label={t("vocab.mature")} value={d.mature} />
        <Stat label={t("vocab.retention")} value={formatPercent(d.retention)} />
        <Stat label={t("vocab.newPerDay")} value={d.newPerSession} />
      </div>
      <Section title={t("vocab.words")} aside={`${t("vocab.available")}${t("common.colon")}${d.available}`}>
        {d.words.length ? <WordList words={d.words} /> : <p className="text-[15px] text-ink-2">{t("vocab.noWords")}</p>}
      </Section>
    </div>
  );
}
