import { eq, getTableColumns, sql, type SQL } from "drizzle-orm";
import type { PgTable } from "drizzle-orm/pg-core";
import {
  CONJUGATION_UNITS,
  GRAMMAR_CONCEPTS,
  GRAMMAR_EXERCISES,
  GRAMMAR_LESSONS,
  localizeLesson,
  SEED_VERSION,
  VOCAB_SEED,
} from "@/content";
import { exerciseHash } from "@/lib/exercise-hash";
import { LANGS } from "@/lib/i18n/types";
import type { DB } from "./client";
import { concepts, exercises, lessons, meta, profile, vocabItems, vocabTranslations } from "./schema";

function excluded<T extends PgTable>(table: T, keys: string[]): Record<string, SQL> {
  const cols = getTableColumns(table) as Record<string, { name: string }>;
  return Object.fromEntries(keys.map((k) => [k, sql.raw(`excluded."${cols[k]!.name}"`)]));
}

function chunks<T>(items: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < items.length; i += size) out.push(items.slice(i, i + size));
  return out;
}

export async function currentSeedVersion(db: DB): Promise<string | null> {
  const rows = await db.select().from(meta).where(eq(meta.key, "seed_version"));
  return (rows[0]?.value as string | undefined) ?? null;
}

/** Idempotent, versioned seeding of curated content. Never touches learner data. */
export async function seedDatabase(db: DB, force = false): Promise<boolean> {
  if (!force && (await currentSeedVersion(db)) === SEED_VERSION) return false;

  await db.transaction(async (tx) => {
    await tx.execute(sql`select pg_advisory_xact_lock(727274)`);
    const again = await tx.select().from(meta).where(eq(meta.key, "seed_version"));
    if (!force && again[0]?.value === SEED_VERSION) return;

    // Curriculum: conjugation units and grammar concepts share the concepts table.
    const conceptRows = [
      ...CONJUGATION_UNITS.map((u, i) => ({
        id: u.id,
        kind: "conjugation",
        chapter: "conjugation",
        position: i,
        cefr: u.cefr,
        title: u.title,
        objectives: u.lesson.summary,
        prerequisites: u.prerequisites,
        meta: { tenses: u.tenses, verbs: u.verbs },
      })),
      ...GRAMMAR_CONCEPTS.map((g, i) => ({
        id: g.id,
        kind: "grammar",
        chapter: g.chapter,
        position: i,
        cefr: g.cefr,
        title: g.title,
        objectives: g.objectives,
        prerequisites: g.prerequisites,
        meta: {},
      })),
    ];
    for (const batch of chunks(conceptRows, 50)) {
      await tx
        .insert(concepts)
        .values(batch)
        .onConflictDoUpdate({
          target: concepts.id,
          set: excluded(concepts, ["kind", "chapter", "position", "cefr", "title", "objectives", "prerequisites", "meta"]),
        });
    }

    const lessonRows: Array<typeof lessons.$inferInsert> = [];
    for (const u of CONJUGATION_UNITS) {
      for (const lang of LANGS) lessonRows.push({ conceptId: u.id, lang, content: localizeLesson(u.lesson, lang), source: "seed" });
    }
    for (const [conceptId, lesson] of Object.entries(GRAMMAR_LESSONS)) {
      for (const lang of LANGS) lessonRows.push({ conceptId, lang, content: localizeLesson(lesson, lang), source: "seed" });
    }
    for (const batch of chunks(lessonRows, 50)) {
      await tx
        .insert(lessons)
        .values(batch)
        .onConflictDoUpdate({ target: [lessons.conceptId, lessons.lang], set: excluded(lessons, ["content", "source"]) });
    }

    const exerciseRows = GRAMMAR_EXERCISES.map((e) => {
      const { id, concept, difficulty, ...data } = e;
      return {
        id,
        conceptId: concept,
        type: e.type,
        lang: null,
        data,
        difficulty: difficulty ?? 2,
        source: "seed",
        contentHash: exerciseHash(concept, data),
      };
    });
    for (const batch of chunks(exerciseRows, 50)) {
      await tx
        .insert(exercises)
        .values(batch)
        .onConflictDoUpdate({ target: exercises.id, set: excluded(exercises, ["conceptId", "type", "data", "difficulty", "contentHash"]) });
    }

    for (const batch of chunks(VOCAB_SEED, 60)) {
      await tx
        .insert(vocabItems)
        .values(
          batch.map((v) => ({
            id: v.id,
            lemma: v.lemma,
            lemmaKey: v.lemmaKey,
            pos: v.pos,
            gender: v.gender,
            level: v.level,
            frequency: v.frequency,
            theme: v.theme,
            tags: v.tags,
            example: v.example,
            source: "seed",
          })),
        )
        .onConflictDoUpdate({
          target: vocabItems.id,
          set: excluded(vocabItems, ["lemma", "lemmaKey", "pos", "gender", "level", "frequency", "theme", "tags", "example"]),
        });
      const trRows = batch.flatMap((v) =>
        LANGS.map((lang) => ({
          itemId: v.id,
          lang,
          main: v.translations[lang].main,
          alternatives: v.translations[lang].alternatives,
          note: v.translations[lang].note,
          exampleTranslation: v.translations[lang].exampleTranslation,
          falseFriend: v.translations[lang].falseFriend,
          cognateScore: v.translations[lang].cognateScore,
        })),
      );
      await tx
        .insert(vocabTranslations)
        .values(trRows)
        .onConflictDoUpdate({
          target: [vocabTranslations.itemId, vocabTranslations.lang],
          set: excluded(vocabTranslations, ["main", "alternatives", "note", "exampleTranslation", "falseFriend", "cognateScore"]),
        });
    }

    await tx.insert(profile).values({ id: 1 }).onConflictDoNothing();
    await tx
      .insert(meta)
      .values({ key: "seed_version", value: SEED_VERSION })
      .onConflictDoUpdate({ target: meta.key, set: { value: SEED_VERSION, updatedAt: new Date() } });
  });
  return true;
}
