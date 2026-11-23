"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import { translator, type MessageKey } from "@/lib/i18n/messages";
import type { Lang } from "@/lib/i18n/types";

type T = (key: MessageKey, vars?: Record<string, string | number>) => string;

const I18nContext = createContext<{ lang: Lang; t: T }>({ lang: "en", t: translator("en") });

export function I18nProvider({ lang, children }: { lang: Lang; children: ReactNode }) {
  const value = useMemo(() => ({ lang, t: translator(lang) }), [lang]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  return useContext(I18nContext);
}
