import { and, eq } from "drizzle-orm";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GRAMMAR_CONCEPTS } from "@/content";
import type { LessonContent } from "@/content/types";
import { GenerateLessonButton } from "@/components/generate-lesson";
import { LessonBody } from "@/components/study/lesson";
import { Note, PageTitle } from "@/components/ui/primitives";
import { translator } from "@/lib/i18n/messages";
import { aiEnabled } from "@/server/ai/provider";
import { database } from "@/server/db/client";
import { conceptProgress, lessons } from "@/server/db/schema";
import { tzHint } from "@/server/http";
import { getProfile } from "@/server/services/profile";

export default async function ConceptPage({ params }: { params: Promise<{ concept: string }> }) {
  const { concept: id } = await params;
  const concept = GRAMMAR_CONCEPTS.find((c) => c.id === id);
  if (!concept) notFound();
  const profile = await getProfile(await tzHint());
  const lang = profile.uiLang;
  const t = translator(lang);
  const db = await database();
  const lesson = (await db.select().from(lessons).where(and(eq(lessons.conceptId, id), eq(lessons.lang, lang))))[0];
  const progress = (await db.select().from(conceptProgress).where(eq(conceptProgress.conceptId, id)))[0];
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
      ) : aiEnabled() ? (
        <div className="flex flex-col gap-4">
          <Note>{t("grammar.lessonMissing")}</Note>
          <GenerateLessonButton conceptId={id} />
        </div>
      ) : (
        <Note>{t("grammar.needsAi")}</Note>
      )}
    </div>
  );
}
