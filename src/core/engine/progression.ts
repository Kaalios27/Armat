/**
 * Mastery estimates and progression rules. Mastery is an exponentially
 * weighted accuracy: recent answers count more, and a single success never
 * proves mastery.
 */

export const EWMA_ALPHA = 0.15;

export interface ProgressLike {
  status: string;
  mastery: number;
  attempts: number;
  sessionsPracticed: number;
  focusDays: number;
}

export function updateMastery(prev: number, score: number): number {
  return prev + EWMA_ALPHA * (score - prev);
}

export function isMastered(kind: "grammar" | "conjugation", p: Pick<ProgressLike, "mastery" | "attempts" | "sessionsPracticed">): boolean {
  if (kind === "conjugation") {
    return (p.mastery >= 0.85 && p.attempts >= 24 && p.sessionsPracticed >= 2) || (p.mastery >= 0.93 && p.attempts >= 30);
  }
  return (p.mastery >= 0.8 && p.attempts >= 12 && p.sessionsPracticed >= 2) || (p.mastery >= 0.9 && p.attempts >= 16);
}

export function statusFor(kind: "grammar" | "conjugation", p: Pick<ProgressLike, "mastery" | "attempts" | "sessionsPracticed" | "status">): string {
  if (isMastered(kind, p)) return "mastered";
  // A mastered concept only loses the status when evidence clearly says so.
  if (p.status === "mastered" && p.mastery >= 0.65) return "mastered";
  return p.attempts < 5 ? "introduced" : "practicing";
}

/** Whether tomorrow's session may introduce the next conjugation unit. */
export function canAdvanceConjugation(p: ProgressLike | undefined): boolean {
  if (!p) return true;
  if (p.status === "mastered") return true;
  if (p.focusDays >= 3 && p.mastery >= 0.6) return true;
  return p.focusDays >= 5;
}

/** Whether tomorrow's session may introduce the next grammar concept (never stalls more than three days). */
export function canAdvanceGrammar(p: ProgressLike | undefined): boolean {
  if (!p) return true;
  if (p.status === "mastered") return true;
  if (p.attempts >= 8 && p.mastery >= 0.7) return true;
  return p.focusDays >= 3;
}

// ---------------------------------------------------------------------------
// Vocabulary pace
// ---------------------------------------------------------------------------

export type Pace = "steady" | "standard" | "intensive";

export const PACE: Record<Pace, { base: number; min: number; max: number }> = {
  steady: { base: 12, min: 6, max: 20 },
  standard: { base: 18, min: 8, max: 28 },
  intensive: { base: 24, min: 10, max: 35 },
};

export interface PaceStats {
  /** Share of successful reviews of cards scheduled at least a day ahead (last 14 days). */
  retention: number | null;
  reviewsDueTomorrow: number;
}

export function adaptNewWordTarget(current: number, pace: Pace, stats: PaceStats): number {
  const { min, max } = PACE[pace];
  let t = current;
  if (stats.retention !== null) {
    if (stats.retention >= 0.92) t += 2;
    else if (stats.retention < 0.8) t -= 3;
    else if (stats.retention < 0.86) t -= 1;
  }
  if (stats.reviewsDueTomorrow > 120) t -= 5;
  else if (stats.reviewsDueTomorrow > 80) t -= 3;
  else if (stats.reviewsDueTomorrow < 30 && (stats.retention ?? 0.9) >= 0.88) t += 1;
  return Math.max(min, Math.min(max, Math.round(t)));
}

/** New words for today, reduced when the review backlog is heavy. */
export function newWordsForToday(target: number, dueReviews: number): number {
  if (dueReviews > 150) return Math.round(target * 0.3);
  if (dueReviews > 100) return Math.round(target * 0.5);
  if (dueReviews > 60) return Math.round(target * 0.75);
  return target;
}

// ---------------------------------------------------------------------------
// Weighted selection of new vocabulary
// ---------------------------------------------------------------------------

export interface VocabCandidate {
  id: string;
  level: number;
  frequency: number;
  theme: string;
  tags: string[];
  cognate: number;
  falseFriend: boolean;
}

/**
 * Combines frequency, usefulness and difficulty for the instruction language.
 * Transparent cognates are penalised but never excluded; items above the
 * current level are allowed only when they score well.
 */
export function vocabScore(c: VocabCandidate, currentLevel: number): number {
  const freq = c.frequency / 5;
  const difficulty = 1 - c.cognate;
  let useful = 0.45;
  if (c.tags.includes("marker")) useful += 0.25;
  if (c.tags.includes("idiom")) useful += 0.1;
  if (c.tags.includes("acad")) useful += 0.08;
  if (c.tags.includes("irr")) useful += 0.08;
  if (c.tags.includes("multi")) useful += 0.1;
  if (c.falseFriend) useful += 0.3;
  const levelPenalty = Math.max(0, c.level - currentLevel) * 0.35;
  const transparentPenalty = c.cognate >= 0.85 && !c.falseFriend ? 0.12 : 0;
  return 0.4 * freq + 0.25 * difficulty + 0.25 * Math.min(1, useful) + 0.1 - levelPenalty - transparentPenalty;
}

export function selectNewVocab(candidates: VocabCandidate[], n: number, rand: () => number): string[] {
  if (n <= 0 || !candidates.length) return [];
  const currentLevel = Math.min(...candidates.map((c) => c.level));
  const scored = candidates
    .map((c) => ({ c, s: vocabScore(c, currentLevel) + rand() * 0.04 }))
    .sort((a, b) => b.s - a.s);
  const perTheme = Math.max(2, Math.ceil(n * 0.4));
  const themeCount = new Map<string, number>();
  const out: string[] = [];
  for (const { c } of scored) {
    if (out.length >= n) break;
    const used = themeCount.get(c.theme) ?? 0;
    if (used >= perTheme) continue;
    themeCount.set(c.theme, used + 1);
    out.push(c.id);
  }
  for (const { c } of scored) {
    if (out.length >= n) break;
    if (!out.includes(c.id)) out.push(c.id);
  }
  return out;
}
