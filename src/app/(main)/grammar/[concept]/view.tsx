"use client";

import { and, eq } from "drizzle-orm";
import Link from "next/link";
import { GRAMMAR_CONCEPTS } from "@/content";
import type { LessonContent } from "@/content/types";
import { PageError, PageLoading, useLoad } from "@/components/data";
import { useI18n } from "@/components/i18n";
import { LessonBody } from "@/components/study/lesson";
import { Note, PageTitle } from "@/components/ui/primitives";
import { database } from "@/core/db/client";
import { conceptProgress, lessons } from "@/core/db/schema";
import type { Lang } from "@/lib/i18n/types";

async function loadConcept(id: string, lang: Lang) {
  const db = await database();
  const lesson = (await db.select().from(lessons).where(and(eq(lessons.conceptId, id), eq(lessons.lang, lang))))[0] ?? null;
  const progress = (await db.select().from(conceptProgress).where(eq(conceptProgress.conceptId, id)))[0] ?? null;
  return { lesson, progress };
}

export function ConceptView({ id }: { id: string }) {
  const { t, lang } = useI18n();
  const concept = GRAMMAR_CONCEPTS.find((c) => c.id === id)!;
  const { data, error, reload } = useLoad(() => loadConcept(id, lang), [id, lang]);
  if (error) return <PageError onRetry={reload} />;
  if (!data) return <PageLoading />;
  const { lesson, progress } = data;
  return (
    <div className="enter flex flex-col gap-8">
      <div>
        <Link href="/grammar" className="text-[14px] text-ink-3 hover:text-ink">
          {t("grammar.title")}
        </Link>
        <div className="mt-2">
          <PageTitle aside={progress ? `${t("conjugation.mastery")}${t("common.colon")}${Math.round(progress.mastery * 100)}%` : concept.cefr}>{concept.title[lang]}</PageTitle>
        </div>
        <p className="mt-3 text-[15px] leading-relaxed text-ink-2">{concept.objectives[lang]}</p>
      </div>
      {lesson ? (
        <LessonBody content={lesson.content as LessonContent} mode="full" />
      ) : (
        <Note>{t("grammar.lessonMissing")}</Note>
      )}
    </div>
  );
}
