import { and, desc, eq, gte, inArray, lt, ne, sql } from "drizzle-orm";
import { CHAPTERS, CONJUGATION_UNITS, GRAMMAR_CONCEPTS } from "@/content";
import { tenseName } from "@/lib/conjugation/labels";
import { TENSES, type Tense } from "@/lib/conjugation/types";
import type { Lang, Localized } from "@/lib/i18n/types";
import { database, type DB } from "../db/client";
import { conceptProgress, exams, studySessions, vocabCards, vocabItems, vocabReviews, vocabTranslations } from "../db/schema";
import { addDays, endOfLocalDay, localDate, now as clockNow } from "../engine/clock";
import type { SessionPlan } from "../engine/planner";
import { topWeaknesses } from "../engine/weaknesses";
import { gradedMax } from "../exam/types";
import { examOverview } from "./exam";
import { getProfile } from "./profile";
import { ensureTodaySession } from "./session";
import type { ModuleState } from "./session-types";

const BANDS = ["A1", "A2", "B1", "B2"] as const;
const VOCAB_FOR_BAND: Record<(typeof BANDS)[number], number> = { A1: 250, A2: 700, B1: 1500, B2: 2500 };

/** Proficiency estimate from demonstrated competence: concept coverage per CEFR band, vocabulary size and exam results. */
export async function estimateLevel(db: DB): Promise<{ label: string; next: string | null; progress: number }> {
  const progress = await db.select().from(conceptProgress);
  const byId = new Map(progress.map((p) => [p.conceptId, p]));
  const all = [...GRAMMAR_CONCEPTS.map((c) => ({ id: c.id, cefr: c.cefr })), ...CONJUGATION_UNITS.map((u) => ({ id: u.id, cefr: u.cefr }))];
  const [{ n: learned }] = await db.select({ n: sql<number>`count(distinct ${vocabCards.itemId})::int` }).from(vocabCards).where(gte(vocabCards.reps, 1));
  const graded = await db.select({ score: exams.score }).from(exams).where(eq(exams.status, "graded")).orderBy(desc(exams.weekOf)).limit(3);
  const examAvg = graded.length ? graded.reduce((s, e) => s + (e.score ?? 0), 0) / graded.length : null;

  let reached = -1;
  let nextProgress = 0;
  for (let i = 0; i < BANDS.length; i++) {
    const band = BANDS[i]!;
    const concepts = all.filter((c) => c.cefr === band);
    const covered = concepts.filter((c) => {
      const p = byId.get(c.id);
      return p && (p.status === "mastered" || p.mastery >= 0.7);
    }).length;
    const coverage = concepts.length ? covered / concepts.length : 1;
    const vocabOk = (learned ?? 0) >= VOCAB_FOR_BAND[band];
    const examOk = examAvg === null ? i === 0 : examAvg >= 55;
    if (coverage >= 0.6 && vocabOk && examOk) reached = i;
    else {
      nextProgress = Math.min(1, (Math.min(1, coverage / 0.6) + Math.min(1, (learned ?? 0) / VOCAB_FOR_BAND[band])) / 2);
      break;
    }
  }
  return {
    label: reached >= 0 ? BANDS[reached]! : "Pre-A1",
    next: reached + 1 < BANDS.length ? BANDS[reached + 1]! : null,
    progress: nextProgress,
  };
}

function title(id: string | null): Localized | null {
  if (!id) return null;
  return GRAMMAR_CONCEPTS.find((c) => c.id === id)?.title ?? CONJUGATION_UNITS.find((u) => u.id === id)?.title ?? null;
}

export async function overviewData(tzHint?: string | null) {
  const db = await database();
  const t = await ensureTodaySession(tzHint);
  const plan = (t.session?.plan ?? null) as SessionPlan | null;
  const modules = (t.session?.modules ?? []) as ModuleState[];
  const [{ n: wordsLearned }] = await db.select({ n: sql<number>`count(distinct ${vocabCards.itemId})::int` }).from(vocabCards).where(gte(vocabCards.reps, 1));
  const progress = await db.select().from(conceptProgress);
  const mastered = (ids: string[]) => progress.filter((p) => ids.includes(p.conceptId) && p.status === "mastered").length;
  const [{ n: daysStudied }] = await db
    .select({ n: sql<number>`count(*)::int` })
    .from(studySessions)
    .where(ne(studySessions.status, "planned"));
  return {
    today: t.today,
    dayKind: t.dayKind,
    firstDay: !t.profile.startedOn,
    session: t.session
      ? {
          id: t.session.id,
          status: t.session.status,
          minutes: Math.round(modules.reduce((s, m) => s + m.elapsedMs, 0) / 60_000),
          currentModule: t.session.currentModule,
          plan: plan && {
            newWords: plan.vocab.newIds.length,
            due: plan.vocab.dueCount,
            conjugation: { title: title(plan.conjugation.focus), isNew: plan.conjugation.isNew },
            grammar: { title: title(plan.grammar.focus), isNew: plan.grammar.isNew, needsAi: plan.grammar.needsAi },
          },
        }
      : null,
    exam: await examOverview(tzHint),
    level: await estimateLevel(db),
    stats: {
      wordsLearned: wordsLearned ?? 0,
      conceptsMastered: mastered(GRAMMAR_CONCEPTS.map((c) => c.id)),
      conceptsTotal: GRAMMAR_CONCEPTS.length,
      unitsMastered: mastered(CONJUGATION_UNITS.map((u) => u.id)),
      unitsTotal: CONJUGATION_UNITS.length,
      daysStudied: daysStudied ?? 0,
    },
  };
}

export async function vocabularyData(lang: Lang, tzHint?: string | null) {
  const db = await database();
  const profile = await getProfile(tzHint);
  const now = clockNow();
  const today = localDate(now, profile.timezone);
  const endOfDay = endOfLocalDay(today, profile.timezone);
  const cards = await db.select().from(vocabCards);
  const due = cards.filter((c) => c.state !== 0 && c.dueAt < endOfDay).length;
  // Words (not cards) with a direction still in learning steps, so it is comparable with "learned".
  const learning = new Set(cards.filter((c) => c.state === 1 || c.state === 3).map((c) => c.itemId)).size;
  const items = new Set(cards.map((c) => c.itemId));
  const mature = new Set(cards.filter((c) => c.direction === "production" && c.stability >= 21).map((c) => c.itemId)).size;
  const monthAgo = new Date(now.getTime() - 30 * 86_400_000);
  const reviews = await db
    .select({ correct: vocabReviews.correct })
    .from(vocabReviews)
    .where(and(gte(vocabReviews.reviewedAt, monthAgo), eq(vocabReviews.kind, "review")));
  const retention = reviews.length >= 10 ? reviews.filter((r) => r.correct).length / reviews.length : null;
  const [{ n: total }] = await db.select({ n: sql<number>`count(*)::int` }).from(vocabItems);

  const ids = Array.from(items);
  const rows = ids.length
    ? await db
        .select({ id: vocabItems.id, lemma: vocabItems.lemma, pos: vocabItems.pos, gender: vocabItems.gender, tags: vocabItems.tags, main: vocabTranslations.main, falseFriend: vocabTranslations.falseFriend })
        .from(vocabItems)
        .innerJoin(vocabTranslations, and(eq(vocabTranslations.itemId, vocabItems.id), eq(vocabTranslations.lang, lang)))
        .where(inArray(vocabItems.id, ids))
    : [];
  const words = rows
    .map((r) => {
      const cs = cards.filter((c) => c.itemId === r.id);
      const prod = cs.find((c) => c.direction === "production") ?? cs[0]!;
      // A direction not yet introduced (state New) has no review scheduled.
      const scheduled = cs.filter((c) => c.state !== 0);
      const nextDue = scheduled.length ? scheduled.reduce((m, c) => (c.dueAt < m ? c.dueAt : m), scheduled[0]!.dueAt) : null;
      return {
        ...r,
        state: prod.state,
        stability: prod.stability,
        lapses: cs.reduce((s, c) => s + c.lapses, 0),
        nextDue: nextDue?.toISOString() ?? null,
        introducedOn: prod.introducedOn,
      };
    })
    .sort((a, b) => b.introducedOn.localeCompare(a.introducedOn) || a.lemma.localeCompare(b.lemma));

  return { due, learning, learned: items.size, mature, retention, available: (total ?? 0) - items.size, newPerSession: profile.newWordsTarget, words };
}

export async function progressData(lang: Lang, tzHint?: string | null) {
  const db = await database();
  const profile = await getProfile(tzHint);
  const now = clockNow();
  const today = localDate(now, profile.timezone);

  const sessions = await db.select({ date: studySessions.localDate, status: studySessions.status, modules: studySessions.modules }).from(studySessions);
  const examRows = await db.select().from(exams).orderBy(exams.weekOf);
  const days: Record<string, "complete" | "partial" | "exam"> = {};
  for (const s of sessions) {
    if (s.status === "completed") days[s.date] = "complete";
    else if (s.status === "in_progress") days[s.date] = "partial";
  }
  for (const e of examRows) if (["submitted", "graded"].includes(e.status)) days[e.weekOf] = "exam";

  // Retention by week (reviews of cards already scheduled a day or more ahead).
  const since = new Date(now.getTime() - 12 * 7 * 86_400_000);
  const reviews = await db
    .select({ date: vocabReviews.localDate, correct: vocabReviews.correct })
    .from(vocabReviews)
    .where(and(gte(vocabReviews.reviewedAt, since), eq(vocabReviews.kind, "review"), gte(vocabReviews.stabilityBefore, 1)));
  const weeks: Array<{ week: string; retention: number | null; n: number }> = [];
  for (let w = 11; w >= 0; w--) {
    const start = addDays(today, -7 * (w + 1) + 1);
    const end = addDays(today, -7 * w);
    const inWeek = reviews.filter((r) => r.date >= start && r.date <= end);
    weeks.push({ week: start, n: inWeek.length, retention: inWeek.length >= 5 ? inWeek.filter((r) => r.correct).length / inWeek.length : null });
  }

  const progress = await db.select().from(conceptProgress);
  const byId = new Map(progress.map((p) => [p.conceptId, p]));
  const chapters = CHAPTERS.map((ch) => {
    const concepts = GRAMMAR_CONCEPTS.filter((c) => c.chapter === ch.id).map((c) => ({
      id: c.id,
      title: c.title,
      status: byId.get(c.id)?.status ?? "locked",
      mastery: byId.get(c.id)?.mastery ?? 0,
    }));
    return { id: ch.id, title: ch.title, concepts };
  });
  const units = CONJUGATION_UNITS.map((u) => ({ id: u.id, title: u.title, status: byId.get(u.id)?.status ?? "locked", mastery: byId.get(u.id)?.mastery ?? 0 }));

  const weak = await topWeaknesses(db, now, undefined, 12, 1);
  // Word weaknesses are keyed by item id (an accent-free slug): show the lemma itself.
  const vocabIds = weak.filter((w) => w.kind === "vocab").map((w) => w.id);
  const lemmas = new Map(
    vocabIds.length ? (await db.select({ id: vocabItems.id, lemma: vocabItems.lemma }).from(vocabItems).where(inArray(vocabItems.id, vocabIds))).map((r) => [r.id, r.lemma]) : [],
  );
  const weaknessLabels = weak.map((w) => ({
    ...w,
    label:
      w.kind === "concept"
        ? (title(w.id)?.[lang] ?? w.id)
        : w.kind === "vocab"
          ? (lemmas.get(w.id) ?? w.id.replace(/^v-/, "").replace(/-/g, " "))
          : w.kind === "tense" && (TENSES as readonly string[]).includes(w.id)
            ? tenseName(w.id as Tense)
            : w.id,
  }));

  const [{ n: dueTomorrow }] = await db
    .select({ n: sql<number>`count(*)::int` })
    .from(vocabCards)
    .where(and(ne(vocabCards.state, 0), lt(vocabCards.dueAt, endOfLocalDay(addDays(today, 1), profile.timezone))));

  return {
    today,
    startedOn: profile.startedOn,
    days,
    sessionsCompleted: sessions.filter((s) => s.status === "completed").length,
    weeks,
    chapters,
    units,
    exams: examRows
      .filter((e) => e.status === "graded")
      .map((e) => ({ id: e.id, weekOf: e.weekOf, number: e.number, kind: e.kind, score: e.score, maxScore: gradedMax(e.sectionScores), sectionScores: e.sectionScores as Record<string, number | null> | null })),
    weaknesses: weaknessLabels,
    dueTomorrow: dueTomorrow ?? 0,
  };
}
