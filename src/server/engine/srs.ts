/**
 * Spaced repetition with FSRS-7 (ts-fsrs). Cards are stored as JSON with ISO
 * dates; learning steps (1 and 10 minutes) bring new and failed words back
 * within the same module.
 */
import { DefaultScheduler, State } from "ts-fsrs";
import type { StoredCard } from "../db/schema";

export type Grade = 1 | 2 | 3 | 4;
export const GRADE = { again: 1, hard: 2, good: 3, easy: 4 } as const;
export { State };

/** The subset of the ts-fsrs scheduler used here (its own type is a union over FSRS versions). */
interface Scheduler {
  newCard(opts: { now: Date }): unknown;
  review(opts: { card: LiveCard; grade: number; now: Date }): { card: LiveCard };
  chrono: { difference(from: Date, to: Date): number };
  model: { forgettingCurve(card: never, elapsedDays: number): number };
}
type LiveCard = Record<string, unknown>;
let schedulerPromise: Promise<Scheduler> | null = null;

function scheduler(): Promise<Scheduler> {
  schedulerPromise ??= (DefaultScheduler as unknown as (opts: Record<string, unknown>) => Promise<Scheduler>)({
    version: "FSRS-7",
    desiredRetention: 0.9,
    enableShortTerm: true,
    learningSteps: ["1m", "10m"],
    relearningSteps: ["10m"],
    enableFuzz: true,
    maximumInterval: 3650,
    allowModelOverride: false,
  });
  return schedulerPromise;
}

function toLive(stored: StoredCard): LiveCard {
  return {
    ...stored,
    dueAt: new Date(stored.dueAt),
    lastReviewAt: stored.lastReviewAt ? new Date(stored.lastReviewAt) : null,
  } as unknown as LiveCard;
}

function toStored(card: LiveCard): StoredCard {
  const c = card as unknown as Record<string, unknown> & { dueAt: Date; lastReviewAt: Date | null };
  return {
    ...c,
    dueAt: c.dueAt.toISOString(),
    lastReviewAt: c.lastReviewAt ? c.lastReviewAt.toISOString() : null,
  };
}

export interface CardSnapshot {
  card: StoredCard;
  dueAt: Date;
  state: number;
  stability: number;
  difficulty: number;
  scheduledDays: number;
  reps: number;
  lapses: number;
}

function snapshot(card: LiveCard): CardSnapshot {
  const c = card as unknown as {
    dueAt: Date;
    state: number;
    stability: number;
    difficulty: number;
    scheduledDays: number;
    reps: number;
    lapses: number;
  };
  return {
    card: toStored(card),
    dueAt: c.dueAt,
    state: c.state,
    stability: c.stability,
    difficulty: c.difficulty,
    scheduledDays: c.scheduledDays,
    reps: c.reps,
    lapses: c.lapses,
  };
}

export async function newCard(now: Date): Promise<CardSnapshot> {
  const s = await scheduler();
  return snapshot(s.newCard({ now }) as unknown as LiveCard);
}

export async function reviewCard(stored: StoredCard, grade: Grade, now: Date): Promise<CardSnapshot> {
  const s = await scheduler();
  const result = s.review({ card: toLive(stored), grade: grade as number, now });
  return snapshot(result.card);
}

/** Estimated probability of recall now (0 for cards never reviewed). */
export async function retrievability(stored: StoredCard, now: Date): Promise<number> {
  if (!stored.lastReviewAt) return 0;
  const s = await scheduler();
  const live = toLive(stored);
  const elapsed = Math.max(0, s.chrono.difference(new Date(stored.lastReviewAt), now));
  return s.model.forgettingCurve(live as never, elapsed);
}

/** Map a session accuracy to an FSRS grade (used for concept revision scheduling). */
export function gradeFromAccuracy(accuracy: number): Grade {
  if (accuracy >= 0.95) return 4;
  if (accuracy >= 0.8) return 3;
  if (accuracy >= 0.6) return 2;
  return 1;
}

/** Map a typed flashcard result to an FSRS grade. */
export function gradeFromAnswer(verdict: "correct" | "accent" | "wrong", responseMs: number | null, mature: boolean): Grade {
  if (verdict === "wrong") return 1;
  if (verdict === "accent") return 2;
  if (mature && responseMs !== null && responseMs < 3500) return 4;
  return 3;
}
