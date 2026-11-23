import { after } from "next/server";
import { handler, readJson, tzHint } from "@/server/http";
import { getSession, nextItem, sessionBackgroundWork } from "@/server/services/session";
import { MODULES, type ModuleKey } from "@/server/services/session-types";

export const maxDuration = 60;

export const POST = handler<{ id: string }>(async (req, { id }) => {
  const body = await readJson<{ module?: string; elapsedMs?: number }>(req);
  const module = (MODULES.includes(body.module as ModuleKey) ? body.module : "vocab") as ModuleKey;
  const tz = await tzHint();
  const res = await nextItem(id, module, body.elapsedMs, tz);
  if (res.type === "item" && res.item.kind === "vocab-intro" && res.item.seq === 1) {
    // First item of the day: top up the grammar exercise bank in the background.
    const session = await getSession(id);
    if (session) after(() => sessionBackgroundWork(session, tz));
  }
  return res;
});
