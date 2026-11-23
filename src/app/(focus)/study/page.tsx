import { redirect } from "next/navigation";
import { CONJUGATION_UNITS, GRAMMAR_CONCEPTS } from "@/content";
import { StudyRunner } from "@/components/study/runner";
import type { Localized } from "@/lib/i18n/types";
import { aiEnabled } from "@/server/ai/provider";
import { tzHint } from "@/server/http";
import { ensureTodaySession, startSession } from "@/server/services/session";
import { moduleDurationMs, type ModuleState } from "@/server/services/session-types";

export const dynamic = "force-dynamic";

export default async function StudyPage() {
  const tz = await tzHint();
  const today = await ensureTodaySession(tz);
  if (!today.session) redirect("/");
  const session = today.session.status === "planned" ? await startSession(today.session.id, tz) : today.session;
  const modules = session.modules as ModuleState[];
  const titles: Record<string, Localized> = Object.fromEntries([
    ...CONJUGATION_UNITS.map((u) => [u.id, u.title] as const),
    ...GRAMMAR_CONCEPTS.map((c) => [c.id, c.title] as const),
  ]);
  return (
    <StudyRunner
      sessionId={session.id}
      initialModule={session.status === "completed" ? 3 : session.currentModule}
      initialElapsed={modules.map((m) => m.elapsedMs)}
      moduleMs={moduleDurationMs()}
      titles={titles}
      aiEnabled={aiEnabled()}
    />
  );
}
