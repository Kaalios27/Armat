import type { Lang } from "@/lib/i18n/types";
import type { DB } from "../db/client";
import type { sessionItems, studySessions } from "../db/schema";
import type { SessionPlan } from "../engine/planner";

export const MODULES = ["vocab", "conjugation", "grammar"] as const;
export type ModuleKey = (typeof MODULES)[number];

export interface ModuleState {
  key: ModuleKey;
  elapsedMs: number;
  startedAt: string | null;
  completedAt: string | null;
}

export type SessionRow = typeof studySessions.$inferSelect;
export type ItemRow = typeof sessionItems.$inferSelect;

export interface ModuleContext {
  db: DB;
  session: SessionRow;
  plan: SessionPlan;
  module: ModuleKey;
  elapsedMs: number;
  moduleMs: number;
  now: Date;
  lang: Lang;
  tz: string;
  today: string;
}

/** A new item produced by a module, before it is stored. */
export interface NewItem {
  segment: string;
  kind: string;
  ref: string | null;
  payload: Record<string, unknown>;
  key: Record<string, unknown> | null;
}

export interface AnswerBody {
  answer?: string | string[];
  rating?: number;
  action?: "seen" | "continue";
  override?: boolean;
  responseMs?: number;
}

export interface PublicItem {
  id: string;
  module: ModuleKey;
  segment: string;
  kind: string;
  seq: number;
  payload: Record<string, unknown>;
  status: string;
  result: Record<string, unknown> | null;
}

/** 20 minutes; shorter modules can be set for development and tests only. */
export function moduleDurationMs(): number {
  const m = Number(process.env.NEXT_PUBLIC_ARMAT_MODULE_MINUTES ?? process.env.ARMAT_MODULE_MINUTES);
  return (process.env.NODE_ENV !== "production" && m > 0 ? m : 20) * 60_000;
}
