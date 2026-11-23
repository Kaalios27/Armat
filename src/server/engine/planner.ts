/**
 * Daily session planning. Runs once per day when the session is first
 * requested:
 *  1. load history (cards, concept progress, weaknesses)
 *  2. count scheduled revisions and adapt today's new-word count
 *  3. pick new vocabulary with a weighted score
 *  4. choose the conjugation unit and grammar concept (new or consolidation)
 *  5. choose revision units and concepts (due, weak, least mastered)
 */
import { and, desc, eq, gte, inArray, lt, ne, sql } from "drizzle-orm";
import { CONJUGATION_UNITS, GRAMMAR_CONCEPTS, GRAMMAR_LESSONS } from "@/content";
import type { Lang } from "@/lib/i18n/types";
import { seededRandom } from "@/lib/text";
import { aiEnabled as aiAvailable } from "../ai/provider";
import type { DB } from "../db/client";
import { conceptProgress, exercises, lessons, vocabCards, vocabItems, vocabTranslations } from "../db/schema";
import { endOfLocalDay } from "./clock";
import {
  canAdvanceConjugation,
  canAdvanceGrammar,
  newWordsForToday,
  selectNewVocab,
  type ProgressLike,
  type VocabCandidate,
} from "./progression";
import { topWeaknesses } from "./weaknesses";

export interface SessionPlan {
  version: 1;
  date: string;
  vocab: { newIds: string[]; dueCount: number; target: number; weakItemIds: string[] };
  conjugation: { focus: string; isNew: boolean; review: string[]; weakVerbs: string[] };
  grammar: { focus: string | null; isNew: boolean; review: string[]; needsAi: boolean };
}

export interface PlanOptions {
  date: string;
  tz: string;
  lang: Lang;
  newWordsTarget: number;
  now: Date;
}

type ProgressRow = typeof conceptProgress.$inferSelect;

export async function countDueReviews(db: DB, before: Date): Promise<number> {
  const rows = await db
    .select({ n: sql<number>`count(*)::int` })
    .from(vocabCards)
    .where(and(ne(vocabCards.state, 0), lt(vocabCards.dueAt, before)));
  return rows[0]?.n ?? 0;
}

async function vocabCandidates(db: DB, lang: Lang, exclude: string[]): Promise<VocabCandidate[]> {
  const rows = await db
    .select({
      id: vocabItems.id,
      level: vocabItems.level,
      frequency: vocabItems.frequency,
      theme: vocabItems.theme,
      tags: vocabItems.tags,
      cognate: vocabTranslations.cognateScore,
      falseFriend: vocabTranslations.falseFriend,
    })
    .from(vocabItems)
    .innerJoin(vocabTranslations, and(eq(vocabTranslations.itemId, vocabItems.id), eq(vocabTranslations.lang, lang)))
    .where(sql`not exists (select 1 from ${vocabCards} c where c.item_id = ${vocabItems.id})`)
    .orderBy(vocabItems.level, desc(vocabItems.frequency))
    .limit(400);
  return rows.filter((r) => !exclude.includes(r.id));
}

function sortForReview(
  ids: string[],
  progress: Map<string, ProgressRow>,
  weakWeight: Map<string, number>,
  endOfDay: Date,
): string[] {
  return ids
    .map((id) => {
      const p = progress.get(id)!;
      const due = p.dueAt && p.dueAt < endOfDay ? 1 : 0;
      return { id, due, weak: weakWeight.get(id) ?? 0, mastery: p.mastery };
    })
    .sort((a, b) => b.due - a.due || b.weak - a.weak || a.mastery - b.mastery)
    .map((x) => x.id);
}

function asProgress(p: ProgressRow | undefined): ProgressLike | undefined {
  return p ? { status: p.status, mastery: p.mastery, attempts: p.attempts, sessionsPracticed: p.sessionsPracticed, focusDays: p.focusDays } : undefined;
}

/** Most recently introduced concept of a kind that is not yet mastered. */
function currentFocus(ids: string[], progress: Map<string, ProgressRow>): string | null {
  const open = ids
    .map((id) => progress.get(id))
    .filter((p): p is ProgressRow => !!p && p.status !== "mastered")
    .sort((a, b) => b.introducedAt.getTime() - a.introducedAt.getTime());
  return open[0]?.conceptId ?? null;
}

export async function grammarContentAvailable(db: DB, conceptId: string, lang: Lang): Promise<boolean> {
  if (GRAMMAR_LESSONS[conceptId]) return true;
  const l = await db.select({ id: lessons.conceptId }).from(lessons).where(and(eq(lessons.conceptId, conceptId), eq(lessons.lang, lang)));
  const ex = await db
    .select({ n: sql<number>`count(*)::int` })
    .from(exercises)
    .where(and(eq(exercises.conceptId, conceptId), eq(exercises.retired, false)));
  return l.length > 0 && (ex[0]?.n ?? 0) >= 4;
}

export async function buildPlan(db: DB, opts: PlanOptions): Promise<SessionPlan> {
  const rand = seededRandom(`plan:${opts.date}`);
  const endOfDay = endOfLocalDay(opts.date, opts.tz);

  // Vocabulary
  const dueCount = await countDueReviews(db, endOfDay);
  const target = newWordsForToday(opts.newWordsTarget, dueCount);
  const candidates = await vocabCandidates(db, opts.lang, []);
  const newIds = selectNewVocab(candidates, target, rand);
  const weakVocab = await topWeaknesses(db, opts.now, "vocab", 8, 0.5);
  const lapsed = await db
    .select({ itemId: vocabCards.itemId })
    .from(vocabCards)
    .where(gte(vocabCards.lapses, 2))
    .orderBy(desc(vocabCards.lapses), desc(vocabCards.difficulty))
    .limit(8);
  const weakItemIds = Array.from(new Set([...weakVocab.map((w) => w.id), ...lapsed.map((l) => l.itemId)])).slice(0, 10);

  // Concept progress
  const progressRows = await db.select().from(conceptProgress);
  const progress = new Map(progressRows.map((p) => [p.conceptId, p]));
  const introduced = (id: string) => progress.has(id);
  const weakConcepts = await topWeaknesses(db, opts.now, "concept", 20, 0.3);
  const weakWeight = new Map(weakConcepts.map((w) => [w.id, w.weight]));

  // Conjugation
  const unitIds = CONJUGATION_UNITS.map((u) => u.id);
  let conjFocus: string;
  let conjNew = false;
  const curUnit = currentFocus(unitIds, progress);
  if (curUnit && !canAdvanceConjugation(asProgress(progress.get(curUnit)))) {
    conjFocus = curUnit;
  } else {
    const next = CONJUGATION_UNITS.find((u) => !introduced(u.id) && u.prerequisites.every(introduced));
    if (next) {
      conjFocus = next.id;
      conjNew = true;
    } else {
      const introducedUnits = unitIds.filter(introduced);
      conjFocus = introducedUnits.length
        ? introducedUnits.sort((a, b) => progress.get(a)!.mastery - progress.get(b)!.mastery)[0]!
        : unitIds[0]!;
      conjNew = !introduced(conjFocus);
    }
  }
  const conjReview = sortForReview(unitIds.filter((id) => introduced(id) && id !== conjFocus), progress, weakWeight, endOfDay).slice(0, 3);
  const weakVerbs = (await topWeaknesses(db, opts.now, "verb", 6, 0.5)).map((w) => w.id);

  // Grammar
  const conceptIds = GRAMMAR_CONCEPTS.map((c) => c.id);
  let grammarFocus: string | null = null;
  let grammarNew = false;
  let needsAi = false;
  const curConcept = currentFocus(conceptIds, progress);
  if (curConcept && !canAdvanceGrammar(asProgress(progress.get(curConcept)))) {
    grammarFocus = curConcept;
  } else {
    const pending = GRAMMAR_CONCEPTS.filter((c) => !introduced(c.id));
    // Look a few concepts ahead when the next one waits for a conjugation prerequisite.
    const eligible = pending.slice(0, 4).find((c) => c.prerequisites.every(introduced));
    if (eligible) {
      if (aiAvailable() || (await grammarContentAvailable(db, eligible.id, opts.lang))) {
        grammarFocus = eligible.id;
        grammarNew = true;
      } else {
        needsAi = true;
      }
    }
    if (!grammarFocus) {
      const introducedConcepts = conceptIds.filter(introduced);
      grammarFocus = introducedConcepts.length
        ? introducedConcepts.sort((a, b) => (weakWeight.get(b) ?? 0) - (weakWeight.get(a) ?? 0) || progress.get(a)!.mastery - progress.get(b)!.mastery)[0]!
        : null;
    }
  }
  const grammarReview = sortForReview(conceptIds.filter((id) => introduced(id) && id !== grammarFocus), progress, weakWeight, endOfDay).slice(0, 3);

  return {
    version: 1,
    date: opts.date,
    vocab: { newIds, dueCount, target, weakItemIds },
    conjugation: { focus: conjFocus, isNew: conjNew, review: conjReview, weakVerbs },
    grammar: { focus: grammarFocus, isNew: grammarNew, review: grammarReview, needsAi },
  };
}

/** Items already introduced, used to avoid re-introducing words planned for an earlier day. */
export async function introducedItemIds(db: DB, ids: string[]): Promise<Set<string>> {
  if (!ids.length) return new Set();
  const rows = await db.select({ itemId: vocabCards.itemId }).from(vocabCards).where(inArray(vocabCards.itemId, ids));
  return new Set(rows.map((r) => r.itemId));
}
