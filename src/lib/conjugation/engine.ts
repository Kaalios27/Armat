/**
 * Deterministic conjugator for European Spanish (with vosotros).
 *
 * Forms are built in two layers:
 * 1. primitives(): the non-reflexive simple tenses, imperative bases,
 *    gerund and participle, derived from rules plus irregular overrides;
 * 2. conjugate(): assembles any tense (compound tenses, imperatives,
 *    progressive, reflexive pronouns) from the primitives.
 */
import { accentVowel, addAccentToLastWeak, attachClitics, prefixWord, stripAccents } from "../text";
import type { Paradigm, Person, Primitives, StemChange, Tense, VerbDef } from "./types";
import { getVerbDef } from "./verbs";

type Cls = "ar" | "er" | "ir";

const PRES: Record<Cls, string[]> = {
  ar: ["o", "as", "a", "amos", "áis", "an"],
  er: ["o", "es", "e", "emos", "éis", "en"],
  ir: ["o", "es", "e", "imos", "ís", "en"],
};
const PRET: Record<Cls, string[]> = {
  ar: ["é", "aste", "ó", "amos", "asteis", "aron"],
  er: ["í", "iste", "ió", "imos", "isteis", "ieron"],
  ir: ["í", "iste", "ió", "imos", "isteis", "ieron"],
};
const IMPF: Record<Cls, string[]> = {
  ar: ["aba", "abas", "aba", "ábamos", "abais", "aban"],
  er: ["ía", "ías", "ía", "íamos", "íais", "ían"],
  ir: ["ía", "ías", "ía", "íamos", "íais", "ían"],
};
const SUBJ: Record<Cls, string[]> = {
  ar: ["e", "es", "e", "emos", "éis", "en"],
  er: ["a", "as", "a", "amos", "áis", "an"],
  ir: ["a", "as", "a", "amos", "áis", "an"],
};
const FUT = ["é", "ás", "á", "emos", "éis", "án"];
const COND = ["ía", "ías", "ía", "íamos", "íais", "ían"];
const STRONG_PRET = ["e", "iste", "o", "imos", "isteis", "ieron"];
const BOOT = new Set<number>([0, 1, 2, 5]);

export const REFLEXIVE_PRONOUNS = ["me", "te", "se", "nos", "os", "se"] as const;
const ZC_EXCEPTIONS = new Set(["hacer", "decir", "cocer", "mecer", "satisfacer", "deshacer", "rehacer"]);

export interface VerbShape {
  def: VerbDef;
  refl: boolean;
  /** Infinitive without the reflexive "se". */
  core: string;
  cls: Cls;
  stem: string;
}

export function shape(def: VerbDef): VerbShape {
  const refl = /(ar|er|ir|ír)se$/.test(def.inf);
  const core = refl ? def.inf.slice(0, -2) : def.inf;
  const ending = core.slice(-2);
  const cls: Cls = ending === "ar" ? "ar" : ending === "er" ? "er" : "ir";
  return { def, refl, core, cls, stem: core.slice(0, -2) };
}

interface Ctx {
  cls: Cls;
  gerGir: boolean;
  guir: boolean;
  zc: boolean;
  cz: boolean;
  vowelStem: boolean;
  uir: boolean;
}

function context(s: VerbShape): Ctx {
  const c = s.core;
  return {
    cls: s.cls,
    gerGir: /g(er|ir)$/.test(c),
    guir: /guir$/.test(c),
    zc: /[aeiou]c(er|ir)$/.test(c) && !ZC_EXCEPTIONS.has(c),
    cz: /[^aeiou]cer$/.test(c),
    vowelStem: s.cls !== "ar" && /[aeo]$/.test(s.stem),
    uir: /uir$/.test(c) && !/(g|q)uir$/.test(c),
  };
}

function isVowelChar(ch: string | undefined): boolean {
  return !!ch && "aeiouáéíóú".includes(ch);
}

/** Join a stem and an ending, applying Spanish spelling rules. */
function join(stem: string, ending: string, ctx: Ctx): string {
  let s = stem;
  let e = ending;
  const first = stripAccents(e[0] ?? "");
  if (ctx.cls === "ar" && first === "e") {
    if (s.endsWith("gu")) s = s.slice(0, -2) + "gü";
    else if (s.endsWith("c")) s = s.slice(0, -1) + "qu";
    else if (s.endsWith("g")) s = s + "u";
    else if (s.endsWith("z")) s = s.slice(0, -1) + "c";
  }
  if (ctx.cls !== "ar" && (first === "a" || first === "o")) {
    if (ctx.guir && s.endsWith("gu")) s = s.slice(0, -2) + "g";
    else if (ctx.gerGir && s.endsWith("g")) s = s.slice(0, -1) + "j";
    else if (ctx.zc && s.endsWith("c")) s = s.slice(0, -1) + "zc";
    else if (ctx.cz && s.endsWith("c")) s = s.slice(0, -1) + "z";
  }
  if (ctx.cls !== "ar" && e[0] === "i") {
    if (ctx.vowelStem && /[aeo]$/.test(s)) {
      e = isVowelChar(e[1]) ? "y" + e.slice(1) : "í" + e.slice(1);
    } else if (ctx.uir && isVowelChar(e[1])) {
      e = "y" + e.slice(1);
    }
  }
  return s + e;
}

function replaceLast(stem: string, from: string, to: string): string {
  const i = stem.lastIndexOf(from);
  return i < 0 ? stem : stem.slice(0, i) + to + stem.slice(i + from.length);
}

export function bootStem(stem: string, change: StemChange): string {
  switch (change) {
    case "ie":
      return replaceLast(stem, "e", "ie");
    case "ue":
      return replaceLast(stem, "o", "ue");
    case "i":
      return replaceLast(stem, "e", "i");
    case "u_ue":
      return replaceLast(stem, "u", "ue");
  }
}

/** Weak stem change of -ir verbs (sintió, durmiendo, pidamos). */
export function weakStem(stem: string, change: StemChange): string {
  if (change === "ie" || change === "i") return replaceLast(stem, "e", "i");
  if (change === "ue") return replaceLast(stem, "o", "u");
  return stem;
}

const primitivesCache = new Map<string, Primitives>();

function cacheKey(def: VerbDef): string {
  return JSON.stringify(def);
}

export function primitives(def: VerbDef): Primitives {
  const key = cacheKey(def);
  const hit = primitivesCache.get(key);
  if (hit) return hit;
  const result = def.compound ? compoundPrimitives(def) : simplePrimitives(def);
  primitivesCache.set(key, result);
  return result;
}

function compoundPrimitives(def: VerbDef): Primitives {
  const base = getVerbDef(def.compound!.base);
  if (!base) throw new Error(`Unknown base verb ${def.compound!.base} for ${def.inf}`);
  const p = primitives({ ...base, inf: base.inf.replace(/se$/, ""), pp: base.pp });
  const pre = def.compound!.prefix;
  const map = (forms: string[]) => forms.map((f) => prefixWord(pre, f));
  return {
    pres: map(p.pres),
    pret: map(p.pret),
    impf: map(p.impf),
    fut: map(p.fut),
    cond: map(p.cond),
    presSubj: map(p.presSubj),
    impfSubjRa: map(p.impfSubjRa),
    impfSubjSe: map(p.impfSubjSe),
    imperTu: prefixWord(pre, p.imperTu),
    imperVos: prefixWord(pre, p.imperVos),
    ger: prefixWord(pre, p.ger),
    pp: def.pp ?? prefixWord(pre, p.pp),
  };
}

function simplePrimitives(def: VerbDef): Primitives {
  const s = shape(def);
  const ctx = context(s);
  const irr = def.irr ?? {};
  const { stem, cls } = s;

  // Present indicative
  const pres =
    irr.pres ??
    PRES[cls].map((end, p) => {
      if (p === 0 && irr.yo) return irr.yo;
      const boot = BOOT.has(p);
      let st = stem;
      if (def.stem && boot) st = bootStem(stem, def.stem);
      if (def.accent && boot) st = addAccentToLastWeak(st);
      if (ctx.uir && boot) st = st + "y";
      return join(st, end, ctx);
    });

  // Preterite
  let pret: string[];
  const strongStem = irr.pretStem ?? (/ducir$/.test(s.core) ? stem.slice(0, -1) + "j" : undefined);
  if (irr.pret) pret = irr.pret;
  else if (strongStem) {
    pret = STRONG_PRET.map((end, p) => {
      if (p === 2 && strongStem.endsWith("c")) return strongStem.slice(0, -1) + "zo";
      if (p === 5 && strongStem.endsWith("j")) return strongStem + "eron";
      return strongStem + end;
    });
  } else {
    pret = PRET[cls].map((end, p) => {
      let st = stem;
      if (cls === "ir" && def.stem && (p === 2 || p === 5)) st = weakStem(stem, def.stem);
      return join(st, end, ctx);
    });
  }

  const impf = irr.impf ?? IMPF[cls].map((end) => stem + end);
  const futStem = irr.futStem ?? stripAccents(s.core);
  const fut = FUT.map((end) => futStem + end);
  const cond = COND.map((end) => futStem + end);

  // Present subjunctive
  let presSubj: string[];
  if (irr.presSubj) presSubj = irr.presSubj;
  else {
    const yoStem = irr.presSubjStem ?? (irr.yo ? irr.yo.replace(/o$/, "") : irr.pres ? irr.pres[0]!.replace(/o$/, "") : null);
    presSubj = SUBJ[cls].map((end, p) => {
      if (yoStem) return join(yoStem, end, { ...ctx, zc: false, cz: false, gerGir: false, guir: false });
      const boot = BOOT.has(p);
      let st = stem;
      if (def.stem) {
        if (boot) st = bootStem(stem, def.stem);
        else if (cls === "ir") st = weakStem(stem, def.stem);
      }
      if (def.accent && boot) st = addAccentToLastWeak(st);
      if (ctx.uir) st = st + "y";
      return join(st, end, ctx);
    });
  }

  // Imperfect subjunctive from the third person plural preterite
  const base3p = pret[5]!.slice(0, -3);
  const accented = base3p.slice(0, -1) + accentVowel(base3p.slice(-1));
  const impfSubjRa = [base3p + "ra", base3p + "ras", base3p + "ra", accented + "ramos", base3p + "rais", base3p + "ran"];
  const impfSubjSe = [base3p + "se", base3p + "ses", base3p + "se", accented + "semos", base3p + "seis", base3p + "sen"];

  const imperTu = irr.imperTu ?? pres[2]!;
  const imperVos = irr.imperVos ?? s.core.slice(0, -1) + "d";

  let ger = irr.ger;
  if (!ger) {
    let st = stem;
    if (cls === "ir" && def.stem) st = weakStem(stem, def.stem);
    ger = join(st, cls === "ar" ? "ando" : "iendo", ctx);
  }
  const pp = def.pp ?? irr.pp ?? join(stem, cls === "ar" ? "ado" : "ido", ctx);

  return { pres, pret, impf, fut, cond, presSubj, impfSubjRa, impfSubjSe, imperTu, imperVos, ger, pp };
}

const HABER = {
  pres: ["he", "has", "ha", "hemos", "habéis", "han"],
  impf: ["había", "habías", "había", "habíamos", "habíais", "habían"],
  fut: ["habré", "habrás", "habrá", "habremos", "habréis", "habrán"],
  cond: ["habría", "habrías", "habría", "habríamos", "habríais", "habrían"],
  presSubj: ["haya", "hayas", "haya", "hayamos", "hayáis", "hayan"],
  impfSubjRa: ["hubiera", "hubieras", "hubiera", "hubiéramos", "hubierais", "hubieran"],
  impfSubjSe: ["hubiese", "hubieses", "hubiese", "hubiésemos", "hubieseis", "hubiesen"],
};
const ESTAR_PRES = ["estoy", "estás", "está", "estamos", "estáis", "están"];

function withPronoun(refl: boolean, p: number, form: string): string {
  return refl ? `${REFLEXIVE_PRONOUNS[p]} ${form}` : form;
}

/** Main form for each person in a tense (null where the tense has no form). */
export function conjugate(defOrInf: VerbDef | string, tense: Tense): Paradigm {
  const def = typeof defOrInf === "string" ? getVerbDef(defOrInf) : defOrInf;
  if (!def) throw new Error(`Unknown verb ${String(defOrInf)}`);
  const s = shape(def);
  const pr = primitives(def);
  const r = s.refl;
  const simple = (forms: string[]) => forms.map((f, p) => withPronoun(r, p, f));
  const compound = (aux: string[]) => aux.map((a, p) => withPronoun(r, p, `${a} ${pr.pp}`));

  switch (tense) {
    case "pres":
      return simple(pr.pres);
    case "pret":
      return simple(pr.pret);
    case "impf":
      return simple(pr.impf);
    case "fut":
      return simple(pr.fut);
    case "cond":
      return simple(pr.cond);
    case "pres_subj":
      return simple(pr.presSubj);
    case "impf_subj":
      return simple(pr.impfSubjRa);
    case "perf":
      return compound(HABER.pres);
    case "pluscuam":
      return compound(HABER.impf);
    case "fut_perf":
      return compound(HABER.fut);
    case "cond_perf":
      return compound(HABER.cond);
    case "perf_subj":
      return compound(HABER.presSubj);
    case "pluscuam_subj":
      return compound(HABER.impfSubjRa);
    case "pres_prog":
      return ESTAR_PRES.map((e, p) => withPronoun(r, p, `${e} ${pr.ger}`));
    case "imper_aff":
      return imperativeAffirmative(s, pr);
    case "imper_neg":
      return [null, 1, 2, 3, 4, 5].map((p) =>
        p === null ? null : `no ${r ? REFLEXIVE_PRONOUNS[p] + " " : ""}${pr.presSubj[p]}`,
      );
  }
}

function imperativeAffirmative(s: VerbShape, pr: Primitives): Paradigm {
  const irr = s.def.irr ?? {};
  const nos = s.core === "ir" ? "vamos" : pr.presSubj[3]!;
  if (!s.refl) return [null, pr.imperTu, pr.presSubj[2]!, nos, pr.imperVos, pr.presSubj[5]!];
  const vos =
    s.core === "ir"
      ? "idos"
      : s.cls === "ir"
        ? pr.imperVos.replace(/id$/, "íos")
        : attachClitics(pr.imperVos, "os", 1);
  void irr;
  return [
    null,
    attachClitics(pr.imperTu, "te"),
    attachClitics(pr.presSubj[2]!, "se"),
    attachClitics(nos, "nos", 1),
    vos,
    attachClitics(pr.presSubj[5]!, "se"),
  ];
}

/** Every form accepted as correct for one slot (main form first). */
export function acceptedForms(defOrInf: VerbDef | string, tense: Tense, person: Person): string[] {
  const def = typeof defOrInf === "string" ? getVerbDef(defOrInf) : defOrInf;
  if (!def) return [];
  const main = conjugate(def, tense)[person];
  if (!main) return [];
  const out = [main];
  const s = shape(def);
  const pr = primitives(def);
  const pron = s.refl ? `${REFLEXIVE_PRONOUNS[person]} ` : "";
  if (tense === "impf_subj") out.push(`${pron}${pr.impfSubjSe[person]}`);
  if (tense === "pluscuam_subj") out.push(`${pron}${HABER.impfSubjSe[person]} ${pr.pp}`);
  if (tense === "imper_neg") out.push(main.replace(/^no /, ""));
  if (tense === "imper_aff" && person === 3 && s.core === "ir" && !s.refl) out.push("vayamos");
  if (tense === "pres_prog" && s.refl) out.push(`${ESTAR_PRES[person]} ${attachClitics(pr.ger, REFLEXIVE_PRONOUNS[person]!)}`);
  return Array.from(new Set(out));
}

export function gerund(defOrInf: VerbDef | string): string {
  const def = typeof defOrInf === "string" ? getVerbDef(defOrInf)! : defOrInf;
  return primitives(def).ger;
}

export function participle(defOrInf: VerbDef | string): string {
  const def = typeof defOrInf === "string" ? getVerbDef(defOrInf)! : defOrInf;
  return primitives(def).pp;
}

export function hasImperative(def: VerbDef): boolean {
  return !def.irr?.noImperative;
}

/** Every finite form of the verb, used to recognise inflections of a lemma. */
export function allForms(defOrInf: VerbDef | string): Set<string> {
  const def = typeof defOrInf === "string" ? getVerbDef(defOrInf) : defOrInf;
  const out = new Set<string>();
  if (!def) return out;
  const pr = primitives(def);
  for (const list of [pr.pres, pr.pret, pr.impf, pr.fut, pr.cond, pr.presSubj, pr.impfSubjRa, pr.impfSubjSe]) {
    for (const f of list) out.add(f);
  }
  out.add(pr.ger);
  out.add(pr.pp);
  out.add(pr.imperTu);
  out.add(pr.imperVos);
  out.add(shape(def).core);
  return out;
}
