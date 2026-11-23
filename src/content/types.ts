import type { Tense } from "@/lib/conjugation/types";
import type { Localized } from "@/lib/i18n/types";

export interface Example {
  es: string;
  en: string;
  fr: string;
}

/** Lesson content in one instruction language. */
export interface LessonContent {
  summary: string;
  rules: string[];
  examples: Array<{ es: string; tr: string }>;
  exceptions: string[];
  pitfalls: string[];
  /** Verbs whose paradigms are shown (conjugation lessons). */
  tableVerbs?: string[];
}

export interface BilingualLesson {
  summary: Localized;
  rules: Localized[];
  examples: Example[];
  exceptions: Localized[];
  pitfalls: Localized[];
  tableVerbs?: string[];
}

export interface ConjugationUnit {
  id: string;
  title: Localized;
  cefr: string;
  tenses: Tense[];
  verbs: string[];
  prerequisites: string[];
  lesson: BilingualLesson;
}

export interface GrammarConceptSeed {
  id: string;
  chapter: string;
  cefr: string;
  title: Localized;
  objectives: Localized;
  prerequisites: string[];
}

export type GrammarExerciseType =
  | "fill"
  | "choose"
  | "correct"
  | "translate"
  | "reconstruct"
  | "write"
  | "distinguish";

/**
 * Grammar exercise. Spanish text uses "___" for blanks.
 * - fill / distinguish: `blanks` holds accepted answers per blank.
 * - choose: `options` + `answers` (the correct option).
 * - correct / translate / reconstruct: `answers` holds accepted full sentences.
 * - write: `answers` holds model answers; `requires` lists regexes the answer must match.
 */
export interface GrammarExerciseData {
  type: GrammarExerciseType;
  /** Instruction-language prompt (translate, write) or null when the Spanish text is the prompt. */
  prompt?: Localized | null;
  /** Spanish text (sentence with blanks, sentence to correct). */
  es?: string | null;
  tokens?: string[];
  options?: string[];
  blanks?: string[][];
  answers?: string[];
  requires?: string[];
  explanation: Localized;
  hint?: Localized | null;
}

export interface GrammarExerciseSeed extends GrammarExerciseData {
  id: string;
  concept: string;
  difficulty?: number;
}
