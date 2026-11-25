import type { BilingualLesson, GrammarExerciseSeed } from "./types";

/** Conditions, reported speech and advanced usage (B1 to B2). */
export const LESSONS_5: Record<string, BilingualLesson> = {
  "g-conditionals-1": {
    summary: {
      en: "Real (possible) conditions use si + present indicative, followed by the present, the future or a command.",
      fr: "Les conditions réelles (possibles) se construisent avec si + présent de l'indicatif, suivi du présent, du futur ou de l'impératif.",
    },
    rules: [
      { en: "Si + present, present: general truths and habits: Si calientas el agua a 100 grados, hierve.", fr: "Si + présent, présent : vérités générales et habitudes : Si calientas el agua a 100 grados, hierve." },
      { en: "Si + present, future or ir a: a likely consequence: Si llueve, nos quedaremos en casa.", fr: "Si + présent, futur ou ir a : conséquence probable : Si llueve, nos quedaremos en casa." },
      { en: "Si + present, command: Si tienes dudas, pregúntame.", fr: "Si + présent, impératif : Si tienes dudas, pregúntame." },
      { en: "After si meaning 'if', never the future or the present subjunctive: *si lloverá, *si llueva.", fr: "Après si de condition, jamais de futur ni de présent du subjonctif : *si lloverá, *si llueva." },
    ],
    examples: [
      { es: "Si terminamos pronto, iremos al cine.", en: "If we finish early, we'll go to the cinema.", fr: "Si nous finissons tôt, nous irons au cinéma." },
      { es: "Si no entiendes algo, pregunta.", en: "If you don't understand something, ask.", fr: "Si tu ne comprends pas quelque chose, demande." },
    ],
    exceptions: [
      { en: "Como + subjunctive at the start of a sentence is a warning: Como llegues tarde, me voy sin ti.", fr: "Como + subjonctif en tête de phrase exprime un avertissement : Como llegues tarde, me voy sin ti." },
    ],
    pitfalls: [
      { en: "Si meaning 'whether' (indirect question) can take the future: No sé si vendrá.", fr: "Le si de l'interrogation indirecte (« si » = whether) admet le futur : No sé si vendrá." },
    ],
  },
  "g-conditionals-2": {
    summary: {
      en: "Unlikely or imaginary conditions about the present use si + imperfect subjunctive, followed by the conditional.",
      fr: "Les conditions improbables ou imaginaires sur le présent se construisent avec si + imparfait du subjonctif, suivi du conditionnel.",
    },
    rules: [
      { en: "Si + imperfect subjunctive, conditional: Si tuviera tiempo, aprendería japonés.", fr: "Si + imparfait du subjonctif, conditionnel : Si tuviera tiempo, aprendería japonés." },
      { en: "The imperfect subjunctive has two forms: tuviera or tuviese, hablara or hablase; the -ra form is more common in speech.", fr: "L'imparfait du subjonctif a deux formes : tuviera ou tuviese, hablara ou hablase ; la forme en -ra est la plus courante à l'oral." },
      { en: "Como si + imperfect subjunctive = as if: Habla como si fuera el jefe.", fr: "Como si + imparfait du subjonctif = comme si : Habla como si fuera el jefe." },
      { en: "De + infinitive can replace the si clause: De tener dinero, viajaría más.", fr: "De + infinitif peut remplacer la proposition en si : De tener dinero, viajaría más." },
    ],
    examples: [
      { es: "Si viviera cerca del mar, iría a nadar cada mañana.", en: "If I lived near the sea, I would go swimming every morning.", fr: "Si j'habitais près de la mer, j'irais nager tous les matins." },
      { es: "Si fuera tú, hablaría con ella antes de decidir.", en: "If I were you, I'd talk to her before deciding.", fr: "Si j'étais toi, je lui parlerais avant de décider." },
      { es: "Me miró como si no me conociera.", en: "He looked at me as if he didn't know me.", fr: "Il m'a regardé comme s'il ne me connaissait pas." },
    ],
    exceptions: [
      { en: "Never the conditional after si: *si tendría → si tuviera.", fr: "Jamais de conditionnel après si : *si tendría → si tuviera (comme « si j'avais », et non *si j'aurais)." },
    ],
    pitfalls: [
      { en: "English 'if I had' (a past form) is the imperfect subjunctive: si tuviera, never *si tenía.", fr: "Le français emploie l'imparfait de l'indicatif (si j'avais) ; l'espagnol exige l'imparfait du subjonctif : si tuviera, et non *si tenía." },
    ],
  },
  "g-conditionals-3": {
    summary: {
      en: "Conditions that did not happen in the past use si + pluperfect subjunctive, followed by the conditional perfect. Mixed conditions combine a past condition with a present result.",
      fr: "Les conditions non réalisées dans le passé se construisent avec si + plus-que-parfait du subjonctif, suivi du conditionnel passé. Les conditions mixtes associent une condition passée à une conséquence présente.",
    },
    rules: [
      { en: "Si + hubiera/hubiese + participle, habría + participle: Si hubiera estudiado, habría aprobado.", fr: "Si + hubiera/hubiese + participe, habría + participe : Si hubiera estudiado, habría aprobado." },
      { en: "In the result clause, hubiera + participle is also used: Si lo hubiera sabido, te lo hubiera dicho.", fr: "Dans la principale, on emploie aussi hubiera + participe : Si lo hubiera sabido, te lo hubiera dicho." },
      { en: "Mixed: past condition, present result: Si hubiera estudiado medicina, ahora sería médico.", fr: "Condition mixte : condition passée, conséquence présente : Si hubiera estudiado medicina, ahora sería médico." },
      { en: "De + haber + participle can replace the si clause: De haberlo sabido, no habría venido.", fr: "De + haber + participe peut remplacer la proposition en si : De haberlo sabido, no habría venido." },
    ],
    examples: [
      { es: "Si hubiéramos salido antes, no habríamos perdido el tren.", en: "If we had left earlier, we wouldn't have missed the train.", fr: "Si nous étions partis plus tôt, nous n'aurions pas raté le train." },
      { es: "Si me hubieras avisado, te habría esperado.", en: "If you had told me, I would have waited for you.", fr: "Si tu m'avais prévenu, je t'aurais attendu." },
    ],
    exceptions: [
      { en: "Never *si habría: the conditional cannot follow si.", fr: "Jamais *si habría : le conditionnel ne s'emploie pas après si." },
    ],
    pitfalls: [
      { en: "Haber is the only auxiliary: si hubiera ido (if I had gone), not *si fuera ido.", fr: "L'auxiliaire est toujours haber : si hubiera ido (si j'étais allé), et non *si fuera ido." },
    ],
  },
  "g-sequence-tenses": {
    summary: {
      en: "The tense of the subjunctive follows the main verb: a present or future main verb takes the present (or perfect) subjunctive; a past or conditional main verb takes the imperfect (or pluperfect) subjunctive.",
      fr: "Le temps du subjonctif dépend du verbe principal : un verbe principal au présent ou au futur appelle le présent (ou le passé) du subjonctif ; un verbe au passé ou au conditionnel appelle l'imparfait (ou le plus-que-parfait) du subjonctif.",
    },
    rules: [
      { en: "Present, future or command → present subjunctive: Quiero que vengas. Te pediré que vengas.", fr: "Présent, futur ou impératif → présent du subjonctif : Quiero que vengas. Te pediré que vengas." },
      { en: "Past or conditional → imperfect subjunctive: Quería que vinieras. Me pidió que viniera. Me gustaría que vinieras.", fr: "Passé ou conditionnel → imparfait du subjonctif : Quería que vinieras. Me pidió que viniera. Me gustaría que vinieras." },
      { en: "An earlier action: perfect subjunctive after a present (Me alegra que hayas venido), pluperfect subjunctive after a past (Me alegró que hubieras venido).", fr: "Action antérieure : passé du subjonctif après un présent (Me alegra que hayas venido), plus-que-parfait du subjonctif après un passé (Me alegró que hubieras venido)." },
      { en: "After a perfecto in the main clause, both are possible: Me ha pedido que venga / que viniera.", fr: "Après un perfecto dans la principale, les deux sont possibles : Me ha pedido que venga / que viniera." },
    ],
    examples: [
      { es: "Mi jefe quería que terminara el informe antes del viernes.", en: "My boss wanted me to finish the report before Friday.", fr: "Mon chef voulait que je termine le rapport avant vendredi." },
      { es: "Sería mejor que lo habláramos en persona.", en: "It would be better if we talked about it in person.", fr: "Il vaudrait mieux que nous en parlions en personne." },
      { es: "No creo que hayan llegado todavía.", en: "I don't think they've arrived yet.", fr: "Je ne pense pas qu'ils soient déjà arrivés." },
    ],
    exceptions: [
      { en: "A past main verb can take the present subjunctive when the action is still to come or still valid: Me dijo que lo llame mañana.", fr: "Un verbe principal au passé peut prendre le présent du subjonctif si l'action reste à venir ou toujours valable : Me dijo que lo llame mañana." },
    ],
    pitfalls: [
      { en: "Me gustaría que + imperfect subjunctive: Me gustaría que vinieras (not *vengas).", fr: "Me gustaría que + imparfait du subjonctif : Me gustaría que vinieras (et non *vengas)." },
    ],
  },
  "g-reported-speech": {
    summary: {
      en: "When reporting what someone said in the past, tenses usually move one step back, pronouns and time expressions change, and reported commands use que + subjunctive.",
      fr: "Pour rapporter des paroles au passé, les temps reculent généralement d'un cran, les pronoms et les repères de temps changent, et les ordres rapportés se construisent avec que + subjonctif.",
    },
    rules: [
      { en: "Backshift after a past reporting verb: present → imperfect (Dijo que estaba cansado); perfecto or indefinido → pluscuamperfecto (Dijo que había llegado); future → conditional (Dijo que vendría).", fr: "Recul des temps après un verbe introducteur au passé : présent → imparfait (Dijo que estaba cansado) ; perfecto ou indefinido → plus-que-parfait (Dijo que había llegado) ; futur → conditionnel (Dijo que vendría)." },
      { en: "Reported commands and requests: que + subjunctive: «Espera» → Me dijo que esperara. «¿Me ayudas?» → Me pidió que le ayudara.", fr: "Ordres et demandes rapportés : que + subjonctif : « Espera » → Me dijo que esperara. « ¿Me ayudas? » → Me pidió que le ayudara." },
      { en: "Questions: preguntar si (yes/no) or preguntar + question word: Me preguntó si tenía tiempo. Me preguntó dónde vivía.", fr: "Questions : preguntar si (oui/non) ou preguntar + interrogatif : Me preguntó si tenía tiempo. Me preguntó dónde vivía." },
      { en: "Time and place shift: hoy → aquel día, mañana → al día siguiente, ayer → el día anterior, aquí → allí, este → aquel.", fr: "Repères qui changent : hoy → aquel día, mañana → al día siguiente, ayer → el día anterior, aquí → allí, este → aquel." },
    ],
    examples: [
      { es: "«Llegaré mañana», dijo. → Dijo que llegaría al día siguiente.", en: "'I'll arrive tomorrow,' he said. → He said he would arrive the next day.", fr: "« J'arriverai demain », a-t-il dit. → Il a dit qu'il arriverait le lendemain." },
      { es: "Me pidió que le enviara el informe y me preguntó si había terminado.", en: "She asked me to send her the report and asked whether I had finished.", fr: "Elle m'a demandé de lui envoyer le rapport et m'a demandé si j'avais fini." },
    ],
    exceptions: [
      { en: "With a present reporting verb, tenses don't change: Dice que está cansado. Dice que vendrá.", fr: "Avec un verbe introducteur au présent, les temps ne changent pas : Dice que está cansado. Dice que vendrá." },
    ],
    pitfalls: [
      { en: "A reported command is never an infinitive: Me dijo que esperara (not *me dijo esperar).", fr: "Un ordre rapporté ne se met pas à l'infinitif comme en français (il m'a dit d'attendre) : Me dijo que esperara." },
    ],
  },
  "g-passive": {
    summary: {
      en: "Spanish has a passive with ser + participle, mostly in formal writing. In everyday language the pasiva refleja (se + verb) or an active sentence is preferred. Estar + participle describes the resulting state.",
      fr: "L'espagnol a un passif avec ser + participe, surtout à l'écrit formel. Dans la langue courante, on préfère la passive pronominale (se + verbe) ou une phrase active. Estar + participe décrit l'état résultant.",
    },
    rules: [
      { en: "Ser + participle (agreeing with the subject) + por + agent: El puente fue diseñado por una ingeniera.", fr: "Ser + participe (accordé avec le sujet) + por + agent : El puente fue diseñado por una ingeniera." },
      { en: "Estar + participle = the resulting state: El puente está terminado.", fr: "Estar + participe = l'état résultant : El puente está terminado." },
      { en: "Pasiva refleja when the agent is not mentioned: Se construyó en dos años. Se firmaron los contratos.", fr: "Passive pronominale quand l'agent n'est pas mentionné : Se construyó en dos años. Se firmaron los contratos." },
      { en: "In speech, an active sentence with the object first and a pronoun is common: Este cuadro lo pintó Goya.", fr: "À l'oral, on préfère souvent l'actif avec le complément en tête et un pronom : Este cuadro lo pintó Goya." },
    ],
    examples: [
      { es: "La ley fue aprobada por el Parlamento en 2023.", en: "The law was passed by Parliament in 2023.", fr: "La loi a été adoptée par le Parlement en 2023." },
      { es: "Las obras ya están terminadas; se inauguraron el lunes.", en: "The works are already finished; they were opened on Monday.", fr: "Les travaux sont déjà terminés ; ils ont été inaugurés lundi." },
    ],
    exceptions: [
      { en: "The ser passive is rare in the present and the imperfect in speech: El libro es leído por muchos sounds stiff; prefer Mucha gente lee el libro.", fr: "Le passif avec ser est rare au présent et à l'imparfait à l'oral : El libro es leído por muchos sonne raide ; on préfère Mucha gente lee el libro." },
    ],
    pitfalls: [
      { en: "English uses the passive much more: 'I was told' = Me dijeron (active, third-person plural).", fr: "« On m'a dit » ne se traduit pas par un passif : Me dijeron (actif, 3e personne du pluriel)." },
      { en: "Ser + participle = an action; estar + participle = a state: La puerta fue cerrada (someone closed it) / La puerta estaba cerrada (it was closed).", fr: "Ser + participe = action ; estar + participe = état : La puerta fue cerrada (on l'a fermée) / La puerta estaba cerrada (elle était fermée)." },
    ],
  },
  "g-infinitive-gerund": {
    summary: {
      en: "The infinitive is Spanish's verbal noun, where English often uses -ing as a subject or after prepositions. The gerund expresses manner and simultaneity, never a noun.",
      fr: "L'infinitif est le nom verbal de l'espagnol (là où l'anglais emploie -ing comme sujet ou après une préposition). Le gérondif exprime la manière et la simultanéité, jamais un nom.",
    },
    rules: [
      { en: "Infinitive as subject or object: Fumar es malo. Me encanta nadar. No me gusta esperar.", fr: "Infinitif sujet ou complément : Fumar es malo. Me encanta nadar. No me gusta esperar." },
      { en: "After prepositions, always the infinitive: antes de salir, sin decir nada, después de comer, en vez de llamar.", fr: "Après une préposition, toujours l'infinitif : antes de salir, sin decir nada, después de comer, en vez de llamar." },
      { en: "Al + infinitive = when, on doing: Al llegar, me di cuenta del error.", fr: "Al + infinitif = en, au moment de : Al llegar, me di cuenta del error." },
      { en: "The gerund (-ando, -iendo) expresses manner or simultaneity: Aprendí español viendo series. Salió corriendo.", fr: "Le gérondif (-ando, -iendo) exprime la manière ou la simultanéité : Aprendí español viendo series. Salió corriendo." },
    ],
    examples: [
      { es: "Al salir de la oficina, vi que estaba lloviendo.", en: "As I left the office, I saw it was raining.", fr: "En sortant du bureau, j'ai vu qu'il pleuvait." },
      { es: "Se fue sin despedirse.", en: "He left without saying goodbye.", fr: "Il est parti sans dire au revoir." },
      { es: "Resolvimos el problema hablando con el cliente.", en: "We solved the problem by talking to the client.", fr: "Nous avons résolu le problème en parlant avec le client." },
    ],
    exceptions: [
      { en: "The gerund should not express a later action: Se cayó, rompiéndose la pierna is criticised; prefer y se rompió la pierna.", fr: "Le gérondif ne doit pas exprimer une action postérieure : Se cayó, rompiéndose la pierna est critiqué ; on préfère y se rompió la pierna." },
    ],
    pitfalls: [
      { en: "Don't use the gerund as a noun: Swimming is good = Nadar es bueno (not *Nadando es bueno).", fr: "Le gérondif n'est pas un participe présent adjectif : « une boîte contenant des livres » = una caja que contiene libros (et non *conteniendo)." },
      { en: "After a preposition, English -ing is the infinitive: before leaving = antes de salir.", fr: "« En + participe présent » se traduit par le gérondif (en marchant = andando) ou par al + infinitif (en arrivant = al llegar)." },
    ],
  },
  "g-probability": {
    summary: {
      en: "Spanish expresses probability with adverbs (quizás, tal vez, posiblemente) in either mood, a lo mejor with the indicative, puede que with the subjunctive, and deber de + infinitive.",
      fr: "L'espagnol exprime la probabilité avec des adverbes (quizás, tal vez, posiblemente) aux deux modes, a lo mejor avec l'indicatif, puede que avec le subjonctif, et deber de + infinitif.",
    },
    rules: [
      { en: "Quizás, tal vez, posiblemente, probablemente + indicative (more likely) or subjunctive (less likely): Quizás tiene razón / Quizás tenga razón.", fr: "Quizás, tal vez, posiblemente, probablemente + indicatif (plus probable) ou subjonctif (moins probable) : Quizás tiene razón / Quizás tenga razón." },
      { en: "A lo mejor (colloquial) + indicative only: A lo mejor viene más tarde.", fr: "A lo mejor (familier) + indicatif uniquement : A lo mejor viene más tarde." },
      { en: "Puede (ser) que + subjunctive: Puede que llegue tarde.", fr: "Puede (ser) que + subjonctif : Puede que llegue tarde." },
      { en: "Deber de + infinitive for a deduction: Debe de estar enfermo. The future and conditional of probability work too: Estará enfermo.", fr: "Deber de + infinitif pour une déduction : Debe de estar enfermo. Le futur et le conditionnel de probabilité conviennent aussi : Estará enfermo." },
    ],
    examples: [
      { es: "No ha venido; puede que esté enfermo o a lo mejor se ha olvidado.", en: "He hasn't come; he may be ill, or maybe he's forgotten.", fr: "Il n'est pas venu ; il est peut-être malade, ou il a peut-être oublié." },
      { es: "Debe de ser muy tarde: no hay nadie en la calle.", en: "It must be very late: there's nobody in the street.", fr: "Il doit être très tard : il n'y a personne dans la rue." },
    ],
    exceptions: [
      { en: "Quizás after the verb takes the indicative: Viene quizás mañana.", fr: "Quizás placé après le verbe prend l'indicatif : Viene quizás mañana." },
    ],
    pitfalls: [
      { en: "Puede que always takes the subjunctive: Puede que tengas razón (not *tienes).", fr: "Puede que se construit toujours avec le subjonctif : Puede que tengas razón (et non *tienes)." },
      { en: "A lo mejor never takes the subjunctive: A lo mejor llueve (not *llueva).", fr: "A lo mejor ne prend jamais le subjonctif : A lo mejor llueve (et non *llueva)." },
    ],
  },
  "g-register": {
    summary: {
      en: "In Spain tú is used widely, even at work, but usted remains for formal situations, older people and first contacts. Knowing colloquial markers and their formal equivalents helps you adapt your register.",
      fr: "En Espagne, le tutoiement est très répandu, y compris au travail, mais usted reste de rigueur dans les situations formelles, avec les personnes âgées et lors d'un premier contact. Connaître les marqueurs familiers et leurs équivalents soutenus permet d'adapter son registre.",
    },
    rules: [
      { en: "Tú with colleagues, friends and most people of your age; usted with clients, authorities, older people and in formal letters, until you are invited to use tú (Puedes tutearme).", fr: "Tú avec les collègues, les amis et la plupart des personnes de son âge ; usted avec les clients, l'administration, les personnes âgées et dans les courriers formels, jusqu'à ce qu'on vous propose le tutoiement (Puedes tutearme)." },
      { en: "Colloquial markers: vale (OK), venga (come on, OK), pues (well), hombre / mujer (emphasis), tío / tía (mate, among friends), ¿sabes? (you know?).", fr: "Marqueurs familiers : vale (d'accord), venga (allez, d'accord), pues (eh bien), hombre / mujer (insistance), tío / tía (mon vieux, entre amis), ¿sabes? (tu sais ?)." },
      { en: "Formal equivalents: de acuerdo (vale), por tanto (así que), sin embargo (pero), en relación con (sobre), le agradecería que + subjunctive (¿me puedes...?).", fr: "Équivalents soutenus : de acuerdo (vale), por tanto (así que), sin embargo (pero), en relación con (sobre), le agradecería que + subjonctif (¿me puedes... ?)." },
      { en: "Email conventions: Estimado/a + name and a colon (formal), Hola + name (neutral); closings: Un saludo, Saludos cordiales, Atentamente (very formal).", fr: "Conventions du courriel : Estimado/a + nom suivi de deux-points (formel), Hola + prénom (neutre) ; formules finales : Un saludo, Saludos cordiales, Atentamente (très formel)." },
    ],
    examples: [
      { es: "Estimada señora López: le agradecería que me enviara la factura. Saludos cordiales.", en: "Dear Ms López, I would be grateful if you could send me the invoice. Kind regards.", fr: "Madame, je vous serais reconnaissant de bien vouloir m'envoyer la facture. Cordialement." },
      { es: "—¿Quedamos a las ocho? —Venga, vale. Pues nos vemos allí.", en: "'Shall we meet at eight?' 'OK, sure. Well, see you there.'", fr: "« On se retrouve à huit heures ? — Allez, d'accord. Bon, on se voit là-bas. »" },
    ],
    exceptions: [
      { en: "In Spain, the salutation of a letter is followed by a colon, not a comma: Estimado señor García:", fr: "En Espagne, la formule d'appel est suivie de deux-points, et non d'une virgule : Estimado señor García:" },
    ],
    pitfalls: [
      { en: "Usted takes third-person forms and pronouns: ¿Puede ayudarme? Le llamo mañana (not *te).", fr: "Usted se conjugue à la 3e personne et emploie les pronoms le, la, se : ¿Puede ayudarme? Le llamo mañana (et non *te)." },
      { en: "Tío and tía are fine among friends but out of place with a manager or a client.", fr: "Tío et tía passent entre amis, mais pas avec un supérieur ou un client." },
    ],
  },
  "g-argumentation": {
    summary: {
      en: "A clear argument is structured with connectors that order ideas, introduce opposition and draw conclusions, and with precise verbs and nouns rather than vague ones.",
      fr: "Une argumentation claire s'organise avec des connecteurs qui ordonnent les idées, introduisent l'opposition et tirent les conclusions, et avec des verbes et des noms précis plutôt que vagues.",
    },
    rules: [
      { en: "Ordering: en primer lugar, en segundo lugar, por último; por un lado ... por otro (lado).", fr: "Ordonner : en primer lugar, en segundo lugar, por último ; por un lado ... por otro (lado)." },
      { en: "Opposition and concession: no obstante, sin embargo, en cambio, si bien (although), aun así.", fr: "Opposition et concession : no obstante, sin embargo, en cambio, si bien (bien que), aun así." },
      { en: "Consequence and conclusion: por consiguiente, por tanto, de ahí que + subjunctive; en definitiva, en resumen, en conclusión.", fr: "Conséquence et conclusion : por consiguiente, por tanto, de ahí que + subjonctif ; en definitiva, en resumen, en conclusión." },
      { en: "Precise verbs: plantear (raise), abordar (tackle), conllevar (entail), suponer (involve), destacar (highlight). Nominalisation: el aumento de los precios rather than que los precios suban.", fr: "Verbes précis : plantear (soulever), abordar (aborder), conllevar (entraîner), suponer (impliquer), destacar (souligner). Nominalisation : el aumento de los precios plutôt que que los precios suban." },
    ],
    examples: [
      { es: "Por un lado, el teletrabajo ahorra tiempo; por otro, puede aislar a los empleados.", en: "On the one hand, remote work saves time; on the other, it can isolate employees.", fr: "D'un côté, le télétravail fait gagner du temps ; de l'autre, il peut isoler les salariés." },
      { es: "Si bien la medida es costosa, conlleva beneficios a largo plazo; por consiguiente, conviene aplicarla.", en: "Although the measure is costly, it brings long-term benefits; consequently, it should be applied.", fr: "Bien que la mesure soit coûteuse, elle entraîne des bénéfices à long terme ; par conséquent, il convient de l'appliquer." },
    ],
    exceptions: [
      { en: "De ahí que takes the subjunctive: Los precios han subido; de ahí que la gente compre menos.", fr: "De ahí que se construit avec le subjonctif : Los precios han subido; de ahí que la gente compre menos." },
    ],
    pitfalls: [
      { en: "Avoid repeating pero and también: vary with sin embargo, no obstante, además, asimismo.", fr: "Évitez de répéter pero et también : variez avec sin embargo, no obstante, además, asimismo." },
      { en: "Si bien means 'although' (concession).", fr: "Si bien signifie « bien que » (concession), et non « si bien »." },
    ],
  },
};

const ex = (
  concept: string,
  n: number,
  data: Omit<GrammarExerciseSeed, "id" | "concept">,
): GrammarExerciseSeed => ({ id: `${concept}-${n}`, concept, ...data });

export const EXERCISES_5: GrammarExerciseSeed[] = [
  // g-conditionals-1
  ex("g-conditionals-1", 1, { type: "fill", es: "Si ___ (llover) mañana, nos quedaremos en casa.", blanks: [["llueve"]], explanation: { en: "Si + present indicative, then the future.", fr: "Si + présent de l'indicatif, puis le futur." } }),
  ex("g-conditionals-1", 2, { type: "fill", es: "Si tienes tiempo, ___ (llamar, tú, imperativo) a tu abuela.", blanks: [["llama"]], explanation: { en: "Si + present, command.", fr: "Si + présent, impératif." } }),
  ex("g-conditionals-1", 3, { type: "fill", es: "Si ___ (terminar, nosotros) pronto, iremos al cine.", blanks: [["terminamos"]], explanation: { en: "Si + present indicative.", fr: "Si + présent de l'indicatif." } }),
  ex("g-conditionals-1", 4, { type: "choose", es: "Si ___ el tren de las ocho, llegarás a tiempo.", options: ["coges", "cogerás", "cojas"], answers: ["coges"], explanation: { en: "Never the future or the present subjunctive after si.", fr: "Jamais de futur ni de présent du subjonctif après si." } }),
  ex("g-conditionals-1", 5, { type: "correct", es: "Si tendré tiempo, te ayudaré.", answers: ["Si tengo tiempo, te ayudaré."], explanation: { en: "Si + present, not the future.", fr: "Si + présent, et non le futur." } }),
  ex("g-conditionals-1", 6, { type: "fill", es: "Como ___ (volver, tú) a llegar tarde, hablaré con el jefe.", blanks: [["vuelvas"]], explanation: { en: "Warning: como + subjunctive.", fr: "Avertissement : como + subjonctif." } }),
  ex("g-conditionals-1", 7, { type: "translate", prompt: { en: "If you need help, call me.", fr: "Si tu as besoin d'aide, appelle-moi." }, answers: ["Si necesitas ayuda, llámame.", "Si necesitas ayuda, me llamas."], explanation: { en: "Si + present, command.", fr: "Si + présent, impératif." } }),

  // g-conditionals-2
  ex("g-conditionals-2", 1, { type: "fill", es: "Si ___ (tener, yo) más tiempo, aprendería a tocar el piano.", blanks: [["tuviera", "tuviese"]], explanation: { en: "Imaginary condition: si + imperfect subjunctive.", fr: "Condition imaginaire : si + imparfait du subjonctif." } }),
  ex("g-conditionals-2", 2, { type: "fill", es: "Si ganara la lotería, ___ (comprar, yo) una casa en la costa.", blanks: [["compraría"]], explanation: { en: "Result: conditional.", fr: "Conséquence : conditionnel." } }),
  ex("g-conditionals-2", 3, { type: "fill", es: "Habla como si lo ___ (saber) todo.", blanks: [["supiera", "supiese"]], explanation: { en: "Como si + imperfect subjunctive.", fr: "Como si + imparfait du subjonctif." } }),
  ex("g-conditionals-2", 4, { type: "choose", es: "Si ___ rico, viajaría por todo el mundo.", options: ["fuera", "sería", "era"], answers: ["fuera"], explanation: { en: "Si + imperfect subjunctive, never the conditional or the imperfect indicative.", fr: "Si + imparfait du subjonctif, jamais le conditionnel ni l'imparfait de l'indicatif." } }),
  ex("g-conditionals-2", 5, { type: "correct", es: "Si tendría dinero, compraría un coche.", answers: ["Si tuviera dinero, compraría un coche.", "Si tuviese dinero, compraría un coche."], explanation: { en: "Never the conditional after si.", fr: "Jamais de conditionnel après si." } }),
  ex("g-conditionals-2", 6, { type: "choose", es: "___ dinero, viajaría más.", options: ["De tener", "Si tengo", "De tuviera"], answers: ["De tener"], explanation: { en: "De + infinitive can replace the si clause.", fr: "De + infinitif peut remplacer la proposition en si." } }),
  ex("g-conditionals-2", 7, { type: "translate", prompt: { en: "If I lived in Madrid, I would go to the theatre more.", fr: "Si j'habitais à Madrid, j'irais plus souvent au théâtre." }, answers: ["Si viviera en Madrid, iría más al teatro.", "Si viviese en Madrid, iría más al teatro.", "Si viviera en Madrid, iría más a menudo al teatro.", "Si viviera en Madrid, iría al teatro más a menudo.", "Si viviera en Madrid, iría más veces al teatro."], explanation: { en: "Si + imperfect subjunctive, conditional.", fr: "Si + imparfait du subjonctif, conditionnel." } }),

  // g-conditionals-3
  ex("g-conditionals-3", 1, { type: "fill", es: "Si ___ (estudiar, tú) más, habrías aprobado.", blanks: [["hubieras estudiado", "hubieses estudiado"]], explanation: { en: "Unreal past: si + pluperfect subjunctive.", fr: "Passé non réalisé : si + plus-que-parfait du subjonctif." } }),
  ex("g-conditionals-3", 2, { type: "fill", es: "Si lo hubiera sabido, te lo ___ (decir, yo).", blanks: [["habría dicho", "hubiera dicho"]], explanation: { en: "Result in the past: conditional perfect (or hubiera + participle).", fr: "Conséquence passée : conditionnel passé (ou hubiera + participe)." } }),
  ex("g-conditionals-3", 3, { type: "fill", es: "Si hubiera aceptado aquel trabajo, ahora ___ (vivir, yo) en Londres.", blanks: [["viviría"]], explanation: { en: "Mixed condition: present result → conditional.", fr: "Condition mixte : conséquence présente → conditionnel." } }),
  ex("g-conditionals-3", 4, { type: "choose", es: "Si ___ antes, no habríamos perdido el avión.", options: ["hubiéramos salido", "habríamos salido", "salimos"], answers: ["hubiéramos salido"], explanation: { en: "Si + pluperfect subjunctive.", fr: "Si + plus-que-parfait du subjonctif." } }),
  ex("g-conditionals-3", 5, { type: "correct", es: "Si habría sabido la verdad, no habría firmado.", answers: ["Si hubiera sabido la verdad, no habría firmado.", "Si hubiese sabido la verdad, no habría firmado."], explanation: { en: "Never the conditional after si.", fr: "Jamais de conditionnel après si." } }),
  ex("g-conditionals-3", 6, { type: "correct", es: "Si me hubieras avisado, te esperaba.", answers: ["Si me hubieras avisado, te habría esperado.", "Si me hubieras avisado, te hubiera esperado."], explanation: { en: "Past result: habría esperado.", fr: "Conséquence passée : habría esperado." } }),
  ex("g-conditionals-3", 7, { type: "translate", prompt: { en: "If I had known, I would have come.", fr: "Si j'avais su, je serais venu." }, answers: ["Si lo hubiera sabido, habría venido.", "Si lo hubiera sabido, hubiera venido.", "Si lo hubiese sabido, habría venido.", "De haberlo sabido, habría venido.", "Si hubiera sabido, habría venido."], explanation: { en: "Si + pluperfect subjunctive, conditional perfect.", fr: "Si + plus-que-parfait du subjonctif, conditionnel passé." } }),

  // g-sequence-tenses
  ex("g-sequence-tenses", 1, { type: "fill", es: "Quiero que ___ (venir, tú) a la reunión.", blanks: [["vengas"]], explanation: { en: "Present main verb → present subjunctive.", fr: "Verbe principal au présent → présent du subjonctif." } }),
  ex("g-sequence-tenses", 2, { type: "fill", es: "Quería que ___ (venir, tú) a la reunión.", blanks: [["vinieras", "vinieses"]], explanation: { en: "Past main verb → imperfect subjunctive.", fr: "Verbe principal au passé → imparfait du subjonctif." } }),
  ex("g-sequence-tenses", 3, { type: "fill", es: "Me gustaría que ___ (hablar, nosotros) con calma.", blanks: [["habláramos", "hablásemos"]], explanation: { en: "Conditional main verb → imperfect subjunctive.", fr: "Verbe principal au conditionnel → imparfait du subjonctif." } }),
  ex("g-sequence-tenses", 4, { type: "fill", es: "Me alegra que ___ (aprobar, tú) el examen (acción ya terminada).", blanks: [["hayas aprobado"]], explanation: { en: "Earlier action after a present: perfect subjunctive.", fr: "Action antérieure après un présent : passé du subjonctif." } }),
  ex("g-sequence-tenses", 5, { type: "choose", es: "Le pedí que me ___ con la mudanza.", options: ["ayudara", "ayude", "ayudará"], answers: ["ayudara"], explanation: { en: "Past main verb → imperfect subjunctive.", fr: "Verbe principal au passé → imparfait du subjonctif." } }),
  ex("g-sequence-tenses", 6, { type: "correct", es: "Me gustaría que vengas a la cena.", answers: ["Me gustaría que vinieras a la cena.", "Me gustaría que vinieses a la cena."], explanation: { en: "Me gustaría que + imperfect subjunctive.", fr: "Me gustaría que + imparfait du subjonctif." } }),
  ex("g-sequence-tenses", 7, { type: "translate", prompt: { en: "They asked me to wait.", fr: "Ils m'ont demandé d'attendre." }, answers: ["Me pidieron que esperara.", "Me pidieron que esperase.", "Me han pedido que espere.", "Me han pedido que esperara."], explanation: { en: "Pedir que + subjunctive; past main verb → imperfect subjunctive.", fr: "Pedir que + subjonctif ; verbe principal au passé → imparfait du subjonctif." } }),

  // g-reported-speech
  ex("g-reported-speech", 1, { type: "fill", es: "«Estoy cansado.» → Dijo que ___ (estar) cansado.", blanks: [["estaba"]], explanation: { en: "Present → imperfect.", fr: "Présent → imparfait." } }),
  ex("g-reported-speech", 2, { type: "fill", es: "«Llegaré tarde.» → Dijo que ___ (llegar) tarde.", blanks: [["llegaría"]], explanation: { en: "Future → conditional.", fr: "Futur → conditionnel." } }),
  ex("g-reported-speech", 3, { type: "fill", es: "«He perdido las llaves.» → Me contó que ___ (perder) las llaves.", blanks: [["había perdido"]], explanation: { en: "Perfecto → pluscuamperfecto.", fr: "Perfecto → plus-que-parfait." } }),
  ex("g-reported-speech", 4, { type: "fill", es: "«Cierra la puerta.» → Me dijo que ___ (cerrar, yo) la puerta.", blanks: [["cerrara", "cerrase"]], explanation: { en: "Reported command: que + imperfect subjunctive.", fr: "Ordre rapporté : que + imparfait du subjonctif." } }),
  ex("g-reported-speech", 5, { type: "choose", es: "«¿Tienes coche?» → Me preguntó ___ tenía coche.", options: ["si", "que", "qué"], answers: ["si"], explanation: { en: "Yes/no question: preguntar si.", fr: "Question fermée : preguntar si." } }),
  ex("g-reported-speech", 6, { type: "correct", es: "Me dijo esperar en la entrada.", answers: ["Me dijo que esperara en la entrada.", "Me dijo que esperase en la entrada."], explanation: { en: "A reported command uses que + subjunctive.", fr: "Un ordre rapporté se construit avec que + subjonctif." } }),
  ex("g-reported-speech", 7, { type: "translate", prompt: { en: "He said he would call the next day.", fr: "Il a dit qu'il appellerait le lendemain." }, answers: ["Dijo que llamaría al día siguiente.", "Dijo que me llamaría al día siguiente."], explanation: { en: "Future → conditional; mañana → al día siguiente.", fr: "Futur → conditionnel ; mañana → al día siguiente." } }),

  // g-passive
  ex("g-passive", 1, { type: "fill", es: "El edificio fue ___ (diseñar) por un arquitecto japonés.", blanks: [["diseñado"]], explanation: { en: "Ser + participle agreeing with edificio.", fr: "Ser + participe accordé avec edificio." } }),
  ex("g-passive", 2, { type: "fill", es: "Las cartas fueron ___ (escribir) en el siglo XIX.", blanks: [["escritas"]], explanation: { en: "Irregular participle escrito, agreeing: escritas.", fr: "Participe irrégulier escrito, accordé : escritas." } }),
  ex("g-passive", 3, { type: "distinguish", es: "La tienda ___ cerrada cuando llegamos. La tienda ___ cerrada por la policía ayer.", blanks: [["estaba"], ["fue"]], explanation: { en: "A state → estar; an action with an agent → ser.", fr: "Un état → estar ; une action avec un agent → ser." } }),
  ex("g-passive", 4, { type: "fill", es: "En 2019 se ___ (vender) más de un millón de coches eléctricos.", blanks: [["vendieron"]], explanation: { en: "Pasiva refleja agreeing with coches.", fr: "Passive pronominale accordée avec coches." } }),
  ex("g-passive", 5, { type: "choose", es: "Este cuadro ___ pintó Velázquez.", options: ["lo", "le", "se"], answers: ["lo"], explanation: { en: "Fronted object repeated with a pronoun: lo.", fr: "Complément placé en tête et repris par un pronom : lo." } }),
  ex("g-passive", 6, { type: "correct", es: "Me fue dicho que la reunión era a las diez.", answers: ["Me dijeron que la reunión era a las diez."], explanation: { en: "'I was told' = me dijeron (active).", fr: "« On m'a dit » = me dijeron (actif)." } }),
  ex("g-passive", 7, { type: "translate", prompt: { en: "The museum was opened in 1997.", fr: "Le musée a été inauguré en 1997." }, answers: ["El museo fue inaugurado en 1997.", "El museo se inauguró en 1997."], explanation: { en: "Ser passive or pasiva refleja.", fr: "Passif avec ser ou passive pronominale." } }),

  // g-infinitive-gerund
  ex("g-infinitive-gerund", 1, { type: "fill", es: "___ (fumar) es malo para la salud.", blanks: [["Fumar"]], explanation: { en: "The infinitive is the subject.", fr: "L'infinitif est sujet." } }),
  ex("g-infinitive-gerund", 2, { type: "fill", es: "Antes de ___ (salir), apaga las luces.", blanks: [["salir"]], explanation: { en: "After a preposition: infinitive.", fr: "Après une préposition : infinitif." } }),
  ex("g-infinitive-gerund", 3, { type: "fill", es: "___ ___ (al + llegar) a casa, vi que no tenía las llaves.", blanks: [["Al"], ["llegar"]], explanation: { en: "Al + infinitive = when, on doing.", fr: "Al + infinitif = en, au moment de." } }),
  ex("g-infinitive-gerund", 4, { type: "fill", es: "Aprendió a cocinar ___ (ver) vídeos.", blanks: [["viendo"]], explanation: { en: "Manner: gerund.", fr: "Manière : gérondif." } }),
  ex("g-infinitive-gerund", 5, { type: "choose", es: "Se fue sin ___ nada.", options: ["decir", "diciendo", "dice"], answers: ["decir"], explanation: { en: "Sin + infinitive.", fr: "Sin + infinitif." } }),
  ex("g-infinitive-gerund", 6, { type: "correct", es: "Nadando es mi deporte favorito.", answers: ["Nadar es mi deporte favorito.", "La natación es mi deporte favorito."], explanation: { en: "A verbal noun is an infinitive, not a gerund.", fr: "Le nom verbal est l'infinitif, pas le gérondif." } }),
  ex("g-infinitive-gerund", 7, { type: "translate", prompt: { en: "After eating, we went for a walk.", fr: "Après avoir mangé, nous sommes allés nous promener." }, answers: ["Después de comer, fuimos a pasear.", "Después de comer, dimos un paseo.", "Después de comer, nos fuimos a pasear."], explanation: { en: "Después de + infinitive.", fr: "Después de + infinitif." } }),

  // g-probability
  ex("g-probability", 1, { type: "fill", es: "Puede que ___ (llegar, ellos) tarde por el tráfico.", blanks: [["lleguen"]], explanation: { en: "Puede que + subjunctive.", fr: "Puede que + subjonctif." } }),
  ex("g-probability", 2, { type: "fill", es: "A lo mejor ___ (venir, ella) mañana.", blanks: [["viene"]], explanation: { en: "A lo mejor + indicative.", fr: "A lo mejor + indicatif." } }),
  ex("g-probability", 3, { type: "fill", es: "No contesta; ___ ___ estar en una reunión (deducción con deber).", blanks: [["debe"], ["de"]], explanation: { en: "Deduction: deber de + infinitive.", fr: "Déduction : deber de + infinitif." } }),
  ex("g-probability", 4, { type: "choose", es: "Tal vez ___ razón, no lo sé.", options: ["tengas", "tendrías", "tenido"], answers: ["tengas"], explanation: { en: "Tal vez + subjunctive (or indicative).", fr: "Tal vez + subjonctif (ou indicatif)." } }),
  ex("g-probability", 5, { type: "correct", es: "Puede que tienes razón.", answers: ["Puede que tengas razón."], explanation: { en: "Puede que always takes the subjunctive.", fr: "Puede que se construit toujours avec le subjonctif." } }),
  ex("g-probability", 6, { type: "correct", es: "A lo mejor llueva esta tarde.", answers: ["A lo mejor llueve esta tarde."], explanation: { en: "A lo mejor never takes the subjunctive.", fr: "A lo mejor ne prend jamais le subjonctif." } }),
  ex("g-probability", 7, { type: "translate", prompt: { en: "Maybe he's at home.", fr: "Il est peut-être chez lui." }, answers: ["A lo mejor está en casa.", "Quizás está en casa.", "Quizás esté en casa.", "Tal vez está en casa.", "Tal vez esté en casa.", "Puede que esté en casa.", "Estará en casa.", "Igual está en casa."], explanation: { en: "Many possibilities: a lo mejor + indicative, quizás or tal vez + either mood, puede que + subjunctive.", fr: "Plusieurs possibilités : a lo mejor + indicatif, quizás ou tal vez + les deux modes, puede que + subjonctif." } }),

  // g-register
  ex("g-register", 1, { type: "choose", es: "(a un cliente) ¿En qué puedo ___?", options: ["ayudarle", "ayudarte"], answers: ["ayudarle"], explanation: { en: "Usted → le.", fr: "Usted → le." } }),
  ex("g-register", 2, { type: "fill", es: "(correo formal) ___ señor García: le escribo en relación con su pedido.", blanks: [["Estimado"]], explanation: { en: "Formal salutation: Estimado + title + name, then a colon.", fr: "Formule d'appel formelle : Estimado + titre + nom, puis deux-points." } }),
  ex("g-register", 3, { type: "choose", es: "(registro formal) Le ___ que me confirmara la fecha.", options: ["agradecería", "agradeces"], answers: ["agradecería"], explanation: { en: "Le agradecería que + imperfect subjunctive.", fr: "Le agradecería que + imparfait du subjonctif." } }),
  ex("g-register", 4, { type: "fill", es: "(usted) ¿___ (poder) repetir su nombre, por favor?", blanks: [["Puede", "Podría"]], explanation: { en: "Usted takes the third-person form.", fr: "Usted se conjugue à la 3e personne." } }),
  ex("g-register", 5, { type: "correct", es: "Estimado señor Ruiz: te envío el presupuesto que me pediste.", answers: ["Estimado señor Ruiz: le envío el presupuesto que me pidió."], explanation: { en: "A formal letter keeps usted throughout: le, pidió.", fr: "Un courrier formel garde usted d'un bout à l'autre : le, pidió." } }),
  ex("g-register", 6, { type: "choose", es: "—¿Nos vemos mañana a las diez? —___, perfecto.", options: ["Vale", "Atentamente"], answers: ["Vale"], explanation: { en: "Informal agreement: vale.", fr: "Accord familier : vale." } }),
  ex("g-register", 7, { type: "translate", prompt: { en: "Could you send me the document, please? (usted)", fr: "Pourriez-vous m'envoyer le document, s'il vous plaît ? (usted)" }, answers: ["¿Podría enviarme el documento, por favor?", "¿Me podría enviar el documento, por favor?", "¿Podría mandarme el documento, por favor?", "¿Me podría mandar el documento, por favor?"], explanation: { en: "Polite request with usted: ¿Podría...?", fr: "Demande polie avec usted : ¿Podría... ?" } }),

  // g-argumentation
  ex("g-argumentation", 1, { type: "fill", es: "Por un lado, es barato; por ___, es poco fiable.", blanks: [["otro", "otro lado"]], explanation: { en: "Por un lado ... por otro (lado).", fr: "Por un lado ... por otro (lado)." } }),
  ex("g-argumentation", 2, { type: "fill", es: "La propuesta es interesante; ___, resulta demasiado cara (oposición formal).", blanks: [["no obstante", "sin embargo"]], explanation: { en: "Formal contrast: no obstante, sin embargo.", fr: "Opposition soutenue : no obstante, sin embargo." } }),
  ex("g-argumentation", 3, { type: "fill", es: "Los alquileres han subido; de ahí que muchos jóvenes ___ (vivir) con sus padres.", blanks: [["vivan"]], explanation: { en: "De ahí que + subjunctive.", fr: "De ahí que + subjonctif." } }),
  ex("g-argumentation", 4, { type: "choose", es: "___ la medida es costosa, ofrece beneficios a largo plazo.", options: ["Si bien", "Por tanto", "En resumen"], answers: ["Si bien"], explanation: { en: "Concession: si bien (although).", fr: "Concession : si bien (bien que)." } }),
  ex("g-argumentation", 5, { type: "choose", es: "El proyecto ___ riesgos importantes que debemos analizar.", options: ["conlleva", "hace", "pone"], answers: ["conlleva"], explanation: { en: "Conllevar = to entail; a precise verb.", fr: "Conllevar = entraîner, impliquer : un verbe précis." } }),
  ex("g-argumentation", 6, { type: "correct", es: "En primer lugar, analizaremos los costes; en segundo lugar, los beneficios; y por fin, las conclusiones.", answers: ["En primer lugar, analizaremos los costes; en segundo lugar, los beneficios; y por último, las conclusiones.", "En primer lugar, analizaremos los costes; en segundo lugar, los beneficios; por último, las conclusiones."], explanation: { en: "To close a list: por último. Por fin means 'at last'.", fr: "Pour clore une énumération : por último. Por fin signifie « enfin ! »." } }),
  ex("g-argumentation", 7, { type: "translate", prompt: { en: "In short, the proposal raises more problems than it solves.", fr: "En définitive, la proposition pose plus de problèmes qu'elle n'en résout." }, answers: ["En definitiva, la propuesta plantea más problemas de los que resuelve.", "En resumen, la propuesta plantea más problemas de los que resuelve.", "En definitiva, la propuesta plantea más problemas que los que resuelve.", "En resumen, la propuesta plantea más problemas que los que resuelve."], explanation: { en: "Plantear un problema = to raise a problem; más ... de los que before a clause.", fr: "Plantear un problema = poser un problème ; más ... de los que devant une proposition." } }),
];
