/**
 * Learner data export, import and reset. Progress lives in this browser only, so the export
 * file is how it moves to another device and how it is backed up. Curated content is not
 * exported: every device rebuilds it from the seed.
 */
import { eq, getTableColumns, inArray } from "drizzle-orm";
import type { PgTable } from "drizzle-orm/pg-core";
import { SEED_VERSION } from "@/content";
import { database, flushDatabase } from "../db/client";
import { attempts, conceptProgress, concepts, exams, profile, sessionItems, studySessions, vocabCards, vocabItems, vocabReviews, weaknesses } from "../db/schema";
import { PACE, type Pace } from "../engine/progression";

export const EXPORT_FORMAT = "armat-export";
export const EXPORT_VERSION = 2;

/** Learner tables, parents before children. */
const TABLES = {
  profile,
  studySessions,
  sessionItems,
  vocabCards,
  vocabReviews,
  conceptProgress,
  attempts,
  exams,
  weaknesses,
} satisfies Record<string, PgTable>;

type TableKey = keyof typeof TABLES;
const ORDER = Object.keys(TABLES) as TableKey[];

export class ImportError extends Error {}

/** Everything the learner owns: profile, sessions, reviews, progress, exams and weaknesses. */
export async function exportAll(): Promise<Record<string, unknown>> {
  const db = await database();
  await flushDatabase();
  const data: Record<string, unknown> = { format: EXPORT_FORMAT, version: EXPORT_VERSION, exportedAt: new Date().toISOString(), seedVersion: SEED_VERSION };
  for (const key of ORDER) data[key] = await db.select().from(TABLES[key]);
  return data;
}

/** JSON turns dates into strings: restore timestamp columns before inserting. */
function revive(table: PgTable, row: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [key, col] of Object.entries(getTableColumns(table))) {
    if (!(key in row)) continue;
    const v = row[key];
    out[key] = v !== null && v !== undefined && (col as { dataType: string }).dataType === "date" ? new Date(v as string) : v;
  }
  return out;
}

function chunks<T>(items: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < items.length; i += size) out.push(items.slice(i, i + size));
  return out;
}

/** Replace all learner data on this device with the content of an export file. */
export async function importAll(input: unknown): Promise<Record<TableKey, number>> {
  if (!input || typeof input !== "object") throw new ImportError("The file is not an Armat export.");
  const data = input as Record<string, unknown>;
  if (data.format !== EXPORT_FORMAT) throw new ImportError("The file is not an Armat export.");
  if (typeof data.version !== "number" || data.version > EXPORT_VERSION) throw new ImportError("The file comes from a newer version of Armat.");
  for (const key of ORDER) {
    if (data[key] !== undefined && !Array.isArray(data[key])) throw new ImportError(`The export is damaged (${key}).`);
  }
  const db = await database();
  // Rows tied to words or concepts that this version does not have (for example AI-generated words in an older export) are skipped.
  const itemIds = new Set((await db.select({ id: vocabItems.id }).from(vocabItems)).map((r) => r.id));
  const conceptIds = new Set((await db.select({ id: concepts.id }).from(concepts)).map((r) => r.id));
  const rows = (key: TableKey) => ((data[key] as Record<string, unknown>[] | undefined) ?? []).filter((r) => r && typeof r === "object");
  const keep: Record<TableKey, Record<string, unknown>[]> = Object.fromEntries(ORDER.map((k) => [k, rows(k)])) as Record<TableKey, Record<string, unknown>[]>;
  keep.vocabCards = keep.vocabCards.filter((r) => itemIds.has(String(r.itemId)));
  const cardIds = new Set(keep.vocabCards.map((r) => String(r.id)));
  keep.vocabReviews = keep.vocabReviews.filter((r) => cardIds.has(String(r.cardId)));
  keep.conceptProgress = keep.conceptProgress.filter((r) => conceptIds.has(String(r.conceptId)));
  const sessionIds = new Set(keep.studySessions.map((r) => String(r.id)));
  keep.sessionItems = keep.sessionItems.filter((r) => sessionIds.has(String(r.sessionId)));

  await db.transaction(async (tx) => {
    for (const key of [...ORDER].reverse()) await tx.delete(TABLES[key]);
    for (const key of ORDER) {
      const table = TABLES[key];
      for (const part of chunks(keep[key].map((r) => revive(table, r)), 200)) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (part.length) await tx.insert(table).values(part as any);
      }
    }
  });
  await flushDatabase();
  return Object.fromEntries(ORDER.map((k) => [k, keep[k].length])) as Record<TableKey, number>;
}

/** Erase all progress on this device; language, theme and pace settings are kept. */
export async function resetProgress(): Promise<void> {
  const db = await database();
  const current = (await db.select().from(profile).where(eq(profile.id, 1)))[0];
  await db.transaction(async (tx) => {
    for (const key of [...ORDER].reverse()) if (key !== "profile") await tx.delete(TABLES[key]);
    if (current) {
      const pace = (Object.keys(PACE).includes(current.pace) ? current.pace : "standard") as Pace;
      await tx.update(profile).set({ startedOn: null, newWordsTarget: PACE[pace].base, updatedAt: new Date() }).where(inArray(profile.id, [1]));
    }
  });
  await flushDatabase();
}
