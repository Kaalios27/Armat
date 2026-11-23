/**
 * Lemma keys and cognate scoring.
 *
 * lemmaKey() is the unique key of a vocabulary item: case, accents of the
 * article, surrounding punctuation, articles and placeholders (algo, alguien)
 * never create a new item. looseKey() additionally ignores a trailing
 * preposition so that "darse cuenta" and "darse cuenta de" are recognised as
 * the same expression when new items are proposed.
 */
import { basicNormalize, collapseSpaces, similarity, stripAllDiacritics } from "./text";
import type { Lang } from "./i18n/types";

const ARTICLES = /^(el|la|los|las|un|una|unos|unas|lo)\s+/;
const TRAILING_PREP = /\s+(de|a|en|con|por|para|que)$/;

export function lemmaKey(lemma: string): string {
  let s = basicNormalize(lemma.replace(/\([^)]*\)?/g, " "));
  s = s.replace(/[¡!¿?]/g, " ");
  s = s.replace(ARTICLES, "");
  s = s.replace(/\b(algo|alguien)\b/g, " ");
  return collapseSpaces(s);
}

export function looseKey(lemma: string): string {
  let s = lemmaKey(lemma);
  while (s.split(" ").length > 2 && TRAILING_PREP.test(s)) s = s.replace(TRAILING_PREP, "");
  return s;
}

export function slugify(lemma: string): string {
  return stripAllDiacritics(lemmaKey(lemma))
    .replace(/ñ/g, "n")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Singular / masculine candidates for a noun or adjective form (casas → casa, luces → luz, lista → listo). */
export function nominalBaseCandidates(word: string): string[] {
  const w = basicNormalize(word);
  const out = new Set<string>();
  if (w.endsWith("ces")) out.add(w.slice(0, -3) + "z");
  if (w.endsWith("es")) out.add(w.slice(0, -2));
  if (w.endsWith("s")) out.add(w.slice(0, -1));
  for (const c of Array.from(out).concat([w])) {
    if (c.endsWith("a")) out.add(c.slice(0, -1) + "o");
    if (/(ora|esa|ana|ona)$/.test(c)) out.add(c.slice(0, -1));
  }
  out.delete(w);
  return Array.from(out);
}

function simplifyTranslation(t: string, lang: Lang): string {
  let s = basicNormalize(t.replace(/\([^)]*\)?/g, " "));
  if (lang === "en") s = s.replace(/^to\s+/, "").replace(/^(the|a|an)\s+/, "");
  if (lang === "fr") s = s.replace(/^(le|la|les|un|une|des)\s+/, "").replace(/^l'/, "").replace(/^(se|s')\s*/, "");
  return stripAllDiacritics(collapseSpaces(s));
}

function verbStem(s: string, lang: Lang | "es"): string {
  if (lang === "es") return s.replace(/(ar|er|ir)(se)?$/, "");
  if (lang === "fr") return s.replace(/(er|ir|re|oir)$/, "");
  return s;
}

/**
 * How transparent a Spanish item is for a speaker of `lang` (0 = opaque, 1 = identical).
 * Uses the best match among the translations; verbs are compared by stem.
 */
export function cognateScore(lemma: string, pos: string, translations: string[], lang: Lang): number {
  const es = stripAllDiacritics(lemmaKey(lemma)).replace(/se$/, "");
  const isVerb = pos === "v";
  let best = 0;
  for (const t of translations) {
    const tr = simplifyTranslation(t, lang);
    if (!tr) continue;
    const a = isVerb ? verbStem(es, "es") : es;
    const b = isVerb ? verbStem(tr, lang) : tr;
    let score = similarity(a, b);
    // Shared prefix bonus (import-ar / import-er).
    let p = 0;
    while (p < Math.min(a.length, b.length) && a[p] === b[p]) p++;
    if (p >= 4) score = Math.max(score, Math.min(1, p / Math.max(a.length, b.length) + 0.25));
    best = Math.max(best, score);
  }
  return Math.round(best * 100) / 100;
}

/** Forms accepted when the learner types a translation: with and without parentheses and leading "to". */
export function answerVariants(translation: string, lang: Lang): string[] {
  const base = basicNormalize(translation);
  const variants = new Set<string>([base]);
  variants.add(basicNormalize(translation.replace(/\([^)]*\)?/g, " ")));
  variants.add(basicNormalize(translation.replace(/[()]/g, "")));
  for (const v of Array.from(variants)) {
    if (lang === "en") {
      variants.add(v.replace(/^to\s+/, ""));
      variants.add(v.replace(/^(the|a|an)\s+/, ""));
    } else {
      variants.add(v.replace(/^(le|la|les|un|une)\s+/, "").replace(/^l'/, ""));
    }
  }
  return Array.from(variants).filter(Boolean);
}
