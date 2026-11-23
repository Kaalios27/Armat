import { lemmaKey, nominalBaseCandidates } from "@/lib/lemma";
import { basicNormalize, collapseSpaces, levenshtein, stripAccents } from "@/lib/text";

export type SpanishVerdict = "correct" | "accent" | "wrong";

export interface SpanishGrade {
  verdict: SpanishVerdict;
  /** Accepted only because it is an inflected or gendered form of the lemma. */
  inflected?: boolean;
  closest: string;
  distance: number;
}

function norm(s: string): string {
  return collapseSpaces(basicNormalize(s).replace(/^(el|la|los|las|un|una|lo)\s+/, "").replace(/[¡!¿?.,;:]/g, " "));
}

/** Accent-sensitive comparison of a Spanish answer with accepted forms. */
export function gradeSpanishAnswer(answer: string, accepted: string[], lemma?: string): SpanishGrade {
  const a = norm(answer);
  const forms = accepted.map(norm).filter(Boolean);
  let closest = accepted[0] ?? "";
  let distance = Number.POSITIVE_INFINITY;
  for (let i = 0; i < forms.length; i++) {
    const d = levenshtein(a, forms[i]!);
    if (d < distance) {
      distance = d;
      closest = accepted[i]!;
    }
  }
  if (!a) return { verdict: "wrong", closest, distance };
  if (forms.includes(a)) return { verdict: "correct", closest, distance: 0 };
  if (forms.some((f) => stripAccents(f) === stripAccents(a))) return { verdict: "accent", closest, distance };
  if (lemma) {
    const key = lemmaKey(lemma);
    if (nominalBaseCandidates(a).some((c) => c === key)) return { verdict: "correct", inflected: true, closest, distance };
  }
  return { verdict: "wrong", closest, distance };
}
