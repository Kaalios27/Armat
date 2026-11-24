/**
 * What an exam covers, computed from the learner's history: concepts and
 * words of the period, failed items, recurring weaknesses, and older material
 * for long-term retention. Monthly exams weight the last four weeks (40%),
 * older material (40%) and weaknesses (20%).
 */
import { and, asc, eq, gte, inArray, lt, lte, sql } from "drizzle-orm";
import { CONJUGATION_UNITS, GRAMMAR_CONCEPTS } from "@/content";
import type { DB } from "../db/client";
import { attempts, conceptProgress, vocabCards, vocabItems, vocabReviews, vocabTranslations } from "../db/schema";
import { examWindow, monthlyWindow, type ExamKind } from "../engine/schedule";
import { topWeaknesses } from "../engine/weaknesses";

export interface ScopeWord {
  id: string;
  lemma: string;
  en: string;
  fr: string;
  example: string | null;
  exampleEn: string | null;
  exampleFr: string | null;
}

export interface ExamScope {
  kind: ExamKind;
  from: string;
  to: string;
  units: { recent: string[]; older: string[]; weak: string[] };
  concepts: { recent: string[]; older: string[]; weak: string[] };
  words: { recent: ScopeWord[]; older: ScopeWord[]; weak: ScopeWord[] };
  weakVerbs: string[];
  level: number;
}

const isUnit = (id: string) => CONJUGATION_UNITS.some((u) => u.id === id);
const isConcept = (id: string) => GRAMMAR_CONCEPTS.some((c) => c.id === id);

async function words(db: DB, where: ReturnType<typeof and>, limit: number, order: "stability" | "random" = "random"): Promise<ScopeWord[]> {
  // One recognition card per item, so no DISTINCT is needed (and DISTINCT forbids ORDER BY random()).
  const rows = await db
    .select({
      id: vocabItems.id,
      lemma: vocabItems.lemma,
      example: vocabItems.example,
      stability: vocabCards.stability,
    })
    .from(vocabCards)
    .innerJoin(vocabItems, eq(vocabItems.id, vocabCards.itemId))
    .where(and(eq(vocabCards.direction, "recognition"), where))
    .orderBy(order === "stability" ? asc(vocabCards.stability) : sql`random()`)
    .limit(limit);
  if (!rows.length) return [];
  const trs = await db.select().from(vocabTranslations).where(inArray(vocabTranslations.itemId, rows.map((r) => r.id)));
  return rows.map((r) => {
    const en = trs.find((t) => t.itemId === r.id && t.lang === "en");
    const fr = trs.find((t) => t.itemId === r.id && t.lang === "fr");
    return {
      id: r.id,
      lemma: r.lemma,
      en: en?.main ?? "",
      fr: fr?.main ?? "",
      example: r.example,
      exampleEn: en?.exampleTranslation ?? null,
      exampleFr: fr?.exampleTranslation ?? null,
    };
  });
}

export async function computeScope(db: DB, sunday: string, kind: ExamKind, startedOn: string | null, now: Date): Promise<ExamScope> {
  const win = kind === "monthly" ? monthlyWindow(sunday, startedOn) : examWindow(sunday, startedOn);
  const progress = await db.select().from(conceptProgress);
  const practiced = await db
    .selectDistinct({ conceptId: attempts.conceptId })
    .from(attempts)
    .where(and(gte(attempts.localDate, win.from), lte(attempts.localDate, win.to)));
  const practicedIds = new Set(practiced.map((p) => p.conceptId).filter((x): x is string => !!x));
  const recentIds = progress.filter((p) => (p.introducedOn >= win.from && p.introducedOn <= win.to) || practicedIds.has(p.conceptId)).map((p) => p.conceptId);
  const olderIds = progress
    .filter((p) => p.introducedOn < win.from && !recentIds.includes(p.conceptId))
    .sort((a, b) => (a.lastPracticedOn ?? "").localeCompare(b.lastPracticedOn ?? "") || a.mastery - b.mastery)
    .map((p) => p.conceptId);
  const weak = await topWeaknesses(db, now, "concept", 12, 0.5);
  const weakIds = weak.map((w) => w.id).filter((id) => progress.some((p) => p.conceptId === id));

  const failedVerbs = await db
    .select({ verb: attempts.verb, n: sql<number>`count(*)::int` })
    .from(attempts)
    .where(and(eq(attempts.correct, false), gte(attempts.localDate, win.from), lte(attempts.localDate, win.to)))
    .groupBy(attempts.verb)
    .orderBy(sql`count(*) desc`)
    .limit(8);
  const weakVerbWeights = await topWeaknesses(db, now, "verb", 8, 0.5);
  const weakVerbs = Array.from(new Set([...failedVerbs.map((f) => f.verb).filter((v): v is string => !!v), ...weakVerbWeights.map((w) => w.id)]));

  const recentWords = await words(db, and(gte(vocabCards.introducedOn, win.from), lte(vocabCards.introducedOn, win.to)), 60);
  const olderWords = await words(db, and(lt(vocabCards.introducedOn, win.from)), 40, "stability");
  const failedItemIds = await db
    .selectDistinct({ itemId: vocabReviews.itemId })
    .from(vocabReviews)
    .where(and(eq(vocabReviews.correct, false), gte(vocabReviews.localDate, win.from), lte(vocabReviews.localDate, win.to)))
    .limit(30);
  const weakWords = failedItemIds.length ? await words(db, and(inArray(vocabCards.itemId, failedItemIds.map((f) => f.itemId))), 30) : [];

  const introducedGrammar = progress.filter((p) => isConcept(p.conceptId)).length;
  const level = Math.min(6, 1 + Math.floor(introducedGrammar / 9));

  return {
    kind,
    from: win.from,
    to: win.to,
    units: { recent: recentIds.filter(isUnit), older: olderIds.filter(isUnit), weak: weakIds.filter(isUnit) },
    concepts: { recent: recentIds.filter(isConcept), older: olderIds.filter(isConcept), weak: weakIds.filter(isConcept) },
    words: { recent: recentWords, older: olderWords, weak: weakWords },
    weakVerbs,
    level,
  };
}

/** Split `total` items into recent / older / weak according to the exam kind and available history. */
export function allocate(total: number, kind: ExamKind, available: { recent: number; older: number; weak: number }): { recent: number; older: number; weak: number } {
  const share = kind === "monthly" ? { recent: 0.4, older: 0.4, weak: 0.2 } : { recent: 0.6, older: 0.25, weak: 0.15 };
  let older = available.older ? Math.round(total * share.older) : 0;
  let weak = available.weak ? Math.round(total * share.weak) : 0;
  let recent = total - older - weak;
  if (!available.recent) {
    older += recent;
    recent = 0;
  }
  if (!available.older && !available.recent) {
    // Nothing studied in this area yet: everything goes to "recent", where callers fall back to the first unit or concept.
    if (!available.weak) return { recent: total, older: 0, weak: 0 };
    weak = total;
    older = 0;
  }
  return { recent, older, weak };
}
