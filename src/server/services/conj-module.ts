/**
 * Conjugation module: lesson (new unit) or recap (consolidation), focus
 * drills, then mixed revision across earlier units. Graded deterministically.
 */
import { and, desc, eq } from "drizzle-orm";
import { getUnit } from "@/content/conjugation";
import { gradeConjugation, normalizeConjAnswer, type ConjErrorCategory } from "@/lib/conjugation/diagnose";
import { buildDrill, canDrill, chooseDrillType, nextVerb, verbsByLevel, type ConjDrill, type ConjKey } from "@/lib/conjugation/drills";
import { conjugate } from "@/lib/conjugation/engine";
import type { Tense } from "@/lib/conjugation/types";
import type { Localized } from "@/lib/i18n/types";
import { pick, seededRandom } from "@/lib/text";
import { attempts, lessons, sessionItems } from "../db/schema";
import { recordWeakness, relieveWeakness } from "../engine/weaknesses";
import { correctConceptAttempt, ensureIntroduced, getProgress, recordConceptAttempt } from "./progress-store";
import type { AnswerBody, ItemRow, ModuleContext, NewItem } from "./session-types";

async function recentItems(ctx: ModuleContext, limit = 14): Promise<ItemRow[]> {
  return ctx.db
    .select()
    .from(sessionItems)
    .where(and(eq(sessionItems.sessionId, ctx.session.id), eq(sessionItems.module, "conjugation")))
    .orderBy(desc(sessionItems.seq))
    .limit(limit);
}

export async function lessonItem(ctx: ModuleContext, conceptId: string, mode: "full" | "recap", module: "conjugation" | "grammar"): Promise<NewItem | null> {
  const row = (await ctx.db.select().from(lessons).where(and(eq(lessons.conceptId, conceptId), eq(lessons.lang, ctx.lang))))[0];
  if (!row) return null;
  await ensureIntroduced(ctx.db, conceptId, ctx.now, ctx.today);
  const tables =
    module === "conjugation"
      ? (() => {
          const unit = getUnit(conceptId);
          const content = row.content as { tableVerbs?: string[] };
          const verbs = (content.tableVerbs ?? []).slice(0, 3);
          return unit ? verbs.map((v) => ({ verb: v, tense: unit.tenses[0]!, forms: conjugate(v, unit.tenses[0]!) })) : [];
        })()
      : [];
  return {
    segment: "lesson",
    kind: `${module === "conjugation" ? "conj" : "grammar"}-lesson`,
    ref: conceptId,
    payload: { conceptId, mode, content: row.content, tables },
    key: null,
  };
}

export async function nextConjugation(ctx: ModuleContext): Promise<NewItem | null> {
  const plan = ctx.plan.conjugation;
  const recent = await recentItems(ctx);
  const lessonShown = recent.some((i) => i.kind === "conj-lesson") || (await hasKind(ctx, "conj-lesson"));
  if (!lessonShown) {
    const item = await lessonItem(ctx, plan.focus, plan.isNew ? "full" : "recap", "conjugation");
    if (item) return item;
  }

  const inMixed = ctx.elapsedMs >= ctx.moduleMs * 0.75 && plan.review.length > 0;
  const seq = (recent[0]?.seq ?? 0) + 1;
  const rand = seededRandom(`${ctx.session.id}:conj:${seq}`);
  const unitId = inMixed ? (rand() < 0.3 ? plan.focus : pick(plan.review, rand)) : plan.focus;
  const unit = getUnit(unitId);
  if (!unit) return null;
  const progress = await getProgress(ctx.db, unitId);
  const mastery = progress?.mastery ?? 0;
  const tense: Tense = pick(unit.tenses, rand);
  const pool = verbsByLevel(unit.verbs.filter((v) => canDrill(v, tense)), mastery < 0.4 ? 1 : mastery < 0.7 ? 2 : 3);
  if (!pool.length) return null;
  const recentVerbs = recent.map((i) => String((i.payload as { drill?: ConjDrill }).drill?.verb ?? "")).filter(Boolean);
  const verb = nextVerb(pool, recentVerbs, plan.weakVerbs, rand);
  const tableRecently = recent.slice(0, 12).some((i) => (i.payload as { drill?: ConjDrill }).drill?.type === "table");
  const type = chooseDrillType(mastery, tense, rand, !tableRecently);
  const { drill, key } = buildDrill({ verb, tense, type, rand });
  return {
    segment: inMixed ? "mixed" : "practice",
    kind: "conj-drill",
    ref: unitId,
    payload: { unitId, unitTitle: unit.title, drill },
    key: key as unknown as Record<string, unknown>,
  };
}

async function hasKind(ctx: ModuleContext, kind: string): Promise<boolean> {
  const rows = await ctx.db
    .select({ id: sessionItems.id })
    .from(sessionItems)
    .where(and(eq(sessionItems.sessionId, ctx.session.id), eq(sessionItems.kind, kind)))
    .limit(1);
  return rows.length > 0;
}

export interface ConjResult {
  correct: boolean;
  score: number;
  category: ConjErrorCategory | null;
  expected: string;
  accepted: string[];
  explanation: Localized | null;
  note: Localized | null;
  perPerson?: Array<{ person: number; correct: boolean; expected: string; answer: string }>;
  overridden?: boolean;
  masteryBefore?: number;
  attemptId?: string;
}

export function gradeDrill(drill: ConjDrill, key: ConjKey, answer: string | string[]): ConjResult {
  if (drill.type === "table") {
    const given = Array.isArray(answer) ? answer : [answer];
    const persons = drill.persons ?? [];
    const perPerson = persons.map((person, i) => {
      const accepted = key.table?.[i] ?? [];
      const a = normalizeConjAnswer(given[i] ?? "");
      return { person, correct: accepted.some((f) => normalizeConjAnswer(f) === a), expected: accepted[0] ?? "", answer: given[i] ?? "" };
    });
    const nCorrect = perPerson.filter((p) => p.correct).length;
    const firstWrong = perPerson.find((p) => !p.correct);
    const diag = firstWrong ? gradeConjugation(drill.verb, drill.tense, firstWrong.person as never, firstWrong.answer) : null;
    return {
      correct: nCorrect === persons.length,
      score: persons.length ? nCorrect / persons.length : 0,
      category: diag?.category ?? null,
      expected: perPerson.map((p) => p.expected).join(", "),
      accepted: [],
      explanation: diag?.explanation ?? null,
      note: null,
      perPerson,
    };
  }
  const text = Array.isArray(answer) ? answer.join(" ") : answer;
  const a = normalizeConjAnswer(text);
  const direct = key.answers.some((f) => normalizeConjAnswer(f) === a);
  const g = gradeConjugation(drill.verb, drill.tense, drill.person!, text, key.alternatives);
  const correct = direct || g.correct;
  return {
    correct,
    score: correct ? 1 : 0,
    category: correct ? null : g.category,
    expected: key.answers[0] ?? g.expected,
    accepted: key.answers,
    explanation: correct ? null : g.explanation,
    note: correct ? g.note ?? null : null,
  };
}

export async function answerConjugation(ctx: ModuleContext, item: ItemRow, body: AnswerBody): Promise<ConjResult | { ok: true }> {
  if (item.kind === "conj-lesson") return { ok: true };
  const { drill, unitId } = item.payload as { drill: ConjDrill; unitId: string };
  const key = item.key as unknown as ConjKey;

  if (body.override && item.status === "done" && item.result) {
    const prev = item.result as unknown as ConjResult;
    if (prev.correct) return prev;
    if (prev.attemptId) await ctx.db.update(attempts).set({ correct: true, score: 1, gradedBy: "learner" }).where(eq(attempts.id, prev.attemptId));
    if (prev.masteryBefore !== undefined) await correctConceptAttempt(ctx.db, unitId, "conjugation", prev.masteryBefore, ctx.now);
    await relieveWeakness(ctx.db, "verb", drill.verb, 1, ctx.now);
    return { ...prev, correct: true, score: 1, category: null, overridden: true };
  }

  const result = gradeDrill(drill, key, body.answer ?? "");
  const { before } = await recordConceptAttempt(ctx.db, unitId, "conjugation", result.score, ctx.now, ctx.today);
  const [row] = await ctx.db
    .insert(attempts)
    .values({
      sessionId: ctx.session.id,
      module: "conjugation",
      conceptId: unitId,
      type: drill.type,
      prompt: drill as unknown as object,
      answer: Array.isArray(body.answer) ? body.answer.join(" | ") : (body.answer ?? ""),
      expected: result.expected,
      correct: result.correct,
      score: result.score,
      errorCategory: result.category,
      gradedBy: "deterministic",
      feedback: { explanation: result.explanation, note: result.note },
      verb: drill.verb,
      tense: drill.tense,
      person: drill.person,
      responseMs: typeof body.responseMs === "number" ? Math.round(body.responseMs) : null,
      localDate: ctx.today,
    })
    .returning({ id: attempts.id });

  if (!result.correct) {
    await recordWeakness(ctx.db, "verb", drill.verb, 1, ctx.now);
    await recordWeakness(ctx.db, "tense", drill.tense, 0.5, ctx.now);
    await recordWeakness(ctx.db, "concept", unitId, 0.5, ctx.now);
    if (result.category) await recordWeakness(ctx.db, "error", result.category, 0.5, ctx.now);
  } else {
    await relieveWeakness(ctx.db, "verb", drill.verb, 0.2, ctx.now);
    await relieveWeakness(ctx.db, "concept", unitId, 0.1, ctx.now);
  }
  return { ...result, masteryBefore: before, attemptId: row?.id };
}
