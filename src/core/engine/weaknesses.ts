/**
 * Recurring weaknesses: decaying weights per concept, verb, tense, error
 * category and word. Sessions and exams add evidence; the planner reads it.
 */
import { desc, eq, like, sql } from "drizzle-orm";
import type { DB } from "../db/client";
import { weaknesses } from "../db/schema";

const HALF_LIFE_DAYS = 14;

export type WeaknessKind = "concept" | "verb" | "tense" | "error" | "vocab";

export function decayed(weight: number, lastSeenAt: Date, now: Date): number {
  const days = Math.max(0, (now.getTime() - lastSeenAt.getTime()) / 86_400_000);
  return weight * Math.pow(0.5, days / HALF_LIFE_DAYS);
}

export async function recordWeakness(db: DB, kind: WeaknessKind, id: string, amount: number, now: Date): Promise<void> {
  const key = `${kind}:${id}`;
  const rows = await db.select().from(weaknesses).where(eq(weaknesses.key, key));
  const prev = rows[0];
  const weight = (prev ? decayed(prev.weight, prev.lastSeenAt, now) : 0) + amount;
  await db
    .insert(weaknesses)
    .values({ key, kind, weight, occurrences: 1, lastSeenAt: now })
    .onConflictDoUpdate({
      target: weaknesses.key,
      set: { weight, occurrences: sql`${weaknesses.occurrences} + 1`, lastSeenAt: now, updatedAt: now },
    });
}

/** Correct answers reduce a weakness slowly. */
export async function relieveWeakness(db: DB, kind: WeaknessKind, id: string, amount: number, now: Date): Promise<void> {
  const key = `${kind}:${id}`;
  const rows = await db.select().from(weaknesses).where(eq(weaknesses.key, key));
  const prev = rows[0];
  if (!prev) return;
  const weight = Math.max(0, decayed(prev.weight, prev.lastSeenAt, now) - amount);
  await db.update(weaknesses).set({ weight, updatedAt: now }).where(eq(weaknesses.key, key));
}

export interface Weakness {
  key: string;
  kind: string;
  id: string;
  weight: number;
  occurrences: number;
  lastSeenAt: Date;
}

export async function topWeaknesses(db: DB, now: Date, kind?: WeaknessKind, limit = 10, minWeight = 0.5): Promise<Weakness[]> {
  const q = db.select().from(weaknesses);
  const rows = await (kind ? q.where(like(weaknesses.key, `${kind}:%`)) : q).orderBy(desc(weaknesses.weight)).limit(200);
  return rows
    .map((r) => ({
      key: r.key,
      kind: r.kind,
      id: r.key.slice(r.key.indexOf(":") + 1),
      weight: decayed(r.weight, r.lastSeenAt, now),
      occurrences: r.occurrences,
      lastSeenAt: r.lastSeenAt,
    }))
    .filter((w) => w.weight >= minWeight)
    .sort((a, b) => b.weight - a.weight)
    .slice(0, limit);
}
