import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import { betaZodOutputFormat } from "@anthropic-ai/sdk/helpers/beta/zod";
import { AIUnavailableError, type ProviderCall, type ProviderResult } from "./provider";

let client: Anthropic | null = null;

function getClient(): Anthropic {
  // Retries (429, 5xx, connection errors) are handled by the SDK.
  client ??= new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY, maxRetries: 2, timeout: 110_000 });
  return client;
}

/**
 * Structured output via the Messages API: the response is constrained to the
 * Zod schema and parsed by the SDK. Server-side fallback ("default") lets the
 * API retry a policy decline on a fallback model within the same call.
 */
export async function callAnthropic<T>(model: string, call: ProviderCall<T>): Promise<ProviderResult<T>> {
  try {
    const response = await getClient().beta.messages.parse({
      model,
      max_tokens: call.maxTokens,
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      thinking: { type: "adaptive" },
      output_config: { effort: call.effort, format: betaZodOutputFormat(call.schema as never) },
      system: call.system,
      messages: [{ role: "user", content: call.prompt }],
    });
    if (response.stop_reason === "refusal") throw new AIUnavailableError("refused", "The model declined this request");
    if (response.stop_reason === "max_tokens") throw new Error("Output truncated at max_tokens");
    const data = response.parsed_output as T | null;
    if (data === null || data === undefined) throw new Error("Structured output could not be parsed");
    const parsed = call.schema.safeParse(data);
    if (!parsed.success) throw new Error(`Output failed schema validation: ${parsed.error.message.slice(0, 300)}`);
    return { data: parsed.data, inputTokens: response.usage.input_tokens, outputTokens: response.usage.output_tokens };
  } catch (err) {
    if (err instanceof AIUnavailableError) throw err;
    if (err instanceof Anthropic.AuthenticationError) throw new AIUnavailableError("not_configured", "Invalid Anthropic API key");
    if (err instanceof Anthropic.RateLimitError) throw new AIUnavailableError("rate_limit", "Anthropic rate limit reached");
    if (err instanceof Anthropic.BadRequestError) throw new Error(`Anthropic rejected the request: ${err.message}`);
    if (err instanceof Anthropic.APIError) throw new Error(`Anthropic API error ${err.status ?? ""}: ${err.message}`);
    throw err;
  }
}
