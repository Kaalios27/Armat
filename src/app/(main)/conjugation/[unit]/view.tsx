"use client";

import { and, eq } from "drizzle-orm";
import Link from "next/link";
import { getUnit } from "@/content/conjugation";
import type { LessonContent } from "@/content/types";
import { PageError, PageLoading, useLoad } from "@/components/data";
import { useI18n } from "@/components/i18n";
import { LessonBody } from "@/components/study/lesson";
import { Note, PageTitle, Section } from "@/components/ui/primitives";
import { VerbLookup } from "@/components/verb-lookup";
import { database } from "@/core/db/client";
import { conceptProgress, lessons } from "@/core/db/schema";
import type { Lang } from "@/lib/i18n/types";
import { canDrill } from "@/lib/conjugation/drills";
import { conjugate } from "@/lib/conjugation/engine";

async function loadUnit(unitId: string, lang: Lang) {
  const db = await database();
  const lesson = (await db.select().from(lessons).where(and(eq(lessons.conceptId, unitId), eq(lessons.lang, lang))))[0] ?? null;
  const progress = (await db.select().from(conceptProgress).where(eq(conceptProgress.conceptId, unitId)))[0] ?? null;
  return { lesson, progress };
}

export function UnitView({ unitId }: { unitId: string }) {
  const { t, lang } = useI18n();
  const unit = getUnit(unitId)!;
  const { data, error, reload } = useLoad(() => loadUnit(unitId, lang), [unitId, lang]);
  if (error) return <PageError onRetry={reload} />;
  if (!data) return <PageLoading />;
  const { lesson, progress } = data;
  const content = lesson?.content as LessonContent | undefined;
  const tables = (content?.tableVerbs ?? []).slice(0, 3).map((v) => ({ verb: v, tense: unit.tenses[0]!, forms: conjugate(v, unit.tenses[0]!) }));
  const verbs = unit.verbs.filter((v) => unit.tenses.some((tn) => canDrill(v, tn)));
  const tableData = Object.fromEntries(verbs.map((v) => [v, unit.tenses.map((tn) => ({ tense: tn, forms: conjugate(v, tn) }))]));

  return (
    <div className="enter flex flex-col gap-10">
      <div>
        <Link href="/conjugation" className="text-[14px] text-ink-3 hover:text-ink">
          {t("conjugation.title")}
        </Link>
        <div className="mt-2">
          <PageTitle aside={progress ? `${t("conjugation.mastery")}${t("common.colon")}${Math.round(progress.mastery * 100)}%` : undefined}>{unit.title[lang]}</PageTitle>
        </div>
      </div>
      {!progress && <Note>{t("conjugation.notStarted")}</Note>}
      {content && <LessonBody content={content} tables={tables} mode="full" />}
      <Section title={t("conjugation.tables")}>
        <VerbLookup verbs={verbs} data={tableData} />
      </Section>
    </div>
  );
}
