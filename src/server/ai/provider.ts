import "server-only";
import { createHash } from "node:crypto";
import { and, eq, gte, sql } from "drizzle-orm";
import type { z } from "zod";
import { database, type DB } from "../db/client";
import { aiCache, aiUsage } from "../db/schema";
import { aiConfig, estimateCost, type AiConfig, type ProviderName } from "./config";

export type Effort = "low" | "medium" | "high";

export interface GenerateRequest<T> {
  /** Short task identifier, used for logging and caching. */
  task: string;
  system: string;
  prompt: string;
  schema: z.ZodType<T>;
  effort?: Effort;
  maxTokens?: number;
  /** Cache the validated result under this key (stable content such as lessons). */
  cacheKey?: string | null;
  /** Semantic checks beyond the schema; returns human-readable problems. */
  validate?: (data: T) => string[];
}

export interface ProviderCall<T> {
  system: string;
  prompt: string;
  schema: z.ZodType<T>;
  effort: Effort;
  maxTokens: number;
  task: string;
}

export interface ProviderResult<T> {
  data: T;
  inputTokens: number;
  outputTokens: number;
}

export type ProviderFn = <T>(model: string, call: ProviderCall<T>) => Promise<ProviderResult<T>>;

export type UnavailableReason = "not_configured" | "budget" | "rate_limit" | "failed" | "invalid" | "refused";

export class AIUnavailableError extends Error {
  constructor(
    public reason: UnavailableReason,
    message?: string,
  ) {
    super(message ?? `AI unavailable: ${reason}`);
    this.name = "AIUnavailableError";
  }
}

let override: { provider: ProviderName; fn: ProviderFn } | null = null;

/** Tests inject a provider implementation; production code never calls this. */
export function setProviderOverride(o: { provider: ProviderName; fn: ProviderFn } | null): void {
  override = o;
}

async function providerFn(name: ProviderName): Promise<ProviderFn> {
  if (override && override.provider === name) return override.fn;
  if (name === "anthropic") return (await import("./anthropic")).callAnthropic;
  return (await import("./openai")).callOpenAI;
}

function effectiveConfig(): AiConfig {
  const cfg = aiConfig();
  if (override && !cfg.provider) return { ...cfg, provider: override.provider, model: cfg.model ?? "test-model" };
  return cfg;
}

export function aiEnabled(): boolean {
  return effectiveConfig().provider !== null;
}

export interface Spend {
  day: number;
  month: number;
  lastMinuteCalls: number;
}

export async function currentSpend(db: DB, now = new Date()): Promise<Spend> {
  const dayAgo = new Date(now.getTime() - 86_400_000);
  const monthStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
  const minuteAgo = new Date(now.getTime() - 60_000);
  const [d] = await db.select({ v: sql<number>`coalesce(sum(${aiUsage.costUsd}), 0)::float` }).from(aiUsage).where(gte(aiUsage.createdAt, dayAgo));
  const [m] = await db.select({ v: sql<number>`coalesce(sum(${aiUsage.costUsd}), 0)::float` }).from(aiUsage).where(gte(aiUsage.createdAt, monthStart));
  const [c] = await db.select({ v: sql<number>`count(*)::int` }).from(aiUsage).where(gte(aiUsage.createdAt, minuteAgo));
  return { day: d?.v ?? 0, month: m?.v ?? 0, lastMinuteCalls: c?.v ?? 0 };
}

async function checkBudget(db: DB, cfg: AiConfig): Promise<void> {
  const spend = await currentSpend(db);
  if (spend.day >= cfg.dailyBudgetUsd) throw new AIUnavailableError("budget", "Daily AI budget reached");
  if (spend.month >= cfg.monthlyBudgetUsd) throw new AIUnavailableError("budget", "Monthly AI budget reached");
  if (spend.lastMinuteCalls >= cfg.maxCallsPerMinute) throw new AIUnavailableError("rate_limit", "Too many AI calls in the last minute");
}

function hashKey(parts: string[]): string {
  return createHash("sha256").update(parts.join("\u0000")).digest("hex");
}

async function logUsage(
  db: DB,
  row: { task: string; provider: string; model: string; inputTokens: number; outputTokens: number; ok: boolean; error?: string; durationMs: number },
): Promise<void> {
  const costUsd = row.provider === "anthropic" || row.provider === "openai" ? estimateCost(row.provider, row.model, row.inputTokens, row.outputTokens) : 0;
  try {
    await db.insert(aiUsage).values({ ...row, error: row.error?.slice(0, 500) ?? null, costUsd });
  } catch {
    // Usage logging must never break a learning flow.
  }
}

export interface GenerateResult<T> {
  data: T;
  cached: boolean;
  model: string;
}

/**
 * Generate validated structured output. Throws AIUnavailableError when the
 * provider is not configured, the budget is exhausted, or no valid output
 * could be obtained; callers fall back to curated content.
 */
export async function generate<T>(req: GenerateRequest<T>): Promise<GenerateResult<T>> {
  const cfg = effectiveConfig();
  if (!cfg.provider || !cfg.model) throw new AIUnavailableError("not_configured");
  const db = await database();
  const key = req.cacheKey ? hashKey([req.task, cfg.provider, cfg.model, req.cacheKey]) : null;

  if (key) {
    const hit = await db.select().from(aiCache).where(and(eq(aiCache.key, key), eq(aiCache.task, req.task)));
    if (hit[0]) {
      const parsed = req.schema.safeParse(hit[0].value);
      if (parsed.success && !(req.validate?.(parsed.data).length)) return { data: parsed.data, cached: true, model: cfg.model };
    }
  }

  await checkBudget(db, cfg);
  const call = await providerFn(cfg.provider);
  let prompt = req.prompt;
  let problems: string[] = [];

  for (let attempt = 0; attempt < 2; attempt++) {
    const started = Date.now();
    try {
      const res = await call(cfg.model, {
        system: req.system,
        prompt,
        schema: req.schema,
        effort: req.effort ?? "medium",
        maxTokens: req.maxTokens ?? 16000,
        task: req.task,
      });
      await logUsage(db, {
        task: req.task,
        provider: cfg.provider,
        model: cfg.model,
        inputTokens: res.inputTokens,
        outputTokens: res.outputTokens,
        ok: true,
        durationMs: Date.now() - started,
      });
      problems = req.validate ? req.validate(res.data) : [];
      if (!problems.length) {
        if (key) {
          await db
            .insert(aiCache)
            .values({ key, task: req.task, value: res.data as unknown as object })
            .onConflictDoUpdate({ target: aiCache.key, set: { value: res.data as unknown as object, createdAt: new Date() } });
        }
        return { data: res.data, cached: false, model: cfg.model };
      }
      prompt = `${req.prompt}\n\nYour previous answer was rejected for these reasons:\n- ${problems.join("\n- ")}\nReturn a corrected answer that fixes every point.`;
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      await logUsage(db, {
        task: req.task,
        provider: cfg.provider,
        model: cfg.model,
        inputTokens: 0,
        outputTokens: 0,
        ok: false,
        error: message,
        durationMs: Date.now() - started,
      });
      if (err instanceof AIUnavailableError) throw err;
      if (attempt === 1) throw new AIUnavailableError("failed", message);
    }
  }
  throw new AIUnavailableError("invalid", problems.join("; "));
}
