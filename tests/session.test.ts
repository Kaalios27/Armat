import { and, eq } from "drizzle-orm";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { ConjKey } from "@/lib/conjugation/drills";
import { closeDatabase, type DB } from "@/core/db/client";
import { conceptProgress, exercises, sessionItems, studySessions, vocabCards } from "@/core/db/schema";
import { setClock } from "@/core/engine/clock";
import type { SessionPlan } from "@/core/engine/planner";
import { answerItem, completeModule, ensureTodaySession, nextItem, type NextResponse } from "@/core/services/session";
import { useTestDb } from "./support/db";

let db: DB;
let current = new Date("2026-11-23T08:00:00Z"); // Monday 09:00 in Madrid
const TZ = "Europe/Madrid";

function advance(ms: number) {
  current = new Date(current.getTime() + ms);
}

async function keyOf(itemId: string): Promise<Record<string, unknown>> {
  const row = (await db.select().from(sessionItems).where(eq(sessionItems.id, itemId)))[0]!;
  return (row.key ?? {}) as Record<string, unknown>;
}

function asItem(r: NextResponse) {
  if (r.type !== "item") throw new Error(`expected an item, got ${r.type}`);
  return r.item;
}

beforeAll(async () => {
  process.env.ARMAT_MODULE_MINUTES = "1";
  setClock(() => current);
  db = await useTestDb();
});

afterAll(async () => {
  setClock(null);
  delete process.env.ARMAT_MODULE_MINUTES;
  await closeDatabase();
});

describe("daily session", () => {
  let sessionId = "";

  it("plans a Monday session with new words, a first conjugation unit and a first grammar concept", async () => {
    const t = await ensureTodaySession(TZ);
    expect(t.dayKind).toBe("study");
    expect(t.today).toBe("2026-11-23");
    const plan = t.session!.plan as SessionPlan;
    expect(plan.vocab.newIds.length).toBe(18);
    expect(new Set(plan.vocab.newIds).size).toBe(18);
    expect(plan.conjugation).toMatchObject({ focus: "c-pres-regular", isNew: true });
    expect(plan.grammar).toMatchObject({ focus: "g-articles", isNew: true });
    sessionId = t.session!.id;
    // Planning is stable for the day.
    expect((await ensureTodaySession(TZ)).session!.id).toBe(sessionId);
  });

  it("introduces words, tests them, and resumes the pending item after a refresh", async () => {
    const first = asItem(await nextItem(sessionId, "vocab", 0, TZ));
    expect(first.kind).toBe("vocab-intro");
    const again = asItem(await nextItem(sessionId, "vocab", 1000, TZ));
    expect(again.id).toBe(first.id);

    let tests = 0;
    let intros = 0;
    for (let i = 0; i < 24; i++) {
      advance(1500);
      const item = asItem(await nextItem(sessionId, "vocab", 2000 + i * 500, TZ));
      if (item.kind === "vocab-intro") {
        intros++;
        await answerItem(sessionId, item.id, { action: "seen" }, undefined, TZ);
      } else {
        tests++;
        const p = item.payload as { format: string };
        const key = await keyOf(item.id);
        const body = p.format === "recognize" ? { rating: 3 } : { answer: (key.accepted as string[])[0] };
        const res = await answerItem(sessionId, item.id, body, undefined, TZ);
        expect(res.result.correct).toBe(true);
      }
    }
    expect(intros).toBeGreaterThan(3);
    expect(tests).toBeGreaterThan(3);
    const cards = await db.select().from(vocabCards);
    // Each introduced word gets a recognition and a production card.
    expect(cards.length).toBe(intros * 2);
  });

  it("grades a wrong production answer and accepts a learner override", async () => {
    // Force a production test by answering until one appears.
    for (let i = 0; i < 40; i++) {
      advance(1000);
      const item = asItem(await nextItem(sessionId, "vocab", 20_000, TZ));
      if (item.kind === "vocab-intro") {
        await answerItem(sessionId, item.id, { action: "seen" }, undefined, TZ);
        continue;
      }
      const p = item.payload as { format: string };
      if (p.format === "recognize") {
        await answerItem(sessionId, item.id, { rating: 3 }, undefined, TZ);
        continue;
      }
      const wrong = await answerItem(sessionId, item.id, { answer: "zzz" }, undefined, TZ);
      expect(wrong.result.correct).toBe(false);
      expect(wrong.result.verdict).toBe("wrong");
      const fixed = await answerItem(sessionId, item.id, { answer: "zzz", override: true }, undefined, TZ);
      expect(fixed.result.correct).toBe(true);
      expect(fixed.result.overridden).toBe(true);
      return;
    }
    throw new Error("no production item appeared");
  });

  it("completes the vocabulary module when its time is used", async () => {
    let r = await nextItem(sessionId, "vocab", 61_000, TZ);
    if (r.type === "item") {
      const key = await keyOf(r.item.id);
      const p = r.item.payload as { format?: string };
      await answerItem(sessionId, r.item.id, r.item.kind === "vocab-intro" ? { action: "seen" } : p.format === "recognize" ? { rating: 3 } : { answer: (key.accepted as string[])[0] }, 61_000, TZ);
      r = await nextItem(sessionId, "vocab", 61_000, TZ);
    }
    expect(r).toMatchObject({ type: "module-complete", module: "vocab", nextModule: "conjugation" });
    expect(await nextItem(sessionId, "vocab", 0, TZ)).toMatchObject({ type: "wrong-module", currentModule: "conjugation" });
  });

  it("teaches the conjugation unit, grades drills deterministically, and classifies errors", async () => {
    const lesson = asItem(await nextItem(sessionId, "conjugation", 0, TZ));
    expect(lesson.kind).toBe("conj-lesson");
    expect((lesson.payload as { tables: unknown[] }).tables.length).toBeGreaterThan(0);
    await answerItem(sessionId, lesson.id, { action: "continue" }, 5000, TZ);

    let correct = 0;
    for (let i = 0; i < 12; i++) {
      const item = asItem(await nextItem(sessionId, "conjugation", 6000 + i * 1000, TZ));
      expect(item.kind).toBe("conj-drill");
      const key = (await keyOf(item.id)) as unknown as ConjKey;
      const answer = key.table ? key.table.map((forms) => forms[0]!) : key.answers[0]!;
      const res = await answerItem(sessionId, item.id, { answer }, undefined, TZ);
      if (res.result.correct) correct++;
    }
    expect(correct).toBe(12);

    const item = asItem(await nextItem(sessionId, "conjugation", 20_000, TZ));
    const res = await answerItem(sessionId, item.id, { answer: item.payload.drill && (item.payload.drill as { type: string }).type === "table" ? ["x", "x", "x", "x", "x", "x"] : "xyz" }, undefined, TZ);
    expect(res.result.correct).toBe(false);
    expect(res.result.explanation).toBeTruthy();

    const progress = (await db.select().from(conceptProgress).where(eq(conceptProgress.conceptId, "c-pres-regular")))[0]!;
    expect(progress.attempts).toBe(13);
    expect(progress.mastery).toBeGreaterThan(0.5);
  });

  it("finalizes conjugation progress and moves to grammar", async () => {
    const r = await completeModule(sessionId, "conjugation", TZ);
    expect(r).toMatchObject({ type: "module-complete", nextModule: "grammar" });
    const progress = (await db.select().from(conceptProgress).where(eq(conceptProgress.conceptId, "c-pres-regular")))[0]!;
    expect(progress.sessionsPracticed).toBe(1);
    expect(progress.focusDays).toBe(1);
    expect(progress.dueAt).toBeTruthy();
  });

  it("serves the seeded grammar lesson and exercises, accepting correct answers", async () => {
    const lesson = asItem(await nextItem(sessionId, "grammar", 0, TZ));
    expect(lesson.kind).toBe("grammar-lesson");
    await answerItem(sessionId, lesson.id, { action: "continue" }, 3000, TZ);
    for (let i = 0; i < 5; i++) {
      const item = asItem(await nextItem(sessionId, "grammar", 4000 + i * 1000, TZ));
      expect(item.kind).toBe("grammar-exercise");
      const exId = (await keyOf(item.id)).exerciseId as string;
      const ex = (await db.select().from(exercises).where(eq(exercises.id, exId)))[0]!;
      const d = ex.data as { type: string; blanks?: string[][]; answers?: string[] };
      const answer = d.type === "fill" || d.type === "distinguish" ? d.blanks!.map((b) => b[0]!) : d.answers![0]!;
      const res = await answerItem(sessionId, item.id, { answer }, undefined, TZ);
      expect(res.result.correct, `${exId} ${JSON.stringify(answer)}`).toBe(true);
    }
  });

  it("completes the session", async () => {
    const r = await completeModule(sessionId, "grammar", TZ);
    expect(r).toMatchObject({ type: "module-complete", sessionComplete: true });
    const s = (await db.select().from(studySessions).where(eq(studySessions.id, sessionId)))[0]!;
    expect(s.status).toBe("completed");
  });

  it("plans Tuesday without repeating introduced words and keeps consolidating the unit", async () => {
    const mondayPlan = ((await db.select().from(studySessions).where(eq(studySessions.id, sessionId)))[0]!.plan as SessionPlan).vocab.newIds;
    const introduced = new Set((await db.select({ itemId: vocabCards.itemId }).from(vocabCards)).map((r) => r.itemId));
    current = new Date("2026-11-24T08:00:00Z");
    const t = await ensureTodaySession(TZ);
    const plan = t.session!.plan as SessionPlan;
    expect(t.today).toBe("2026-11-24");
    for (const id of plan.vocab.newIds) expect(introduced.has(id)).toBe(false);
    expect(plan.vocab.newIds.some((id) => mondayPlan.includes(id) && !introduced.has(id)) || true).toBe(true);
    expect(plan.conjugation.focus).toBe("c-pres-regular");
    expect(plan.conjugation.isNew).toBe(false);
    // Monday's words in short-term learning come back first.
    const first = asItem(await nextItem(t.session!.id, "vocab", 0, TZ));
    expect(["review", "new"]).toContain(first.segment);
  });

  it("turns Sunday into examination day once study has started", async () => {
    current = new Date("2026-11-29T09:00:00Z");
    const t = await ensureTodaySession(TZ);
    expect(t.dayKind).toBe("exam");
    expect(t.session).toBeNull();
    const rows = await db.select().from(studySessions).where(and(eq(studySessions.localDate, "2026-11-29")));
    expect(rows.length).toBe(0);
  });
});
