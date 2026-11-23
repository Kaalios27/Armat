import { describe, expect, it } from "vitest";
import { acceptedForms, conjugate, gerund, participle } from "@/lib/conjugation/engine";
import { gradeConjugation } from "@/lib/conjugation/diagnose";
import { buildDrill, wrongForm } from "@/lib/conjugation/drills";
import { conjugableVerbs, getVerbDef } from "@/lib/conjugation/verbs";
import { TENSES, type Tense } from "@/lib/conjugation/types";
import { attachClitics, seededRandom } from "@/lib/text";

const c = (verb: string, tense: Tense) => conjugate(verb, tense);

describe("present indicative", () => {
  it("conjugates regular verbs with vosotros", () => {
    expect(c("hablar", "pres")).toEqual(["hablo", "hablas", "habla", "hablamos", "habláis", "hablan"]);
    expect(c("comer", "pres")).toEqual(["como", "comes", "come", "comemos", "coméis", "comen"]);
    expect(c("vivir", "pres")).toEqual(["vivo", "vives", "vive", "vivimos", "vivís", "viven"]);
  });
  it("handles irregular verbs", () => {
    expect(c("ser", "pres")).toEqual(["soy", "eres", "es", "somos", "sois", "son"]);
    expect(c("tener", "pres")).toEqual(["tengo", "tienes", "tiene", "tenemos", "tenéis", "tienen"]);
    expect(c("decir", "pres")).toEqual(["digo", "dices", "dice", "decimos", "decís", "dicen"]);
    expect(c("venir", "pres")).toEqual(["vengo", "vienes", "viene", "venimos", "venís", "vienen"]);
    expect(c("oír", "pres")).toEqual(["oigo", "oyes", "oye", "oímos", "oís", "oyen"]);
    expect(c("saber", "pres")[0]).toBe("sé");
    expect(c("dar", "pres")).toEqual(["doy", "das", "da", "damos", "dais", "dan"]);
  });
  it("applies stem changes only to stressed stems", () => {
    expect(c("pensar", "pres")).toEqual(["pienso", "piensas", "piensa", "pensamos", "pensáis", "piensan"]);
    expect(c("volver", "pres")).toEqual(["vuelvo", "vuelves", "vuelve", "volvemos", "volvéis", "vuelven"]);
    expect(c("pedir", "pres")).toEqual(["pido", "pides", "pide", "pedimos", "pedís", "piden"]);
    expect(c("jugar", "pres")).toEqual(["juego", "juegas", "juega", "jugamos", "jugáis", "juegan"]);
    expect(c("empezar", "pres")[0]).toBe("empiezo");
  });
  it("applies spelling changes", () => {
    expect(c("conocer", "pres")[0]).toBe("conozco");
    expect(c("conducir", "pres")[0]).toBe("conduzco");
    expect(c("coger", "pres")[0]).toBe("cojo");
    expect(c("elegir", "pres")).toEqual(["elijo", "eliges", "elige", "elegimos", "elegís", "eligen"]);
    expect(c("seguir", "pres")).toEqual(["sigo", "sigues", "sigue", "seguimos", "seguís", "siguen"]);
    expect(c("vencer", "pres")[0]).toBe("venzo");
    expect(c("construir", "pres")).toEqual(["construyo", "construyes", "construye", "construimos", "construís", "construyen"]);
    expect(c("enviar", "pres")).toEqual(["envío", "envías", "envía", "enviamos", "enviáis", "envían"]);
    expect(c("continuar", "pres")[0]).toBe("continúo");
  });
  it("adds reflexive pronouns", () => {
    expect(c("levantarse", "pres")).toEqual(["me levanto", "te levantas", "se levanta", "nos levantamos", "os levantáis", "se levantan"]);
    expect(c("vestirse", "pres")[0]).toBe("me visto");
  });
  it("conjugates compounds with accents", () => {
    expect(c("mantener", "pres")).toEqual(["mantengo", "mantienes", "mantiene", "mantenemos", "mantenéis", "mantienen"]);
    expect(c("proponer", "pres")[0]).toBe("propongo");
  });
});

describe("preterite", () => {
  it("regular with spelling changes", () => {
    expect(c("hablar", "pret")).toEqual(["hablé", "hablaste", "habló", "hablamos", "hablasteis", "hablaron"]);
    expect(c("buscar", "pret")[0]).toBe("busqué");
    expect(c("llegar", "pret")[0]).toBe("llegué");
    expect(c("empezar", "pret")[0]).toBe("empecé");
    expect(c("jugar", "pret")[0]).toBe("jugué");
  });
  it("vowel stems", () => {
    expect(c("leer", "pret")).toEqual(["leí", "leíste", "leyó", "leímos", "leísteis", "leyeron"]);
    expect(c("oír", "pret")).toEqual(["oí", "oíste", "oyó", "oímos", "oísteis", "oyeron"]);
    expect(c("caer", "pret")[2]).toBe("cayó");
    expect(c("construir", "pret")).toEqual(["construí", "construiste", "construyó", "construimos", "construisteis", "construyeron"]);
  });
  it("strong and irregular preterites", () => {
    expect(c("tener", "pret")).toEqual(["tuve", "tuviste", "tuvo", "tuvimos", "tuvisteis", "tuvieron"]);
    expect(c("hacer", "pret")).toEqual(["hice", "hiciste", "hizo", "hicimos", "hicisteis", "hicieron"]);
    expect(c("decir", "pret")).toEqual(["dije", "dijiste", "dijo", "dijimos", "dijisteis", "dijeron"]);
    expect(c("traer", "pret")[5]).toBe("trajeron");
    expect(c("conducir", "pret")).toEqual(["conduje", "condujiste", "condujo", "condujimos", "condujisteis", "condujeron"]);
    expect(c("ir", "pret")).toEqual(["fui", "fuiste", "fue", "fuimos", "fuisteis", "fueron"]);
    expect(c("dar", "pret")[2]).toBe("dio");
    expect(c("ver", "pret")[0]).toBe("vi");
    expect(c("estar", "pret")[0]).toBe("estuve");
    expect(c("mantener", "pret")[0]).toBe("mantuve");
  });
  it("-ir stem changers in third persons", () => {
    expect(c("pedir", "pret")).toEqual(["pedí", "pediste", "pidió", "pedimos", "pedisteis", "pidieron"]);
    expect(c("dormir", "pret")[5]).toBe("durmieron");
    expect(c("sentir", "pret")[2]).toBe("sintió");
    expect(c("seguir", "pret")[2]).toBe("siguió");
    expect(c("divertirse", "pret")[2]).toBe("se divirtió");
  });
});

describe("other simple tenses", () => {
  it("imperfect", () => {
    expect(c("hablar", "impf")[3]).toBe("hablábamos");
    expect(c("ser", "impf")).toEqual(["era", "eras", "era", "éramos", "erais", "eran"]);
    expect(c("ir", "impf")[0]).toBe("iba");
    expect(c("ver", "impf")[0]).toBe("veía");
  });
  it("future and conditional", () => {
    expect(c("hablar", "fut")).toEqual(["hablaré", "hablarás", "hablará", "hablaremos", "hablaréis", "hablarán"]);
    expect(c("tener", "fut")[0]).toBe("tendré");
    expect(c("decir", "cond")[3]).toBe("diríamos");
    expect(c("oír", "fut")[0]).toBe("oiré");
    expect(c("mantener", "fut")[0]).toBe("mantendré");
  });
  it("present subjunctive", () => {
    expect(c("hablar", "pres_subj")).toEqual(["hable", "hables", "hable", "hablemos", "habléis", "hablen"]);
    expect(c("tener", "pres_subj")[3]).toBe("tengamos");
    expect(c("buscar", "pres_subj")[0]).toBe("busque");
    expect(c("empezar", "pres_subj")).toEqual(["empiece", "empieces", "empiece", "empecemos", "empecéis", "empiecen"]);
    expect(c("sentir", "pres_subj")[3]).toBe("sintamos");
    expect(c("dormir", "pres_subj")[3]).toBe("durmamos");
    expect(c("pedir", "pres_subj")[3]).toBe("pidamos");
    expect(c("conocer", "pres_subj")[0]).toBe("conozca");
    expect(c("elegir", "pres_subj")[3]).toBe("elijamos");
    expect(c("seguir", "pres_subj")[0]).toBe("siga");
    expect(c("saber", "pres_subj")[0]).toBe("sepa");
    expect(c("ir", "pres_subj")[0]).toBe("vaya");
    expect(c("ver", "pres_subj")[0]).toBe("vea");
    expect(c("enviar", "pres_subj")[0]).toBe("envíe");
    expect(c("construir", "pres_subj")[3]).toBe("construyamos");
  });
  it("imperfect subjunctive with -se alternative", () => {
    expect(c("tener", "impf_subj")).toEqual(["tuviera", "tuvieras", "tuviera", "tuviéramos", "tuvierais", "tuvieran"]);
    expect(c("ser", "impf_subj")[3]).toBe("fuéramos");
    expect(acceptedForms("hablar", "impf_subj", 3)).toEqual(["habláramos", "hablásemos"]);
    expect(c("leer", "impf_subj")[0]).toBe("leyera");
  });
});

describe("compound tenses, non-finite forms, progressive", () => {
  it("participles and gerunds", () => {
    expect(participle("hacer")).toBe("hecho");
    expect(participle("leer")).toBe("leído");
    expect(participle("construir")).toBe("construido");
    expect(participle("proponer")).toBe("propuesto");
    expect(participle("resolver")).toBe("resuelto");
    expect(gerund("dormir")).toBe("durmiendo");
    expect(gerund("leer")).toBe("leyendo");
    expect(gerund("ir")).toBe("yendo");
    expect(gerund("decir")).toBe("diciendo");
    expect(gerund("seguir")).toBe("siguiendo");
    expect(gerund("oír")).toBe("oyendo");
  });
  it("compound tenses", () => {
    expect(c("volver", "perf")[0]).toBe("he vuelto");
    expect(c("decir", "pluscuam")[3]).toBe("habíamos dicho");
    expect(c("levantarse", "perf")[2]).toBe("se ha levantado");
    expect(acceptedForms("ver", "pluscuam_subj", 0)).toEqual(["hubiera visto", "hubiese visto"]);
  });
  it("progressive with clitic alternative", () => {
    expect(c("leer", "pres_prog")[0]).toBe("estoy leyendo");
    expect(acceptedForms("ducharse", "pres_prog", 0)).toEqual(["me estoy duchando", "estoy duchándome"]);
  });
});

describe("imperative", () => {
  it("affirmative", () => {
    expect(c("hablar", "imper_aff")).toEqual([null, "habla", "hable", "hablemos", "hablad", "hablen"]);
    expect(c("tener", "imper_aff")[1]).toBe("ten");
    expect(c("hacer", "imper_aff")[1]).toBe("haz");
    expect(c("decir", "imper_aff")[1]).toBe("di");
    expect(c("ir", "imper_aff")).toEqual([null, "ve", "vaya", "vamos", "id", "vayan"]);
    expect(c("ser", "imper_aff")[1]).toBe("sé");
    expect(c("mantener", "imper_aff")[1]).toBe("mantén");
    expect(c("proponer", "imper_aff")[1]).toBe("propón");
    expect(c("oír", "imper_aff")[4]).toBe("oíd");
  });
  it("reflexive affirmative with accents", () => {
    expect(c("levantarse", "imper_aff")).toEqual([null, "levántate", "levántese", "levantémonos", "levantaos", "levántense"]);
    expect(c("sentarse", "imper_aff")).toEqual([null, "siéntate", "siéntese", "sentémonos", "sentaos", "siéntense"]);
    expect(c("vestirse", "imper_aff")).toEqual([null, "vístete", "vístase", "vistámonos", "vestíos", "vístanse"]);
    expect(c("irse", "imper_aff")).toEqual([null, "vete", "váyase", "vámonos", "idos", "váyanse"]);
    expect(c("ponerse", "imper_aff")[1]).toBe("ponte");
    expect(c("ponerse", "imper_aff")[4]).toBe("poneos");
    expect(c("acordarse", "imper_aff")[1]).toBe("acuérdate");
    expect(c("preocuparse", "imper_aff")[1]).toBe("preocúpate");
    expect(c("divertirse", "imper_aff")[4]).toBe("divertíos");
  });
  it("negative", () => {
    expect(c("hablar", "imper_neg")).toEqual([null, "no hables", "no hable", "no hablemos", "no habléis", "no hablen"]);
    expect(c("levantarse", "imper_neg")[1]).toBe("no te levantes");
    expect(acceptedForms("hacer", "imper_neg", 1)).toEqual(["no hagas", "hagas"]);
  });
  it("attaches clitics with correct stress", () => {
    expect(attachClitics("di", "melo")).toBe("dímelo");
    expect(attachClitics("haz", "lo")).toBe("hazlo");
    expect(attachClitics("da", "me")).toBe("dame");
    expect(attachClitics("cuenta", "selo")).toBe("cuéntaselo");
  });
});

describe("every verb conjugates in every tense", () => {
  it("produces non-empty forms without throwing", () => {
    for (const def of conjugableVerbs()) {
      for (const t of TENSES) {
        const forms = conjugate(def, t);
        expect(forms.length).toBe(6);
        for (const f of forms.slice(1)) {
          if (t.startsWith("imper") && def.irr?.noImperative) continue;
          expect(f, `${def.inf} ${t}`).toBeTruthy();
          expect(f, `${def.inf} ${t}`).not.toMatch(/undefined|null/);
        }
      }
    }
  });
});

describe("diagnosis", () => {
  it("accepts correct answers regardless of case and punctuation", () => {
    expect(gradeConjugation("tener", "pres", 3, " Tenemos. ").correct).toBe(true);
  });
  it("classifies missing accents", () => {
    const g = gradeConjugation("hablar", "pret", 2, "hablo");
    // "hablo" is a real present form, so the closer explanation is the accent.
    expect(g.category).toBe("accent");
    expect(gradeConjugation("tener", "fut", 1, "tendras").category).toBe("accent");
  });
  it("classifies wrong person and wrong tense", () => {
    expect(gradeConjugation("tener", "pres", 3, "tienen").category).toBe("wrong_person");
    const g = gradeConjugation("tener", "pret", 0, "tenía");
    expect(g.category).toBe("wrong_tense");
    expect(g.detected?.tense).toBe("impf");
  });
  it("classifies irregular and stem-change errors", () => {
    expect(gradeConjugation("tener", "pres", 0, "teno").category).toBe("irregular");
    expect(gradeConjugation("tener", "pret", 0, "tení").category).toBe("irregular");
    expect(gradeConjugation("pensar", "pres", 0, "penso").category).toBe("stem_change");
    expect(gradeConjugation("pensar", "pres", 3, "piensamos").category).toBe("stem_change");
    expect(gradeConjugation("dormir", "pret", 2, "dormió").category).toBe("stem_change");
  });
  it("classifies ending errors and missing pronouns", () => {
    expect(gradeConjugation("hablar", "impf", 3, "hablabamos").category).toBe("accent");
    expect(gradeConjugation("comer", "impf", 0, "comaba").category).toBe("ending");
    expect(gradeConjugation("levantarse", "pres", 0, "levanto").category).toBe("pronoun");
  });
  it("gives localized explanations", () => {
    const g = gradeConjugation("tener", "pres", 0, "teno");
    expect(g.explanation?.en).toContain("tengo");
    expect(g.explanation?.fr).toContain("tengo");
  });
  it("accepts the regional preterite in perfect contexts with a note", () => {
    const g = gradeConjugation("comer", "perf", 3, "comimos", [{ tense: "pret", note: { en: "x", fr: "y" } }]);
    expect(g.correct).toBe(true);
    expect(g.note?.en).toBe("x");
  });
});

describe("drills", () => {
  it("builds every drill type with valid keys", () => {
    const rand = seededRandom("drills");
    for (const type of ["direct", "sentence", "context", "error", "table"] as const) {
      for (const verb of ["tener", "hablar", "levantarse", "pedir"]) {
        for (const tense of ["pres", "pret", "perf", "pres_subj", "imper_aff"] as Tense[]) {
          const { drill, key } = buildDrill({ verb, tense, type, rand });
          if (drill.type === "table") {
            expect(key.table?.length).toBe(drill.persons?.length);
          } else {
            expect(key.answers.length).toBeGreaterThan(0);
            if (drill.type === "error") expect(key.answers).not.toContain(drill.wrong);
          }
        }
      }
    }
  });
  it("never offers an accepted form as the error", () => {
    const rand = seededRandom("wrong");
    for (let i = 0; i < 50; i++) {
      const accepted = acceptedForms("ir", "pres", 3);
      const w = wrongForm(getVerbDef("ir")!, "pres", 3, rand, accepted);
      expect(accepted).not.toContain(w);
    }
  });
});
