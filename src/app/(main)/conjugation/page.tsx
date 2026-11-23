import Link from "next/link";
import { CONJUGATION_UNITS } from "@/content";
import { Bar, PageTitle, Section } from "@/components/ui/primitives";
import { tenseName } from "@/lib/conjugation/labels";
import { translator } from "@/lib/i18n/messages";
import { database } from "@/server/db/client";
import { conceptProgress } from "@/server/db/schema";
import { tzHint } from "@/server/http";
import { getProfile } from "@/server/services/profile";

export default async function ConjugationPage() {
  const profile = await getProfile(await tzHint());
  const lang = profile.uiLang;
  const t = translator(lang);
  const db = await database();
  const progress = new Map((await db.select().from(conceptProgress)).map((p) => [p.conceptId, p]));
  const statusLabel = (s: string | undefined) =>
    s === "mastered" ? t("conjugation.statusMastered") : s === "practicing" ? t("conjugation.statusPracticing") : s === "introduced" ? t("conjugation.statusIntroduced") : t("conjugation.statusLocked");

  return (
    <div className="enter flex flex-col gap-10">
      <PageTitle>{t("conjugation.title")}</PageTitle>
      <Section title={t("conjugation.units")}>
        <ol className="divide-y divide-line">
          {CONJUGATION_UNITS.map((u, i) => {
            const p = progress.get(u.id);
            return (
              <li key={u.id}>
                <Link href={`/conjugation/${u.id}`} className="grid grid-cols-[28px_1fr_auto] items-center gap-3 py-3 transition-colors hover:bg-subtle/60 sm:grid-cols-[28px_1fr_160px_120px]">
                  <span className="tabular text-[13px] text-ink-3">{i + 1}</span>
                  <span className="min-w-0">
                    <span className={p ? "text-[16px]" : "text-[16px] text-ink-2"}>{u.title[lang]}</span>
                    <span className="block truncate text-[13px] text-ink-3">{u.tenses.map(tenseName).join(", ")}</span>
                  </span>
                  <span className="text-[13px] text-ink-2">{statusLabel(p?.status)}</span>
                  <span className="hidden sm:block">{p && <Bar value={p.mastery} tone={p.status === "mastered" ? "positive" : "ink"} />}</span>
                </Link>
              </li>
            );
          })}
        </ol>
      </Section>
    </div>
  );
}
