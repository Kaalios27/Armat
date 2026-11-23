import { z } from "zod";
import { generate } from "@/server/ai/provider";
import { handler } from "@/server/http";

export const maxDuration = 60;

/** Minimal call to confirm the configured provider works (user-initiated, a fraction of a cent). */
export const POST = handler(async () => {
  const res = await generate({
    task: "connection-test",
    system: "Reply with the requested JSON only.",
    prompt: 'Return {"ok": true} and the Spanish word for "notebook" in the field word.',
    schema: z.object({ ok: z.boolean(), word: z.string() }),
    effort: "low",
    maxTokens: 2000,
  });
  return { ok: res.data.ok, model: res.model, word: res.data.word };
});
