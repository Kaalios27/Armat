/**
 * Conjugation exercise generation: direct form, sentence completion,
 * contextual tense choice, error correction and full tables.
 */
import type { Localized } from "../i18n/types";
import { pick, shuffle } from "../text";
import { acceptedForms, conjugate, hasImperative, shape } from "./engine";
import { normalizeConjAnswer, regularized, type AlternativeTense } from "./diagnose";
import { PERSONS, type Person, type Tense, type VerbDef } from "./types";
import { getVerbDef } from "./verbs";

export type ConjDrillType = "direct" | "sentence" | "context" | "error" | "table";

export interface ConjDrill {
  type: ConjDrillType;
  verb: string;
  tense: Tense;
  person: Person | null;
  /** Grammatical subject shown in the prompt (may be a noun phrase). */
  subject: string | null;
  /** Sentence around the blank. */
  before: string | null;
  after: string | null;
  /** Incorrect form displayed in error-correction drills. */
  wrong: string | null;
  persons: Person[] | null;
  showTense: boolean;
  translation: Localized;
}

export interface ConjKey {
  /** Accepted answers for single-answer drills. */
  answers: string[];
  /** Accepted answers per person for tables. */
  table?: string[][];
  alternatives: AlternativeTense[];
}

const SUBJECTS: Record<Person, string[]> = {
  0: ["yo"],
  1: ["tú"],
  2: ["él", "ella", "usted", "Marta", "mi hermano", "la directora", "el profesor"],
  3: ["nosotros"],
  4: ["vosotros"],
  5: ["ellos", "ellas", "ustedes", "mis padres", "los estudiantes", "mis compañeros"],
};

interface Frame {
  text: string;
  /** Persons that would make the sentence unnatural (Quiero que yo...). */
  exclude?: Person[];
  /** Insert "ya" before the verb. */
  ya?: boolean;
  governor?: boolean;
}

const FRAMES: Partial<Record<Tense, Frame[]>> = {
  pres: [{ text: "Normalmente" }, { text: "Cada día" }, { text: "Los lunes" }, { text: "A menudo" }],
  pres_prog: [{ text: "Ahora mismo" }, { text: "En este momento" }],
  perf: [{ text: "Esta mañana" }, { text: "Hoy" }, { text: "Esta semana" }, { text: "Este año" }],
  pret: [{ text: "Ayer" }, { text: "El año pasado" }, { text: "La semana pasada" }, { text: "Anoche" }, { text: "En 2019" }],
  impf: [{ text: "Antes, siempre" }, { text: "En aquella época, a menudo" }, { text: "Todos los veranos" }, { text: "Cuando éramos jóvenes" }],
  fut: [{ text: "Mañana" }, { text: "El año que viene" }, { text: "La semana próxima" }, { text: "Dentro de un mes" }],
  cond: [{ text: "Con más tiempo" }, { text: "En ese caso" }, { text: "Con más dinero" }],
  pres_subj: [
    { text: "Es importante que", governor: true },
    { text: "Ojalá", governor: true },
    { text: "Es posible que", governor: true },
    { text: "Espero que", governor: true, exclude: [0] },
    { text: "No creo que", governor: true, exclude: [0] },
    { text: "Quiero que", governor: true, exclude: [0] },
  ],
  impf_subj: [
    { text: "Era importante que", governor: true },
    { text: "Ojalá", governor: true },
    { text: "Queríamos que", governor: true, exclude: [3] },
    { text: "Me pidió que", governor: true },
  ],
  pluscuam: [{ text: "Cuando llegué", ya: true }, { text: "Antes de la reunión", ya: true }, { text: "A las diez", ya: true }],
  fut_perf: [{ text: "Para mañana", ya: true }, { text: "Antes del lunes", ya: true }, { text: "Dentro de un año", ya: true }],
  cond_perf: [{ text: "Con más tiempo" }, { text: "En ese caso" }, { text: "Con tu ayuda", exclude: [1] }],
  perf_subj: [
    { text: "Espero que", governor: true, ya: true, exclude: [0] },
    { text: "No creo que", governor: true, ya: true, exclude: [0] },
    { text: "Es posible que", governor: true, ya: true },
  ],
  pluscuam_subj: [
    { text: "Ojalá", governor: true, ya: true },
    { text: "Me sorprendió que", governor: true, ya: true, exclude: [0] },
    { text: "No creía que", governor: true, ya: true, exclude: [0] },
  ],
};

export const CONTEXT_TENSES: Tense[] = Object.keys(FRAMES) as Tense[];

const REGIONAL_PRETERITE: Localized = {
  en: "Accepted. In Castilian Spanish, the pretérito perfecto is standard with today, this week or this year; the indefinido is common in other varieties.",
  fr: "Accepté. En espagnol castillan, le pretérito perfecto est la norme avec hoy, esta semana ou este año ; l'indefinido est courant dans d'autres variétés.",
};
const PERIPHRASTIC_FUTURE: Localized = {
  en: "Accepted: ir a + infinitive also expresses the future.",
  fr: "Accepté : ir a + infinitif exprime aussi le futur.",
};

function alternativesFor(tense: Tense, context: boolean): AlternativeTense[] {
  if (!context) return [];
  if (tense === "perf") return [{ tense: "pret", note: REGIONAL_PRETERITE }];
  if (tense === "fut") return [{ tense: "fut", note: PERIPHRASTIC_FUTURE }];
  return [];
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function translationOf(def: VerbDef): Localized {
  return { en: def.en, fr: def.fr };
}

export interface DrillRequest {
  verb: string;
  tense: Tense;
  type: ConjDrillType;
  rand: () => number;
  person?: Person;
}

function personsFor(def: VerbDef, tense: Tense): Person[] {
  if (tense === "imper_aff" || tense === "imper_neg") return hasImperative(def) ? [1, 2, 3, 4, 5] : [];
  if (def.inf === "haber") return [2];
  return [...PERSONS];
}

export function canDrill(verb: string, tense: Tense): boolean {
  const def = getVerbDef(verb);
  return !!def && personsFor(def, tense).length > 0;
}

/** Build one drill and its answer key. Falls back to a direct drill when a sentence frame does not fit. */
export function buildDrill(req: DrillRequest): { drill: ConjDrill; key: ConjKey } {
  const def = getVerbDef(req.verb);
  if (!def) throw new Error(`Unknown verb ${req.verb}`);
  const persons = personsFor(def, req.tense);
  if (!persons.length) throw new Error(`${req.verb} has no ${req.tense} forms to drill`);
  const rand = req.rand;
  let type = req.type;
  const imperative = req.tense === "imper_aff" || req.tense === "imper_neg";
  const frames = FRAMES[req.tense];
  const hasCtx = !!def.ctx?.length;
  if ((type === "sentence" || type === "context" || type === "error") && !hasCtx) type = "direct";
  if ((type === "context" || type === "sentence") && !frames && !imperative) type = "direct";
  if (type === "context" && imperative) type = "sentence";

  const base: ConjDrill = {
    type,
    verb: def.inf,
    tense: req.tense,
    person: null,
    subject: null,
    before: null,
    after: null,
    wrong: null,
    persons: null,
    showTense: type !== "context",
    translation: translationOf(def),
  };

  if (type === "table") {
    const table = persons.map((p) => acceptedForms(def, req.tense, p));
    return { drill: { ...base, persons }, key: { answers: [], table, alternatives: [] } };
  }

  let person = req.person ?? pick(persons, rand);
  let frame: Frame | undefined;
  if (type !== "direct" && frames && !imperative) {
    const usable = frames.filter((f) => !f.exclude?.includes(person));
    if (!usable.length) {
      const allowed = persons.filter((p) => frames.some((f) => !f.exclude?.includes(p)));
      person = pick(allowed, rand);
    }
    frame = pick(frames.filter((f) => !f.exclude?.includes(person)), rand);
  }
  const subject = imperative ? null : pick(SUBJECTS[person], rand);
  const accepted = acceptedForms(def, req.tense, person);
  const key: ConjKey = { answers: accepted, alternatives: alternativesFor(req.tense, type === "context") };

  if (type === "direct") {
    return { drill: { ...base, person, subject: subject ?? null }, key };
  }

  const complement = pick(def.ctx!, rand);
  let before: string;
  if (imperative) {
    before = req.tense === "imper_neg" ? "¡No" : "¡";
    key.answers = accepted.map((f) => f.replace(/^no /, ""));
  } else if (frame!.governor) {
    before = `${frame!.text} ${subject}${frame!.ya ? " ya" : ""}`;
  } else {
    before = `${frame!.text}, ${subject}${frame!.ya ? " ya" : ""}`;
  }
  const after = imperative ? `${complement}!` : `${complement}.`;

  if (type === "error") {
    const wrong = wrongForm(def, req.tense, person, rand, key.answers);
    if (!wrong) return { drill: { ...base, type: "direct", showTense: true, person, subject }, key };
    return {
      drill: { ...base, person, subject, before: capitalizeSentence(before), after, wrong },
      key,
    };
  }

  return { drill: { ...base, person, subject, before: capitalizeSentence(before), after }, key };
}

function capitalizeSentence(s: string): string {
  if (s.startsWith("¡")) return s;
  return capitalize(s);
}

/** A plausible incorrect form for error-correction drills (never an accepted answer). */
export function wrongForm(def: VerbDef, tense: Tense, person: Person, rand: () => number, accepted: string[]): string | null {
  const ok = new Set(accepted.map(normalizeConjAnswer));
  const candidates: string[] = [];
  const main = conjugate(def, tense)[person];
  if (!main) return null;
  const strip = (x: string) => x.replace(/^no /, "");
  const reg = conjugate(regularized(def), tense)[person];
  if (reg && reg !== main) candidates.push(strip(reg), strip(reg));
  if (def.stem) {
    const { stem: _s, ...flat } = def;
    void _s;
    const f = conjugate({ ...flat, compound: undefined }, tense)[person];
    if (f && f !== main) candidates.push(strip(f), strip(f));
  }
  const same = conjugate(def, tense);
  for (const p of PERSONS) if (p !== person && same[p]) candidates.push(strip(same[p]!));
  const noAccent = main.normalize("NFD").replace(/́/g, "").normalize("NFC");
  if (noAccent !== main) candidates.push(strip(noAccent), strip(noAccent));
  const filtered = candidates.filter((c) => !ok.has(normalizeConjAnswer(c)));
  if (!filtered.length) return null;
  return pick(filtered, rand);
}

export function chooseDrillType(mastery: number, tense: Tense, rand: () => number, allowTable: boolean): ConjDrillType {
  const contextOk = CONTEXT_TENSES.includes(tense);
  const r = rand();
  if (mastery < 0.3) return r < 0.6 ? "direct" : "sentence";
  if (mastery < 0.6) {
    if (r < 0.35) return "direct";
    if (r < 0.7) return "sentence";
    if (r < 0.85) return contextOk ? "context" : "sentence";
    return "error";
  }
  if (allowTable && r < 0.08) return "table";
  if (r < 0.28) return "direct";
  if (r < 0.52) return "sentence";
  if (r < 0.78) return contextOk ? "context" : "direct";
  return "error";
}

/** Verbs from `pool` ordered to avoid repeating the most recent ones. */
export function nextVerb(pool: string[], recent: string[], weak: string[], rand: () => number): string {
  const fresh = pool.filter((v) => !recent.slice(-3).includes(v));
  const weakFresh = fresh.filter((v) => weak.includes(v));
  if (weakFresh.length && rand() < 0.35) return pick(weakFresh, rand);
  return pick(fresh.length ? fresh : pool, rand);
}

export function verbsByLevel(pool: string[], maxLevel: number): string[] {
  const out = pool.filter((v) => (getVerbDef(v)?.level ?? 3) <= maxLevel);
  return out.length >= 4 ? out : pool;
}

export function shuffledPersons(rand: () => number): Person[] {
  return shuffle(PERSONS, rand);
}

export function reflexive(verb: string): boolean {
  const def = getVerbDef(verb);
  return !!def && shape(def).refl;
}
