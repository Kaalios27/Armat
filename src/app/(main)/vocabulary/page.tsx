import { PageTitle, Section, Stat } from "@/components/ui/primitives";
import { WordList } from "@/components/vocab-list";
import { formatPercent } from "@/lib/format";
import { translator } from "@/lib/i18n/messages";
import { tzHint } from "@/server/http";
import { getProfile } from "@/server/services/profile";
import { vocabularyData } from "@/server/services/stats";

export default async function VocabularyPage() {
  const tz = await tzHint();
  const profile = await getProfile(tz);
  const t = translator(profile.uiLang);
  const d = await vocabularyData(profile.uiLang, tz);
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
      <Section title={t("vocab.words")} aside={`${t("vocab.available")}: ${d.available}`}>
        {d.words.length ? <WordList words={d.words} /> : <p className="text-[15px] text-ink-2">{t("vocab.noWords")}</p>}
      </Section>
    </div>
  );
}
