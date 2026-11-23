import { aiExplain } from "@/server/ai/tasks";
import { handler, readJson, tzHint } from "@/server/http";
import { getProfile } from "@/server/services/profile";
import { HttpError } from "@/server/services/session";

export const maxDuration = 60;

export const POST = handler(async (req) => {
  const body = await readJson<{ context?: string }>(req);
  const context = String(body.context ?? "").slice(0, 2000);
  if (!context) throw new HttpError(400, "context is required");
  const profile = await getProfile(await tzHint());
  return { explanation: await aiExplain(context, profile.uiLang) };
});
