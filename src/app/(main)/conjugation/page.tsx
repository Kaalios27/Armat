"use client";

import Link from "next/link";
import { CONJUGATION_UNITS } from "@/content";
import { PageError, PageLoading, useLoad } from "@/components/data";
import { useI18n } from "@/components/i18n";
import { Bar, PageTitle, Section } from "@/components/ui/primitives";
import { database } from "@/core/db/client";
import { conceptProgress } from "@/core/db/schema";
import { tenseName } from "@/lib/conjugation/labels";

async function loadProgress() {
  const db = await database();
  return new Map((await db.select().from(conceptProgress)).map((p) => [p.conceptId, p]));
}

export default function ConjugationPage() {
  const { t, lang } = useI18n();
  const { data: progress, error, reload } = useLoad(loadProgress, []);
  if (error) return <PageError onRetry={reload} />;
  if (!progress) return <PageLoading />;
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
