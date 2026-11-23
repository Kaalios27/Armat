import { describe, expect, it } from "vitest";
import { addDays, endOfLocalDay, localDate, startOfLocalDay, weekday } from "@/server/engine/clock";
import {
  adaptNewWordTarget,
  canAdvanceConjugation,
  canAdvanceGrammar,
  isMastered,
  newWordsForToday,
  selectNewVocab,
  updateMastery,
  vocabScore,
  type VocabCandidate,
} from "@/server/engine/progression";
import {
  dayKind,
  examKind,
  examNumber,
  examWindow,
  firstExamSunday,
  lateExamSunday,
  upcomingExamSunday,
} from "@/server/engine/schedule";
import { gradeFromAccuracy, gradeFromAnswer, newCard, retrievability, reviewCard, State } from "@/server/engine/srs";
import { seededRandom } from "@/lib/text";

describe("calendar", () => {
  it("computes local dates and weekdays across time zones", () => {
    const d = new Date("2026-11-22T23:30:00Z");
    expect(localDate(d, "Europe/Madrid")).toBe("2026-11-23");
    expect(localDate(d, "America/New_York")).toBe("2026-11-22");
    expect(weekday("2026-11-22")).toBe(0);
    expect(weekday("2026-11-23")).toBe(1);
    expect(addDays("2026-11-30", 1)).toBe("2026-12-01");
    expect(startOfLocalDay("2026-11-23", "Europe/Madrid").toISOString()).toBe("2026-11-22T23:00:00.000Z");
    expect(endOfLocalDay("2026-03-28", "Europe/Madrid").toISOString()).toBe("2026-03-28T23:00:00.000Z");
    // Across the DST change in Spain (29 March 2026).
    expect(endOfLocalDay("2026-03-29", "Europe/Madrid").toISOString()).toBe("2026-03-29T22:00:00.000Z");
  });

  it("makes Sunday an exam day only after the program has started", () => {
    expect(dayKind("2026-11-22", null)).toBe("study");
    expect(dayKind("2026-11-22", "2026-11-22")).toBe("study");
    expect(dayKind("2026-11-29", "2026-11-22")).toBe("exam");
    expect(dayKind("2026-11-24", "2026-11-23")).toBe("study");
  });

  it("numbers weekly exams and makes every fourth one monthly", () => {
    const start = "2026-11-23"; // Monday
    expect(firstExamSunday(start)).toBe("2026-11-29");
    expect(firstExamSunday("2026-11-22")).toBe("2026-11-29");
    expect(examNumber("2026-11-29", start)).toBe(1);
    expect(examNumber("2026-12-20", start)).toBe(4);
    expect(examKind(1)).toBe("weekly");
    expect(examKind(4)).toBe("monthly");
    expect(examKind(8)).toBe("monthly");
    expect(examKind(5)).toBe("weekly");
    expect(examWindow("2026-11-29", start)).toEqual({ from: "2026-11-23", to: "2026-11-28" });
    expect(examWindow("2026-11-29", "2026-11-26")).toEqual({ from: "2026-11-26", to: "2026-11-28" });
  });

  it("offers the upcoming exam and a late window", () => {
    expect(upcomingExamSunday("2026-11-25", "2026-11-23")).toBe("2026-11-29");
    expect(upcomingExamSunday("2026-11-29", "2026-11-23")).toBe("2026-11-29");
    expect(upcomingExamSunday("2026-11-25", null)).toBeNull();
    expect(lateExamSunday("2026-11-30", "2026-11-23")).toBe("2026-11-29");
    expect(lateExamSunday("2026-11-25", "2026-11-23")).toBeNull();
    expect(lateExamSunday("2026-12-06", "2026-11-23")).toBeNull();
  });
});

describe("spaced repetition (FSRS-7)", () => {
  it("uses learning steps, then grows intervals with successful reviews", async () => {
    const t0 = new Date("2026-11-23T09:00:00Z");
    const c0 = await newCard(t0);
    expect(c0.state).toBe(State.New);
    const again = await reviewCard(c0.card, 1, t0);
    expect(again.dueAt.getTime() - t0.getTime()).toBeLessThanOrEqual(10 * 60_000);
    const good = await reviewCard(c0.card, 3, t0);
    expect(good.state).toBe(State.Learning);
    const graduated = await reviewCard(good.card, 3, good.dueAt);
    expect(graduated.state).toBe(State.Review);
    expect(graduated.scheduledDays).toBeGreaterThanOrEqual(1);
    const later = await reviewCard(graduated.card, 3, graduated.dueAt);
    expect(later.scheduledDays).toBeGreaterThan(graduated.scheduledDays);
    const lapse = await reviewCard(later.card, 1, later.dueAt);
    expect(lapse.state).toBe(State.Relearning);
    expect(lapse.lapses).toBe(1);
    expect(lapse.dueAt.getTime() - later.dueAt.getTime()).toBeLessThan(86_400_000);
  });

  it("estimates retrievability and maps answers to grades", async () => {
    const t0 = new Date("2026-11-23T09:00:00Z");
    const c = await reviewCard((await reviewCard((await newCard(t0)).card, 3, t0)).card, 3, new Date(t0.getTime() + 600_000));
    const r1 = await retrievability(c.card, new Date(t0.getTime() + 86_400_000));
    const r30 = await retrievability(c.card, new Date(t0.getTime() + 30 * 86_400_000));
    expect(r1).toBeGreaterThan(r30);
    expect(gradeFromAnswer("wrong", 2000, true)).toBe(1);
    expect(gradeFromAnswer("accent", 2000, true)).toBe(2);
    expect(gradeFromAnswer("correct", 2000, true)).toBe(4);
    expect(gradeFromAnswer("correct", 9000, true)).toBe(3);
    expect(gradeFromAccuracy(0.97)).toBe(4);
    expect(gradeFromAccuracy(0.5)).toBe(1);
  });
});

describe("progression", () => {
  it("requires multiple successful attempts for mastery", () => {
    let m = 0;
    for (let i = 0; i < 3; i++) m = updateMastery(m, 1);
    expect(isMastered("conjugation", { mastery: m, attempts: 3, sessionsPracticed: 1 })).toBe(false);
    for (let i = 0; i < 30; i++) m = updateMastery(m, 1);
    expect(isMastered("conjugation", { mastery: m, attempts: 33, sessionsPracticed: 1 })).toBe(true);
    expect(isMastered("grammar", { mastery: 0.85, attempts: 12, sessionsPracticed: 2 })).toBe(true);
  });

  it("never stalls on one concept for long", () => {
    expect(canAdvanceGrammar({ status: "practicing", mastery: 0.4, attempts: 10, sessionsPracticed: 2, focusDays: 2 })).toBe(false);
    expect(canAdvanceGrammar({ status: "practicing", mastery: 0.4, attempts: 10, sessionsPracticed: 3, focusDays: 3 })).toBe(true);
    expect(canAdvanceGrammar({ status: "practicing", mastery: 0.75, attempts: 9, sessionsPracticed: 1, focusDays: 1 })).toBe(true);
    expect(canAdvanceConjugation({ status: "practicing", mastery: 0.5, attempts: 40, sessionsPracticed: 4, focusDays: 4 })).toBe(false);
    expect(canAdvanceConjugation({ status: "practicing", mastery: 0.5, attempts: 50, sessionsPracticed: 5, focusDays: 5 })).toBe(true);
  });

  it("adapts the new-word pace to retention and review load", () => {
    expect(adaptNewWordTarget(18, "standard", { retention: 0.95, reviewsDueTomorrow: 20 })).toBe(21);
    expect(adaptNewWordTarget(18, "standard", { retention: 0.75, reviewsDueTomorrow: 130 })).toBe(10);
    expect(adaptNewWordTarget(8, "standard", { retention: 0.7, reviewsDueTomorrow: 200 })).toBe(8);
    expect(newWordsForToday(20, 30)).toBe(20);
    expect(newWordsForToday(20, 120)).toBe(10);
  });

  it("prefers useful, hard-to-infer words and never excludes cognates entirely", () => {
    const base = { level: 1, frequency: 4, theme: "core", tags: [] as string[], falseFriend: false };
    const opaque: VocabCandidate = { ...base, id: "a", cognate: 0.1 };
    const cognate: VocabCandidate = { ...base, id: "b", cognate: 0.95 };
    const falseFriend: VocabCandidate = { ...base, id: "c", cognate: 0.9, falseFriend: true };
    expect(vocabScore(opaque, 1)).toBeGreaterThan(vocabScore(cognate, 1));
    expect(vocabScore(falseFriend, 1)).toBeGreaterThan(vocabScore(cognate, 1));
    const picked = selectNewVocab([opaque, cognate, falseFriend], 3, seededRandom("x"));
    expect(picked).toHaveLength(3);
    expect(picked).toContain("b");
  });
});
