import type { BilingualLesson, GrammarExerciseSeed } from "./types";

/** The subjunctive and giving instructions (B1 to B2). */
export const LESSONS_4: Record<string, BilingualLesson> = {
  "g-subj-wishes": {
    summary: {
      en: "Verbs of wanting and influencing (querer, preferir, pedir, recomendar, permitir, prohibir) take que + subjunctive when someone else is to act. With the same subject, use the infinitive.",
      fr: "Les verbes de volonté et d'influence (querer, preferir, pedir, recomendar, permitir, prohibir) se construisent avec que + subjonctif quand c'est une autre personne qui agit. Avec le même sujet, on emploie l'infinitif.",
    },
    rules: [
      { en: "Different subjects: Quiero que vengas. Te pido que me llames. Prefieren que trabajemos desde casa.", fr: "Sujets différents : Quiero que vengas. Te pido que me llames. Prefieren que trabajemos desde casa." },
      { en: "Same subject: infinitive: Quiero venir (not *quiero que yo venga). Prefiero trabajar desde casa.", fr: "Même sujet : infinitif : Quiero venir (et non *quiero que yo venga). Prefiero trabajar desde casa." },
      { en: "Recomendar, aconsejar, permitir, prohibir and dejar can also take an infinitive with an indirect object: Te recomiendo leerlo = Te recomiendo que lo leas. Me permiten salir antes.", fr: "Recomendar, aconsejar, permitir, prohibir et dejar admettent aussi l'infinitif avec un complément indirect : Te recomiendo leerlo = Te recomiendo que lo leas. Me permiten salir antes." },
      { en: "Ojalá + subjunctive expresses a wish: Ojalá haga buen tiempo.", fr: "Ojalá + subjonctif exprime un souhait : Ojalá haga buen tiempo." },
    ],
    examples: [
      { es: "Mi jefa quiere que presente el proyecto el lunes.", en: "My boss wants me to present the project on Monday.", fr: "Ma cheffe veut que je présente le projet lundi." },
      { es: "Te recomiendo que reserves con tiempo.", en: "I recommend you book well in advance.", fr: "Je te recommande de réserver à l'avance." },
      { es: "Ojalá podamos vernos pronto.", en: "I hope we can see each other soon.", fr: "Pourvu que nous puissions nous voir bientôt." },
    ],
    exceptions: [
      { en: "Decir que + indicative reports information (Dice que viene); + subjunctive it passes on an order (Dice que vengas = he says you should come).", fr: "Decir que + indicatif rapporte une information (Dice que viene) ; + subjonctif, il transmet un ordre (Dice que vengas = il dit de venir)." },
    ],
    pitfalls: [
      { en: "'I want you to come' has no infinitive equivalent: Quiero que vengas.", fr: "« Je veux que tu viennes » = Quiero que vengas, comme en français ; attention aux formes irrégulières (vengas, hagas, tengas, vayas)." },
      { en: "Esperar que (hope) + subjunctive: Espero que te guste (not *te gustará).", fr: "Esperar que (espérer) + subjonctif : Espero que te guste (et non *te gustará)." },
    ],
  },
  "g-subj-emotion": {
    summary: {
      en: "Expressions of feeling and value judgement (me alegra que, me molesta que, siento que, es una pena que) take the subjunctive in the clause that follows.",
      fr: "Les expressions de sentiment et de jugement de valeur (me alegra que, me molesta que, siento que, es una pena que) entraînent le subjonctif dans la subordonnée.",
    },
    rules: [
      { en: "Gustar-type verbs + que + subjunctive: Me alegra que estés aquí. Me molesta que llegue tarde. No me gusta que me interrumpan.", fr: "Verbes du type gustar + que + subjonctif : Me alegra que estés aquí. Me molesta que llegue tarde. No me gusta que me interrumpan." },
      { en: "Sentir que (be sorry that), tener miedo de que, es una pena que, es normal que, es raro que + subjunctive: Siento que no puedas venir.", fr: "Sentir que (regretter que), tener miedo de que, es una pena que, es normal que, es raro que + subjonctif : Siento que no puedas venir." },
      { en: "Same subject: infinitive: Me alegro de verte. Siento llegar tarde.", fr: "Même sujet : infinitif : Me alegro de verte. Siento llegar tarde." },
      { en: "Alegrarse takes de que: Me alegro de que hayas venido; me alegra que has no de.", fr: "Alegrarse se construit avec de que : Me alegro de que hayas venido ; me alegra que, sans de." },
    ],
    examples: [
      { es: "Me encanta que mis amigos vengan a cenar los viernes.", en: "I love it when my friends come to dinner on Fridays.", fr: "J'adore que mes amis viennent dîner le vendredi." },
      { es: "Es una pena que no tengas vacaciones en agosto.", en: "It's a pity you don't have holidays in August.", fr: "C'est dommage que tu n'aies pas de vacances en août." },
      { es: "Siento llegar tarde: había mucho tráfico.", en: "Sorry I'm late: there was a lot of traffic.", fr: "Désolé d'arriver en retard : il y avait beaucoup de circulation." },
    ],
    exceptions: [
      { en: "Sentir meaning 'to feel, to sense' takes the indicative: Siento que hace frío.", fr: "Sentir au sens de « percevoir » prend l'indicatif : Siento que hace frío (je sens qu'il fait froid)." },
    ],
    pitfalls: [
      { en: "The subjunctive is used even for real facts: Me gusta que vivas cerca.", fr: "Le subjonctif s'emploie même pour un fait réel : Me gusta que vivas cerca." },
      { en: "Me alegro de que (with de), but me alegra que (without de).", fr: "Me alegro de que (avec de), mais me alegra que (sans de)." },
    ],
  },
  "g-subj-doubt": {
    summary: {
      en: "Affirming an opinion or a fact takes the indicative (creo que, es verdad que). Denying or doubting it takes the subjunctive (no creo que, dudo que, no es verdad que).",
      fr: "Affirmer une opinion ou un fait se dit à l'indicatif (creo que, es verdad que). Le nier ou en douter entraîne le subjonctif (no creo que, dudo que, no es verdad que).",
    },
    rules: [
      { en: "Creo que, pienso que, me parece que, estoy seguro de que + indicative: Creo que tienes razón.", fr: "Creo que, pienso que, me parece que, estoy seguro de que + indicatif : Creo que tienes razón." },
      { en: "No creo que, no pienso que, no me parece que + subjunctive: No creo que tengas razón.", fr: "No creo que, no pienso que, no me parece que + subjonctif : No creo que tengas razón." },
      { en: "Dudar que + subjunctive: Dudo que lleguen a tiempo. Es verdad que / está claro que + indicative; no es verdad que / no está claro que + subjunctive.", fr: "Dudar que + subjonctif : Dudo que lleguen a tiempo. Es verdad que / está claro que + indicatif ; no es verdad que / no está claro que + subjonctif." },
      { en: "Quizás and tal vez take either mood (the subjunctive sounds less likely): Quizás viene / Quizás venga. A lo mejor always takes the indicative.", fr: "Quizás et tal vez admettent les deux modes (le subjonctif paraît moins probable) : Quizás viene / Quizás venga. A lo mejor se construit toujours avec l'indicatif." },
    ],
    examples: [
      { es: "Creo que el proyecto es viable, pero no creo que lo terminemos este año.", en: "I think the project is feasible, but I don't think we'll finish it this year.", fr: "Je pense que le projet est faisable, mais je ne pense pas que nous le terminions cette année." },
      { es: "Dudo que el precio baje; a lo mejor sube.", en: "I doubt the price will go down; it may even go up.", fr: "Je doute que le prix baisse ; il va peut-être même augmenter." },
    ],
    exceptions: [
      { en: "A negative question that seeks agreement keeps the indicative: ¿No crees que es demasiado caro?", fr: "Une question négative qui cherche l'accord garde l'indicatif : ¿No crees que es demasiado caro?" },
    ],
    pitfalls: [
      { en: "'I don't think it is' keeps the same tense in English; Spanish switches to the subjunctive: No pienso que sea fácil.", fr: "À l'oral, le français tolère l'indicatif après « je ne pense pas que » ; l'espagnol exige le subjonctif : No pienso que sea fácil." },
      { en: "Creo que + subjunctive is wrong: Creo que es (not *sea) importante.", fr: "Creo que + subjonctif est fautif : Creo que es (et non *sea) importante." },
    ],
  },
  "g-subj-impersonal": {
    summary: {
      en: "Impersonal expressions of necessity, possibility or evaluation (es importante, es necesario, es posible que) take the subjunctive; expressions of certainty (es evidente, es cierto, es obvio que) take the indicative.",
      fr: "Les expressions impersonnelles de nécessité, de possibilité ou d'évaluation (es importante, es necesario, es posible que) entraînent le subjonctif ; celles de certitude (es evidente, es cierto, es obvio que) l'indicatif.",
    },
    rules: [
      { en: "Es importante / necesario / posible / probable / lógico / mejor que + subjunctive: Es necesario que lo revisemos.", fr: "Es importante / necesario / posible / probable / lógico / mejor que + subjonctif : Es necesario que lo revisemos." },
      { en: "Es evidente / cierto / obvio / seguro que, está claro que + indicative: Es evidente que funciona.", fr: "Es evidente / cierto / obvio / seguro que, está claro que + indicatif : Es evidente que funciona." },
      { en: "Negated certainty takes the subjunctive: No es evidente que funcione.", fr: "La certitude niée entraîne le subjonctif : No es evidente que funcione." },
      { en: "Without a specific subject, use the infinitive: Es importante dormir bien.", fr: "Sans sujet précis, l'infinitif : Es importante dormir bien." },
    ],
    examples: [
      { es: "Es importante que todos entiendan el plan.", en: "It's important that everyone understands the plan.", fr: "Il est important que tout le monde comprenne le plan." },
      { es: "Es posible que lleguemos tarde, pero es seguro que llegaremos.", en: "We may arrive late, but we will certainly arrive.", fr: "Il est possible que nous arrivions en retard, mais il est sûr que nous arriverons." },
    ],
    exceptions: [],
    pitfalls: [
      { en: "Es probable que takes the subjunctive although it expresses likelihood: Es probable que llueva.", fr: "Es probable que + subjonctif, contrairement au français « il est probable qu'il pleuvra » : Es probable que llueva." },
      { en: "Es seguro que (certain) takes the indicative, but es posible que the subjunctive.", fr: "Es seguro que + indicatif, mais es posible que + subjonctif." },
    ],
  },
  "g-subj-time": {
    summary: {
      en: "Time clauses (cuando, en cuanto, hasta que, mientras) take the subjunctive when they refer to the future, and the indicative for habits and past events. Antes de que always takes the subjunctive.",
      fr: "Les subordonnées de temps (cuando, en cuanto, hasta que, mientras) prennent le subjonctif quand elles renvoient au futur, et l'indicatif pour les habitudes et le passé. Antes de que se construit toujours avec le subjonctif.",
    },
    rules: [
      { en: "Future: cuando + subjunctive: Cuando llegues, llámame. Te lo diré cuando lo sepa.", fr: "Futur : cuando + subjonctif : Cuando llegues, llámame. Te lo diré cuando lo sepa." },
      { en: "Habit or past: indicative: Cuando llego a casa, ceno. Cuando llegué, cené.", fr: "Habitude ou passé : indicatif : Cuando llego a casa, ceno. Cuando llegué, cené." },
      { en: "The same rule applies to en cuanto and tan pronto como (as soon as), hasta que (until), mientras (while, as long as), después de que (after).", fr: "La même règle vaut pour en cuanto et tan pronto como (dès que), hasta que (jusqu'à ce que), mientras (pendant que, tant que), después de que (après que)." },
      { en: "Antes de que + subjunctive always: Sal antes de que empiece a llover. With the same subject: antes de / después de + infinitive.", fr: "Antes de que + subjonctif toujours : Sal antes de que empiece a llover. Avec le même sujet : antes de / después de + infinitif." },
    ],
    examples: [
      { es: "En cuanto termine el informe, te lo envío.", en: "As soon as I finish the report, I'll send it to you.", fr: "Dès que j'aurai fini le rapport, je te l'envoie." },
      { es: "Esperaremos hasta que lleguen todos.", en: "We'll wait until everyone arrives.", fr: "Nous attendrons que tout le monde arrive." },
      { es: "Cuando era niño, iba al pueblo cada verano.", en: "When I was a child, I went to the village every summer.", fr: "Quand j'étais enfant, j'allais au village chaque été." },
    ],
    exceptions: [
      { en: "Cuándo with an accent is a question word and takes the indicative or the future: ¿Cuándo vendrás? No sé cuándo vendrá.", fr: "Cuándo avec accent est interrogatif et se construit avec l'indicatif ou le futur : ¿Cuándo vendrás? No sé cuándo vendrá." },
    ],
    pitfalls: [
      { en: "Never use the future after cuando: cuando llegues (not *cuando llegarás).", fr: "Contrairement au français (quand tu arriveras), jamais de futur après cuando : cuando llegues (et non *cuando llegarás)." },
    ],
  },
  "g-subj-purpose": {
    summary: {
      en: "Purpose and condition clauses introduced by para que, sin que, a menos que, con tal de que and en caso de que take the subjunctive. With the same subject, para and sin are followed by the infinitive.",
      fr: "Les subordonnées de but et de condition introduites par para que, sin que, a menos que, con tal de que et en caso de que prennent le subjonctif. Avec le même sujet, para et sin sont suivis de l'infinitif.",
    },
    rules: [
      { en: "Para que / a fin de que + subjunctive (purpose, different subject): Te lo explico para que lo entiendas.", fr: "Para que / a fin de que + subjonctif (but, sujet différent) : Te lo explico para que lo entiendas." },
      { en: "Same subject: para + infinitive: Lo explico para aclararlo.", fr: "Même sujet : para + infinitif : Lo explico para aclararlo." },
      { en: "Sin que (without), a menos que (unless), con tal de que (provided that), en caso de que (in case) + subjunctive: Sale sin que nadie lo vea. Iré, a menos que llueva.", fr: "Sin que (sans que), a menos que (à moins que), con tal de que (pourvu que), en caso de que (au cas où) + subjonctif : Sale sin que nadie lo vea. Iré, a menos que llueva." },
      { en: "¿Para qué...? (what for) takes the indicative in a direct question: ¿Para qué sirve esto?", fr: "¿Para qué...? (dans quel but) prend l'indicatif dans une question directe : ¿Para qué sirve esto?" },
    ],
    examples: [
      { es: "Habla más despacio para que todos te entiendan.", en: "Speak more slowly so that everyone understands you.", fr: "Parle plus lentement pour que tout le monde te comprenne." },
      { es: "En caso de que haya algún problema, llámame.", en: "In case there's any problem, call me.", fr: "Au cas où il y aurait un problème, appelle-moi." },
      { es: "Te presto el coche con tal de que me lo devuelvas mañana.", en: "I'll lend you the car provided you give it back to me tomorrow.", fr: "Je te prête la voiture pourvu que tu me la rendes demain." },
    ],
    exceptions: [],
    pitfalls: [
      { en: "Para que always takes the subjunctive, even when the result is likely: Te lo doy para que lo leas.", fr: "« Au cas où il pleuvrait » = en caso de que llueva : subjonctif, jamais de conditionnel." },
      { en: "With the same subject, use the infinitive: Estudio para aprobar (not *para que apruebe).", fr: "Avec le même sujet, l'infinitif : Estudio para aprobar (et non *para que apruebe)." },
    ],
  },
  "g-subj-concessive": {
    summary: {
      en: "Aunque takes the indicative for facts presented as true, and the subjunctive for hypotheses or for facts that do not change the outcome.",
      fr: "Aunque se construit avec l'indicatif pour un fait présenté comme vrai, et avec le subjonctif pour une hypothèse ou un fait qui ne change rien à la conclusion.",
    },
    rules: [
      { en: "Aunque + indicative: a real obstacle that is acknowledged: Aunque llueve, salimos (it is raining, but we're going out).", fr: "Aunque + indicatif : obstacle réel reconnu : Aunque llueve, salimos (il pleut, mais nous sortons)." },
      { en: "Aunque + subjunctive: a possible obstacle (even if): Aunque llueva, saldremos. Or a known fact presented as irrelevant: Aunque sea tu jefe, no tiene razón.", fr: "Aunque + subjonctif : obstacle éventuel (même si) : Aunque llueva, saldremos. Ou fait connu présenté comme sans importance : Aunque sea tu jefe, no tiene razón." },
      { en: "Por mucho que / por más que + subjunctive = however much: Por mucho que insistas, no voy a cambiar de opinión.", fr: "Por mucho que / por más que + subjonctif = avoir beau : Por mucho que insistas, no voy a cambiar de opinión." },
      { en: "A pesar de que follows the same logic as aunque; a pesar de + noun or infinitive: a pesar del frío, a pesar de estar cansado.", fr: "A pesar de que suit la même logique qu'aunque ; a pesar de + nom ou infinitif : a pesar del frío, a pesar de estar cansado." },
    ],
    examples: [
      { es: "Aunque es caro, lo voy a comprar porque lo necesito.", en: "Although it's expensive, I'm going to buy it because I need it.", fr: "Bien qu'il soit cher, je vais l'acheter parce que j'en ai besoin." },
      { es: "Aunque sea caro, lo compraré.", en: "Even if it's expensive, I'll buy it.", fr: "Même s'il est cher, je l'achèterai." },
      { es: "Por mucho que estudies la víspera, no lo aprenderás todo.", en: "However much you study the day before, you won't learn everything.", fr: "Tu auras beau étudier la veille, tu n'apprendras pas tout." },
    ],
    exceptions: [
      { en: "Por más que can take the indicative for a real, repeated fact: Por más que lo intento, no me sale.", fr: "Por más que peut prendre l'indicatif pour un fait réel et répété : Por más que lo intento, no me sale." },
    ],
    pitfalls: [
      { en: "Aunque + subjunctive is not a mistake: it changes the meaning to 'even if'.", fr: "« Même si » + présent se traduit souvent par aunque + subjonctif : Aunque no quieras, vendrás." },
    ],
  },
  "g-subj-relative": {
    summary: {
      en: "In a relative clause, the subjunctive marks an antecedent that is unknown, hypothetical or non-existent; the indicative marks a specific, known one.",
      fr: "Dans une relative, le subjonctif marque un antécédent inconnu, hypothétique ou inexistant ; l'indicatif, un antécédent précis et connu.",
    },
    rules: [
      { en: "Known antecedent → indicative: Busco a la chica que habla alemán (I know who she is).", fr: "Antécédent connu → indicatif : Busco a la chica que habla alemán (je sais de qui il s'agit)." },
      { en: "Unknown or hypothetical → subjunctive: Busco a alguien que hable alemán (anyone who does).", fr: "Antécédent inconnu ou hypothétique → subjonctif : Busco a alguien que hable alemán (n'importe qui qui le parle)." },
      { en: "Non-existent or negated → subjunctive: No hay nadie que lo sepa. No conozco ningún restaurante que abra los lunes.", fr: "Antécédent inexistant ou nié → subjonctif : No hay nadie que lo sepa. No conozco ningún restaurante que abra los lunes." },
      { en: "Open choices and the future: Haz lo que quieras. Los que lleguen tarde no podrán entrar.", fr: "Choix ouvert et futur : Haz lo que quieras. Los que lleguen tarde no podrán entrar." },
    ],
    examples: [
      { es: "Necesitamos un ingeniero que tenga experiencia en energía solar.", en: "We need an engineer who has experience in solar energy.", fr: "Nous avons besoin d'un ingénieur qui ait de l'expérience en énergie solaire." },
      { es: "¿Hay alguien aquí que sepa programar en C?", en: "Is there anyone here who can program in C?", fr: "Y a-t-il quelqu'un ici qui sache programmer en C ?" },
    ],
    exceptions: [
      { en: "Personal a goes with a known person and is often dropped with an unknown one: Busco a la secretaria / Busco una secretaria que hable inglés.", fr: "Le a personnel accompagne une personne connue et disparaît souvent avec une personne indéterminée : Busco a la secretaria / Busco una secretaria que hable inglés." },
    ],
    pitfalls: [
      { en: "English uses the same form in both cases ('who speaks'); Spanish distinguishes: la persona que habla / una persona que hable.", fr: "Le français emploie parfois le subjonctif (quelqu'un qui sache) ; l'espagnol l'impose dès que l'antécédent est indéterminé : una persona que hable." },
    ],
  },
  "g-imperative-use": {
    summary: {
      en: "Commands can be informal (tú, vosotros) or formal (usted, ustedes). In Spain the vosotros command is common, and requests are often softened with podrías or ¿te importa...?",
      fr: "L'impératif peut être familier (tú, vosotros) ou formel (usted, ustedes). En Espagne, l'impératif de vosotros est courant, et l'on adoucit souvent la demande avec podrías ou ¿te importa... ?",
    },
    rules: [
      { en: "Affirmative: tú habla, come, escribe; vosotros hablad, comed, escribid; usted hable, coma, escriba; ustedes hablen, coman, escriban.", fr: "Affirmatif : tú habla, come, escribe ; vosotros hablad, comed, escribid ; usted hable, coma, escriba ; ustedes hablen, coman, escriban." },
      { en: "Negative commands use the present subjunctive for all persons: no hables, no habléis, no hable, no hablen.", fr: "L'impératif négatif emprunte le présent du subjonctif à toutes les personnes : no hables, no habléis, no hable, no hablen." },
      { en: "Softening: ¿Podrías ayudarme? ¿Te importa cerrar la puerta? ¿Me pasas la sal? (the present as a request).", fr: "Adoucir : ¿Podrías ayudarme? ¿Te importa cerrar la puerta? ¿Me pasas la sal? (présent de demande)." },
      { en: "Written instructions often use the infinitive: Rellenar el formulario. No fumar.", fr: "Les consignes écrites emploient souvent l'infinitif : Rellenar el formulario. No fumar." },
    ],
    examples: [
      { es: "Chicos, sentaos y abrid el libro por la página diez.", en: "Guys, sit down and open your books at page ten.", fr: "Les enfants, asseyez-vous et ouvrez le livre à la page dix." },
      { es: "Por favor, espere aquí y no toque nada.", en: "Please wait here and don't touch anything.", fr: "Attendez ici, s'il vous plaît, et ne touchez à rien." },
      { es: "¿Te importa mandarme el enlace?", en: "Would you mind sending me the link?", fr: "Ça t'ennuie de m'envoyer le lien ?" },
    ],
    exceptions: [
      { en: "Irregular tú commands: di, haz, ve, pon, sal, sé, ten, ven.", fr: "Impératifs irréguliers de tú : di, haz, ve, pon, sal, sé, ten, ven." },
    ],
    pitfalls: [
      { en: "The vosotros command ends in -d (hablad); the infinitive (hablar) is heard in speech, but write -d.", fr: "L'impératif de vosotros se termine en -d (hablad) ; l'infinitif (hablar) s'entend à l'oral, mais on écrit -d." },
      { en: "Never use the affirmative form after no: no hables (not *no habla).", fr: "Jamais l'impératif affirmatif après no : no hables (et non *no habla)." },
    ],
  },
};

const ex = (
  concept: string,
  n: number,
  data: Omit<GrammarExerciseSeed, "id" | "concept">,
): GrammarExerciseSeed => ({ id: `${concept}-${n}`, concept, ...data });

export const EXERCISES_4: GrammarExerciseSeed[] = [
  // g-subj-wishes
  ex("g-subj-wishes", 1, { type: "fill", es: "Quiero que ___ (venir, tú) a la fiesta.", blanks: [["vengas"]], explanation: { en: "Querer que + subjunctive when the subjects differ.", fr: "Querer que + subjonctif quand les sujets sont différents." } }),
  ex("g-subj-wishes", 2, { type: "fill", es: "Mis padres prefieren que ___ (estudiar, yo) en Madrid.", blanks: [["estudie"]], explanation: { en: "Preferir que + subjunctive.", fr: "Preferir que + subjonctif." } }),
  ex("g-subj-wishes", 3, { type: "fill", es: "Te pido que no ___ (decir, tú) nada a nadie.", blanks: [["digas"]], explanation: { en: "Pedir que + subjunctive; decir → digas.", fr: "Pedir que + subjonctif ; decir → digas." } }),
  ex("g-subj-wishes", 4, { type: "choose", es: "Quiero ___ en un proyecto internacional.", options: ["trabajar", "que trabaje"], answers: ["trabajar"], explanation: { en: "Same subject: infinitive.", fr: "Même sujet : infinitif." } }),
  ex("g-subj-wishes", 5, { type: "correct", es: "Espero que te gustará el regalo.", answers: ["Espero que te guste el regalo."], explanation: { en: "Esperar que + subjunctive, never the future.", fr: "Esperar que + subjonctif, jamais le futur." } }),
  ex("g-subj-wishes", 6, { type: "translate", prompt: { en: "The doctor recommends that I walk every day.", fr: "Le médecin me recommande de marcher tous les jours." }, answers: ["El médico me recomienda que camine todos los días.", "El médico me recomienda caminar todos los días.", "La médica me recomienda que camine todos los días.", "El médico me recomienda que ande todos los días."], explanation: { en: "Recomendar que + subjunctive, or recomendar + infinitive.", fr: "Recomendar que + subjonctif, ou recomendar + infinitif." } }),
  ex("g-subj-wishes", 7, { type: "fill", es: "Ojalá ___ (hacer) buen tiempo el sábado.", blanks: [["haga"]], explanation: { en: "Ojalá + subjunctive.", fr: "Ojalá + subjonctif." } }),

  // g-subj-emotion
  ex("g-subj-emotion", 1, { type: "fill", es: "Me alegra que ___ (estar, tú) mejor.", blanks: [["estés"]], explanation: { en: "Feeling + que + subjunctive.", fr: "Sentiment + que + subjonctif." } }),
  ex("g-subj-emotion", 2, { type: "fill", es: "A mi madre le molesta que ___ (llegar, nosotros) tarde.", blanks: [["lleguemos"]], explanation: { en: "Molestar que + subjunctive; llegar → lleguemos (g → gu).", fr: "Molestar que + subjonctif ; llegar → lleguemos (g → gu)." } }),
  ex("g-subj-emotion", 3, { type: "fill", es: "Es una pena que no ___ (poder, ellos) venir.", blanks: [["puedan"]], explanation: { en: "Es una pena que + subjunctive.", fr: "Es una pena que + subjonctif." } }),
  ex("g-subj-emotion", 4, { type: "choose", es: "Siento ___ tan tarde; el tren se ha retrasado.", options: ["llegar", "que llegue"], answers: ["llegar"], explanation: { en: "Same subject: infinitive.", fr: "Même sujet : infinitif." } }),
  ex("g-subj-emotion", 5, { type: "fill", es: "Me alegro ___ que te guste el trabajo.", blanks: [["de"]], explanation: { en: "Alegrarse de que + subjunctive.", fr: "Alegrarse de que + subjonctif." } }),
  ex("g-subj-emotion", 6, { type: "correct", es: "No me gusta que la gente habla por el móvil en el tren.", answers: ["No me gusta que la gente hable por el móvil en el tren."], explanation: { en: "No me gusta que + subjunctive.", fr: "No me gusta que + subjonctif." } }),
  ex("g-subj-emotion", 7, { type: "translate", prompt: { en: "It's normal that you're nervous.", fr: "C'est normal que tu sois nerveux." }, answers: ["Es normal que estés nervioso.", "Es normal que estés nerviosa."], explanation: { en: "Es normal que + subjunctive; a state: estar.", fr: "Es normal que + subjonctif ; un état : estar." } }),

  // g-subj-doubt
  ex("g-subj-doubt", 1, { type: "fill", es: "Creo que ___ (tener, tú) razón.", blanks: [["tienes"]], explanation: { en: "Creo que + indicative.", fr: "Creo que + indicatif." } }),
  ex("g-subj-doubt", 2, { type: "fill", es: "No creo que ___ (tener, tú) razón.", blanks: [["tengas"]], explanation: { en: "No creo que + subjunctive.", fr: "No creo que + subjonctif." } }),
  ex("g-subj-doubt", 3, { type: "fill", es: "Dudo que ___ (llegar, ellos) a tiempo.", blanks: [["lleguen"]], explanation: { en: "Dudar que + subjunctive.", fr: "Dudar que + subjonctif." } }),
  ex("g-subj-doubt", 4, { type: "choose", es: "Es verdad que el examen ___ difícil.", options: ["es", "sea"], answers: ["es"], explanation: { en: "Affirmed truth: indicative.", fr: "Vérité affirmée : indicatif." } }),
  ex("g-subj-doubt", 5, { type: "choose", es: "A lo mejor ___ mañana.", options: ["llueve", "llueva"], answers: ["llueve"], explanation: { en: "A lo mejor always takes the indicative.", fr: "A lo mejor se construit toujours avec l'indicatif." } }),
  ex("g-subj-doubt", 6, { type: "correct", es: "No pienso que es una buena idea.", answers: ["No pienso que sea una buena idea."], explanation: { en: "Negated opinion: subjunctive.", fr: "Opinion niée : subjonctif." } }),
  ex("g-subj-doubt", 7, { type: "translate", prompt: { en: "I don't think he knows the answer.", fr: "Je ne pense pas qu'il connaisse la réponse." }, answers: ["No creo que sepa la respuesta.", "No pienso que sepa la respuesta."], explanation: { en: "No creo que + subjunctive; saber → sepa.", fr: "No creo que + subjonctif ; saber → sepa." } }),

  // g-subj-impersonal
  ex("g-subj-impersonal", 1, { type: "fill", es: "Es importante que ___ (dormir, tú) bien antes del examen.", blanks: [["duermas"]], explanation: { en: "Es importante que + subjunctive; dormir → duermas.", fr: "Es importante que + subjonctif ; dormir → duermas." } }),
  ex("g-subj-impersonal", 2, { type: "fill", es: "Es evidente que el sistema no ___ (funcionar).", blanks: [["funciona"]], explanation: { en: "Certainty: indicative.", fr: "Certitude : indicatif." } }),
  ex("g-subj-impersonal", 3, { type: "fill", es: "Es posible que ___ (llover) esta tarde.", blanks: [["llueva"]], explanation: { en: "Possibility: subjunctive.", fr: "Possibilité : subjonctif." } }),
  ex("g-subj-impersonal", 4, { type: "choose", es: "Es necesario ___ el formulario antes del viernes.", options: ["rellenar", "que rellena", "rellenando"], answers: ["rellenar"], explanation: { en: "No specific subject: infinitive.", fr: "Pas de sujet précis : infinitif." } }),
  ex("g-subj-impersonal", 5, { type: "choose", es: "No es cierto que el precio ___ incluido.", options: ["esté", "está"], answers: ["esté"], explanation: { en: "Negated certainty: subjunctive.", fr: "Certitude niée : subjonctif." } }),
  ex("g-subj-impersonal", 6, { type: "correct", es: "Es probable que mañana hará frío.", answers: ["Es probable que mañana haga frío."], explanation: { en: "Es probable que + subjunctive.", fr: "Es probable que + subjonctif." } }),
  ex("g-subj-impersonal", 7, { type: "translate", prompt: { en: "It's better that you call him.", fr: "Il vaut mieux que tu l'appelles." }, answers: ["Es mejor que lo llames.", "Es mejor que le llames.", "Mejor que lo llames."], explanation: { en: "Es mejor que + subjunctive.", fr: "Es mejor que + subjonctif." } }),

  // g-subj-time
  ex("g-subj-time", 1, { type: "fill", es: "Cuando ___ (llegar, tú) a casa, llámame.", blanks: [["llegues"]], explanation: { en: "Future event: cuando + subjunctive.", fr: "Événement futur : cuando + subjonctif." } }),
  ex("g-subj-time", 2, { type: "fill", es: "Cuando ___ (llegar, yo) a casa, siempre me ducho.", blanks: [["llego"]], explanation: { en: "Habit: cuando + indicative.", fr: "Habitude : cuando + indicatif." } }),
  ex("g-subj-time", 3, { type: "fill", es: "En cuanto ___ (saber, yo) algo, te aviso.", blanks: [["sepa"]], explanation: { en: "En cuanto + subjunctive for the future; saber → sepa.", fr: "En cuanto + subjonctif pour le futur ; saber → sepa." } }),
  ex("g-subj-time", 4, { type: "fill", es: "Vámonos antes de que ___ (empezar) a llover.", blanks: [["empiece"]], explanation: { en: "Antes de que always takes the subjunctive.", fr: "Antes de que se construit toujours avec le subjonctif." } }),
  ex("g-subj-time", 5, { type: "choose", es: "No me voy hasta que ___ el trabajo.", options: ["termine", "terminaré", "termino"], answers: ["termine"], explanation: { en: "Hasta que + subjunctive for the future.", fr: "Hasta que + subjonctif pour le futur." } }),
  ex("g-subj-time", 6, { type: "correct", es: "Cuando tendré tiempo, iré a verte.", answers: ["Cuando tenga tiempo, iré a verte."], explanation: { en: "Never the future after cuando.", fr: "Jamais de futur après cuando." } }),
  ex("g-subj-time", 7, { type: "translate", prompt: { en: "I'll tell you when I know.", fr: "Je te le dirai quand je le saurai." }, answers: ["Te lo diré cuando lo sepa.", "Cuando lo sepa, te lo diré.", "Te lo digo cuando lo sepa."], explanation: { en: "Cuando + subjunctive for a future event.", fr: "Cuando + subjonctif pour un événement futur." } }),

  // g-subj-purpose
  ex("g-subj-purpose", 1, { type: "fill", es: "Te lo explico para que lo ___ (entender, tú).", blanks: [["entiendas"]], explanation: { en: "Para que + subjunctive.", fr: "Para que + subjonctif." } }),
  ex("g-subj-purpose", 2, { type: "fill", es: "Trabajo los sábados para ___ (ganar) más dinero.", blanks: [["ganar"]], explanation: { en: "Same subject: para + infinitive.", fr: "Même sujet : para + infinitif." } }),
  ex("g-subj-purpose", 3, { type: "fill", es: "Siempre sale sin que nadie lo ___ (oír).", blanks: [["oiga"]], explanation: { en: "Sin que + subjunctive; oír → oiga.", fr: "Sin que + subjonctif ; oír → oiga." } }),
  ex("g-subj-purpose", 4, { type: "fill", es: "En caso de que ___ (haber) algún problema, llámame.", blanks: [["haya"]], explanation: { en: "En caso de que + subjunctive.", fr: "En caso de que + subjonctif." } }),
  ex("g-subj-purpose", 5, { type: "choose", es: "Iremos a la playa, a menos que ___ mal tiempo.", options: ["haga", "hace", "hará"], answers: ["haga"], explanation: { en: "A menos que + subjunctive.", fr: "A menos que + subjonctif." } }),
  ex("g-subj-purpose", 6, { type: "correct", es: "Estudio mucho para que apruebe el examen.", answers: ["Estudio mucho para aprobar el examen."], explanation: { en: "Same subject: para + infinitive.", fr: "Même sujet : para + infinitif." } }),
  ex("g-subj-purpose", 7, { type: "translate", prompt: { en: "Speak louder so that we can hear you.", fr: "Parle plus fort pour que nous puissions t'entendre." }, answers: ["Habla más alto para que te oigamos.", "Habla más alto para que podamos oírte.", "Habla más alto para que te podamos oír.", "Habla más fuerte para que te oigamos.", "Habla más fuerte para que podamos oírte."], explanation: { en: "Different subjects: para que + subjunctive.", fr: "Sujets différents : para que + subjonctif." } }),

  // g-subj-concessive
  ex("g-subj-concessive", 1, { type: "distinguish", es: "Aunque ___ (llover) ahora mismo, vamos a salir. Aunque ___ (llover) mañana, saldremos.", blanks: [["llueve", "está lloviendo"], ["llueva"]], explanation: { en: "A real fact → indicative; a possible obstacle → subjunctive.", fr: "Fait réel → indicatif ; obstacle éventuel → subjonctif." } }),
  ex("g-subj-concessive", 2, { type: "fill", es: "Por mucho que ___ (insistir, tú), no voy a ir.", blanks: [["insistas"]], explanation: { en: "Por mucho que + subjunctive.", fr: "Por mucho que + subjonctif." } }),
  ex("g-subj-concessive", 3, { type: "fill", es: "A pesar ___ cansancio, terminó la carrera.", blanks: [["del"]], explanation: { en: "A pesar de + noun (de + el = del).", fr: "A pesar de + nom (de + el = del)." } }),
  ex("g-subj-concessive", 4, { type: "choose", es: "Aunque ___ tu hermano, no le voy a prestar más dinero.", options: ["sea", "será"], answers: ["sea"], explanation: { en: "A known fact presented as irrelevant: subjunctive.", fr: "Fait connu présenté comme sans importance : subjonctif." } }),
  ex("g-subj-concessive", 5, { type: "correct", es: "Aunque llegarás tarde, te esperaremos.", answers: ["Aunque llegues tarde, te esperaremos."], explanation: { en: "Future hypothesis: aunque + subjunctive.", fr: "Hypothèse future : aunque + subjonctif." } }),
  ex("g-subj-concessive", 6, { type: "translate", prompt: { en: "Even if it's expensive, I'll buy it.", fr: "Même si c'est cher, je l'achèterai." }, answers: ["Aunque sea caro, lo compraré.", "Aunque sea caro, lo voy a comprar."], explanation: { en: "Even if → aunque + subjunctive.", fr: "Même si → aunque + subjonctif." } }),
  ex("g-subj-concessive", 7, { type: "fill", es: "A pesar de que ___ (tener, él) poco tiempo, nos ayudó.", blanks: [["tenía"]], explanation: { en: "A real past fact: indicative.", fr: "Fait passé réel : indicatif." } }),

  // g-subj-relative
  ex("g-subj-relative", 1, { type: "distinguish", es: "Tengo un compañero que ___ (hablar) ruso. Busco a alguien que ___ (hablar) ruso.", blanks: [["habla"], ["hable"]], explanation: { en: "Known person → indicative; unknown person → subjunctive.", fr: "Personne connue → indicatif ; personne inconnue → subjonctif." } }),
  ex("g-subj-relative", 2, { type: "fill", es: "No hay nadie que ___ (saber) la respuesta.", blanks: [["sepa"]], explanation: { en: "Non-existent antecedent: subjunctive.", fr: "Antécédent inexistant : subjonctif." } }),
  ex("g-subj-relative", 3, { type: "fill", es: "Queremos un piso que ___ (tener) terraza.", blanks: [["tenga"]], explanation: { en: "A flat we have not found yet: subjunctive.", fr: "Un appartement pas encore trouvé : subjonctif." } }),
  ex("g-subj-relative", 4, { type: "fill", es: "Haz lo que ___ (querer, tú).", blanks: [["quieras"]], explanation: { en: "An open choice: subjunctive.", fr: "Choix ouvert : subjonctif." } }),
  ex("g-subj-relative", 5, { type: "choose", es: "Conozco un restaurante que ___ muy bien.", options: ["está", "esté"], answers: ["está"], explanation: { en: "A restaurant I know: indicative.", fr: "Un restaurant que je connais : indicatif." } }),
  ex("g-subj-relative", 6, { type: "correct", es: "Necesito un libro que explica bien el subjuntivo; ¿me recomiendas alguno?", answers: ["Necesito un libro que explique bien el subjuntivo; ¿me recomiendas alguno?"], explanation: { en: "The book is not yet identified: subjunctive.", fr: "Le livre n'est pas encore identifié : subjonctif." } }),
  ex("g-subj-relative", 7, { type: "translate", prompt: { en: "Is there anyone who can help me?", fr: "Y a-t-il quelqu'un qui puisse m'aider ?" }, answers: ["¿Hay alguien que pueda ayudarme?", "¿Hay alguien que me pueda ayudar?"], explanation: { en: "Hypothetical antecedent: subjunctive.", fr: "Antécédent hypothétique : subjonctif." } }),

  // g-imperative-use
  ex("g-imperative-use", 1, { type: "fill", es: "(vosotros) ___ (abrir) las ventanas, por favor.", blanks: [["Abrid"]], explanation: { en: "Vosotros command: infinitive -r → -d.", fr: "Impératif de vosotros : -r de l'infinitif → -d." } }),
  ex("g-imperative-use", 2, { type: "fill", es: "(usted) ___ (pasar), por favor.", blanks: [["Pase"]], explanation: { en: "Usted command: present subjunctive form.", fr: "Impératif de usted : forme du présent du subjonctif." } }),
  ex("g-imperative-use", 3, { type: "fill", es: "(tú) No ___ (hacer) ruido, que el bebé duerme.", blanks: [["hagas"]], explanation: { en: "Negative command: present subjunctive.", fr: "Impératif négatif : présent du subjonctif." } }),
  ex("g-imperative-use", 4, { type: "fill", es: "(tú) ___ (venir) aquí y ___ (decir + me) la verdad.", blanks: [["Ven"], ["dime"]], explanation: { en: "Irregular tú commands: ven, di (+ me = dime).", fr: "Impératifs irréguliers de tú : ven, di (+ me = dime)." } }),
  ex("g-imperative-use", 5, { type: "choose", es: "(ustedes) No ___ en la sala, por favor.", options: ["fumen", "fuman", "fumad"], answers: ["fumen"], explanation: { en: "Negative ustedes command: present subjunctive.", fr: "Impératif négatif de ustedes : présent du subjonctif." } }),
  ex("g-imperative-use", 6, { type: "correct", es: "Niños, no habláis tan alto.", answers: ["Niños, no habléis tan alto."], explanation: { en: "Negative vosotros command: habléis.", fr: "Impératif négatif de vosotros : habléis." } }),
  ex("g-imperative-use", 7, { type: "translate", prompt: { en: "Would you mind closing the door?", fr: "Ça te dérange de fermer la porte ?" }, answers: ["¿Te importa cerrar la puerta?", "¿Le importa cerrar la puerta?", "¿Te importaría cerrar la puerta?", "¿Le importaría cerrar la puerta?"], explanation: { en: "Softened request: ¿te importa + infinitive?", fr: "Demande adoucie : ¿te importa + infinitif ?" } }),
];
