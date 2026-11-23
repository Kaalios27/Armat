# Architecture

Armat is a single-learner Spanish (Castilian) study system. The learner opens the app, presses Start, and works. The system decides what is studied, schedules revision, and adapts to results. This document describes how that is built.

## Principles

1. **The database is the source of truth.** Every answer, review, session and exam is persisted. The language model never "remembers" anything; it is given the facts it needs for each task.
2. **Deterministic engine, AI content.** Scheduling, spaced repetition, prerequisites, mastery thresholds, timing, duplicate prevention and straightforward grading are plain TypeScript with tests. The model writes content (exercises, explanations, exam texts) and grades open-ended answers.
3. **Degrade, never break.** If the AI provider is unconfigured, over budget, or failing, sessions continue on curated seed content and deterministic grading. Open-ended exam sections that genuinely need a model are marked as pending rather than faked.
4. **Language-independent learning state.** Spanish items (words, verbs, concepts) have stable IDs. English and French translations are stored separately. Switching the instruction language never touches progress.

## Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | Next.js 16 (App Router), React 19, TypeScript | Server components for data pages, route handlers for the session API, one deployable unit |
| Styling | Tailwind CSS 4 with CSS variables | Token-driven design system, light and dark themes |
| Fonts | Geist Sans, Geist Mono (`geist` package, self-hosted) | Required typeface; no runtime font fetch |
| Database | PostgreSQL via Drizzle ORM | Supabase/Neon in production; PGlite (Postgres compiled to WASM) for local development and tests, so tests exercise a real Postgres engine |
| Spaced repetition | `ts-fsrs` (FSRS-7) | Current, well-established scheduler |
| AI | `@anthropic-ai/sdk` (default model `claude-opus-5-5`), OpenAI REST as an alternative provider | Structured outputs validated with Zod |
| TTS | Azure Speech or Google Cloud TTS (es-ES neural voices), browser `speechSynthesis` fallback | European Spanish dictation |
| Hosting | Vercel (connected to the GitHub repository) | GitHub Pages cannot run server code, so it cannot hold API keys |

## Source layout

```
src/
  app/                 Next.js routes (pages and API route handlers)
    (main)/            pages with the top navigation
    (focus)/           study session and exam: no navigation
    api/               JSON endpoints used by client components
  components/          UI primitives and feature components (client and server)
  lib/                 code shared by client and server
    conjugation/       deterministic Spanish conjugator, drills, error diagnosis
    i18n/              English and French interface strings
    text.ts            normalisation, accent handling, edit distance
  server/
    db/                schema, connection (Postgres or PGlite), migrations, seeding
    engine/            scheduling and learner model (FSRS, mastery, planning, weekly calendar, level)
    grading/           deterministic grading (vocabulary, grammar, dictation)
    ai/                provider abstraction, budget guard, cache, task prompts and schemas
    exam/              exam scope, generation, grading
    services/          session runner, modules, progress, settings, export
    tts/               server-side speech synthesis
  content/             curated seed curriculum (vocabulary, verbs, grammar, conjugation lessons)
scripts/               migrate, seed, backup, restore
tests/                 Vitest suites (unit and PGlite integration)
drizzle/               generated SQL migrations (committed)
```

## Data model

All tables live in one Postgres schema. Key tables:

- `profile` (single row): interface language, time zone, theme, pace, adaptive new-word target, program start date.
- `concepts`: the curriculum. Grammar concepts and conjugation units share one table (`kind`), with order, CEFR band, localized titles and objectives, prerequisites.
- `lessons`: one row per (concept, language). Seeded or AI-generated, validated, then stable.
- `exercises`: grammar exercise bank. Seeded exercises are bilingual; AI exercises are tagged with their instruction language. A content hash prevents duplicates.
- `vocab_items` + `vocab_translations` (one row per language) + `vocab_aliases`: the lexicon. `lemma_key` is a unique normalized key; aliases cover alternative spellings and gendered forms. New items are checked against keys, aliases and inflected forms before insertion.
- `vocab_cards`: one FSRS card per (item, direction): recognition (Spanish to instruction language) and production (instruction language to Spanish). Full FSRS state is kept in JSON with queryable columns (`due_at`, `state`, `stability`, `reps`, `lapses`).
- `vocab_reviews`: every flashcard answer with rating, format, response time, error type.
- `concept_progress`: per concept mastery (EWMA accuracy, attempts, focus days, status) plus an FSRS card used to schedule concept revision.
- `attempts`: every conjugation, grammar and exam item answer with the error category and grader.
- `study_sessions` + `session_items`: the daily plan, module timers, and every served item (so a refresh resumes on the same item). Answer keys are stored server-side and only revealed after answering.
- `exams`: weekly and monthly exams with content, server-only answer key, autosaved responses, playback counters, grading report.
- `weaknesses`: decaying weights per concept, verb, tense, error category and word. Fed by sessions and exams, read by the planner.
- `ai_usage`, `ai_cache`, `tts_cache`: spend tracking, response cache, synthesized audio.

## Learning engine

### Daily session (Monday to Saturday)

Three fixed modules of 20 minutes, in order: vocabulary, conjugation, grammar. Each module tracks active time server-side (client heartbeats). The timer pauses when the page is hidden or after three minutes without input, and unattended time is not counted. When a module's time is used, the current item finishes and the next module begins with a one-line transition.

Planning (`server/engine/planner.ts`) runs when the day's session is first requested:

1. Load profile, card statistics, concept progress and weaknesses.
2. Vocabulary: count due reviews, adapt today's new-word count to the review load, select new words with a weighted score (frequency, usefulness, difficulty for the instruction language, false-friend and discourse-marker bonuses, cognate penalty), pick weak words for the recall segment.
3. Conjugation: continue the current unit, or introduce the next one once mastery is demonstrated. Choose revision units (due by FSRS, weak, or least mastered).
4. Grammar: same rule for concepts; one new concept per day when the previous one is sufficiently mastered, with a cap on focus days so progress never stalls.
5. Save the plan. Background prefetch generates AI exercises for the day's focus concept when the bank is thin.

Within each module, items are chosen on demand (`next` endpoint) from the plan, elapsed time and live state:

- **Vocabulary**: due reviews first (about 5 minutes, extended when there is a backlog), then new words in batches of three (introduce, then test), then active recall: first production tests of today's words, difficult words and AI context sentences. FSRS learning steps (1 and 10 minutes) bring failed words back within the module.
- **Conjugation**: lesson or recap, focus-unit drills, mixed revision across earlier units. Drills are generated by the deterministic conjugator (direct form, sentence completion, contextual tense choice, error correction, occasional full table).
- **Grammar**: lesson or recap, focus exercises, mixed revision from due or weak concepts.

### Grading

- Vocabulary: normalized comparison against the main translation and alternatives. Spanish answers are accent-sensitive: an accent-only error is accepted as "Hard" and flagged. Recognition cards are self-graded after reveal. A mismatch can be checked by the AI or overridden by the learner.
- Conjugation: deterministic. Errors are classified as wrong person, wrong tense, incorrect ending, irregular-verb error, missing accent or incorrect stem change by comparing the answer with the verb's full paradigm and with regularized variants.
- Grammar: deterministic match against accepted answers (blank by blank); otherwise the AI classifies the answer as correct, acceptable alternative, stylistic difference, or an error with its category (grammar, conjugation, vocabulary, orthography), so valid Spanish is not marked wrong for differing from the reference.

### Mastery and progression

- Concept mastery is an exponentially weighted accuracy (recent answers count more) with a minimum attempt count. A unit is mastered at 0.85 over at least 24 attempts across two sessions, or 0.95 over 30 attempts in one session (fast track).
- Each practiced concept gets an FSRS review per session, rated from that session's accuracy; due concepts feed mixed revision.
- New-word pace adapts after every vocabulary module: retention on mature cards and tomorrow's projected review load raise or lower the target within bounds set by the pace preference.

### Weekly calendar

- Sunday is examination day once study has begun. On the very first day of the program, any day (including Sunday) starts the first session.
- Exams are numbered from the first Sunday after the start date. Every fourth exam is a monthly cumulative exam.
- An exam missed on Sunday can be taken late during the following week. It never replaces the daily session.

### Exams

Five parts, 60 minutes, 100 points: dictation (15), conjugation (20), grammar (20), translation (15), writing (30).

Scope (`server/exam/scope.ts`) is computed from the database: concepts and words introduced in the previous six study days, failed items, weaknesses, and older material ranked by staleness. Monthly exams weight the last four weeks at 40%, older material at 40% and recurring weaknesses at 20%.

Generation: conjugation items come from the deterministic engine. Dictation text, grammar items, translation sentences and the writing prompt come from the AI with validation. Without AI, curated fallbacks are used and the exam records that.

Taking the exam: answers autosave to the server (and to local storage as a second copy). No feedback or answers are sent to the client before submission. Time counts while the exam page is open. When time is up, the exam is submitted automatically.

Grading: dictation by word alignment (spelling, accents, missing and extra words, punctuation); conjugation deterministically; grammar deterministically, then AI for non-matching answers; translation and writing by the AI against a published rubric. Results update concept mastery, weaknesses and vocabulary schedules, so the next week's sessions respond to the exam.

## AI integration

- `server/ai/provider.ts` defines one interface: `generate({ task, system, prompt, schema, effort })`, returning validated, typed data.
- Anthropic: `client.beta.messages.parse` with `betaZodOutputFormat` (structured outputs), adaptive thinking, explicit `effort` per task, and server-side refusal fallback (`fallbacks: "default"`).
- OpenAI: Chat Completions with a JSON schema response format, validated with the same Zod schema.
- Every call passes the budget guard first (daily and monthly USD caps, calls per minute), is logged in `ai_usage`, and is retried once with the validation errors when the output fails semantic checks.
- Generated content is validated beyond the schema: blanks match answers, options contain the answer, conjugation contexts are re-checked with the conjugator, new words are deduplicated, lessons are reviewed by a second pass.
- Results that should be stable (lessons) are cached; exercise banks are persisted and reused.

## Security

- API keys exist only in server environment variables and are read only by server modules (`server-only` guard).
- A password (`APP_PASSWORD`) protects every page and API route through `src/proxy.ts`; sessions are HMAC-signed, HTTP-only cookies. Without a password the app refuses to serve in production.
- Login attempts are rate limited. AI spend is capped.
- Secrets are excluded by `.gitignore`; `.env.example` documents the variables.

## Persistence and operations

- Migrations are generated by drizzle-kit and committed in `drizzle/`. They run at build time on Vercel (`vercel-build`), via `npm run db:migrate`, and lazily on first access.
- The seed is idempotent and versioned; content updates in new releases are applied automatically without touching learner data.
- `Settings > Export` downloads all learner data as JSON. `npm run db:backup` writes the same export to `backups/`. Supabase also keeps daily backups.
