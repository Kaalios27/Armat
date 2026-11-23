import type { Lang } from "@/lib/i18n/types";
import { hashString } from "@/lib/text";
import { CONJUGATION_UNITS } from "./conjugation";
import { CHAPTERS, GRAMMAR_CONCEPTS } from "./grammar-concepts";
import { EXERCISES_1, LESSONS_1 } from "./grammar-lessons-1";
import type { BilingualLesson, GrammarExerciseSeed, LessonContent } from "./types";
import { VOCAB_SEED } from "./vocab";

export { CHAPTERS, CONJUGATION_UNITS, GRAMMAR_CONCEPTS, VOCAB_SEED };

export const GRAMMAR_LESSONS: Record<string, BilingualLesson> = { ...LESSONS_1 };
export const GRAMMAR_EXERCISES: GrammarExerciseSeed[] = [...EXERCISES_1];

export function localizeLesson(lesson: BilingualLesson, lang: Lang): LessonContent {
  return {
    summary: lesson.summary[lang],
    rules: lesson.rules.map((r) => r[lang]),
    examples: lesson.examples.map((e) => ({ es: e.es, tr: e[lang] })),
    exceptions: lesson.exceptions.map((e) => e[lang]),
    pitfalls: lesson.pitfalls.map((p) => p[lang]),
    ...(lesson.tableVerbs ? { tableVerbs: lesson.tableVerbs } : {}),
  };
}

/** Changes whenever curated content changes, so deployments re-seed automatically. */
export const SEED_VERSION = hashString(
  JSON.stringify([GRAMMAR_CONCEPTS, CONJUGATION_UNITS, GRAMMAR_LESSONS, GRAMMAR_EXERCISES, VOCAB_SEED, CHAPTERS]),
);
