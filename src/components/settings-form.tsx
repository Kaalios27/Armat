"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { api } from "@/core/api";
import type { ProfilePatch } from "@/core/services/profile";
import { useProfile } from "./app-provider";
import { useI18n } from "./i18n";
import { Button, cn } from "./ui/primitives";
import { spanishVoice, spanishVoices } from "./voices";

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
      <div className="flex min-w-0 flex-col items-start gap-2">{children}</div>
    </div>
  );
}

const ZONES = ["Europe/Madrid", "Europe/Paris", "Europe/London", "Europe/Brussels", "Europe/Zurich", "Europe/Lisbon", "Atlantic/Canary", "America/New_York", "America/Montreal", "UTC"];
const selectClass = "h-11 max-w-full rounded-lg border border-line-strong bg-surface px-3 text-[15px] outline-none focus:border-accent";

function download(name: string, text: string) {
  const url = URL.createObjectURL(new Blob([text], { type: "application/json" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
}

export function SettingsForm() {
  const { t } = useI18n();
  const { profile, refresh } = useProfile();
  const [voices, setVoices] = useState<string[]>([]);
  const [storage, setStorage] = useState<{ mb: number | null; persisted: boolean | null }>({ mb: null, persisted: null });
  const [confirm, setConfirm] = useState<null | { kind: "import"; data: unknown } | { kind: "reset" }>(null);
  const [message, setMessage] = useState<{ text: string; tone: "ok" | "error" } | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const load = () => setVoices(spanishVoices().map((v) => v.name));
    load();
    window.speechSynthesis?.addEventListener?.("voiceschanged", load);
    void (async () => {
      const estimate = await navigator.storage?.estimate?.().catch(() => null);
      const persisted = await navigator.storage?.persisted?.().catch(() => null);
      setStorage({ mb: estimate?.usage ? Math.round((estimate.usage / 1048576) * 10) / 10 : null, persisted: persisted ?? null });
    })();
    return () => window.speechSynthesis?.removeEventListener?.("voiceschanged", load);
  }, []);

  async function save(patch: ProfilePatch) {
    await api.updateProfile(patch);
    await refresh();
  }

  function testVoice() {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(t("settings.voiceSample"));
    const v = spanishVoice(profile.dictationVoice);
    if (v) u.voice = v;
    u.lang = v?.lang ?? "es-ES";
    u.rate = 0.92;
    window.speechSynthesis.speak(u);
  }

  async function exportData() {
    const data = await api.data.exportAll();
    download(`armat-${new Date().toISOString().slice(0, 10)}.json`, JSON.stringify(data));
  }

  async function chooseFile(file: File | undefined) {
    if (!file) return;
    setMessage(null);
    try {
      setConfirm({ kind: "import", data: JSON.parse(await file.text()) });
    } catch {
      setMessage({ text: t("settings.importFailed", { reason: "JSON" }), tone: "error" });
    }
    if (fileInput.current) fileInput.current.value = "";
  }

  async function confirmAction() {
    if (!confirm) return;
    try {
      if (confirm.kind === "import") {
        await api.data.importAll(confirm.data);
        setMessage({ text: t("settings.importDone"), tone: "ok" });
      } else {
        await api.data.resetProgress();
        setMessage({ text: t("settings.resetDone"), tone: "ok" });
      }
      setConfirm(null);
      await refresh();
    } catch (err) {
      setConfirm(null);
      setMessage({ text: t("settings.importFailed", { reason: err instanceof Error ? err.message : String(err) }), tone: "error" });
    }
  }

  const deviceZone = (() => {
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone;
    } catch {
      return profile.timezone;
    }
  })();

  return (
    <div className="flex flex-col">
      <Row title={t("settings.language")} note={t("settings.languageNote")}>
        <Segmented
          label={t("settings.language")}
          value={profile.uiLang}
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
          value={profile.theme}
          options={[
            { value: "system", label: t("settings.themes.system") },
            { value: "light", label: t("settings.themes.light") },
            { value: "dark", label: t("settings.themes.dark") },
          ]}
          onChange={(v) => save({ theme: v })}
        />
      </Row>
      <Row title={t("settings.timezone")}>
        <select value={profile.timezoneSetting} onChange={(e) => save({ timezone: e.target.value })} className={selectClass} aria-label={t("settings.timezone")}>
          <option value="auto">{t("settings.timezoneAuto", { tz: deviceZone })}</option>
          {ZONES.map((z) => (
            <option key={z} value={z}>
              {z}
            </option>
          ))}
        </select>
      </Row>
      <Row title={t("settings.pace")} note={t("settings.paceNote", { n: profile.newWordsTarget })}>
        <Segmented
          label={t("settings.pace")}
          value={profile.pace}
          options={[
            { value: "steady", label: t("settings.paces.steady") },
            { value: "standard", label: t("settings.paces.standard") },
            { value: "intensive", label: t("settings.paces.intensive") },
          ]}
          onChange={(v) => save({ pace: v })}
        />
      </Row>
      <Row title={t("settings.voice")} note={t("settings.voiceNote")}>
        {voices.length ? (
          <div className="flex flex-wrap items-center gap-3">
            <select value={voices.includes(profile.dictationVoice) ? profile.dictationVoice : "auto"} onChange={(e) => save({ dictationVoice: e.target.value })} className={selectClass} aria-label={t("settings.voice")}>
              <option value="auto">{t("settings.voiceAuto")}</option>
              {voices.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
            <Button variant="secondary" size="sm" onClick={testVoice}>
              {t("settings.voiceTest")}
            </Button>
          </div>
        ) : (
          <span className="text-[15px] text-caution">{t("settings.voiceNone")}</span>
        )}
      </Row>
      <Row title={t("settings.data")} note={t("settings.dataNote")}>
        {confirm ? (
          <div className="flex flex-col gap-3">
            <p className="text-[15px] text-ink">{confirm.kind === "import" ? t("settings.importConfirm") : t("settings.resetConfirm")}</p>
            <div className="flex flex-wrap gap-3">
              <Button variant="primary" size="sm" onClick={confirmAction}>
                {confirm.kind === "import" ? t("settings.replace") : t("settings.erase")}
              </Button>
              <Button variant="secondary" size="sm" onClick={() => setConfirm(null)}>
                {t("common.cancel")}
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap gap-3">
            <Button variant="secondary" size="sm" onClick={exportData}>
              {t("settings.export")}
            </Button>
            <Button variant="secondary" size="sm" onClick={() => fileInput.current?.click()}>
              {t("settings.import")}
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setConfirm({ kind: "reset" })}>
              {t("settings.reset")}
            </Button>
            <input ref={fileInput} type="file" accept="application/json,.json" className="hidden" onChange={(e) => void chooseFile(e.target.files?.[0])} />
          </div>
        )}
        {message && <p className={cn("text-[14px]", message.tone === "ok" ? "text-positive" : "text-negative")}>{message.text}</p>}
      </Row>
      <Row title={t("settings.storage")} note={t("settings.storageApple")}>
        <span className="text-[15px] text-ink-2">{t("settings.storageLocal", { mb: storage.mb ?? "–" })}</span>
        {storage.persisted !== null && <span className="text-[14px] text-ink-3">{storage.persisted ? t("settings.storagePersisted") : t("settings.storageNotPersisted")}</span>}
      </Row>
      <Row title={t("settings.content")}>
        <span className="text-[14px] leading-relaxed text-ink-3">{t("settings.contentNote")}</span>
      </Row>
    </div>
  );
}
