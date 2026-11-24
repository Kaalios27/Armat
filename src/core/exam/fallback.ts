import { DICTATIONS, WRITING_PROMPTS, type DictationText } from "@/content/exam";
import type { Lang } from "@/lib/i18n/types";
import { pick } from "@/lib/text";

/** Used only if no curated text and no example sentence is available. */
export const DEFAULT_DICTATION =
  "Me llamo Clara y vivo en un piso pequeño en el centro de Valencia. Trabajo en una empresa de ingeniería y empiezo a las nueve. Por la mañana voy en bicicleta porque el tráfico es horrible.";

export function minWordsForLevel(level: number): number {
  return [70, 100, 130, 170, 210, 250][Math.min(5, Math.max(0, level - 1))]!;
}

/** Prefer texts of the learner's level, then one level below, avoiding recently used ones. */
export function pickDictation(level: number, used: Set<string>, rand: () => number): DictationText | null {
  const near = DICTATIONS.filter((d) => d.level === level || d.level === level - 1);
  const pool = near.length ? near : DICTATIONS.filter((d) => d.level <= level);
  if (!pool.length) return null;
  const fresh = pool.filter((d) => !used.has(d.id));
  const atLevel = fresh.filter((d) => d.level === level);
  return pick(atLevel.length ? atLevel : fresh.length ? fresh : pool, rand);
}

/** A writing prompt for the level (or one below) not used in recent exams, with its model answer. */
export function pickWritingPrompt(level: number, used: Set<string>, seed: number, lang: Lang): { id: string; prompt: string; guidance: string[]; model: string } {
  const near = WRITING_PROMPTS.filter((p) => p.level === level || p.level === level - 1);
  const below = WRITING_PROMPTS.filter((p) => p.level <= level);
  const pool = near.length ? near : below.length ? below : WRITING_PROMPTS;
  const fresh = pool.filter((p) => !used.has(p.id));
  const atLevel = fresh.filter((p) => p.level === level);
  const list = atLevel.length ? atLevel : fresh.length ? fresh : pool;
  const p = list[Math.abs(seed) % list.length]!;
  return { id: p.id, prompt: p.prompt[lang], guidance: p.guidance.map((g) => g[lang]), model: p.model };
}

/** Split a dictation text into segments of roughly 5 to 10 words at punctuation boundaries. */
export function segmentText(text: string): string[] {
  const clauses = text
    .replace(/\s+/g, " ")
    .trim()
    .split(/(?<=[.;:!?])\s+|(?<=,)\s+/);
  const out: string[] = [];
  let buf = "";
  for (const c of clauses) {
    const words = (buf + " " + c).trim().split(" ").length;
    if (buf && words > 11) {
      out.push(buf.trim());
      buf = c;
    } else buf = (buf + " " + c).trim();
  }
  if (buf.trim()) out.push(buf.trim());
  return out;
}
