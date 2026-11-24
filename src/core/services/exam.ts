import { desc, eq, inArray } from "drizzle-orm";
import { database } from "../db/client";
import { exams } from "../db/schema";
import { localDate, now as clockNow } from "../engine/clock";
import { examKind, examNumber, lateExamSunday, upcomingExamSunday } from "../engine/schedule";
import { generateExamContent } from "../exam/generate";
import { gradeExam, totalScore, WRITING_CRITERIA, WRITING_CRITERION_MAX } from "../exam/grade";
import {
  EXAM_MINUTES,
  EXAM_PARTS,
  gradedMax,
  MAX_FULL_PLAYS,
  MAX_SEGMENT_PLAYS,
  type ExamContent,
  type ExamGrading,
  type ExamPlayback,
  type ExamResponses,
} from "../exam/types";
import { getProfile } from "./profile";
import { HttpError } from "./session";

export type ExamRow = typeof exams.$inferSelect;

export interface ExamSummary {
  id: string | null;
  weekOf: string;
  number: number;
  kind: "weekly" | "monthly";
  status: string;
  score: number | null;
  /** Maximum of the graded parts (below 100 while a part is pending). */
  maxScore: number;
  late: boolean;
  canStart: boolean;
}

function summarize(row: ExamRow | undefined, weekOf: string, startedOn: string, today: string, late: boolean): ExamSummary {
  const number = examNumber(weekOf, startedOn);
  const open = today === weekOf || late;
  return {
    id: row?.id ?? null,
    weekOf,
    number,
    kind: examKind(number),
    status: row?.status ?? (open ? "available" : today < weekOf ? "upcoming" : "missed"),
    score: row?.score ?? null,
    maxScore: gradedMax(row?.sectionScores),
    late,
    canStart: open && (!row || ["generating", "ready", "in_progress", "failed"].includes(row.status)),
  };
}

export async function examOverview(tzHint?: string | null) {
  const db = await database();
  const profile = await getProfile(tzHint);
  const today = localDate(clockNow(), profile.timezone);
  const startedOn = profile.startedOn;
  if (!startedOn) return { today, startedOn, current: null, late: null, history: [] as ExamSummary[] };
  const sunday = upcomingExamSunday(today, startedOn)!;
  const rows = await db.select().from(exams).orderBy(desc(exams.weekOf));
  const current = summarize(rows.find((r) => r.weekOf === sunday), sunday, startedOn, today, false);
  const lateSunday = lateExamSunday(today, startedOn);
  const lateRow = lateSunday ? rows.find((r) => r.weekOf === lateSunday) : undefined;
  const late = lateSunday && (!lateRow || !["submitted", "graded"].includes(lateRow.status)) ? summarize(lateRow, lateSunday, startedOn, today, true) : null;
  const history = rows
    .filter((r) => ["submitted", "graded"].includes(r.status))
    .map((r) => ({ ...summarize(r, r.weekOf, startedOn, today, false), canStart: false }));
  return { today, startedOn, current, late, history };
}

/** Create this week's exam (status "generating"); generation runs separately. */
export async function ensureExam(weekOf: string, tzHint?: string | null): Promise<ExamRow> {
  const db = await database();
  const profile = await getProfile(tzHint);
  const today = localDate(clockNow(), profile.timezone);
  if (!profile.startedOn) throw new HttpError(409, "No study history yet");
  const isToday = today === weekOf && upcomingExamSunday(today, profile.startedOn) === weekOf;
  const isLate = lateExamSunday(today, profile.startedOn) === weekOf;
  const allowed = isToday || isLate;
  const existing = (await db.select().from(exams).where(eq(exams.weekOf, weekOf)))[0];
  if (existing) return existing;
  if (!allowed) throw new HttpError(409, "This exam is not available today");
  const number = examNumber(weekOf, profile.startedOn);
  await db
    .insert(exams)
    .values({ weekOf, number, kind: examKind(number), lang: profile.uiLang, status: "generating" })
    .onConflictDoNothing();
  return (await db.select().from(exams).where(eq(exams.weekOf, weekOf)))[0]!;
}

export async function runExamGeneration(examId: string, tzHint?: string | null): Promise<void> {
  const db = await database();
  const exam = (await db.select().from(exams).where(eq(exams.id, examId)))[0];
  if (!exam || !["generating", "failed"].includes(exam.status)) return;
  const profile = await getProfile(tzHint);
  try {
    const { content, key, scope } = await generateExamContent(db, exam.id, exam.weekOf, exam.number, exam.kind as "weekly" | "monthly", exam.lang as "en" | "fr", profile.startedOn, clockNow());
    await db.update(exams).set({ content, key, scope, status: "ready", error: null, updatedAt: clockNow() }).where(eq(exams.id, examId));
  } catch (err) {
    await db
      .update(exams)
      .set({ status: "failed", error: err instanceof Error ? err.message.slice(0, 500) : String(err), updatedAt: clockNow() })
      .where(eq(exams.id, examId));
  }
}

async function load(id: string): Promise<ExamRow> {
  const db = await database();
  const row = (await db.select().from(exams).where(eq(exams.id, id)))[0];
  if (!row) throw new HttpError(404, "Exam not found");
  return row;
}

/** What the learner sees while taking the exam. Never includes the answer key. */
export async function examForTaking(id: string) {
  const e = await load(id);
  return {
    id: e.id,
    weekOf: e.weekOf,
    number: e.number,
    kind: e.kind,
    status: e.status,
    error: e.status === "failed" ? e.error : null,
    content: ["ready", "in_progress"].includes(e.status) ? (e.content as ExamContent) : null,
    responses: (e.responses ?? {}) as ExamResponses,
    playback: (e.playback ?? {}) as ExamPlayback,
    elapsedMs: e.elapsedMs,
    minutes: EXAM_MINUTES,
  };
}

export async function startExam(id: string): Promise<void> {
  const db = await database();
  const e = await load(id);
  if (e.status === "ready") await db.update(exams).set({ status: "in_progress", startedAt: clockNow(), updatedAt: clockNow() }).where(eq(exams.id, id));
  else if (e.status !== "in_progress") throw new HttpError(409, `Exam is ${e.status}`);
}

function mergeResponses(a: ExamResponses, b: ExamResponses): ExamResponses {
  return {
    ...a,
    ...b,
    conjugation: { ...(a.conjugation ?? {}), ...(b.conjugation ?? {}) },
    grammar: { ...(a.grammar ?? {}), ...(b.grammar ?? {}) },
    translation: { ...(a.translation ?? {}), ...(b.translation ?? {}) },
  };
}

/** Autosave. Returns the status; the exam is submitted automatically when its time is used. */
export async function saveExam(id: string, patch: { responses?: ExamResponses; elapsedMs?: number }): Promise<{ status: string; elapsedMs: number }> {
  const db = await database();
  const e = await load(id);
  if (e.status !== "in_progress") return { status: e.status, elapsedMs: e.elapsedMs };
  const responses = patch.responses ? mergeResponses((e.responses ?? {}) as ExamResponses, patch.responses) : e.responses;
  const limit = EXAM_MINUTES * 60_000;
  const elapsedMs =
    typeof patch.elapsedMs === "number" && Number.isFinite(patch.elapsedMs)
      ? Math.max(e.elapsedMs, Math.min(Math.round(patch.elapsedMs), limit))
      : e.elapsedMs;
  await db.update(exams).set({ responses, elapsedMs, updatedAt: clockNow() }).where(eq(exams.id, id));
  if (elapsedMs >= limit) {
    await submitExam(id);
    return { status: "submitted", elapsedMs };
  }
  return { status: "in_progress", elapsedMs };
}

/** Count one dictation playback, enforcing the limits. */
export async function registerPlayback(id: string, mode: "full" | "segment", segment?: number): Promise<{ allowed: boolean; playback: ExamPlayback }> {
  const db = await database();
  const e = await load(id);
  const playback = { full: 0, segments: {}, ...((e.playback ?? {}) as ExamPlayback) };
  if (e.status !== "in_progress") return { allowed: false, playback };
  if (mode === "full") {
    if ((playback.full ?? 0) >= MAX_FULL_PLAYS) return { allowed: false, playback };
    playback.full = (playback.full ?? 0) + 1;
  } else {
    const k = String(segment ?? 0);
    const used = playback.segments?.[k] ?? 0;
    if (used >= MAX_SEGMENT_PLAYS) return { allowed: false, playback };
    playback.segments = { ...(playback.segments ?? {}), [k]: used + 1 };
  }
  await db.update(exams).set({ playback, updatedAt: clockNow() }).where(eq(exams.id, id));
  return { allowed: true, playback };
}

export async function submitExam(id: string): Promise<void> {
  const db = await database();
  const e = await load(id);
  if (e.status === "in_progress" || e.status === "ready") {
    await db.update(exams).set({ status: "submitted", submittedAt: clockNow(), updatedAt: clockNow() }).where(eq(exams.id, id));
  }
}

export async function runExamGrading(id: string, tzHint?: string | null): Promise<void> {
  const db = await database();
  const e = await load(id);
  if (e.status !== "submitted") return;
  const profile = await getProfile(tzHint);
  try {
    const grading = await gradeExam(db, id, profile.timezone, clockNow());
    const score = totalScore(grading);
    const sectionScores = Object.fromEntries(EXAM_PARTS.map((p) => [p, grading.parts[p].score]));
    await db.update(exams).set({ grading, score, sectionScores, status: "graded", gradedAt: clockNow(), error: null, updatedAt: clockNow() }).where(eq(exams.id, id));
  } catch (err) {
    await db.update(exams).set({ error: err instanceof Error ? err.message.slice(0, 500) : String(err), updatedAt: clockNow() }).where(eq(exams.id, id));
  }
}

export async function examResults(id: string) {
  const e = await load(id);
  return {
    id: e.id,
    weekOf: e.weekOf,
    number: e.number,
    kind: e.kind,
    status: e.status,
    error: e.error,
    score: e.score,
    maxScore: gradedMax(e.sectionScores),
    content: e.content as ExamContent | null,
    responses: (e.responses ?? {}) as ExamResponses,
    grading: (e.grading ?? null) as ExamGrading | null,
    submittedAt: e.submittedAt,
  };
}

export async function examHistory() {
  const db = await database();
  return db
    .select({ id: exams.id, weekOf: exams.weekOf, number: exams.number, kind: exams.kind, score: exams.score, sectionScores: exams.sectionScores, status: exams.status })
    .from(exams)
    .where(inArray(exams.status, ["graded", "submitted"]))
    .orderBy(exams.weekOf);
}

/** Save the learner's self-assessment of the writing (0 to 6 per rubric criterion) and update the total. */
export async function assessWriting(id: string, scores: Record<string, number>): Promise<{ score: number }> {
  const db = await database();
  const e = await load(id);
  if (e.status !== "graded" || !e.grading) throw new HttpError(409, "The exam is not graded yet");
  const g = e.grading as ExamGrading;
  if (!(g.writing?.wordCount ?? 0)) throw new HttpError(409, "There is no writing to assess");
  const criteria = WRITING_CRITERIA.map((key) => {
    const v = Number(scores[key]);
    if (!Number.isFinite(v)) throw new HttpError(400, `Missing score for ${key}`);
    return { key, score: Math.max(0, Math.min(WRITING_CRITERION_MAX, Math.round(v))), max: WRITING_CRITERION_MAX, comment: "" };
  });
  g.parts.writing.score = criteria.reduce((sum, c) => sum + c.score, 0);
  g.parts.writing.notes = ["self-assessed"];
  g.writing = { corrected: "", errors: [], summary: "", wordCount: g.writing?.wordCount ?? 0, model: g.writing?.model ?? null, ...(g.writing ?? {}), criteria, selfAssessed: true };
  g.provisional = EXAM_PARTS.some((p) => g.parts[p].score === null);
  const score = totalScore(g);
  const sectionScores = Object.fromEntries(EXAM_PARTS.map((p) => [p, g.parts[p].score]));
  await db.update(exams).set({ grading: g, score, sectionScores, updatedAt: clockNow() }).where(eq(exams.id, id));
  return { score };
}
