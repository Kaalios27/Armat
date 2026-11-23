import { and, eq } from "drizzle-orm";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getUnit } from "@/content/conjugation";
import type { LessonContent } from "@/content/types";
import { VerbLookup } from "@/components/verb-lookup";
import { LessonBody } from "@/components/study/lesson";
import { Note, PageTitle, Section } from "@/components/ui/primitives";
import { conjugate } from "@/lib/conjugation/engine";
import { canDrill } from "@/lib/conjugation/drills";
import { translator } from "@/lib/i18n/messages";
import { database } from "@/server/db/client";
import { conceptProgress, lessons } from "@/server/db/schema";
import { tzHint } from "@/server/http";
import { getProfile } from "@/server/services/profile";

export default async function UnitPage({ params }: { params: Promise<{ unit: string }> }) {
  const { unit: unitId } = await params;
  const unit = getUnit(unitId);
  if (!unit) notFound();
  const profile = await getProfile(await tzHint());
  const lang = profile.uiLang;
  const t = translator(lang);
  const db = await database();
  const lesson = (await db.select().from(lessons).where(and(eq(lessons.conceptId, unit.id), eq(lessons.lang, lang))))[0];
  const progress = (await db.select().from(conceptProgress).where(eq(conceptProgress.conceptId, unit.id)))[0];
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
