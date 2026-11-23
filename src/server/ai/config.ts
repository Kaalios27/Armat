/**
 * AI configuration. AI features are off unless AI_PROVIDER is set explicitly
 * and the matching key exists, so an API key that happens to be present in the
 * environment is never used by accident.
 */

export type ProviderName = "anthropic" | "openai";

export const DEFAULT_ANTHROPIC_MODEL = "claude-opus-5-5";

/** USD per million tokens (input, output), first-party API rates. */
const ANTHROPIC_PRICES: Record<string, [number, number]> = {
  "claude-opus-5-5": [4, 20],
  "claude-opus-5": [5, 25],
  "claude-sonnet-5-5": [2, 10],
  "claude-sonnet-5": [2, 10],
  "claude-haiku-5-5": [0.1, 0.5],
  "claude-fable-5-2": [8, 40],
};

export interface AiConfig {
  provider: ProviderName | null;
  model: string | null;
  dailyBudgetUsd: number;
  monthlyBudgetUsd: number;
  maxCallsPerMinute: number;
  configured: { anthropic: boolean; openai: boolean };
}

function num(v: string | undefined, fallback: number): number {
  const n = v ? Number(v) : NaN;
  return Number.isFinite(n) && n >= 0 ? n : fallback;
}

export function aiConfig(): AiConfig {
  const requested = (process.env.AI_PROVIDER ?? "").trim().toLowerCase();
  const configured = { anthropic: !!process.env.ANTHROPIC_API_KEY, openai: !!process.env.OPENAI_API_KEY };
  let provider: ProviderName | null = null;
  if (requested === "anthropic" && configured.anthropic) provider = "anthropic";
  if (requested === "openai" && configured.openai) provider = "openai";
  const model =
    provider === "anthropic"
      ? process.env.ANTHROPIC_MODEL?.trim() || DEFAULT_ANTHROPIC_MODEL
      : provider === "openai"
        ? process.env.OPENAI_MODEL?.trim() || "gpt-5"
        : null;
  return {
    provider,
    model,
    dailyBudgetUsd: num(process.env.AI_DAILY_BUDGET_USD, 1.5),
    monthlyBudgetUsd: num(process.env.AI_MONTHLY_BUDGET_USD, 20),
    maxCallsPerMinute: num(process.env.AI_MAX_CALLS_PER_MINUTE, 12),
    configured,
  };
}

export function aiAvailable(): boolean {
  return aiConfig().provider !== null;
}

export function estimateCost(provider: ProviderName, model: string, input: number, output: number): number {
  let price: [number, number];
  if (provider === "anthropic") price = ANTHROPIC_PRICES[model] ?? [4, 20];
  else price = [num(process.env.OPENAI_PRICE_INPUT_PER_MTOK, 0), num(process.env.OPENAI_PRICE_OUTPUT_PER_MTOK, 0)];
  return (input * price[0] + output * price[1]) / 1_000_000;
}
