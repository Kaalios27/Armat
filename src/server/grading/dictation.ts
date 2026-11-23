/**
 * Dictation grading by token alignment. Errors are classified as missing,
 * extra or wrong words, spelling, accents, punctuation and capitalisation.
 */
import { isPunctuation, levenshtein, nfc, stripAccents, tokenize, wordCount } from "@/lib/text";

export type DictationErrorType = "missing" | "extra" | "wrong" | "spelling" | "accent" | "punctuation" | "capitalization";

export interface DictationToken {
  ref: string | null;
  hyp: string | null;
  type: DictationErrorType | null;
}

export interface DictationResult {
  score: number;
  maxScore: number;
  words: number;
  penalty: number;
  counts: Record<DictationErrorType, number>;
  tokens: DictationToken[];
}

const PENALTY: Record<DictationErrorType, number> = {
  missing: 1,
  extra: 1,
  wrong: 1,
  spelling: 1,
  accent: 0.5,
  punctuation: 0.25,
  capitalization: 0.25,
};

function classify(ref: string, hyp: string): DictationErrorType | null {
  if (ref === hyp) return null;
  const rp = isPunctuation(ref);
  const hp = isPunctuation(hyp);
  if (rp || hp) return rp && hp ? "punctuation" : "wrong";
  if (ref.toLowerCase() === hyp.toLowerCase()) return "capitalization";
  if (stripAccents(ref.toLowerCase()) === stripAccents(hyp.toLowerCase())) return "accent";
  const d = levenshtein(stripAccents(ref.toLowerCase()), stripAccents(hyp.toLowerCase()));
  if (d <= Math.max(1, Math.floor(ref.length / 4))) return "spelling";
  return "wrong";
}

function subCost(ref: string, hyp: string): number {
  const t = classify(ref, hyp);
  if (t === null) return 0;
  if (t === "wrong") return 1.2;
  return PENALTY[t] * 0.6;
}

export function gradeDictation(reference: string, answer: string, maxScore = 15): DictationResult {
  const r = tokenize(nfc(reference));
  const h = tokenize(nfc(answer));
  const n = r.length;
  const m = h.length;
  const gapCost = (tok: string) => (isPunctuation(tok) ? 0.3 : 1);
  const dp: number[][] = Array.from({ length: n + 1 }, () => new Array<number>(m + 1).fill(0));
  for (let i = 1; i <= n; i++) dp[i]![0] = dp[i - 1]![0]! + gapCost(r[i - 1]!);
  for (let j = 1; j <= m; j++) dp[0]![j] = dp[0]![j - 1]! + gapCost(h[j - 1]!);
  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      dp[i]![j] = Math.min(
        dp[i - 1]![j - 1]! + subCost(r[i - 1]!, h[j - 1]!),
        dp[i - 1]![j]! + gapCost(r[i - 1]!),
        dp[i]![j - 1]! + gapCost(h[j - 1]!),
      );
    }
  }
  const tokens: DictationToken[] = [];
  let i = n;
  let j = m;
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && Math.abs(dp[i]![j]! - (dp[i - 1]![j - 1]! + subCost(r[i - 1]!, h[j - 1]!))) < 1e-9) {
      tokens.push({ ref: r[i - 1]!, hyp: h[j - 1]!, type: classify(r[i - 1]!, h[j - 1]!) });
      i--;
      j--;
    } else if (i > 0 && Math.abs(dp[i]![j]! - (dp[i - 1]![j]! + gapCost(r[i - 1]!))) < 1e-9) {
      tokens.push({ ref: r[i - 1]!, hyp: null, type: isPunctuation(r[i - 1]!) ? "punctuation" : "missing" });
      i--;
    } else {
      tokens.push({ ref: null, hyp: h[j - 1]!, type: isPunctuation(h[j - 1]!) ? "punctuation" : "extra" });
      j--;
    }
  }
  tokens.reverse();
  const counts: Record<DictationErrorType, number> = { missing: 0, extra: 0, wrong: 0, spelling: 0, accent: 0, punctuation: 0, capitalization: 0 };
  let penalty = 0;
  for (const t of tokens) {
    if (t.type) {
      counts[t.type]++;
      penalty += PENALTY[t.type];
    }
  }
  const words = Math.max(1, wordCount(reference));
  // A weighted error rate of one third (e.g. 33 full errors in 100 words) scores zero.
  const raw = maxScore * Math.max(0, 1 - (3 * penalty) / words);
  return { score: Math.round(raw * 2) / 2, maxScore, words, penalty, counts, tokens };
}
