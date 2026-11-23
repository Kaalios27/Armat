import type { Lang } from "./i18n/types";

const LOCALE: Record<Lang, string> = { en: "en-GB", fr: "fr-FR" };

/** Format a local date string (YYYY-MM-DD). */
export function formatDate(date: string, lang: Lang, opts: Intl.DateTimeFormatOptions = { weekday: "long", day: "numeric", month: "long" }): string {
  const s = new Intl.DateTimeFormat(LOCALE[lang], { ...opts, timeZone: "UTC" }).format(new Date(`${date}T12:00:00Z`));
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function formatShortDate(date: string, lang: Lang): string {
  return formatDate(date, lang, { day: "numeric", month: "short" });
}

export function daysBetween(a: string, b: string): number {
  return Math.round((Date.parse(`${b}T12:00:00Z`) - Date.parse(`${a}T12:00:00Z`)) / 86_400_000);
}

export function formatClock(ms: number): string {
  const total = Math.max(0, Math.round(ms / 1000));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function formatScore(n: number | null | undefined): string {
  if (n === null || n === undefined) return "–";
  return Number.isInteger(n) ? String(n) : n.toFixed(1);
}

export function formatPercent(x: number | null | undefined): string {
  if (x === null || x === undefined) return "–";
  return `${Math.round(x * 100)}%`;
}
