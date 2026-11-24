import { count } from "drizzle-orm";
import { afterAll, describe, expect, it } from "vitest";
import { CONJUGATION_UNITS, GRAMMAR_CONCEPTS, GRAMMAR_EXERCISES, GRAMMAR_LESSONS, VOCAB_SEED } from "@/content";
import { canDrill } from "@/lib/conjugation/drills";
import { cognateScore, lemmaKey, looseKey } from "@/lib/lemma";
import { closeDatabase } from "@/core/db/client";
import { concepts, exercises, lessons, vocabItems, vocabTranslations } from "@/core/db/schema";
import { seedDatabase } from "@/core/db/seed";
import { useTestDb } from "./support/db";

describe("curated content", () => {
  it("has unique vocabulary ids and lemma keys", () => {
    const ids = new Set<string>();
    const keys = new Set<string>();
    for (const v of VOCAB_SEED) {
      expect(ids.has(v.id), `duplicate id ${v.id}`).toBe(false);
      expect(keys.has(v.lemmaKey), `duplicate lemma ${v.lemma}`).toBe(false);
      ids.add(v.id);
      keys.add(v.lemmaKey);
      expect(v.translations.en.main).toBeTruthy();
      expect(v.translations.fr.main).toBeTruthy();
      expect(v.level).toBeGreaterThanOrEqual(1);
      expect(v.frequency).toBeGreaterThanOrEqual(1);
    }
    expect(VOCAB_SEED.length).toBeGreaterThan(400);
  });

  it("normalises lemma keys and loose keys", () => {
    expect(lemmaKey("  La Reunión ")).toBe("reunión");
    expect(lemmaKey("echar de menos (a alguien)")).toBe("echar de menos");
    expect(looseKey("darse cuenta de")).toBe(looseKey("darse cuenta"));
    expect(looseKey("volver a")).toBe("volver a");
  });

  it("scores cognates per instruction language", () => {
    expect(cognateScore("importar", "v", ["to matter"], "en")).toBeLessThan(0.5);
    expect(cognateScore("importar", "v", ["importer"], "fr")).toBeGreaterThan(0.8);
    expect(cognateScore("aprovechar", "v", ["profiter de"], "fr")).toBeLessThan(0.5);
    expect(cognateScore("sociedad", "n", ["société"], "fr")).toBeGreaterThan(0.5);
  });

  it("only drills verbs the conjugator knows, in every unit tense", () => {
    for (const u of CONJUGATION_UNITS) {
      for (const t of u.tenses) {
        const drillable = u.verbs.filter((v) => canDrill(v, t));
        expect(drillable.length, `${u.id} ${t}`).toBeGreaterThanOrEqual(5);
        for (const v of u.verbs) expect(canDrill(v, t) || t.startsWith("imper"), `${u.id}: ${v} ${t}`).toBe(true);
      }
      for (const p of u.prerequisites) expect(CONJUGATION_UNITS.some((x) => x.id === p)).toBe(true);
    }
  });

  it("has consistent grammar concepts, lessons and exercises", () => {
    const ids = new Set([...GRAMMAR_CONCEPTS.map((c) => c.id), ...CONJUGATION_UNITS.map((u) => u.id)]);
    for (const c of GRAMMAR_CONCEPTS) for (const p of c.prerequisites) expect(ids.has(p), `${c.id} → ${p}`).toBe(true);
    for (const id of Object.keys(GRAMMAR_LESSONS)) expect(ids.has(id)).toBe(true);
    const exIds = new Set<string>();
    for (const e of GRAMMAR_EXERCISES) {
      expect(exIds.has(e.id)).toBe(false);
      exIds.add(e.id);
      expect(ids.has(e.concept), e.id).toBe(true);
      expect(e.explanation.en && e.explanation.fr, e.id).toBeTruthy();
      if (e.type === "fill" || e.type === "distinguish") {
        const blanks = (e.es ?? "").split("___").length - 1;
        expect(blanks, e.id).toBe(e.blanks?.length);
      } else if (e.type === "choose") {
        expect(e.options, e.id).toContain(e.answers?.[0]);
      } else {
        expect(e.answers?.length, e.id).toBeGreaterThan(0);
      }
      if (e.type === "translate") expect(e.prompt?.en && e.prompt?.fr, e.id).toBeTruthy();
    }
  });
});

describe("seeding", () => {
  afterAll(async () => closeDatabase());

  it("loads content into Postgres and is idempotent", async () => {
    const db = await useTestDb();
    const [{ value: nConcepts }] = await db.select({ value: count() }).from(concepts);
    const [{ value: nVocab }] = await db.select({ value: count() }).from(vocabItems);
    const [{ value: nTr }] = await db.select({ value: count() }).from(vocabTranslations);
    const [{ value: nLessons }] = await db.select({ value: count() }).from(lessons);
    const [{ value: nEx }] = await db.select({ value: count() }).from(exercises);
    expect(nConcepts).toBe(GRAMMAR_CONCEPTS.length + CONJUGATION_UNITS.length);
    expect(nVocab).toBe(VOCAB_SEED.length);
    expect(nTr).toBe(VOCAB_SEED.length * 2);
    expect(nLessons).toBe((Object.keys(GRAMMAR_LESSONS).length + CONJUGATION_UNITS.length) * 2);
    expect(nEx).toBe(GRAMMAR_EXERCISES.length);
    expect(await seedDatabase(db)).toBe(false);
    expect(await seedDatabase(db, true)).toBe(true);
    const [{ value: again }] = await db.select({ value: count() }).from(vocabItems);
    expect(again).toBe(VOCAB_SEED.length);
  });
});
