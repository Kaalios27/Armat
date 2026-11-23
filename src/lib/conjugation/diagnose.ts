/**
 * Deterministic grading of conjugation answers with error classification:
 * wrong person, wrong tense, incorrect ending, irregular-verb error, missing
 * accent, incorrect stem change, missing reflexive pronoun.
 */
import type { Lang, Localized } from "../i18n/types";
import { basicNormalize, collapseSpaces, stripAccents } from "../text";
import { acceptedForms, conjugate, primitives, REFLEXIVE_PRONOUNS, shape } from "./engine";
import { personLabel, tenseGloss, tenseName } from "./labels";
import { PERSONS, TENSES, type Person, type Tense, type VerbDef } from "./types";
import { getVerbDef } from "./verbs";

export type ConjErrorCategory =
  | "wrong_person"
  | "wrong_tense"
  | "ending"
  | "irregular"
  | "accent"
  | "stem_change"
  | "pronoun"
  | "other";

export interface ConjGrade {
  correct: boolean;
  /** Accepted but worth a remark (accent-free answers are never accepted). */
  note?: Localized;
  category: ConjErrorCategory | null;
  expected: string;
  accepted: string[];
  explanation: Localized | null;
  detected?: { tense?: Tense; person?: Person };
}

export interface AlternativeTense {
  tense: Tense;
  note: Localized;
}

export function normalizeConjAnswer(answer: string): string {
  return collapseSpaces(basicNormalize(answer).replace(/[¡!¿?.,;:]/g, " "));
}

/** Variant with all irregularities removed (what a learner produces by over-regularising). */
export function regularized(def: VerbDef): VerbDef {
  return { inf: def.inf, en: def.en, fr: def.fr, level: def.level };
}

function withoutStemChange(def: VerbDef): VerbDef {
  const { stem: _stem, ...rest } = def;
  void _stem;
  return { ...rest, compound: undefined };
}

function formsOf(def: VerbDef, tense: Tense): Array<string | null> {
  try {
    return conjugate(def, tense);
  } catch {
    return [];
  }
}

function isIrregularIn(def: VerbDef, tense: Tense, person: Person): boolean {
  const main = formsOf(def, tense)[person];
  const reg = formsOf(regularized(def), tense)[person];
  return !!main && !!reg && main !== reg && !def.stem;
}

export function gradeConjugation(
  defOrInf: VerbDef | string,
  tense: Tense,
  person: Person,
  answer: string,
  alternatives: AlternativeTense[] = [],
): ConjGrade {
  const def = typeof defOrInf === "string" ? getVerbDef(defOrInf) : defOrInf;
  if (!def) throw new Error(`Unknown verb ${String(defOrInf)}`);
  const accepted = acceptedForms(def, tense, person);
  const expected = accepted[0] ?? "";
  const a = normalizeConjAnswer(answer);
  const result = (category: ConjErrorCategory | null, explanation: Localized | null, detected?: ConjGrade["detected"]): ConjGrade => ({
    correct: category === null,
    category,
    expected,
    accepted,
    explanation,
    detected,
  });

  if (!a) return result("other", explain("empty", def, tense, person, expected, a));
  if (accepted.some((f) => f === a)) return result(null, null);

  for (const alt of alternatives) {
    const altForms = alternativeForms(def, alt.tense, person);
    if (altForms.includes(a)) return { ...result(null, null), note: alt.note };
  }

  if (accepted.some((f) => stripAccents(f) === stripAccents(a))) {
    return result("accent", explain("accent", def, tense, person, expected, a));
  }

  const s = shape(def);
  if (s.refl && accepted.some((f) => f.replace(/^(no )?(me|te|se|nos|os) /, "$1") === a)) {
    return result("pronoun", explain("pronoun", def, tense, person, expected, a));
  }

  const same = formsOf(def, tense);
  for (const p of PERSONS) {
    if (p !== person && same[p] && normalizeConjAnswer(same[p]!) === a) {
      return result("wrong_person", explain("wrong_person", def, tense, person, expected, a, { person: p }), { person: p });
    }
  }

  for (const t of TENSES) {
    if (t === tense) continue;
    const forms = formsOf(def, t);
    for (const f of forms) {
      if (f && (f === a || f.replace(/^no /, "") === a)) {
        return result("wrong_tense", explain("wrong_tense", def, tense, person, expected, a, { tense: t }), { tense: t });
      }
    }
  }

  if (def.stem) {
    const flat = formsOf(withoutStemChange(def), tense)[person];
    if (flat && flat === a) return result("stem_change", explain("stem_missing", def, tense, person, expected, a));
    // Over-application: the stem change carried into nosotros/vosotros.
    if ((tense === "pres" || tense === "pres_subj") && (person === 3 || person === 4)) {
      const lastWord = (x: string) => x.split(" ").pop() ?? x;
      const boot = formsOf(def, tense)[2];
      const stemBoot = boot ? lastWord(boot).replace(/(a|e)$/, "") : "";
      if (stemBoot && lastWord(a).startsWith(stemBoot) && !lastWord(expected).startsWith(stemBoot)) {
        return result("stem_change", explain("stem_extra", def, tense, person, expected, a));
      }
    }
  }

  const regular = formsOf(regularized(def), tense)[person];
  if (regular && regular === a && regular !== expected) {
    return result("irregular", explain("irregular", def, tense, person, expected, a));
  }

  if (sharesStem(a, expected)) return result("ending", explain("ending", def, tense, person, expected, a));
  if (isIrregularIn(def, tense, person)) return result("irregular", explain("irregular", def, tense, person, expected, a));
  return result("other", explain("other", def, tense, person, expected, a));
}

function alternativeForms(def: VerbDef, tense: Tense, person: Person): string[] {
  if (tense === "fut") {
    // Periphrastic future (ir a + infinitive) is accepted where a future marker appears.
    const s = shape(def);
    const ir = ["voy", "vas", "va", "vamos", "vais", "van"][person]!;
    const pron = REFLEXIVE_PRONOUNS[person]!;
    const out = acceptedForms(def, "fut", person);
    out.push(s.refl ? `${pron} ${ir} a ${s.core}` : `${ir} a ${s.core}`);
    if (s.refl) out.push(`${ir} a ${s.core}${pron}`);
    return out;
  }
  return acceptedForms(def, tense, person);
}

function sharesStem(a: string, expected: string): boolean {
  const e = expected.split(" ").pop() ?? expected;
  const w = a.split(" ").pop() ?? a;
  let i = 0;
  while (i < Math.min(e.length, w.length) && e[i] === w[i]) i++;
  return i >= Math.max(2, e.length - 4) && w.length >= 2;
}

type Kind =
  | "empty"
  | "accent"
  | "pronoun"
  | "wrong_person"
  | "wrong_tense"
  | "stem_missing"
  | "stem_extra"
  | "irregular"
  | "ending"
  | "other";

const STEM_LABEL: Record<string, string> = { ie: "e → ie", ue: "o → ue", i: "e → i", u_ue: "u → ue" };

function irregularHint(def: VerbDef, tense: Tense, lang: Lang): string {
  const irr = def.irr ?? {};
  const pr = primitives(def);
  const en = lang === "en";
  if ((tense === "pret" || tense === "impf_subj") && (irr.pretStem || /ducir$/.test(def.inf))) {
    const stem = pr.pret[0]!.replace(/e$/, "");
    return en
      ? ` Strong preterite: stem ${stem}- with unstressed endings (-e, -iste, -o, -imos, -isteis, -ieron).`
      : ` Prétérit fort : radical ${stem}- et terminaisons non accentuées (-e, -iste, -o, -imos, -isteis, -ieron).`;
  }
  if ((tense === "fut" || tense === "cond" || tense === "fut_perf" || tense === "cond_perf") && irr.futStem) {
    return en ? ` Irregular stem: ${irr.futStem}-.` : ` Radical irrégulier : ${irr.futStem}-.`;
  }
  if (["perf", "pluscuam", "fut_perf", "cond_perf", "perf_subj", "pluscuam_subj"].includes(tense) && (def.pp || irr.pp)) {
    return en ? ` Irregular participle: ${pr.pp}.` : ` Participe irrégulier : ${pr.pp}.`;
  }
  if ((tense === "pres" || tense === "pres_subj") && irr.yo) {
    return en
      ? ` Irregular yo form ${irr.yo}; the present subjunctive is built on it.`
      : ` Forme irrégulière à la 1re personne (${irr.yo}) ; le subjonctif présent se construit sur elle.`;
  }
  if (tense === "imper_aff" && irr.imperTu) {
    return en ? ` Irregular tú imperative: ${irr.imperTu}.` : ` Impératif irrégulier à tú : ${irr.imperTu}.`;
  }
  return "";
}

function explain(
  kind: Kind,
  def: VerbDef,
  tense: Tense,
  person: Person,
  expected: string,
  answer: string,
  detected?: { tense?: Tense; person?: Person },
): Localized {
  const t = tenseName(tense);
  const subj = personLabel(person, tense);
  const verb = def.inf;
  const build = (lang: Lang): string => {
    const en = lang === "en";
    switch (kind) {
      case "empty":
        return en ? `Answer: ${expected}.` : `Réponse : ${expected}.`;
      case "accent":
        return en
          ? `Accent: ${expected}. The written accent marks the stressed syllable and is part of the spelling.`
          : `Accent : ${expected}. L'accent écrit marque la syllabe tonique et fait partie de l'orthographe.`;
      case "pronoun":
        return en
          ? `${verb} is reflexive: the pronoun is required (${expected}).`
          : `${verb} est pronominal : le pronom est obligatoire (${expected}).`;
      case "wrong_person": {
        const p = detected?.person ?? person;
        return en
          ? `${answer} is the ${personLabel(p, tense)} form. For ${subj}: ${expected}.`
          : `${answer} correspond à ${personLabel(p, tense)}. Pour ${subj} : ${expected}.`;
      }
      case "wrong_tense": {
        const dt = detected?.tense ?? tense;
        return en
          ? `${answer} is ${tenseName(dt)} (${tenseGloss(dt, "en")}). Required: ${t}, ${expected}.`
          : `${answer} est au ${tenseName(dt)} (${tenseGloss(dt, "fr")}). Il faut le ${t} : ${expected}.`;
      }
      case "stem_missing": {
        const weak = def.inf.match(/ir(se)?$/) && ["pret", "impf_subj", "pluscuam_subj"].includes(tense);
        if (weak) {
          return en
            ? `-ir stem-changing verbs change e → i / o → u in this form: ${expected}.`
            : `Les verbes en -ir à diphtongue changent e → i / o → u dans cette forme : ${expected}.`;
        }
        const ch = STEM_LABEL[def.stem ?? ""] ?? "";
        return en
          ? `${verb} changes its stem (${ch}) when the stem is stressed: ${expected}.`
          : `${verb} change de radical (${ch}) quand le radical est accentué : ${expected}.`;
      }
      case "stem_extra":
        return en
          ? `No stem change in the nosotros and vosotros forms (the stress falls on the ending): ${expected}.`
          : `Pas de changement de radical à nosotros et vosotros (l'accent tombe sur la terminaison) : ${expected}.`;
      case "irregular":
        return (en ? `${verb} is irregular here: ${expected}, not ${answer}.` : `${verb} est irrégulier ici : ${expected}, et non ${answer}.`) +
          irregularHint(def, tense, lang);
      case "ending":
        return en
          ? `Ending: ${t} for ${subj} is ${expected}.`
          : `Terminaison : au ${t}, pour ${subj}, la forme est ${expected}.`;
      case "other":
        return (en ? `Correct form: ${expected}.` : `Forme correcte : ${expected}.`) + irregularHint(def, tense, lang);
    }
  };
  return { en: build("en"), fr: build("fr") };
}
