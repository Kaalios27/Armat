import type { BilingualLesson, GrammarExerciseSeed } from "./types";

export const LESSONS_1: Record<string, BilingualLesson> = {
  "g-articles": {
    summary: {
      en: "Every Spanish noun is masculine or feminine, and articles agree in gender and number. Endings give strong clues, but gender must be learned with each noun.",
      fr: "Chaque nom espagnol est masculin ou féminin, et l'article s'accorde en genre et en nombre. La terminaison donne de bons indices, mais le genre s'apprend avec le nom.",
    },
    rules: [
      { en: "Definite: el, la, los, las. Indefinite: un, una, unos, unas.", fr: "Défini : el, la, los, las. Indéfini : un, una, unos, unas." },
      { en: "Usually masculine: -o, -or, -aje, and Greek -ma (el problema, el sistema, el tema). Usually feminine: -a, -ción, -sión, -dad, -tad, -tud, -umbre.", fr: "Généralement masculins : -o, -or, -aje et les mots grecs en -ma (el problema, el sistema, el tema). Généralement féminins : -a, -ción, -sión, -dad, -tad, -tud, -umbre." },
      { en: "Feminine nouns starting with a stressed a- take el/un in the singular: el agua fría, un aula grande, but las aguas.", fr: "Les noms féminins commençant par un a- tonique prennent el/un au singulier : el agua fría, un aula grande, mais las aguas." },
      { en: "a + el = al, de + el = del (voy al centro, vengo del trabajo). No contraction with the pronoun él or with El in proper names.", fr: "a + el = al, de + el = del (voy al centro, vengo del trabajo). Pas de contraction avec le pronom él ni avec El dans un nom propre." },
    ],
    examples: [
      { es: "El problema es el sistema, no la solución.", en: "The problem is the system, not the solution.", fr: "Le problème, c'est le système, pas la solution." },
      { es: "Voy al laboratorio después de la clase.", en: "I'm going to the lab after class.", fr: "Je vais au laboratoire après le cours." },
      { es: "El agua del grifo está muy fría.", en: "The tap water is very cold.", fr: "L'eau du robinet est très froide." },
    ],
    exceptions: [
      { en: "el día, el mapa, el planeta are masculine; la mano, la foto, la moto, la radio are feminine.", fr: "el día, el mapa, el planeta sont masculins ; la mano, la foto, la moto, la radio sont féminins." },
    ],
    pitfalls: [
      { en: "Spanish uses the definite article with general statements and abstract nouns: La tecnología cambia rápido (Technology changes fast).", fr: "Attention aux genres différents du français : el problema, el método, el equipo, el color, el origen, la leche, la sal, la nariz, el árbol." },
      { en: "Don't use an article with professions after ser: Es ingeniera (She is an engineer).", fr: "Pas d'article indéfini avec la profession après ser : Es ingeniera (Elle est ingénieure)." },
    ],
  },
  "g-agreement": {
    summary: {
      en: "Adjectives and determiners agree with the noun in gender and number. Plurals add -s after a vowel and -es after a consonant.",
      fr: "Adjectifs et déterminants s'accordent avec le nom en genre et en nombre. Le pluriel ajoute -s après une voyelle et -es après une consonne.",
    },
    rules: [
      { en: "casa → casas, profesor → profesores, ciudad → ciudades; -z → -ces: luz → luces, vez → veces.", fr: "casa → casas, profesor → profesores, ciudad → ciudades ; -z → -ces : luz → luces, vez → veces." },
      { en: "Adjectives in -o have four forms (rojo, roja, rojos, rojas); adjectives in -e or a consonant have two (grande/grandes, útil/útiles).", fr: "Les adjectifs en -o ont quatre formes (rojo, roja, rojos, rojas) ; ceux en -e ou en consonne en ont deux (grande/grandes, útil/útiles)." },
      { en: "Nationality adjectives in a consonant add -a: español → española, francés → francesa, alemán → alemana.", fr: "Les adjectifs de nationalité en consonne ajoutent -a : español → española, francés → francesa, alemán → alemana." },
      { en: "A mixed group takes the masculine plural: los alumnos (male and female students).", fr: "Un groupe mixte prend le masculin pluriel : los alumnos (élèves des deux sexes)." },
    ],
    examples: [
      { es: "Las preguntas difíciles son las más interesantes.", en: "Difficult questions are the most interesting.", fr: "Les questions difficiles sont les plus intéressantes." },
      { es: "Tengo dos compañeras alemanas y un compañero francés.", en: "I have two German colleagues (f.) and a French colleague (m.).", fr: "J'ai deux collègues allemandes et un collègue français." },
    ],
    exceptions: [
      { en: "Written accents can appear or disappear in the plural: joven → jóvenes, examen → exámenes, canción → canciones, inglés → ingleses.", fr: "L'accent écrit peut apparaître ou disparaître au pluriel : joven → jóvenes, examen → exámenes, canción → canciones, inglés → ingleses." },
    ],
    pitfalls: [
      { en: "Agreement is with the noun, not the speaker: la gente es amable (gente is singular and feminine).", fr: "Gente est singulier : la gente es amable (les gens sont aimables)." },
    ],
  },
  "g-ser-estar-1": {
    summary: {
      en: "Both verbs translate 'to be'. Ser classifies and identifies; estar locates and describes a state or a result.",
      fr: "Les deux verbes traduisent « être ». Ser classe et identifie ; estar situe et décrit un état ou un résultat.",
    },
    rules: [
      { en: "Ser: identity, profession, origin, nationality, material, possession, time and dates, intrinsic characteristics (Es ingeniera. Es de Lyon. Son las tres.).", fr: "Ser : identité, profession, origine, nationalité, matière, possession, heure et date, caractéristiques essentielles (Es ingeniera. Es de Lyon. Son las tres.)." },
      { en: "Estar: location of people and things, temporary states, moods, results of a change (Está en Madrid. Estoy cansado. La tienda está cerrada.).", fr: "Estar : localisation des personnes et des objets, états passagers, humeur, résultat d'un changement (Está en Madrid. Estoy cansado. La tienda está cerrada.)." },
      { en: "Events (meetings, concerts, parties) are located with ser: La reunión es en la sala 3.", fr: "On situe un événement (réunion, concert, fête) avec ser : La reunión es en la sala 3." },
    ],
    examples: [
      { es: "Mi hermana es médica y ahora está en Valencia.", en: "My sister is a doctor and she's in Valencia now.", fr: "Ma sœur est médecin et elle est à Valence en ce moment." },
      { es: "El examen es mañana; estamos un poco nerviosos.", en: "The exam is tomorrow; we're a bit nervous.", fr: "L'examen est demain ; nous sommes un peu nerveux." },
      { es: "La mesa es de madera y está en la cocina.", en: "The table is made of wood and it's in the kitchen.", fr: "La table est en bois et elle est dans la cuisine." },
    ],
    exceptions: [
      { en: "Death and marital status: está muerto, está casado (also es casado in some contexts).", fr: "Mort et état civil : está muerto, está casado (es casado est possible dans certains contextes)." },
    ],
    pitfalls: [
      { en: "'Permanent vs temporary' is a simplification: location is always estar, even if permanent (Madrid está en el centro de España).", fr: "« Permanent / temporaire » est une simplification : la localisation se dit toujours avec estar, même permanente (Madrid está en el centro de España)." },
    ],
  },
  "g-hay-estar": {
    summary: {
      en: "Hay states that something exists; estar locates something already identified.",
      fr: "Hay indique qu'une chose existe ; estar situe une chose déjà identifiée.",
    },
    rules: [
      { en: "Hay + no article, un/una, numbers, mucho, algún: Hay un problema. Hay tres salas. No hay leche.", fr: "Hay + absence d'article, un/una, nombres, mucho, algún : Hay un problema. Hay tres salas. No hay leche." },
      { en: "Estar + el/la, possessives, names, demonstratives: El problema está en el código. Mis llaves están aquí.", fr: "Estar + el/la, possessifs, noms propres, démonstratifs : El problema está en el código. Mis llaves están aquí." },
      { en: "Hay never changes for plural: hay un libro, hay diez libros.", fr: "Hay est invariable : hay un libro, hay diez libros." },
    ],
    examples: [
      { es: "¿Hay una farmacia por aquí? Sí, la farmacia está en la esquina.", en: "Is there a pharmacy around here? Yes, the pharmacy is on the corner.", fr: "Il y a une pharmacie par ici ? Oui, la pharmacie est au coin de la rue." },
      { es: "En el informe hay varios errores.", en: "There are several mistakes in the report.", fr: "Il y a plusieurs erreurs dans le rapport." },
    ],
    exceptions: [
      { en: "Other tenses use the third-person singular of haber: había, hubo, habrá, ha habido (never *habían problemas in standard usage).", fr: "Aux autres temps, haber reste à la 3e personne du singulier : había, hubo, habrá, ha habido (jamais *habían problemas dans la norme)." },
    ],
    pitfalls: [
      { en: "Do not say *hay el libro; with a definite noun use estar: el libro está en la mesa.", fr: "Ne dites pas *hay el libro ; avec un nom défini, employez estar : el libro está en la mesa." },
    ],
  },
  "g-questions": {
    summary: {
      en: "Spanish marks questions at both ends (¿...?). Question words carry a written accent, also in indirect questions.",
      fr: "L'espagnol marque la question aux deux extrémités (¿...?). Les mots interrogatifs portent un accent écrit, y compris dans l'interrogation indirecte.",
    },
    rules: [
      { en: "qué, quién/quiénes, cuál/cuáles, dónde, adónde, cuándo, cómo, cuánto/a/os/as, por qué.", fr: "qué, quién/quiénes, cuál/cuáles, dónde, adónde, cuándo, cómo, cuánto/a/os/as, por qué." },
      { en: "A preposition goes before the question word: ¿De dónde eres? ¿Con quién hablas? ¿Para qué sirve?", fr: "La préposition se place devant l'interrogatif : ¿De dónde eres? ¿Con quién hablas? ¿Para qué sirve?" },
      { en: "Qué + noun or to ask for a definition (¿Qué es un algoritmo?); cuál to choose among options or with ser + noun (¿Cuál es tu correo?).", fr: "Qué + nom ou pour une définition (¿Qué es un algoritmo?) ; cuál pour choisir parmi des options ou avec ser + nom (¿Cuál es tu correo?)." },
      { en: "Yes/no questions often keep the statement word order; intonation and ¿? mark the question: ¿Tienes tiempo?", fr: "Les questions fermées gardent souvent l'ordre de la phrase affirmative : ¿Tienes tiempo?" },
    ],
    examples: [
      { es: "¿Cuál es la diferencia entre los dos métodos?", en: "What is the difference between the two methods?", fr: "Quelle est la différence entre les deux méthodes ?" },
      { es: "No sé dónde está ni cuándo vuelve.", en: "I don't know where she is or when she's coming back.", fr: "Je ne sais pas où elle est ni quand elle revient." },
    ],
    exceptions: [
      { en: "Porque (because) is one word without accent; por qué (why) is two words with accent; el porqué (the reason) is a noun.", fr: "Porque (parce que) s'écrit en un mot sans accent ; por qué (pourquoi) en deux mots avec accent ; el porqué (la raison) est un nom." },
    ],
    pitfalls: [
      { en: "'What is your name/number?' uses cuál: ¿Cuál es tu número? (not *qué es).", fr: "« Quel est ton numéro ? » se dit ¿Cuál es tu número? (et non *qué es)." },
    ],
  },
  "g-negation": {
    summary: {
      en: "No goes directly before the verb (and before object pronouns). Spanish requires double negation when a negative word follows the verb.",
      fr: "No se place juste devant le verbe (et devant les pronoms compléments). L'espagnol impose la double négation quand un mot négatif suit le verbe.",
    },
    rules: [
      { en: "No lo sé. No me gusta. Never between pronoun and verb.", fr: "No lo sé. No me gusta. Jamais entre le pronom et le verbe." },
      { en: "nada, nadie, nunca, ninguno/a, tampoco, ni... ni: No veo nada. No viene nadie. No he estado nunca en Cádiz.", fr: "nada, nadie, nunca, ninguno/a, tampoco, ni... ni : No veo nada. No viene nadie. No he estado nunca en Cádiz." },
      { en: "If the negative word comes first, drop no: Nadie viene. Nunca he estado en Cádiz. Yo tampoco.", fr: "Si le mot négatif est en tête, no disparaît : Nadie viene. Nunca he estado en Cádiz. Yo tampoco." },
      { en: "Ninguno becomes ningún before a masculine singular noun: No tengo ningún problema.", fr: "Ninguno devient ningún devant un nom masculin singulier : No tengo ningún problema." },
    ],
    examples: [
      { es: "No conozco a nadie aquí y tampoco hablo el idioma.", en: "I don't know anyone here and I don't speak the language either.", fr: "Je ne connais personne ici et je ne parle pas non plus la langue." },
      { es: "Nunca dice nada en las reuniones.", en: "She never says anything in meetings.", fr: "Elle ne dit jamais rien en réunion." },
    ],
    exceptions: [],
    pitfalls: [
      { en: "Use nada, nadie after a negated verb, not algo/alguien: No veo nada (not *no veo algo).", fr: "Pas de « pas » à traduire : no remplace ne... pas. Ne dites pas *no veo no nada." },
    ],
  },
  "g-subject-pronouns": {
    summary: {
      en: "The verb ending shows the subject, so pronouns are normally omitted. In Spain there are four forms of 'you': tú, vosotros (informal) and usted, ustedes (formal).",
      fr: "La désinence indique le sujet : le pronom est normalement omis. En Espagne, il existe quatre formes pour « tu/vous » : tú, vosotros (familier) et usted, ustedes (formel).",
    },
    rules: [
      { en: "yo, tú, él/ella/usted, nosotros/as, vosotros/as, ellos/ellas/ustedes.", fr: "yo, tú, él/ella/usted, nosotros/as, vosotros/as, ellos/ellas/ustedes." },
      { en: "Usted and ustedes take third-person verbs: ¿Usted trabaja aquí? ¿Ustedes vienen?", fr: "Usted et ustedes prennent la 3e personne : ¿Usted trabaja aquí? ¿Ustedes vienen?" },
      { en: "Use the pronoun to contrast or emphasise (Yo trabajo y tú descansas) or to avoid ambiguity (él/ella/usted).", fr: "On emploie le pronom pour contraster ou insister (Yo trabajo y tú descansas) ou pour lever une ambiguïté (él/ella/usted)." },
      { en: "Tú is the default among peers, colleagues and at university in Spain; usted for formal distance and older strangers.", fr: "En Espagne, tú est la norme entre pairs, collègues et à l'université ; usted marque la distance formelle." },
    ],
    examples: [
      { es: "¿Vosotros venís a la cena? Nosotras sí.", en: "Are you (pl.) coming to dinner? We (f.) are.", fr: "Vous venez au dîner ? Nous, oui." },
      { es: "Perdone, ¿usted sabe dónde está la secretaría?", en: "Excuse me, do you know where the office is?", fr: "Excusez-moi, vous savez où est le secrétariat ?" },
    ],
    exceptions: [
      { en: "'It' as a subject is never translated: Es importante. Llueve.", fr: "« Il » impersonnel ne se traduit pas : Es importante. Llueve." },
    ],
    pitfalls: [
      { en: "Repeating yo in every sentence sounds insistent or foreign.", fr: "Répéter yo à chaque phrase paraît insistant ou étranger." },
    ],
  },
  "g-gustar": {
    summary: {
      en: "With gustar the thing liked is the grammatical subject and the person is an indirect object: me gusta el café = coffee pleases me.",
      fr: "Avec gustar, la chose aimée est le sujet et la personne est complément indirect : me gusta el café = le café me plaît.",
    },
    rules: [
      { en: "me, te, le, nos, os, les + gusta (singular noun or infinitive) / gustan (plural noun).", fr: "me, te, le, nos, os, les + gusta (nom singulier ou infinitif) / gustan (nom pluriel)." },
      { en: "A mí, a ti, a él, a María... adds emphasis or clarifies le/les: A Ana le gustan los idiomas.", fr: "A mí, a ti, a él, a María... insiste ou précise le/les : A Ana le gustan los idiomas." },
      { en: "Same pattern: encantar, interesar, importar, molestar, preocupar, apetecer, doler, quedar (bien), faltar, parecer.", fr: "Même construction : encantar, interesar, importar, molestar, preocupar, apetecer, doler, quedar (bien), faltar, parecer." },
    ],
    examples: [
      { es: "Nos interesan mucho los proyectos de energía.", en: "We're very interested in energy projects.", fr: "Les projets énergétiques nous intéressent beaucoup." },
      { es: "¿Te apetece un café? A mí me duele la cabeza.", en: "Do you fancy a coffee? I have a headache.", fr: "Tu as envie d'un café ? Moi, j'ai mal à la tête." },
    ],
    exceptions: [
      { en: "With several infinitives the verb stays singular: Me gusta leer y correr.", fr: "Avec plusieurs infinitifs, le verbe reste au singulier : Me gusta leer y correr." },
    ],
    pitfalls: [
      { en: "Not *yo gusto el café; the verb agrees with what is liked: me gustan las películas.", fr: "Pas de *yo gusto el café ; le verbe s'accorde avec la chose aimée : me gustan las películas." },
    ],
  },
  "g-muy-mucho": {
    summary: {
      en: "Muy intensifies adjectives and adverbs; mucho modifies verbs and nouns (and agrees with nouns).",
      fr: "Muy renforce un adjectif ou un adverbe ; mucho modifie un verbe ou un nom (et s'accorde avec le nom).",
    },
    rules: [
      { en: "muy + adjective/adverb: muy interesante, muy bien, muy tarde.", fr: "muy + adjectif/adverbe : muy interesante, muy bien, muy tarde." },
      { en: "verb + mucho (invariable): trabaja mucho. mucho/a/os/as + noun: mucha gente, muchos problemas.", fr: "verbe + mucho (invariable) : trabaja mucho. mucho/a/os/as + nom : mucha gente, muchos problemas." },
      { en: "Mucho alone with mejor, peor, más, menos, mayor, menor: mucho mejor, mucho más rápido.", fr: "Mucho seul avec mejor, peor, más, menos, mayor, menor : mucho mejor, mucho más rápido." },
      { en: "Tan + adjective/adverb; tanto/a/os/as + noun; verb + tanto: Es tan fácil. Hay tanto ruido. No trabajes tanto.", fr: "Tan + adjectif/adverbe ; tanto/a/os/as + nom ; verbe + tanto : Es tan fácil. Hay tanto ruido. No trabajes tanto." },
    ],
    examples: [
      { es: "Es un proyecto muy ambicioso y tenemos mucho trabajo.", en: "It's a very ambitious project and we have a lot of work.", fr: "C'est un projet très ambitieux et nous avons beaucoup de travail." },
      { es: "Este método es mucho mejor, pero cuesta mucho.", en: "This method is much better, but it costs a lot.", fr: "Cette méthode est bien meilleure, mais elle coûte cher." },
    ],
    exceptions: [
      { en: "Answering alone: ¿Estás cansado? Mucho. (muy cannot stand alone).", fr: "En réponse seule : ¿Estás cansado? Mucho. (muy ne peut pas s'employer seul)." },
    ],
    pitfalls: [
      { en: "Not *muy mucho, not *mucho interesante.", fr: "Pas de *muy mucho ni de *mucho interesante (contrairement à « très beaucoup »)." },
    ],
  },
  "g-possessives": {
    summary: {
      en: "Short possessives go before the noun; long possessives follow the noun or replace it with an article.",
      fr: "Les possessifs courts précèdent le nom ; les formes longues le suivent ou le remplacent avec l'article.",
    },
    rules: [
      { en: "mi(s), tu(s), su(s), nuestro/a/os/as, vuestro/a/os/as, su(s). They agree with the thing possessed.", fr: "mi(s), tu(s), su(s), nuestro/a/os/as, vuestro/a/os/as, su(s). Ils s'accordent avec la chose possédée." },
      { en: "Long forms: mío, tuyo, suyo, nuestro, vuestro, suyo (+ -a, -os, -as): un amigo mío, es mía, el tuyo.", fr: "Formes longues : mío, tuyo, suyo, nuestro, vuestro, suyo (+ -a, -os, -as) : un amigo mío, es mía, el tuyo." },
      { en: "Su can mean his, her, its, your (usted), their: clarify with de él, de ella, de usted when needed.", fr: "Su peut signifier son, sa, leur, votre (usted) : précisez avec de él, de ella, de usted si nécessaire." },
    ],
    examples: [
      { es: "Nuestra oficina es pequeña; la vuestra es más luminosa.", en: "Our office is small; yours is brighter.", fr: "Notre bureau est petit ; le vôtre est plus lumineux." },
      { es: "Es un colega mío del máster.", en: "He's a colleague of mine from the master's.", fr: "C'est un collègue de mon master." },
    ],
    exceptions: [
      { en: "Body parts and clothing usually take the article: Me duele la cabeza. Se puso el abrigo.", fr: "Parties du corps et vêtements : article défini. Me duele la cabeza. Se puso el abrigo." },
    ],
    pitfalls: [
      { en: "Tu (your) has no accent; tú (you) does.", fr: "Tu (ton) sans accent ; tú (toi) avec accent." },
    ],
  },
  "g-demonstratives": {
    summary: {
      en: "Spanish distinguishes three distances: este (near me), ese (near you or recently mentioned), aquel (far from both, or distant in time).",
      fr: "L'espagnol distingue trois distances : este (près de moi), ese (près de toi ou déjà mentionné), aquel (loin des deux, ou éloigné dans le temps).",
    },
    rules: [
      { en: "este/esta/estos/estas; ese/esa/esos/esas; aquel/aquella/aquellos/aquellas.", fr: "este/esta/estos/estas ; ese/esa/esos/esas ; aquel/aquella/aquellos/aquellas." },
      { en: "Neuter esto, eso, aquello for unidentified things or ideas: ¿Qué es esto? Eso es verdad.", fr: "Neutres esto, eso, aquello pour une chose non identifiée ou une idée : ¿Qué es esto? Eso es verdad." },
      { en: "Pronoun uses need no accent (RAE 2010): Prefiero este. Me gusta esa.", fr: "Les pronoms ne prennent plus d'accent (RAE 2010) : Prefiero este. Me gusta esa." },
    ],
    examples: [
      { es: "Esta semana no puedo; ¿te va bien la que viene?", en: "I can't this week; does next week suit you?", fr: "Cette semaine, je ne peux pas ; la semaine prochaine te convient ?" },
      { es: "En aquella época vivíamos en Zaragoza.", en: "Back then we lived in Zaragoza.", fr: "À cette époque-là, nous vivions à Saragosse." },
    ],
    exceptions: [],
    pitfalls: [
      { en: "Eso refers back to what was just said: Eso es exactamente el problema.", fr: "Eso reprend ce qui vient d'être dit (≈ « ça ») : Eso es exactamente el problema." },
    ],
  },
  "g-personal-a": {
    summary: {
      en: "When the direct object is a specific person (or a pet treated as one), Spanish puts a before it.",
      fr: "Lorsque le complément d'objet direct est une personne déterminée (ou un animal familier), l'espagnol le fait précéder de a.",
    },
    rules: [
      { en: "Veo a María. Conozco a tu jefe. Busco al responsable.", fr: "Veo a María. Conozco a tu jefe. Busco al responsable." },
      { en: "With alguien, nadie, quién: ¿A quién llamas? No conozco a nadie.", fr: "Avec alguien, nadie, quién : ¿A quién llamas? No conozco a nadie." },
      { en: "No personal a with things, with unspecified people, or after tener: Busco un piso. Necesitamos un ingeniero. Tengo dos hermanos.", fr: "Pas de a avec les choses, les personnes indéterminées, ni après tener : Busco un piso. Necesitamos un ingeniero. Tengo dos hermanos." },
    ],
    examples: [
      { es: "Esperamos a los clientes en la entrada.", en: "We're waiting for the clients at the entrance.", fr: "Nous attendons les clients à l'entrée." },
      { es: "Buscamos una persona que hable alemán.", en: "We're looking for someone who speaks German.", fr: "Nous cherchons une personne qui parle allemand." },
    ],
    exceptions: [],
    pitfalls: [
      { en: "Esperar a alguien = to wait for someone: the a is not 'for' but the personal a.", fr: "Esperar a alguien = attendre quelqu'un : ce a n'a pas d'équivalent en français." },
    ],
  },
  "g-direct-object": {
    summary: {
      en: "Direct object pronouns replace the noun that receives the action: lo, la, los, las (and me, te, nos, os).",
      fr: "Les pronoms COD remplacent le nom qui subit l'action : lo, la, los, las (et me, te, nos, os).",
    },
    rules: [
      { en: "They agree with the replaced noun: ¿El informe? Lo tengo. ¿Las llaves? Las tengo.", fr: "Ils s'accordent avec le nom remplacé : ¿El informe? Lo tengo. ¿Las llaves? Las tengo." },
      { en: "Place: before the conjugated verb (lo veo), attached to infinitives and gerunds (verlo, viéndolo).", fr: "Place : devant le verbe conjugué (lo veo), attaché à l'infinitif et au gérondif (verlo, viéndolo)." },
      { en: "Neuter lo replaces an idea or sentence: ¿Sabes que se va? Sí, lo sé.", fr: "Lo neutre reprend une idée ou une phrase : ¿Sabes que se va? Sí, lo sé." },
      { en: "In Spain le is accepted for a masculine person: ¿A Pedro? Le veo mañana (also lo veo).", fr: "En Espagne, le est admis pour une personne masculine : ¿A Pedro? Le veo mañana (lo veo aussi)." },
    ],
    examples: [
      { es: "¿Has leído el artículo? Sí, lo leí ayer.", en: "Have you read the article? Yes, I read it yesterday.", fr: "Tu as lu l'article ? Oui, je l'ai lu hier." },
      { es: "Te llamo esta tarde.", en: "I'll call you this afternoon.", fr: "Je t'appelle cet après-midi." },
    ],
    exceptions: [
      { en: "When the object comes before the verb, it is repeated with a pronoun: El informe lo termino mañana.", fr: "Un COD placé avant le verbe est repris par un pronom : El informe lo termino mañana." },
    ],
    pitfalls: [
      { en: "Leísmo with feminine or plural persons (*le vi a ella) is not standard; use la.", fr: "Le leísmo n'est pas admis au féminin : la vi (a ella), et non *le vi." },
    ],
  },
  "g-indirect-object": {
    summary: {
      en: "Indirect object pronouns mark the person who receives or benefits: me, te, le, nos, os, les.",
      fr: "Les pronoms COI désignent la personne qui reçoit ou qui est concernée : me, te, le, nos, os, les.",
    },
    rules: [
      { en: "Le and les do not mark gender: Le doy el informe (to him/her/you formal).", fr: "Le et les ne marquent pas le genre : Le doy el informe (à lui/elle/vous)." },
      { en: "The pronoun is normally kept even when the person is named: Le escribo a la directora. Les explico el plan a los alumnos.", fr: "Le pronom est normalement maintenu même quand la personne est nommée : Le escribo a la directora. Les explico el plan a los alumnos." },
      { en: "Common verbs: dar, decir, enviar, explicar, preguntar, pedir, contar, mostrar, regalar, escribir, prestar.", fr: "Verbes courants : dar, decir, enviar, explicar, preguntar, pedir, contar, mostrar, regalar, escribir, prestar." },
    ],
    examples: [
      { es: "¿Le has dicho la verdad a tu jefe?", en: "Have you told your boss the truth?", fr: "Tu as dit la vérité à ton chef ?" },
      { es: "Nos envían los resultados mañana.", en: "They're sending us the results tomorrow.", fr: "Ils nous envoient les résultats demain." },
    ],
    exceptions: [],
    pitfalls: [
      { en: "English 'to ask him' = preguntarle; 'to tell them' = decirles. Spanish needs the pronoun where English uses a preposition.", fr: "Verbes à construction différente : preguntar a alguien = demander à quelqu'un (le pregunto), llamar a alguien = appeler quelqu'un (COD : lo llamo)." },
    ],
  },
};

const ex = (
  concept: string,
  n: number,
  data: Omit<GrammarExerciseSeed, "id" | "concept">,
): GrammarExerciseSeed => ({ id: `${concept}-${n}`, concept, ...data });

export const EXERCISES_1: GrammarExerciseSeed[] = [
  // g-articles
  ex("g-articles", 1, { type: "fill", es: "___ problema principal es ___ falta de tiempo.", blanks: [["El"], ["la"]], explanation: { en: "Problema is masculine (-ma from Greek); falta is feminine.", fr: "Problema est masculin (mot grec en -ma) ; falta est féminin." } }),
  ex("g-articles", 2, { type: "fill", es: "Voy ___ centro y luego vuelvo ___ trabajo.", blanks: [["al"], ["al"]], explanation: { en: "a + el = al. Ir al centro, volver al trabajo.", fr: "a + el = al. Ir al centro, volver al trabajo." } }),
  ex("g-articles", 3, { type: "choose", es: "___ agua de esta fuente es potable.", options: ["El", "La"], answers: ["El"], explanation: { en: "Agua is feminine but starts with a stressed a-, so it takes el in the singular (el agua potable).", fr: "Agua est féminin mais commence par un a- tonique : el au singulier (el agua potable)." } }),
  ex("g-articles", 4, { type: "correct", es: "La sistema de la universidad es muy complicada.", answers: ["El sistema de la universidad es muy complicado."], explanation: { en: "Sistema is masculine: el sistema ... complicado.", fr: "Sistema est masculin : el sistema ... complicado." } }),
  ex("g-articles", 5, { type: "translate", prompt: { en: "The solution depends on the method.", fr: "La solution dépend de la méthode." }, answers: ["La solución depende del método."], explanation: { en: "Solución is feminine (-ción); método is masculine, de + el = del.", fr: "Solución est féminin (-ción) ; método est masculin, de + el = del." } }),
  ex("g-articles", 6, { type: "fill", es: "Necesito ___ foto para ___ carné de la biblioteca.", blanks: [["una"], ["el"]], explanation: { en: "Foto (from fotografía) is feminine; carné is masculine.", fr: "Foto (de fotografía) est féminin ; carné est masculin." } }),
  ex("g-articles", 7, { type: "distinguish", es: "Viene ___ (de + el) aeropuerto. Habla de ___ (él).", blanks: [["del"], ["él"]], explanation: { en: "De + article el contracts to del; de + pronoun él does not contract.", fr: "De + article el se contracte en del ; de + pronom él ne se contracte pas." } }),
  ex("g-articles", 8, { type: "translate", prompt: { en: "She is an engineer and she works at the hospital.", fr: "Elle est ingénieure et elle travaille à l'hôpital." }, answers: ["Es ingeniera y trabaja en el hospital.", "Ella es ingeniera y trabaja en el hospital."], explanation: { en: "No article with a profession after ser; en el hospital for location.", fr: "Pas d'article devant la profession après ser ; en el hospital pour le lieu." } }),

  // g-agreement
  ex("g-agreement", 1, { type: "fill", es: "Las clases son muy ___ (interesante).", blanks: [["interesantes"]], explanation: { en: "Adjectives in -e add -s in the plural.", fr: "Les adjectifs en -e ajoutent -s au pluriel." } }),
  ex("g-agreement", 2, { type: "fill", es: "Tengo dos ___ (vez) más trabajo que el año pasado.", blanks: [["veces"]], explanation: { en: "-z becomes -ces in the plural: vez → veces.", fr: "-z devient -ces au pluriel : vez → veces." } }),
  ex("g-agreement", 3, { type: "fill", es: "Mi compañera es ___ (francés) y su marido es ___ (alemán).", blanks: [["francesa"], ["alemán"]], explanation: { en: "Nationality adjectives in a consonant add -a in the feminine and lose the accent: francesa.", fr: "Les adjectifs de nationalité en consonne ajoutent -a au féminin et perdent l'accent : francesa." } }),
  ex("g-agreement", 4, { type: "correct", es: "Los exámenes finales son muy difíciles y largos, pero la gente están contentos.", answers: ["Los exámenes finales son muy difíciles y largos, pero la gente está contenta."], explanation: { en: "Gente is a feminine singular noun: la gente está contenta.", fr: "Gente est un nom féminin singulier : la gente está contenta." } }),
  ex("g-agreement", 5, { type: "fill", es: "Hay muchos ___ (joven) en las ___ (ciudad) grandes.", blanks: [["jóvenes"], ["ciudades"]], explanation: { en: "Joven → jóvenes gains an accent to keep the stress; ciudad → ciudades.", fr: "Joven → jóvenes prend un accent pour garder l'accent tonique ; ciudad → ciudades." } }),
  ex("g-agreement", 6, { type: "translate", prompt: { en: "The new rules are useful.", fr: "Les nouvelles règles sont utiles." }, answers: ["Las nuevas normas son útiles.", "Las normas nuevas son útiles.", "Las nuevas reglas son útiles.", "Las reglas nuevas son útiles."], explanation: { en: "Útil has one form for both genders; plural útiles.", fr: "Útil a une seule forme pour les deux genres ; pluriel útiles." } }),
  ex("g-agreement", 7, { type: "choose", es: "Mis hermanos y mis primas están ___.", options: ["cansados", "cansadas"], answers: ["cansados"], explanation: { en: "A mixed group takes the masculine plural.", fr: "Un groupe mixte prend le masculin pluriel." } }),

  // g-ser-estar-1
  ex("g-ser-estar-1", 1, { type: "fill", es: "Mi hermana ___ médica y ahora ___ en Valencia.", blanks: [["es"], ["está"]], explanation: { en: "Profession → ser; location → estar.", fr: "Profession → ser ; localisation → estar." } }),
  ex("g-ser-estar-1", 2, { type: "fill", es: "La reunión ___ en la sala 3 y ya ___ todos allí.", blanks: [["es"], ["están"]], explanation: { en: "An event takes place → ser; people located → estar.", fr: "Un événement a lieu → ser ; des personnes situées → estar." } }),
  ex("g-ser-estar-1", 3, { type: "choose", es: "Madrid ___ en el centro de España.", options: ["es", "está"], answers: ["está"], explanation: { en: "Geographical location always takes estar, even though it is permanent.", fr: "La localisation géographique se dit avec estar, même si elle est permanente." } }),
  ex("g-ser-estar-1", 4, { type: "choose", es: "¿Qué hora ___? ___ las cuatro y media.", options: ["es / Son", "está / Están"], answers: ["es / Son"], explanation: { en: "Time is expressed with ser: ¿Qué hora es? Son las cuatro.", fr: "L'heure se dit avec ser : ¿Qué hora es? Son las cuatro." } }),
  ex("g-ser-estar-1", 5, { type: "correct", es: "Soy muy cansado porque el examen está mañana.", answers: ["Estoy muy cansado porque el examen es mañana.", "Estoy muy cansada porque el examen es mañana."], explanation: { en: "A temporary state → estar cansado; an event's date → ser.", fr: "État passager → estar cansado ; date d'un événement → ser." } }),
  ex("g-ser-estar-1", 6, { type: "translate", prompt: { en: "The table is made of wood and it's in the kitchen.", fr: "La table est en bois et elle est dans la cuisine." }, answers: ["La mesa es de madera y está en la cocina."], explanation: { en: "Material → ser de; location → estar.", fr: "Matière → ser de ; localisation → estar." } }),
  ex("g-ser-estar-1", 7, { type: "fill", es: "La tienda ___ cerrada los domingos, pero hoy ___ abierta.", blanks: [["está"], ["está"]], explanation: { en: "Cerrada / abierta describe the resulting state → estar.", fr: "Cerrada / abierta décrivent un état résultant → estar." } }),
  ex("g-ser-estar-1", 8, { type: "translate", prompt: { en: "Where are you from? I'm from Lyon, but I'm in Madrid for work.", fr: "Tu es d'où ? Je suis de Lyon, mais je suis à Madrid pour le travail." }, answers: ["¿De dónde eres? Soy de Lyon, pero estoy en Madrid por trabajo.", "¿De dónde eres? Soy de Lyon, pero estoy en Madrid por el trabajo."], explanation: { en: "Origin → ser de; current location → estar en.", fr: "Origine → ser de ; lieu actuel → estar en." } }),

  // g-hay-estar
  ex("g-hay-estar", 1, { type: "fill", es: "En mi barrio ___ dos supermercados, pero la farmacia ___ lejos.", blanks: [["hay"], ["está"]], explanation: { en: "Number + noun → hay; a definite noun located → estar.", fr: "Nombre + nom → hay ; nom défini à situer → estar." } }),
  ex("g-hay-estar", 2, { type: "choose", es: "¿Dónde ___ las llaves?", options: ["hay", "están"], answers: ["están"], explanation: { en: "Las llaves is definite: use estar to locate it.", fr: "Las llaves est défini : on le situe avec estar." } }),
  ex("g-hay-estar", 3, { type: "correct", es: "Hay el problema en la segunda página.", answers: ["El problema está en la segunda página.", "Hay un problema en la segunda página."], explanation: { en: "Hay is not used with el; either locate the known problem (está) or state existence (hay un problema).", fr: "Hay ne s'emploie pas avec el : soit on situe le problème connu (está), soit on affirme son existence (hay un problema)." } }),
  ex("g-hay-estar", 4, { type: "fill", es: "No ___ leche en la nevera.", blanks: [["hay"]], explanation: { en: "Unspecified quantity, no article → hay.", fr: "Quantité indéterminée, sans article → hay." } }),
  ex("g-hay-estar", 5, { type: "translate", prompt: { en: "There are several mistakes in the report.", fr: "Il y a plusieurs erreurs dans le rapport." }, answers: ["Hay varios errores en el informe.", "En el informe hay varios errores."], explanation: { en: "Hay is invariable, even with a plural noun.", fr: "Hay est invariable, même avec un nom pluriel." } }),
  ex("g-hay-estar", 6, { type: "correct", es: "En la reunión habían muchas personas.", answers: ["En la reunión había muchas personas.", "En la reunión había mucha gente."], explanation: { en: "Existential haber stays singular in every tense: había.", fr: "Le haber existentiel reste au singulier à tous les temps : había." } }),

  // g-questions
  ex("g-questions", 1, { type: "fill", es: "¿___ es tu número de teléfono?", blanks: [["Cuál"]], explanation: { en: "Ser + noun asking for a specific item → cuál.", fr: "Ser + nom pour un élément précis → cuál." } }),
  ex("g-questions", 2, { type: "fill", es: "¿De ___ sois? ¿___ lleváis en Madrid?", blanks: [["dónde"], ["Cuánto tiempo", "Cuánto"]], explanation: { en: "Prepositions go before question words: ¿de dónde?; ¿cuánto tiempo?", fr: "La préposition précède l'interrogatif : ¿de dónde? ; ¿cuánto tiempo?" } }),
  ex("g-questions", 3, { type: "choose", es: "¿___ es un algoritmo?", options: ["Qué", "Cuál"], answers: ["Qué"], explanation: { en: "Asking for a definition → qué.", fr: "Demande de définition → qué." } }),
  ex("g-questions", 4, { type: "correct", es: "No sé donde vive ni cuando vuelve.", answers: ["No sé dónde vive ni cuándo vuelve."], explanation: { en: "Question words keep their accent in indirect questions.", fr: "Les interrogatifs gardent leur accent dans l'interrogation indirecte." } }),
  ex("g-questions", 5, { type: "reconstruct", tokens: ["¿Con", "quién", "has", "hablado", "esta", "mañana?"], answers: ["¿Con quién has hablado esta mañana?"], explanation: { en: "Preposition + question word at the start.", fr: "Préposition + interrogatif en tête de phrase." } }),
  ex("g-questions", 6, { type: "translate", prompt: { en: "Why aren't you coming? Because I have a lot of work.", fr: "Pourquoi tu ne viens pas ? Parce que j'ai beaucoup de travail." }, answers: ["¿Por qué no vienes? Porque tengo mucho trabajo."], explanation: { en: "Por qué (why) in two words with accent; porque (because) in one word.", fr: "Por qué (pourquoi) en deux mots avec accent ; porque (parce que) en un mot." } }),
  ex("g-questions", 7, { type: "fill", es: "¿___ de los dos métodos prefieres?", blanks: [["Cuál"]], explanation: { en: "Choosing among options → cuál.", fr: "Choix entre plusieurs options → cuál." } }),

  // g-negation
  ex("g-negation", 1, { type: "fill", es: "No hay ___ en la oficina; todos se han ido.", blanks: [["nadie"]], explanation: { en: "Double negation: no ... nadie.", fr: "Double négation : no ... nadie." } }),
  ex("g-negation", 2, { type: "correct", es: "No he visto nunca algo así.", answers: ["No he visto nunca nada así.", "Nunca he visto nada así."], explanation: { en: "After a negated verb use nada, not algo.", fr: "Après un verbe nié, on emploie nada et non algo." } }),
  ex("g-negation", 3, { type: "reconstruct", tokens: ["Nunca", "dice", "nada", "en", "las", "reuniones."], answers: ["Nunca dice nada en las reuniones."], explanation: { en: "Negative word first → no 'no' before the verb.", fr: "Mot négatif en tête → pas de no devant le verbe." } }),
  ex("g-negation", 4, { type: "fill", es: "—No me gusta el café. —A mí ___.", blanks: [["tampoco"]], explanation: { en: "Agreeing with a negative statement → tampoco.", fr: "Pour approuver une phrase négative → tampoco." } }),
  ex("g-negation", 5, { type: "fill", es: "No tengo ___ problema con el horario.", blanks: [["ningún"]], explanation: { en: "Ninguno shortens to ningún before a masculine singular noun.", fr: "Ninguno devient ningún devant un nom masculin singulier." } }),
  ex("g-negation", 6, { type: "translate", prompt: { en: "Nobody knows anything.", fr: "Personne ne sait rien." }, answers: ["Nadie sabe nada.", "No sabe nada nadie."], explanation: { en: "Nadie first, then nada after the verb.", fr: "Nadie en tête, puis nada après le verbe." } }),

  // g-subject-pronouns
  ex("g-subject-pronouns", 1, { type: "choose", es: "(To two friends) ¿___ venís a la cena?", options: ["Vosotros", "Ustedes"], answers: ["Vosotros"], explanation: { en: "Informal plural in Spain → vosotros, with -áis/-éis/-ís endings.", fr: "Pluriel familier en Espagne → vosotros, avec les terminaisons -áis/-éis/-ís." } }),
  ex("g-subject-pronouns", 2, { type: "fill", es: "Perdone, ¿usted ___ (saber) dónde está la secretaría?", blanks: [["sabe"]], explanation: { en: "Usted takes the third-person singular.", fr: "Usted se conjugue à la 3e personne du singulier." } }),
  ex("g-subject-pronouns", 3, { type: "correct", es: "Yo estudio ingeniería. Yo vivo en Madrid. Yo tengo veinte años.", answers: ["Estudio ingeniería. Vivo en Madrid. Tengo veinte años.", "Yo estudio ingeniería. Vivo en Madrid. Tengo veinte años."], explanation: { en: "Repeating yo is unnatural; the ending already shows the person.", fr: "Répéter yo n'est pas naturel ; la désinence indique déjà la personne." } }),
  ex("g-subject-pronouns", 4, { type: "translate", prompt: { en: "I work and you rest.", fr: "Moi, je travaille et toi, tu te reposes." }, answers: ["Yo trabajo y tú descansas."], explanation: { en: "Contrast justifies the pronouns.", fr: "Le contraste justifie l'emploi des pronoms." } }),
  ex("g-subject-pronouns", 5, { type: "translate", prompt: { en: "It's important.", fr: "C'est important." }, answers: ["Es importante."], explanation: { en: "Impersonal 'it' has no Spanish equivalent.", fr: "Le « ce/il » impersonnel ne se traduit pas." } }),
  ex("g-subject-pronouns", 6, { type: "fill", es: "¿Ustedes ___ (venir) mañana?", blanks: [["vienen"]], explanation: { en: "Ustedes takes the third-person plural.", fr: "Ustedes se conjugue à la 3e personne du pluriel." } }),

  // g-gustar
  ex("g-gustar", 1, { type: "fill", es: "A mis padres les ___ (gustar) mucho viajar.", blanks: [["gusta"]], explanation: { en: "An infinitive subject → singular gusta.", fr: "Sujet à l'infinitif → gusta au singulier." } }),
  ex("g-gustar", 2, { type: "fill", es: "Nos ___ (interesar) los proyectos de energía.", blanks: [["interesan"]], explanation: { en: "The verb agrees with los proyectos (plural).", fr: "Le verbe s'accorde avec los proyectos (pluriel)." } }),
  ex("g-gustar", 3, { type: "correct", es: "Yo gusto las películas españolas.", answers: ["Me gustan las películas españolas.", "A mí me gustan las películas españolas."], explanation: { en: "The thing liked is the subject: me gustan + plural noun.", fr: "La chose aimée est le sujet : me gustan + nom pluriel." } }),
  ex("g-gustar", 4, { type: "fill", es: "¿A ti ___ apetece un café?", blanks: [["te"]], explanation: { en: "A ti → te.", fr: "A ti → te." } }),
  ex("g-gustar", 5, { type: "translate", prompt: { en: "Ana has a headache.", fr: "Ana a mal à la tête." }, answers: ["A Ana le duele la cabeza.", "Le duele la cabeza a Ana."], explanation: { en: "Doler follows the gustar pattern, with the article for the body part.", fr: "Doler se construit comme gustar, avec l'article pour la partie du corps." } }),
  ex("g-gustar", 6, { type: "choose", es: "Me ___ leer y correr por la mañana.", options: ["gusta", "gustan"], answers: ["gusta"], explanation: { en: "Several infinitives still take the singular.", fr: "Plusieurs infinitifs gardent le singulier." } }),
  ex("g-gustar", 7, { type: "translate", prompt: { en: "We don't like noise.", fr: "Le bruit ne nous plaît pas." }, answers: ["No nos gusta el ruido.", "A nosotros no nos gusta el ruido."], explanation: { en: "Definite article with a general noun: el ruido.", fr: "Article défini avec un nom général : el ruido." } }),

  // g-muy-mucho
  ex("g-muy-mucho", 1, { type: "fill", es: "Es un proyecto ___ ambicioso y tenemos ___ trabajo.", blanks: [["muy"], ["mucho"]], explanation: { en: "Muy + adjective; mucho + masculine noun.", fr: "Muy + adjectif ; mucho + nom masculin." } }),
  ex("g-muy-mucho", 2, { type: "fill", es: "Había ___ gente y ___ ruido.", blanks: [["mucha"], ["mucho"]], explanation: { en: "Mucho agrees with the noun: mucha gente, mucho ruido.", fr: "Mucho s'accorde avec le nom : mucha gente, mucho ruido." } }),
  ex("g-muy-mucho", 3, { type: "correct", es: "Este método es muy mejor.", answers: ["Este método es mucho mejor."], explanation: { en: "Mejor, peor, más, menos take mucho, not muy.", fr: "Mejor, peor, más, menos se construisent avec mucho, pas muy." } }),
  ex("g-muy-mucho", 4, { type: "choose", es: "No trabajes ___; descansa un poco.", options: ["tan", "tanto"], answers: ["tanto"], explanation: { en: "After a verb → tanto.", fr: "Après un verbe → tanto." } }),
  ex("g-muy-mucho", 5, { type: "translate", prompt: { en: "It's so easy!", fr: "C'est tellement facile !" }, answers: ["¡Es tan fácil!"], explanation: { en: "Tan + adjective.", fr: "Tan + adjectif." } }),
  ex("g-muy-mucho", 6, { type: "fill", es: "—¿Te gusta? —Sí, ___.", blanks: [["mucho"]], explanation: { en: "Standing alone → mucho; muy cannot stand alone.", fr: "Seul → mucho ; muy ne s'emploie jamais seul." } }),

  // g-possessives
  ex("g-possessives", 1, { type: "fill", es: "___ (our) oficina es pequeña; la ___ (yours, vosotros) es más grande.", blanks: [["Nuestra"], ["vuestra"]], explanation: { en: "Nuestro/vuestro agree with the possessed noun: oficina is feminine.", fr: "Nuestro/vuestro s'accordent avec la chose possédée : oficina est féminin." } }),
  ex("g-possessives", 2, { type: "fill", es: "Es un amigo ___ (of mine) del colegio.", blanks: [["mío"]], explanation: { en: "After the noun → long form mío.", fr: "Après le nom → forme longue mío." } }),
  ex("g-possessives", 3, { type: "correct", es: "Me duele mi cabeza.", answers: ["Me duele la cabeza."], explanation: { en: "Body parts take the article when the owner is clear.", fr: "Partie du corps : article défini quand le possesseur est clair." } }),
  ex("g-possessives", 4, { type: "translate", prompt: { en: "Is this pen yours? No, mine is blue.", fr: "Ce stylo est à toi ? Non, le mien est bleu." }, answers: ["¿Este bolígrafo es tuyo? No, el mío es azul.", "¿Es tuyo este bolígrafo? No, el mío es azul.", "¿Este boli es tuyo? No, el mío es azul."], explanation: { en: "Es tuyo (predicate, no article); el mío (pronoun with article).", fr: "Es tuyo (attribut, sans article) ; el mío (pronom avec article)." } }),
  ex("g-possessives", 5, { type: "choose", es: "Señora, ¿es este ___ abrigo?", options: ["su", "tu"], answers: ["su"], explanation: { en: "Formal address (usted) → su.", fr: "Vouvoiement (usted) → su." } }),
  ex("g-possessives", 6, { type: "fill", es: "___ (their) padres viven en Bilbao.", blanks: [["Sus"]], explanation: { en: "Su agrees with the possessed noun: padres → sus.", fr: "Su s'accorde avec la chose possédée : padres → sus." } }),

  // g-demonstratives
  ex("g-demonstratives", 1, { type: "fill", es: "___ semana (this) no puedo, pero la que viene sí.", blanks: [["Esta"]], explanation: { en: "Current period, near the speaker → esta.", fr: "Période actuelle, proche du locuteur → esta." } }),
  ex("g-demonstratives", 2, { type: "choose", es: "En ___ época (back then, long ago) no había móviles.", options: ["esta", "aquella"], answers: ["aquella"], explanation: { en: "Distant in time → aquel/aquella.", fr: "Éloigné dans le temps → aquel/aquella." } }),
  ex("g-demonstratives", 3, { type: "fill", es: "—Creo que el plan no es realista. —___ es exactamente el problema.", blanks: [["Eso"]], explanation: { en: "Referring back to what was said → neuter eso.", fr: "Reprise de ce qui vient d'être dit → neutre eso." } }),
  ex("g-demonstratives", 4, { type: "fill", es: "¿Qué es ___? (this thing in my hand)", blanks: [["esto"]], explanation: { en: "Unidentified object near the speaker → esto.", fr: "Objet non identifié près du locuteur → esto." } }),
  ex("g-demonstratives", 5, { type: "translate", prompt: { en: "I prefer this one, not that one (near you).", fr: "Je préfère celui-ci, pas celui-là (près de toi)." }, answers: ["Prefiero este, no ese.", "Prefiero este y no ese."], explanation: { en: "Este (near me), ese (near you). Pronouns need no accent.", fr: "Este (près de moi), ese (près de toi). Les pronoms ne prennent pas d'accent." } }),

  // g-personal-a
  ex("g-personal-a", 1, { type: "fill", es: "Esperamos ___ los clientes en la entrada.", blanks: [["a"]], explanation: { en: "Specific people as direct object → personal a.", fr: "Personnes déterminées en COD → a personnel." } }),
  ex("g-personal-a", 2, { type: "choose", es: "Tengo ___ dos hermanos.", options: ["a", "—"], answers: ["—"], explanation: { en: "No personal a after tener.", fr: "Pas de a personnel après tener." } }),
  ex("g-personal-a", 3, { type: "correct", es: "No conozco nadie en esta ciudad.", answers: ["No conozco a nadie en esta ciudad."], explanation: { en: "Nadie as a direct object takes personal a.", fr: "Nadie en COD prend le a personnel." } }),
  ex("g-personal-a", 4, { type: "fill", es: "¿___ quién llamas?", blanks: [["A"]], explanation: { en: "Quién as a direct object → a quién.", fr: "Quién en COD → a quién." } }),
  ex("g-personal-a", 5, { type: "translate", prompt: { en: "We need an engineer.", fr: "Nous avons besoin d'un ingénieur." }, answers: ["Necesitamos un ingeniero.", "Necesitamos una ingeniera."], explanation: { en: "An unspecified person → no personal a.", fr: "Personne indéterminée → pas de a personnel." } }),
  ex("g-personal-a", 6, { type: "translate", prompt: { en: "I'm looking for the manager.", fr: "Je cherche le responsable." }, answers: ["Busco al responsable.", "Estoy buscando al responsable.", "Busco al encargado.", "Busco al gerente."], explanation: { en: "A specific person → a + el = al.", fr: "Personne déterminée → a + el = al." } }),

  // g-direct-object
  ex("g-direct-object", 1, { type: "fill", es: "—¿Tienes las llaves? —Sí, ___ tengo.", blanks: [["las"]], explanation: { en: "Las llaves (feminine plural) → las.", fr: "Las llaves (féminin pluriel) → las." } }),
  ex("g-direct-object", 2, { type: "fill", es: "—¿Has leído el artículo? —Sí, ___ leí ayer.", blanks: [["lo"]], explanation: { en: "El artículo → lo, before the conjugated verb.", fr: "El artículo → lo, devant le verbe conjugué." } }),
  ex("g-direct-object", 3, { type: "fill", es: "—¿Sabes que se va? —Sí, ___ sé.", blanks: [["lo"]], explanation: { en: "Neuter lo replaces a whole idea.", fr: "Lo neutre remplace une idée entière." } }),
  ex("g-direct-object", 4, { type: "reconstruct", tokens: ["Voy", "a", "terminarlo", "mañana."], answers: ["Voy a terminarlo mañana."], explanation: { en: "Pronoun attached to the infinitive (or: Lo voy a terminar mañana).", fr: "Pronom attaché à l'infinitif (ou : Lo voy a terminar mañana)." } }),
  ex("g-direct-object", 5, { type: "correct", es: "¿A Laura? Le vi ayer en la biblioteca.", answers: ["¿A Laura? La vi ayer en la biblioteca."], explanation: { en: "Leísmo is accepted only for masculine persons; for Laura use la.", fr: "Le leísmo n'est admis qu'au masculin ; pour Laura, la." } }),
  ex("g-direct-object", 6, { type: "translate", prompt: { en: "I'll call you this afternoon.", fr: "Je t'appelle cet après-midi." }, answers: ["Te llamo esta tarde.", "Te llamaré esta tarde.", "Te voy a llamar esta tarde.", "Voy a llamarte esta tarde."], explanation: { en: "Llamar takes a direct object: te llamo.", fr: "Llamar se construit avec un COD : te llamo." } }),
  ex("g-direct-object", 7, { type: "fill", es: "El informe ___ termino mañana.", blanks: [["lo"]], explanation: { en: "A fronted direct object is repeated by a pronoun.", fr: "Un COD antéposé est repris par un pronom." } }),

  // g-indirect-object
  ex("g-indirect-object", 1, { type: "fill", es: "___ escribo a la directora mañana.", blanks: [["Le"]], explanation: { en: "The indirect object pronoun is kept even when the person is named.", fr: "Le pronom COI est maintenu même quand la personne est nommée." } }),
  ex("g-indirect-object", 2, { type: "fill", es: "___ explico el plan a los alumnos.", blanks: [["Les"]], explanation: { en: "Plural indirect object → les.", fr: "COI pluriel → les." } }),
  ex("g-indirect-object", 3, { type: "fill", es: "Mis padres ___ (to us) envían un paquete cada mes.", blanks: [["nos"]], explanation: { en: "To us → nos.", fr: "À nous → nos." } }),
  ex("g-indirect-object", 4, { type: "translate", prompt: { en: "Have you told your boss the truth?", fr: "Tu as dit la vérité à ton chef ?" }, answers: ["¿Le has dicho la verdad a tu jefe?", "¿Le has dicho a tu jefe la verdad?"], explanation: { en: "Duplicated indirect object: le ... a tu jefe.", fr: "COI redoublé : le ... a tu jefe." } }),
  ex("g-indirect-object", 5, { type: "choose", es: "Voy a ___ una pregunta al profesor.", options: ["hacerle", "hacerlo"], answers: ["hacerle"], explanation: { en: "Al profesor is an indirect object → le.", fr: "Al profesor est COI → le." } }),
  ex("g-indirect-object", 6, { type: "correct", es: "Les dije a ella que no venía.", answers: ["Le dije a ella que no venía."], explanation: { en: "One person → le, not les.", fr: "Une seule personne → le, et non les." } }),
];
