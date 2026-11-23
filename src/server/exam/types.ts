import type { GrammarExerciseData } from "@/content/types";
import type { AlternativeTense } from "@/lib/conjugation/diagnose";
import type { Person, Tense } from "@/lib/conjugation/types";
import type { Lang, Localized } from "@/lib/i18n/types";

export type ExamPartKey = "dictation" | "conjugation" | "grammar" | "translation" | "writing";
export const EXAM_PARTS: ExamPartKey[] = ["dictation", "conjugation", "grammar", "translation", "writing"];
export const PART_POINTS: Record<ExamPartKey, number> = { dictation: 15, conjugation: 20, grammar: 20, translation: 15, writing: 30 };
export const PART_MINUTES: Record<ExamPartKey, number> = { dictation: 10, conjugation: 10, grammar: 10, translation: 10, writing: 20 };
export const EXAM_MINUTES = 60;

/** Points actually graded: 100 unless a part is pending (for example writing without AI). */
export function gradedMax(sectionScores: unknown): number {
  const s = (sectionScores ?? null) as Partial<Record<ExamPartKey, number | null>> | null;
  if (!s) return 100;
  return EXAM_PARTS.reduce((sum, p) => sum + (s[p] === null ? 0 : PART_POINTS[p]), 0);
}
export const MAX_FULL_PLAYS = 2;
export const MAX_SEGMENT_PLAYS = 3;

export interface ExamConjItem {
  id: string;
  type: "direct" | "context" | "sentence";
  verb: string;
  translation: Localized;
  tense: Tense | null;
  person: Person | null;
  subject: string | null;
  before: string | null;
  after: string | null;
}

export interface ExamGrammarItem {
  id: string;
  type: GrammarExerciseData["type"];
  instruction: Localized | null;
  es: string | null;
  options: string[] | null;
  tokens: string[] | null;
  blanks: number;
}

/** Content sent to the learner: questions only, no answers. */
export interface ExamContent {
  version: 1;
  kind: "weekly" | "monthly";
  number: number;
  lang: Lang;
  dictation: {
    segments: number;
    tts: "server" | "browser";
    /** Base64 segment texts, present only when the device's speech synthesis reads them. */
    encoded: string[] | null;
  };
  conjugation: ExamConjItem[];
  grammar: ExamGrammarItem[];
  translation: Array<{ id: string; source: string }>;
  writing: { prompt: string; minWords: number; guidance: string[] };
  sources: Record<"dictation" | "grammar" | "translation" | "writing", "ai" | "curated">;
}

export interface ExamKey {
  dictation: { text: string; segments: string[] };
  conjugation: Array<{ id: string; verb: string; tense: Tense; person: Person; answers: string[]; alternatives: AlternativeTense[]; unitId: string }>;
  grammar: Array<{ id: string; conceptId: string; data: GrammarExerciseData }>;
  translation: Array<{ id: string; references: string[]; keyPoints: string[]; conceptIds: string[] }>;
  writing: { conceptIds: string[]; level: number };
}

export interface ExamResponses {
  dictation?: string;
  conjugation?: Record<string, string>;
  grammar?: Record<string, string | string[]>;
  translation?: Record<string, string>;
  writing?: string;
}

export interface ExamPlayback {
  full?: number;
  segments?: Record<string, number>;
}

export interface ItemCorrection {
  id: string;
  answer: string;
  expected: string;
  points: number;
  maxPoints: number;
  correct: boolean;
  category: string | null;
  explanation: string | null;
  pending?: boolean;
}

export interface ExamGrading {
  parts: Record<ExamPartKey, { score: number | null; max: number; items: ItemCorrection[]; notes: string[] }>;
  dictation: { tokens: Array<{ ref: string | null; hyp: string | null; type: string | null }>; counts: Record<string, number>; reference: string } | null;
  writing: {
    criteria: Array<{ key: string; score: number; max: number; comment: string }>;
    corrected: string;
    errors: Array<{ category: string; original: string; correction: string; explanation: string }>;
    summary: string;
    wordCount: number;
  } | null;
  categories: Record<string, number>;
  recommendations: Array<{ conceptId: string; title: Localized; reason: string }>;
  previousScore: number | null;
  provisional: boolean;
}
