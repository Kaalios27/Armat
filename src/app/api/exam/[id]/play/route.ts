import { handler, readJson } from "@/server/http";
import { registerPlayback } from "@/server/services/exam";

export const POST = handler<{ id: string }>(async (req, { id }) => {
  const body = await readJson<{ mode?: string; segment?: number }>(req);
  return registerPlayback(id, body.mode === "full" ? "full" : "segment", typeof body.segment === "number" ? body.segment : 0);
});
