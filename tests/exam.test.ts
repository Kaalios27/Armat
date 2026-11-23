import { eq } from "drizzle-orm";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { ConjKey } from "@/lib/conjugation/drills";
import { closeDatabase, type DB } from "@/server/db/client";
import { exams, exercises, sessionItems } from "@/server/db/schema";
import { setClock } from "@/server/engine/clock";
import type { ExamKey } from "@/server/exam/types";
import {
  ensureExam,
  examForTaking,
  examOverview,
  examResults,
  registerPlayback,
  runExamGeneration,
  runExamGrading,
  saveExam,
  startExam,
  submitExam,
} from "@/server/services/exam";
import { answerItem, completeModule, ensureTodaySession, nextItem } from "@/server/services/session";
import { useTestDb } from "./support/db";

let db: DB;
let current = new Date("2026-11-23T08:00:00Z");
const TZ = "Europe/Madrid";

async function studyDay() {
  const t = await ensureTodaySession(TZ);
  const id = t.session!.id;
  for (let i = 0; i < 20; i++) {
    const r = await nextItem(id, "vocab", i * 1000, TZ);
    if (r.type !== "item") break;
    const row = (await db.select().from(sessionItems).where(eq(sessionItems.id, r.item.id)))[0]!;
    const key = (row.key ?? {}) as { accepted?: string[] };
    const p = r.item.payload as { format?: string };
    await answerItem(id, r.item.id, r.item.kind === "vocab-intro" ? { action: "seen" } : p.format === "recognize" ? { rating: 3 } : { answer: key.accepted![0] }, undefined, TZ);
  }
  await completeModule(id, "vocab", TZ);
  for (let i = 0; i < 10; i++) {
    const r = await nextItem(id, "conjugation", i * 1000, TZ);
    if (r.type !== "item") break;
    const row = (await db.select().from(sessionItems).where(eq(sessionItems.id, r.item.id)))[0]!;
    if (r.item.kind === "conj-lesson") {
      await answerItem(id, r.item.id, { action: "continue" }, undefined, TZ);
      continue;
    }
    const key = row.key as unknown as ConjKey;
    // Answer one in three wrongly to create weaknesses.
    const answer = i % 3 === 0 ? "mal" : key.table ? key.table.map((f) => f[0]!) : key.answers[0]!;
    await answerItem(id, r.item.id, { answer }, undefined, TZ);
  }
  await completeModule(id, "conjugation", TZ);
  for (let i = 0; i < 6; i++) {
    const r = await nextItem(id, "grammar", i * 1000, TZ);
    if (r.type !== "item") break;
    await answerItem(id, r.item.id, r.item.kind === "grammar-lesson" ? { action: "continue" } : { answer: "x" }, undefined, TZ);
  }
  await completeModule(id, "grammar", TZ);
}

beforeAll(async () => {
  process.env.ARMAT_MODULE_MINUTES = "1";
  setClock(() => current);
  db = await useTestDb();
  for (const day of ["2026-11-23", "2026-11-24", "2026-11-25"]) {
    current = new Date(`${day}T08:00:00Z`);
    await studyDay();
  }
  current = new Date("2026-11-29T09:00:00Z"); // Sunday
});

afterAll(async () => {
  setClock(null);
  delete process.env.ARMAT_MODULE_MINUTES;
  await closeDatabase();
});

describe("weekly exam", () => {
  let examId = "";

  it("is available on Sunday after a study week", async () => {
    const o = await examOverview(TZ);
    expect(o.current).toMatchObject({ weekOf: "2026-11-29", number: 1, kind: "weekly", status: "available", canStart: true });
  });

  it("is generated from history with curated fallbacks when AI is off", async () => {
    const row = await ensureExam("2026-11-29", TZ);
    examId = row.id;
    expect(row.status).toBe("generating");
    await runExamGeneration(examId, TZ);
    const e = await examForTaking(examId);
    expect(e.status).toBe("ready");
    expect(e.content!.conjugation).toHaveLength(20);
    expect(e.content!.grammar.length).toBeGreaterThanOrEqual(5);
    expect(e.content!.translation.length).toBeGreaterThanOrEqual(3);
    expect(e.content!.dictation.segments).toBeGreaterThan(1);
    expect(e.content!.writing.minWords).toBeGreaterThanOrEqual(70);
    expect(e.content!.sources.writing).toBe("curated");
    // The answer key never reaches the client.
    expect(JSON.stringify(e)).not.toContain('"answers"');
    const key = (await db.select().from(exams).where(eq(exams.id, examId)))[0]!.key as ExamKey;
    for (const item of e.content!.conjugation) expect(["c-pres-regular", "c-pres-irregular-core"]).toContain(key.conjugation.find((k) => k.id === item.id)!.unitId);
  });

  it("autosaves answers and enforces dictation playback limits", async () => {
    await startExam(examId);
    expect((await registerPlayback(examId, "full")).allowed).toBe(true);
    expect((await registerPlayback(examId, "full")).allowed).toBe(true);
    expect((await registerPlayback(examId, "full")).allowed).toBe(false);
    for (let i = 0; i < 3; i++) expect((await registerPlayback(examId, "segment", 0)).allowed).toBe(true);
    expect((await registerPlayback(examId, "segment", 0)).allowed).toBe(false);

    const key = (await db.select().from(exams).where(eq(exams.id, examId)))[0]!.key as ExamKey;
    const conjugation = Object.fromEntries(key.conjugation.map((k) => [k.id, k.answers[0]!]));
    const grammar = Object.fromEntries(key.grammar.map((k) => [k.id, k.data.type === "fill" || k.data.type === "distinguish" ? k.data.blanks!.map((b) => b[0]!) : k.data.answers![0]!]));
    const translation = Object.fromEntries(key.translation.map((k) => [k.id, k.references[0]!]));
    await saveExam(examId, { responses: { dictation: key.dictation.text, conjugation }, elapsedMs: 600_000 });
    await saveExam(examId, { responses: { grammar, translation, writing: "Creo que el teletrabajo tiene ventajas y desventajas." }, elapsedMs: 1_200_000 });
    const e = await examForTaking(examId);
    expect(Object.keys(e.responses.conjugation ?? {})).toHaveLength(20);
    expect(e.responses.dictation).toBe(key.dictation.text);
    expect(e.elapsedMs).toBe(1_200_000);
  });

  it("grades deterministic parts and marks the writing as provisional without AI", async () => {
    await submitExam(examId);
    await runExamGrading(examId, TZ);
    const r = await examResults(examId);
    expect(r.status).toBe("graded");
    const g = r.grading!;
    expect(g.parts.dictation.score).toBe(15);
    expect(g.parts.conjugation.score).toBe(20);
    expect(g.parts.grammar.score).toBe(20);
    expect(g.parts.translation.score).toBe(15);
    expect(g.parts.writing.score).toBeNull();
    expect(g.provisional).toBe(true);
    expect(r.score).toBe(70);
  });

  it("submits automatically when the time is used", async () => {
    current = new Date("2026-11-30T09:00:00Z"); // Monday: last week's exam is now "late"
    await db.update(exams).set({ status: "in_progress", elapsedMs: 0, score: null }).where(eq(exams.id, examId));
    const res = await saveExam(examId, { elapsedMs: 60 * 60_000 + 5000 });
    expect(res.status).toBe("submitted");
  });

  it("detects wrong answers with categories", async () => {
    await db.update(exams).set({ status: "submitted", responses: { conjugation: { c1: "xxx" }, dictation: "" } }).where(eq(exams.id, examId));
    await runExamGrading(examId, TZ);
    const g = (await examResults(examId)).grading!;
    expect(g.parts.dictation.score).toBe(0);
    expect(g.parts.conjugation.items[0]!.correct).toBe(false);
    expect(g.parts.conjugation.score).toBe(0);
    expect(g.recommendations.length).toBeGreaterThan(0);
  });
});

describe("exam content integrity", () => {
  it("uses seeded exercises that exist", async () => {
    const key = (await db.select().from(exams))[0]!.key as ExamKey;
    for (const g of key.grammar) {
      const found = await db.select().from(exercises).where(eq(exercises.conceptId, g.conceptId));
      expect(found.length).toBeGreaterThan(0);
    }
  });
});
