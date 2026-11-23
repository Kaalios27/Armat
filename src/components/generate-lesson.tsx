"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useI18n } from "./i18n";
import { Button } from "./ui/primitives";

export function GenerateLessonButton({ conceptId }: { conceptId: string }) {
  const { t } = useI18n();
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);
  async function go() {
    setBusy(true);
    setError(false);
    const res = await fetch(`/api/grammar/${conceptId}/lesson`, { method: "POST" });
    setBusy(false);
    if (res.ok) router.refresh();
    else setError(true);
  }
  return (
    <div className="flex items-center gap-4">
      <Button onClick={go} disabled={busy}>
        {busy ? t("grammar.generating") : t("grammar.generateLesson")}
      </Button>
      {error && <span className="text-[14px] text-negative">{t("common.error")}</span>}
    </div>
  );
}
