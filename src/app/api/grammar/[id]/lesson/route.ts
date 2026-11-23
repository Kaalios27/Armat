import { database } from "@/server/db/client";
import { handler, tzHint } from "@/server/http";
import { ensureLesson } from "@/server/services/grammar-module";
import { getProfile } from "@/server/services/profile";
import { HttpError } from "@/server/services/session";

export const maxDuration = 120;

export const POST = handler<{ id: string }>(async (_req, { id }) => {
  const profile = await getProfile(await tzHint());
  const lesson = await ensureLesson(await database(), id, profile.uiLang);
  if (!lesson) throw new HttpError(503, "The lesson could not be generated");
  return { ok: true };
});
