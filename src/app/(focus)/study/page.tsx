"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { CONJUGATION_UNITS, GRAMMAR_CONCEPTS } from "@/content";
import { PageError, useLoad } from "@/components/data";
import { StudyRunner } from "@/components/study/runner";
import { api } from "@/core/api";
import { moduleDurationMs, type ModuleState } from "@/core/services/session-types";
import type { Localized } from "@/lib/i18n/types";

const TITLES: Record<string, Localized> = Object.fromEntries([
  ...CONJUGATION_UNITS.map((u) => [u.id, u.title] as const),
  ...GRAMMAR_CONCEPTS.map((c) => [c.id, c.title] as const),
]);

export default function StudyPage() {
  const router = useRouter();
  const { data: session, error, reload } = useLoad(() => api.session.today(), []);
  // No session on exam days: back to the overview.
  useEffect(() => {
    if (session === null) router.replace("/");
  }, [session, router]);
  if (error) {
    return (
      <div className="mx-auto max-w-[680px] px-4 pt-10">
        <PageError onRetry={reload} />
      </div>
    );
  }
  if (!session) return null;
  const modules = session.modules as ModuleState[];
  return (
    <StudyRunner
      key={session.id}
      sessionId={session.id}
      initialModule={session.status === "completed" ? 3 : session.currentModule}
      initialElapsed={modules.map((m) => m.elapsedMs)}
      moduleMs={moduleDurationMs()}
      titles={TITLES}
    />
  );
}
