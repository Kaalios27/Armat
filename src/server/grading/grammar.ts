/**
 * Deterministic grading of grammar exercises. Closed formats (blanks, choice)
 * are decided here; open formats that do not match a reference answer are
 * marked undecided so the AI can judge whether they are valid alternatives.
 */
import type { GrammarExerciseData } from "@/content/types";
import { basicNormalize, collapseSpaces, sentenceKey, stripAccents } from "@/lib/text";

export type GrammarCategory = "grammar" | "conjugation" | "vocabulary" | "orthography" | "alternative" | "style";

export interface GrammarGrade {
  correct: boolean;
  /** false when an open answer differs from every reference and needs judgement. */
  decided: boolean;
  category: GrammarCategory | null;
  expected: string;
  perBlank?: boolean[];
}

export type GrammarAnswer = string | string[];

const SUBJECT_PRONOUN = /^(yo|tú|tu|él|ella|usted|nosotros|nosotras|vosotros|vosotras|ellos|ellas|ustedes) /;

function blankNorm(s: string): string {
  return collapseSpaces(basicNormalize(s));
}

function withoutSubject(key: string): string {
  return key.replace(SUBJECT_PRONOUN, "");
}

export function expectedText(d: GrammarExerciseData): string {
  if (d.type === "fill" || d.type === "distinguish") return (d.blanks ?? []).map((b) => b[0]).join(" / ");
  return d.answers?.[0] ?? "";
}

export function gradeGrammar(d: GrammarExerciseData, answer: GrammarAnswer): GrammarGrade {
  const expected = expectedText(d);

  if (d.type === "fill" || d.type === "distinguish") {
    const given = Array.isArray(answer) ? answer : [answer];
    const blanks = d.blanks ?? [];
    let accentOnly = false;
    const perBlank = blanks.map((accepted, i) => {
      const g = blankNorm(given[i] ?? "");
      const ok = accepted.some((a) => blankNorm(a) === g);
      if (!ok && accepted.some((a) => stripAccents(blankNorm(a)) === stripAccents(g)) && g) accentOnly = true;
      return ok;
    });
    const correct = perBlank.every(Boolean);
    return { correct, decided: true, category: correct ? null : accentOnly && perBlank.filter((x) => !x).length === 1 ? "orthography" : "grammar", expected, perBlank };
  }

  if (d.type === "choose") {
    const given = blankNorm(Array.isArray(answer) ? answer[0] ?? "" : answer);
    const correct = (d.answers ?? []).some((a) => blankNorm(a) === given);
    return { correct, decided: true, category: correct ? null : "grammar", expected };
  }

  const text = Array.isArray(answer) ? answer.join(" ") : answer;
  const key = sentenceKey(text);
  if (!key) return { correct: false, decided: true, category: "grammar", expected };
  const refs = (d.answers ?? []).map(sentenceKey);
  if (refs.includes(key) || refs.some((r) => withoutSubject(r) === withoutSubject(key))) {
    return { correct: true, decided: true, category: null, expected };
  }
  if (refs.some((r) => stripAccents(r) === stripAccents(key))) {
    return { correct: false, decided: true, category: "orthography", expected };
  }
  if (d.type === "write" && d.requires?.length) {
    const ok = d.requires.every((re) => {
      try {
        return new RegExp(re, "i").test(text);
      } catch {
        return true;
      }
    });
    if (!ok) return { correct: false, decided: true, category: "grammar", expected };
  }
  if (d.type === "reconstruct") {
    // All tokens must be used; a different but valid order needs judgement.
    const tokens = (d.tokens ?? []).map((t) => sentenceKey(t)).sort().join(" ");
    const used = key.split(" ").sort().join(" ");
    if (tokens && used !== tokens) return { correct: false, decided: true, category: "grammar", expected };
  }
  return { correct: false, decided: false, category: null, expected };
}
