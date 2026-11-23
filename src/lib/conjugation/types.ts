export type Person = 0 | 1 | 2 | 3 | 4 | 5;
export const PERSONS: readonly Person[] = [0, 1, 2, 3, 4, 5];

export type Tense =
  | "pres"
  | "pret"
  | "impf"
  | "fut"
  | "cond"
  | "pres_subj"
  | "impf_subj"
  | "imper_aff"
  | "imper_neg"
  | "perf"
  | "pluscuam"
  | "fut_perf"
  | "cond_perf"
  | "perf_subj"
  | "pluscuam_subj"
  | "pres_prog";

export const TENSES: readonly Tense[] = [
  "pres",
  "pres_prog",
  "perf",
  "pret",
  "impf",
  "fut",
  "cond",
  "imper_aff",
  "imper_neg",
  "pres_subj",
  "pluscuam",
  "fut_perf",
  "cond_perf",
  "impf_subj",
  "perf_subj",
  "pluscuam_subj",
];

export const IMPERATIVE_TENSES: readonly Tense[] = ["imper_aff", "imper_neg"];

/** e→ie, o→ue, e→i, u→ue (jugar). -ir verbs also take the weak change (e→i, o→u). */
export type StemChange = "ie" | "ue" | "i" | "u_ue";

export interface IrregularSpec {
  /** Full present indicative. */
  pres?: string[];
  /** Irregular first person singular of the present (tengo, hago, salgo). */
  yo?: string;
  /** Full preterite. */
  pret?: string[];
  /** Strong preterite stem (tuv-, pud-, dij-) with unstressed endings. */
  pretStem?: string;
  impf?: string[];
  futStem?: string;
  presSubj?: string[];
  presSubjStem?: string;
  imperTu?: string;
  imperVos?: string;
  /** Alternative accepted imperative nosotros form (ir: vamos / vayamos). */
  imperNos?: string;
  ger?: string;
  pp?: string;
  /** Verb is not drilled in the imperative (haber, poder). */
  noImperative?: boolean;
}

export interface VerbDef {
  inf: string;
  en: string;
  fr: string;
  /** 1 = core, 2 = common, 3 = less frequent. */
  level: 1 | 2 | 3;
  stem?: StemChange;
  /** -iar / -uar verbs with a written accent in the stressed stem (envío, continúo). */
  accent?: boolean;
  pp?: string;
  irr?: IrregularSpec;
  /** Compound of another verb: mantener = man + tener. */
  compound?: { base: string; prefix: string };
  /** Complements used to build sentence frames. Must agree with any subject. */
  ctx?: string[];
}

/** A paradigm has six slots; imperative "yo" is null. */
export type Paradigm = Array<string | null>;

export interface Primitives {
  pres: string[];
  pret: string[];
  impf: string[];
  fut: string[];
  cond: string[];
  presSubj: string[];
  impfSubjRa: string[];
  impfSubjSe: string[];
  imperTu: string;
  imperVos: string;
  ger: string;
  pp: string;
}
