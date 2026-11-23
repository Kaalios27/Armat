import type { Lang } from "@/lib/i18n/types";
import { cognateScore, lemmaKey, slugify } from "@/lib/lemma";
import { VOCAB_A } from "./vocab-a";
import { VOCAB_B } from "./vocab-b";
import { VOCAB_C } from "./vocab-c";

export interface VocabTranslationSeed {
  main: string;
  alternatives: string[];
  note: string | null;
  exampleTranslation: string | null;
  falseFriend: boolean;
  cognateScore: number;
}

export interface VocabSeed {
  id: string;
  lemma: string;
  lemmaKey: string;
  pos: string;
  gender: string | null;
  level: number;
  frequency: number;
  theme: string;
  tags: string[];
  example: string | null;
  translations: Record<Lang, VocabTranslationSeed>;
}

export function parseVocabLine(line: string): VocabSeed {
  const f = line.split("|");
  const [lemma, posRaw, level, freq, theme, en, fr, ex, exEn, exFr, tagsRaw, noteEn, noteFr] = f;
  if (!lemma || !posRaw || !en || !fr) throw new Error(`Malformed vocabulary line: ${line}`);
  const [pos, gender] = posRaw.split(".") as [string, string | undefined];
  const tags = (tagsRaw ?? "").split(",").map((t) => t.trim()).filter(Boolean);
  const enList = en.split(";").map((s) => s.trim()).filter(Boolean);
  const frList = fr.split(";").map((s) => s.trim()).filter(Boolean);
  const tr = (list: string[], lang: Lang, note: string | undefined, exTr: string | undefined): VocabTranslationSeed => ({
    main: list[0]!,
    alternatives: list.slice(1),
    note: note?.trim() || null,
    exampleTranslation: exTr?.trim() || null,
    falseFriend: tags.includes(lang === "en" ? "ff-en" : "ff-fr"),
    cognateScore: cognateScore(lemma, pos, list, lang),
  });
  return {
    id: `v-${slugify(lemma)}`,
    lemma: lemma.trim(),
    lemmaKey: lemmaKey(lemma),
    pos,
    gender: gender ?? null,
    level: Number(level),
    frequency: Number(freq),
    theme: theme ?? "core",
    tags,
    example: ex?.trim() || null,
    translations: { en: tr(enList, "en", noteEn, exEn), fr: tr(frList, "fr", noteFr, exFr) },
  };
}

export const VOCAB_SEED: VocabSeed[] = [...VOCAB_A, ...VOCAB_B, ...VOCAB_C].map(parseVocabLine);

/** Themes used to extend the lexicon with AI-proposed items, in curriculum order. */
export const VOCAB_THEMES: Array<{ id: string; en: string }> = [
  { id: "core", en: "high-frequency verbs, nouns and adjectives that are hard to infer for the learner" },
  { id: "connectors", en: "connectors and discourse markers used in speech and writing" },
  { id: "thinking", en: "opinions, reasoning, agreement and disagreement" },
  { id: "time", en: "time expressions, frequency and sequencing" },
  { id: "feelings", en: "emotions, attitudes and character" },
  { id: "social", en: "social interaction and conversation in Spain" },
  { id: "daily", en: "daily life, housing, transport and services in Spain" },
  { id: "university", en: "university life, studying and exams" },
  { id: "work", en: "professional life, meetings, projects and negotiation" },
  { id: "tech", en: "technology, engineering and computing" },
  { id: "acad", en: "academic and analytical language for reports and argumentation" },
  { id: "society", en: "society, economy, politics and current affairs" },
  { id: "health", en: "health and the body" },
  { id: "idioms", en: "common idiomatic expressions used in Spain" },
  { id: "false-friends", en: "false friends and words whose meaning differs from look-alikes" },
];
