import type { Lang, Localized } from "@/lib/i18n/types";

/** Curated writing prompts used when the AI is unavailable, by level (1-6). */
export const WRITING_PROMPTS: Array<{ level: number; prompt: Localized; guidance: Localized[] }> = [
  {
    level: 1,
    prompt: {
      en: "Describe your typical working or study day: what you do, when, where and with whom. Mention one thing you like and one thing you would change.",
      fr: "Décrivez une journée typique de travail ou d'études : ce que vous faites, quand, où et avec qui. Mentionnez une chose que vous aimez et une chose que vous changeriez.",
    },
    guidance: [
      { en: "Use time expressions (por la mañana, después, a las ocho).", fr: "Utilisez des expressions de temps (por la mañana, después, a las ocho)." },
      { en: "Use connectors such as pero, además, porque.", fr: "Employez des connecteurs comme pero, además, porque." },
    ],
  },
  {
    level: 1,
    prompt: {
      en: "Present the city where you live to a Spanish colleague who will move there: neighbourhoods, transport, cost of living and one recommendation.",
      fr: "Présentez la ville où vous habitez à un collègue espagnol qui va s'y installer : quartiers, transports, coût de la vie et une recommandation.",
    },
    guidance: [
      { en: "Use hay and estar correctly.", fr: "Employez correctement hay et estar." },
      { en: "Give at least one comparison.", fr: "Faites au moins une comparaison." },
    ],
  },
  {
    level: 2,
    prompt: {
      en: "Write an email to a professor asking to change the date of an exam. Explain the reason and propose two alternatives.",
      fr: "Écrivez un courriel à un professeur pour demander de changer la date d'un examen. Expliquez la raison et proposez deux alternatives.",
    },
    guidance: [
      { en: "Use a formal register (usted) and polite forms (podría, me gustaría).", fr: "Utilisez un registre formel (usted) et des formules de politesse (podría, me gustaría)." },
      { en: "Structure: greeting, request, reasons, proposal, closing.", fr: "Structure : salutation, demande, raisons, proposition, formule finale." },
    ],
  },
  {
    level: 2,
    prompt: {
      en: "Tell the story of a trip or a project that did not go as planned. What happened, how did you react, and what did you learn?",
      fr: "Racontez un voyage ou un projet qui ne s'est pas passé comme prévu. Que s'est-il passé, comment avez-vous réagi et qu'en avez-vous retenu ?",
    },
    guidance: [
      { en: "Combine the pretérito indefinido (events) and imperfecto (background).", fr: "Combinez le pretérito indefinido (événements) et l'imperfecto (contexte)." },
      { en: "Use at least three connectors (al principio, de repente, al final).", fr: "Employez au moins trois connecteurs (al principio, de repente, al final)." },
    ],
  },
  {
    level: 3,
    prompt: {
      en: "Is remote work better for productivity? Give your opinion with arguments for and against.",
      fr: "Le télétravail est-il meilleur pour la productivité ? Donnez votre avis avec des arguments pour et contre.",
    },
    guidance: [
      { en: "Use creo que / no creo que with the correct mood.", fr: "Employez creo que / no creo que avec le mode correct." },
      { en: "Organise with por un lado, por otro lado, sin embargo, en conclusión.", fr: "Organisez avec por un lado, por otro lado, sin embargo, en conclusión." },
    ],
  },
  {
    level: 3,
    prompt: {
      en: "Compare studying engineering in France and in Spain (or two universities you know): access, teaching style, workload, career prospects.",
      fr: "Comparez les études d'ingénieur en France et en Espagne (ou deux universités que vous connaissez) : accès, pédagogie, charge de travail, débouchés.",
    },
    guidance: [
      { en: "Use comparatives and superlatives.", fr: "Employez comparatifs et superlatifs." },
      { en: "Conclude with a recommendation.", fr: "Concluez par une recommandation." },
    ],
  },
  {
    level: 4,
    prompt: {
      en: "Explain a technical concept from your field (for example an algorithm, a material or a machine) to a non-specialist audience.",
      fr: "Expliquez un concept technique de votre domaine (par exemple un algorithme, un matériau ou une machine) à un public non spécialiste.",
    },
    guidance: [
      { en: "Define terms precisely and use examples.", fr: "Définissez précisément les termes et donnez des exemples." },
      { en: "Use impersonal se and passive constructions where natural.", fr: "Utilisez le se impersonnel et la voix passive lorsque c'est naturel." },
    ],
  },
  {
    level: 4,
    prompt: {
      en: "Housing in large Spanish cities has become very expensive. Analyse the causes and propose measures.",
      fr: "Le logement dans les grandes villes espagnoles est devenu très cher. Analysez les causes et proposez des mesures.",
    },
    guidance: [
      { en: "Use es necesario que / habría que + appropriate forms.", fr: "Employez es necesario que / habría que avec les formes appropriées." },
      { en: "Distinguish causes and consequences with precise connectors.", fr: "Distinguez causes et conséquences avec des connecteurs précis." },
    ],
  },
  {
    level: 5,
    prompt: {
      en: "Should artificial intelligence be regulated? Write a structured argument considering innovation, risks and responsibility.",
      fr: "Faut-il réguler l'intelligence artificielle ? Rédigez une argumentation structurée qui considère l'innovation, les risques et la responsabilité.",
    },
    guidance: [
      { en: "Use concessive structures (aunque, si bien, a pesar de que).", fr: "Employez des structures concessives (aunque, si bien, a pesar de que)." },
      { en: "Include at least one hypothetical sentence (si + imperfecto de subjuntivo).", fr: "Incluez au moins une hypothèse (si + imperfecto de subjuntivo)." },
    ],
  },
  {
    level: 5,
    prompt: {
      en: "Describe a decision you made that changed your path. What would have happened if you had chosen differently?",
      fr: "Décrivez une décision qui a changé votre parcours. Que se serait-il passé si vous aviez choisi autrement ?",
    },
    guidance: [
      { en: "Use past hypotheticals (si hubiera..., habría...).", fr: "Employez l'hypothèse passée (si hubiera..., habría...)." },
      { en: "Vary past tenses accurately.", fr: "Variez avec précision les temps du passé." },
    ],
  },
  {
    level: 6,
    prompt: {
      en: "Write a short opinion column on the role of universities in a society transformed by technology.",
      fr: "Rédigez une courte tribune sur le rôle des universités dans une société transformée par la technologie.",
    },
    guidance: [
      { en: "Adopt a formal written register and nuanced claims.", fr: "Adoptez un registre écrit soutenu et des affirmations nuancées." },
      { en: "Use advanced connectors (no obstante, por consiguiente, en definitiva).", fr: "Employez des connecteurs avancés (no obstante, por consiguiente, en definitiva)." },
    ],
  },
];

export function minWordsForLevel(level: number): number {
  return [70, 100, 130, 170, 210, 250][Math.min(5, Math.max(0, level - 1))]!;
}

export function fallbackWritingPrompt(level: number, seed: number, lang: Lang): { prompt: string; guidance: string[] } {
  const candidates = WRITING_PROMPTS.filter((p) => p.level <= level);
  const pool = candidates.filter((p) => p.level >= level - 1);
  const list = pool.length ? pool : candidates.length ? candidates : WRITING_PROMPTS;
  const p = list[seed % list.length]!;
  return { prompt: p.prompt[lang], guidance: p.guidance.map((g) => g[lang]) };
}

/** Split a dictation text into segments of roughly 5 to 10 words at punctuation boundaries. */
export function segmentText(text: string): string[] {
  const clauses = text
    .replace(/\s+/g, " ")
    .trim()
    .split(/(?<=[.;:!?])\s+|(?<=,)\s+/);
  const out: string[] = [];
  let buf = "";
  for (const c of clauses) {
    const words = (buf + " " + c).trim().split(" ").length;
    if (buf && words > 11) {
      out.push(buf.trim());
      buf = c;
    } else buf = (buf + " " + c).trim();
  }
  if (buf.trim()) out.push(buf.trim());
  return out;
}
