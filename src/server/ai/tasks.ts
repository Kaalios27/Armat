import "server-only";
import { z } from "zod";
import type { GrammarExerciseData, LessonContent } from "@/content/types";
import type { Lang, Localized } from "@/lib/i18n/types";
import { sentenceKey } from "@/lib/text";
import { gradeGrammar } from "../grading/grammar";
import { generate } from "./provider";

export const LANG_NAME: Record<Lang, string> = { en: "English", fr: "French" };

export function systemPrompt(lang: Lang): string {
  return [
    "You are the content engine of Armat, a personal study system for European Spanish (Castilian, as spoken in Spain, including vosotros).",
    "The learner is an adult with a strong academic and engineering background who wants rigorous, efficient instruction and fast progress.",
    `Instruction language: ${LANG_NAME[lang]}. Write every explanation, instruction and translation in ${LANG_NAME[lang]}.`,
    "Write all Spanish in natural, correct European Spanish: vosotros forms, vocabulary used in Spain (ordenador, coche, móvil, piso, zumo, coger), RAE 2010 orthography (solo and demonstratives without accents).",
    "Be precise and concise. No motivational language, no filler, no emojis.",
  ].join("\n");
}

const loc = (text: string): Localized => ({ en: text, fr: text });

// ---------------------------------------------------------------------------
// Lessons
// ---------------------------------------------------------------------------

const LessonSchema = z.object({
  summary: z.string(),
  rules: z.array(z.string()),
  examples: z.array(z.object({ es: z.string(), tr: z.string() })),
  exceptions: z.array(z.string()),
  pitfalls: z.array(z.string()),
});

const ReviewSchema = z.object({ ok: z.boolean(), issues: z.array(z.string()) });

export async function aiLesson(
  concept: { id: string; title: string; objectives: string; cefr: string },
  lang: Lang,
  priorTitles: string[],
): Promise<LessonContent> {
  const speakers = lang === "fr" ? "French speakers" : "English speakers";
  const prompt = [
    `Write a concise grammar lesson for the concept "${concept.title}" (CEFR ${concept.cefr}).`,
    `Scope: ${concept.objectives}`,
    priorTitles.length ? `The learner has already studied: ${priorTitles.slice(-12).join("; ")}.` : "",
    "Structure:",
    "- summary: 2 to 4 sentences stating the core idea precisely.",
    "- rules: 3 to 5 rules, each one sentence, with Spanish forms in the sentence.",
    "- examples: 3 to 5 Spanish example sentences with accurate translations.",
    "- exceptions: 0 to 3 important exceptions.",
    `- pitfalls: 2 or 3 mistakes typical of ${speakers}, contrasting with ${LANG_NAME[lang]} where useful.`,
    "Keep the whole lesson under 350 words. Do not include exercises.",
  ]
    .filter(Boolean)
    .join("\n");

  const lesson = await generate({
    task: "lesson",
    system: systemPrompt(lang),
    prompt,
    schema: LessonSchema,
    effort: "high",
    cacheKey: `${concept.id}:${lang}`,
    validate: (l) => {
      const p: string[] = [];
      if (l.rules.length < 2) p.push("at least two rules are required");
      if (l.examples.length < 3) p.push("at least three examples are required");
      if (l.examples.some((e) => !e.es.trim() || !e.tr.trim())) p.push("every example needs Spanish text and a translation");
      return p;
    },
  });

  // Second pass: an independent review for errors and contradictions.
  const review = await generate({
    task: "lesson-review",
    system: systemPrompt(lang),
    prompt: `Review this lesson on "${concept.title}" for European Spanish. Report factual errors about Spanish grammar, contradictions, non-Castilian usage, wrong translations or incorrect accents. Set ok to true only if there are no such problems.\n\n${JSON.stringify(lesson.data)}`,
    schema: ReviewSchema,
    effort: "medium",
  });
  if (!review.data.ok && review.data.issues.length) {
    const fixed = await generate({
      task: "lesson-fix",
      system: systemPrompt(lang),
      prompt: `${prompt}\n\nA reviewer found these problems in a previous draft; avoid them:\n- ${review.data.issues.join("\n- ")}`,
      schema: LessonSchema,
      effort: "high",
    });
    return fixed.data;
  }
  return lesson.data;
}

// ---------------------------------------------------------------------------
// Grammar exercises
// ---------------------------------------------------------------------------

const ExerciseTypeEnum = z.enum(["fill", "choose", "correct", "translate", "reconstruct", "write", "distinguish"]);

const GeneratedExercise = z.object({
  type: ExerciseTypeEnum,
  instruction: z.string(),
  es: z.string().nullable(),
  tokens: z.array(z.string()).nullable(),
  options: z.array(z.string()).nullable(),
  blanks: z.array(z.array(z.string())).nullable(),
  answers: z.array(z.string()).nullable(),
  explanation: z.string(),
});
const ExerciseBatch = z.object({ exercises: z.array(GeneratedExercise) });
type Generated = z.infer<typeof GeneratedExercise>;

const SolverSchema = z.object({ answers: z.array(z.object({ index: z.number(), answer: z.string() })) });

export function toExerciseData(g: Generated): GrammarExerciseData {
  const promptText = g.type === "translate" || g.type === "write" ? g.instruction : null;
  return {
    type: g.type,
    prompt: promptText ? loc(promptText) : null,
    es: g.es,
    tokens: g.tokens ?? undefined,
    options: g.options ?? undefined,
    blanks: g.blanks ?? undefined,
    answers: g.answers ?? undefined,
    explanation: loc(g.explanation),
    hint: g.type !== "translate" && g.type !== "write" && g.instruction ? loc(g.instruction) : null,
  };
}

export function structuralProblems(g: Generated, i: number): string[] {
  const p: string[] = [];
  const at = `exercise ${i + 1}`;
  if (!g.explanation.trim()) p.push(`${at}: explanation is empty`);
  switch (g.type) {
    case "fill":
    case "distinguish": {
      const n = (g.es ?? "").split("___").length - 1;
      if (!n) p.push(`${at}: Spanish text must contain ___ for each blank`);
      if (!g.blanks || g.blanks.length !== n || g.blanks.some((b) => !b.length || b.some((x) => !x.trim()))) {
        p.push(`${at}: blanks must list accepted answers for each of the ${n} blanks`);
      }
      break;
    }
    case "choose":
      if (!g.options || g.options.length < 2 || g.options.length > 4) p.push(`${at}: choose needs 2 to 4 options`);
      if (!g.answers?.[0] || !g.options?.includes(g.answers[0])) p.push(`${at}: the answer must be one of the options`);
      break;
    case "correct":
      if (!g.es?.trim() || !g.answers?.length) p.push(`${at}: provide the incorrect sentence and corrected answers`);
      else if (g.answers.some((a) => sentenceKey(a) === sentenceKey(g.es!))) p.push(`${at}: the sentence to correct must contain an error`);
      break;
    case "translate":
    case "write":
      if (!g.instruction.trim() || !g.answers?.length) p.push(`${at}: provide the source text and model answers`);
      break;
    case "reconstruct": {
      if (!g.tokens || g.tokens.length < 3 || !g.answers?.length) p.push(`${at}: reconstruct needs tokens and answers`);
      else {
        const toks = g.tokens.map((t) => sentenceKey(t)).sort().join(" ");
        if (g.answers.some((a) => sentenceKey(a).split(" ").sort().join(" ") !== toks)) p.push(`${at}: answers must use exactly the given tokens`);
      }
      break;
    }
  }
  return p;
}

export interface ExerciseRequest {
  concept: { id: string; title: string; objectives: string; cefr: string };
  lang: Lang;
  lesson: LessonContent | null;
  count: number;
  knownWords: string[];
  avoid: string[];
  recentErrors: string[];
}

export async function aiGrammarExercises(req: ExerciseRequest): Promise<GrammarExerciseData[]> {
  const prompt = [
    `Create ${req.count} new exercises on "${req.concept.title}" (CEFR ${req.concept.cefr}).`,
    `Scope: ${req.concept.objectives}`,
    req.lesson ? `Lesson rules: ${req.lesson.rules.join(" | ")}` : "",
    req.knownWords.length ? `Prefer vocabulary the learner knows: ${req.knownWords.slice(0, 40).join(", ")}.` : "",
    req.recentErrors.length ? `The learner recently made these mistakes; target them:\n- ${req.recentErrors.slice(0, 8).join("\n- ")}` : "",
    req.avoid.length ? `Do not reuse these sentences:\n- ${req.avoid.slice(0, 20).join("\n- ")}` : "",
    "Formats (prefer typed answers; at most one choose):",
    "- fill: es is a Spanish sentence with ___ for each blank; blanks lists every accepted answer per blank; instruction says what to fill in.",
    "- distinguish: like fill, contrasting two similar constructions in one or two sentences.",
    "- correct: es is a Spanish sentence with exactly one grammatical error related to the concept; answers are the corrected sentence(s).",
    `- translate: instruction is a ${LANG_NAME[req.lang]} sentence to translate; answers lists all natural European Spanish translations (include variants with and without subject pronouns when both are natural).`,
    "- reconstruct: tokens are the shuffled words of a sentence (include punctuation on tokens); answers lists every valid order.",
    `- write: instruction asks for one Spanish sentence using a given structure; answers gives two model sentences.`,
    "- choose: options are 2 to 4 alternatives; answers holds the single correct option.",
    `Explanations: one or two sentences in ${LANG_NAME[req.lang]} stating the rule that decides the answer.`,
    "Vary the difficulty; include at least two translate or correct items. Fields that do not apply to a format must be null.",
  ]
    .filter(Boolean)
    .join("\n");

  const batch = await generate({
    task: "grammar-exercises",
    system: systemPrompt(req.lang),
    prompt,
    schema: ExerciseBatch,
    effort: "medium",
    validate: (b) => {
      const p = b.exercises.flatMap(structuralProblems);
      if (b.exercises.length < Math.min(3, req.count)) p.push(`return at least ${Math.min(3, req.count)} exercises`);
      return p;
    },
  });

  const candidates = batch.data.exercises;
  // Independent solver: keep only exercises whose reference answer an expert reproduces.
  const toSolve = candidates.map((g, index) => ({ index, type: g.type, instruction: g.instruction, es: g.es, tokens: g.tokens, options: g.options })).filter((x) => x.type !== "write");
  let verified = new Set<number>(candidates.map((_, i) => i));
  if (toSolve.length) {
    try {
      const solved = await generate({
        task: "grammar-exercises-verify",
        system: systemPrompt(req.lang),
        prompt: `Solve these Spanish exercises as an expert. For fill and distinguish items, give the blank answers separated by " | ". For other items give the full answer.\n\n${JSON.stringify(toSolve)}`,
        schema: SolverSchema,
        effort: "low",
      });
      verified = new Set(candidates.map((g, i) => (g.type === "write" ? i : -1)).filter((i) => i >= 0));
      for (const a of solved.data.answers) {
        const g = candidates[a.index];
        if (!g) continue;
        const data = toExerciseData(g);
        const answer = g.type === "fill" || g.type === "distinguish" ? a.answer.split("|").map((s) => s.trim()) : a.answer;
        if (gradeGrammar(data, answer).correct) verified.add(a.index);
      }
    } catch {
      // Without verification, keep only closed formats whose structure was validated.
      verified = new Set(candidates.map((g, i) => (["fill", "choose", "distinguish", "reconstruct"].includes(g.type) ? i : -1)).filter((i) => i >= 0));
    }
  }
  return candidates.filter((_, i) => verified.has(i)).map(toExerciseData);
}

// ---------------------------------------------------------------------------
// Evaluation of open answers
// ---------------------------------------------------------------------------

const EvalSchema = z.object({
  verdict: z.enum(["correct", "acceptable_alternative", "stylistic_difference", "incorrect"]),
  category: z.enum(["grammar", "conjugation", "vocabulary", "orthography"]).nullable(),
  correction: z.string(),
  explanation: z.string(),
});
export type GrammarEvaluation = z.infer<typeof EvalSchema>;

export async function aiEvaluateGrammar(data: GrammarExerciseData, answer: string, lang: Lang, conceptTitle: string): Promise<GrammarEvaluation> {
  const res = await generate({
    task: "grammar-evaluate",
    system: systemPrompt(lang),
    prompt: [
      `Exercise on "${conceptTitle}" (${data.type}).`,
      data.prompt ? `Source: ${data.prompt[lang]}` : "",
      data.es ? `Spanish text: ${data.es}` : "",
      data.tokens ? `Tokens: ${data.tokens.join(" ")}` : "",
      `Reference answers: ${(data.answers ?? []).join(" || ")}`,
      `Learner answer: ${answer}`,
      "Judge the learner answer as a European Spanish teacher. A different but valid Spanish answer is not wrong.",
      "verdict: correct (matches the intent and is correct), acceptable_alternative (different but fully valid), stylistic_difference (valid but less natural), incorrect.",
      "category: for incorrect answers, the main error type; otherwise null.",
      `correction: the corrected learner answer in Spanish (unchanged if correct). explanation: at most 50 words in ${LANG_NAME[lang]}.`,
    ]
      .filter(Boolean)
      .join("\n"),
    schema: EvalSchema,
    effort: "low",
    maxTokens: 4000,
  });
  return res.data;
}

const TranslationCheckSchema = z.object({ acceptable: z.boolean(), explanation: z.string() });

/** Is a Spanish answer an acceptable rendering of the prompt meaning (flashcards)? */
export async function aiCheckSpanishAnswer(meaning: string, target: string, answer: string, lang: Lang): Promise<{ acceptable: boolean; explanation: string }> {
  const res = await generate({
    task: "vocab-check",
    system: systemPrompt(lang),
    prompt: `Flashcard: translate "${meaning}" into Spanish. Target answer: "${target}". Learner answer: "${answer}".\nIs the learner answer an acceptable European Spanish equivalent with correct spelling and accents? Set acceptable to true only if so. explanation: at most 25 words in ${LANG_NAME[lang]}; if acceptable but different from the target, mention the target.`,
    schema: TranslationCheckSchema,
    effort: "low",
    maxTokens: 2000,
  });
  return res.data;
}

const ExplainSchema = z.object({ explanation: z.string() });

export async function aiExplain(context: string, lang: Lang): Promise<string> {
  const res = await generate({
    task: "explain",
    system: systemPrompt(lang),
    prompt: `Explain this learner mistake precisely in ${LANG_NAME[lang]}, in at most 110 words: the rule, why the answer is wrong, and one extra example.\n\n${context}`,
    schema: ExplainSchema,
    effort: "low",
    maxTokens: 3000,
  });
  return res.data.explanation;
}

// ---------------------------------------------------------------------------
// Vocabulary
// ---------------------------------------------------------------------------

const ProposedItem = z.object({
  lemma: z.string(),
  pos: z.enum(["v", "n", "adj", "adv", "conj", "prep", "pron", "det", "expr", "interj"]),
  gender: z.enum(["m", "f", "mf"]).nullable(),
  frequency: z.number(),
  en: z.array(z.string()),
  fr: z.array(z.string()),
  example: z.string(),
  exampleEn: z.string(),
  exampleFr: z.string(),
  tags: z.array(z.string()),
  noteEn: z.string().nullable(),
  noteFr: z.string().nullable(),
});
export type ProposedVocab = z.infer<typeof ProposedItem>;

export async function aiProposeVocabulary(theme: { id: string; en: string }, level: number, count: number, avoid: string[]): Promise<ProposedVocab[]> {
  const res = await generate({
    task: "vocab-propose",
    system: systemPrompt("en"),
    prompt: [
      `Propose ${count} Spanish vocabulary items for the theme "${theme.en}", difficulty level ${level} of 6.`,
      "Priorities: high-frequency items that are hard to infer for French and English speakers, irregular verbs, idioms, false friends, connectors, academic and professional vocabulary. Avoid obscure words and obvious cognates unless they are false friends.",
      `Do not propose any of these existing items or their inflected forms: ${avoid.slice(0, 250).join(", ")}.`,
      "Fields: lemma (dictionary form without article; expressions in their base form), pos, gender for nouns, frequency 1 (rare) to 5 (very common), en and fr translations (first is the main one), one short example sentence in European Spanish with exampleEn and exampleFr translations, tags among ff-en, ff-fr, idiom, marker, irr, acad, multi, and short notes when a false friend or usage trap exists (noteEn in English, noteFr in French, otherwise null).",
    ].join("\n"),
    schema: z.object({ items: z.array(ProposedItem) }),
    effort: "medium",
    validate: (r) =>
      r.items.flatMap((it, i) => {
        const p: string[] = [];
        if (!it.en.length || !it.fr.length) p.push(`item ${i + 1}: translations in both languages are required`);
        if (!it.example.trim()) p.push(`item ${i + 1}: example required`);
        return p;
      }),
  });
  return res.data.items;
}

const ContextSchema = z.object({
  sentences: z.array(z.object({ es: z.string(), target: z.string(), en: z.string(), fr: z.string() })),
});

/** Extra contextual sentences for a word the learner keeps failing. */
export async function aiContextSentences(lemma: string, meaning: string, count: number): Promise<Array<{ es: string; target: string; en: string; fr: string }>> {
  const res = await generate({
    task: "vocab-context",
    system: systemPrompt("en"),
    prompt: `Write ${count} short, natural European Spanish sentences (6 to 14 words) that each use "${lemma}" (${meaning}) in a different context. "target" must be the exact form of the word or expression as it appears in the sentence. Give English (en) and French (fr) translations.`,
    schema: ContextSchema,
    effort: "low",
    validate: (r) => r.sentences.filter((s) => !s.es.includes(s.target)).map((s) => `target "${s.target}" does not appear in "${s.es}"`),
  });
  return res.data.sentences;
}
