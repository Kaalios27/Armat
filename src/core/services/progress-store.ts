import { eq, sql } from "drizzle-orm";
import type { DB } from "../db/client";
import { conceptProgress } from "../db/schema";
import { statusFor, updateMastery } from "../engine/progression";
import { gradeFromAccuracy, newCard, reviewCard } from "../engine/srs";

export type ConceptKind = "grammar" | "conjugation";
export type ProgressRow = typeof conceptProgress.$inferSelect;

export async function getProgress(db: DB, conceptId: string): Promise<ProgressRow | undefined> {
  return (await db.select().from(conceptProgress).where(eq(conceptProgress.conceptId, conceptId)))[0];
}

/** Create the progress record the first time a concept is taught. */
export async function ensureIntroduced(db: DB, conceptId: string, now: Date, today: string): Promise<ProgressRow> {
  const existing = await getProgress(db, conceptId);
  if (existing) return existing;
  const card = await newCard(now);
  await db
    .insert(conceptProgress)
    .values({
      conceptId,
      status: "introduced",
      introducedAt: now,
      introducedOn: today,
      fsrs: card.card,
      dueAt: card.dueAt,
    })
    .onConflictDoNothing();
  return (await getProgress(db, conceptId))!;
}

/** Apply one answer (score 0..1) to a concept's mastery. Returns the mastery before and after. */
export async function recordConceptAttempt(
  db: DB,
  conceptId: string,
  kind: ConceptKind,
  score: number,
  now: Date,
  today: string,
): Promise<{ before: number; after: number }> {
  const p = await ensureIntroduced(db, conceptId, now, today);
  const after = updateMastery(p.mastery, score);
  const attempts = p.attempts + 1;
  const status = statusFor(kind, { mastery: after, attempts, sessionsPracticed: p.sessionsPracticed, status: p.status });
  await db
    .update(conceptProgress)
    .set({
      mastery: after,
      attempts,
      correct: sql`${conceptProgress.correct} + ${score >= 0.999 ? 1 : 0}`,
      status,
      masteredAt: status === "mastered" && p.status !== "mastered" ? now : p.masteredAt,
      lastPracticedAt: now,
      lastPracticedOn: today,
      updatedAt: now,
    })
    .where(eq(conceptProgress.conceptId, conceptId));
  return { before: p.mastery, after };
}

/** Replace the effect of the last answer (used when the learner overrides a verdict). */
export async function correctConceptAttempt(db: DB, conceptId: string, kind: ConceptKind, masteryBefore: number, now: Date): Promise<void> {
  const p = await getProgress(db, conceptId);
  if (!p) return;
  const after = updateMastery(masteryBefore, 1);
  const status = statusFor(kind, { mastery: after, attempts: p.attempts, sessionsPracticed: p.sessionsPracticed, status: p.status });
  await db
    .update(conceptProgress)
    .set({ mastery: after, correct: sql`${conceptProgress.correct} + 1`, status, updatedAt: now })
    .where(eq(conceptProgress.conceptId, conceptId));
}

/** End-of-module update: schedule the next revision of the concept from today's accuracy. */
export async function finalizeConceptSession(db: DB, conceptId: string, kind: ConceptKind, accuracy: number, isFocus: boolean, now: Date): Promise<void> {
  const p = await getProgress(db, conceptId);
  if (!p) return;
  const sessionsPracticed = p.sessionsPracticed + 1;
  const card = p.fsrs ? await reviewCard(p.fsrs, gradeFromAccuracy(accuracy), now) : await newCard(now);
  const status = statusFor(kind, { mastery: p.mastery, attempts: p.attempts, sessionsPracticed, status: p.status });
  await db
    .update(conceptProgress)
    .set({
      sessionsPracticed,
      focusDays: isFocus ? p.focusDays + 1 : p.focusDays,
      fsrs: card.card,
      dueAt: card.dueAt,
      status,
      masteredAt: status === "mastered" && p.status !== "mastered" ? now : p.masteredAt,
      updatedAt: now,
    })
    .where(eq(conceptProgress.conceptId, conceptId));
}

/** Exam evidence adjusts mastery without counting as a practice session. */
export async function applyExamEvidence(db: DB, conceptId: string, kind: ConceptKind, score: number, now: Date, today: string): Promise<void> {
  const p = await getProgress(db, conceptId);
  if (!p) return;
  await recordConceptAttempt(db, conceptId, kind, score, now, today);
  if (score < 0.5 && p.dueAt && p.dueAt > now) {
    await db.update(conceptProgress).set({ dueAt: now }).where(eq(conceptProgress.conceptId, conceptId));
  }
}
