import { handler, readJson } from "@/server/http";
import { updateProfile, type ProfilePatch } from "@/server/services/profile";

export const POST = handler(async (req) => {
  const body = await readJson<ProfilePatch>(req);
  await updateProfile(body);
  return { ok: true };
});
