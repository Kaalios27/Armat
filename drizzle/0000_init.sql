CREATE TABLE "ai_cache" (
	"key" text PRIMARY KEY NOT NULL,
	"task" text NOT NULL,
	"value" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ai_usage" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"task" text NOT NULL,
	"provider" text NOT NULL,
	"model" text NOT NULL,
	"input_tokens" integer DEFAULT 0 NOT NULL,
	"output_tokens" integer DEFAULT 0 NOT NULL,
	"cost_usd" real DEFAULT 0 NOT NULL,
	"ok" boolean NOT NULL,
	"error" text,
	"duration_ms" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "attempts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"session_id" uuid,
	"exam_id" uuid,
	"module" text NOT NULL,
	"concept_id" text,
	"exercise_id" text,
	"type" text NOT NULL,
	"prompt" jsonb NOT NULL,
	"answer" text NOT NULL,
	"expected" text,
	"correct" boolean NOT NULL,
	"score" real NOT NULL,
	"error_category" text,
	"graded_by" text NOT NULL,
	"feedback" jsonb,
	"verb" text,
	"tense" text,
	"person" integer,
	"response_ms" integer,
	"local_date" date NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "concept_progress" (
	"concept_id" text PRIMARY KEY NOT NULL,
	"status" text NOT NULL,
	"mastery" real DEFAULT 0 NOT NULL,
	"attempts" integer DEFAULT 0 NOT NULL,
	"correct" integer DEFAULT 0 NOT NULL,
	"sessions_practiced" integer DEFAULT 0 NOT NULL,
	"focus_days" integer DEFAULT 0 NOT NULL,
	"introduced_at" timestamp with time zone NOT NULL,
	"introduced_on" date NOT NULL,
	"last_practiced_at" timestamp with time zone,
	"last_practiced_on" date,
	"mastered_at" timestamp with time zone,
	"fsrs" jsonb,
	"due_at" timestamp with time zone,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "concepts" (
	"id" text PRIMARY KEY NOT NULL,
	"kind" text NOT NULL,
	"chapter" text NOT NULL,
	"position" integer NOT NULL,
	"cefr" text NOT NULL,
	"title" jsonb NOT NULL,
	"objectives" jsonb NOT NULL,
	"prerequisites" text[] DEFAULT '{}'::text[] NOT NULL,
	"meta" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "exams" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"week_of" date NOT NULL,
	"number" integer NOT NULL,
	"kind" text NOT NULL,
	"lang" text NOT NULL,
	"status" text NOT NULL,
	"content" jsonb,
	"key" jsonb,
	"responses" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"playback" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"scope" jsonb,
	"elapsed_ms" integer DEFAULT 0 NOT NULL,
	"started_at" timestamp with time zone,
	"submitted_at" timestamp with time zone,
	"graded_at" timestamp with time zone,
	"score" real,
	"section_scores" jsonb,
	"grading" jsonb,
	"error" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "exams_week_of_unique" UNIQUE("week_of")
);
--> statement-breakpoint
CREATE TABLE "exercises" (
	"id" text PRIMARY KEY NOT NULL,
	"concept_id" text NOT NULL,
	"type" text NOT NULL,
	"lang" text,
	"data" jsonb NOT NULL,
	"difficulty" integer DEFAULT 2 NOT NULL,
	"source" text NOT NULL,
	"content_hash" text NOT NULL,
	"retired" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "lessons" (
	"concept_id" text NOT NULL,
	"lang" text NOT NULL,
	"content" jsonb NOT NULL,
	"source" text NOT NULL,
	"model" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "lessons_concept_id_lang_pk" PRIMARY KEY("concept_id","lang")
);
--> statement-breakpoint
CREATE TABLE "meta" (
	"key" text PRIMARY KEY NOT NULL,
	"value" jsonb NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "profile" (
	"id" integer PRIMARY KEY DEFAULT 1 NOT NULL,
	"ui_lang" text DEFAULT 'en' NOT NULL,
	"timezone" text DEFAULT 'auto' NOT NULL,
	"theme" text DEFAULT 'system' NOT NULL,
	"pace" text DEFAULT 'standard' NOT NULL,
	"new_words_target" integer DEFAULT 18 NOT NULL,
	"dictation_voice" text DEFAULT 'auto' NOT NULL,
	"started_on" date,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"session_id" uuid NOT NULL,
	"module" text NOT NULL,
	"segment" text NOT NULL,
	"seq" integer NOT NULL,
	"kind" text NOT NULL,
	"ref" text,
	"payload" jsonb NOT NULL,
	"key" jsonb,
	"status" text DEFAULT 'pending' NOT NULL,
	"result" jsonb,
	"served_at" timestamp with time zone DEFAULT now() NOT NULL,
	"answered_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "study_sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"local_date" date NOT NULL,
	"status" text NOT NULL,
	"current_module" integer DEFAULT 0 NOT NULL,
	"modules" jsonb NOT NULL,
	"plan" jsonb NOT NULL,
	"started_at" timestamp with time zone,
	"completed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "study_sessions_local_date_unique" UNIQUE("local_date")
);
--> statement-breakpoint
CREATE TABLE "tts_cache" (
	"key" text PRIMARY KEY NOT NULL,
	"mime" text NOT NULL,
	"data" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "vocab_aliases" (
	"key" text PRIMARY KEY NOT NULL,
	"item_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "vocab_cards" (
	"id" text PRIMARY KEY NOT NULL,
	"item_id" text NOT NULL,
	"direction" text NOT NULL,
	"fsrs" jsonb NOT NULL,
	"due_at" timestamp with time zone NOT NULL,
	"state" integer NOT NULL,
	"stability" real DEFAULT 0 NOT NULL,
	"difficulty" real DEFAULT 0 NOT NULL,
	"reps" integer DEFAULT 0 NOT NULL,
	"lapses" integer DEFAULT 0 NOT NULL,
	"successes" integer DEFAULT 0 NOT NULL,
	"failures" integer DEFAULT 0 NOT NULL,
	"last_review_at" timestamp with time zone,
	"last_response_ms" integer,
	"introduced_at" timestamp with time zone NOT NULL,
	"introduced_on" date NOT NULL
);
--> statement-breakpoint
CREATE TABLE "vocab_items" (
	"id" text PRIMARY KEY NOT NULL,
	"lemma" text NOT NULL,
	"lemma_key" text NOT NULL,
	"pos" text NOT NULL,
	"gender" text,
	"level" integer NOT NULL,
	"frequency" integer NOT NULL,
	"theme" text NOT NULL,
	"tags" text[] DEFAULT '{}'::text[] NOT NULL,
	"example" text,
	"source" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "vocab_reviews" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"card_id" text NOT NULL,
	"item_id" text NOT NULL,
	"direction" text NOT NULL,
	"format" text NOT NULL,
	"kind" text NOT NULL,
	"rating" integer,
	"correct" boolean NOT NULL,
	"answer" text,
	"expected" text,
	"error_type" text,
	"response_ms" integer,
	"lang" text NOT NULL,
	"state_before" integer,
	"stability_before" real,
	"scheduled_days" real,
	"session_id" uuid,
	"local_date" date NOT NULL,
	"reviewed_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "vocab_translations" (
	"item_id" text NOT NULL,
	"lang" text NOT NULL,
	"main" text NOT NULL,
	"alternatives" text[] DEFAULT '{}'::text[] NOT NULL,
	"note" text,
	"example_translation" text,
	"false_friend" boolean DEFAULT false NOT NULL,
	"cognate_score" real DEFAULT 0 NOT NULL,
	CONSTRAINT "vocab_translations_item_id_lang_pk" PRIMARY KEY("item_id","lang")
);
--> statement-breakpoint
CREATE TABLE "weaknesses" (
	"key" text PRIMARY KEY NOT NULL,
	"kind" text NOT NULL,
	"weight" real NOT NULL,
	"occurrences" integer NOT NULL,
	"last_seen_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "concept_progress" ADD CONSTRAINT "concept_progress_concept_id_concepts_id_fk" FOREIGN KEY ("concept_id") REFERENCES "public"."concepts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exercises" ADD CONSTRAINT "exercises_concept_id_concepts_id_fk" FOREIGN KEY ("concept_id") REFERENCES "public"."concepts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lessons" ADD CONSTRAINT "lessons_concept_id_concepts_id_fk" FOREIGN KEY ("concept_id") REFERENCES "public"."concepts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session_items" ADD CONSTRAINT "session_items_session_id_study_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."study_sessions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vocab_aliases" ADD CONSTRAINT "vocab_aliases_item_id_vocab_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."vocab_items"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vocab_cards" ADD CONSTRAINT "vocab_cards_item_id_vocab_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."vocab_items"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vocab_translations" ADD CONSTRAINT "vocab_translations_item_id_vocab_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."vocab_items"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "ai_usage_created_idx" ON "ai_usage" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "attempts_concept_idx" ON "attempts" USING btree ("concept_id");--> statement-breakpoint
CREATE INDEX "attempts_date_idx" ON "attempts" USING btree ("local_date");--> statement-breakpoint
CREATE INDEX "attempts_verb_idx" ON "attempts" USING btree ("verb");--> statement-breakpoint
CREATE INDEX "concepts_kind_position_idx" ON "concepts" USING btree ("kind","position");--> statement-breakpoint
CREATE UNIQUE INDEX "exercises_hash_idx" ON "exercises" USING btree ("content_hash");--> statement-breakpoint
CREATE INDEX "exercises_concept_idx" ON "exercises" USING btree ("concept_id");--> statement-breakpoint
CREATE INDEX "session_items_session_idx" ON "session_items" USING btree ("session_id","module","seq");--> statement-breakpoint
CREATE INDEX "vocab_cards_due_idx" ON "vocab_cards" USING btree ("due_at");--> statement-breakpoint
CREATE INDEX "vocab_cards_item_idx" ON "vocab_cards" USING btree ("item_id");--> statement-breakpoint
CREATE UNIQUE INDEX "vocab_items_lemma_key_idx" ON "vocab_items" USING btree ("lemma_key");--> statement-breakpoint
CREATE INDEX "vocab_items_level_idx" ON "vocab_items" USING btree ("level");--> statement-breakpoint
CREATE INDEX "vocab_reviews_item_idx" ON "vocab_reviews" USING btree ("item_id");--> statement-breakpoint
CREATE INDEX "vocab_reviews_date_idx" ON "vocab_reviews" USING btree ("local_date");