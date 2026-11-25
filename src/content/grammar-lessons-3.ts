import type { BilingualLesson, GrammarExerciseSeed } from "./types";

/** Intermediate grammar and talking about the past (A2 to B1). */
export const LESSONS_3: Record<string, BilingualLesson> = {
  "g-time-expressions": {
    summary: {
      en: "Spanish expresses 'ago' with hace + time, and a situation that started in the past and continues with the present tense: hace ... que, desde hace, or llevar + gerund.",
      fr: "L'espagnol exprime « il y a » avec hace + durée, et une situation commencée dans le passé qui dure encore avec le présent : hace ... que, desde hace, ou llevar + gérondif.",
    },
    rules: [
      { en: "Hace + time = ago: Llegué a Madrid hace dos años. Salió hace una hora.", fr: "Hace + durée = il y a : Llegué a Madrid hace dos años. Salió hace una hora." },
      { en: "A situation that continues uses the present: Vivo aquí desde hace tres años = Hace tres años que vivo aquí = Llevo tres años viviendo aquí.", fr: "Une situation qui dure se dit au présent : Vivo aquí desde hace tres años = Hace tres años que vivo aquí = Llevo tres años viviendo aquí." },
      { en: "Desde (since a point in time): desde 2020, desde el lunes. Hasta (until): hasta las cinco. Durante (during, for a period): durante la reunión, durante dos horas.", fr: "Desde (depuis un point dans le temps) : desde 2020, desde el lunes. Hasta (jusqu'à) : hasta las cinco. Durante (pendant) : durante la reunión, durante dos horas." },
      { en: "Acabar de + infinitive = to have just done: Acabo de llegar. Volver a + infinitive = to do again: Vuelve a llamar.", fr: "Acabar de + infinitif = venir de : Acabo de llegar. Volver a + infinitif = refaire : Vuelve a llamar." },
    ],
    examples: [
      { es: "Llevo dos años trabajando en esta empresa y acabo de cambiar de equipo.", en: "I've been working at this company for two years and I've just changed teams.", fr: "Je travaille dans cette entreprise depuis deux ans et je viens de changer d'équipe." },
      { es: "Estudio español desde enero, pero hace un mes que no practico.", en: "I've been studying Spanish since January, but I haven't practised for a month.", fr: "J'étudie l'espagnol depuis janvier, mais je n'ai pas pratiqué depuis un mois." },
      { es: "Te espero hasta las seis; después vuelvo a casa.", en: "I'll wait for you until six; after that I'm going back home.", fr: "Je t'attends jusqu'à six heures ; après, je rentre à la maison." },
    ],
    exceptions: [
      { en: "A negative duration often uses llevar + sin + infinitive: Llevo una semana sin dormir bien.", fr: "Une durée négative s'exprime souvent avec llevar + sin + infinitif : Llevo una semana sin dormir bien." },
    ],
    pitfalls: [
      { en: "'I've been living here for three years' uses the present: Vivo aquí desde hace tres años (not *he vivido aquí desde hace...).", fr: "« Je viens de » = acabo de, et non *vengo de, qui signifie « je viens de [un lieu] »." },
      { en: "Desde for a starting point, desde hace for a length of time: desde marzo, desde hace tres meses.", fr: "Desde + point de départ, desde hace + durée : desde marzo, desde hace tres meses." },
    ],
  },
  "g-periphrasis": {
    summary: {
      en: "Verbal periphrases combine a conjugated verb with an infinitive or a gerund to express plans, obligation, progress, habits, and the start or end of an action.",
      fr: "Les périphrases verbales associent un verbe conjugué à un infinitif ou un gérondif pour exprimer un projet, une obligation, une action en cours, une habitude, ou le début et la fin d'une action.",
    },
    rules: [
      { en: "Plans and obligation: ir a + infinitive (Voy a llamar), tener que (personal obligation: Tengo que trabajar), hay que (impersonal: Hay que reservar), deber (advice, duty: Debes descansar).", fr: "Projet et obligation : ir a + infinitif (Voy a llamar), tener que (obligation personnelle : Tengo que trabajar), hay que (impersonnel : Hay que reservar), deber (conseil, devoir : Debes descansar)." },
      { en: "In progress: estar + gerund (Estoy escribiendo). Continuing: seguir + gerund (Sigue lloviendo = it's still raining).", fr: "En cours : estar + gérondif (Estoy escribiendo). Continuité : seguir + gérondif (Sigue lloviendo = il pleut toujours)." },
      { en: "Start and end: empezar a and ponerse a (start, often suddenly) + infinitive; dejar de + infinitive (stop): He dejado de fumar.", fr: "Début et fin : empezar a et ponerse a (se mettre à) + infinitif ; dejar de + infinitif (arrêter) : He dejado de fumar." },
      { en: "Soler + infinitive = usually do: Suelo comer a las dos.", fr: "Soler + infinitif = avoir l'habitude de : Suelo comer a las dos." },
    ],
    examples: [
      { es: "Suelo trabajar desde casa los viernes, pero esta semana tengo que ir a la oficina.", en: "I usually work from home on Fridays, but this week I have to go to the office.", fr: "D'habitude, je télétravaille le vendredi, mais cette semaine je dois aller au bureau." },
      { es: "Hay que terminar el informe hoy; sigo esperando los datos.", en: "The report has to be finished today; I'm still waiting for the data.", fr: "Il faut terminer le rapport aujourd'hui ; j'attends toujours les données." },
      { es: "Cuando llega a casa, se pone a cocinar.", en: "When he gets home, he starts cooking.", fr: "Quand il rentre, il se met à cuisiner." },
    ],
    exceptions: [
      { en: "In careful usage, deber de + infinitive expresses probability (Debe de estar en casa = he must be at home) and deber + infinitive obligation; in everyday speech they are often mixed.", fr: "Dans la norme, deber de + infinitif exprime la probabilité (Debe de estar en casa = il doit être chez lui) et deber + infinitif l'obligation ; à l'oral, on les confond souvent." },
    ],
    pitfalls: [
      { en: "Hay que is impersonal and never takes a subject (*Hay que nosotros salir); for a person, use tener que: Tenemos que salir.", fr: "Hay que est impersonnel et n'a jamais de sujet (*Hay que nosotros salir) ; pour une personne, tener que : Tenemos que salir." },
      { en: "Seguir + gerund, not *seguir a + infinitive: Sigo trabajando.", fr: "« Être en train de » = estar + gérondif ; « continuer à » = seguir + gérondif : Sigo trabajando." },
    ],
  },
  "g-connectors": {
    summary: {
      en: "Connectors link ideas and show how they relate: contrast, addition, consequence, clarification. Choosing the right one makes speech and writing clearer.",
      fr: "Les connecteurs relient les idées et indiquent leur relation : opposition, addition, conséquence, reformulation. Bien les choisir rend le discours plus clair.",
    },
    rules: [
      { en: "Contrast: pero (but), aunque (although), sin embargo (however), en cambio (on the other hand).", fr: "Opposition : pero (mais), aunque (bien que, même si), sin embargo (cependant), en cambio (en revanche)." },
      { en: "Pero or sino: after a negative, sino corrects the first statement (No es caro, sino barato); pero adds a limitation (No es caro, pero no lo necesito). Before a clause: sino que (No lo leyó, sino que lo escuchó).", fr: "Pero ou sino : après une négation, sino rectifie (No es caro, sino barato) ; pero ajoute une restriction (No es caro, pero no lo necesito). Devant une proposition : sino que (No lo leyó, sino que lo escuchó)." },
      { en: "Addition and consequence: además (besides), también (also); por lo tanto, por eso, así que (so, therefore).", fr: "Addition et conséquence : además (de plus), también (aussi) ; por lo tanto, por eso, así que (donc, c'est pourquoi)." },
      { en: "Clarifying and commenting: es decir, o sea (that is), de hecho (in fact), por cierto (by the way).", fr: "Reformuler et commenter : es decir, o sea (c'est-à-dire), de hecho (d'ailleurs, en fait), por cierto (au fait)." },
    ],
    examples: [
      { es: "El piso es pequeño; sin embargo, está muy bien situado.", en: "The flat is small; however, it's very well located.", fr: "L'appartement est petit ; cependant, il est très bien situé." },
      { es: "No vamos en coche, sino en tren, así que tenemos que salir temprano.", en: "We're not going by car but by train, so we have to leave early.", fr: "Nous n'y allons pas en voiture mais en train, donc nous devons partir tôt." },
      { es: "Por cierto, ¿has visto el correo de Marta? De hecho, te lo ha reenviado.", en: "By the way, have you seen Marta's email? In fact, she has forwarded it to you.", fr: "Au fait, tu as vu le mail de Marta ? D'ailleurs, elle te l'a transféré." },
    ],
    exceptions: [
      { en: "Aunque can take the subjunctive (aunque llueva); this comes later with the subjunctive.", fr: "Aunque peut se construire avec le subjonctif (aunque llueva) ; ce sera vu avec le subjonctif." },
    ],
    pitfalls: [
      { en: "'But rather' after a negative is sino, not pero: No es francés, sino belga.", fr: "« Mais » qui rectifie après une négation = sino : No es francés, sino belga (il n'est pas français mais belge)." },
      { en: "En cambio contrasts two things (Yo trabajo; ella, en cambio, estudia); 'in exchange' is a cambio.", fr: "En cambio = en revanche ; « en échange » se dit a cambio." },
    ],
  },
  "g-relatives-1": {
    summary: {
      en: "Que is the default relative pronoun for people and things. Quien is used for people after a preposition, and donde for places. Spanish never leaves out the relative.",
      fr: "Que est le pronom relatif par défaut, pour les personnes comme pour les choses. Quien s'emploie pour les personnes après une préposition, et donde pour les lieux. L'espagnol n'omet jamais le relatif.",
    },
    rules: [
      { en: "Que = who, which, that (subject or object): El chico que vive aquí. El libro que leo.", fr: "Que = qui, que (sujet ou complément) : El chico que vive aquí. El libro que leo." },
      { en: "Quien/quienes after a preposition, for people: La persona con quien hablo. Los clientes a quienes escribimos.", fr: "Quien/quienes après une préposition, pour les personnes : La persona con quien hablo. Los clientes a quienes escribimos." },
      { en: "Between commas (extra information about a person), quien is also possible: Mi jefa, que / quien vive en Toledo, viene hoy.", fr: "Entre virgules (information accessoire sur une personne), quien est aussi possible : Mi jefa, que / quien vive en Toledo, viene hoy." },
      { en: "Donde for places: La ciudad donde nací. Also en la que: La oficina en la que trabajo.", fr: "Donde pour les lieux : La ciudad donde nací. Aussi en la que : La oficina en la que trabajo." },
    ],
    examples: [
      { es: "El proyecto que presentamos ayer es el que más me gusta.", en: "The project we presented yesterday is the one I like most.", fr: "Le projet que nous avons présenté hier est celui qui me plaît le plus." },
      { es: "La compañera con quien comparto despacho es de Murcia.", en: "The colleague I share an office with is from Murcia.", fr: "La collègue avec qui je partage le bureau est de Murcie." },
      { es: "Este es el barrio donde vivía de niño.", en: "This is the neighbourhood where I lived as a child.", fr: "Voici le quartier où je vivais enfant." },
    ],
    exceptions: [
      { en: "Quien cannot introduce a defining clause without a preposition: *El chico quien vive aquí → El chico que vive aquí.", fr: "Quien ne peut pas introduire une relative déterminative sans préposition : *El chico quien vive aquí → El chico que vive aquí." },
    ],
    pitfalls: [
      { en: "English drops the relative ('the book I read'); Spanish never does: el libro que leo.", fr: "« Où » temporel se traduit souvent par que : el día que nos conocimos (le jour où nous nous sommes rencontrés)." },
      { en: "The relative que has no accent; qué is a question word.", fr: "Le relatif que ne porte pas d'accent ; qué est interrogatif." },
    ],
  },
  "g-relatives-2": {
    summary: {
      en: "After a preposition, Spanish uses article + que (el que, la que, los que, las que) or the more formal el cual. Lo que means 'what' or 'which' for an idea, and cuyo expresses possession.",
      fr: "Après une préposition, l'espagnol emploie article + que (el que, la que, los que, las que) ou, plus soutenu, el cual. Lo que signifie « ce que » ou « ce qui », et cuyo exprime la possession.",
    },
    rules: [
      { en: "Preposition + el/la/los/las que, agreeing with the antecedent: la empresa para la que trabajo; el problema del que hablamos; los motivos por los que me voy.", fr: "Préposition + el/la/los/las que, accordé avec l'antécédent : la empresa para la que trabajo ; el problema del que hablamos ; los motivos por los que me voy." },
      { en: "El cual, la cual, los cuales, las cuales mean the same but are more formal, and frequent after longer prepositions: el edificio delante del cual...", fr: "El cual, la cual, los cuales, las cuales ont le même sens mais sont plus soutenus, et fréquents après des prépositions longues : el edificio delante del cual..." },
      { en: "Lo que = what (the thing that) or which (referring to a whole idea): No entiendo lo que dices. Llegó tarde, lo que me molestó.", fr: "Lo que = ce que, ce qui (ou une idée entière) : No entiendo lo que dices. Llegó tarde, lo que me molestó." },
      { en: "Cuyo, cuya, cuyos, cuyas = whose, agreeing with the possessed noun: el autor cuya novela leí; la empresa cuyos empleados...", fr: "Cuyo, cuya, cuyos, cuyas = dont (possession), accordé avec le nom possédé : el autor cuya novela leí ; la empresa cuyos empleados..." },
    ],
    examples: [
      { es: "Esta es la herramienta con la que hacemos las pruebas.", en: "This is the tool we do the tests with.", fr: "C'est l'outil avec lequel nous faisons les tests." },
      { es: "Lo que más me gusta de Madrid es la vida en la calle.", en: "What I like most about Madrid is life in the streets.", fr: "Ce qui me plaît le plus à Madrid, c'est la vie dans la rue." },
      { es: "Es una ingeniera cuyo trabajo ha cambiado el sector.", en: "She is an engineer whose work has changed the sector.", fr: "C'est une ingénieure dont le travail a changé le secteur." },
    ],
    exceptions: [
      { en: "With a, de, en, con and other short prepositions, el que is the usual choice in speech; el cual sounds formal.", fr: "Avec a, de, en, con et les autres prépositions courtes, el que est le choix courant à l'oral ; el cual est soutenu." },
    ],
    pitfalls: [
      { en: "'Whose' agrees with the thing possessed, not the owner: el vecino cuya hija... (not *cuyo hija).", fr: "« Dont » se traduit selon le sens : el libro del que te hablé (parler de), la empresa cuyo director... (possession). Jamais *donde pour « dont »." },
      { en: "Relative 'what' is lo que, not qué: Haz lo que quieras.", fr: "« Ce que » = lo que : Haz lo que quieras." },
    ],
  },
  "g-impersonal-se": {
    summary: {
      en: "Se + a third-person verb makes general statements without a specific subject. With a noun, the verb agrees with it (pasiva refleja). Se + an indirect pronoun presents an event as accidental.",
      fr: "Se + verbe à la 3e personne permet des énoncés généraux sans sujet précis. Avec un nom, le verbe s'accorde avec ce nom (passive pronominale). Se + pronom indirect présente un événement comme involontaire.",
    },
    rules: [
      { en: "Impersonal se (one, people, you in general): Aquí se vive bien. Se trabaja mucho en esta empresa.", fr: "Se impersonnel (on) : Aquí se vive bien. Se trabaja mucho en esta empresa." },
      { en: "Pasiva refleja: the verb agrees with the noun: Se vende piso. Se venden pisos. Se necesitan ingenieros.", fr: "Passive pronominale : le verbe s'accorde avec le nom : Se vende piso. Se venden pisos. Se necesitan ingenieros." },
      { en: "With people as the object, use the singular + a: Se busca a los responsables.", fr: "Avec des personnes compléments, singulier + a : Se busca a los responsables." },
      { en: "Accidental events: se + me/te/le/nos/os/les + verb agreeing with the thing: Se me ha olvidado la contraseña. Se nos han perdido las llaves. Se le cayó el vaso.", fr: "Événements involontaires : se + me/te/le/nos/os/les + verbe accordé avec la chose : Se me ha olvidado la contraseña. Se nos han perdido las llaves. Se le cayó el vaso." },
    ],
    examples: [
      { es: "En España se cena muy tarde.", en: "In Spain people have dinner very late.", fr: "En Espagne, on dîne très tard." },
      { es: "Se alquilan habitaciones cerca de la universidad.", en: "Rooms for rent near the university.", fr: "Chambres à louer près de l'université." },
      { es: "Perdona, se me ha olvidado tu cumpleaños.", en: "Sorry, I forgot your birthday.", fr: "Pardon, j'ai oublié ton anniversaire." },
    ],
    exceptions: [
      { en: "Verbs that are already reflexive cannot take impersonal se; use uno: Uno se acostumbra (one gets used to it).", fr: "Les verbes déjà pronominaux n'admettent pas le se impersonnel ; on emploie uno : Uno se acostumbra (on s'habitue)." },
    ],
    pitfalls: [
      { en: "In standard Spanish the verb agrees: se venden coches (not *se vende coches).", fr: "Dans la norme, le verbe s'accorde : se venden coches (et non *se vende coches)." },
      { en: "Se me olvidó presents the event as accidental; olvidé is neutral.", fr: "« On » se traduit souvent par se (se dice que...) mais aussi par la 3e personne du pluriel (dicen que...)." },
    ],
  },
  "g-lo-neutro": {
    summary: {
      en: "Lo is a neuter article: it turns adjectives into abstract ideas (lo importante = the important thing) and builds expressions such as lo que, lo de and lo + adjective + que.",
      fr: "Lo est un article neutre : il transforme l'adjectif en idée abstraite (lo importante = ce qui est important) et forme des tournures comme lo que, lo de et lo + adjectif + que.",
    },
    rules: [
      { en: "Lo + masculine singular adjective = the ... thing, the ... part: Lo bueno es que... Lo difícil es empezar.", fr: "Lo + adjectif au masculin singulier = ce qui est ... : Lo bueno es que... Lo difícil es empezar." },
      { en: "Lo de + noun or infinitive = the matter of, the business about: ¿Has hablado con Ana de lo del viaje?", fr: "Lo de + nom ou infinitif = l'affaire de, ce qui concerne : ¿Has hablado con Ana de lo del viaje?" },
      { en: "Lo + adjective or adverb + que = how (degree): No sabes lo difícil que es. Me sorprende lo bien que hablas. The adjective agrees: lo cansada que estaba.", fr: "Lo + adjectif ou adverbe + que = à quel point : No sabes lo difícil que es. Me sorprende lo bien que hablas. L'adjectif s'accorde : lo cansada que estaba." },
      { en: "Lo que = what (the thing that): Eso es lo que quiero.", fr: "Lo que = ce que, ce qui : Eso es lo que quiero." },
    ],
    examples: [
      { es: "Lo mejor del viaje fue la comida; lo peor, el calor.", en: "The best part of the trip was the food; the worst, the heat.", fr: "Le meilleur du voyage, c'était la nourriture ; le pire, la chaleur." },
      { es: "No te imaginas lo cansados que estamos.", en: "You can't imagine how tired we are.", fr: "Tu n'imagines pas à quel point nous sommes fatigués." },
      { es: "¿Qué ha pasado con lo de la reunión?", en: "What happened about the meeting business?", fr: "Qu'est-ce qui s'est passé pour cette histoire de réunion ?" },
    ],
    exceptions: [
      { en: "Lo is never used with a noun: *lo problema. Say el problema, or lo del problema.", fr: "Lo ne s'emploie jamais avec un nom : *lo problema. On dit el problema, ou lo del problema." },
    ],
    pitfalls: [
      { en: "'How' + adjective for degree is lo + adjective + que, not *cómo + adjective: ¡No sabes lo caro que es!", fr: "« À quel point » = lo + adjectif + que : ¡No sabes lo caro que es! (et non *cómo caro)." },
      { en: "The adjective agrees with the noun: lo bonitas que son las playas.", fr: "L'adjectif s'accorde : lo bonitas que son las playas." },
    ],
  },
  "g-perfecto-indefinido": {
    summary: {
      en: "In Spain, the pretérito perfecto (he hablado) is used for actions within a period that includes the present; the indefinido (hablé) for actions in a finished period.",
      fr: "En Espagne, le pretérito perfecto (he hablado) s'emploie pour une action située dans une période qui inclut le présent ; l'indefinido (hablé) pour une action dans une période terminée.",
    },
    rules: [
      { en: "Perfecto with hoy, esta mañana, esta semana, este año, ya, todavía no, nunca, alguna vez: Hoy he trabajado mucho. ¿Has estado alguna vez en Cuba?", fr: "Perfecto avec hoy, esta mañana, esta semana, este año, ya, todavía no, nunca, alguna vez : Hoy he trabajado mucho. ¿Has estado alguna vez en Cuba?" },
      { en: "Indefinido with ayer, anoche, la semana pasada, el año pasado, en 2019, hace dos días: Ayer trabajé mucho. En 2019 viví en Lisboa.", fr: "Indefinido avec ayer, anoche, la semana pasada, el año pasado, en 2019, hace dos días : Ayer trabajé mucho. En 2019 viví en Lisboa." },
      { en: "Without a time marker, the perfecto presents an experience or a recent fact; the indefinido a completed event placed in the past.", fr: "Sans marqueur de temps, le perfecto présente une expérience ou un fait récent ; l'indefinido un événement achevé situé dans le passé." },
      { en: "In most of Latin America and in the Canary Islands, the indefinido covers both; in central Spain, the distinction is expected.", fr: "Dans la plupart des pays d'Amérique latine et aux Canaries, l'indefinido couvre les deux ; dans le centre de l'Espagne, on attend la distinction." },
    ],
    examples: [
      { es: "Esta semana he tenido tres reuniones, pero la semana pasada no tuve ninguna.", en: "This week I've had three meetings, but last week I didn't have any.", fr: "Cette semaine, j'ai eu trois réunions, mais la semaine dernière je n'en ai eu aucune." },
      { es: "¿Ya has terminado el informe? — Sí, lo terminé anoche.", en: "Have you finished the report yet? — Yes, I finished it last night.", fr: "Tu as déjà fini le rapport ? — Oui, je l'ai fini hier soir." },
    ],
    exceptions: [
      { en: "A very recent event can take the perfecto: Hace un rato ha llamado tu madre.", fr: "Un événement très récent peut prendre le perfecto : Hace un rato ha llamado tu madre." },
    ],
    pitfalls: [
      { en: "'Have you ever...?' is perfecto; 'Did you... yesterday?' is indefinido.", fr: "Le passé composé français couvre les deux temps : « hier, j'ai travaillé » = ayer trabajé (et non *ayer he trabajado)." },
    ],
  },
  "g-indefinido-imperfecto": {
    summary: {
      en: "The indefinido presents completed events that move a story forward; the imperfecto describes the background: situations, habits, descriptions and actions in progress.",
      fr: "L'indefinido présente les événements achevés qui font avancer le récit ; l'imperfecto décrit l'arrière-plan : situations, habitudes, descriptions et actions en cours.",
    },
    rules: [
      { en: "Indefinido: a completed action or a sequence of actions (Llegó, saludó y se sentó), also over a closed period (Viví en Roma tres años).", fr: "Indefinido : action achevée ou succession d'actions (Llegó, saludó y se sentó), y compris sur une période fermée (Viví en Roma tres años)." },
      { en: "Imperfecto: descriptions (Hacía frío, la casa era grande), habits (De niño jugaba al fútbol), and situations in progress (Eran las diez).", fr: "Imperfecto : descriptions (Hacía frío, la casa era grande), habitudes (De niño jugaba al fútbol) et situations en cours (Eran las diez)." },
      { en: "An action in progress interrupted by an event: imperfecto + indefinido: Leía cuando sonó el teléfono.", fr: "Action en cours interrompue par un événement : imperfecto + indefinido : Leía cuando sonó el teléfono." },
      { en: "Some verbs change meaning: supe (found out) / sabía (knew); conocí (met) / conocía (knew); quise (tried) / quería (wanted); no pude (failed to) / no podía (wasn't able to).", fr: "Certains verbes changent de sens : supe (j'ai appris) / sabía (je savais) ; conocí (j'ai fait la connaissance) / conocía (je connaissais) ; quise (j'ai essayé) / quería (je voulais) ; no pude (je n'ai pas réussi) / no podía (je ne pouvais pas)." },
    ],
    examples: [
      { es: "Era un día tranquilo: llovía y no había nadie en la oficina. De repente, sonó la alarma.", en: "It was a quiet day: it was raining and there was nobody in the office. Suddenly, the alarm went off.", fr: "C'était une journée calme : il pleuvait et il n'y avait personne au bureau. Soudain, l'alarme a sonné." },
      { es: "Conocí a mi mujer en 2015, cuando trabajaba en Valencia.", en: "I met my wife in 2015, when I was working in Valencia.", fr: "J'ai rencontré ma femme en 2015, quand je travaillais à Valence." },
    ],
    exceptions: [
      { en: "A long but closed period still takes the indefinido: Estudié allí cinco años.", fr: "Une période longue mais fermée prend l'indefinido : Estudié allí cinco años." },
    ],
    pitfalls: [
      { en: "'Was/were + -ing' is imperfecto (or estaba + gerund); a single completed past action is indefinido.", fr: "L'imparfait français correspond à l'imperfecto, et le passé composé ou simple de narration à l'indefinido : il pleuvait (llovía), il est entré (entró)." },
    ],
  },
  "g-pluscuamperfecto": {
    summary: {
      en: "The pluscuamperfecto (había + participle) expresses an action that happened before another past action. It helps to order events in a narrative.",
      fr: "Le plus-que-parfait (había + participe) exprime une action antérieure à une autre action passée. Il permet d'ordonner les événements d'un récit.",
    },
    rules: [
      { en: "Form: había, habías, había, habíamos, habíais, habían + participle: había terminado, habían salido.", fr: "Formation : había, habías, había, habíamos, habíais, habían + participe : había terminado, habían salido." },
      { en: "Use: the earlier of two past events: Cuando llegué, la reunión ya había empezado.", fr: "Emploi : le plus ancien de deux événements passés : Cuando llegué, la reunión ya había empezado." },
      { en: "Frequent with ya (already), todavía no or aún no (not yet), nunca antes (never before): Nunca había visto algo así.", fr: "Fréquent avec ya (déjà), todavía no ou aún no (pas encore), nunca antes (jamais auparavant) : Nunca había visto algo así." },
      { en: "In a narrative, the past tenses combine: indefinido for events, imperfecto for background, pluscuamperfecto for what had happened before, perfecto for what relates to now.", fr: "Dans un récit, les temps du passé se combinent : indefinido pour les événements, imperfecto pour l'arrière-plan, plus-que-parfait pour ce qui s'était passé avant, perfecto pour ce qui touche au présent." },
    ],
    examples: [
      { es: "Cuando llegamos a la estación, el tren ya había salido.", en: "When we got to the station, the train had already left.", fr: "Quand nous sommes arrivés à la gare, le train était déjà parti." },
      { es: "No conocía Bilbao: nunca había estado en el norte.", en: "I didn't know Bilbao: I had never been to the north.", fr: "Je ne connaissais pas Bilbao : je n'étais jamais allé dans le nord." },
    ],
    exceptions: [
      { en: "Haber is the only auxiliary and the participle never changes: había ido, se habían ido.", fr: "L'auxiliaire est toujours haber et le participe est invariable : había ido (j'étais allé), se habían ido (ils étaient partis)." },
    ],
    pitfalls: [
      { en: "Don't use it for a simple sequence: Llegué y cené is enough when events follow in order.", fr: "Inutile de l'employer pour une simple succession : Llegué y cené suffit quand les actions se suivent." },
    ],
  },
  "g-future-conditional-uses": {
    summary: {
      en: "Besides time, the future and the conditional express probability: the future for guesses about the present, the conditional for guesses about the past. The conditional also softens requests and advice.",
      fr: "Au-delà du temps, le futur et le conditionnel expriment la probabilité : le futur pour une supposition sur le présent, le conditionnel pour une supposition sur le passé. Le conditionnel adoucit aussi les demandes et les conseils.",
    },
    rules: [
      { en: "Future = probability now: ¿Dónde está Ana? — Estará en casa (she's probably at home). Tendrá unos treinta años.", fr: "Futur = probabilité dans le présent : ¿Dónde está Ana? — Estará en casa (elle doit être chez elle). Tendrá unos treinta años." },
      { en: "Conditional = probability in the past: ¿Qué hora era? — Serían las diez (it was probably about ten). Estaría cansado.", fr: "Conditionnel = probabilité dans le passé : ¿Qué hora era? — Serían las diez (il devait être dix heures). Estaría cansado." },
      { en: "Polite requests: ¿Podrías ayudarme? ¿Le importaría cerrar la ventana? Me gustaría hablar con usted.", fr: "Demandes polies : ¿Podrías ayudarme? ¿Le importaría cerrar la ventana? Me gustaría hablar con usted." },
      { en: "Advice: deberías, tendrías que, yo que tú + conditional: Deberías descansar. Yo que tú, lo llamaría.", fr: "Conseil : deberías, tendrías que, yo que tú + conditionnel : Deberías descansar. Yo que tú, lo llamaría." },
    ],
    examples: [
      { es: "No contesta; estará en una reunión.", en: "She's not answering; she must be in a meeting.", fr: "Elle ne répond pas ; elle doit être en réunion." },
      { es: "Cuando llegó, serían las once y estaría agotado.", en: "When he arrived, it was probably eleven and he must have been exhausted.", fr: "Quand il est arrivé, il devait être onze heures et il devait être épuisé." },
      { es: "¿Podrías mandarme el archivo? Yo que tú, lo revisaría antes.", en: "Could you send me the file? If I were you, I'd check it first.", fr: "Tu pourrais m'envoyer le fichier ? À ta place, je le vérifierais avant." },
    ],
    exceptions: [
      { en: "For a guess about a recent past, the future perfect is used: Habrá salido (he has probably gone out).", fr: "Pour une supposition sur un passé récent, on emploie le futur antérieur : Habrá salido (il a dû sortir)." },
    ],
    pitfalls: [
      { en: "'He must be at home' as a guess is Estará en casa or Debe de estar en casa, not an obligation.", fr: "« Il doit être chez lui » (supposition) = Estará en casa ou Debe de estar en casa, et non Tiene que estar en casa (obligation)." },
    ],
  },
};

const ex = (
  concept: string,
  n: number,
  data: Omit<GrammarExerciseSeed, "id" | "concept">,
): GrammarExerciseSeed => ({ id: `${concept}-${n}`, concept, ...data });

export const EXERCISES_3: GrammarExerciseSeed[] = [
  // g-time-expressions
  ex("g-time-expressions", 1, { type: "fill", es: "Vivo en Madrid ___ ___ cinco años.", blanks: [["desde"], ["hace"]], explanation: { en: "Length of time that continues: desde hace + duration, with the present.", fr: "Durée qui continue : desde hace + durée, avec le présent." } }),
  ex("g-time-expressions", 2, { type: "fill", es: "___ (llevar, yo) tres meses ___ (estudiar) español.", blanks: [["Llevo"], ["estudiando"]], explanation: { en: "Llevar + time + gerund.", fr: "Llevar + durée + gérondif." } }),
  ex("g-time-expressions", 3, { type: "fill", es: "___ (acabar, nosotros) ___ llegar; danos cinco minutos.", blanks: [["Acabamos"], ["de"]], explanation: { en: "Acabar de + infinitive = to have just done.", fr: "Acabar de + infinitif = venir de." } }),
  ex("g-time-expressions", 4, { type: "choose", es: "Trabajo aquí ___ 2021.", options: ["desde", "desde hace", "hace"], answers: ["desde"], explanation: { en: "A starting point (a year): desde.", fr: "Un point de départ (une année) : desde." } }),
  ex("g-time-expressions", 5, { type: "fill", es: "Si no contesta, ___ (volver, yo) a llamar mañana.", blanks: [["vuelvo"]], explanation: { en: "Volver a + infinitive = to do again.", fr: "Volver a + infinitif = refaire." } }),
  ex("g-time-expressions", 6, { type: "correct", es: "Vengo de terminar el informe.", answers: ["Acabo de terminar el informe."], explanation: { en: "To have just done = acabar de.", fr: "« Venir de faire » = acabar de, jamais *venir de." } }),
  ex("g-time-expressions", 7, { type: "translate", prompt: { en: "I've been waiting for an hour.", fr: "J'attends depuis une heure." }, answers: ["Llevo una hora esperando.", "Espero desde hace una hora.", "Hace una hora que espero.", "Estoy esperando desde hace una hora.", "Hace una hora que estoy esperando."], explanation: { en: "An ongoing situation: present tense with hace ... que, desde hace or llevar + gerund.", fr: "Situation qui dure : présent avec hace ... que, desde hace ou llevar + gérondif." } }),

  // g-periphrasis
  ex("g-periphrasis", 1, { type: "fill", es: "Mañana ___ ___ visitar a mis abuelos (ir a, yo).", blanks: [["voy"], ["a"]], explanation: { en: "A plan: ir a + infinitive.", fr: "Un projet : ir a + infinitif." } }),
  ex("g-periphrasis", 2, { type: "fill", es: "Para entrar en el museo ___ ___ reservar antes (obligación impersonal).", blanks: [["hay"], ["que"]], explanation: { en: "Impersonal obligation: hay que + infinitive.", fr: "Obligation impersonnelle : hay que + infinitif." } }),
  ex("g-periphrasis", 3, { type: "fill", es: "Los domingos ___ (soler, nosotros) comer en casa de mi madre.", blanks: [["solemos"]], explanation: { en: "Soler + infinitive = usually do (o → ue: solemos keeps o).", fr: "Soler + infinitif = avoir l'habitude de (solemos garde le o)." } }),
  ex("g-periphrasis", 4, { type: "fill", es: "¿___ (seguir, tú) trabajando en el mismo proyecto?", blanks: [["Sigues"]], explanation: { en: "Seguir + gerund = still be doing (e → i: sigues).", fr: "Seguir + gérondif = continuer à (e → i : sigues)." } }),
  ex("g-periphrasis", 5, { type: "choose", es: "He ___ fumar: ya no compro tabaco.", options: ["dejado de", "parado de", "dejado"], answers: ["dejado de"], explanation: { en: "Stop doing = dejar de + infinitive.", fr: "Arrêter de = dejar de + infinitif." } }),
  ex("g-periphrasis", 6, { type: "correct", es: "Hay que nosotros terminar antes de las cinco.", answers: ["Tenemos que terminar antes de las cinco."], explanation: { en: "Hay que has no subject; for a person, tener que.", fr: "Hay que n'a pas de sujet ; pour une personne, tener que." } }),
  ex("g-periphrasis", 7, { type: "translate", prompt: { en: "It's still raining.", fr: "Il pleut toujours." }, answers: ["Sigue lloviendo.", "Todavía está lloviendo.", "Aún está lloviendo.", "Sigue lloviendo todavía."], explanation: { en: "Seguir + gerund for an action that continues.", fr: "Seguir + gérondif pour une action qui continue." } }),

  // g-connectors
  ex("g-connectors", 1, { type: "distinguish", es: "No es ingeniero, ___ arquitecto. Es simpático, ___ un poco tímido.", blanks: [["sino"], ["pero"]], explanation: { en: "Correction after a negative → sino; limitation → pero.", fr: "Rectification après une négation → sino ; restriction → pero." } }),
  ex("g-connectors", 2, { type: "fill", es: "Ha estudiado mucho; ___, no ha aprobado.", blanks: [["sin embargo", "no obstante", "aun así"]], explanation: { en: "Contrast between two sentences: sin embargo.", fr: "Opposition entre deux phrases : sin embargo." } }),
  ex("g-connectors", 3, { type: "fill", es: "Tengo mucho trabajo, ___ no puedo ir al cine.", blanks: [["así que", "por eso", "por lo tanto"]], explanation: { en: "Consequence: así que, por eso, por lo tanto.", fr: "Conséquence : así que, por eso, por lo tanto." } }),
  ex("g-connectors", 4, { type: "choose", es: "Mi hermano vive en el campo; yo, ___, prefiero la ciudad.", options: ["en cambio", "a cambio", "además"], answers: ["en cambio"], explanation: { en: "Contrasting two people: en cambio.", fr: "Opposition entre deux personnes : en cambio." } }),
  ex("g-connectors", 5, { type: "correct", es: "No quiero té, pero café.", answers: ["No quiero té, sino café."], explanation: { en: "Correction after a negative: sino.", fr: "Rectification après une négation : sino." } }),
  ex("g-connectors", 6, { type: "translate", prompt: { en: "By the way, the meeting is at ten.", fr: "Au fait, la réunion est à dix heures." }, answers: ["Por cierto, la reunión es a las diez."], explanation: { en: "Por cierto introduces a side remark; events take ser.", fr: "Por cierto introduit une remarque incidente ; un événement se situe avec ser." } }),
  ex("g-connectors", 7, { type: "fill", es: "Es un proyecto ambicioso y, ___, muy caro (adición).", blanks: [["además"]], explanation: { en: "Addition: además.", fr: "Addition : además." } }),

  // g-relatives-1
  ex("g-relatives-1", 1, { type: "fill", es: "El tren ___ sale a las ocho llega a Madrid a las diez.", blanks: [["que"]], explanation: { en: "Default relative: que.", fr: "Relatif par défaut : que." } }),
  ex("g-relatives-1", 2, { type: "fill", es: "La señora con ___ hablaste es mi vecina.", blanks: [["quien", "la que", "la cual"]], explanation: { en: "After a preposition, for a person: quien (or la que).", fr: "Après une préposition, pour une personne : quien (ou la que)." } }),
  ex("g-relatives-1", 3, { type: "fill", es: "Este es el restaurante ___ cenamos el sábado.", blanks: [["donde", "en el que", "en el cual"]], explanation: { en: "A place: donde (or en el que).", fr: "Un lieu : donde (ou en el que)." } }),
  ex("g-relatives-1", 4, { type: "choose", es: "Los amigos a ___ invité no vinieron.", options: ["quienes", "que", "cuales"], answers: ["quienes"], explanation: { en: "Preposition + people: quienes (or a los que).", fr: "Préposition + personnes : quienes (ou a los que)." } }),
  ex("g-relatives-1", 5, { type: "correct", es: "El libro estoy leyendo es muy interesante.", answers: ["El libro que estoy leyendo es muy interesante."], explanation: { en: "The relative can never be left out.", fr: "Le relatif ne peut jamais être omis." } }),
  ex("g-relatives-1", 6, { type: "correct", es: "El chico quien vive enfrente es estudiante.", answers: ["El chico que vive enfrente es estudiante."], explanation: { en: "Defining clause without a preposition: que, not quien.", fr: "Relative déterminative sans préposition : que, et non quien." } }),
  ex("g-relatives-1", 7, { type: "translate", prompt: { en: "The colleague I work with speaks four languages.", fr: "Le collègue avec qui je travaille parle quatre langues." }, answers: ["El compañero con quien trabajo habla cuatro idiomas.", "El compañero con el que trabajo habla cuatro idiomas.", "El colega con quien trabajo habla cuatro idiomas.", "El colega con el que trabajo habla cuatro idiomas.", "El compañero con quien trabajo habla cuatro lenguas.", "El compañero con el que trabajo habla cuatro lenguas."], explanation: { en: "The preposition goes before the relative: con quien, con el que.", fr: "La préposition se place devant le relatif : con quien, con el que." } }),

  // g-relatives-2
  ex("g-relatives-2", 1, { type: "fill", es: "Esta es la empresa para ___ trabajo.", blanks: [["la que", "la cual"]], explanation: { en: "Preposition + la que, agreeing with empresa.", fr: "Préposition + la que, accordé avec empresa." } }),
  ex("g-relatives-2", 2, { type: "fill", es: "No entiendo ___ quieres decir.", blanks: [["lo que"]], explanation: { en: "What = lo que.", fr: "Ce que = lo que." } }),
  ex("g-relatives-2", 3, { type: "fill", es: "Es el escritor ___ novelas leímos en clase.", blanks: [["cuyas"]], explanation: { en: "Cuyo agrees with the possessed noun: cuyas novelas.", fr: "Cuyo s'accorde avec le nom possédé : cuyas novelas." } }),
  ex("g-relatives-2", 4, { type: "choose", es: "Los motivos por ___ me voy son personales.", options: ["los que", "que", "lo que"], answers: ["los que"], explanation: { en: "After a preposition: article + que, agreeing with motivos.", fr: "Après une préposition : article + que, accordé avec motivos." } }),
  ex("g-relatives-2", 5, { type: "correct", es: "El problema que hablamos ayer ya está resuelto.", answers: ["El problema del que hablamos ayer ya está resuelto.", "El problema del cual hablamos ayer ya está resuelto."], explanation: { en: "Hablar de → del que: the preposition must appear.", fr: "Hablar de → del que : la préposition doit apparaître." } }),
  ex("g-relatives-2", 6, { type: "correct", es: "Tengo un amigo cuyo hermana vive en Roma.", answers: ["Tengo un amigo cuya hermana vive en Roma."], explanation: { en: "Cuya agrees with hermana.", fr: "Cuya s'accorde avec hermana." } }),
  ex("g-relatives-2", 7, { type: "translate", prompt: { en: "What I need is time.", fr: "Ce dont j'ai besoin, c'est du temps." }, answers: ["Lo que necesito es tiempo."], explanation: { en: "What (the thing that) = lo que.", fr: "Ce que, ce dont = lo que (necesitar se construit sans préposition)." } }),

  // g-impersonal-se
  ex("g-impersonal-se", 1, { type: "fill", es: "En esta tienda se ___ (vender) bicicletas.", blanks: [["venden"]], explanation: { en: "Pasiva refleja: the verb agrees with bicicletas.", fr: "Passive pronominale : le verbe s'accorde avec bicicletas." } }),
  ex("g-impersonal-se", 2, { type: "fill", es: "Aquí se ___ (vivir) muy bien.", blanks: [["vive"]], explanation: { en: "Impersonal se: third-person singular.", fr: "Se impersonnel : 3e personne du singulier." } }),
  ex("g-impersonal-se", 3, { type: "fill", es: "Se ___ (necesitar) camareros con experiencia.", blanks: [["necesitan"]], explanation: { en: "The verb agrees with camareros.", fr: "Le verbe s'accorde avec camareros." } }),
  ex("g-impersonal-se", 4, { type: "fill", es: "___ ___ ha olvidado el paraguas (a mí).", blanks: [["Se"], ["me"]], explanation: { en: "Accidental event: se + me + verb.", fr: "Événement involontaire : se + me + verbe." } }),
  ex("g-impersonal-se", 5, { type: "choose", es: "A Pedro ___ el móvil al suelo.", options: ["se le cayó", "se cayó", "le cayó"], answers: ["se le cayó"], explanation: { en: "Accidental event with a person affected: se + le + verb.", fr: "Événement involontaire avec une personne concernée : se + le + verbe." } }),
  ex("g-impersonal-se", 6, { type: "correct", es: "Se vende pisos en el centro.", answers: ["Se venden pisos en el centro."], explanation: { en: "In standard Spanish the verb agrees with pisos.", fr: "Dans la norme, le verbe s'accorde avec pisos." } }),
  ex("g-impersonal-se", 7, { type: "translate", prompt: { en: "In Spain people eat late.", fr: "En Espagne, on mange tard." }, answers: ["En España se come tarde.", "En España se come muy tarde.", "En España la gente come tarde."], explanation: { en: "General statement: impersonal se.", fr: "Énoncé général : se impersonnel." } }),

  // g-lo-neutro
  ex("g-lo-neutro", 1, { type: "fill", es: "___ importante es no rendirse.", blanks: [["Lo"]], explanation: { en: "Lo + adjective = the ... thing.", fr: "Lo + adjectif = ce qui est ..." } }),
  ex("g-lo-neutro", 2, { type: "fill", es: "No sabes lo ___ (cansado) que está mi hermana.", blanks: [["cansada"]], explanation: { en: "The adjective agrees with hermana.", fr: "L'adjectif s'accorde avec hermana." } }),
  ex("g-lo-neutro", 3, { type: "fill", es: "Me sorprende ___ bien que hablas español.", blanks: [["lo"]], explanation: { en: "Lo + adverb + que = how well.", fr: "Lo + adverbe + que = à quel point." } }),
  ex("g-lo-neutro", 4, { type: "choose", es: "¿Sabes algo de ___ de Juan? Dicen que cambia de trabajo.", options: ["lo", "el", "la"], answers: ["lo"], explanation: { en: "Lo de + noun = the business about.", fr: "Lo de + nom = l'affaire de, l'histoire de." } }),
  ex("g-lo-neutro", 5, { type: "correct", es: "No entiendo el que dices.", answers: ["No entiendo lo que dices."], explanation: { en: "What = lo que.", fr: "Ce que = lo que." } }),
  ex("g-lo-neutro", 6, { type: "correct", es: "Lo problema es el precio.", answers: ["El problema es el precio."], explanation: { en: "Lo is never used with a noun.", fr: "Lo ne s'emploie jamais avec un nom." } }),
  ex("g-lo-neutro", 7, { type: "translate", prompt: { en: "The best thing is to wait.", fr: "Le mieux, c'est d'attendre." }, answers: ["Lo mejor es esperar."], explanation: { en: "Lo + mejor = the best thing.", fr: "Lo + mejor = le mieux." } }),

  // g-perfecto-indefinido
  ex("g-perfecto-indefinido", 1, { type: "fill", es: "Hoy ___ (levantarse, yo) a las seis.", blanks: [["me he levantado"]], explanation: { en: "Hoy is a period that includes now: perfecto.", fr: "Hoy inclut le présent : perfecto." } }),
  ex("g-perfecto-indefinido", 2, { type: "fill", es: "Ayer ___ (cenar, nosotros) en casa de Pablo.", blanks: [["cenamos"]], explanation: { en: "Ayer is a finished period: indefinido.", fr: "Ayer est une période terminée : indefinido." } }),
  ex("g-perfecto-indefinido", 3, { type: "distinguish", es: "Este año ___ (viajar, yo) poco, pero el año pasado ___ (viajar, yo) mucho.", blanks: [["he viajado"], ["viajé"]], explanation: { en: "Este año → perfecto; el año pasado → indefinido.", fr: "Este año → perfecto ; el año pasado → indefinido." } }),
  ex("g-perfecto-indefinido", 4, { type: "choose", es: "¿___ alguna vez en Japón?", options: ["Has estado", "Estuviste"], answers: ["Has estado"], explanation: { en: "Life experience with alguna vez: perfecto.", fr: "Expérience de vie avec alguna vez : perfecto." } }),
  ex("g-perfecto-indefinido", 5, { type: "correct", es: "Ayer he ido al médico.", answers: ["Ayer fui al médico."], explanation: { en: "Ayer requires the indefinido.", fr: "Ayer impose l'indefinido." } }),
  ex("g-perfecto-indefinido", 6, { type: "fill", es: "En 2018 ___ (terminar, ella) la carrera.", blanks: [["terminó"]], explanation: { en: "A past date: indefinido.", fr: "Une date passée : indefinido." } }),
  ex("g-perfecto-indefinido", 7, { type: "translate", prompt: { en: "I haven't read the email yet.", fr: "Je n'ai pas encore lu le mail." }, answers: ["Todavía no he leído el correo.", "Aún no he leído el correo.", "No he leído el correo todavía.", "No he leído el correo aún.", "Todavía no he leído el email."], explanation: { en: "Todavía no / aún no + perfecto.", fr: "Todavía no / aún no + perfecto." } }),

  // g-indefinido-imperfecto
  ex("g-indefinido-imperfecto", 1, { type: "distinguish", es: "Cuando ___ (llegar, yo) a casa, mis hijos ___ (dormir).", blanks: [["llegué"], ["dormían", "estaban durmiendo"]], explanation: { en: "The event (llegué) and the background in progress (dormían).", fr: "L'événement (llegué) et l'arrière-plan en cours (dormían)." } }),
  ex("g-indefinido-imperfecto", 2, { type: "fill", es: "De pequeño, ___ (pasar, yo) los veranos en el pueblo.", blanks: [["pasaba"]], explanation: { en: "A past habit: imperfecto.", fr: "Une habitude passée : imperfecto." } }),
  ex("g-indefinido-imperfecto", 3, { type: "fill", es: "___ (hacer) mucho calor y no ___ (haber) nadie en la calle.", blanks: [["Hacía"], ["había"]], explanation: { en: "Description of the setting: imperfecto.", fr: "Description du cadre : imperfecto." } }),
  ex("g-indefinido-imperfecto", 4, { type: "choose", es: "Ayer ___ que mi vecina se va a Canadá.", options: ["supe", "sabía"], answers: ["supe"], explanation: { en: "Supe = found out (a moment).", fr: "Supe = j'ai appris (un moment précis)." } }),
  ex("g-indefinido-imperfecto", 5, { type: "choose", es: "___ a Laura en una conferencia en 2019.", options: ["Conocí", "Conocía"], answers: ["Conocí"], explanation: { en: "Conocí = met for the first time.", fr: "Conocí = j'ai fait la connaissance." } }),
  ex("g-indefinido-imperfecto", 6, { type: "correct", es: "El año pasado iba a Roma dos veces.", answers: ["El año pasado fui a Roma dos veces."], explanation: { en: "Counted, completed events: indefinido.", fr: "Événements comptés et achevés : indefinido." } }),
  ex("g-indefinido-imperfecto", 7, { type: "translate", prompt: { en: "I was reading when the phone rang.", fr: "Je lisais quand le téléphone a sonné." }, answers: ["Leía cuando sonó el teléfono.", "Estaba leyendo cuando sonó el teléfono."], explanation: { en: "Action in progress (imperfecto) interrupted by an event (indefinido).", fr: "Action en cours (imperfecto) interrompue par un événement (indefinido)." } }),

  // g-pluscuamperfecto
  ex("g-pluscuamperfecto", 1, { type: "fill", es: "Cuando llegué, la película ya ___ (empezar).", blanks: [["había empezado"]], explanation: { en: "Earlier than llegué: pluscuamperfecto.", fr: "Antérieur à llegué : plus-que-parfait." } }),
  ex("g-pluscuamperfecto", 2, { type: "fill", es: "Nunca ___ (ver, yo) un paisaje tan bonito como aquel.", blanks: [["había visto"]], explanation: { en: "Nunca antes in the past: había + participle.", fr: "Jamais auparavant dans le passé : había + participe." } }),
  ex("g-pluscuamperfecto", 3, { type: "fill", es: "Cuando llamé, me dijeron que ya ___ (salir, ellos).", blanks: [["habían salido"]], explanation: { en: "Ya + an action before the call: habían salido.", fr: "Ya + action antérieure à l'appel : habían salido." } }),
  ex("g-pluscuamperfecto", 4, { type: "choose", es: "No pude entrar porque ___ las llaves en la oficina.", options: ["había dejado", "dejaba", "he dejado"], answers: ["había dejado"], explanation: { en: "Leaving the keys came before not being able to get in.", fr: "Oublier les clés précède le fait de ne pas pouvoir entrer." } }),
  ex("g-pluscuamperfecto", 5, { type: "correct", es: "Cuando llegamos, el concierto ya ha terminado.", answers: ["Cuando llegamos, el concierto ya había terminado."], explanation: { en: "Past before another past: había terminado.", fr: "Passé antérieur à un autre passé : había terminado." } }),
  ex("g-pluscuamperfecto", 6, { type: "correct", es: "Ella había ida al banco antes de comer.", answers: ["Ella había ido al banco antes de comer."], explanation: { en: "The participle never agrees after haber.", fr: "Le participe ne s'accorde jamais après haber." } }),
  ex("g-pluscuamperfecto", 7, { type: "translate", prompt: { en: "I had never eaten paella before.", fr: "Je n'avais jamais mangé de paella avant." }, answers: ["Nunca había comido paella antes.", "Nunca antes había comido paella.", "No había comido nunca paella antes.", "Nunca había comido paella."], explanation: { en: "Nunca + había + participle.", fr: "Nunca + había + participe." } }),

  // g-future-conditional-uses
  ex("g-future-conditional-uses", 1, { type: "fill", es: "¿Dónde está Luis? — No sé, ___ (estar, probabilidad) en el gimnasio.", blanks: [["estará"]], explanation: { en: "A guess about the present: future.", fr: "Supposition sur le présent : futur." } }),
  ex("g-future-conditional-uses", 2, { type: "fill", es: "Cuando salimos ___ (ser, probabilidad) las dos de la mañana.", blanks: [["serían"]], explanation: { en: "A guess about the past: conditional.", fr: "Supposition sur le passé : conditionnel." } }),
  ex("g-future-conditional-uses", 3, { type: "fill", es: "___ (deber, tú, consejo) dormir más; tienes mala cara.", blanks: [["Deberías"]], explanation: { en: "Advice: deberías + infinitive.", fr: "Conseil : deberías + infinitif." } }),
  ex("g-future-conditional-uses", 4, { type: "choose", es: "¿___ abrir la ventana, por favor? Hace calor.", options: ["Podrías", "Podrás"], answers: ["Podrías"], explanation: { en: "Polite request: conditional.", fr: "Demande polie : conditionnel." } }),
  ex("g-future-conditional-uses", 5, { type: "choose", es: "No contesta al teléfono. ___ dormido.", options: ["Estará", "Estaría"], answers: ["Estará"], explanation: { en: "A guess about now: future (estará).", fr: "Supposition sur le présent : futur (estará)." } }),
  ex("g-future-conditional-uses", 6, { type: "correct", es: "Yo que tú, lo llamaré mañana.", answers: ["Yo que tú, lo llamaría mañana."], explanation: { en: "Yo que tú + conditional.", fr: "Yo que tú + conditionnel." } }),
  ex("g-future-conditional-uses", 7, { type: "translate", prompt: { en: "She must be about forty.", fr: "Elle doit avoir environ quarante ans." }, answers: ["Tendrá unos cuarenta años.", "Tendrá cuarenta años más o menos.", "Debe de tener unos cuarenta años."], explanation: { en: "A guess about the present: future of probability.", fr: "Supposition sur le présent : futur de probabilité." } }),
];
