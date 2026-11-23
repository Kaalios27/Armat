import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";
import { z } from "zod";
import { AIUnavailableError, generate, setProviderOverride, type ProviderFn } from "@/server/ai/provider";
import { aiGrammarExercises } from "@/server/ai/tasks";
import { closeDatabase, type DB } from "@/server/db/client";
import { aiUsage } from "@/server/db/schema";
import { gradeGrammar } from "@/server/grading/grammar";
import { gradeDictation } from "@/server/grading/dictation";
import { gradeSpanishAnswer } from "@/server/grading/vocab";
import { useTestDb } from "./support/db";

let db: DB;
const schema = z.object({ value: z.string() });

function provider(responses: Array<unknown | Error>): { fn: ProviderFn; calls: () => number } {
  let i = 0;
  const fn = (async () => {
    const r = responses[Math.min(i, responses.length - 1)];
    i++;
    if (r instanceof Error) throw r;
    return { data: r, inputTokens: 1000, outputTokens: 500 };
  }) as ProviderFn;
  return { fn, calls: () => i };
}

beforeAll(async () => {
  db = await useTestDb();
});
afterEach(async () => {
  setProviderOverride(null);
  await db.delete(aiUsage);
});
afterAll(async () => closeDatabase());

describe("AI provider layer", () => {
  it("refuses cleanly when no provider is configured", async () => {
    await expect(generate({ task: "t", system: "s", prompt: "p", schema })).rejects.toMatchObject({ reason: "not_configured" });
  });

  it("returns validated data and logs usage with cost", async () => {
    const p = provider([{ value: "ok" }]);
    setProviderOverride({ provider: "anthropic", fn: p.fn });
    const res = await generate({ task: "t", system: "s", prompt: "p", schema });
    expect(res.data.value).toBe("ok");
    const usage = await db.select().from(aiUsage);
    expect(usage).toHaveLength(1);
    expect(usage[0]!.ok).toBe(true);
    expect(usage[0]!.costUsd).toBeGreaterThan(0);
  });

  it("retries once with the validation problems, then succeeds", async () => {
    const p = provider([{ value: "bad" }, { value: "good" }]);
    setProviderOverride({ provider: "anthropic", fn: p.fn });
    const res = await generate({ task: "t", system: "s", prompt: "p", schema, validate: (d) => (d.value === "good" ? [] : ["value must be good"]) });
    expect(res.data.value).toBe("good");
    expect(p.calls()).toBe(2);
  });

  it("gives up after a failed repair", async () => {
    const p = provider([{ value: "bad" }]);
    setProviderOverride({ provider: "anthropic", fn: p.fn });
    await expect(generate({ task: "t", system: "s", prompt: "p", schema, validate: () => ["never valid"] })).rejects.toMatchObject({ reason: "invalid" });
  });

  it("converts provider failures into AIUnavailableError after a retry", async () => {
    const p = provider([new Error("HTTP 529 overloaded")]);
    setProviderOverride({ provider: "anthropic", fn: p.fn });
    const err = await generate({ task: "t", system: "s", prompt: "p", schema }).catch((e) => e);
    expect(err).toBeInstanceOf(AIUnavailableError);
    expect(err.reason).toBe("failed");
    expect(p.calls()).toBe(2);
    const usage = await db.select().from(aiUsage);
    expect(usage.every((u) => !u.ok)).toBe(true);
  });

  it("enforces the daily budget and the per-minute rate limit", async () => {
    setProviderOverride({ provider: "anthropic", fn: provider([{ value: "x" }]).fn });
    await db.insert(aiUsage).values({ task: "x", provider: "anthropic", model: "claude-opus-5-5", costUsd: 5, ok: true });
    await expect(generate({ task: "t", system: "s", prompt: "p", schema })).rejects.toMatchObject({ reason: "budget" });
    await db.delete(aiUsage);
    await db.insert(aiUsage).values(Array.from({ length: 12 }, () => ({ task: "x", provider: "anthropic", model: "m", costUsd: 0, ok: true })));
    await expect(generate({ task: "t", system: "s", prompt: "p", schema })).rejects.toMatchObject({ reason: "rate_limit" });
  });

  it("serves cached results without a new call", async () => {
    const p = provider([{ value: "cached" }]);
    setProviderOverride({ provider: "anthropic", fn: p.fn });
    await generate({ task: "lesson", system: "s", prompt: "p", schema, cacheKey: "k1" });
    const again = await generate({ task: "lesson", system: "s", prompt: "p", schema, cacheKey: "k1" });
    expect(again.cached).toBe(true);
    expect(p.calls()).toBe(1);
  });

  it("keeps only generated exercises that an independent solver reproduces", async () => {
    const exercises = {
      exercises: [
        { type: "fill", instruction: "Fill in", es: "Mi hermana ___ médica.", tokens: null, options: null, blanks: [["es"]], answers: null, explanation: "Profesión → ser." },
        { type: "fill", instruction: "Fill in", es: "El libro ___ en la mesa.", tokens: null, options: null, blanks: [["es"]], answers: null, explanation: "Wrong key on purpose." },
        { type: "translate", instruction: "I am tired.", es: null, tokens: null, options: null, blanks: null, answers: ["Estoy cansado."], explanation: "Estado → estar." },
      ],
    };
    const solver = { answers: [{ index: 0, answer: "es" }, { index: 1, answer: "está" }, { index: 2, answer: "Estoy cansado." }] };
    const p = provider([exercises, solver]);
    setProviderOverride({ provider: "anthropic", fn: p.fn });
    const out = await aiGrammarExercises({
      concept: { id: "g-ser-estar-1", title: "Ser y estar", objectives: "", cefr: "A1" },
      lang: "en",
      lesson: null,
      count: 3,
      knownWords: [],
      avoid: [],
      recentErrors: [],
    });
    expect(out).toHaveLength(2);
    expect(out.map((e) => e.es ?? e.prompt?.en)).toEqual(["Mi hermana ___ médica.", "I am tired."]);
  });
});

describe("deterministic grading", () => {
  it("grades Spanish answers with accent sensitivity", () => {
    expect(gradeSpanishAnswer("la reunión", ["reunión"]).verdict).toBe("correct");
    expect(gradeSpanishAnswer("reunion", ["reunión"]).verdict).toBe("accent");
    expect(gradeSpanishAnswer("cansada", ["cansado"], "cansado").verdict).toBe("correct");
    expect(gradeSpanishAnswer("perro", ["gato"]).verdict).toBe("wrong");
  });

  it("grades grammar blanks, choices and sentences", () => {
    expect(gradeGrammar({ type: "fill", es: "___ y ___", blanks: [["es"], ["está"]], explanation: { en: "", fr: "" } }, ["es", "está"]).correct).toBe(true);
    const accent = gradeGrammar({ type: "fill", es: "___", blanks: [["está"]], explanation: { en: "", fr: "" } }, ["esta"]);
    expect(accent).toMatchObject({ correct: false, category: "orthography" });
    expect(gradeGrammar({ type: "translate", answers: ["Es ingeniera."], explanation: { en: "", fr: "" } }, "Ella es ingeniera").correct).toBe(true);
    const open = gradeGrammar({ type: "translate", answers: ["Es ingeniera."], explanation: { en: "", fr: "" } }, "Trabaja como ingeniera.");
    expect(open.decided).toBe(false);
  });

  it("scores dictation by aligned error types", () => {
    const ref =
      "Esta mañana he llegado tarde a la oficina porque el metro se ha averiado. Mis compañeros ya habían empezado la reunión, así que he tenido que ponerme al día rápidamente. Al final, hemos tomado una decisión importante sobre el proyecto.";
    expect(gradeDictation(ref, ref).score).toBe(15);
    const answer = ref.replace("mañana", "manana").replace(" tarde", "").replace("rápidamente", "rapidamente").replace("decisión", "decision");
    const r = gradeDictation(ref, answer);
    expect(r.counts.missing).toBe(1);
    expect(r.counts.spelling).toBe(1);
    expect(r.counts.accent).toBe(2);
    expect(r.score).toBeLessThan(15);
    expect(r.score).toBeGreaterThan(10);
  });
});
