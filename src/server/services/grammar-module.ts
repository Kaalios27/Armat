/**
 * Grammar module: lesson (full or recap), focus exercises, mixed revision.
 * Closed answers are graded deterministically; open answers that differ from
 * the references are judged by the AI so valid alternatives are accepted.
 */
import { and, desc, eq, inArray, isNull, or, sql } from "drizzle-orm";
import { GRAMMAR_CONCEPTS } from "@/content";
import type { GrammarExerciseData, LessonContent } from "@/content/types";
import { exerciseHash } from "@/lib/exercise-hash";
import type { Lang, Localized } from "@/lib/i18n/types";
import { pick, seededRandom, shuffle } from "@/lib/text";
import { AIUnavailableError, aiEnabled } from "../ai/provider";
import { aiEvaluateGrammar, aiGrammarExercises, aiLesson } from "../ai/tasks";
import type { DB } from "../db/client";
import { attempts, concepts, conceptProgress, exercises, lessons, sessionItems, vocabCards, vocabItems } from "../db/schema";
import { recordWeakness, relieveWeakness } from "../engine/weaknesses";
import { gradeGrammar, type GrammarCategory } from "../grading/grammar";
import { lessonItem } from "./conj-module";
import { correctConceptAttempt, recordConceptAttempt } from "./progress-store";
import type { AnswerBody, ItemRow, ModuleContext, NewItem } from "./session-types";

type ExerciseRow = typeof exercises.$inferSelect;

async function conceptInfo(db: DB, conceptId: string, lang: Lang) {
  const c = (await db.select().from(concepts).where(eq(concepts.id, conceptId)))[0];
  return c ? { id: c.id, title: c.title[lang], objectives: c.objectives[lang], cefr: c.cefr, titleLoc: c.title } : null;
}

/** Ensure a lesson exists for the concept in this language, generating it with the AI when needed. */
export async function ensureLesson(db: DB, conceptId: string, lang: Lang): Promise<LessonContent | null> {
  const existing = (await db.select().from(lessons).where(and(eq(lessons.conceptId, conceptId), eq(lessons.lang, lang))))[0];
  if (existing) return existing.content as LessonContent;
  if (!aiEnabled()) return null;
  const info = await conceptInfo(db, conceptId, lang);
  if (!info) return null;
  const idx = GRAMMAR_CONCEPTS.findIndex((c) => c.id === conceptId);
  const prior = GRAMMAR_CONCEPTS.slice(0, Math.max(0, idx)).map((c) => c.title[lang]);
  try {
    const content = await aiLesson(info, lang, prior);
    await db.insert(lessons).values({ conceptId, lang, content, source: "ai" }).onConflictDoNothing();
    return content;
  } catch (err) {
    if (err instanceof AIUnavailableError) return null;
    throw err;
  }
}

async function knownWords(db: DB, limit = 40): Promise<string[]> {
  const rows = await db
    .selectDistinct({ lemma: vocabItems.lemma })
    .from(vocabCards)
    .innerJoin(vocabItems, eq(vocabItems.id, vocabCards.itemId))
    .orderBy(vocabItems.lemma)
    .limit(limit);
  return rows.map((r) => r.lemma);
}

function exercisePool(db: DB, conceptIds: string[], lang: Lang) {
  return db
    .select()
    .from(exercises)
    .where(and(inArray(exercises.conceptId, conceptIds), eq(exercises.retired, false), or(isNull(exercises.lang), eq(exercises.lang, lang))));
}

/** Generate and store new exercises for a concept. Returns how many were added. */
export async function generateExercises(db: DB, conceptId: string, lang: Lang, count = 8): Promise<number> {
  if (!aiEnabled()) return 0;
  const info = await conceptInfo(db, conceptId, lang);
  if (!info) return 0;
  const lesson = await ensureLesson(db, conceptId, lang);
  const existing = await exercisePool(db, [conceptId], lang);
  const errors = await db
    .select({ answer: attempts.answer, expected: attempts.expected })
    .from(attempts)
    .where(and(eq(attempts.conceptId, conceptId), eq(attempts.correct, false)))
    .orderBy(desc(attempts.createdAt))
    .limit(8);
  const generated = await aiGrammarExercises({
    concept: info,
    lang,
    lesson,
    count,
    knownWords: await knownWords(db),
    avoid: existing.map((e) => (e.data as GrammarExerciseData).es ?? (e.data as GrammarExerciseData).prompt?.[lang] ?? "").filter(Boolean),
    recentErrors: errors.map((e) => `wrote "${e.answer}" instead of "${e.expected}"`),
  });
  let added = 0;
  for (const data of generated) {
    const hash = exerciseHash(conceptId, data);
    const res = await db
      .insert(exercises)
      .values({ id: `ai-${hash}`, conceptId, type: data.type, lang, data, difficulty: 2, source: "ai", contentHash: hash })
      .onConflictDoNothing()
      .returning({ id: exercises.id });
    added += res.length;
  }
  return added;
}

/** Background top-up of the exercise bank for a concept when few unseen exercises remain. */
export async function prefetchExercises(db: DB, conceptId: string, lang: Lang): Promise<void> {
  if (!aiEnabled()) return;
  const pool = await exercisePool(db, [conceptId], lang);
  const tried = await db
    .selectDistinct({ id: attempts.exerciseId })
    .from(attempts)
    .where(eq(attempts.conceptId, conceptId));
  const triedIds = new Set(tried.map((t) => t.id));
  const unseen = pool.filter((e) => !triedIds.has(e.id)).length;
  if (unseen < 10) {
    try {
      await generateExercises(db, conceptId, lang, 8);
    } catch {
      // Prefetch is best effort.
    }
  }
}

async function chooseExercise(ctx: ModuleContext, conceptIds: string[], servedIds: Set<string>): Promise<ExerciseRow | null> {
  const pool = (await exercisePool(ctx.db, conceptIds, ctx.lang)).filter((e) => !servedIds.has(e.id));
  if (!pool.length) return null;
  const history = await ctx.db
    .select({ exerciseId: attempts.exerciseId, correct: attempts.correct, createdAt: attempts.createdAt })
    .from(attempts)
    .where(inArray(attempts.conceptId, conceptIds))
    .orderBy(desc(attempts.createdAt))
    .limit(500);
  const last = new Map<string, { correct: boolean; at: number }>();
  for (const h of history) if (h.exerciseId && !last.has(h.exerciseId)) last.set(h.exerciseId, { correct: h.correct, at: h.createdAt.getTime() });
  const rank = (e: ExerciseRow) => {
    const l = last.get(e.id);
    if (!l) return 0;
    if (!l.correct) return 1;
    return 2;
  };
  const rand = seededRandom(`${ctx.session.id}:${servedIds.size}`);
  const sorted = shuffle(pool, rand).sort((a, b) => rank(a) - rank(b) || (last.get(a.id)?.at ?? 0) - (last.get(b.id)?.at ?? 0));
  return sorted[0] ?? null;
}

function exerciseItem(e: ExerciseRow, segment: string, conceptTitle: Localized, rand: () => number): NewItem {
  const d = e.data as GrammarExerciseData;
  return {
    segment,
    kind: "grammar-exercise",
    ref: e.conceptId,
    payload: {
      exerciseId: e.id,
      conceptId: e.conceptId,
      conceptTitle,
      type: d.type,
      prompt: d.prompt ?? null,
      es: d.es ?? null,
      tokens: d.tokens ? shuffle(d.tokens, rand) : null,
      options: d.options ? shuffle(d.options, rand) : null,
      blanks: d.type === "fill" || d.type === "distinguish" ? (d.blanks ?? []).length : 0,
      hint: d.hint ?? null,
    },
    key: { exerciseId: e.id },
  };
}

export async function nextGrammar(ctx: ModuleContext): Promise<NewItem | null> {
  const plan = ctx.plan.grammar;
  const items = await ctx.db
    .select()
    .from(sessionItems)
    .where(and(eq(sessionItems.sessionId, ctx.session.id), eq(sessionItems.module, "grammar")))
    .orderBy(desc(sessionItems.seq));
  const served = new Set(items.map((i) => String((i.key as { exerciseId?: string } | null)?.exerciseId ?? "")).filter(Boolean));
  const rand = seededRandom(`${ctx.session.id}:grammar:${items.length}`);

  if (plan.focus && !items.some((i) => i.kind === "grammar-lesson")) {
    await ensureLesson(ctx.db, plan.focus, ctx.lang);
    const lesson = await lessonItem(ctx, plan.focus, plan.isNew ? "full" : "recap", "grammar");
    if (lesson) return lesson;
  }

  const inMixed = ctx.elapsedMs >= ctx.moduleMs * 0.75 && plan.review.length > 0;
  const titles = new Map<string, Localized>();
  const titleOf = async (id: string) => {
    if (!titles.has(id)) titles.set(id, (await conceptInfo(ctx.db, id, ctx.lang))?.titleLoc ?? { en: id, fr: id });
    return titles.get(id)!;
  };

  const tryConcepts = async (ids: string[], segment: string) => {
    const e = await chooseExercise(ctx, ids, served);
    return e ? exerciseItem(e, segment, await titleOf(e.conceptId), rand) : null;
  };

  if (inMixed) {
    const order = shuffle(plan.review, rand);
    const item = await tryConcepts(order.slice(0, 2), "mixed");
    if (item) return item;
  }
  if (plan.focus) {
    const item = await tryConcepts([plan.focus], inMixed ? "mixed" : "practice");
    if (item) return item;
    // Bank exhausted: generate more for the focus concept, then retry.
    if (aiEnabled()) {
      try {
        if ((await generateExercises(ctx.db, plan.focus, ctx.lang, 6)) > 0) {
          const again = await tryConcepts([plan.focus], "practice");
          if (again) return again;
        }
      } catch {
        // Fall through to revision.
      }
    }
  }
  if (plan.review.length) {
    const item = await tryConcepts(plan.review, "mixed");
    if (item) return item;
  }
  // Recycle exercises from any introduced concept, least recently seen first.
  const introduced = (await ctx.db.select({ id: conceptProgress.conceptId }).from(conceptProgress).innerJoin(concepts, eq(concepts.id, conceptProgress.conceptId)).where(eq(concepts.kind, "grammar"))).map((r) => r.id);
  if (introduced.length) {
    const item = await tryConcepts(introduced, "mixed");
    if (item) return item;
    const pool = await exercisePool(ctx.db, introduced, ctx.lang);
    if (pool.length) {
      const e = pick(pool, rand);
      return exerciseItem(e, "mixed", await titleOf(e.conceptId), rand);
    }
  }
  return null;
}

export interface GrammarResult {
  correct: boolean;
  decided: boolean;
  category: GrammarCategory | null;
  expected: string;
  accepted: string[];
  explanation: Localized;
  aiExplanation?: string | null;
  correction?: string | null;
  perBlank?: boolean[];
  gradedBy: "deterministic" | "ai" | "learner";
  unverified?: boolean;
  overridden?: boolean;
  masteryBefore?: number;
  attemptId?: string;
}

export async function answerGrammar(ctx: ModuleContext, item: ItemRow, body: AnswerBody): Promise<GrammarResult | { ok: true }> {
  if (item.kind === "grammar-lesson") return { ok: true };
  const exerciseId = String((item.key as { exerciseId?: string }).exerciseId);
  const e = (await ctx.db.select().from(exercises).where(eq(exercises.id, exerciseId)))[0];
  if (!e) throw new Error("Exercise not found");
  const d = e.data as GrammarExerciseData;

  if (body.override && item.status === "done" && item.result) {
    const prev = item.result as unknown as GrammarResult;
    if (prev.correct) return prev;
    if (prev.attemptId) await ctx.db.update(attempts).set({ correct: true, score: 1, gradedBy: "learner" }).where(eq(attempts.id, prev.attemptId));
    if (prev.masteryBefore !== undefined) await correctConceptAttempt(ctx.db, e.conceptId, "grammar", prev.masteryBefore, ctx.now);
    // A learner-validated answer becomes an accepted alternative for open formats.
    const given = typeof body.answer === "string" ? body.answer : null;
    if (given && !["fill", "distinguish", "choose"].includes(d.type)) {
      await ctx.db.update(exercises).set({ data: { ...d, answers: [...(d.answers ?? []), given] } }).where(eq(exercises.id, e.id));
    }
    await relieveWeakness(ctx.db, "concept", e.conceptId, 0.5, ctx.now);
    return { ...prev, correct: true, category: null, gradedBy: "learner", overridden: true };
  }

  const answer = body.answer ?? "";
  const g = gradeGrammar(d, answer);
  let result: GrammarResult = {
    correct: g.correct,
    decided: g.decided,
    category: g.category,
    expected: g.expected,
    accepted: d.answers ?? (d.blanks ?? []).map((b) => b.join(" / ")),
    explanation: d.explanation,
    perBlank: g.perBlank,
    gradedBy: "deterministic",
  };
  if (!g.decided) {
    const info = await conceptInfo(ctx.db, e.conceptId, ctx.lang);
    if (aiEnabled()) {
      try {
        const ev = await aiEvaluateGrammar(d, Array.isArray(answer) ? answer.join(" ") : answer, ctx.lang, info?.title ?? e.conceptId);
        const ok = ev.verdict !== "incorrect";
        result = {
          ...result,
          correct: ok,
          decided: true,
          category: ev.verdict === "acceptable_alternative" ? "alternative" : ev.verdict === "stylistic_difference" ? "style" : ok ? null : (ev.category ?? "grammar"),
          aiExplanation: ev.explanation,
          correction: ev.correction,
          gradedBy: "ai",
        };
      } catch {
        result = { ...result, unverified: true };
      }
    } else {
      result = { ...result, unverified: true };
    }
  }

  const score = result.correct ? 1 : 0;
  const { before } = await recordConceptAttempt(ctx.db, e.conceptId, "grammar", score, ctx.now, ctx.today);
  const [row] = await ctx.db
    .insert(attempts)
    .values({
      sessionId: ctx.session.id,
      module: "grammar",
      conceptId: e.conceptId,
      exerciseId: e.id,
      type: d.type,
      prompt: { es: d.es ?? null, prompt: d.prompt ?? null },
      answer: Array.isArray(answer) ? answer.join(" | ") : answer,
      expected: result.expected,
      correct: result.correct,
      score,
      errorCategory: result.correct ? (result.category === "alternative" || result.category === "style" ? result.category : null) : (result.category ?? "unverified"),
      gradedBy: result.gradedBy,
      feedback: { explanation: result.explanation, ai: result.aiExplanation ?? null, correction: result.correction ?? null },
      responseMs: typeof body.responseMs === "number" ? Math.round(body.responseMs) : null,
      localDate: ctx.today,
    })
    .returning({ id: attempts.id });
  if (!result.correct) {
    await recordWeakness(ctx.db, "concept", e.conceptId, 1, ctx.now);
    if (result.category) await recordWeakness(ctx.db, "error", result.category, 0.5, ctx.now);
  } else {
    await relieveWeakness(ctx.db, "concept", e.conceptId, 0.2, ctx.now);
  }
  return { ...result, masteryBefore: before, attemptId: row?.id };
}

export async function conceptAccuracyToday(db: DB, sessionId: string, module: "grammar" | "conjugation"): Promise<Map<string, number>> {
  const rows = await db
    .select({ conceptId: attempts.conceptId, avg: sql<number>`avg(${attempts.score})::float` })
    .from(attempts)
    .where(and(eq(attempts.sessionId, sessionId), eq(attempts.module, module)))
    .groupBy(attempts.conceptId);
  return new Map(rows.filter((r) => r.conceptId).map((r) => [r.conceptId!, r.avg]));
}
