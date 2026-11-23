import { handler, readJson, tzHint } from "@/server/http";
import { answerItem, HttpError } from "@/server/services/session";
import type { AnswerBody } from "@/server/services/session-types";

export const maxDuration = 60;

export const POST = handler<{ id: string }>(async (req, { id }) => {
  const body = await readJson<{ itemId?: string; elapsedMs?: number } & AnswerBody>(req);
  if (!body.itemId) throw new HttpError(400, "itemId is required");
  const { itemId, elapsedMs, ...answer } = body;
  return answerItem(id, itemId, answer, elapsedMs, await tzHint());
});
