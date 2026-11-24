"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { api } from "@/core/api";
import { database } from "@/core/db/client";
import type { Profile } from "@/core/services/profile";
import { translator } from "@/lib/i18n/messages";
import { isLang, type Lang } from "@/lib/i18n/types";
import { I18nProvider } from "./i18n";
import { Button } from "./ui/primitives";

type Status = { kind: "starting" } | { kind: "ready" } | { kind: "other-tab" } | { kind: "error"; message: string };

const ProfileContext = createContext<{ profile: Profile; refresh: () => Promise<void> } | null>(null);

export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error("useProfile outside AppProvider");
  return ctx;
}

const LOCK = "armat-database";
const win = globalThis as { __armatLock?: Promise<"granted" | "busy"> };

/**
 * One tab at a time: two tabs writing the same IndexedDB database would overwrite each other.
 * The lock is held until the tab closes; it lives on globalThis so module reloads keep it.
 */
function acquireLock(): Promise<"granted" | "busy"> {
  if (typeof navigator === "undefined" || !("locks" in navigator)) return Promise.resolve("granted");
  win.__armatLock ??= new Promise((resolve) => {
    void navigator.locks.request(LOCK, { ifAvailable: true }, (lock) => {
      if (!lock) {
        resolve("busy");
        return;
      }
      resolve("granted");
      return new Promise<void>(() => {});
    });
  });
  return win.__armatLock;
}

/** Theme and language are mirrored in localStorage so the first paint already uses them. */
function applyPreferences(p: Profile) {
  const root = document.documentElement;
  if (p.theme === "system") delete root.dataset.theme;
  else root.dataset.theme = p.theme;
  root.lang = p.uiLang;
  try {
    localStorage.setItem("armat:theme", p.theme);
    localStorage.setItem("armat:lang", p.uiLang);
  } catch {
    // Storage unavailable: preferences still apply for this visit.
  }
}

function storedLang(): Lang {
  try {
    const l = localStorage.getItem("armat:lang");
    return isLang(l) ? l : "en";
  } catch {
    return "en";
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<Status>({ kind: "starting" });
  const [profile, setProfile] = useState<Profile | null>(null);
  const [bootLang, setBootLang] = useState<Lang>("en");
  const [slow, setSlow] = useState(false);

  const refresh = useCallback(async () => {
    const p = await api.profile();
    applyPreferences(p);
    setProfile(p);
  }, []);

  useEffect(() => {
    setBootLang(storedLang());
    const timer = window.setTimeout(() => setSlow(true), 1500);
    let cancelled = false;
    (async () => {
      try {
        if ((await acquireLock()) === "busy") {
          if (!cancelled) setStatus({ kind: "other-tab" });
          return;
        }
        await database();
        // Ask the browser not to evict the study data under storage pressure.
        await navigator.storage?.persist?.().catch(() => false);
        await refresh();
        if (!cancelled) setStatus({ kind: "ready" });
      } catch (err) {
        if (!cancelled) setStatus({ kind: "error", message: err instanceof Error ? err.message : String(err) });
      }
    })();
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [refresh]);

  if (status.kind === "ready" && profile) {
    return (
      <ProfileContext.Provider value={{ profile, refresh }}>
        <I18nProvider lang={profile.uiLang}>{children}</I18nProvider>
      </ProfileContext.Provider>
    );
  }

  const t = translator(bootLang);
  return (
    <div className="mx-auto flex min-h-dvh max-w-[520px] flex-col justify-center gap-5 px-6">
      <div className="text-[22px] font-semibold tracking-[-0.02em]">Armat</div>
      {status.kind === "starting" && (
        <>
          <div className="h-[2px] w-full overflow-hidden rounded-full bg-line">
            <div className="boot-bar h-full w-1/3 rounded-full bg-ink" />
          </div>
          {slow && <p className="text-[15px] text-ink-3">{t("boot.preparing")}</p>}
        </>
      )}
      {status.kind === "other-tab" && (
        <>
          <p className="text-[16px] leading-relaxed text-ink-2">{t("boot.otherTab")}</p>
          <div>
            <Button variant="secondary" onClick={() => window.location.reload()}>
              {t("boot.reload")}
            </Button>
          </div>
        </>
      )}
      {status.kind === "error" && (
        <>
          <p className="text-[16px] leading-relaxed text-ink-2">{t("boot.error")}</p>
          <p className="font-mono text-[13px] text-ink-3">{status.message}</p>
          <div>
            <Button variant="secondary" onClick={() => window.location.reload()}>
              {t("boot.reload")}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
