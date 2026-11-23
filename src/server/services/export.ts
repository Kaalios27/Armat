import { eq } from "drizzle-orm";
import { SEED_VERSION } from "@/content";
import { database } from "../db/client";
import {
  aiUsage,
  attempts,
  conceptProgress,
  exams,
  exercises,
  lessons,
  profile,
  sessionItems,
  studySessions,
  vocabAliases,
  vocabCards,
  vocabItems,
  vocabReviews,
  vocabTranslations,
  weaknesses,
} from "../db/schema";

/** Everything the learner owns: progress, history, exams and generated content. */
export async function exportAll() {
  const db = await database();
  return {
    format: "armat-export",
    version: 1,
    exportedAt: new Date().toISOString(),
    seedVersion: SEED_VERSION,
    profile: await db.select().from(profile),
    studySessions: await db.select().from(studySessions),
    sessionItems: await db.select().from(sessionItems),
    vocabCards: await db.select().from(vocabCards),
    vocabReviews: await db.select().from(vocabReviews),
    conceptProgress: await db.select().from(conceptProgress),
    attempts: await db.select().from(attempts),
    exams: await db.select().from(exams),
    weaknesses: await db.select().from(weaknesses),
    aiUsage: await db.select().from(aiUsage),
    generated: {
      lessons: await db.select().from(lessons).where(eq(lessons.source, "ai")),
      exercises: await db.select().from(exercises).where(eq(exercises.source, "ai")),
      vocabItems: await db.select().from(vocabItems).where(eq(vocabItems.source, "ai")),
      vocabTranslations: await db.select().from(vocabTranslations),
      vocabAliases: await db.select().from(vocabAliases),
    },
  };
}
