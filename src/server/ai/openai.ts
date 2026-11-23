import "server-only";
import { z } from "zod";
import { AIUnavailableError, type ProviderCall, type ProviderResult } from "./provider";

const ENDPOINT = "https://api.openai.com/v1/chat/completions";

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

/** OpenAI Chat Completions with a JSON schema response format, validated with the same Zod schema. */
export async function callOpenAI<T>(model: string, call: ProviderCall<T>): Promise<ProviderResult<T>> {
  const jsonSchema = z.toJSONSchema(call.schema as z.ZodType, { target: "draft-7" }) as Record<string, unknown>;
  delete jsonSchema.$schema;
  const body = {
    model,
    messages: [
      { role: "system", content: call.system },
      { role: "user", content: call.prompt },
    ],
    response_format: {
      type: "json_schema",
      json_schema: { name: call.task.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 60), schema: jsonSchema, strict: false },
    },
    max_completion_tokens: call.maxTokens,
  };

  let lastError = "";
  for (let attempt = 0; attempt < 3; attempt++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 110_000);
    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "content-type": "application/json", authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
        body: JSON.stringify(body),
        signal: controller.signal,
      });
      if (res.status === 401) throw new AIUnavailableError("not_configured", "Invalid OpenAI API key");
      if (res.status === 429 || res.status >= 500) {
        lastError = `OpenAI HTTP ${res.status}`;
        await sleep(1000 * 2 ** attempt);
        continue;
      }
      if (!res.ok) throw new Error(`OpenAI HTTP ${res.status}: ${(await res.text()).slice(0, 300)}`);
      const json = (await res.json()) as {
        choices?: Array<{ message?: { content?: string; refusal?: string | null }; finish_reason?: string }>;
        usage?: { prompt_tokens?: number; completion_tokens?: number };
      };
      const choice = json.choices?.[0];
      if (choice?.message?.refusal) throw new AIUnavailableError("refused", choice.message.refusal);
      if (choice?.finish_reason === "length") throw new Error("Output truncated at max tokens");
      const content = choice?.message?.content ?? "";
      const parsed = call.schema.safeParse(JSON.parse(content));
      if (!parsed.success) throw new Error(`Output failed schema validation: ${parsed.error.message.slice(0, 300)}`);
      return { data: parsed.data, inputTokens: json.usage?.prompt_tokens ?? 0, outputTokens: json.usage?.completion_tokens ?? 0 };
    } catch (err) {
      if (err instanceof AIUnavailableError) throw err;
      lastError = err instanceof Error ? err.message : String(err);
      if (err instanceof SyntaxError || (err instanceof Error && err.message.startsWith("Output"))) throw err;
      if (attempt < 2) await sleep(1000 * 2 ** attempt);
    } finally {
      clearTimeout(timer);
    }
  }
  throw new Error(lastError || "OpenAI request failed");
}
