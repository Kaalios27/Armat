/**
 * Vocabulary module: scheduled revisions, new words in batches (introduce,
 * then test), and active recall of today's and difficult words.
 */
import { and, asc, desc, eq, gte, inArray, lt, lte, ne, notInArray, sql } from "drizzle-orm";
import { allForms } from "@/lib/conjugation/engine";
import { getVerbDef } from "@/lib/conjugation/verbs";
import type { Lang } from "@/lib/i18n/types";
import { lemmaKey, nominalBaseCandidates } from "@/lib/lemma";
import { basicNormalize, seededRandom, tokenize } from "@/lib/text";
import type { DB } from "../db/client";
import { sessionItems, vocabCards, vocabItems, vocabReviews, vocabTranslations, type StoredCard } from "../db/schema";
import { endOfLocalDay } from "../engine/clock";
import { adaptNewWordTarget, type Pace } from "../engine/progression";
import { countDueReviews } from "../engine/planner";
import { gradeFromAnswer, newCard, reviewCard, State, type Grade } from "../engine/srs";
import { recordWeakness, relieveWeakness } from "../engine/weaknesses";
import { gradeSpanishAnswer } from "../grading/vocab";
import { setNewWordsTarget } from "./profile";
import type { AnswerBody, ItemRow, ModuleContext, NewItem } from "./session-types";

type Format = "recognize" | "produce" | "cloze";
type CardRow = typeof vocabCards.$inferSelect;

export interface WordPayload {
  itemId: string;
  lemma: string;
  pos: string;
  gender: string | null;
  example: string | null;
  tags: string[];
  translations: Record<Lang, { main: string; alternatives: string[]; note: string | null; exampleTranslation: string | null }>;
}

export async function wordPayload(db: DB, itemId: string): Promise<WordPayload | null> {
  const item = (await db.select().from(vocabItems).where(eq(vocabItems.id, itemId)))[0];
  if (!item) return null;
  const trs = await db.select().from(vocabTranslations).where(eq(vocabTranslations.itemId, itemId));
  const t = (lang: Lang) => {
    const r = trs.find((x) => x.lang === lang) ?? trs[0];
    return { main: r?.main ?? "", alternatives: r?.alternatives ?? [], note: r?.note ?? null, exampleTranslation: r?.exampleTranslation ?? null };
  };
  return {
    itemId,
    lemma: item.lemma,
    pos: item.pos,
    gender: item.gender,
    example: item.example,
    tags: item.tags,
    translations: { en: t("en"), fr: t("fr") },
  };
}

/** Find the word in its example sentence so it can be blanked out (single-word items only). */
export function buildCloze(lemma: string, pos: string, example: string | null): { before: string; after: string; target: string } | null {
  if (!example || lemma.trim().includes(" ")) return null;
  const key = lemmaKey(lemma);
  let forms: Set<string>;
  if (pos === "v") {
    const def = getVerbDef(key) ?? { inf: key, en: "", fr: "", level: 3 as const };
    try {
      forms = allForms(def);
    } catch {
      forms = new Set([key]);
    }
  } else forms = new Set([key]);
  for (const tok of tokenize(example)) {
    const low = basicNormalize(tok);
    if (!low || low.length < 2) continue;
    const hit = forms.has(low) || (pos !== "v" && nominalBaseCandidates(low).includes(key));
    if (!hit) continue;
    const idx = example.indexOf(tok);
    if (idx < 0) continue;
    return { before: example.slice(0, idx), after: example.slice(idx + tok.length), target: tok };
  }
  return null;
}

async function servedItemIds(db: DB, sessionId: string): Promise<string[]> {
  const rows = await db
    .select({ ref: sessionItems.ref })
    .from(sessionItems)
    .where(and(eq(sessionItems.sessionId, sessionId), eq(sessionItems.module, "vocab")))
    .orderBy(desc(sessionItems.seq));
  return rows.map((r) => r.ref ?? "").filter(Boolean);
}

async function cardItem(ctx: ModuleContext, card: CardRow, segment: string, practice: boolean, seq: number): Promise<NewItem | null> {
  const word = await wordPayload(ctx.db, card.itemId);
  if (!word) return null;
  const rand = seededRandom(`${ctx.session.id}:${seq}`);
  const cloze = buildCloze(word.lemma, word.pos, word.example);
  let format: Format;
  if (card.direction === "recognition") format = !practice && cloze && rand() < 0.3 ? "cloze" : practice ? (cloze && rand() < 0.5 ? "cloze" : "produce") : "recognize";
  else format = cloze && rand() < 0.3 ? "cloze" : "produce";
  if (format === "cloze" && !cloze) format = "produce";
  const accepted = format === "cloze" ? [cloze!.target] : [word.lemma];
  return {
    segment,
    kind: "vocab-card",
    ref: card.itemId,
    payload: {
      ...word,
      cardId: card.id,
      direction: card.direction,
      format,
      practice,
      cloze: format === "cloze" ? { before: cloze!.before, after: cloze!.after } : null,
      isNew: card.state === State.New,
    },
    key: { accepted, lemma: word.lemma, practice },
  };
}

async function nextSeq(db: DB, sessionId: string): Promise<number> {
  const rows = await db
    .select({ n: sql<number>`coalesce(max(${sessionItems.seq}), 0)::int` })
    .from(sessionItems)
    .where(eq(sessionItems.sessionId, sessionId));
  return (rows[0]?.n ?? 0) + 1;
}

export async function nextVocab(ctx: ModuleContext): Promise<NewItem | null> {
  const { db, now, plan, moduleMs, elapsedMs } = ctx;
  const seq = await nextSeq(db, ctx.session.id);
  const served = await servedItemIds(db, ctx.session.id);
  const lastItem = served[0];
  const endOfDay = endOfLocalDay(ctx.today, ctx.tz);

  // 1. Short-term learning steps that are due (failed or new words coming back).
  const learning = await db
    .select()
    .from(vocabCards)
    .where(and(inArray(vocabCards.state, [State.Learning, State.Relearning]), lte(vocabCards.dueAt, now)))
    .orderBy(asc(vocabCards.dueAt))
    .limit(3);
  const learningCard = learning.find((c) => c.itemId !== lastItem) ?? null;
  if (learningCard) return cardItem(ctx, learningCard, "review", false, seq);

  // 2. Scheduled revisions (about a quarter of the module, longer with a backlog).
  const due = await db
    .select()
    .from(vocabCards)
    .where(and(eq(vocabCards.state, State.Review), lt(vocabCards.dueAt, endOfDay), ne(vocabCards.introducedOn, ctx.today)))
    .orderBy(asc(vocabCards.dueAt))
    .limit(2);
  const reviewWindow = due.length ? moduleMs * 0.45 : moduleMs * 0.25;
  const dueCard = due.find((c) => c.itemId !== lastItem) ?? due[0];
  if (dueCard && elapsedMs < reviewWindow) return cardItem(ctx, dueCard, "review", false, seq);

  // 3. New words: introduce in batches of three, testing each batch.
  const untested = await db
    .select()
    .from(vocabCards)
    .where(and(eq(vocabCards.state, State.New), eq(vocabCards.direction, "recognition")))
    .orderBy(asc(vocabCards.introducedAt))
    .limit(5);
  const introducedRows = plan.vocab.newIds.length
    ? await db.select({ itemId: vocabCards.itemId }).from(vocabCards).where(inArray(vocabCards.itemId, plan.vocab.newIds))
    : [];
  const introduced = new Set(introducedRows.map((r) => r.itemId));
  const remaining = plan.vocab.newIds.filter((id) => !introduced.has(id));
  if (elapsedMs < moduleMs * 0.75) {
    const testable = untested.filter((c) => c.itemId !== lastItem);
    if (testable.length && (untested.length >= 3 || !remaining.length)) return cardItem(ctx, testable[0]!, "new", false, seq);
    if (remaining.length) {
      const word = await wordPayload(db, remaining[0]!);
      if (word) return { segment: "new", kind: "vocab-intro", ref: word.itemId, payload: { ...word }, key: null };
    }
    if (testable.length) return cardItem(ctx, testable[0]!, "new", false, seq);
  }

  // 4. Active recall: first production tests, then leftover tests.
  const production = await db
    .select()
    .from(vocabCards)
    .where(and(eq(vocabCards.state, State.New), eq(vocabCards.direction, "production")))
    .orderBy(asc(vocabCards.introducedAt))
    .limit(3);
  const prodCard = production.find((c) => c.itemId !== lastItem);
  if (prodCard) return cardItem(ctx, prodCard, "recall", false, seq);
  const leftover = untested.find((c) => c.itemId !== lastItem);
  if (leftover) return cardItem(ctx, leftover, "recall", false, seq);
  if (dueCard) return cardItem(ctx, dueCard, "review", false, seq);

  // 5. Practice: weak words, then recent words, then anything not seen in this session.
  const recentServed = served.slice(0, 8);
  const pickPractice = async (where: ReturnType<typeof and> | undefined, order: "weak" | "recent" | "any") => {
    const base = db.select().from(vocabCards).where(and(eq(vocabCards.direction, "production"), where ?? sql`true`, recentServed.length ? notInArray(vocabCards.itemId, recentServed) : sql`true`));
    const ordered = order === "weak" ? base.orderBy(desc(vocabCards.lapses), desc(vocabCards.difficulty)) : order === "recent" ? base.orderBy(desc(vocabCards.introducedAt)) : base.orderBy(sql`random()`);
    return (await ordered.limit(1))[0] ?? null;
  };
  const weakIds = plan.vocab.weakItemIds.filter((id) => !recentServed.includes(id));
  const weak = weakIds.length ? await pickPractice(inArray(vocabCards.itemId, weakIds), "weak") : null;
  if (weak) return cardItem(ctx, weak, "recall", true, seq);
  const lapsed = await pickPractice(gte(vocabCards.lapses, 1), "weak");
  if (lapsed && seededRandom(`${ctx.session.id}:lapsed:${seq}`)() < 0.5) return cardItem(ctx, lapsed, "recall", true, seq);
  const weekAgo = new Date(now.getTime() - 7 * 86_400_000);
  const recent = await pickPractice(and(gte(vocabCards.introducedAt, weekAgo), notInArray(vocabCards.itemId, served.length ? served : ["-"])), "recent");
  if (recent) return cardItem(ctx, recent, "recall", true, seq);
  const any = await pickPractice(undefined, "any");
  if (any) return cardItem(ctx, any, "recall", true, seq);
  const anyCard = (await db.select().from(vocabCards).orderBy(sql`random()`).limit(1))[0];
  return anyCard ? cardItem(ctx, anyCard, "recall", true, seq) : null;
}

async function introduce(ctx: ModuleContext, itemId: string): Promise<void> {
  const exists = await ctx.db.select({ id: vocabCards.id }).from(vocabCards).where(eq(vocabCards.itemId, itemId));
  if (exists.length) return;
  for (const direction of ["recognition", "production"] as const) {
    const c = await newCard(ctx.now);
    await ctx.db
      .insert(vocabCards)
      .values({
        id: `${itemId}|${direction}`,
        itemId,
        direction,
        fsrs: c.card,
        dueAt: c.dueAt,
        state: c.state,
        stability: c.stability,
        difficulty: c.difficulty,
        reps: 0,
        lapses: 0,
        introducedAt: ctx.now,
        introducedOn: ctx.today,
      })
      .onConflictDoNothing();
  }
}

export interface VocabResult {
  verdict: "correct" | "accent" | "wrong" | "alternative" | "seen";
  correct: boolean;
  expected?: string;
  rating?: Grade;
  note?: string | null;
  nextDueAt?: string;
  overridden?: boolean;
  before?: StoredCard;
  reviewId?: string;
}

async function applyReview(
  ctx: ModuleContext,
  card: CardRow,
  grade: Grade,
  practice: boolean,
): Promise<{ nextDueAt: Date; before: StoredCard; scheduledDays: number | null }> {
  const before = card.fsrs;
  if (practice && grade !== 1) return { nextDueAt: card.dueAt, before, scheduledDays: null };
  const r = await reviewCard(card.fsrs, grade, ctx.now);
  const correct = grade > 1;
  await ctx.db
    .update(vocabCards)
    .set({
      fsrs: r.card,
      dueAt: r.dueAt,
      state: r.state,
      stability: r.stability,
      difficulty: r.difficulty,
      reps: r.reps,
      lapses: r.lapses,
      successes: sql`${vocabCards.successes} + ${correct ? 1 : 0}`,
      failures: sql`${vocabCards.failures} + ${correct ? 0 : 1}`,
      lastReviewAt: ctx.now,
    })
    .where(eq(vocabCards.id, card.id));
  return { nextDueAt: r.dueAt, before, scheduledDays: r.scheduledDays };
}

export async function answerVocab(ctx: ModuleContext, item: ItemRow, body: AnswerBody): Promise<VocabResult> {
  const p = item.payload as Record<string, unknown>;
  const key = (item.key ?? {}) as { accepted?: string[]; lemma?: string; practice?: boolean };

  if (item.kind === "vocab-intro") {
    await introduce(ctx, item.ref!);
    return { verdict: "seen", correct: true };
  }

  const card = (await ctx.db.select().from(vocabCards).where(eq(vocabCards.id, String(p.cardId))))[0];
  if (!card) throw new Error("Card not found");
  const practice = !!key.practice;
  const format = p.format as Format;
  const lang = ctx.lang;

  // Learner override of a previous verdict ("count as correct").
  if (body.override && item.status === "done" && item.result) {
    const prev = item.result as unknown as VocabResult;
    if (prev.correct) return prev;
    if (prev.before && !practice) {
      const r = await reviewCard(prev.before, 3, ctx.now);
      await ctx.db
        .update(vocabCards)
        .set({
          fsrs: r.card,
          dueAt: r.dueAt,
          state: r.state,
          stability: r.stability,
          difficulty: r.difficulty,
          reps: r.reps,
          lapses: r.lapses,
          successes: sql`${vocabCards.successes} + 1`,
          failures: sql`greatest(${vocabCards.failures} - 1, 0)`,
        })
        .where(eq(vocabCards.id, card.id));
    }
    if (prev.reviewId) await ctx.db.update(vocabReviews).set({ correct: true, rating: 3, errorType: "override" }).where(eq(vocabReviews.id, prev.reviewId));
    await relieveWeakness(ctx.db, "vocab", card.itemId, 1, ctx.now);
    return { ...prev, verdict: "correct", correct: true, overridden: true };
  }

  let verdict: VocabResult["verdict"];
  let grade: Grade;
  let note: string | null = null;
  const responseMs = typeof body.responseMs === "number" ? Math.max(0, Math.round(body.responseMs)) : null;
  const answerText = Array.isArray(body.answer) ? body.answer.join(" ") : (body.answer ?? "");

  if (format === "recognize") {
    const rating = Math.min(4, Math.max(1, Math.round(Number(body.rating) || 1))) as Grade;
    grade = rating;
    verdict = rating === 1 ? "wrong" : "correct";
  } else {
    const g = gradeSpanishAnswer(answerText, key.accepted ?? [], format === "produce" ? key.lemma : undefined);
    verdict = g.verdict;
    const mature = card.state === State.Review;
    grade = gradeFromAnswer(verdict === "accent" ? "accent" : verdict === "correct" ? "correct" : "wrong", responseMs, mature);
  }

  const correct = verdict !== "wrong";
  const { nextDueAt, before, scheduledDays } = await applyReview(ctx, card, grade, practice);
  const [review] = await ctx.db
    .insert(vocabReviews)
    .values({
      cardId: card.id,
      itemId: card.itemId,
      direction: card.direction,
      format,
      kind: practice ? "practice" : card.state === State.New ? "learn" : "review",
      rating: practice && correct ? null : grade,
      correct,
      answer: format === "recognize" ? null : answerText,
      expected: (key.accepted ?? [])[0] ?? null,
      errorType: verdict === "correct" ? null : verdict,
      responseMs,
      lang,
      stateBefore: card.state,
      stabilityBefore: card.stability,
      scheduledDays,
      sessionId: ctx.session.id,
      localDate: ctx.today,
    })
    .returning({ id: vocabReviews.id });
  if (correct) await relieveWeakness(ctx.db, "vocab", card.itemId, 0.3, ctx.now);
  else await recordWeakness(ctx.db, "vocab", card.itemId, 1, ctx.now);
  await ctx.db.update(vocabCards).set({ lastResponseMs: responseMs }).where(eq(vocabCards.id, card.id));

  return {
    verdict,
    correct,
    expected: (key.accepted ?? [])[0],
    rating: grade,
    note,
    nextDueAt: nextDueAt.toISOString(),
    before,
    reviewId: review?.id,
  };
}

/** End of the vocabulary module: adapt tomorrow's new-word target. */
export async function finalizeVocab(ctx: ModuleContext, pace: Pace, currentTarget: number): Promise<void> {
  const twoWeeksAgo = new Date(ctx.now.getTime() - 14 * 86_400_000);
  const rows = await ctx.db
    .select({ correct: vocabReviews.correct })
    .from(vocabReviews)
    .where(and(gte(vocabReviews.reviewedAt, twoWeeksAgo), eq(vocabReviews.kind, "review"), gte(vocabReviews.stabilityBefore, 1)));
  const retention = rows.length >= 20 ? rows.filter((r) => r.correct).length / rows.length : null;
  const tomorrowEnd = endOfLocalDay(addDay(ctx.today), ctx.tz);
  const reviewsDueTomorrow = await countDueReviews(ctx.db, tomorrowEnd);
  const target = adaptNewWordTarget(currentTarget, pace, { retention, reviewsDueTomorrow });
  if (target !== currentTarget) await setNewWordsTarget(target);
}

function addDay(date: string): string {
  const d = new Date(`${date}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + 1);
  return d.toISOString().slice(0, 10);
}
