export type Lang = "en" | "fr";
export const LANGS: readonly Lang[] = ["en", "fr"];

export type Localized = Record<Lang, string>;

export function isLang(value: unknown): value is Lang {
  return value === "en" || value === "fr";
}

export function loc(value: Localized | undefined | null, lang: Lang): string {
  if (!value) return "";
  return value[lang] || value.en || value.fr || "";
}
