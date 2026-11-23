import "server-only";
import { z } from "zod";
import type { Lang } from "@/lib/i18n/types";
import { sentenceKey, wordCount } from "@/lib/text";
import { generate } from "../ai/provider";
import { LANG_NAME, structuralProblems, systemPrompt, toExerciseData } from "../ai/tasks";
import type { GrammarExerciseData } from "@/content/types";

export interface ConceptBrief {
  id: string;
  title: string;
  objectives: string;
}

export async function aiDictation(level: number, words: string[], topics: string[], lang: Lang): Promise<string> {
  const length = [70, 90, 110, 130, 150, 170][Math.min(5, Math.max(0, level - 1))]!;
  const res = await generate({
    task: "exam-dictation",
    system: systemPrompt(lang),
    prompt: [
      `Write an original European Spanish text of about ${length} words for a dictation (learner level ${level} of 6).`,
      `Use several of these known words: ${words.slice(0, 40).join(", ")}.`,
      topics.length ? `Include structures from: ${topics.join("; ")}.` : "",
      "Coherent prose on an everyday, academic or professional topic. Standard punctuation, no dialogue, no lists, no rare proper nouns, no numbers written in digits.",
    ]
      .filter(Boolean)
      .join("\n"),
    schema: z.object({ text: z.string() }),
    effort: "medium",
    validate: (r) => {
      const n = wordCount(r.text);
      return n < length * 0.6 || n > length * 1.5 ? [`the text has ${n} words; aim for about ${length}`] : [];
    },
  });
  return res.data.text.trim();
}

export async function aiExamGrammar(specs: Array<{ concept: ConceptBrief; count: number }>, avoid: string[], lang: Lang): Promise<Array<{ conceptId: string; data: GrammarExerciseData }>> {
  const total = specs.reduce((s, x) => s + x.count, 0);
  const ItemSchema = z.object({
    conceptId: z.string(),
    type: z.enum(["fill", "correct", "choose", "translate", "reconstruct", "distinguish", "write"]),
    instruction: z.string(),
    es: z.string().nullable(),
    tokens: z.array(z.string()).nullable(),
    options: z.array(z.string()).nullable(),
    blanks: z.array(z.array(z.string())).nullable(),
    answers: z.array(z.string()).nullable(),
    explanation: z.string(),
  });
  const res = await generate({
    task: "exam-grammar",
    system: systemPrompt(lang),
    prompt: [
      `Create ${total} grammar examination items. Distribution by concept:`,
      ...specs.map((s) => `- ${s.count} on "${s.concept.title}" (conceptId ${s.concept.id}): ${s.concept.objectives}`),
      "Use new sentences and contexts, never these:",
      ...avoid.slice(0, 25).map((a) => `- ${a}`),
      "Allowed formats: fill (es with ___ per blank; blanks lists accepted answers), correct (es contains exactly one error; answers are corrected sentences), distinguish, translate (instruction is the source sentence), choose (at most one item; 3 or 4 options).",
      `Instructions and explanations in ${LANG_NAME[lang]}. Fields that do not apply must be null. This is a test: no hints in the instruction.`,
    ].join("\n"),
    schema: z.object({ items: z.array(ItemSchema) }),
    effort: "medium",
    validate: (r) => {
      const ids = new Set(specs.map((s) => s.concept.id));
      const p = r.items.flatMap((it, i) => structuralProblems({ ...it, tokens: it.tokens ?? null }, i));
      r.items.forEach((it, i) => {
        if (!ids.has(it.conceptId)) p.push(`item ${i + 1}: unknown conceptId ${it.conceptId}`);
      });
      if (r.items.length < total) p.push(`return ${total} items`);
      return p;
    },
  });
  return res.data.items.slice(0, total).map((it) => ({ conceptId: it.conceptId, data: toExerciseData({ ...it, tokens: it.tokens ?? null }) }));
}

export async function aiExamTranslations(count: number, words: string[], concepts: ConceptBrief[], lang: Lang): Promise<Array<{ source: string; references: string[]; keyPoints: string[]; conceptIds: string[] }>> {
  const res = await generate({
    task: "exam-translation",
    system: systemPrompt(lang),
    prompt: [
      `Create ${count} ${LANG_NAME[lang]} sentences (10 to 22 words) to translate into European Spanish for an examination.`,
      `Use vocabulary from: ${words.slice(0, 40).join(", ")}.`,
      `Test these grammar points: ${concepts.map((c) => `${c.title} [${c.id}]`).join("; ")}.`,
      "For each sentence give: source, references (2 to 4 natural European Spanish translations), keyPoints (the structures and words a correct translation must render), conceptIds (from the bracketed ids).",
    ].join("\n"),
    schema: z.object({ items: z.array(z.object({ source: z.string(), references: z.array(z.string()), keyPoints: z.array(z.string()), conceptIds: z.array(z.string()) })) }),
    effort: "medium",
    validate: (r) => (r.items.length < count ? [`return ${count} items`] : r.items.filter((i) => !i.references.length).map(() => "each item needs references")),
  });
  return res.data.items.slice(0, count);
}

export async function aiWritingPrompt(level: number, minWords: number, themes: string[], recentPrompts: string[], lang: Lang): Promise<{ prompt: string; guidance: string[] }> {
  const res = await generate({
    task: "exam-writing-prompt",
    system: systemPrompt(lang),
    prompt: [
      `Write one examination writing task for a learner at level ${level} of 6 (minimum ${minWords} words in Spanish).`,
      "Task types: explain an opinion, describe an experience, compare two ideas, discuss a problem, write a short argument, describe a technical or academic subject.",
      themes.length ? `Relate it to: ${themes.join(", ")}.` : "",
      recentPrompts.length ? `Do not repeat these recent tasks: ${recentPrompts.join(" | ")}` : "",
      "Avoid elementary topics (ordering food, favourite animals, describing one's family).",
      `prompt: the task in ${LANG_NAME[lang]} (one or two sentences). guidance: two or three short points on structures to use.`,
    ]
      .filter(Boolean)
      .join("\n"),
    schema: z.object({ prompt: z.string(), guidance: z.array(z.string()) }),
    effort: "low",
  });
  return res.data;
}

// ---------------------------------------------------------------------------
// Grading
// ---------------------------------------------------------------------------

const ErrorSchema = z.object({ category: z.string(), original: z.string(), correction: z.string(), explanation: z.string() });

export async function aiGradeGrammarItems(
  items: Array<{ index: number; type: string; source: string | null; es: string | null; references: string[]; answer: string }>,
  lang: Lang,
): Promise<Array<{ index: number; verdict: "correct" | "acceptable_alternative" | "stylistic_difference" | "incorrect"; category: string | null; explanation: string }>> {
  const res = await generate({
    task: "exam-grade-grammar",
    system: systemPrompt(lang),
    prompt: `Grade these examination answers as a strict but fair European Spanish examiner. A valid answer that differs from the references is not wrong. verdict: correct, acceptable_alternative, stylistic_difference or incorrect. category for incorrect answers: grammar, conjugation, vocabulary or orthography. explanation: at most 40 words in ${LANG_NAME[lang]}.\n\n${JSON.stringify(items)}`,
    schema: z.object({
      items: z.array(
        z.object({
          index: z.number(),
          verdict: z.enum(["correct", "acceptable_alternative", "stylistic_difference", "incorrect"]),
          category: z.string().nullable(),
          explanation: z.string(),
        }),
      ),
    }),
    effort: "medium",
  });
  return res.data.items;
}

export async function aiGradeTranslations(
  items: Array<{ index: number; source: string; references: string[]; keyPoints: string[]; answer: string }>,
  conceptIds: string[],
  lang: Lang,
): Promise<Array<{ index: number; meaning: number; grammar: number; vocabulary: number; corrected: string; errors: z.infer<typeof ErrorSchema>[]; conceptIds: string[] }>> {
  const res = await generate({
    task: "exam-grade-translation",
    system: systemPrompt(lang),
    prompt: [
      "Grade these translations into European Spanish. Rubric per item (3 points):",
      "- meaning: 1 if the meaning is fully rendered, 0.5 if partially, 0 if wrong or missing;",
      "- grammar: 1 if grammar and conjugation are correct, 0.5 for one minor error, 0 otherwise;",
      "- vocabulary: 1 for accurate and natural vocabulary, 0.5 for one imprecision, 0 otherwise.",
      "Accept any valid translation, not only the references. corrected: the learner's sentence minimally corrected.",
      `errors: each error with category (grammar, conjugation, vocabulary, orthography, style), original, correction, explanation in ${LANG_NAME[lang]} (at most 25 words).`,
      `conceptIds: ids among ${conceptIds.join(", ")} related to the errors.`,
      JSON.stringify(items),
    ].join("\n"),
    schema: z.object({
      items: z.array(
        z.object({
          index: z.number(),
          meaning: z.number(),
          grammar: z.number(),
          vocabulary: z.number(),
          corrected: z.string(),
          errors: z.array(ErrorSchema),
          conceptIds: z.array(z.string()),
        }),
      ),
    }),
    effort: "medium",
  });
  return res.data.items;
}

export interface WritingGrade {
  criteria: Array<{ key: "task" | "grammar" | "conjugation" | "vocabulary" | "coherence"; score: number; comment: string }>;
  corrected: string;
  errors: z.infer<typeof ErrorSchema>[];
  summary: string;
  conceptIds: string[];
}

export async function aiGradeWriting(prompt: string, text: string, minWords: number, level: number, concepts: ConceptBrief[], lang: Lang): Promise<WritingGrade> {
  const res = await generate({
    task: "exam-grade-writing",
    system: systemPrompt(lang),
    prompt: [
      `Grade this Spanish text written for an examination (learner level ${level} of 6, minimum ${minWords} words).`,
      `Task: ${prompt}`,
      `Text (${wordCount(text)} words):\n"""${text}"""`,
      "Rubric, each criterion scored 0 to 6 (integers or halves):",
      "- task: fulfils the task, develops ideas, respects the length;",
      "- grammar: accuracy of agreement, pronouns, prepositions, word order, moods;",
      "- conjugation: correct tenses and forms;",
      "- vocabulary: range, precision, natural European Spanish;",
      "- coherence: organisation, connectors, clarity.",
      "Judge against the learner's level but do not ignore errors. A text far below the minimum length cannot score above 3 on task.",
      `comment per criterion and summary in ${LANG_NAME[lang]} (summary at most 60 words). corrected: the full text minimally corrected.`,
      `errors: the most important errors (at most 12) with category, original, correction and explanation in ${LANG_NAME[lang]}.`,
      `conceptIds: ids among ${concepts.map((c) => `${c.id} (${c.title})`).join(", ")} that the errors relate to.`,
    ].join("\n"),
    schema: z.object({
      criteria: z.array(z.object({ key: z.enum(["task", "grammar", "conjugation", "vocabulary", "coherence"]), score: z.number(), comment: z.string() })),
      corrected: z.string(),
      errors: z.array(ErrorSchema),
      summary: z.string(),
      conceptIds: z.array(z.string()),
    }),
    effort: "high",
    validate: (r) => {
      const keys = new Set(r.criteria.map((c) => c.key));
      return ["task", "grammar", "conjugation", "vocabulary", "coherence"].filter((k) => !keys.has(k as never)).map((k) => `missing criterion ${k}`);
    },
  });
  return res.data;
}

export function exactTranslationMatch(answer: string, references: string[]): boolean {
  const a = sentenceKey(answer);
  return references.some((r) => sentenceKey(r) === a);
}
