"use client";

import { useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import { useI18n } from "./i18n";
import { Button, cn } from "./ui/primitives";

function Segmented<T extends string>({ value, options, onChange, label }: { value: T; options: Array<{ value: T; label: string }>; onChange: (v: T) => void; label: string }) {
  return (
    <div role="radiogroup" aria-label={label} className="inline-flex rounded-lg bg-subtle p-1">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role="radio"
          aria-checked={value === o.value}
          onClick={() => onChange(o.value)}
          className={cn(
            "h-9 rounded-md px-3.5 text-[14px] transition-colors",
            value === o.value ? "bg-surface font-medium text-ink shadow-[0_0_0_1px_var(--line)]" : "text-ink-2 hover:text-ink",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function Row({ title, note, children }: { title: string; note?: ReactNode; children: ReactNode }) {
  return (
    <div className="grid gap-3 border-t border-line py-5 sm:grid-cols-[220px_1fr]">
      <div>
        <div className="text-[15px] font-medium">{title}</div>
        {note && <div className="mt-1 text-[13px] leading-relaxed text-ink-3">{note}</div>}
      </div>
      <div className="flex flex-col items-start gap-2">{children}</div>
    </div>
  );
}

export interface SettingsProps {
  uiLang: "en" | "fr";
  theme: "system" | "light" | "dark";
  timezoneSetting: string;
  timezone: string;
  pace: "steady" | "standard" | "intensive";
  newWordsTarget: number;
  dictationVoice: "auto" | "browser" | "server";
  ttsServer: string;
  ai: { provider: string | null; model: string | null; configured: { anthropic: boolean; openai: boolean }; spendDay: number; spendMonth: number; dailyBudget: number; monthlyBudget: number; perMinute: number };
  database: "postgres" | "pglite";
  authEnabled: boolean;
}

const ZONES = ["Europe/Madrid", "Europe/Paris", "Europe/London", "Europe/Brussels", "Europe/Zurich", "Europe/Lisbon", "Atlantic/Canary", "America/New_York", "America/Montreal", "UTC"];

export function SettingsForm(p: SettingsProps) {
  const { t } = useI18n();
  const router = useRouter();
  const [state, setState] = useState(p);
  const [test, setTest] = useState<string | null>(null);
  const [testing, setTesting] = useState(false);

  async function save(patch: Partial<SettingsProps>) {
    setState((s) => ({ ...s, ...patch }));
    await fetch("/api/settings", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(patch) });
    router.refresh();
  }

  async function testConnection() {
    setTesting(true);
    setTest(null);
    try {
      const res = await fetch("/api/ai/test", { method: "POST" });
      const json = (await res.json()) as { ok?: boolean; error?: string; reason?: string };
      setTest(res.ok && json.ok ? t("settings.testOk") : t("settings.testFailed", { reason: json.reason ?? json.error ?? String(res.status) }));
    } catch (e) {
      setTest(t("settings.testFailed", { reason: String(e) }));
    } finally {
      setTesting(false);
    }
  }

  async function signOut() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.assign("/login");
  }

  const usd = (n: number) => `$${n.toFixed(2)}`;

  return (
    <div className="flex flex-col">
      <Row title={t("settings.language")} note={t("settings.languageNote")}>
        <Segmented
          label={t("settings.language")}
          value={state.uiLang}
          options={[
            { value: "en", label: "English" },
            { value: "fr", label: "Français" },
          ]}
          onChange={(v) => save({ uiLang: v })}
        />
      </Row>
      <Row title={t("settings.theme")}>
        <Segmented
          label={t("settings.theme")}
          value={state.theme}
          options={[
            { value: "system", label: t("settings.themes.system") },
            { value: "light", label: t("settings.themes.light") },
            { value: "dark", label: t("settings.themes.dark") },
          ]}
          onChange={(v) => save({ theme: v })}
        />
      </Row>
      <Row title={t("settings.timezone")}>
        <select
          value={state.timezoneSetting}
          onChange={(e) => save({ timezoneSetting: e.target.value, ...({ timezone: e.target.value } as Partial<SettingsProps>) })}
          className="h-11 rounded-lg border border-line-strong bg-surface px-3 text-[15px] outline-none focus:border-accent"
        >
          <option value="auto">{t("settings.timezoneAuto", { tz: p.timezone })}</option>
          {ZONES.map((z) => (
            <option key={z} value={z}>
              {z}
            </option>
          ))}
        </select>
      </Row>
      <Row title={t("settings.pace")} note={t("settings.paceNote", { n: state.newWordsTarget })}>
        <Segmented
          label={t("settings.pace")}
          value={state.pace}
          options={[
            { value: "steady", label: t("settings.paces.steady") },
            { value: "standard", label: t("settings.paces.standard") },
            { value: "intensive", label: t("settings.paces.intensive") },
          ]}
          onChange={(v) => save({ pace: v })}
        />
      </Row>
      <Row title={t("settings.voice")} note={t("settings.voiceStatus", { status: p.ttsServer === "browser" ? t("settings.notConfigured") : p.ttsServer })}>
        <Segmented
          label={t("settings.voice")}
          value={state.dictationVoice}
          options={[
            { value: "auto", label: t("settings.voices.auto") },
            { value: "browser", label: t("settings.voices.browser") },
            { value: "server", label: t("settings.voices.server") },
          ]}
          onChange={(v) => save({ dictationVoice: v })}
        />
      </Row>
      <Row title={t("settings.ai")}>
        <dl className="grid w-full max-w-[460px] grid-cols-[1fr_auto] gap-x-6 gap-y-1.5 text-[14px]">
          <dt className="text-ink-2">{t("settings.provider")}</dt>
          <dd>{p.ai.provider ? `${p.ai.provider === "anthropic" ? "Anthropic" : "OpenAI"}` : t("settings.notConfigured")}</dd>
          <dt className="text-ink-2">{t("settings.model")}</dt>
          <dd className="font-mono text-[13px]">{p.ai.model ?? "–"}</dd>
          <dt className="text-ink-2">{t("settings.spendToday")}</dt>
          <dd className="tabular">
            {usd(p.ai.spendDay)} / {usd(p.ai.dailyBudget)}
          </dd>
          <dt className="text-ink-2">{t("settings.spendMonth")}</dt>
          <dd className="tabular">
            {usd(p.ai.spendMonth)} / {usd(p.ai.monthlyBudget)}
          </dd>
          <dt className="text-ink-2">{t("settings.limits")}</dt>
          <dd className="tabular">{p.ai.perMinute} / min</dd>
        </dl>
        {p.ai.provider && (
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <Button variant="secondary" size="sm" onClick={testConnection} disabled={testing}>
              {t("settings.testConnection")}
            </Button>
            {test && <span className="text-[14px] text-ink-2">{test}</span>}
          </div>
        )}
      </Row>
      <Row title={t("settings.data")}>
        <a href="/api/export" className="text-[15px] text-accent hover:underline">
          {t("settings.export")}
        </a>
      </Row>
      <Row title={t("settings.storage")}>
        <span className="text-[15px] text-ink-2">{p.database === "postgres" ? t("settings.databasePostgres") : t("settings.databaseLocal")}</span>
      </Row>
      <Row title={t("settings.account")}>
        {p.authEnabled ? (
          <Button variant="secondary" size="sm" onClick={signOut}>
            {t("common.signOut")}
          </Button>
        ) : (
          <span className="text-[14px] text-ink-3">{t("settings.accessOpen")}</span>
        )}
      </Row>
    </div>
  );
}
