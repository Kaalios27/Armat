import Link from "next/link";
import { CHAPTERS, GRAMMAR_CONCEPTS } from "@/content";
import { Bar, PageTitle, Section } from "@/components/ui/primitives";
import { translator } from "@/lib/i18n/messages";
import { database } from "@/server/db/client";
import { conceptProgress } from "@/server/db/schema";
import { tzHint } from "@/server/http";
import { getProfile } from "@/server/services/profile";

export default async function GrammarPage() {
  const profile = await getProfile(await tzHint());
  const lang = profile.uiLang;
  const t = translator(lang);
  const db = await database();
  const progress = new Map((await db.select().from(conceptProgress)).map((p) => [p.conceptId, p]));
  const statusLabel = (s: string | undefined) =>
    s === "mastered" ? t("conjugation.statusMastered") : s === "practicing" ? t("conjugation.statusPracticing") : s === "introduced" ? t("conjugation.statusIntroduced") : t("conjugation.statusLocked");
  let n = 0;
  return (
    <div className="enter flex flex-col gap-10">
      <PageTitle>{t("grammar.title")}</PageTitle>
      {CHAPTERS.map((ch) => {
        const concepts = GRAMMAR_CONCEPTS.filter((c) => c.chapter === ch.id);
        const done = concepts.filter((c) => progress.get(c.id)?.status === "mastered").length;
        return (
          <Section key={ch.id} title={ch.title[lang]} aside={`${done} / ${concepts.length}`}>
            <ol className="divide-y divide-line">
              {concepts.map((c) => {
                n++;
                const p = progress.get(c.id);
                return (
                  <li key={c.id}>
                    <Link href={`/grammar/${c.id}`} className="grid grid-cols-[28px_1fr_auto] items-center gap-3 py-3 transition-colors hover:bg-subtle/60 sm:grid-cols-[28px_1fr_48px_140px_120px]">
                      <span className="tabular text-[13px] text-ink-3">{n}</span>
                      <span className={p ? "text-[16px]" : "text-[16px] text-ink-2"}>{c.title[lang]}</span>
                      <span className="hidden text-[13px] text-ink-3 sm:block">{c.cefr}</span>
                      <span className="text-[13px] text-ink-2">{statusLabel(p?.status)}</span>
                      <span className="hidden sm:block">{p && <Bar value={p.mastery} tone={p.status === "mastered" ? "positive" : "ink"} />}</span>
                    </Link>
                  </li>
                );
              })}
            </ol>
          </Section>
        );
      })}
    </div>
  );
}
