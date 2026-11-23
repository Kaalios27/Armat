import { handler, readJson, tzHint } from "@/server/http";
import { completeModule, getSession, HttpError } from "@/server/services/session";
import { MODULES, moduleDurationMs, type ModuleKey, type ModuleState } from "@/server/services/session-types";

export const POST = handler<{ id: string }>(async (req, { id }) => {
  const body = await readJson<{ module?: string; exhausted?: boolean }>(req);
  const module = body.module as ModuleKey;
  if (!MODULES.includes(module)) throw new HttpError(400, "Unknown module");
  const session = await getSession(id);
  if (!session) throw new HttpError(404, "Session not found");
  const state = (session.modules as ModuleState[])[MODULES.indexOf(module)];
  // A module ends when its time is used, or early only when no material is left.
  if (!body.exhausted && (state?.elapsedMs ?? 0) < moduleDurationMs()) throw new HttpError(409, "Module time is not used yet");
  return completeModule(id, module, await tzHint());
});
