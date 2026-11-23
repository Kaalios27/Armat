import { handler, readJson } from "@/server/http";
import { heartbeat } from "@/server/services/session";
import { MODULES, type ModuleKey } from "@/server/services/session-types";

export const POST = handler<{ id: string }>(async (req, { id }) => {
  const body = await readJson<{ module?: string; elapsedMs?: number }>(req);
  if (MODULES.includes(body.module as ModuleKey) && typeof body.elapsedMs === "number") {
    await heartbeat(id, body.module as ModuleKey, body.elapsedMs);
  }
  return { ok: true };
});
