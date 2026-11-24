import { sql } from "drizzle-orm";
import {
  boolean,
  date,
  index,
  integer,
  jsonb,
  pgTable,
  primaryKey,
  real,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";
import type { Localized } from "@/lib/i18n/types";

const createdAt = () => timestamp("created_at", { withTimezone: true }).defaultNow().notNull();
const updatedAt = () => timestamp("updated_at", { withTimezone: true }).defaultNow().notNull();
const emptyTextArray = sql`'{}'::text[]`;

/** Serialized FSRS card (ts-fsrs FSRS-7 state, dates as ISO strings). */
export type StoredCard = Record<string, unknown> & { dueAt: string; lastReviewAt: string | null };

export const meta = pgTable("meta", {
  key: text("key").primaryKey(),
  value: jsonb("value").notNull(),
  updatedAt: updatedAt(),
});

export const profile = pgTable("profile", {
  id: integer("id").primaryKey().default(1),
  uiLang: text("ui_lang").notNull().default("en"),
  /** IANA zone, or "auto" to follow the browser. */
  timezone: text("timezone").notNull().default("auto"),
  theme: text("theme").notNull().default("system"),
  pace: text("pace").notNull().default("standard"),
  newWordsTarget: integer("new_words_target").notNull().default(18),
  dictationVoice: text("dictation_voice").notNull().default("auto"),
  startedOn: date("started_on"),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
});

// ---------------------------------------------------------------------------
// Curriculum
// ---------------------------------------------------------------------------

export const concepts = pgTable(
  "concepts",
  {
    id: text("id").primaryKey(),
    kind: text("kind").notNull(), // grammar | conjugation
    chapter: text("chapter").notNull(),
    position: integer("position").notNull(),
    cefr: text("cefr").notNull(),
    title: jsonb("title").$type<Localized>().notNull(),
    objectives: jsonb("objectives").$type<Localized>().notNull(),
    prerequisites: text("prerequisites").array().notNull().default(emptyTextArray),
    meta: jsonb("meta").$type<Record<string, unknown>>().notNull().default({}),
    updatedAt: updatedAt(),
  },
  (t) => [index("concepts_kind_position_idx").on(t.kind, t.position)],
);

export const lessons = pgTable(
  "lessons",
  {
    conceptId: text("concept_id")
      .notNull()
      .references(() => concepts.id, { onDelete: "cascade" }),
    lang: text("lang").notNull(),
    content: jsonb("content").notNull(),
    source: text("source").notNull(), // seed | ai
    model: text("model"),
    createdAt: createdAt(),
  },
  (t) => [primaryKey({ columns: [t.conceptId, t.lang] })],
);

export const exercises = pgTable(
  "exercises",
  {
    id: text("id").primaryKey(),
    conceptId: text("concept_id")
      .notNull()
      .references(() => concepts.id, { onDelete: "cascade" }),
    type: text("type").notNull(),
    /** null: bilingual seed exercise; en | fr: AI exercise written for that language. */
    lang: text("lang"),
    data: jsonb("data").notNull(),
    difficulty: integer("difficulty").notNull().default(2),
    source: text("source").notNull(),
    contentHash: text("content_hash").notNull(),
    retired: boolean("retired").notNull().default(false),
    createdAt: createdAt(),
  },
  (t) => [uniqueIndex("exercises_hash_idx").on(t.contentHash), index("exercises_concept_idx").on(t.conceptId)],
);

// ---------------------------------------------------------------------------
// Vocabulary
// ---------------------------------------------------------------------------

export const vocabItems = pgTable(
  "vocab_items",
  {
    id: text("id").primaryKey(),
    lemma: text("lemma").notNull(),
    lemmaKey: text("lemma_key").notNull(),
    pos: text("pos").notNull(),
    gender: text("gender"),
    level: integer("level").notNull(),
    frequency: integer("frequency").notNull(),
    theme: text("theme").notNull(),
    tags: text("tags").array().notNull().default(emptyTextArray),
    example: text("example"),
    source: text("source").notNull(),
    createdAt: createdAt(),
  },
  (t) => [uniqueIndex("vocab_items_lemma_key_idx").on(t.lemmaKey), index("vocab_items_level_idx").on(t.level)],
);

export const vocabAliases = pgTable("vocab_aliases", {
  key: text("key").primaryKey(),
  itemId: text("item_id")
    .notNull()
    .references(() => vocabItems.id, { onDelete: "cascade" }),
});

export const vocabTranslations = pgTable(
  "vocab_translations",
  {
    itemId: text("item_id")
      .notNull()
      .references(() => vocabItems.id, { onDelete: "cascade" }),
    lang: text("lang").notNull(),
    main: text("main").notNull(),
    alternatives: text("alternatives").array().notNull().default(emptyTextArray),
    note: text("note"),
    exampleTranslation: text("example_translation"),
    falseFriend: boolean("false_friend").notNull().default(false),
    cognateScore: real("cognate_score").notNull().default(0),
  },
  (t) => [primaryKey({ columns: [t.itemId, t.lang] })],
);

export const vocabCards = pgTable(
  "vocab_cards",
  {
    id: text("id").primaryKey(), // `${itemId}|${direction}`
    itemId: text("item_id")
      .notNull()
      .references(() => vocabItems.id, { onDelete: "cascade" }),
    direction: text("direction").notNull(), // recognition | production
    fsrs: jsonb("fsrs").$type<StoredCard>().notNull(),
    dueAt: timestamp("due_at", { withTimezone: true }).notNull(),
    state: integer("state").notNull(),
    stability: real("stability").notNull().default(0),
    difficulty: real("difficulty").notNull().default(0),
    reps: integer("reps").notNull().default(0),
    lapses: integer("lapses").notNull().default(0),
    successes: integer("successes").notNull().default(0),
    failures: integer("failures").notNull().default(0),
    lastReviewAt: timestamp("last_review_at", { withTimezone: true }),
    lastResponseMs: integer("last_response_ms"),
    introducedAt: timestamp("introduced_at", { withTimezone: true }).notNull(),
    introducedOn: date("introduced_on").notNull(),
  },
  (t) => [index("vocab_cards_due_idx").on(t.dueAt), index("vocab_cards_item_idx").on(t.itemId)],
);

export const vocabReviews = pgTable(
  "vocab_reviews",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    cardId: text("card_id").notNull(),
    itemId: text("item_id").notNull(),
    direction: text("direction").notNull(),
    format: text("format").notNull(), // recognize | produce | cloze | context
    kind: text("kind").notNull(), // review | learn | practice
    rating: integer("rating"),
    correct: boolean("correct").notNull(),
    answer: text("answer"),
    expected: text("expected"),
    errorType: text("error_type"),
    responseMs: integer("response_ms"),
    lang: text("lang").notNull(),
    stateBefore: integer("state_before"),
    stabilityBefore: real("stability_before"),
    scheduledDays: real("scheduled_days"),
    sessionId: uuid("session_id"),
    localDate: date("local_date").notNull(),
    reviewedAt: timestamp("reviewed_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [index("vocab_reviews_item_idx").on(t.itemId), index("vocab_reviews_date_idx").on(t.localDate)],
);

// ---------------------------------------------------------------------------
// Learner model
// ---------------------------------------------------------------------------

export const conceptProgress = pgTable("concept_progress", {
  conceptId: text("concept_id")
    .primaryKey()
    .references(() => concepts.id, { onDelete: "cascade" }),
  status: text("status").notNull(), // introduced | practicing | mastered
  mastery: real("mastery").notNull().default(0),
  attempts: integer("attempts").notNull().default(0),
  correct: integer("correct").notNull().default(0),
  sessionsPracticed: integer("sessions_practiced").notNull().default(0),
  focusDays: integer("focus_days").notNull().default(0),
  introducedAt: timestamp("introduced_at", { withTimezone: true }).notNull(),
  introducedOn: date("introduced_on").notNull(),
  lastPracticedAt: timestamp("last_practiced_at", { withTimezone: true }),
  lastPracticedOn: date("last_practiced_on"),
  masteredAt: timestamp("mastered_at", { withTimezone: true }),
  fsrs: jsonb("fsrs").$type<StoredCard>(),
  dueAt: timestamp("due_at", { withTimezone: true }),
  updatedAt: updatedAt(),
});

export const attempts = pgTable(
  "attempts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    sessionId: uuid("session_id"),
    examId: uuid("exam_id"),
    module: text("module").notNull(), // conjugation | grammar | exam | practice
    conceptId: text("concept_id"),
    exerciseId: text("exercise_id"),
    type: text("type").notNull(),
    prompt: jsonb("prompt").notNull(),
    answer: text("answer").notNull(),
    expected: text("expected"),
    correct: boolean("correct").notNull(),
    score: real("score").notNull(),
    errorCategory: text("error_category"),
    gradedBy: text("graded_by").notNull(), // deterministic | ai | learner
    feedback: jsonb("feedback"),
    verb: text("verb"),
    tense: text("tense"),
    person: integer("person"),
    responseMs: integer("response_ms"),
    localDate: date("local_date").notNull(),
    createdAt: createdAt(),
  },
  (t) => [
    index("attempts_concept_idx").on(t.conceptId),
    index("attempts_date_idx").on(t.localDate),
    index("attempts_verb_idx").on(t.verb),
  ],
);

export const weaknesses = pgTable("weaknesses", {
  key: text("key").primaryKey(), // concept:<id> | verb:<inf> | tense:<id> | error:<category> | vocab:<id>
  kind: text("kind").notNull(),
  weight: real("weight").notNull(),
  occurrences: integer("occurrences").notNull(),
  lastSeenAt: timestamp("last_seen_at", { withTimezone: true }).notNull(),
  updatedAt: updatedAt(),
});

// ---------------------------------------------------------------------------
// Sessions
// ---------------------------------------------------------------------------

export const studySessions = pgTable("study_sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  localDate: date("local_date").notNull().unique(),
  status: text("status").notNull(), // planned | in_progress | completed
  currentModule: integer("current_module").notNull().default(0),
  modules: jsonb("modules").notNull(),
  plan: jsonb("plan").notNull(),
  startedAt: timestamp("started_at", { withTimezone: true }),
  completedAt: timestamp("completed_at", { withTimezone: true }),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
});

export const sessionItems = pgTable(
  "session_items",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    sessionId: uuid("session_id")
      .notNull()
      .references(() => studySessions.id, { onDelete: "cascade" }),
    module: text("module").notNull(),
    segment: text("segment").notNull(),
    seq: integer("seq").notNull(),
    kind: text("kind").notNull(),
    ref: text("ref"),
    payload: jsonb("payload").notNull(),
    key: jsonb("key"),
    status: text("status").notNull().default("pending"),
    result: jsonb("result"),
    servedAt: timestamp("served_at", { withTimezone: true }).defaultNow().notNull(),
    answeredAt: timestamp("answered_at", { withTimezone: true }),
  },
  (t) => [
    index("session_items_session_idx").on(t.sessionId, t.module, t.seq),
    // At most one unanswered item per session, even under concurrent requests.
    uniqueIndex("session_items_one_pending_idx").on(t.sessionId).where(sql`status = 'pending'`),
  ],
);

// ---------------------------------------------------------------------------
// Exams
// ---------------------------------------------------------------------------

export const exams = pgTable("exams", {
  id: uuid("id").primaryKey().defaultRandom(),
  weekOf: date("week_of").notNull().unique(),
  number: integer("number").notNull(),
  kind: text("kind").notNull(), // weekly | monthly
  lang: text("lang").notNull(),
  status: text("status").notNull(), // generating | ready | in_progress | submitted | graded | failed
  content: jsonb("content"),
  key: jsonb("key"),
  responses: jsonb("responses").notNull().default({}),
  playback: jsonb("playback").notNull().default({}),
  scope: jsonb("scope"),
  elapsedMs: integer("elapsed_ms").notNull().default(0),
  startedAt: timestamp("started_at", { withTimezone: true }),
  submittedAt: timestamp("submitted_at", { withTimezone: true }),
  gradedAt: timestamp("graded_at", { withTimezone: true }),
  score: real("score"),
  sectionScores: jsonb("section_scores"),
  grading: jsonb("grading"),
  error: text("error"),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
});
