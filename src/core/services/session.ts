/**
 * Daily session lifecycle: planning, fixed module order, server-side module
 * timing, resumable items, and learner-model updates at the end of each module.
 */
import { and, desc, eq } from "drizzle-orm";
import { database } from "../db/client";
import { sessionItems, studySessions } from "../db/schema";
import { localDate, now as clockNow } from "../engine/clock";
import { buildPlan, type SessionPlan } from "../engine/planner";
import { dayKind, type DayKind } from "../engine/schedule";
import { answerConjugation, nextConjugation } from "./conj-module";
import { answerGrammar, conceptAccuracyToday, nextGrammar } from "./grammar-module";
import { finalizeConceptSession } from "./progress-store";
import { getProfile, markStarted, type Profile } from "./profile";
import {
  MODULES,
  moduleDurationMs,
  type AnswerBody,
  type ItemRow,
  type ModuleContext,
  type ModuleKey,
  type ModuleState,
  type NewItem,
  type PublicItem,
  type SessionRow,
} from "./session-types";
import { answerVocab, finalizeVocab, nextVocab } from "./vocab-module";

export interface TodaySession {
  today: string;
  dayKind: DayKind;
  profile: Profile;
  session: SessionRow | null;
}

function initialModules(): ModuleState[] {
  return MODULES.map((key) => ({ key, elapsedMs: 0, startedAt: null, completedAt: null }));
}

/** Today's session, planned on first request (none on examination days). */
export async function ensureTodaySession(tzHint?: string | null): Promise<TodaySession> {
  const db = await database();
  const profile = await getProfile(tzHint);
  const now = clockNow();
  const today = localDate(now, profile.timezone);
  const kind = dayKind(today, profile.startedOn);
  const existing = (await db.select().from(studySessions).where(eq(studySessions.localDate, today)))[0];
  if (existing || kind === "exam") return { today, dayKind: kind, profile, session: existing ?? null };
  const plan = await buildPlan(db, { date: today, tz: profile.timezone, lang: profile.uiLang, newWordsTarget: profile.newWordsTarget, now });
  await db.insert(studySessions).values({ localDate: today, status: "planned", modules: initialModules(), plan }).onConflictDoNothing();
  const session = (await db.select().from(studySessions).where(eq(studySessions.localDate, today)))[0]!;
  return { today, dayKind: kind, profile, session };
}

export async function getSession(id: string): Promise<SessionRow | null> {
  const db = await database();
  return (await db.select().from(studySessions).where(eq(studySessions.id, id)))[0] ?? null;
}

export async function startSession(id: string, tzHint?: string | null): Promise<SessionRow> {
  const db = await database();
  const session = await getSession(id);
  if (!session) throw new HttpError(404, "Session not found");
  const profile = await getProfile(tzHint);
  if (session.status === "planned") {
    const now = clockNow();
    const modules = (session.modules as ModuleState[]).map((m, i) => (i === 0 && !m.startedAt ? { ...m, startedAt: now.toISOString() } : m));
    await db.update(studySessions).set({ status: "in_progress", startedAt: now, modules, updatedAt: now }).where(eq(studySessions.id, id));
    await markStarted(session.localDate);
  }
  void profile;
  return (await getSession(id))!;
}

export class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

function publicItem(row: ItemRow): PublicItem {
  return {
    id: row.id,
    module: row.module as ModuleKey,
    segment: row.segment,
    kind: row.kind,
    seq: row.seq,
    payload: row.payload as Record<string, unknown>,
    status: row.status,
    result: (row.result as Record<string, unknown> | null) ?? null,
  };
}

async function context(session: SessionRow, module: ModuleKey, elapsedMs: number, tzHint?: string | null): Promise<{ ctx: ModuleContext; profile: Profile }> {
  const db = await database();
  const profile = await getProfile(tzHint);
  const now = clockNow();
  return {
    profile,
    ctx: {
      db,
      session,
      plan: session.plan as SessionPlan,
      module,
      elapsedMs,
      moduleMs: moduleDurationMs(),
      now,
      lang: profile.uiLang,
      tz: profile.timezone,
      today: localDate(now, profile.timezone),
    },
  };
}

async function saveElapsed(session: SessionRow, index: number, clientElapsed: number | undefined): Promise<{ modules: ModuleState[]; elapsed: number }> {
  const db = await database();
  const modules = (session.modules as ModuleState[]).map((m) => ({ ...m }));
  const m = modules[index]!;
  if (typeof clientElapsed === "number" && Number.isFinite(clientElapsed)) {
    m.elapsedMs = Math.max(m.elapsedMs, Math.min(Math.round(clientElapsed), moduleDurationMs() + 120_000));
  }
  if (!m.startedAt) m.startedAt = clockNow().toISOString();
  await db.update(studySessions).set({ modules, updatedAt: clockNow() }).where(eq(studySessions.id, session.id));
  return { modules, elapsed: m.elapsedMs };
}

export async function heartbeat(id: string, module: ModuleKey, elapsedMs: number): Promise<void> {
  const session = await getSession(id);
  if (!session || session.status === "completed") return;
  if (MODULES[session.currentModule] !== module) return;
  await saveElapsed(session, session.currentModule, elapsedMs);
}

async function pendingItem(sessionId: string, module: ModuleKey): Promise<ItemRow | null> {
  const db = await database();
  const rows = await db
    .select()
    .from(sessionItems)
    .where(and(eq(sessionItems.sessionId, sessionId), eq(sessionItems.module, module), eq(sessionItems.status, "pending")))
    .orderBy(desc(sessionItems.seq))
    .limit(1);
  return rows[0] ?? null;
}

async function storeItem(sessionId: string, module: ModuleKey, item: NewItem): Promise<ItemRow> {
  const db = await database();
  const last = await db
    .select({ seq: sessionItems.seq })
    .from(sessionItems)
    .where(eq(sessionItems.sessionId, sessionId))
    .orderBy(desc(sessionItems.seq))
    .limit(1);
  const [row] = await db
    .insert(sessionItems)
    .values({ sessionId, module, segment: item.segment, seq: (last[0]?.seq ?? 0) + 1, kind: item.kind, ref: item.ref, payload: item.payload, key: item.key })
    .onConflictDoNothing()
    .returning();
  // A concurrent request already created the pending item: serve that one.
  return row ?? (await pendingItem(sessionId, module))!;
}

export type NextResponse =
  | { type: "item"; item: PublicItem; module: ModuleKey; elapsedMs: number; moduleMs: number }
  | { type: "module-complete"; module: ModuleKey; nextModule: ModuleKey | null; sessionComplete: boolean }
  | { type: "exhausted"; module: ModuleKey; elapsedMs: number; moduleMs: number }
  | { type: "wrong-module"; currentModule: ModuleKey | null; elapsed: number[] };

const NEXT: Record<ModuleKey, (ctx: ModuleContext) => Promise<NewItem | null>> = {
  vocab: nextVocab,
  conjugation: nextConjugation,
  grammar: nextGrammar,
};

export async function nextItem(id: string, module: ModuleKey, clientElapsed: number | undefined, tzHint?: string | null): Promise<NextResponse> {
  let session = await getSession(id);
  if (!session) throw new HttpError(404, "Session not found");
  if (session.status === "planned") session = await startSession(id, tzHint);
  const current = session.status === "completed" ? null : (MODULES[session.currentModule] ?? null);
  // The session moved on in another tab or on another device: tell the client where to resume.
  if (current !== module) return { type: "wrong-module", currentModule: current, elapsed: (session.modules as ModuleState[]).map((m) => m.elapsedMs) };

  const { elapsed } = await saveElapsed(session, session.currentModule, clientElapsed);
  session = (await getSession(id))!;
  const pending = await pendingItem(id, module);
  if (pending) return { type: "item", item: publicItem(pending), module, elapsedMs: elapsed, moduleMs: moduleDurationMs() };
  if (elapsed >= moduleDurationMs()) return completeModule(id, module, tzHint);

  const { ctx } = await context(session, module, elapsed, tzHint);
  const created = await NEXT[module](ctx);
  if (!created) return { type: "exhausted", module, elapsedMs: elapsed, moduleMs: moduleDurationMs() };
  const row = await storeItem(id, module, created);
  return { type: "item", item: publicItem(row), module, elapsedMs: elapsed, moduleMs: moduleDurationMs() };
}

export interface AnswerResponse {
  item: PublicItem;
  result: Record<string, unknown>;
  timeUp: boolean;
}

export async function answerItem(
  id: string,
  itemId: string,
  body: AnswerBody,
  clientElapsed: number | undefined,
  tzHint?: string | null,
): Promise<AnswerResponse> {
  const db = await database();
  let session = await getSession(id);
  if (!session) throw new HttpError(404, "Session not found");
  const item = (await db.select().from(sessionItems).where(and(eq(sessionItems.id, itemId), eq(sessionItems.sessionId, id))))[0];
  if (!item) throw new HttpError(404, "Item not found");
  if (item.status === "done" && !body.override) {
    return { item: publicItem(item), result: (item.result as Record<string, unknown>) ?? {}, timeUp: false };
  }
  const moduleIndex = MODULES.indexOf(item.module as ModuleKey);
  const { elapsed } = moduleIndex === session.currentModule ? await saveElapsed(session, moduleIndex, clientElapsed) : { elapsed: 0 };
  session = (await getSession(id))!;
  const { ctx } = await context(session, item.module as ModuleKey, elapsed, tzHint);

  let result: Record<string, unknown>;
  if (item.module === "vocab") result = (await answerVocab(ctx, item, body)) as unknown as Record<string, unknown>;
  else if (item.module === "conjugation") result = (await answerConjugation(ctx, item, body)) as unknown as Record<string, unknown>;
  else result = (await answerGrammar(ctx, item, body)) as unknown as Record<string, unknown>;

  const [updated] = await db
    .update(sessionItems)
    .set({ status: "done", result, answeredAt: clockNow() })
    .where(eq(sessionItems.id, itemId))
    .returning();
  return { item: publicItem(updated!), result, timeUp: elapsed >= moduleDurationMs() };
}

/** Close a module (time used or nothing left), update the learner model, move to the next module. */
export async function completeModule(id: string, module: ModuleKey, tzHint?: string | null): Promise<NextResponse> {
  const db = await database();
  const session = await getSession(id);
  if (!session) throw new HttpError(404, "Session not found");
  const index = MODULES.indexOf(module);
  const modules = (session.modules as ModuleState[]).map((m) => ({ ...m }));
  if (index !== session.currentModule || modules[index]!.completedAt) {
    const current = session.status === "completed" ? null : (MODULES[session.currentModule] ?? null);
    return { type: "module-complete", module, nextModule: current, sessionComplete: session.status === "completed" };
  }
  const { ctx, profile } = await context(session, module, modules[index]!.elapsedMs, tzHint);
  if (module === "vocab") {
    await finalizeVocab(ctx, profile.pace, profile.newWordsTarget);
  } else {
    const plan = session.plan as SessionPlan;
    const focus = module === "grammar" ? plan.grammar.focus : plan.conjugation.focus;
    const accuracy = await conceptAccuracyToday(db, id, module);
    for (const [conceptId, acc] of accuracy) {
      await finalizeConceptSession(db, conceptId, module, acc, conceptId === focus, ctx.now);
    }
  }
  // Abandon any unanswered item of this module.
  await db
    .update(sessionItems)
    .set({ status: "skipped" })
    .where(and(eq(sessionItems.sessionId, id), eq(sessionItems.module, module), eq(sessionItems.status, "pending")));
  const now = clockNow();
  modules[index]!.completedAt = now.toISOString();
  const nextIndex = index + 1;
  if (modules[nextIndex] && !modules[nextIndex]!.startedAt) modules[nextIndex]!.startedAt = now.toISOString();
  const done = nextIndex >= MODULES.length;
  await db
    .update(studySessions)
    .set({ modules, currentModule: nextIndex, status: done ? "completed" : "in_progress", completedAt: done ? now : null, updatedAt: now })
    .where(eq(studySessions.id, id));
  return { type: "module-complete", module, nextModule: done ? null : MODULES[nextIndex]!, sessionComplete: done };
}

export async function sessionItemsFor(id: string, module: ModuleKey): Promise<PublicItem[]> {
  const db = await database();
  const rows = await db
    .select()
    .from(sessionItems)
    .where(and(eq(sessionItems.sessionId, id), eq(sessionItems.module, module)))
    .orderBy(sessionItems.seq);
  return rows.map(publicItem);
}
