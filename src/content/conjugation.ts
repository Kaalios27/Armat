import type { ConjugationUnit } from "./types";

const REGULAR = [
  "hablar", "trabajar", "estudiar", "llamar", "llevar", "dejar", "pasar", "tomar", "mirar", "escuchar", "esperar",
  "necesitar", "ayudar", "usar", "cambiar", "preguntar", "terminar", "intentar", "aprovechar", "lograr", "plantear",
  "preparar", "viajar", "comprar", "olvidar", "explicar", "buscar", "llegar", "pagar", "practicar", "organizar",
  "comer", "beber", "aprender", "comprender", "deber", "correr", "vender", "responder", "leer", "creer", "prometer",
  "vivir", "escribir", "abrir", "recibir", "decidir", "subir", "compartir", "permitir", "discutir", "asistir",
];
const STEM_IE = ["pensar", "cerrar", "empezar", "comenzar", "entender", "perder", "querer", "preferir", "sentir", "mentir", "defender", "recomendar", "tener", "venir"];
const STEM_UE = ["poder", "volver", "dormir", "contar", "encontrar", "recordar", "costar", "mostrar", "probar", "soñar", "resolver", "devolver", "mover", "almorzar", "jugar"];
const STEM_I = ["pedir", "servir", "repetir", "seguir", "conseguir", "elegir", "corregir", "decir", "medir"];
const IRREG_CORE = ["ser", "estar", "ir", "tener", "hacer", "poder", "poner", "decir", "venir", "salir", "saber", "querer", "dar", "ver", "traer"];
const REFLEXIVE = [
  "levantarse", "despertarse", "acostarse", "ducharse", "vestirse", "sentarse", "sentirse", "irse", "quedarse",
  "acordarse", "equivocarse", "preocuparse", "quejarse", "enterarse", "divertirse", "dormirse", "casarse", "enfadarse",
  "atreverse", "ponerse",
];
const MIXED = [...IRREG_CORE, "hablar", "comer", "vivir", "pensar", "volver", "pedir", "seguir", "conocer", "conducir", "leer", "dormir", "sentir", "llegar", "empezar", "buscar"];

export const CONJUGATION_UNITS: ConjugationUnit[] = [
  {
    id: "c-pres-regular",
    cefr: "A1",
    title: { en: "Present: regular verbs", fr: "Présent : verbes réguliers" },
    tenses: ["pres"],
    verbs: REGULAR,
    prerequisites: [],
    lesson: {
      summary: {
        en: "Spanish verbs fall into three classes by infinitive ending: -ar, -er, -ir. Remove the ending and add the person ending. Subject pronouns are usually omitted because the ending already identifies the person.",
        fr: "Les verbes espagnols se répartissent en trois groupes selon la terminaison de l'infinitif : -ar, -er, -ir. On retire la terminaison et on ajoute la désinence de personne. Le pronom sujet est généralement omis, car la désinence suffit à identifier la personne.",
      },
      rules: [
        { en: "-ar: -o, -as, -a, -amos, -áis, -an (hablo, hablas, habla, hablamos, habláis, hablan).", fr: "-ar : -o, -as, -a, -amos, -áis, -an (hablo, hablas, habla, hablamos, habláis, hablan)." },
        { en: "-er: -o, -es, -e, -emos, -éis, -en. -ir: -o, -es, -e, -imos, -ís, -en. Only nosotros and vosotros differ between -er and -ir.", fr: "-er : -o, -es, -e, -emos, -éis, -en. -ir : -o, -es, -e, -imos, -ís, -en. Seuls nosotros et vosotros distinguent -er et -ir." },
        { en: "Vosotros (informal plural, used throughout Spain) always carries a written accent in the present: habláis, coméis, vivís.", fr: "Vosotros (pluriel informel, employé dans toute l'Espagne) porte toujours un accent écrit au présent : habláis, coméis, vivís." },
        { en: "Usted and ustedes take third-person forms: usted habla, ustedes hablan.", fr: "Usted et ustedes se conjuguent à la troisième personne : usted habla, ustedes hablan." },
      ],
      examples: [
        { es: "Trabajamos en un laboratorio de materiales.", en: "We work in a materials laboratory.", fr: "Nous travaillons dans un laboratoire de matériaux." },
        { es: "¿Vivís cerca de la universidad?", en: "Do you (pl.) live near the university?", fr: "Vous habitez près de l'université ?" },
        { es: "Aprendo mucho en este curso.", en: "I'm learning a lot in this course.", fr: "J'apprends beaucoup dans ce cours." },
      ],
      exceptions: [
        { en: "Spelling changes such as buscar → busqué appear only before -e endings, so the present of these verbs is regular.", fr: "Les changements orthographiques comme buscar → busqué n'apparaissent que devant -e : le présent de ces verbes est régulier." },
      ],
      pitfalls: [
        { en: "The Spanish present also covers the English present progressive and near future: Mañana trabajo = I'm working tomorrow.", fr: "Le présent espagnol couvre aussi le futur proche : Mañana trabajo = Demain je travaille." },
        { en: "Don't add subject pronouns systematically: hablo, not yo hablo, unless you contrast or emphasise.", fr: "N'ajoutez pas systématiquement le pronom : hablo, et non yo hablo, sauf pour contraster ou insister." },
      ],
      tableVerbs: ["hablar", "comer", "vivir"],
    },
  },
  {
    id: "c-pres-irregular-core",
    cefr: "A1",
    title: { en: "Present: ser, estar, ir, haber, dar, ver", fr: "Présent : ser, estar, ir, haber, dar, ver" },
    tenses: ["pres"],
    verbs: ["ser", "estar", "ir", "dar", "ver", "haber"],
    prerequisites: ["c-pres-regular"],
    lesson: {
      summary: {
        en: "The most frequent verbs are irregular and must be memorised as complete paradigms. They appear in almost every sentence.",
        fr: "Les verbes les plus fréquents sont irréguliers et doivent être mémorisés en entier. Ils apparaissent dans presque chaque phrase.",
      },
      rules: [
        { en: "ser: soy, eres, es, somos, sois, son. estar: estoy, estás, está, estamos, estáis, están.", fr: "ser : soy, eres, es, somos, sois, son. estar : estoy, estás, está, estamos, estáis, están." },
        { en: "ir: voy, vas, va, vamos, vais, van. dar: doy, das, da, damos, dais, dan (no accents).", fr: "ir : voy, vas, va, vamos, vais, van. dar : doy, das, da, damos, dais, dan (sans accent)." },
        { en: "ver: veo, ves, ve, vemos, veis, ven. haber: he, has, ha, hemos, habéis, han; existential form: hay.", fr: "ver : veo, ves, ve, vemos, veis, ven. haber : he, has, ha, hemos, habéis, han ; forme existentielle : hay." },
      ],
      examples: [
        { es: "Voy a la oficina y estoy allí hasta las seis.", en: "I go to the office and I'm there until six.", fr: "Je vais au bureau et j'y suis jusqu'à six heures." },
        { es: "Hay tres problemas en el informe.", en: "There are three problems in the report.", fr: "Il y a trois problèmes dans le rapport." },
      ],
      exceptions: [
        { en: "Monosyllables vais, dais, veis, sois carry no written accent.", fr: "Les monosyllabes vais, dais, veis, sois ne portent pas d'accent écrit." },
      ],
      pitfalls: [
        { en: "Haber is not 'to have' in the sense of possession; that is tener. Haber forms compound tenses (he comido) and hay.", fr: "Haber ne signifie pas « avoir » au sens de posséder (c'est tener). Il sert aux temps composés (he comido) et à hay." },
      ],
      tableVerbs: ["ser", "estar", "ir"],
    },
  },
  {
    id: "c-pres-yo-irregular",
    cefr: "A1",
    title: { en: "Present: irregular first person", fr: "Présent : première personne irrégulière" },
    tenses: ["pres"],
    verbs: ["hacer", "poner", "salir", "traer", "caer", "saber", "conocer", "conducir", "traducir", "ofrecer", "parecer", "valer", "agradecer", "crecer"],
    prerequisites: ["c-pres-irregular-core"],
    lesson: {
      summary: {
        en: "Many verbs are irregular only in the yo form; the other persons are regular. This yo form is also the base of the present subjunctive, so it matters later.",
        fr: "Beaucoup de verbes ne sont irréguliers qu'à la première personne ; les autres personnes sont régulières. Cette forme sert aussi de base au subjonctif présent.",
      },
      rules: [
        { en: "-go verbs: hacer → hago, poner → pongo, salir → salgo, traer → traigo, caer → caigo, valer → valgo.", fr: "Verbes en -go : hacer → hago, poner → pongo, salir → salgo, traer → traigo, caer → caigo, valer → valgo." },
        { en: "Vowel + -cer/-cir → -zco: conocer → conozco, parecer → parezco, conducir → conduzco, traducir → traduzco.", fr: "Voyelle + -cer/-cir → -zco : conocer → conozco, parecer → parezco, conducir → conduzco, traducir → traduzco." },
        { en: "saber → sé; ver → veo; dar → doy.", fr: "saber → sé ; ver → veo ; dar → doy." },
      ],
      examples: [
        { es: "No conozco a nadie en este departamento.", en: "I don't know anyone in this department.", fr: "Je ne connais personne dans ce service." },
        { es: "Salgo de casa a las ocho y conduzco veinte minutos.", en: "I leave home at eight and drive for twenty minutes.", fr: "Je pars de chez moi à huit heures et je conduis vingt minutes." },
      ],
      exceptions: [
        { en: "hacer and decir end in -cer/-cir but follow their own pattern (hago, digo).", fr: "hacer et decir se terminent en -cer/-cir mais suivent leur propre modèle (hago, digo)." },
      ],
      pitfalls: [
        { en: "Sé (I know) carries an accent to distinguish it from the pronoun se.", fr: "Sé (je sais) porte un accent pour le distinguer du pronom se." },
      ],
      tableVerbs: ["hacer", "conocer", "salir"],
    },
  },
  {
    id: "c-pres-e-ie",
    cefr: "A1",
    title: { en: "Present: stem change e → ie", fr: "Présent : diphtongue e → ie" },
    tenses: ["pres"],
    verbs: STEM_IE,
    prerequisites: ["c-pres-yo-irregular"],
    lesson: {
      summary: {
        en: "In some verbs the stem vowel e becomes ie when it is stressed. Stress falls on the stem in yo, tú, él and ellos, but on the ending in nosotros and vosotros: this is the 'boot' pattern.",
        fr: "Dans certains verbes, la voyelle e du radical devient ie lorsqu'elle est accentuée. L'accent tombe sur le radical pour yo, tú, él et ellos, mais sur la terminaison pour nosotros et vosotros.",
      },
      rules: [
        { en: "pensar: pienso, piensas, piensa, pensamos, pensáis, piensan.", fr: "pensar : pienso, piensas, piensa, pensamos, pensáis, piensan." },
        { en: "The change affects the last e of the stem: empezar → empiezo, entender → entiendo, preferir → prefiero.", fr: "Le changement porte sur le dernier e du radical : empezar → empiezo, entender → entiendo, preferir → prefiero." },
        { en: "tener and venir combine the diphthong with an irregular yo: tengo, tienes; vengo, vienes.", fr: "tener et venir combinent la diphtongue et un yo irrégulier : tengo, tienes ; vengo, vienes." },
      ],
      examples: [
        { es: "¿Qué piensas de la propuesta?", en: "What do you think of the proposal?", fr: "Que penses-tu de la proposition ?" },
        { es: "Preferimos empezar temprano, pero la reunión empieza a las diez.", en: "We prefer to start early, but the meeting starts at ten.", fr: "Nous préférons commencer tôt, mais la réunion commence à dix heures." },
      ],
      exceptions: [
        { en: "There is no rule that predicts which verbs diphthongise; learn them with the verb (entender changes, aprender does not).", fr: "Aucune règle ne prédit quels verbes diphtonguent ; apprenez-le avec le verbe (entender change, aprender non)." },
      ],
      pitfalls: [
        { en: "Never apply the change in nosotros/vosotros: pensamos, not *piensamos.", fr: "Jamais de diphtongue à nosotros/vosotros : pensamos, et non *piensamos." },
      ],
      tableVerbs: ["pensar", "querer", "preferir"],
    },
  },
  {
    id: "c-pres-o-ue",
    cefr: "A1",
    title: { en: "Present: stem change o → ue", fr: "Présent : diphtongue o → ue" },
    tenses: ["pres"],
    verbs: STEM_UE,
    prerequisites: ["c-pres-e-ie"],
    lesson: {
      summary: {
        en: "Same boot pattern with o → ue. Jugar is the only verb with u → ue.",
        fr: "Même schéma avec o → ue. Jugar est le seul verbe avec u → ue.",
      },
      rules: [
        { en: "poder: puedo, puedes, puede, podemos, podéis, pueden.", fr: "poder : puedo, puedes, puede, podemos, podéis, pueden." },
        { en: "volver → vuelvo, dormir → duermo, recordar → recuerdo, encontrar → encuentro.", fr: "volver → vuelvo, dormir → duermo, recordar → recuerdo, encontrar → encuentro." },
        { en: "jugar: juego, juegas, juega, jugamos, jugáis, juegan.", fr: "jugar : juego, juegas, juega, jugamos, jugáis, juegan." },
      ],
      examples: [
        { es: "No recuerdo dónde dejo las llaves.", en: "I don't remember where I leave my keys.", fr: "Je ne me souviens pas où je laisse mes clés." },
        { es: "¿Cuánto cuesta? Si no puedes pagar ahora, vuelves mañana.", en: "How much is it? If you can't pay now, you come back tomorrow.", fr: "Combien ça coûte ? Si tu ne peux pas payer maintenant, tu reviens demain." },
      ],
      exceptions: [],
      pitfalls: [
        { en: "Costar is mostly used in the third person: cuesta, cuestan.", fr: "Costar s'emploie surtout à la troisième personne : cuesta, cuestan." },
      ],
      tableVerbs: ["poder", "volver", "jugar"],
    },
  },
  {
    id: "c-pres-e-i",
    cefr: "A2",
    title: { en: "Present: stem change e → i", fr: "Présent : alternance e → i" },
    tenses: ["pres"],
    verbs: STEM_I,
    prerequisites: ["c-pres-o-ue"],
    lesson: {
      summary: {
        en: "A group of -ir verbs changes e → i in the stressed stem. Combined with spelling rules this gives forms such as sigo, elijo, corrijo.",
        fr: "Un groupe de verbes en -ir change e → i quand le radical est accentué. Combiné aux règles orthographiques, cela donne sigo, elijo, corrijo.",
      },
      rules: [
        { en: "pedir: pido, pides, pide, pedimos, pedís, piden.", fr: "pedir : pido, pides, pide, pedimos, pedís, piden." },
        { en: "seguir → sigo (gu → g before o), elegir → elijo (g → j before o), corregir → corrijo.", fr: "seguir → sigo (gu → g devant o), elegir → elijo (g → j devant o), corregir → corrijo." },
        { en: "decir: digo, dices, dice, decimos, decís, dicen.", fr: "decir : digo, dices, dice, decimos, decís, dicen." },
      ],
      examples: [
        { es: "Siempre pido la cuenta al final.", en: "I always ask for the bill at the end.", fr: "Je demande toujours l'addition à la fin." },
        { es: "Seguimos el método que dice el profesor.", en: "We follow the method the professor describes.", fr: "Nous suivons la méthode qu'indique le professeur." },
      ],
      exceptions: [],
      pitfalls: [
        { en: "Pedir means to ask for (request); to ask a question is preguntar.", fr: "Pedir signifie demander (quelque chose) ; poser une question se dit preguntar." },
      ],
      tableVerbs: ["pedir", "seguir", "decir"],
    },
  },
  {
    id: "c-pres-spelling",
    cefr: "A2",
    title: { en: "Present: spelling changes and oír", fr: "Présent : changements orthographiques et oír" },
    tenses: ["pres"],
    verbs: ["coger", "recoger", "proteger", "dirigir", "exigir", "distinguir", "construir", "incluir", "destruir", "contribuir", "enviar", "confiar", "continuar", "actuar", "oír", "vencer", "convencer"],
    prerequisites: ["c-pres-e-i"],
    lesson: {
      summary: {
        en: "Spelling changes keep the pronunciation of the stem constant: the letters change, not the sound.",
        fr: "Les changements orthographiques conservent la prononciation du radical : les lettres changent, pas le son.",
      },
      rules: [
        { en: "-ger/-gir: g → j before o/a (cojo, dirijo). -guir: gu → g (distingo). Consonant + -cer: c → z (venzo).", fr: "-ger/-gir : g → j devant o/a (cojo, dirijo). -guir : gu → g (distingo). Consonne + -cer : c → z (venzo)." },
        { en: "-uir (not -guir): add y before vowels: construyo, construyes, construye, construimos, construís, construyen.", fr: "-uir (sauf -guir) : y devant voyelle : construyo, construyes, construye, construimos, construís, construyen." },
        { en: "Some -iar/-uar verbs stress the i/u: envío, envías, envía, enviamos, enviáis, envían; continúo.", fr: "Certains verbes en -iar/-uar accentuent le i/u : envío, envías, envía, enviamos, enviáis, envían ; continúo." },
        { en: "oír: oigo, oyes, oye, oímos, oís, oyen.", fr: "oír : oigo, oyes, oye, oímos, oís, oyen." },
      ],
      examples: [
        { es: "Te envío el archivo y continúo con el análisis.", en: "I'll send you the file and continue with the analysis.", fr: "Je t'envoie le fichier et je continue l'analyse." },
        { es: "¿Oyes ese ruido? Construyen un edificio enfrente.", en: "Do you hear that noise? They're building across the street.", fr: "Tu entends ce bruit ? Ils construisent un immeuble en face." },
      ],
      exceptions: [
        { en: "Many -iar verbs are regular: estudiar → estudio, cambiar → cambio.", fr: "Beaucoup de verbes en -iar sont réguliers : estudiar → estudio, cambiar → cambio." },
      ],
      pitfalls: [
        { en: "In Spain, coger is neutral (to take, to catch): coger el autobús.", fr: "En Espagne, coger est neutre (prendre, attraper) : coger el autobús." },
      ],
      tableVerbs: ["construir", "enviar", "oír"],
    },
  },
  {
    id: "c-reflexive",
    cefr: "A1",
    title: { en: "Reflexive verbs in the present", fr: "Verbes pronominaux au présent" },
    tenses: ["pres"],
    verbs: REFLEXIVE,
    prerequisites: ["c-pres-e-ie"],
    lesson: {
      summary: {
        en: "Reflexive verbs are conjugated with a pronoun matching the subject: me, te, se, nos, os, se. The pronoun goes before a conjugated verb.",
        fr: "Les verbes pronominaux se conjuguent avec un pronom accordé au sujet : me, te, se, nos, os, se. Le pronom précède le verbe conjugué.",
      },
      rules: [
        { en: "levantarse: me levanto, te levantas, se levanta, nos levantamos, os levantáis, se levantan.", fr: "levantarse : me levanto, te levantas, se levanta, nos levantamos, os levantáis, se levantan." },
        { en: "Stem changes still apply: me despierto, me acuesto, me visto, me siento.", fr: "Les diphtongues s'appliquent toujours : me despierto, me acuesto, me visto, me siento." },
        { en: "With an infinitive the pronoun can attach to it: voy a levantarme = me voy a levantar.", fr: "Avec un infinitif, le pronom peut s'y attacher : voy a levantarme = me voy a levantar." },
      ],
      examples: [
        { es: "Nos levantamos a las siete y nos vamos a las ocho.", en: "We get up at seven and leave at eight.", fr: "Nous nous levons à sept heures et partons à huit heures." },
        { es: "¿Te acuerdas de su nombre?", en: "Do you remember his name?", fr: "Tu te souviens de son nom ?" },
      ],
      exceptions: [
        { en: "Me siento can mean 'I sit down' (sentarse) or 'I feel' (sentirse); context decides.", fr: "Me siento peut signifier « je m'assieds » (sentarse) ou « je me sens » (sentirse) ; le contexte tranche." },
      ],
      pitfalls: [
        { en: "Many verbs are reflexive in Spanish but not in English: quedarse (to stay), irse (to leave), quejarse (to complain).", fr: "Les verbes pronominaux ne coïncident pas toujours avec le français : quedarse (rester), irse (partir), acordarse (se souvenir)." },
      ],
      tableVerbs: ["levantarse", "acostarse", "vestirse"],
    },
  },
  {
    id: "c-pres-prog",
    cefr: "A1",
    title: { en: "Estar + gerund", fr: "Estar + gérondif" },
    tenses: ["pres_prog"],
    verbs: ["hablar", "trabajar", "estudiar", "comer", "leer", "escribir", "hacer", "decir", "dormir", "pedir", "seguir", "ir", "oír", "construir", "preparar", "esperar", "buscar", "ducharse", "vestirse"],
    prerequisites: ["c-pres-regular"],
    lesson: {
      summary: {
        en: "Estar + gerund describes an action in progress at the moment of speaking or a temporary situation.",
        fr: "Estar + gérondif décrit une action en cours au moment où l'on parle ou une situation temporaire.",
      },
      rules: [
        { en: "Gerund: -ar → -ando, -er/-ir → -iendo (hablando, comiendo, viviendo).", fr: "Gérondif : -ar → -ando, -er/-ir → -iendo (hablando, comiendo, viviendo)." },
        { en: "Vowel stem → -yendo: leyendo, oyendo, construyendo; ir → yendo.", fr: "Radical en voyelle → -yendo : leyendo, oyendo, construyendo ; ir → yendo." },
        { en: "-ir stem changers: e → i, o → u (pidiendo, diciendo, durmiendo); poder → pudiendo.", fr: "Verbes en -ir à alternance : e → i, o → u (pidiendo, diciendo, durmiendo) ; poder → pudiendo." },
      ],
      examples: [
        { es: "Estoy terminando el informe, te llamo luego.", en: "I'm finishing the report, I'll call you later.", fr: "Je suis en train de finir le rapport, je te rappelle." },
        { es: "Este año estamos viviendo en Valencia.", en: "This year we are living in Valencia.", fr: "Cette année, nous vivons à Valence." },
      ],
      exceptions: [
        { en: "With reflexive verbs: me estoy duchando or estoy duchándome (accent added).", fr: "Avec un pronominal : me estoy duchando ou estoy duchándome (accent ajouté)." },
      ],
      pitfalls: [
        { en: "Do not use the progressive for future plans as in English: Mañana voy (not *estoy yendo) a Madrid.", fr: "La forme progressive n'exprime pas le futur : Mañana voy a Madrid, et non *estoy yendo." },
      ],
      tableVerbs: ["leer", "dormir", "pedir"],
    },
  },
  {
    id: "c-perf",
    cefr: "A2",
    title: { en: "Pretérito perfecto", fr: "Pretérito perfecto" },
    tenses: ["perf"],
    verbs: ["hablar", "comer", "vivir", "terminar", "hacer", "decir", "poner", "ver", "escribir", "abrir", "volver", "romper", "resolver", "descubrir", "leer", "ir", "ser", "estar", "tener", "levantarse", "devolver", "morir", "proponer"],
    prerequisites: ["c-pres-irregular-core"],
    lesson: {
      summary: {
        en: "Haber in the present + past participle. In Spain it is the normal past tense for actions within a period that includes the present: hoy, esta mañana, este año, todavía, ya.",
        fr: "Haber au présent + participe passé. En Espagne, c'est le passé normal pour une action située dans une période qui inclut le présent : hoy, esta mañana, este año, todavía, ya.",
      },
      rules: [
        { en: "he, has, ha, hemos, habéis, han + participle (-ado / -ido): he hablado, hemos comido.", fr: "he, has, ha, hemos, habéis, han + participe (-ado / -ido) : he hablado, hemos comido." },
        { en: "Irregular participles: hecho, dicho, puesto, visto, escrito, abierto, vuelto, roto, resuelto, muerto, descubierto.", fr: "Participes irréguliers : hecho, dicho, puesto, visto, escrito, abierto, vuelto, roto, resuelto, muerto, descubierto." },
        { en: "The participle never agrees and nothing comes between haber and the participle: ya lo he visto.", fr: "Le participe ne s'accorde jamais et rien ne s'intercale entre haber et le participe : ya lo he visto." },
      ],
      examples: [
        { es: "Esta mañana he hablado con la directora.", en: "This morning I spoke with the director.", fr: "Ce matin, j'ai parlé avec la directrice." },
        { es: "¿Habéis visto el correo? Todavía no lo he leído.", en: "Have you seen the email? I haven't read it yet.", fr: "Vous avez vu le mail ? Je ne l'ai pas encore lu." },
      ],
      exceptions: [
        { en: "Leer, creer, caer, traer, oír take an accent: leído, creído, caído, traído, oído.", fr: "Leer, creer, caer, traer, oír prennent un accent : leído, creído, caído, traído, oído." },
      ],
      pitfalls: [
        { en: "Spanish uses haber for all verbs, including motion and reflexives: he ido, me he levantado.", fr: "L'auxiliaire est toujours haber, même pour les verbes de mouvement et pronominaux : he ido (je suis allé), me he levantado (je me suis levé)." },
      ],
      tableVerbs: ["hablar", "hacer", "volver"],
    },
  },
  {
    id: "c-pret-regular",
    cefr: "A2",
    title: { en: "Pretérito indefinido: regular verbs", fr: "Pretérito indefinido : verbes réguliers" },
    tenses: ["pret"],
    verbs: [...REGULAR, "empezar", "jugar", "alcanzar", "entregar", "leer", "creer", "caer", "construir", "oír"],
    prerequisites: ["c-perf"],
    lesson: {
      summary: {
        en: "The indefinido narrates completed actions in a finished period: ayer, el año pasado, en 2019. It is the main narrative past tense.",
        fr: "L'indefinido raconte des actions achevées dans une période terminée : ayer, el año pasado, en 2019. C'est le temps principal du récit.",
      },
      rules: [
        { en: "-ar: -é, -aste, -ó, -amos, -asteis, -aron. -er/-ir: -í, -iste, -ió, -imos, -isteis, -ieron.", fr: "-ar : -é, -aste, -ó, -amos, -asteis, -aron. -er/-ir : -í, -iste, -ió, -imos, -isteis, -ieron." },
        { en: "The accent on yo and él forms is essential: hablé (I spoke) vs hable (subjunctive), habló (he spoke) vs hablo (I speak).", fr: "L'accent de yo et él est essentiel : hablé (j'ai parlé) / hable (subjonctif), habló (il a parlé) / hablo (je parle)." },
        { en: "Spelling in the yo form: busqué, llegué, empecé. Vowel stems: leyó, leyeron, creyó, cayó, construyó.", fr: "Orthographe à yo : busqué, llegué, empecé. Radical en voyelle : leyó, leyeron, creyó, cayó, construyó." },
      ],
      examples: [
        { es: "Ayer llegué tarde y busqué un taxi.", en: "Yesterday I arrived late and looked for a taxi.", fr: "Hier je suis arrivé en retard et j'ai cherché un taxi." },
        { es: "En 2020 vivimos seis meses en Bilbao.", en: "In 2020 we lived in Bilbao for six months.", fr: "En 2020, nous avons vécu six mois à Bilbao." },
      ],
      exceptions: [
        { en: "Nosotros forms of -ar and -ir verbs are identical in present and indefinido (hablamos, vivimos); context decides.", fr: "Nosotros est identique au présent et à l'indefinido pour -ar et -ir (hablamos, vivimos) ; le contexte tranche." },
      ],
      pitfalls: [
        { en: "The tú form has no final -s: hablaste, not *hablastes.", fr: "La forme tú ne prend pas de -s final : hablaste, et non *hablastes." },
      ],
      tableVerbs: ["hablar", "comer", "leer"],
    },
  },
  {
    id: "c-pret-irregular",
    cefr: "A2",
    title: { en: "Pretérito indefinido: irregular verbs", fr: "Pretérito indefinido : verbes irréguliers" },
    tenses: ["pret"],
    verbs: ["ser", "ir", "estar", "tener", "hacer", "poder", "poner", "decir", "venir", "saber", "querer", "dar", "ver", "traer", "andar", "conducir", "traducir", "producir", "mantener", "obtener", "proponer"],
    prerequisites: ["c-pret-regular"],
    lesson: {
      summary: {
        en: "Strong preterites have an irregular stem and unstressed endings: -e, -iste, -o, -imos, -isteis, -ieron. No written accents.",
        fr: "Les prétérits forts ont un radical irrégulier et des terminaisons non accentuées : -e, -iste, -o, -imos, -isteis, -ieron. Pas d'accent écrit.",
      },
      rules: [
        { en: "u-stems: tuve (tener), estuve, pude, puse, supe, anduve, hube. i-stems: hice (hizo), quise, vine.", fr: "Radical en u : tuve (tener), estuve, pude, puse, supe, anduve, hube. En i : hice (hizo), quise, vine." },
        { en: "j-stems drop the i in ellos: dije → dijeron, traje → trajeron, conduje → condujeron.", fr: "Radical en j : ellos perd le i : dije → dijeron, traje → trajeron, conduje → condujeron." },
        { en: "ser and ir share fui, fuiste, fue, fuimos, fuisteis, fueron. dar: di, diste, dio. ver: vi, viste, vio.", fr: "ser et ir partagent fui, fuiste, fue, fuimos, fuisteis, fueron. dar : di, diste, dio. ver : vi, viste, vio." },
      ],
      examples: [
        { es: "No pude venir porque tuve una reunión.", en: "I couldn't come because I had a meeting.", fr: "Je n'ai pas pu venir parce que j'ai eu une réunion." },
        { es: "¿Qué dijeron cuando supieron la noticia?", en: "What did they say when they found out the news?", fr: "Qu'ont-ils dit quand ils ont appris la nouvelle ?" },
      ],
      exceptions: [
        { en: "Some verbs change meaning in the indefinido: supe (I found out), conocí (I met), quise (I tried), no quise (I refused).", fr: "Certains verbes changent de sens à l'indefinido : supe (j'ai appris), conocí (j'ai rencontré), no quise (j'ai refusé)." },
      ],
      pitfalls: [
        { en: "Do not add accents: hizo, dijo, vino (not *hizó).", fr: "Pas d'accent : hizo, dijo, vino (et non *hizó)." },
      ],
      tableVerbs: ["tener", "hacer", "decir"],
    },
  },
  {
    id: "c-pret-ir-stem",
    cefr: "A2",
    title: { en: "Pretérito indefinido: -ir stem changers", fr: "Pretérito indefinido : verbes en -ir à alternance" },
    tenses: ["pret"],
    verbs: ["pedir", "servir", "repetir", "seguir", "conseguir", "sentir", "preferir", "mentir", "dormir", "morir", "elegir", "corregir", "divertirse", "vestirse", "sentirse", "dormirse"],
    prerequisites: ["c-pret-irregular"],
    lesson: {
      summary: {
        en: "-ir verbs with a present stem change also change in the third persons of the indefinido: e → i, o → u.",
        fr: "Les verbes en -ir à alternance au présent changent aussi aux troisièmes personnes de l'indefinido : e → i, o → u.",
      },
      rules: [
        { en: "pedir: pedí, pediste, pidió, pedimos, pedisteis, pidieron.", fr: "pedir : pedí, pediste, pidió, pedimos, pedisteis, pidieron." },
        { en: "dormir: dormí, dormiste, durmió, dormimos, dormisteis, durmieron. sentir → sintió, sintieron.", fr: "dormir : dormí, dormiste, durmió, dormimos, dormisteis, durmieron. sentir → sintió, sintieron." },
        { en: "-ar and -er stem changers are regular in the indefinido: pensé, pensó; volví, volvió.", fr: "Les verbes en -ar et -er à diphtongue sont réguliers à l'indefinido : pensé, pensó ; volví, volvió." },
      ],
      examples: [
        { es: "El camarero nos sirvió y luego pidió disculpas.", en: "The waiter served us and then apologised.", fr: "Le serveur nous a servis puis s'est excusé." },
        { es: "Durmieron poco porque se divirtieron hasta tarde.", en: "They slept little because they had fun until late.", fr: "Ils ont peu dormi parce qu'ils se sont amusés tard." },
      ],
      exceptions: [],
      pitfalls: [
        { en: "The same weak stem appears in the gerund (pidiendo, durmiendo) and the imperfect subjunctive (pidiera).", fr: "Le même radical apparaît au gérondif (pidiendo, durmiendo) et au subjonctif imparfait (pidiera)." },
      ],
      tableVerbs: ["pedir", "dormir", "sentir"],
    },
  },
  {
    id: "c-impf",
    cefr: "A2",
    title: { en: "Pretérito imperfecto", fr: "Pretérito imperfecto" },
    tenses: ["impf"],
    verbs: [...REGULAR.slice(0, 30), "ser", "ir", "ver", "tener", "estar", "hacer", "poder", "querer", "saber", "vivir", "pensar", "volver"],
    prerequisites: ["c-pret-regular"],
    lesson: {
      summary: {
        en: "The imperfect describes background, habits and ongoing states in the past. It is the most regular tense: only ser, ir and ver are irregular.",
        fr: "L'imparfait décrit le cadre, les habitudes et les états passés. C'est le temps le plus régulier : seuls ser, ir et ver sont irréguliers.",
      },
      rules: [
        { en: "-ar: -aba, -abas, -aba, -ábamos, -abais, -aban. -er/-ir: -ía, -ías, -ía, -íamos, -íais, -ían.", fr: "-ar : -aba, -abas, -aba, -ábamos, -abais, -aban. -er/-ir : -ía, -ías, -ía, -íamos, -íais, -ían." },
        { en: "ser: era, eras, era, éramos, erais, eran. ir: iba, ibas, iba, íbamos, ibais, iban. ver: veía.", fr: "ser : era, eras, era, éramos, erais, eran. ir : iba, ibas, iba, íbamos, ibais, iban. ver : veía." },
        { en: "No stem changes: pensaba, podía, dormía.", fr: "Aucune alternance : pensaba, podía, dormía." },
      ],
      examples: [
        { es: "Cuando vivía en Granada, iba a la facultad en bici.", en: "When I lived in Granada, I used to cycle to university.", fr: "Quand j'habitais à Grenade, j'allais à la fac à vélo." },
        { es: "Era tarde y llovía.", en: "It was late and it was raining.", fr: "Il était tard et il pleuvait." },
      ],
      exceptions: [],
      pitfalls: [
        { en: "Yo and él forms are identical (hablaba); add the subject if needed.", fr: "Les formes yo et él sont identiques (hablaba) ; précisez le sujet si nécessaire." },
      ],
      tableVerbs: ["hablar", "ser", "ir"],
    },
  },
  {
    id: "c-fut",
    cefr: "A2",
    title: { en: "Futuro simple", fr: "Futur simple" },
    tenses: ["fut"],
    verbs: [...REGULAR.slice(0, 25), "tener", "hacer", "poder", "poner", "decir", "venir", "salir", "saber", "querer", "haber", "valer", "mantener", "proponer"],
    prerequisites: ["c-impf"],
    lesson: {
      summary: {
        en: "Endings are added to the whole infinitive and are the same for all three classes: -é, -ás, -á, -emos, -éis, -án.",
        fr: "Les terminaisons s'ajoutent à l'infinitif complet et sont les mêmes pour les trois groupes : -é, -ás, -á, -emos, -éis, -án.",
      },
      rules: [
        { en: "hablaré, comerás, vivirá, iremos, seréis, estarán.", fr: "hablaré, comerás, vivirá, iremos, seréis, estarán." },
        { en: "Irregular stems: tendr-, pondr-, saldr-, vendr-, valdr-, podr-, sabr-, habr-, querr-, har-, dir-.", fr: "Radicaux irréguliers : tendr-, pondr-, saldr-, vendr-, valdr-, podr-, sabr-, habr-, querr-, har-, dir-." },
        { en: "The future also expresses probability in the present: Serán las diez (It must be about ten).", fr: "Le futur exprime aussi la probabilité au présent : Serán las diez (Il doit être environ dix heures)." },
      ],
      examples: [
        { es: "El año que viene haré un máster y tendré más tiempo.", en: "Next year I'll do a master's and I'll have more time.", fr: "L'année prochaine, je ferai un master et j'aurai plus de temps." },
        { es: "¿Dónde estará Pablo? Estará en el tráfico.", en: "Where can Pablo be? He's probably stuck in traffic.", fr: "Où peut bien être Pablo ? Il doit être dans les bouchons." },
      ],
      exceptions: [],
      pitfalls: [
        { en: "All forms except nosotros carry an accent: hablaré, hablarás, hablará, hablaremos, hablaréis, hablarán.", fr: "Toutes les formes sauf nosotros portent un accent : hablaré, hablarás, hablará, hablaremos, hablaréis, hablarán." },
      ],
      tableVerbs: ["hablar", "tener", "hacer"],
    },
  },
  {
    id: "c-cond",
    cefr: "A2",
    title: { en: "Condicional simple", fr: "Conditionnel présent" },
    tenses: ["cond"],
    verbs: [...REGULAR.slice(0, 25), "tener", "hacer", "poder", "poner", "decir", "venir", "salir", "saber", "querer", "haber"],
    prerequisites: ["c-fut"],
    lesson: {
      summary: {
        en: "The conditional uses the future stem with the -er/-ir imperfect endings: -ía, -ías, -ía, -íamos, -íais, -ían.",
        fr: "Le conditionnel utilise le radical du futur avec les terminaisons de l'imparfait en -er/-ir : -ía, -ías, -ía, -íamos, -íais, -ían.",
      },
      rules: [
        { en: "hablaría, comerías, viviría; tendría, haría, diría, podría, querría.", fr: "hablaría, comerías, viviría ; tendría, haría, diría, podría, querría." },
        { en: "Uses: hypothesis (yo no lo haría), politeness (¿Podrías ayudarme?), probability in the past (Serían las diez).", fr: "Emplois : hypothèse (yo no lo haría), politesse (¿Podrías ayudarme?), probabilité dans le passé (Serían las diez)." },
      ],
      examples: [
        { es: "Con más tiempo, viajaríamos más.", en: "With more time, we would travel more.", fr: "Avec plus de temps, nous voyagerions davantage." },
        { es: "¿Te importaría cerrar la ventana?", en: "Would you mind closing the window?", fr: "Ça te dérangerait de fermer la fenêtre ?" },
      ],
      exceptions: [],
      pitfalls: [
        { en: "Never use the conditional after si in hypotheses: Si tuviera tiempo, iría (not *si tendría).", fr: "Jamais de conditionnel après si : Si tuviera tiempo, iría (et non *si tendría)." },
      ],
      tableVerbs: ["hablar", "poder", "decir"],
    },
  },
  {
    id: "c-imper-aff",
    cefr: "A2",
    title: { en: "Affirmative imperative", fr: "Impératif affirmatif" },
    tenses: ["imper_aff"],
    verbs: ["hablar", "comer", "escribir", "abrir", "esperar", "mirar", "escuchar", "leer", "pensar", "volver", "pedir", "seguir", "tener", "hacer", "poner", "decir", "venir", "salir", "ir", "ser", "dar", "traer", "mantener", "proponer"],
    prerequisites: ["c-pres-e-i"],
    lesson: {
      summary: {
        en: "Tú uses the third-person present (habla); vosotros replaces the -r of the infinitive with -d (hablad). Usted, ustedes and nosotros use present subjunctive forms.",
        fr: "Tú reprend la 3e personne du présent (habla) ; vosotros remplace le -r de l'infinitif par -d (hablad). Usted, ustedes et nosotros empruntent le subjonctif présent.",
      },
      rules: [
        { en: "hablar: habla (tú), hable (usted), hablemos (nosotros), hablad (vosotros), hablen (ustedes).", fr: "hablar : habla (tú), hable (usted), hablemos (nosotros), hablad (vosotros), hablen (ustedes)." },
        { en: "Irregular tú: di, haz, ve, pon, sal, sé, ten, ven. Compounds keep them with an accent: mantén, propón.", fr: "Tú irrégulier : di, haz, ve, pon, sal, sé, ten, ven. Les composés les gardent avec accent : mantén, propón." },
        { en: "Stem changes follow the present: piensa, vuelve, pide, sigue.", fr: "Les alternances suivent le présent : piensa, vuelve, pide, sigue." },
      ],
      examples: [
        { es: "Ven aquí y di la verdad.", en: "Come here and tell the truth.", fr: "Viens ici et dis la vérité." },
        { es: "Esperad un momento, por favor.", en: "Wait a moment, please (to several people).", fr: "Attendez un instant, s'il vous plaît (à plusieurs personnes)." },
      ],
      exceptions: [
        { en: "ir: ve, vaya, vamos, id, vayan. Vayamos also exists but vamos is usual for 'let's go'.", fr: "ir : ve, vaya, vamos, id, vayan. Vayamos existe, mais vamos est l'usage courant pour « allons-y »." },
      ],
      pitfalls: [
        { en: "In speech many Spaniards say *hablar for hablad; in writing and exams use the -d form.", fr: "À l'oral, on entend *hablar pour hablad ; à l'écrit et à l'examen, utilisez la forme en -d." },
      ],
      tableVerbs: ["hablar", "hacer", "ir"],
    },
  },
  {
    id: "c-imper-neg",
    cefr: "A2",
    title: { en: "Negative imperative", fr: "Impératif négatif" },
    tenses: ["imper_neg"],
    verbs: ["hablar", "comer", "escribir", "abrir", "olvidar", "preocupar", "tocar", "llegar", "pensar", "volver", "pedir", "tener", "hacer", "poner", "decir", "venir", "salir", "ir", "ser", "dar"].filter((v) => v !== "preocupar" && v !== "tocar"),
    prerequisites: ["c-imper-aff"],
    lesson: {
      summary: {
        en: "Every negative command uses no + present subjunctive, including tú and vosotros.",
        fr: "Tout impératif négatif se forme avec no + subjonctif présent, y compris pour tú et vosotros.",
      },
      rules: [
        { en: "no hables, no hable, no hablemos, no habléis, no hablen.", fr: "no hables, no hable, no hablemos, no habléis, no hablen." },
        { en: "Irregular subjunctive stems come from the yo form: no hagas, no pongas, no digas, no vengas, no salgas.", fr: "Les radicaux irréguliers viennent de la forme yo : no hagas, no pongas, no digas, no vengas, no salgas." },
        { en: "no vayas (ir), no seas (ser), no des (dar), no estés (estar).", fr: "no vayas (ir), no seas (ser), no des (dar), no estés (estar)." },
      ],
      examples: [
        { es: "No digas eso y no llegues tarde.", en: "Don't say that and don't be late.", fr: "Ne dis pas ça et n'arrive pas en retard." },
        { es: "No os preocupéis, no es grave.", en: "Don't worry (pl.), it's not serious.", fr: "Ne vous inquiétez pas, ce n'est pas grave." },
      ],
      exceptions: [],
      pitfalls: [
        { en: "Do not reuse the affirmative form: no hables, not *no habla.", fr: "Ne reprenez pas la forme affirmative : no hables, et non *no habla." },
      ],
      tableVerbs: ["hablar", "hacer", "ir"],
    },
  },
  {
    id: "c-imper-refl",
    cefr: "B1",
    title: { en: "Imperative with reflexive pronouns", fr: "Impératif et pronoms réfléchis" },
    tenses: ["imper_aff", "imper_neg"],
    verbs: REFLEXIVE.filter((v) => v !== "ponerse" || true),
    prerequisites: ["c-imper-neg", "c-reflexive"],
    lesson: {
      summary: {
        en: "Pronouns attach to affirmative commands and precede negative ones. Attaching a pronoun often requires a written accent to keep the stress.",
        fr: "Les pronoms s'attachent à l'impératif affirmatif et précèdent l'impératif négatif. L'enclise exige souvent un accent écrit pour conserver l'accent tonique.",
      },
      rules: [
        { en: "levántate, levántese, levantémonos, levantaos, levántense; no te levantes.", fr: "levántate, levántese, levantémonos, levantaos, levántense ; no te levantes." },
        { en: "Nosotros drops -s before nos (levantemos + nos → levantémonos); vosotros drops -d before os (levantad + os → levantaos).", fr: "Nosotros perd le -s devant nos (levantémonos) ; vosotros perd le -d devant os (levantaos)." },
        { en: "-ir verbs: vestíos, divertíos. Irse: vete, idos, vámonos.", fr: "Verbes en -ir : vestíos, divertíos. Irse : vete, idos, vámonos." },
      ],
      examples: [
        { es: "Siéntense, por favor, y no se preocupen.", en: "Please sit down (formal pl.) and don't worry.", fr: "Asseyez-vous, je vous prie, et ne vous inquiétez pas." },
        { es: "¡Vámonos! Y tú, ponte el abrigo.", en: "Let's go! And you, put your coat on.", fr: "Allons-y ! Et toi, mets ton manteau." },
      ],
      exceptions: [],
      pitfalls: [
        { en: "Count syllables: if the stress moves to the third syllable from the end, write the accent (cállate, quédense).", fr: "Comptez les syllabes : si l'accent tombe sur l'antépénultième, écrivez l'accent (cállate, quédense)." },
      ],
      tableVerbs: ["levantarse", "sentarse", "irse"],
    },
  },
  {
    id: "c-pres-subj-regular",
    cefr: "B1",
    title: { en: "Present subjunctive: regular and stem-changing", fr: "Subjonctif présent : réguliers et alternances" },
    tenses: ["pres_subj"],
    verbs: [...REGULAR.slice(0, 30), "pensar", "volver", "dormir", "sentir", "pedir", "seguir", "jugar", "empezar", "elegir", "preferir", "llegar", "buscar"],
    prerequisites: ["c-imper-neg"],
    lesson: {
      summary: {
        en: "Take the yo present, drop -o and add the 'opposite' vowel: -ar verbs take -e, -er/-ir verbs take -a.",
        fr: "Partez de la forme yo du présent, retirez le -o et ajoutez la voyelle « opposée » : -e pour les verbes en -ar, -a pour ceux en -er/-ir.",
      },
      rules: [
        { en: "hable, hables, hable, hablemos, habléis, hablen; coma...; viva...", fr: "hable, hables, hable, hablemos, habléis, hablen ; coma... ; viva..." },
        { en: "-ar/-er stem changers follow the boot (piense, pensemos); -ir stem changers also change in nosotros/vosotros: sintamos, durmamos, pidamos.", fr: "Les verbes en -ar/-er suivent le schéma habituel (piense, pensemos) ; ceux en -ir changent aussi à nosotros/vosotros : sintamos, durmamos, pidamos." },
        { en: "Spelling: busque, llegue, empiece, elija, siga.", fr: "Orthographe : busque, llegue, empiece, elija, siga." },
      ],
      examples: [
        { es: "Es importante que leáis el artículo antes del lunes.", en: "It's important that you read the article before Monday.", fr: "Il est important que vous lisiez l'article avant lundi." },
        { es: "Espero que duermas bien.", en: "I hope you sleep well.", fr: "J'espère que tu dormiras bien." },
      ],
      exceptions: [],
      pitfalls: [
        { en: "French uses the subjunctive after espérer only rarely; Spanish esperar que always takes it.", fr: "Après espérer, le français emploie l'indicatif ; esperar que exige toujours le subjonctif." },
      ],
      tableVerbs: ["hablar", "pensar", "pedir"],
    },
  },
  {
    id: "c-pres-subj-irregular",
    cefr: "B1",
    title: { en: "Present subjunctive: irregular verbs", fr: "Subjonctif présent : verbes irréguliers" },
    tenses: ["pres_subj"],
    verbs: ["ser", "estar", "ir", "haber", "saber", "dar", "ver", "tener", "hacer", "poner", "decir", "venir", "salir", "traer", "conocer", "conducir", "oír", "construir", "caer", "mantener", "proponer"],
    prerequisites: ["c-pres-subj-regular"],
    lesson: {
      summary: {
        en: "Irregular yo forms carry over to all persons (tengo → tenga, tengamos). Six verbs have their own stems.",
        fr: "La forme yo irrégulière s'étend à toutes les personnes (tengo → tenga, tengamos). Six verbes ont un radical propre.",
      },
      rules: [
        { en: "tenga, haga, diga, ponga, venga, salga, traiga, conozca, conduzca, oiga, construya.", fr: "tenga, haga, diga, ponga, venga, salga, traiga, conozca, conduzca, oiga, construya." },
        { en: "ser → sea, estar → esté, ir → vaya, haber → haya, saber → sepa, dar → dé.", fr: "ser → sea, estar → esté, ir → vaya, haber → haya, saber → sepa, dar → dé." },
      ],
      examples: [
        { es: "Ojalá haya plazas libres.", en: "Hopefully there are places left.", fr: "Pourvu qu'il reste des places." },
        { es: "No creo que sepan la respuesta.", en: "I don't think they know the answer.", fr: "Je ne pense pas qu'ils connaissent la réponse." },
      ],
      exceptions: [
        { en: "dé and esté carry accents; dé distinguishes the verb from the preposition de.", fr: "dé et esté portent un accent ; dé distingue le verbe de la préposition de." },
      ],
      pitfalls: [
        { en: "vaya, not *vaiga; haya, not *haiga (both non-standard).", fr: "vaya, et non *vaiga ; haya, et non *haiga (formes fautives)." },
      ],
      tableVerbs: ["ser", "ir", "tener"],
    },
  },
  {
    id: "c-pluscuam",
    cefr: "B1",
    title: { en: "Pluscuamperfecto", fr: "Plus-que-parfait" },
    tenses: ["pluscuam"],
    verbs: ["hablar", "comer", "salir", "terminar", "llegar", "hacer", "decir", "ver", "escribir", "volver", "poner", "ir", "leer", "irse", "empezar", "romper", "resolver"],
    prerequisites: ["c-impf", "c-perf"],
    lesson: {
      summary: {
        en: "Imperfect of haber + participle. It places an action before another past action.",
        fr: "Imparfait de haber + participe. Il situe une action antérieure à une autre action passée.",
      },
      rules: [
        { en: "había, habías, había, habíamos, habíais, habían + participle.", fr: "había, habías, había, habíamos, habíais, habían + participe." },
        { en: "Cuando llegué, el tren ya había salido.", fr: "Cuando llegué, el tren ya había salido." },
      ],
      examples: [
        { es: "Nunca había visto algo así.", en: "I had never seen anything like it.", fr: "Je n'avais jamais rien vu de pareil." },
        { es: "Me dijo que ya habían terminado el proyecto.", en: "He told me they had already finished the project.", fr: "Il m'a dit qu'ils avaient déjà terminé le projet." },
      ],
      exceptions: [],
      pitfalls: [
        { en: "Haber again for every verb: había ido, me había levantado.", fr: "Toujours haber : había ido (j'étais allé), me había levantado." },
      ],
      tableVerbs: ["hablar", "hacer", "ver"],
    },
  },
  {
    id: "c-fut-perf",
    cefr: "B1",
    title: { en: "Futuro compuesto", fr: "Futur antérieur" },
    tenses: ["fut_perf"],
    verbs: ["terminar", "llegar", "hacer", "decir", "ver", "volver", "escribir", "salir", "acabar", "resolver", "irse", "leer"].filter((v) => v !== "acabar"),
    prerequisites: ["c-fut", "c-perf"],
    lesson: {
      summary: {
        en: "Future of haber + participle: an action completed before a future moment, or a supposition about the recent past.",
        fr: "Futur de haber + participe : action achevée avant un moment futur, ou supposition sur un passé récent.",
      },
      rules: [
        { en: "habré, habrás, habrá, habremos, habréis, habrán + participle.", fr: "habré, habrás, habrá, habremos, habréis, habrán + participe." },
        { en: "Para el viernes habré terminado. ¿Habrá llegado ya? (supposition)", fr: "Para el viernes habré terminado. ¿Habrá llegado ya? (supposition)" },
      ],
      examples: [
        { es: "Dentro de un año habremos acabado la carrera.", en: "In a year we'll have finished our degree.", fr: "Dans un an, nous aurons fini nos études." },
        { es: "No contesta; se habrá dormido.", en: "He isn't answering; he must have fallen asleep.", fr: "Il ne répond pas ; il a dû s'endormir." },
      ],
      exceptions: [],
      pitfalls: [
        { en: "Spanish uses the present subjunctive, not this tense, after cuando: Cuando hayas terminado, llámame.", fr: "Après cuando, on emploie le subjonctif : Cuando hayas terminado, llámame (et non *habrás)." },
      ],
      tableVerbs: ["terminar", "hacer", "volver"],
    },
  },
  {
    id: "c-cond-perf",
    cefr: "B1",
    title: { en: "Condicional compuesto", fr: "Conditionnel passé" },
    tenses: ["cond_perf"],
    verbs: ["hablar", "ir", "hacer", "decir", "venir", "terminar", "llegar", "ver", "escribir", "volver", "poder", "comprar"],
    prerequisites: ["c-cond", "c-perf"],
    lesson: {
      summary: {
        en: "Conditional of haber + participle: what would have happened. Typical in past hypothetical sentences.",
        fr: "Conditionnel de haber + participe : ce qui serait arrivé. Fréquent dans les hypothèses passées.",
      },
      rules: [
        { en: "habría, habrías, habría, habríamos, habríais, habrían + participle.", fr: "habría, habrías, habría, habríamos, habríais, habrían + participe." },
        { en: "Si hubiera sabido, habría venido.", fr: "Si hubiera sabido, habría venido." },
      ],
      examples: [
        { es: "Con más tiempo, habríamos terminado el análisis.", en: "With more time, we would have finished the analysis.", fr: "Avec plus de temps, nous aurions terminé l'analyse." },
        { es: "Yo no lo habría dicho así.", en: "I wouldn't have put it that way.", fr: "Je ne l'aurais pas dit comme ça." },
      ],
      exceptions: [
        { en: "In speech the -ra form often replaces it: Si lo hubiera sabido, lo hubiera hecho.", fr: "À l'oral, la forme en -ra le remplace souvent : Si lo hubiera sabido, lo hubiera hecho." },
      ],
      pitfalls: [
        { en: "Not after si: si hubiera tenido, never *si habría tenido.", fr: "Jamais après si : si hubiera tenido, et non *si habría tenido." },
      ],
      tableVerbs: ["hablar", "hacer", "venir"],
    },
  },
  {
    id: "c-impf-subj",
    cefr: "B1",
    title: { en: "Imperfect subjunctive", fr: "Subjonctif imparfait" },
    tenses: ["impf_subj"],
    verbs: [...IRREG_CORE, "hablar", "comer", "vivir", "pedir", "dormir", "sentir", "leer", "conducir", "traer", "construir", "seguir", "mantener"],
    prerequisites: ["c-pret-ir-stem", "c-pres-subj-irregular"],
    lesson: {
      summary: {
        en: "Take the ellos form of the indefinido, drop -ron and add -ra, -ras, -ra, -ramos, -rais, -ran. Every irregularity of the indefinido carries over.",
        fr: "Partez de la forme ellos de l'indefinido, retirez -ron et ajoutez -ra, -ras, -ra, -ramos, -rais, -ran. Toutes les irrégularités de l'indefinido sont conservées.",
      },
      rules: [
        { en: "hablaron → hablara; tuvieron → tuviera; fueron → fuera; pidieron → pidiera; leyeron → leyera.", fr: "hablaron → hablara ; tuvieron → tuviera ; fueron → fuera ; pidieron → pidiera ; leyeron → leyera." },
        { en: "Nosotros carries an accent: habláramos, tuviéramos, fuéramos.", fr: "Nosotros porte un accent : habláramos, tuviéramos, fuéramos." },
        { en: "The -se forms (hablase, tuviese) are equivalent and accepted.", fr: "Les formes en -se (hablase, tuviese) sont équivalentes et acceptées." },
      ],
      examples: [
        { es: "Me pidió que le enviara los datos.", en: "She asked me to send her the data.", fr: "Elle m'a demandé de lui envoyer les données." },
        { es: "Si tuviéramos más tiempo, iríamos.", en: "If we had more time, we would go.", fr: "Si nous avions plus de temps, nous irions." },
      ],
      exceptions: [],
      pitfalls: [
        { en: "French si + imparfait corresponds to Spanish si + imperfect subjunctive: si tuviera, not *si tenía.", fr: "Le français si + imparfait correspond à si + subjonctif imparfait : si tuviera, et non *si tenía." },
      ],
      tableVerbs: ["hablar", "tener", "ser"],
    },
  },
  {
    id: "c-perf-subj",
    cefr: "B1",
    title: { en: "Perfect subjunctive", fr: "Subjonctif passé" },
    tenses: ["perf_subj"],
    verbs: ["terminar", "llegar", "hacer", "decir", "ver", "volver", "escribir", "salir", "resolver", "leer", "irse", "entender", "aprobar"].filter((v) => v !== "aprobar"),
    prerequisites: ["c-pres-subj-irregular", "c-perf"],
    lesson: {
      summary: {
        en: "Present subjunctive of haber + participle, where the main clause requires the subjunctive and the action is completed.",
        fr: "Subjonctif présent de haber + participe, quand la principale exige le subjonctif et que l'action est accomplie.",
      },
      rules: [
        { en: "haya, hayas, haya, hayamos, hayáis, hayan + participle.", fr: "haya, hayas, haya, hayamos, hayáis, hayan + participe." },
        { en: "Espero que hayas descansado. Cuando hayáis terminado, avisadme.", fr: "Espero que hayas descansado. Cuando hayáis terminado, avisadme." },
      ],
      examples: [
        { es: "No creo que hayan entendido la pregunta.", en: "I don't think they've understood the question.", fr: "Je ne pense pas qu'ils aient compris la question." },
        { es: "Me alegra que hayáis venido.", en: "I'm glad you've come.", fr: "Je suis content que vous soyez venus." },
      ],
      exceptions: [],
      pitfalls: [
        { en: "French être auxiliaries become haber: que vous soyez venus = que hayáis venido.", fr: "L'auxiliaire être devient haber : que vous soyez venus = que hayáis venido." },
      ],
      tableVerbs: ["terminar", "ver", "volver"],
    },
  },
  {
    id: "c-pluscuam-subj",
    cefr: "B2",
    title: { en: "Pluperfect subjunctive", fr: "Subjonctif plus-que-parfait" },
    tenses: ["pluscuam_subj"],
    verbs: ["saber", "tener", "hacer", "decir", "ver", "venir", "estudiar", "llegar", "ir", "poder", "escuchar", "salir"],
    prerequisites: ["c-impf-subj", "c-cond-perf"],
    lesson: {
      summary: {
        en: "Imperfect subjunctive of haber + participle. Essential for unreal conditions in the past and regrets.",
        fr: "Subjonctif imparfait de haber + participe. Indispensable pour les hypothèses irréelles du passé et les regrets.",
      },
      rules: [
        { en: "hubiera (hubiese), hubieras, hubiera, hubiéramos, hubierais, hubieran + participle.", fr: "hubiera (hubiese), hubieras, hubiera, hubiéramos, hubierais, hubieran + participe." },
        { en: "Si hubiera estudiado, habría aprobado. Ojalá me lo hubieras dicho.", fr: "Si hubiera estudiado, habría aprobado. Ojalá me lo hubieras dicho." },
      ],
      examples: [
        { es: "Si hubiéramos salido antes, no habríamos perdido el tren.", en: "If we had left earlier, we wouldn't have missed the train.", fr: "Si nous étions partis plus tôt, nous n'aurions pas raté le train." },
        { es: "Me sorprendió que no hubieran llamado.", en: "I was surprised they hadn't called.", fr: "J'ai été surpris qu'ils n'aient pas appelé." },
      ],
      exceptions: [],
      pitfalls: [
        { en: "French plus-que-parfait after si = Spanish pluperfect subjunctive: si j'avais su = si hubiera sabido.", fr: "Si + plus-que-parfait français = subjonctif plus-que-parfait : si j'avais su = si hubiera sabido." },
      ],
      tableVerbs: ["saber", "hacer", "ir"],
    },
  },
  {
    id: "c-mixed-indicative",
    cefr: "B1",
    title: { en: "Mixed review: indicative tenses", fr: "Révision : temps de l'indicatif" },
    tenses: ["pres", "perf", "pret", "impf", "fut", "cond", "pluscuam"],
    verbs: MIXED,
    prerequisites: ["c-pluscuam", "c-cond"],
    lesson: {
      summary: {
        en: "Mixed practice across indicative tenses. The context of each sentence determines the tense.",
        fr: "Pratique mixte des temps de l'indicatif. Le contexte de chaque phrase détermine le temps.",
      },
      rules: [
        { en: "Hoy, esta semana, ya, todavía → perfecto. Ayer, en 2019, el año pasado → indefinido.", fr: "Hoy, esta semana, ya, todavía → perfecto. Ayer, en 2019, el año pasado → indefinido." },
        { en: "Habits and descriptions in the past → imperfecto. Earlier past → pluscuamperfecto.", fr: "Habitudes et descriptions passées → imperfecto. Antériorité dans le passé → pluscuamperfecto." },
      ],
      examples: [
        { es: "Antes trabajaba en Sevilla, pero el año pasado me mudé y este año he empezado un máster.", en: "I used to work in Seville, but last year I moved and this year I've started a master's.", fr: "Avant, je travaillais à Séville, mais l'an dernier j'ai déménagé et cette année j'ai commencé un master." },
      ],
      exceptions: [],
      pitfalls: [
        { en: "Read the time marker first; it usually decides the tense.", fr: "Lisez d'abord le marqueur temporel : il décide généralement du temps." },
      ],
      tableVerbs: [],
    },
  },
  {
    id: "c-mixed-subjunctive",
    cefr: "B2",
    title: { en: "Mixed review: subjunctive and imperative", fr: "Révision : subjonctif et impératif" },
    tenses: ["pres_subj", "impf_subj", "perf_subj", "pluscuam_subj", "imper_aff", "imper_neg"],
    verbs: MIXED,
    prerequisites: ["c-pluscuam-subj", "c-imper-refl"],
    lesson: {
      summary: {
        en: "Mixed practice of subjunctive tenses and commands, selected by the governing expression and the time frame.",
        fr: "Pratique mixte des temps du subjonctif et de l'impératif, choisis selon l'expression introductrice et le cadre temporel.",
      },
      rules: [
        { en: "Main clause in present or future → present or perfect subjunctive. Main clause in past or conditional → imperfect or pluperfect subjunctive.", fr: "Principale au présent ou au futur → subjonctif présent ou passé. Principale au passé ou au conditionnel → subjonctif imparfait ou plus-que-parfait." },
      ],
      examples: [
        { es: "Quiero que vengas. Quería que vinieras. Me alegra que hayas venido.", en: "I want you to come. I wanted you to come. I'm glad you've come.", fr: "Je veux que tu viennes. Je voulais que tu viennes. Je suis content que tu sois venu." },
      ],
      exceptions: [],
      pitfalls: [
        { en: "Check the tense of the governing verb before choosing the subjunctive tense.", fr: "Vérifiez le temps du verbe introducteur avant de choisir le temps du subjonctif." },
      ],
      tableVerbs: [],
    },
  },
];

export function getUnit(id: string): ConjugationUnit | undefined {
  return CONJUGATION_UNITS.find((u) => u.id === id);
}
