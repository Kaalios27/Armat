import type { GrammarExerciseData } from "@/content/types";
import { hashString, sentenceKey } from "./text";

/** Content hash used to prevent duplicate grammar exercises (seeded or generated). */
export function exerciseHash(conceptId: string, d: Pick<GrammarExerciseData, "type" | "es" | "prompt" | "tokens">): string {
  const core = [
    conceptId,
    d.type,
    sentenceKey(d.es ?? ""),
    sentenceKey(d.prompt?.en ?? ""),
    sentenceKey(d.prompt?.fr ?? ""),
    (d.tokens ?? []).map((t) => sentenceKey(t)).sort().join(" "),
  ].join("|");
  return hashString(core) + hashString(core.split("").reverse().join(""));
}
