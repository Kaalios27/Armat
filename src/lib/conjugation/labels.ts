import type { Lang } from "../i18n/types";
import type { Person, Tense } from "./types";

export const TENSE_NAME_ES: Record<Tense, string> = {
  pres: "Presente",
  pres_prog: "Estar + gerundio",
  perf: "Pretérito perfecto",
  pret: "Pretérito indefinido",
  impf: "Pretérito imperfecto",
  fut: "Futuro simple",
  cond: "Condicional simple",
  imper_aff: "Imperativo afirmativo",
  imper_neg: "Imperativo negativo",
  pres_subj: "Presente de subjuntivo",
  pluscuam: "Pretérito pluscuamperfecto",
  fut_perf: "Futuro compuesto",
  cond_perf: "Condicional compuesto",
  impf_subj: "Imperfecto de subjuntivo",
  perf_subj: "Pretérito perfecto de subjuntivo",
  pluscuam_subj: "Pluscuamperfecto de subjuntivo",
};

const TENSE_GLOSS: Record<Lang, Record<Tense, string>> = {
  en: {
    pres: "present",
    pres_prog: "present progressive",
    perf: "present perfect",
    pret: "preterite (simple past)",
    impf: "imperfect",
    fut: "future",
    cond: "conditional",
    imper_aff: "affirmative imperative",
    imper_neg: "negative imperative",
    pres_subj: "present subjunctive",
    pluscuam: "past perfect",
    fut_perf: "future perfect",
    cond_perf: "conditional perfect",
    impf_subj: "imperfect subjunctive",
    perf_subj: "perfect subjunctive",
    pluscuam_subj: "pluperfect subjunctive",
  },
  fr: {
    pres: "présent",
    pres_prog: "présent progressif",
    perf: "passé composé",
    pret: "passé simple (indefinido)",
    impf: "imparfait",
    fut: "futur simple",
    cond: "conditionnel présent",
    imper_aff: "impératif affirmatif",
    imper_neg: "impératif négatif",
    pres_subj: "subjonctif présent",
    pluscuam: "plus-que-parfait",
    fut_perf: "futur antérieur",
    cond_perf: "conditionnel passé",
    impf_subj: "subjonctif imparfait",
    perf_subj: "subjonctif passé",
    pluscuam_subj: "subjonctif plus-que-parfait",
  },
};

export function tenseName(tense: Tense): string {
  return TENSE_NAME_ES[tense];
}

export function tenseGloss(tense: Tense, lang: Lang): string {
  return TENSE_GLOSS[lang][tense];
}

export const PERSON_LABEL: Record<Person, string> = {
  0: "yo",
  1: "tú",
  2: "él / ella / usted",
  3: "nosotros",
  4: "vosotros",
  5: "ellos / ellas / ustedes",
};

export const IMPERATIVE_PERSON_LABEL: Record<Person, string> = {
  0: "",
  1: "tú",
  2: "usted",
  3: "nosotros",
  4: "vosotros",
  5: "ustedes",
};

export function personLabel(person: Person, tense?: Tense): string {
  if (tense === "imper_aff" || tense === "imper_neg") return IMPERATIVE_PERSON_LABEL[person];
  return PERSON_LABEL[person];
}
