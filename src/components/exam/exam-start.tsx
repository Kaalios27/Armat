"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useI18n } from "../i18n";
import { Button } from "../ui/primitives";

export function ExamStartButton({
  weekOf,
  examId,
  status,
  label,
  variant = "primary",
}: {
  weekOf: string;
  examId: string | null;
  status: string;
  label: string;
  variant?: "primary" | "secondary";
}) {
  const router = useRouter();
  const { t } = useI18n();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);

  async function go() {
    setBusy(true);
    setError(false);
    try {
      let id = examId;
      if (!id || status === "failed") {
        const res = await fetch("/api/exam/ensure", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ weekOf }) });
        if (!res.ok) throw new Error();
        id = ((await res.json()) as { id: string }).id;
      }
      router.push(`/exam/${id}`);
    } catch {
      setError(true);
      setBusy(false);
    }
  }

  return (
    <div className="flex items-center gap-3">
      {error && <span className="text-[14px] text-negative">{t("common.error")}</span>}
      <Button variant={variant} size="lg" onClick={go} disabled={busy}>
        {label}
      </Button>
    </div>
  );
}
