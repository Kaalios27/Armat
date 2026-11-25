import type { BilingualLesson, GrammarExerciseSeed } from "./types";

/** Pronouns, prepositions and key distinctions (A2). */
export const LESSONS_2: Record<string, BilingualLesson> = {
  "g-reflexive": {
    summary: {
      en: "Reflexive verbs use a pronoun that refers back to the subject: me, te, se, nos, os, se. Many everyday verbs are pronominal in Spanish, and the pronoun can change the meaning.",
      fr: "Les verbes pronominaux emploient un pronom qui renvoie au sujet : me, te, se, nos, os, se. Beaucoup de verbes courants sont pronominaux en espagnol, et le pronom peut en changer le sens.",
    },
    rules: [
      { en: "Forms: me levanto, te levantas, se levanta, nos levantamos, os levantáis, se levantan.", fr: "Formes : me levanto, te levantas, se levanta, nos levantamos, os levantáis, se levantan." },
      { en: "Reciprocal actions use the plural pronouns: Nos vemos mañana. Se escriben cada semana (they write to each other).", fr: "Les actions réciproques emploient les pronoms pluriels : Nos vemos mañana. Se escriben cada semana (ils s'écrivent chaque semaine)." },
      { en: "The pronoun changes the meaning of some verbs: ir (go) / irse (leave); dormir (sleep) / dormirse (fall asleep); quedar (meet up, be left) / quedarse (stay); llamar (call) / llamarse (be called).", fr: "Le pronom change le sens de certains verbes : ir (aller) / irse (partir) ; dormir (dormir) / dormirse (s'endormir) ; quedar (se donner rendez-vous, rester disponible) / quedarse (rester) ; llamar (appeler) / llamarse (s'appeler)." },
      { en: "With body parts and clothes, Spanish uses the article, not a possessive: Me lavo las manos. Se pone la chaqueta.", fr: "Avec les parties du corps et les vêtements, l'espagnol emploie l'article, pas le possessif : Me lavo las manos. Se pone la chaqueta." },
    ],
    examples: [
      { es: "Me levanto a las siete y me ducho enseguida.", en: "I get up at seven and shower straight away.", fr: "Je me lève à sept heures et je me douche tout de suite." },
      { es: "Nos vamos ya: mañana nos vemos en la oficina.", en: "We're leaving now: see you tomorrow at the office.", fr: "On s'en va : on se voit demain au bureau." },
      { es: "Siempre me duermo en el sofá después de comer.", en: "I always fall asleep on the sofa after lunch.", fr: "Je m'endors toujours sur le canapé après le déjeuner." },
    ],
    exceptions: [
      { en: "Some verbs are always pronominal: quejarse (de), arrepentirse (de), atreverse (a), darse cuenta (de).", fr: "Certains verbes sont toujours pronominaux : quejarse (de), arrepentirse (de), atreverse (a), darse cuenta (de)." },
    ],
    pitfalls: [
      { en: "Spanish often uses a reflexive where English doesn't: levantarse (get up), quedarse (stay), irse (leave), enfadarse (get angry).", fr: "Les verbes pronominaux ne coïncident pas toujours avec le français : se promener = pasear (sans pronom), mais rester = quedarse et partir = irse." },
      { en: "Use the article, not the possessive: Me lavo las manos (not *mis manos).", fr: "Pas de possessif avec le corps : Me lavo las manos (et non *mis manos)." },
    ],
  },
  "g-pronoun-placement": {
    summary: {
      en: "Object and reflexive pronouns go before a conjugated verb, but are attached to the end of infinitives, gerunds and affirmative commands.",
      fr: "Les pronoms compléments et réfléchis se placent devant un verbe conjugué, mais se soudent à la fin de l'infinitif, du gérondif et de l'impératif affirmatif.",
    },
    rules: [
      { en: "Conjugated verb: the pronoun comes first and stays separate: Lo veo. Te llamo mañana. No me lo dice.", fr: "Verbe conjugué : le pronom précède et reste séparé : Lo veo. Te llamo mañana. No me lo dice." },
      { en: "Infinitive and gerund: the pronoun is attached (Quiero verlo. Estoy leyéndolo). With a conjugated verb + infinitive or gerund, both positions are correct: Lo quiero ver = Quiero verlo; Lo estoy leyendo = Estoy leyéndolo.", fr: "Infinitif et gérondif : le pronom est soudé (Quiero verlo. Estoy leyéndolo). Avec un verbe conjugué + infinitif ou gérondif, les deux places sont correctes : Lo quiero ver = Quiero verlo ; Lo estoy leyendo = Estoy leyéndolo." },
      { en: "Affirmative commands: attached (Llámame. Siéntate). Negative commands: before the verb (No me llames. No te sientes).", fr: "Impératif affirmatif : soudé (Llámame. Siéntate). Impératif négatif : devant le verbe (No me llames. No te sientes)." },
      { en: "Attaching a pronoun can move the stress, so a written accent is added: leyendo → leyéndolo, llama → llámame, da → dámelo.", fr: "Souder un pronom peut déplacer l'accent tonique ; on ajoute alors un accent écrit : leyendo → leyéndolo, llama → llámame, da → dámelo." },
    ],
    examples: [
      { es: "¿El informe? Lo tengo que terminar hoy, pero ahora no puedo hacerlo.", en: "The report? I have to finish it today, but I can't do it now.", fr: "Le rapport ? Je dois le terminer aujourd'hui, mais je ne peux pas le faire maintenant." },
      { es: "Estamos revisándolo; llámanos esta tarde.", en: "We're checking it; call us this afternoon.", fr: "Nous sommes en train de le vérifier ; appelle-nous cet après-midi." },
    ],
    exceptions: [
      { en: "In vosotros commands of reflexive verbs the final -d drops before os: sentaos, levantaos (irse gives idos).", fr: "À l'impératif de vosotros, le -d final tombe devant os : sentaos, levantaos (irse donne idos)." },
    ],
    pitfalls: [
      { en: "Never put a pronoun between haber or estar and the following verb: *He lo visto → Lo he visto; *Estoy lo leyendo → Lo estoy leyendo.", fr: "Jamais de pronom entre haber ou estar et le verbe qui suit : *He lo visto → Lo he visto ; *Estoy lo leyendo → Lo estoy leyendo." },
      { en: "No goes before the whole group: No me lo ha dicho (not *Me lo no ha dicho).", fr: "Contrairement au français (je veux le voir), le pronom ne se place pas seul devant l'infinitif : quiero verlo ou lo quiero ver." },
    ],
  },
  "g-combined-pronouns": {
    summary: {
      en: "When a verb has both an indirect and a direct object pronoun, the indirect comes first (me lo, te la, nos los). Le and les become se before lo, la, los, las.",
      fr: "Quand un verbe a deux pronoms compléments, l'indirect précède le direct (me lo, te la, nos los). Le et les deviennent se devant lo, la, los, las.",
    },
    rules: [
      { en: "Order: indirect + direct, before a conjugated verb: Me lo explica. ¿Te lo envío?", fr: "Ordre : indirect + direct, devant un verbe conjugué : Me lo explica. ¿Te lo envío?" },
      { en: "le/les + lo/la/los/las → se lo, se la, se los, se las: Se lo doy (I give it to him, her, them or you).", fr: "le/les + lo/la/los/las → se lo, se la, se los, se las : Se lo doy (je le lui donne, je le leur donne)." },
      { en: "Because se is ambiguous, add a + person when needed: Se lo explico a Marta mañana.", fr: "Comme se est ambigu, on précise avec a + personne : Se lo explico a Marta mañana." },
      { en: "Attached to infinitives, gerunds and affirmative commands, the group usually needs an accent: Dámelo. Voy a explicárselo. Estoy enviándotelos.", fr: "Soudé à l'infinitif, au gérondif ou à l'impératif affirmatif, le groupe prend généralement un accent : Dámelo. Voy a explicárselo. Estoy enviándotelos." },
    ],
    examples: [
      { es: "¿Las llaves? Te las dejo en la mesa.", en: "The keys? I'll leave them for you on the table.", fr: "Les clés ? Je te les laisse sur la table." },
      { es: "Mi jefe quiere el informe hoy; se lo envío ahora.", en: "My boss wants the report today; I'll send it to him now.", fr: "Mon chef veut le rapport aujourd'hui ; je le lui envoie maintenant." },
      { es: "No entiendo el problema. ¿Me lo explicas?", en: "I don't understand the problem. Can you explain it to me?", fr: "Je ne comprends pas le problème. Tu me l'expliques ?" },
    ],
    exceptions: [],
    pitfalls: [
      { en: "Never *le lo or *les la: le and les always become se before lo, la, los, las.", fr: "Jamais *le lo ni *les la : le et les deviennent toujours se devant lo, la, los, las." },
      { en: "The order is the reverse of English 'give it to me': Dámelo (give-me-it).", fr: "L'ordre ne varie jamais, contrairement au français (je le lui donne / il me le donne) : toujours indirect + direct, se lo doy, me lo da." },
    ],
  },
  "g-prep-a-en-de": {
    summary: {
      en: "A, en and de are the most frequent prepositions. A expresses direction and introduces people as objects; en expresses location; de expresses origin, possession and material.",
      fr: "A, en et de sont les prépositions les plus fréquentes. A exprime la direction et introduit les personnes compléments ; en exprime la localisation ; de exprime l'origine, l'appartenance et la matière.",
    },
    rules: [
      { en: "A: direction with verbs of movement (voy a Madrid, llego a casa), clock time (a las ocho), indirect objects and personal a (doy el libro a Ana, veo a Ana).", fr: "A : direction avec les verbes de mouvement (voy a Madrid, llego a casa), heure (a las ocho), complément indirect et a personnel (doy el libro a Ana, veo a Ana)." },
      { en: "En: location without movement (estoy en casa, trabajo en una empresa), transport (en tren, en coche; but a pie), months, years and seasons (en mayo, en 2025, en verano).", fr: "En : lieu sans mouvement (estoy en casa, trabajo en una empresa), moyens de transport (en tren, en coche ; mais a pie), mois, années et saisons (en mayo, en 2025, en verano)." },
      { en: "De: origin (soy de Lyon), possession (el coche de mi padre), material and content (una mesa de madera, un vaso de agua), topic (un libro de historia).", fr: "De : origine (soy de Lyon), appartenance (el coche de mi padre), matière et contenu (una mesa de madera, un vaso de agua), sujet (un libro de historia)." },
      { en: "Llegar takes a: llego a Madrid, llegamos al aeropuerto (never *llegar en).", fr: "Llegar se construit avec a : llego a Madrid, llegamos al aeropuerto (jamais *llegar en)." },
    ],
    examples: [
      { es: "Voy a la oficina en metro y llego a las nueve.", en: "I go to the office by metro and arrive at nine.", fr: "Je vais au bureau en métro et j'arrive à neuf heures." },
      { es: "Mi compañera es de Bilbao, pero vive en Madrid.", en: "My colleague is from Bilbao, but she lives in Madrid.", fr: "Ma collègue est de Bilbao, mais elle habite à Madrid." },
      { es: "Necesito una caja de cartón para los libros de mi hermano.", en: "I need a cardboard box for my brother's books.", fr: "J'ai besoin d'un carton pour les livres de mon frère." },
    ],
    exceptions: [
      { en: "Days and dates take the article, not a preposition: el lunes (on Monday), el 3 de mayo (on 3 May).", fr: "Les jours et les dates prennent l'article, sans préposition : el lunes (lundi), el 3 de mayo (le 3 mai)." },
    ],
    pitfalls: [
      { en: "'In' or 'at' a place is en: I'm at home = estoy en casa; she works at a bank = trabaja en un banco.", fr: "« À » + lieu sans mouvement se traduit par en : je suis à Madrid = estoy en Madrid ; j'habite à Lyon = vivo en Lyon." },
      { en: "Ir a casa (go home) but estar en casa (be at home); by car = en coche, but on foot = a pie.", fr: "Ir a casa (rentrer chez soi) mais estar en casa (être chez soi) ; en voiture = en coche, mais à pied = a pie." },
    ],
  },
  "g-por-para": {
    summary: {
      en: "Para looks ahead to a goal: purpose, destination, deadline, recipient. Por looks back to a cause or describes the way through: reason, means, exchange, movement through a place.",
      fr: "Para regarde vers un but : finalité, destination, échéance, destinataire. Por renvoie à une cause ou décrit le passage : raison, moyen, échange, déplacement à travers un lieu.",
    },
    rules: [
      { en: "Para: purpose (estudio para aprender), destination (salgo para Madrid), deadline (para el lunes), recipient (es para ti), opinion (para mí, es caro).", fr: "Para : but (estudio para aprender), destination (salgo para Madrid), échéance (para el lunes), destinataire (es para ti), opinion (para mí, es caro)." },
      { en: "Por: cause (por la lluvia, gracias por todo), means (por teléfono, por correo), exchange and price (lo vendo por diez euros), movement through (paseamos por el centro), part of the day (por la mañana).", fr: "Por : cause (por la lluvia, gracias por todo), moyen (por teléfono, por correo), échange et prix (lo vendo por diez euros), déplacement à travers (paseamos por el centro), moment de la journée (por la mañana)." },
      { en: "Por also introduces the agent of a passive: diseñado por una ingeniera.", fr: "Por introduit aussi le complément d'agent : diseñado por una ingeniera." },
      { en: "A quick test: goal or destination → para; cause, channel or route → por.", fr: "Repère rapide : but ou destination → para ; cause, moyen ou trajet → por." },
    ],
    examples: [
      { es: "Trabajo por las tardes para pagar el máster.", en: "I work in the afternoons to pay for the master's degree.", fr: "Je travaille l'après-midi pour payer le master." },
      { es: "Gracias por el regalo; ¿es para mí?", en: "Thanks for the present; is it for me?", fr: "Merci pour le cadeau ; c'est pour moi ?" },
      { es: "Necesitamos el informe para el viernes; mándamelo por correo.", en: "We need the report by Friday; send it to me by email.", fr: "Il nous faut le rapport pour vendredi ; envoie-le-moi par mail." },
    ],
    exceptions: [
      { en: "Fixed expressions: por favor, por fin, por ejemplo, por cierto, por eso, para siempre.", fr: "Expressions figées : por favor, por fin, por ejemplo, por cierto, por eso, para siempre." },
    ],
    pitfalls: [
      { en: "Thanks for = gracias por, never *gracias para.", fr: "Merci pour = gracias por, jamais *gracias para." },
      { en: "Lo hago por ti = because of you, on your behalf; es para ti = it is meant for you.", fr: "« Pour » + infinitif de but = para (Lo hago para ayudarte) ; « pour » de cause = por (Lo hago por ti : à cause de toi, en ta faveur)." },
    ],
  },
  "g-prep-verbs": {
    summary: {
      en: "Many verbs require a specific preposition, and it often differs from English and French. Learn each verb together with its preposition.",
      fr: "Beaucoup de verbes exigent une préposition précise, souvent différente du français. Apprenez chaque verbe avec sa préposition.",
    },
    rules: [
      { en: "En: pensar en (think about), confiar en (trust), consistir en (consist of), tardar en (take time to), quedar en (agree to), fijarse en (notice).", fr: "En : pensar en (penser à), confiar en (faire confiance à), consistir en (consister en), tardar en (mettre du temps à), quedar en (convenir de), fijarse en (remarquer)." },
      { en: "De: depender de (depend on), acordarse de (remember), darse cuenta de (realise), enamorarse de (fall in love with), tratar de (try to / be about), olvidarse de (forget).", fr: "De : depender de (dépendre de), acordarse de (se souvenir de), darse cuenta de (se rendre compte de), enamorarse de (tomber amoureux de), tratar de (essayer de / traiter de), olvidarse de (oublier)." },
      { en: "Con: soñar con (dream of), casarse con (marry), contar con (count on), quedar con (meet up with someone).", fr: "Con : soñar con (rêver de), casarse con (se marier avec), contar con (compter sur), quedar con (retrouver quelqu'un)." },
      { en: "A + infinitive: empezar a, aprender a, ayudar a, volver a (do again), atreverse a.", fr: "A + infinitif : empezar a, aprender a, ayudar a, volver a (refaire), atreverse a." },
    ],
    examples: [
      { es: "Siempre pienso en el proyecto, incluso cuando sueño con las vacaciones.", en: "I'm always thinking about the project, even when I dream of the holidays.", fr: "Je pense toujours au projet, même quand je rêve des vacances." },
      { es: "El precio depende del tamaño, y tardan una semana en enviarlo.", en: "The price depends on the size, and they take a week to send it.", fr: "Le prix dépend de la taille, et ils mettent une semaine à l'envoyer." },
      { es: "Hemos quedado en vernos el jueves; ¿puedo contar contigo?", en: "We've agreed to meet on Thursday; can I count on you?", fr: "Nous avons convenu de nous voir jeudi ; je peux compter sur toi ?" },
    ],
    exceptions: [
      { en: "Some verbs take no preposition where English has one: buscar (look for), esperar (wait for), escuchar (listen to), mirar (look at), pedir (ask for).", fr: "À l'inverse, casarse con se traduit par « épouser » (sans préposition en français) et parecerse a par « ressembler à »." },
    ],
    pitfalls: [
      { en: "Don't translate the English preposition: depend on = depender de (not *en); think about = pensar en (not *sobre); dream of = soñar con.", fr: "Ne calquez pas le français : rêver de = soñar con ; penser à = pensar en ; compter sur = contar con." },
      { en: "After the preposition, use the infinitive: Tardo diez minutos en llegar.", fr: "Après la préposition, l'infinitif : Tardo diez minutos en llegar." },
    ],
  },
  "g-saber-conocer": {
    summary: {
      en: "Both translate 'to know'. Saber is for facts, information and skills; conocer is for people, places and things you are familiar with.",
      fr: "Les deux traduisent « savoir » ou « connaître ». Saber s'emploie pour les faits, les informations et les savoir-faire ; conocer pour les personnes, les lieux et ce qui nous est familier.",
    },
    rules: [
      { en: "Saber + fact or information: Sé su número. No sé dónde vive. ¿Sabes si viene?", fr: "Saber + fait ou information : Sé su número. No sé dónde vive. ¿Sabes si viene?" },
      { en: "Saber + infinitive = know how to: Sé nadar. ¿Sabes programar en Python?", fr: "Saber + infinitif = savoir faire : Sé nadar. ¿Sabes programar en Python?" },
      { en: "Conocer + person (with personal a), place or something experienced: Conozco a tu jefe. ¿Conoces Granada? Conozco bien este programa.", fr: "Conocer + personne (avec le a personnel), lieu ou chose expérimentée : Conozco a tu jefe. ¿Conoces Granada? Conozco bien este programa." },
      { en: "Irregular first person: sé, conozco.", fr: "1re personne irrégulière : sé, conozco." },
    ],
    examples: [
      { es: "No conozco a nadie en Sevilla, pero sé que es una ciudad preciosa.", en: "I don't know anyone in Seville, but I know it's a beautiful city.", fr: "Je ne connais personne à Séville, mais je sais que c'est une très belle ville." },
      { es: "¿Sabes conducir? — Sí, y conozco muy bien la carretera.", en: "Can you drive? — Yes, and I know the road very well.", fr: "Tu sais conduire ? — Oui, et je connais très bien la route." },
    ],
    exceptions: [
      { en: "Saber a means 'to taste of': Esta sopa sabe a ajo.", fr: "Saber a signifie « avoir le goût de » : Esta sopa sabe a ajo." },
    ],
    pitfalls: [
      { en: "Ability you learned: ¿Sabes nadar? (can you swim?). Poder expresses possibility or permission: Hoy no puedo nadar.", fr: "« Savoir + infinitif » = saber : Sé nadar. Poder exprime la possibilité : Hoy no puedo nadar (je ne peux pas aujourd'hui)." },
    ],
  },
  "g-pedir-preguntar": {
    summary: {
      en: "English 'ask' has two Spanish verbs: pedir is to ask for something (a request), preguntar is to ask a question (for information).",
      fr: "« Demander » se traduit par deux verbes : pedir pour demander quelque chose (une requête), preguntar pour poser une question (une information).",
    },
    rules: [
      { en: "Pedir + thing or action: pedir un café, pedir ayuda, pedir permiso. Stem change e → i: pido, pides, pide, pedimos, pedís, piden.", fr: "Pedir + chose ou action : pedir un café, pedir ayuda, pedir permiso. Alternance e → i : pido, pides, pide, pedimos, pedís, piden." },
      { en: "Preguntar + question: preguntar la hora, preguntar si..., preguntar dónde o cuándo... It is regular.", fr: "Preguntar + question : preguntar la hora, preguntar si..., preguntar dónde ou cuándo... Verbe régulier." },
      { en: "Preguntar por + person or thing = ask about, ask after: Mi madre pregunta por ti.", fr: "Preguntar por + personne ou chose = demander des nouvelles de, se renseigner sur : Mi madre pregunta por ti." },
      { en: "Ask a question = hacer una pregunta (never *preguntar una pregunta).", fr: "Poser une question = hacer una pregunta (jamais *preguntar una pregunta)." },
    ],
    examples: [
      { es: "Voy a pedir la cuenta y a preguntar si aceptan tarjeta.", en: "I'm going to ask for the bill and ask whether they take cards.", fr: "Je vais demander l'addition et demander s'ils acceptent la carte." },
      { es: "¿Puedo hacerte una pregunta? ¿Has pedido ya las vacaciones?", en: "Can I ask you a question? Have you requested your holidays yet?", fr: "Je peux te poser une question ? Tu as déjà demandé tes congés ?" },
    ],
    exceptions: [
      { en: "Asking someone to do something is pedir que + subjunctive: Te pido que vengas (studied with the subjunctive).", fr: "Demander à quelqu'un de faire quelque chose : pedir que + subjonctif : Te pido que vengas (vu avec le subjonctif)." },
    ],
    pitfalls: [
      { en: "Ordering in a restaurant is pedir: ¿Qué vas a pedir?", fr: "Commander au restaurant = pedir : ¿Qué vas a pedir?" },
      { en: "'Ask someone to do something' is never preguntar.", fr: "« Demander à quelqu'un de faire » ne se dit jamais avec preguntar." },
    ],
  },
  "g-ser-estar-2": {
    summary: {
      en: "With some adjectives, ser and estar give different meanings. Estar + participle describes the result of an action.",
      fr: "Avec certains adjectifs, ser et estar donnent des sens différents. Estar + participe décrit le résultat d'une action.",
    },
    rules: [
      { en: "Ser listo (clever) / estar listo (ready); ser aburrido (boring) / estar aburrido (bored); ser malo (bad) / estar malo (ill); ser rico (rich) / estar rico (tasty).", fr: "Ser listo (intelligent) / estar listo (prêt) ; ser aburrido (ennuyeux) / estar aburrido (s'ennuyer) ; ser malo (mauvais) / estar malo (malade) ; ser rico (riche) / estar rico (délicieux)." },
      { en: "Ser verde (green) / estar verde (unripe, inexperienced); ser abierto (open-minded) / estar abierto (open).", fr: "Ser verde (vert) / estar verde (pas mûr, inexpérimenté) ; ser abierto (ouvert d'esprit) / estar abierto (ouvert)." },
      { en: "Estar + participle = state resulting from an action: La puerta está cerrada. Los informes están terminados.", fr: "Estar + participe = état résultant d'une action : La puerta está cerrada. Los informes están terminados." },
      { en: "Está bien (it's fine, OK) is a state or judgement; es bueno describes quality: El hotel es bueno. ¿Está bien así?", fr: "Está bien (c'est bien, d'accord) : état ou jugement ; es bueno : qualité : El hotel es bueno. ¿Está bien así?" },
    ],
    examples: [
      { es: "La paella está muy rica; ¿quién la ha hecho?", en: "The paella is delicious; who made it?", fr: "La paella est délicieuse ; qui l'a faite ?" },
      { es: "Es un chico muy listo, pero hoy está aburrido.", en: "He's a very clever boy, but today he's bored.", fr: "C'est un garçon très intelligent, mais aujourd'hui il s'ennuie." },
      { es: "¿Estás lista? La tienda solo está abierta hasta las ocho.", en: "Are you ready? The shop is only open until eight.", fr: "Tu es prête ? Le magasin n'est ouvert que jusqu'à huit heures." },
    ],
    exceptions: [
      { en: "Ser + participle is the passive (La ley fue aprobada), not a state; it comes later with the passive.", fr: "Ser + participe est le passif (La ley fue aprobada), pas un état ; il sera vu avec le passif." },
    ],
    pitfalls: [
      { en: "Estoy aburrido = I'm bored; soy aburrido = I'm boring.", fr: "Estoy aburrido = je m'ennuie ; soy aburrido = je suis ennuyeux." },
      { en: "Food that tastes good: está rico or está bueno; es rico means rich.", fr: "Un plat délicieux : está rico ou está bueno ; es rico veut dire « riche »." },
    ],
  },
  "g-comparatives": {
    summary: {
      en: "Comparisons use más/menos ... que for inequality and tan ... como or tanto ... como for equality. A few adjectives have irregular comparatives.",
      fr: "On compare avec más/menos ... que pour l'inégalité et tan ... como ou tanto ... como pour l'égalité. Quelques adjectifs ont des comparatifs irréguliers.",
    },
    rules: [
      { en: "Más/menos + adjective, adverb or noun + que: Madrid es más grande que Sevilla. Trabajo menos horas que tú.", fr: "Más/menos + adjectif, adverbe ou nom + que : Madrid es más grande que Sevilla. Trabajo menos horas que tú." },
      { en: "Equality: tan + adjective or adverb + como (tan alto como); tanto/tanta/tantos/tantas + noun + como (tantos libros como); verb + tanto como (trabajo tanto como tú).", fr: "Égalité : tan + adjectif ou adverbe + como (tan alto como) ; tanto/tanta/tantos/tantas + nom + como (tantos libros como) ; verbe + tanto como (trabajo tanto como tú)." },
      { en: "Irregular: mejor (better), peor (worse), mayor (older, greater), menor (younger, smaller): Este método es mejor que el otro.", fr: "Irréguliers : mejor (meilleur, mieux), peor (pire), mayor (plus âgé, plus grand), menor (plus jeune, plus petit) : Este método es mejor que el otro." },
      { en: "Before a number: más de / menos de: Hay más de cien personas.", fr: "Devant un nombre : más de / menos de : Hay más de cien personas." },
    ],
    examples: [
      { es: "El tren es más rápido que el autobús, pero también es más caro.", en: "The train is faster than the bus, but it's also more expensive.", fr: "Le train est plus rapide que le bus, mais il est aussi plus cher." },
      { es: "Mi hermana es dos años mayor que yo y habla tantos idiomas como mi padre.", en: "My sister is two years older than me and speaks as many languages as my father.", fr: "Ma sœur a deux ans de plus que moi et parle autant de langues que mon père." },
    ],
    exceptions: [
      { en: "Más bueno and más malo are heard for kindness or taste, but mejor and peor are the usual comparatives.", fr: "Más bueno et más malo s'entendent pour la gentillesse ou le goût, mais mejor et peor sont les comparatifs usuels." },
    ],
    pitfalls: [
      { en: "Never *más mejor: mejor is already a comparative.", fr: "Jamais *más mejor : mejor est déjà un comparatif." },
      { en: "Que, not de, after más or menos in a comparison (más alto que tú); de only before numbers (más de diez).", fr: "Que et non de après más ou menos (más alto que tú) ; de seulement devant un nombre (más de diez)." },
    ],
  },
  "g-superlatives": {
    summary: {
      en: "The relative superlative is el/la/los/las + más/menos + adjective (+ de). The absolute superlative -ísimo intensifies without comparing.",
      fr: "Le superlatif relatif se forme avec el/la/los/las + más/menos + adjectif (+ de). Le superlatif absolu en -ísimo intensifie sans comparer.",
    },
    rules: [
      { en: "El más / la menos + adjective + de + group: Es el edificio más alto de la ciudad. Es la opción menos cara de todas.", fr: "El más / la menos + adjectif + de + ensemble : Es el edificio más alto de la ciudad. Es la opción menos cara de todas." },
      { en: "-ísimo = very, extremely: rápido → rapidísimo, fácil → facilísimo, interesante → interesantísimo. It agrees: rapidísimas.", fr: "-ísimo = très, extrêmement : rápido → rapidísimo, fácil → facilísimo, interesante → interesantísimo. Il s'accorde : rapidísimas." },
      { en: "Spelling changes: largo → larguísimo, rico → riquísimo, feliz → felicísimo, amable → amabilísimo.", fr: "Changements orthographiques : largo → larguísimo, rico → riquísimo, feliz → felicísimo, amable → amabilísimo." },
      { en: "Lo más + adjective = the most ... thing: Lo más importante es empezar. Hazlo lo más rápido posible.", fr: "Lo más + adjectif = le plus ... : Lo más importante es empezar. Hazlo lo más rápido posible." },
    ],
    examples: [
      { es: "Es el mejor restaurante del barrio y la comida está buenísima.", en: "It's the best restaurant in the area and the food is really good.", fr: "C'est le meilleur restaurant du quartier et la cuisine est excellente." },
      { es: "El viaje es larguísimo, pero lo más difícil es volver a casa.", en: "The journey is extremely long, but the hardest part is coming back home.", fr: "Le voyage est interminable, mais le plus difficile, c'est de rentrer." },
    ],
    exceptions: [
      { en: "Mejor, peor, mayor, menor form the superlative with the article: el mejor, la peor, el mayor de mis hermanos.", fr: "Mejor, peor, mayor, menor forment le superlatif avec l'article : el mejor, la peor, el mayor de mis hermanos." },
    ],
    pitfalls: [
      { en: "'In' after a superlative is de: el más alto de la clase (not *en la clase).", fr: "Après un superlatif, « de » : el más alto de la clase (et non *en la clase)." },
      { en: "Don't combine muy with -ísimo: *muy rapidísimo.", fr: "On ne combine pas muy et -ísimo : *muy rapidísimo." },
    ],
  },
  "g-adjective-position": {
    summary: {
      en: "Descriptive adjectives normally follow the noun. Placed before it, some change meaning, and a few are shortened.",
      fr: "Les adjectifs qualificatifs se placent normalement après le nom. Devant le nom, certains changent de sens, et quelques-uns s'abrègent.",
    },
    rules: [
      { en: "Default: noun + adjective (un coche rojo, una idea interesante). Before the noun, an adjective adds a subjective or emphatic nuance (una magnífica idea).", fr: "Par défaut : nom + adjectif (un coche rojo, una idea interesante). Devant le nom, l'adjectif prend une nuance subjective ou d'insistance (una magnífica idea)." },
      { en: "Meaning changes: un gran hombre (a great man) / un hombre grande (a big man); un viejo amigo (a long-standing friend) / un amigo viejo (an elderly friend); un pobre chico (an unfortunate boy) / un chico pobre (a boy without money); un nuevo coche (another car) / un coche nuevo (a brand-new car).", fr: "Changements de sens : un gran hombre (un grand homme) / un hombre grande (un homme grand) ; un viejo amigo (un vieil ami) / un amigo viejo (un ami âgé) ; un pobre chico (un pauvre garçon, malheureux) / un chico pobre (un garçon sans argent) ; un nuevo coche (une autre voiture) / un coche nuevo (une voiture neuve)." },
      { en: "Shortened before a masculine singular noun: buen, mal, primer, tercer, algún, ningún; grande → gran before any singular noun (un gran día, una gran idea).", fr: "Formes abrégées devant un nom masculin singulier : buen, mal, primer, tercer, algún, ningún ; grande → gran devant tout nom singulier (un gran día, una gran idea)." },
    ],
    examples: [
      { es: "Es un buen profesor y un gran amigo.", en: "He's a good teacher and a great friend.", fr: "C'est un bon professeur et un grand ami." },
      { es: "Vivo en el tercer piso de un edificio antiguo.", en: "I live on the third floor of an old building.", fr: "J'habite au troisième étage d'un immeuble ancien." },
      { es: "La pobre chica ha perdido el último tren.", en: "The poor girl has missed the last train.", fr: "La pauvre fille a raté le dernier train." },
    ],
    exceptions: [
      { en: "Cualquiera becomes cualquier before any noun: cualquier día, cualquier persona.", fr: "Cualquiera devient cualquier devant tout nom : cualquier día, cualquier persona." },
    ],
    pitfalls: [
      { en: "Buen and mal only before masculine singular nouns: una buena idea (not *una buen idea).", fr: "Buen et mal seulement devant un nom masculin singulier : una buena idea (et non *una buen idea)." },
    ],
  },
};

const ex = (
  concept: string,
  n: number,
  data: Omit<GrammarExerciseSeed, "id" | "concept">,
): GrammarExerciseSeed => ({ id: `${concept}-${n}`, concept, ...data });

export const EXERCISES_2: GrammarExerciseSeed[] = [
  // g-reflexive
  ex("g-reflexive", 1, { type: "fill", es: "Normalmente ___ (levantarse, yo) a las siete.", blanks: [["me levanto"]], explanation: { en: "Levantarse: me + the first-person form.", fr: "Levantarse : me + la forme de la 1re personne." } }),
  ex("g-reflexive", 2, { type: "fill", es: "¿A qué hora ___ (acostarse, vosotros) los sábados?", blanks: [["os acostáis"]], explanation: { en: "Vosotros → os + -áis; the o → ue change does not affect vosotros.", fr: "Vosotros → os + -áis ; la diphtongue o → ue ne touche pas vosotros." } }),
  ex("g-reflexive", 3, { type: "choose", es: "Es tarde: ___ ya, ¡hasta mañana!", options: ["me voy", "voy"], answers: ["me voy"], explanation: { en: "Irse = to leave; ir alone needs a destination.", fr: "Irse = partir ; ir seul demande une destination." } }),
  ex("g-reflexive", 4, { type: "fill", es: "¿Cómo ___ (llamarse) tu jefa?", blanks: [["se llama"]], explanation: { en: "Llamarse (to be called): se llama.", fr: "Llamarse (s'appeler) : se llama." } }),
  ex("g-reflexive", 5, { type: "correct", es: "Me lavo mis manos antes de comer.", answers: ["Me lavo las manos antes de comer."], explanation: { en: "With body parts, use the article: me lavo las manos.", fr: "Avec les parties du corps, l'article : me lavo las manos." } }),
  ex("g-reflexive", 6, { type: "translate", prompt: { en: "See you tomorrow at the station.", fr: "On se voit demain à la gare." }, answers: ["Nos vemos mañana en la estación."], explanation: { en: "Reciprocal verb: nos vemos.", fr: "Verbe réciproque : nos vemos." } }),
  ex("g-reflexive", 7, { type: "fill", es: "Los domingos ___ (quedarse, yo) en casa y ___ (dormir, yo) hasta tarde.", blanks: [["me quedo"], ["duermo"]], explanation: { en: "Quedarse = to stay; dormir (not dormirse) for sleeping late.", fr: "Quedarse = rester ; dormir (et non dormirse) pour « dormir tard »." } }),

  // g-pronoun-placement
  ex("g-pronoun-placement", 1, { type: "reconstruct", tokens: ["Lo", "he", "visto", "esta", "mañana."], answers: ["Lo he visto esta mañana."], explanation: { en: "The pronoun goes before haber, never between haber and the participle.", fr: "Le pronom se place devant haber, jamais entre haber et le participe." } }),
  ex("g-pronoun-placement", 2, { type: "fill", es: "No puedo ___ (hacer + lo) ahora.", blanks: [["hacerlo"]], explanation: { en: "Attached to the infinitive: hacerlo.", fr: "Soudé à l'infinitif : hacerlo." } }),
  ex("g-pronoun-placement", 3, { type: "fill", es: "Estoy ___ (leer + lo) ahora mismo.", blanks: [["leyéndolo"]], explanation: { en: "Attached to the gerund, with an accent to keep the stress: leyéndolo.", fr: "Soudé au gérondif, avec un accent pour garder l'accent tonique : leyéndolo." } }),
  ex("g-pronoun-placement", 4, { type: "choose", es: "Si tienes dudas, ___.", options: ["llámame", "llamame", "me llama"], answers: ["llámame"], explanation: { en: "Affirmative tú command + attached pronoun, with an accent: llámame.", fr: "Impératif affirmatif (tú) + pronom soudé, avec accent : llámame." } }),
  ex("g-pronoun-placement", 5, { type: "correct", es: "Me lo no ha dicho.", answers: ["No me lo ha dicho."], explanation: { en: "No goes before the whole pronoun group.", fr: "No se place devant tout le groupe de pronoms." } }),
  ex("g-pronoun-placement", 6, { type: "translate", prompt: { en: "Sit down, please.", fr: "Assieds-toi, s'il te plaît." }, answers: ["Siéntate, por favor.", "Por favor, siéntate.", "Siéntese, por favor.", "Por favor, siéntese."], explanation: { en: "Affirmative command: pronoun attached, with an accent.", fr: "Impératif affirmatif : pronom soudé, avec accent." } }),
  ex("g-pronoun-placement", 7, { type: "fill", es: "No ___ (preocuparse, tú): lo arreglamos mañana.", blanks: [["te preocupes"]], explanation: { en: "Negative command: the pronoun goes before the verb.", fr: "Impératif négatif : le pronom se place devant le verbe." } }),

  // g-combined-pronouns
  ex("g-combined-pronouns", 1, { type: "fill", es: "¿El libro? Mañana ___ ___ devuelvo (a ti).", blanks: [["te"], ["lo"]], explanation: { en: "Indirect te before direct lo.", fr: "L'indirect te avant le direct lo." } }),
  ex("g-combined-pronouns", 2, { type: "fill", es: "¿Las fotos? ___ ___ enseño a mis padres esta noche.", blanks: [["Se"], ["las"]], explanation: { en: "Les + las → se las.", fr: "Les + las → se las." } }),
  ex("g-combined-pronouns", 3, { type: "correct", es: "Le lo explico a mi compañero.", answers: ["Se lo explico a mi compañero."], explanation: { en: "Le becomes se before lo.", fr: "Le devient se devant lo." } }),
  ex("g-combined-pronouns", 4, { type: "fill", es: "Necesito la contraseña: ¿puedes ___ (dar + me + la)?", blanks: [["dármela"]], explanation: { en: "Infinitive + me + la, with an accent: dármela.", fr: "Infinitif + me + la, avec accent : dármela." } }),
  ex("g-combined-pronouns", 5, { type: "choose", es: "He comprado un regalo para mi madre. Voy a ___ mañana.", options: ["dárselo", "dárlelo", "dárselos"], answers: ["dárselo"], explanation: { en: "Le + lo → se lo, attached to the infinitive: dárselo.", fr: "Le + lo → se lo, soudé à l'infinitif : dárselo." } }),
  ex("g-combined-pronouns", 6, { type: "translate", prompt: { en: "The key? I'll give it to you tomorrow.", fr: "La clé ? Je te la donne demain." }, answers: ["¿La llave? Te la doy mañana.", "¿La llave? Mañana te la doy.", "¿La llave? Te la daré mañana.", "¿La llave? Mañana te la daré."], explanation: { en: "Te (indirect) + la (direct), before the verb.", fr: "Te (indirect) + la (direct), devant le verbe." } }),
  ex("g-combined-pronouns", 7, { type: "reconstruct", tokens: ["No", "se", "lo", "digas", "a", "nadie."], answers: ["No se lo digas a nadie."], explanation: { en: "Negative command: no + se + lo before the verb.", fr: "Impératif négatif : no + se + lo devant le verbe." } }),

  // g-prep-a-en-de
  ex("g-prep-a-en-de", 1, { type: "fill", es: "Llegamos ___ aeropuerto ___ las seis.", blanks: [["al"], ["a"]], explanation: { en: "Llegar a (a + el = al); a for clock time.", fr: "Llegar a (a + el = al) ; a pour l'heure." } }),
  ex("g-prep-a-en-de", 2, { type: "fill", es: "Trabajo ___ una empresa de software y vivo ___ Valencia.", blanks: [["en"], ["en"]], explanation: { en: "Location without movement: en.", fr: "Lieu sans mouvement : en." } }),
  ex("g-prep-a-en-de", 3, { type: "fill", es: "Voy a la universidad ___ bici, pero los lunes voy ___ pie.", blanks: [["en"], ["a"]], explanation: { en: "En + means of transport, but a pie.", fr: "En + moyen de transport, mais a pie." } }),
  ex("g-prep-a-en-de", 4, { type: "choose", es: "Esta camisa es ___ algodón.", options: ["de", "en"], answers: ["de"], explanation: { en: "Material: de.", fr: "Matière : de." } }),
  ex("g-prep-a-en-de", 5, { type: "correct", es: "Mañana voy en Barcelona en tren.", answers: ["Mañana voy a Barcelona en tren."], explanation: { en: "Destination with ir: a.", fr: "Destination avec ir : a." } }),
  ex("g-prep-a-en-de", 6, { type: "translate", prompt: { en: "My colleague is from Seville but lives in Madrid.", fr: "Mon collègue est de Séville mais il habite à Madrid." }, answers: ["Mi compañero es de Sevilla pero vive en Madrid.", "Mi colega es de Sevilla pero vive en Madrid."], explanation: { en: "De for origin, en for where someone lives.", fr: "De pour l'origine, en pour le lieu où l'on habite." } }),
  ex("g-prep-a-en-de", 7, { type: "fill", es: "Nos vemos ___ lunes ___ las ocho.", blanks: [["el"], ["a"]], explanation: { en: "Days take the article (el lunes); a for clock time.", fr: "Les jours prennent l'article (el lunes) ; a pour l'heure." } }),

  // g-por-para
  ex("g-por-para", 1, { type: "fill", es: "Estudio español ___ trabajar en Madrid.", blanks: [["para"]], explanation: { en: "Purpose: para + infinitive.", fr: "But : para + infinitif." } }),
  ex("g-por-para", 2, { type: "fill", es: "Gracias ___ tu ayuda.", blanks: [["por"]], explanation: { en: "Gracias por: the cause of the thanks.", fr: "Gracias por : la cause du remerciement." } }),
  ex("g-por-para", 3, { type: "fill", es: "El proyecto tiene que estar listo ___ el viernes.", blanks: [["para"]], explanation: { en: "Deadline: para.", fr: "Échéance : para." } }),
  ex("g-por-para", 4, { type: "fill", es: "Te llamo ___ teléfono esta tarde.", blanks: [["por"]], explanation: { en: "Means of communication: por.", fr: "Moyen de communication : por." } }),
  ex("g-por-para", 5, { type: "choose", es: "Damos un paseo ___ el parque.", options: ["por", "para"], answers: ["por"], explanation: { en: "Movement through a place: por.", fr: "Déplacement à travers un lieu : por." } }),
  ex("g-por-para", 6, { type: "distinguish", es: "Este regalo es ___ ti. Gracias ___ venir.", blanks: [["para"], ["por"]], explanation: { en: "Recipient → para; cause of the thanks → por.", fr: "Destinataire → para ; cause du remerciement → por." } }),
  ex("g-por-para", 7, { type: "translate", prompt: { en: "We need the plans by Monday.", fr: "Il nous faut les plans pour lundi." }, answers: ["Necesitamos los planos para el lunes.", "Necesitamos los planos antes del lunes."], explanation: { en: "Deadline: para el lunes.", fr: "Échéance : para el lunes." } }),
  ex("g-por-para", 8, { type: "correct", es: "Estudio mucho por aprobar el examen.", answers: ["Estudio mucho para aprobar el examen."], explanation: { en: "Purpose: para + infinitive.", fr: "But : para + infinitif." } }),

  // g-prep-verbs
  ex("g-prep-verbs", 1, { type: "fill", es: "Pienso ___ ti a menudo.", blanks: [["en"]], explanation: { en: "Pensar en (think about).", fr: "Pensar en (penser à)." } }),
  ex("g-prep-verbs", 2, { type: "fill", es: "El resultado depende ___ los datos.", blanks: [["de"]], explanation: { en: "Depender de (depend on).", fr: "Depender de (dépendre de)." } }),
  ex("g-prep-verbs", 3, { type: "fill", es: "A veces sueño ___ el examen de conducir.", blanks: [["con"]], explanation: { en: "Soñar con (dream of).", fr: "Soñar con (rêver de)." } }),
  ex("g-prep-verbs", 4, { type: "fill", es: "¿Te acuerdas ___ mi compañera Laura?", blanks: [["de"]], explanation: { en: "Acordarse de (remember).", fr: "Acordarse de (se souvenir de)." } }),
  ex("g-prep-verbs", 5, { type: "fill", es: "Tardamos dos horas ___ llegar.", blanks: [["en"]], explanation: { en: "Tardar en + infinitive (take time to).", fr: "Tardar en + infinitif (mettre du temps à)." } }),
  ex("g-prep-verbs", 6, { type: "correct", es: "Mi hermana se casa a un chico de Cádiz.", answers: ["Mi hermana se casa con un chico de Cádiz."], explanation: { en: "Casarse con (marry).", fr: "Casarse con (épouser)." } }),
  ex("g-prep-verbs", 7, { type: "translate", prompt: { en: "I can't find my keys; I'm looking for them.", fr: "Je ne trouve pas mes clés ; je les cherche." }, answers: ["No encuentro mis llaves; las estoy buscando.", "No encuentro mis llaves; estoy buscándolas.", "No encuentro las llaves; las estoy buscando.", "No encuentro las llaves; estoy buscándolas.", "No encuentro mis llaves; las busco.", "No encuentro las llaves; las busco."], explanation: { en: "Buscar takes no preposition (look for).", fr: "Buscar se construit sans préposition (chercher)." } }),
  ex("g-prep-verbs", 8, { type: "choose", es: "Me doy cuenta ___ error.", options: ["del", "el", "en el"], answers: ["del"], explanation: { en: "Darse cuenta de (realise): de + el = del.", fr: "Darse cuenta de (se rendre compte de) : de + el = del." } }),

  // g-saber-conocer
  ex("g-saber-conocer", 1, { type: "fill", es: "No ___ (saber, yo) dónde está la estación.", blanks: [["sé"]], explanation: { en: "Information → saber; first person sé.", fr: "Information → saber ; 1re personne sé." } }),
  ex("g-saber-conocer", 2, { type: "fill", es: "¿___ (conocer, tú) a mi hermana?", blanks: [["Conoces"]], explanation: { en: "A person → conocer + personal a.", fr: "Une personne → conocer + a personnel." } }),
  ex("g-saber-conocer", 3, { type: "fill", es: "Mi hijo ya ___ (saber) leer.", blanks: [["sabe"]], explanation: { en: "Skill → saber + infinitive.", fr: "Savoir-faire → saber + infinitif." } }),
  ex("g-saber-conocer", 4, { type: "choose", es: "¿___ Lisboa? Es una ciudad preciosa.", options: ["Conoces", "Sabes"], answers: ["Conoces"], explanation: { en: "A place you have visited → conocer.", fr: "Un lieu où l'on est allé → conocer." } }),
  ex("g-saber-conocer", 5, { type: "correct", es: "Sé a tu profesor de matemáticas.", answers: ["Conozco a tu profesor de matemáticas."], explanation: { en: "People → conocer.", fr: "Les personnes → conocer." } }),
  ex("g-saber-conocer", 6, { type: "translate", prompt: { en: "Do you know if the meeting is tomorrow?", fr: "Tu sais si la réunion est demain ?" }, answers: ["¿Sabes si la reunión es mañana?"], explanation: { en: "Information introduced by si → saber.", fr: "Information introduite par si → saber." } }),
  ex("g-saber-conocer", 7, { type: "distinguish", es: "___ a mucha gente en la empresa, pero no ___ cómo funciona el sistema.", blanks: [["Conozco"], ["sé"]], explanation: { en: "People → conocer; how something works → saber.", fr: "Des personnes → conocer ; le fonctionnement de quelque chose → saber." } }),

  // g-pedir-preguntar
  ex("g-pedir-preguntar", 1, { type: "fill", es: "Siempre ___ (pedir, yo) la misma pizza.", blanks: [["pido"]], explanation: { en: "Order something → pedir (e → i: pido).", fr: "Commander → pedir (e → i : pido)." } }),
  ex("g-pedir-preguntar", 2, { type: "fill", es: "El turista me ___ (preguntar) dónde está el museo.", blanks: [["pregunta"]], explanation: { en: "A question for information → preguntar.", fr: "Une question pour s'informer → preguntar." } }),
  ex("g-pedir-preguntar", 3, { type: "choose", es: "¿Puedo ___ algo? ¿A qué hora empieza la clase?", options: ["preguntarte", "pedirte"], answers: ["preguntarte"], explanation: { en: "Asking for information → preguntar.", fr: "Demander une information → preguntar." } }),
  ex("g-pedir-preguntar", 4, { type: "choose", es: "Si necesitas dinero, ___ a tus padres.", options: ["pídeselo", "pregúntaselo"], answers: ["pídeselo"], explanation: { en: "Asking for something → pedir.", fr: "Demander quelque chose → pedir." } }),
  ex("g-pedir-preguntar", 5, { type: "correct", es: "¿Puedo preguntarte una pregunta?", answers: ["¿Puedo hacerte una pregunta?"], explanation: { en: "Ask a question = hacer una pregunta.", fr: "Poser une question = hacer una pregunta." } }),
  ex("g-pedir-preguntar", 6, { type: "translate", prompt: { en: "My grandmother always asks about you.", fr: "Ma grand-mère demande toujours de tes nouvelles." }, answers: ["Mi abuela siempre pregunta por ti.", "Mi abuela pregunta siempre por ti."], explanation: { en: "Preguntar por + person.", fr: "Preguntar por + personne." } }),
  ex("g-pedir-preguntar", 7, { type: "fill", es: "Los niños ___ (pedir) helado y yo ___ (pedir) un café.", blanks: [["piden"], ["pido"]], explanation: { en: "Pedir changes e → i in stressed syllables: piden, pido.", fr: "Pedir change e → i dans les formes accentuées sur le radical : piden, pido." } }),

  // g-ser-estar-2
  ex("g-ser-estar-2", 1, { type: "choose", es: "¿Nos vamos? ¿___ lista?", options: ["Estás", "Eres"], answers: ["Estás"], explanation: { en: "Estar listo = to be ready.", fr: "Estar listo = être prêt." } }),
  ex("g-ser-estar-2", 2, { type: "fill", es: "Mi abuelo ___ muy rico: tiene tres empresas.", blanks: [["es"]], explanation: { en: "Ser rico = to be rich.", fr: "Ser rico = être riche." } }),
  ex("g-ser-estar-2", 3, { type: "fill", es: "Esta sopa ___ muy rica.", blanks: [["está"]], explanation: { en: "Estar rico = to taste good.", fr: "Estar rico = être délicieux." } }),
  ex("g-ser-estar-2", 4, { type: "fill", es: "La biblioteca ___ cerrada los domingos.", blanks: [["está"]], explanation: { en: "Estar + participle: resulting state.", fr: "Estar + participe : état résultant." } }),
  ex("g-ser-estar-2", 5, { type: "distinguish", es: "La película ___ aburrida y yo ___ aburrido.", blanks: [["es"], ["estoy"]], explanation: { en: "Ser aburrido = boring; estar aburrido = bored.", fr: "Ser aburrido = ennuyeux ; estar aburrido = s'ennuyer." } }),
  ex("g-ser-estar-2", 6, { type: "correct", es: "Hoy no voy a trabajar porque soy malo.", answers: ["Hoy no voy a trabajar porque estoy malo."], explanation: { en: "Estar malo = to be ill; ser malo = to be bad.", fr: "Estar malo = être malade ; ser malo = être méchant ou mauvais." } }),
  ex("g-ser-estar-2", 7, { type: "translate", prompt: { en: "The windows are open.", fr: "Les fenêtres sont ouvertes." }, answers: ["Las ventanas están abiertas."], explanation: { en: "Resulting state: estar + participle.", fr: "État résultant : estar + participe." } }),

  // g-comparatives
  ex("g-comparatives", 1, { type: "fill", es: "El coche es ___ rápido ___ la bici.", blanks: [["más"], ["que"]], explanation: { en: "Más + adjective + que.", fr: "Más + adjectif + que." } }),
  ex("g-comparatives", 2, { type: "fill", es: "Este ordenador es ___ (bueno, comparativo) que el mío.", blanks: [["mejor"]], explanation: { en: "Bueno → mejor.", fr: "Bueno → mejor." } }),
  ex("g-comparatives", 3, { type: "fill", es: "Ana tiene ___ paciencia ___ su madre (igualdad).", blanks: [["tanta"], ["como"]], explanation: { en: "Tanto agrees with the noun: tanta paciencia como.", fr: "Tanto s'accorde avec le nom : tanta paciencia como." } }),
  ex("g-comparatives", 4, { type: "fill", es: "Hoy en la reunión hay ___ ___ cincuenta personas (superioridad).", blanks: [["más"], ["de"]], explanation: { en: "Before a number: más de.", fr: "Devant un nombre : más de." } }),
  ex("g-comparatives", 5, { type: "choose", es: "Este hotel es ___ que el del año pasado: la habitación es pequeña y ruidosa.", options: ["peor", "más peor"], answers: ["peor"], explanation: { en: "Peor is already a comparative.", fr: "Peor est déjà un comparatif." } }),
  ex("g-comparatives", 6, { type: "correct", es: "Este método es más mejor que el anterior.", answers: ["Este método es mejor que el anterior."], explanation: { en: "Never *más mejor.", fr: "Jamais *más mejor." } }),
  ex("g-comparatives", 7, { type: "translate", prompt: { en: "Valencia is not as big as Madrid.", fr: "Valence n'est pas aussi grande que Madrid." }, answers: ["Valencia no es tan grande como Madrid."], explanation: { en: "Tan + adjective + como.", fr: "Tan + adjectif + como." } }),

  // g-superlatives
  ex("g-superlatives", 1, { type: "fill", es: "Es la ciudad ___ grande ___ país.", blanks: [["más"], ["del"]], explanation: { en: "La más + adjective + de (de + el = del).", fr: "La más + adjectif + de (de + el = del)." } }),
  ex("g-superlatives", 2, { type: "fill", es: "Este ejercicio es ___ (fácil + -ísimo).", blanks: [["facilísimo"]], explanation: { en: "Fácil → facilísimo.", fr: "Fácil → facilísimo." } }),
  ex("g-superlatives", 3, { type: "fill", es: "El camino es ___ (largo + -ísimo).", blanks: [["larguísimo"]], explanation: { en: "Largo → larguísimo: the u keeps the hard g sound.", fr: "Largo → larguísimo : le u garde le son dur du g." } }),
  ex("g-superlatives", 4, { type: "fill", es: "Este pastel está ___ (rico + -ísimo).", blanks: [["riquísimo"]], explanation: { en: "Rico → riquísimo: c becomes qu before i.", fr: "Rico → riquísimo : c devient qu devant i." } }),
  ex("g-superlatives", 5, { type: "correct", es: "Es el alumno más listo en la clase.", answers: ["Es el alumno más listo de la clase."], explanation: { en: "Superlative + de.", fr: "Superlatif + de." } }),
  ex("g-superlatives", 6, { type: "translate", prompt: { en: "The most important thing is to arrive on time.", fr: "Le plus important, c'est d'arriver à l'heure." }, answers: ["Lo más importante es llegar a tiempo.", "Lo más importante es llegar puntual.", "Lo más importante es llegar a la hora."], explanation: { en: "Lo más + adjective.", fr: "Lo más + adjectif." } }),
  ex("g-superlatives", 7, { type: "choose", es: "Es ___ película del año.", options: ["la mejor", "la más mejor"], answers: ["la mejor"], explanation: { en: "Mejor takes only the article: la mejor.", fr: "Mejor ne prend que l'article : la mejor." } }),

  // g-adjective-position
  ex("g-adjective-position", 1, { type: "fill", es: "Hoy hace ___ (bueno) tiempo.", blanks: [["buen"]], explanation: { en: "Bueno → buen before a masculine singular noun.", fr: "Bueno → buen devant un nom masculin singulier." } }),
  ex("g-adjective-position", 2, { type: "fill", es: "Es la ___ (primero) vez que vengo.", blanks: [["primera"]], explanation: { en: "Feminine: primera (only the masculine shortens to primer).", fr: "Féminin : primera (seul le masculin devient primer)." } }),
  ex("g-adjective-position", 3, { type: "fill", es: "Vivimos en el ___ (tercero) piso.", blanks: [["tercer"]], explanation: { en: "Tercero → tercer before a masculine singular noun.", fr: "Tercero → tercer devant un nom masculin singulier." } }),
  ex("g-adjective-position", 4, { type: "fill", es: "Ha sido una ___ (grande) idea.", blanks: [["gran"]], explanation: { en: "Grande → gran before any singular noun; here it means 'great'.", fr: "Grande → gran devant tout nom singulier ; ici, il signifie « excellent »." } }),
  ex("g-adjective-position", 5, { type: "choose", es: "Velázquez es un ___ de la historia del arte.", options: ["gran pintor", "pintor grande"], answers: ["gran pintor"], explanation: { en: "Before the noun, gran means 'great'; after it, grande means 'big'.", fr: "Devant le nom, gran signifie « grand, remarquable » ; après, grande signifie « de grande taille »." } }),
  ex("g-adjective-position", 6, { type: "correct", es: "Es un buen persona.", answers: ["Es una buena persona."], explanation: { en: "Persona is feminine: una buena persona.", fr: "Persona est féminin : una buena persona." } }),
  ex("g-adjective-position", 7, { type: "translate", prompt: { en: "Carlos is an old friend from university.", fr: "Carlos est un vieil ami de l'université." }, answers: ["Carlos es un viejo amigo de la universidad."], explanation: { en: "Viejo before the noun = long-standing.", fr: "Viejo devant le nom = de longue date." } }),
];
