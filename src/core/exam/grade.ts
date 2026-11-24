/**
 * Exam grading in the browser: dictation, conjugation and closed grammar items
 * are graded exactly; open answers get an approximate score from the closest
 * reference; the writing is self-assessed against a rubric and a model answer.
 * Results are fed back into the learner model so the next week's sessions respond.
 */
import { desc, eq, and, ne, isNotNull } from "drizzle-orm";
import { CONJUGATION_UNITS, GRAMMAR_CONCEPTS } from "@/content";
import { gradeConjugation, normalizeConjAnswer } from "@/lib/conjugation/diagnose";
import type { Lang } from "@/lib/i18n/types";
import { similarity, sentenceKey, wordCount } from "@/lib/text";
import type { DB } from "../db/client";
import { attempts, exams } from "../db/schema";
import { localDate } from "../engine/clock";
import { recordWeakness, relieveWeakness, topWeaknesses } from "../engine/weaknesses";
import { gradeDictation } from "../grading/dictation";
import { expectedText, gradeGrammar } from "../grading/grammar";
import { applyExamEvidence } from "../services/progress-store";
import { EXAM_PARTS, PART_POINTS, type ExamGrading, type ExamKey, type ExamPartKey, type ExamResponses, type ItemCorrection } from "./types";

const round1 = (x: number) => Math.round(x * 10) / 10;

/** Writing rubric: five criteria scored 0 to 6 by the learner (30 points). */
export const WRITING_CRITERIA = ["task", "grammar", "conjugation", "vocabulary", "coherence"] as const;
export const WRITING_CRITERION_MAX = 6;

function exactTranslationMatch(answer: string, references: string[]): boolean {
  const a = sentenceKey(answer);
  return references.some((r) => sentenceKey(r) === a);
}

/** 0 to 1 from the similarity to the closest reference (half credit starts at 75% similarity). */
function approximateCredit(answer: string, references: string[]): number {
  const best = Math.max(0, ...references.map((ref) => similarity(sentenceKey(ref), sentenceKey(answer))));
  return Math.max(0, (best - 0.5) / 0.5);
}

function emptyParts(): ExamGrading["parts"] {
  return Object.fromEntries(EXAM_PARTS.map((p) => [p, { score: null, max: PART_POINTS[p], items: [], notes: [] }])) as unknown as ExamGrading["parts"];
}

export async function gradeExam(db: DB, examId: string, tz: string, now: Date): Promise<ExamGrading> {
  const exam = (await db.select().from(exams).where(eq(exams.id, examId)))[0];
  if (!exam || !exam.content || !exam.key) throw new Error("Exam not found or not generated");
  const key = exam.key as ExamKey;
  const r = (exam.responses ?? {}) as ExamResponses;
  const lang = exam.lang as Lang;
  const today = localDate(now, tz);
  const parts = emptyParts();
  const categories: Record<string, number> = {};
  const conceptResults = new Map<string, { score: number; n: number }>();
  const addCategory = (c: string | null | undefined) => {
    if (c) categories[c] = (categories[c] ?? 0) + 1;
  };
  const addConcept = (id: string | undefined, score: number) => {
    if (!id) return;
    const cur = conceptResults.get(id) ?? { score: 0, n: 0 };
    conceptResults.set(id, { score: cur.score + score, n: cur.n + 1 });
  };

  // Part 1: dictation
  const dict = gradeDictation(key.dictation.text, r.dictation ?? "", PART_POINTS.dictation);
  parts.dictation.score = dict.score;
  for (const [t, n] of Object.entries(dict.counts)) if (n) categories[`dictation:${t}`] = n;
  const dictation: ExamGrading["dictation"] = { tokens: dict.tokens, counts: dict.counts, reference: key.dictation.text };

  // Part 2: conjugation (1 point each, scaled to 20)
  const perConj = PART_POINTS.conjugation / Math.max(1, key.conjugation.length);
  let conjScore = 0;
  for (const k of key.conjugation) {
    const answer = r.conjugation?.[k.id] ?? "";
    const direct = k.answers.some((f) => normalizeConjAnswer(f) === normalizeConjAnswer(answer));
    const g = gradeConjugation(k.verb, k.tense, k.person, answer, k.alternatives);
    const correct = direct || g.correct;
    const points = correct ? perConj : 0;
    conjScore += points;
    if (!correct) addCategory(g.category);
    addConcept(k.unitId, correct ? 1 : 0);
    parts.conjugation.items.push({
      id: k.id,
      answer,
      expected: k.answers[0] ?? g.expected,
      points: round1(points),
      maxPoints: round1(perConj),
      correct,
      category: correct ? null : g.category,
      explanation: correct ? null : (g.explanation?.[lang] ?? null),
    });
    await db.insert(attempts).values({
      examId,
      module: "exam",
      conceptId: k.unitId,
      type: "exam-conjugation",
      prompt: { verb: k.verb, tense: k.tense, person: k.person },
      answer,
      expected: k.answers[0] ?? "",
      correct,
      score: correct ? 1 : 0,
      errorCategory: correct ? null : g.category,
      gradedBy: "deterministic",
      verb: k.verb,
      tense: k.tense,
      person: k.person,
      localDate: today,
    });
    if (!correct) await recordWeakness(db, "verb", k.verb, 1.5, now);
  }
  parts.conjugation.score = round1(conjScore);

  // Part 3: grammar (2 points each)
  const perGrammar = PART_POINTS.grammar / Math.max(1, key.grammar.length);
  const undecided: Array<{ index: number; type: string; source: string | null; es: string | null; references: string[]; answer: string }> = [];
  const grammarItems: ItemCorrection[] = [];
  key.grammar.forEach((k, index) => {
    const raw = r.grammar?.[k.id] ?? "";
    const g = gradeGrammar(k.data, raw);
    const answer = Array.isArray(raw) ? raw.join(" / ") : raw;
    let points = 0;
    if (g.decided) {
      if (g.correct) points = perGrammar;
      else if (g.perBlank && g.perBlank.length > 1) points = perGrammar * (g.perBlank.filter(Boolean).length / g.perBlank.length) * 0.5;
    }
    grammarItems.push({
      id: k.id,
      answer,
      expected: expectedText(k.data),
      points: round1(points),
      maxPoints: round1(perGrammar),
      correct: g.decided && g.correct,
      category: g.decided && !g.correct ? g.category : null,
      explanation: k.data.explanation[lang],
      pending: !g.decided,
    });
    if (!g.decided) undecided.push({ index, type: k.data.type, source: k.data.prompt?.[lang] ?? null, es: k.data.es ?? null, references: k.data.answers ?? [], answer });
  });
  // Open answers that match no reference: approximate credit from the closest reference.
  for (const u of undecided) {
    const item = grammarItems[u.index]!;
    const credit = u.answer.trim() ? approximateCredit(u.answer, u.references) : 0;
    item.points = round1(credit * perGrammar);
    item.correct = credit >= 0.9;
    item.category = item.correct ? null : "approximate";
    item.pending = false;
  }
  if (undecided.length) parts.grammar.notes.push("approximate");
  let grammarScore = 0;
  for (const [i, item] of grammarItems.entries()) {
    grammarScore += item.points;
    const k = key.grammar[i]!;
    if (!item.pending) {
      addConcept(k.conceptId, item.correct ? 1 : 0);
      if (!item.correct) addCategory(item.category);
      await db.insert(attempts).values({
        examId,
        module: "exam",
        conceptId: k.conceptId,
        type: `exam-${k.data.type}`,
        prompt: { es: k.data.es ?? null, prompt: k.data.prompt ?? null },
        answer: item.answer,
        expected: item.expected,
        correct: item.correct,
        score: item.correct ? 1 : 0,
        errorCategory: item.category,
        gradedBy: undecided.some((u) => u.index === i) ? "approximate" : "deterministic",
        localDate: today,
      });
    }
  }
  parts.grammar.items = grammarItems;
  parts.grammar.score = round1(grammarScore);

  // Part 4: translation (3 points each, scaled to 15)
  const perTr = PART_POINTS.translation / Math.max(1, key.translation.length);
  const trItems: ItemCorrection[] = key.translation.map((k) => ({
    id: k.id,
    answer: r.translation?.[k.id] ?? "",
    expected: k.references[0] ?? "",
    points: 0,
    maxPoints: round1(perTr),
    correct: false,
    category: null,
    explanation: null,
    pending: true,
  }));
  key.translation.forEach((k, index) => {
    const item = trItems[index]!;
    if (!item.answer.trim()) {
      item.pending = false;
      return;
    }
    if (exactTranslationMatch(item.answer, k.references)) {
      item.pending = false;
      item.correct = true;
      item.points = round1(perTr);
      return;
    }
  });
  // Other answers: approximate credit from the closest reference.
  for (const [i, item] of trItems.entries()) {
    if (!item.pending) continue;
    item.points = round1(approximateCredit(item.answer, key.translation[i]!.references) * perTr);
    item.explanation = null;
    item.pending = false;
    item.category = "approximate";
    if (!parts.translation.notes.includes("approximate")) parts.translation.notes.push("approximate");
  }
  parts.translation.items = trItems;
  parts.translation.score = round1(trItems.reduce((s, x) => s + x.points, 0));

  // Part 5: writing (rubric, 30 points), self-assessed on the results page against the model answer.
  const text = r.writing ?? "";
  const words = wordCount(text);
  const writing: ExamGrading["writing"] = { criteria: [], corrected: "", errors: [], summary: "", wordCount: words, model: key.writing.model ?? null };
  if (!text.trim()) parts.writing.score = 0;
  else parts.writing.notes.push("self-assessment");

  // Learner model updates: exam evidence counts double for weaknesses.
  for (const [conceptId, res] of conceptResults) {
    const avg = res.n ? res.score / res.n : 0;
    const kind = conceptId.startsWith("c-") ? "conjugation" : "grammar";
    await applyExamEvidence(db, conceptId, kind, avg, now, today);
    if (avg < 0.7) await recordWeakness(db, "concept", conceptId, 2 * (1 - avg), now);
    else await relieveWeakness(db, "concept", conceptId, 0.5, now);
  }
  for (const [cat, n] of Object.entries(categories)) {
    if (!cat.startsWith("dictation:")) await recordWeakness(db, "error", cat, Math.min(2, n * 0.4), now);
  }

  const weak = await topWeaknesses(db, now, "concept", 5, 0.5);
  const recommendations = weak.map((w) => ({
    conceptId: w.id,
    title: GRAMMAR_CONCEPTS.find((c) => c.id === w.id)?.title ?? conceptTitleUnit(w.id),
    reason: conceptResults.has(w.id) ? "exam" : "history",
  }));

  const previous = (
    await db
      .select({ score: exams.score })
      .from(exams)
      .where(and(ne(exams.id, examId), isNotNull(exams.score), eq(exams.status, "graded")))
      .orderBy(desc(exams.weekOf))
      .limit(1)
  )[0];

  const provisional = EXAM_PARTS.some((p) => parts[p].score === null);
  return { parts, dictation, writing, categories, recommendations, previousScore: previous?.score ?? null, provisional };
}

function conceptTitleUnit(id: string) {
  return CONJUGATION_UNITS.find((u) => u.id === id)?.title ?? { en: id, fr: id };
}

export function totalScore(g: ExamGrading): number {
  return round1(EXAM_PARTS.reduce((s, p: ExamPartKey) => s + (g.parts[p].score ?? 0), 0));
}
