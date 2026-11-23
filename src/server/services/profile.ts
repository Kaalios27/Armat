import { eq } from "drizzle-orm";
import { isLang, type Lang } from "@/lib/i18n/types";
import { database } from "../db/client";
import { profile } from "../db/schema";
import { isValidTimeZone } from "../engine/clock";
import { PACE, type Pace } from "../engine/progression";

export const DEFAULT_TIME_ZONE = "Europe/Madrid";

export interface Profile {
  uiLang: Lang;
  /** Effective IANA time zone. */
  timezone: string;
  /** Stored setting: an IANA zone or "auto". */
  timezoneSetting: string;
  theme: "system" | "light" | "dark";
  pace: Pace;
  newWordsTarget: number;
  dictationVoice: "auto" | "browser" | "server";
  startedOn: string | null;
}

export async function getProfile(tzHint?: string | null): Promise<Profile> {
  const db = await database();
  let row = (await db.select().from(profile).where(eq(profile.id, 1)))[0];
  if (!row) {
    await db.insert(profile).values({ id: 1 }).onConflictDoNothing();
    row = (await db.select().from(profile).where(eq(profile.id, 1)))[0]!;
  }
  const tz =
    row.timezone !== "auto" && isValidTimeZone(row.timezone)
      ? row.timezone
      : isValidTimeZone(tzHint)
        ? tzHint
        : DEFAULT_TIME_ZONE;
  return {
    uiLang: isLang(row.uiLang) ? row.uiLang : "en",
    timezone: tz,
    timezoneSetting: row.timezone,
    theme: (["system", "light", "dark"].includes(row.theme) ? row.theme : "system") as Profile["theme"],
    pace: (["steady", "standard", "intensive"].includes(row.pace) ? row.pace : "standard") as Pace,
    newWordsTarget: row.newWordsTarget,
    dictationVoice: (["auto", "browser", "server"].includes(row.dictationVoice) ? row.dictationVoice : "auto") as Profile["dictationVoice"],
    startedOn: row.startedOn ?? null,
  };
}

export interface ProfilePatch {
  uiLang?: Lang;
  timezone?: string;
  theme?: Profile["theme"];
  pace?: Pace;
  dictationVoice?: Profile["dictationVoice"];
}

export async function updateProfile(patch: ProfilePatch): Promise<void> {
  const db = await database();
  const set: Partial<typeof profile.$inferInsert> = { updatedAt: new Date() };
  if (patch.uiLang && isLang(patch.uiLang)) set.uiLang = patch.uiLang;
  if (patch.timezone && (patch.timezone === "auto" || isValidTimeZone(patch.timezone))) set.timezone = patch.timezone;
  if (patch.theme && ["system", "light", "dark"].includes(patch.theme)) set.theme = patch.theme;
  if (patch.pace && ["steady", "standard", "intensive"].includes(patch.pace)) {
    set.pace = patch.pace;
    set.newWordsTarget = PACE[patch.pace].base;
  }
  if (patch.dictationVoice && ["auto", "browser", "server"].includes(patch.dictationVoice)) set.dictationVoice = patch.dictationVoice;
  await db.update(profile).set(set).where(eq(profile.id, 1));
}

export async function setNewWordsTarget(target: number): Promise<void> {
  const db = await database();
  await db.update(profile).set({ newWordsTarget: target, updatedAt: new Date() }).where(eq(profile.id, 1));
}

export async function markStarted(date: string): Promise<void> {
  const db = await database();
  const row = (await db.select().from(profile).where(eq(profile.id, 1)))[0];
  if (row && !row.startedOn) await db.update(profile).set({ startedOn: date, updatedAt: new Date() }).where(eq(profile.id, 1));
}
