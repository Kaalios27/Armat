"use client";

import { useState } from "react";
import { useI18n } from "@/components/i18n";
import { Button, TextInput } from "@/components/ui/primitives";

export function LoginForm({ next, misconfigured }: { next: string; misconfigured: boolean }) {
  const { t } = useI18n();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(misconfigured ? t("login.misconfigured") : null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (busy || misconfigured) return;
    setBusy(true);
    setError(null);
    const res = await fetch("/api/auth/login", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ password }) });
    if (res.ok) {
      window.location.assign(next);
      return;
    }
    setBusy(false);
    setError(res.status === 429 ? t("login.tooMany") : res.status === 503 ? t("login.misconfigured") : t("login.wrong"));
  }

  return (
    <form onSubmit={submit} className="enter flex flex-col gap-4">
      <h1 className="mb-2 text-[28px] font-semibold tracking-[-0.02em]">{t("login.title")}</h1>
      <label className="flex flex-col gap-2">
        <span className="text-[14px] text-ink-2">{t("login.password")}</span>
        <TextInput type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoFocus disabled={misconfigured} />
      </label>
      {error && <p className="text-[14px] text-negative">{error}</p>}
      <Button type="submit" size="lg" disabled={busy || misconfigured || !password}>
        {t("login.signIn")}
      </Button>
    </form>
  );
}
