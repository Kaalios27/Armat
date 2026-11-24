/**
 * Text utilities shared by client and server: normalisation for answer
 * comparison, accent handling, edit distance and Spanish stress rules.
 */

export function nfc(s: string): string {
  return s.normalize("NFC");
}

export function collapseSpaces(s: string): string {
  return s.replace(/\s+/g, " ").trim();
}

/** Remove acute accents, grave accents and diaeresis. Keeps ñ (tilde). */
export function stripAccents(s: string): string {
  return s.normalize("NFD").replace(/[̀́̈]/g, "").normalize("NFC");
}

/** Remove every combining mark (used for lenient comparison of English/French answers). */
export function stripAllDiacritics(s: string): string {
  return s.normalize("NFD").replace(/\p{M}/gu, "").normalize("NFC");
}

const QUOTES = /[‘’‚‛`]/g;
const EDGE = /^[\s.,;:!?¡¿"«»“”()[\]…—–-]+|[\s.,;:!?¡¿"«»“”()[\]…—–-]+$/g;

/** Lowercase, NFC, unify apostrophes, trim edge punctuation, collapse spaces. */
export function basicNormalize(s: string): string {
  return collapseSpaces(nfc(s).toLowerCase().replace(QUOTES, "'").replace(EDGE, ""));
}

/** Sentence-level key: ignores case and punctuation, keeps accents and word order. */
export function sentenceKey(s: string): string {
  return collapseSpaces(
    nfc(s)
      .toLowerCase()
      .replace(QUOTES, "'")
      .replace(/[.,;:!?¡¿"«»“”()[\]…—–]/g, " ")
      .replace(/\s-\s/g, " "),
  );
}

export function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;
  let prev = new Array<number>(b.length + 1);
  let cur = new Array<number>(b.length + 1);
  for (let j = 0; j <= b.length; j++) prev[j] = j;
  for (let i = 1; i <= a.length; i++) {
    cur[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      cur[j] = Math.min(prev[j]! + 1, cur[j - 1]! + 1, prev[j - 1]! + cost);
    }
    [prev, cur] = [cur, prev];
  }
  return prev[b.length]!;
}

/** Similarity in [0, 1] based on edit distance. */
export function similarity(a: string, b: string): number {
  const max = Math.max(a.length, b.length);
  if (max === 0) return 1;
  return 1 - levenshtein(a, b) / max;
}

/** Word and punctuation tokens, used for dictation alignment. */
export function tokenize(s: string): string[] {
  return nfc(s).match(/[\p{L}\p{N}]+(?:['’][\p{L}]+)*|[.,;:!?¡¿«»"—…()]/gu) ?? [];
}

export function isPunctuation(token: string): boolean {
  return /^[.,;:!?¡¿«»"—…()]$/.test(token);
}

export function wordCount(s: string): number {
  return (nfc(s).match(/[\p{L}\p{N}]+(?:['’][\p{L}]+)*/gu) ?? []).length;
}

/** Stable 32-bit FNV-1a hash, hex encoded. */
export function hashString(s: string): string {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(16).padStart(8, "0");
}

/** Deterministic PRNG (mulberry32) seeded from a string. */
export function seededRandom(seed: string): () => number {
  let a = parseInt(hashString(seed), 16) || 1;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function pick<T>(items: readonly T[], rand: () => number): T {
  return items[Math.floor(rand() * items.length)]!;
}

export function shuffle<T>(items: readonly T[], rand: () => number): T[] {
  const a = items.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a;
}

// ---------------------------------------------------------------------------
// Spanish stress and written accents
// ---------------------------------------------------------------------------

const VOWELS = "aeiouáéíóúü";
const HIATUS_STRONG = "aeoáéóíú"; // accented i/u behave like strong vowels (hiatus)
const ACCENTED = "áéíóú";
const ADD_ACCENT: Record<string, string> = { a: "á", e: "é", i: "í", o: "ó", u: "ú" };
const REMOVE_ACCENT: Record<string, string> = { á: "a", é: "e", í: "i", ó: "o", ú: "u" };

function isSilentU(w: string, i: number): boolean {
  return (
    w[i] === "u" && i > 0 && (w[i - 1] === "q" || w[i - 1] === "g") && i + 1 < w.length && "eéií".includes(w[i + 1]!)
  );
}

/** Syllable nuclei of a lowercase word as [start, end) index pairs. */
export function nuclei(word: string): Array<[number, number]> {
  const w = word.toLowerCase();
  const out: Array<[number, number]> = [];
  let i = 0;
  while (i < w.length) {
    if (!VOWELS.includes(w[i]!) || isSilentU(w, i)) {
      i++;
      continue;
    }
    let j = i;
    while (j < w.length && VOWELS.includes(w[j]!) && !isSilentU(w, j)) j++;
    let start = i;
    for (let k = i + 1; k < j; k++) {
      if (HIATUS_STRONG.includes(w[k - 1]!) && HIATUS_STRONG.includes(w[k]!)) {
        out.push([start, k]);
        start = k;
      }
    }
    out.push([start, j]);
    i = j;
  }
  return out;
}

function defaultStress(word: string, count: number): number {
  if (count <= 1) return 0;
  const last = word[word.length - 1]!;
  return /[aeiouns]/.test(last) ? count - 2 : count - 1;
}

/** Index of the stressed nucleus (0-based from the start), or -1 for words without vowels. */
export function stressIndex(word: string): number {
  const w = word.toLowerCase();
  const nucs = nuclei(w);
  if (!nucs.length) return -1;
  for (let n = 0; n < nucs.length; n++) {
    const [s, e] = nucs[n]!;
    for (let k = s; k < e; k++) if (ACCENTED.includes(w[k]!)) return n;
  }
  return defaultStress(w, nucs.length);
}

function placeAccent(word: string, nucleus: [number, number]): string {
  const [s, e] = nucleus;
  for (let k = s; k < e; k++) if (ACCENTED.includes(word[k]!)) return word;
  let idx = -1;
  for (let k = s; k < e; k++) {
    if ("aeo".includes(word[k]!)) {
      idx = k;
      break;
    }
  }
  if (idx === -1) {
    for (let k = e - 1; k >= s; k--) {
      if ("iu".includes(word[k]!)) {
        idx = k;
        break;
      }
    }
  }
  if (idx === -1) return word;
  return word.slice(0, idx) + ADD_ACCENT[word[idx]!] + word.slice(idx + 1);
}

/**
 * Remove written accents that only mark stress. Accents on i/u that break a
 * diphthong (hiatus, as in "envía") are kept, so the syllable count is unchanged.
 */
function removeStressAccents(word: string): string {
  let out = "";
  for (let k = 0; k < word.length; k++) {
    const ch = word[k]!;
    if (ACCENTED.includes(ch)) {
      const isWeak = ch === "í" || ch === "ú";
      const nextStrong = k + 1 < word.length && "aeoáéó".includes(word[k + 1]!);
      const prevStrong = k > 0 && "aeoáéó".includes(word[k - 1]!);
      if (isWeak && (nextStrong || prevStrong)) {
        out += ch;
        continue;
      }
      out += REMOVE_ACCENT[ch];
    } else out += ch;
  }
  return out;
}

/**
 * Attach enclitic pronouns to a verb form, keeping the original stress and
 * adding or removing the written accent as required (levanta + te = levántate).
 * `drop` removes trailing characters first (levantemos + nos = levantémonos).
 */
export function attachClitics(form: string, clitics: string, drop = 0): string {
  const stressed = stressIndex(form);
  const base = removeStressAccents(drop ? form.slice(0, -drop) : form);
  const word = base + clitics;
  const nucs = nuclei(word);
  if (stressed < 0 || stressed >= nucs.length) return word;
  if (defaultStress(word, nucs.length) === stressed) return word;
  return placeAccent(word, nucs[stressed]!);
}

/** Prefix a verb form (mantener: man + ten = mantén), fixing the accent of former monosyllables. */
export function prefixWord(prefix: string, word: string): string {
  const joined = prefix + word;
  if (nuclei(word).length !== 1) return joined;
  const nucs = nuclei(joined);
  const last = nucs.length - 1;
  if (defaultStress(joined, nucs.length) === last) return joined;
  return placeAccent(joined, nucs[last]!);
}

export function addAccentToLastWeak(stem: string): string {
  for (let k = stem.length - 1; k >= 0; k--) {
    if (stem[k] === "i" || stem[k] === "u") return stem.slice(0, k) + ADD_ACCENT[stem[k]!] + stem.slice(k + 1);
  }
  return stem;
}

export function accentVowel(ch: string): string {
  return ADD_ACCENT[ch] ?? ch;
}

/** Base64 of the UTF-8 bytes of a string (browser and Node, no Buffer). */
export function toBase64(s: string): string {
  let bin = "";
  for (const b of new TextEncoder().encode(s)) bin += String.fromCharCode(b);
  return btoa(bin);
}

export function fromBase64(b64: string): string {
  return new TextDecoder().decode(Uint8Array.from(atob(b64), (c) => c.charCodeAt(0)));
}
