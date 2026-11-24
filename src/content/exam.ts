/**
 * Curated exam material (European Spanish), written with AI assistance and reviewed for level.
 * Levels follow the curriculum: 1 present tense; 2 adds the pretérito perfecto, estar + gerund,
 * ir a + infinitive and comparatives; 3 adds the indefinido and imperfecto; 4 adds the future,
 * conditional, imperative and pluperfect; 5 adds the present subjunctive; 6 uses everything.
 */
import type { Localized } from "@/lib/i18n/types";

export interface DictationText {
  id: string;
  level: number;
  text: string;
}

export interface WritingPrompt {
  id: string;
  level: number;
  prompt: Localized;
  guidance: Localized[];
  /** Model answer in Spanish, at the level and length expected, shown for the self-assessment. */
  model: string;
}

export const DICTATIONS: DictationText[] = [
  // Level 1: present tense
  {
    id: "d1-semana",
    level: 1,
    text: "Me llamo Clara y vivo en un piso pequeño en el centro de Valencia. Trabajo en una empresa de ingeniería y empiezo a las nueve. Por la mañana voy en bicicleta porque el tráfico es horrible. A mediodía como con mis compañeros en un bar cerca de la oficina. Por la tarde estudio inglés y los jueves juego al pádel con mi hermano.",
  },
  {
    id: "d1-cocina",
    level: 1,
    text: "Los sábados mis amigos y yo cocinamos juntos. Cada uno trae algo: Pablo compra el pan, Lucía prepara una ensalada y yo hago una tortilla de patatas. La cocina de mi piso no es muy grande, pero tenemos una mesa larga en el salón. Cenamos tarde, hablamos mucho y, al final, siempre hay una discusión sobre fútbol.",
  },
  {
    id: "d1-tren",
    level: 1,
    text: "Todos los lunes cojo el tren de las siete y media para ir a Madrid. El viaje dura dos horas y media. Normalmente leo el periódico, escucho música o miro el paisaje por la ventana. El tren está lleno de gente que trabaja en la capital. ¿Y vosotros? ¿Cómo vais al trabajo? ¿Preferís el coche o el transporte público?",
  },
  {
    id: "d1-tiempo",
    level: 1,
    text: "En el norte de España llueve mucho, sobre todo en otoño y en invierno. Por eso el paisaje es tan verde. En el sur, en cambio, hace calor casi todo el año y los veranos son muy secos. Mi familia vive en Asturias, pero yo estoy en Sevilla por mi trabajo. Echo de menos la lluvia, aunque me encanta el sol.",
  },
  // Level 2: pretérito perfecto, estar + gerund, ir a + infinitive, comparatives
  {
    id: "d2-semana",
    level: 2,
    text: "Esta semana ha sido muy intensa. El lunes hemos terminado un proyecto importante y el miércoles he presentado los resultados al director. Ahora estoy preparando un informe para el cliente, que es más complicado de lo que parece. Mañana voy a trabajar desde casa para concentrarme mejor. El fin de semana me voy a levantar tarde y no voy a mirar el correo.",
  },
  {
    id: "d2-mudanza",
    level: 2,
    text: "Mi hermana se ha mudado a Barcelona. Ha encontrado un piso cerca del mar, más luminoso que el anterior, aunque también más caro. Todavía está montando los muebles y organizando las cajas. Esta tarde voy a ayudarla con la estantería del salón. Dice que se levanta temprano para pasear por la playa antes de trabajar y que nunca se ha sentido tan tranquila.",
  },
  {
    id: "d2-curso",
    level: 2,
    text: "Este año me he apuntado a un curso de fotografía. Las clases son los martes por la noche y el profesor es muy exigente. Hasta ahora hemos aprendido a usar la luz natural y a componer una imagen. Estoy haciendo fotos de la ciudad todos los días con el móvil. El mes que viene vamos a organizar una pequeña exposición en una biblioteca del barrio.",
  },
  {
    id: "d2-reunion",
    level: 2,
    text: "¿Habéis leído el correo del jefe? Ha cambiado la hora de la reunión otra vez. Ahora va a ser a las cuatro, porque los clientes de Bilbao están viajando y no llegan antes. Yo me he preparado bien: he revisado los datos, he hecho los gráficos y he escrito un resumen corto. Lo más difícil va a ser responder a sus preguntas sobre el presupuesto.",
  },
  // Level 3: indefinido and imperfecto
  {
    id: "d3-portugal",
    level: 3,
    text: "El verano pasado fuimos a Portugal en coche. Salimos de Madrid muy temprano porque hacía mucho calor y queríamos evitar el tráfico. Cuando llegamos a Lisboa, la ciudad estaba llena de turistas, pero encontramos un hotel pequeño en el barrio de Alfama. Cada mañana desayunábamos en una pastelería distinta. El último día perdimos el móvil en un tranvía y, por suerte, un señor muy amable nos lo devolvió.",
  },
  {
    id: "d3-infancia",
    level: 3,
    text: "Cuando era pequeño, vivía con mis abuelos en un pueblo de Castilla. Mi abuelo se levantaba antes del amanecer para trabajar en el campo y mi abuela preparaba el desayuno para todos. Los domingos íbamos a la plaza y yo jugaba con los otros niños hasta la hora de comer. Un día, mi abuelo me regaló una bicicleta roja. Fue el mejor regalo de mi vida.",
  },
  {
    id: "d3-fabrica",
    level: 3,
    text: "Mi primer trabajo fue en una fábrica de piezas para coches. Tenía veintidós años y no sabía casi nada de la industria. Al principio estaba nervioso, porque las máquinas eran enormes y hacían mucho ruido. Sin embargo, mi jefa tenía mucha paciencia y me explicó todo con calma. Después de seis meses, ya organizaba el control de calidad de mi sección.",
  },
  {
    id: "d3-apagon",
    level: 3,
    text: "Ayer, mientras cenábamos, se fue la luz en todo el barrio. Al principio pensamos que era un problema de nuestro edificio, pero luego vimos que las farolas también estaban apagadas. Encendimos unas velas y seguimos cenando. Mis hijos estaban encantados: decían que parecía una aventura. La electricidad volvió dos horas más tarde, justo cuando empezábamos a contar historias de miedo.",
  },
  // Level 4: future, conditional, imperative, pluperfect
  {
    id: "d4-ciudad",
    level: 4,
    text: "Dentro de veinte años, las ciudades serán muy diferentes. Habrá menos coches en el centro y más espacios verdes. Probablemente trabajaremos más desde casa y los edificios producirán su propia energía. Yo, en cambio, me pregunto si seríamos más felices con tanta tecnología. Me gustaría vivir en un barrio tranquilo, con tiendas pequeñas y vecinos que se conocen.",
  },
  {
    id: "d4-camino",
    level: 4,
    text: "Si vas a hacer el Camino de Santiago, escúchame bien. No lleves demasiado peso en la mochila: con siete kilos es suficiente. Compra unas buenas botas y úsalas antes de salir. Bebe agua a menudo y no empieces a caminar a mediodía en verano. Yo lo había preparado todo con cuidado, pero aun así cometí un error: olvidé el protector solar el primer día.",
  },
  {
    id: "d4-entrevista",
    level: 4,
    text: "Cuando llegué a la entrevista, me di cuenta de que había olvidado el currículum en casa. Por suerte, la directora ya lo había leído. Me preguntó qué haría en mi primer mes en la empresa y cómo resolvería un conflicto entre dos compañeros. Le contesté que escucharía a las dos partes antes de decidir. Una semana después me llamaron: había conseguido el puesto.",
  },
  {
    id: "d4-pirineos",
    level: 4,
    text: "Este verano no iremos a la playa. Mi pareja y yo alquilaremos una casa en los Pirineos y pasaremos tres semanas caminando por la montaña. Ya hemos comprado los mapas y hemos reservado los refugios para las rutas más largas. Si hace mal tiempo, visitaremos los pueblos del valle. Sería perfecto ver algún animal salvaje, aunque dicen que es bastante difícil.",
  },
  // Level 5: present subjunctive
  {
    id: "d5-teletrabajo",
    level: 5,
    text: "No creo que el teletrabajo sea la solución para todo el mundo. Es verdad que ahorra tiempo y dinero, pero también es necesario que haya momentos de contacto con los compañeros. Mi empresa nos pide que vayamos a la oficina dos días por semana. Espero que esta organización dure, porque me permite concentrarme en casa y, al mismo tiempo, no sentirme aislado.",
  },
  {
    id: "d5-energia",
    level: 5,
    text: "Es importante que cada ciudadano reduzca su consumo de energía, aunque no basta con los gestos individuales. Hace falta que los gobiernos inviertan en transporte público y que las empresas asuman su responsabilidad. Cuando los precios de la electricidad bajen, mucha gente instalará placas solares. Ojalá no tengamos que esperar demasiado para ver resultados concretos.",
  },
  {
    id: "d5-granada",
    level: 5,
    text: "Querida Marta: me alegra mucho tu nuevo trabajo en Granada. Cuando llegues, avísame para que te presente a mis amigos de allí. Te recomiendo que busques piso en el Albaicín, aunque las calles sean empinadas. Dudo que encuentres un barrio más bonito. En cuanto tenga vacaciones, iré a verte. ¡Que tengas mucha suerte en esta nueva etapa!",
  },
  {
    id: "d5-laboratorio",
    level: 5,
    text: "Antes de que empecéis el experimento, leed las instrucciones con atención. Es imprescindible que llevéis gafas de protección y que nadie toque los productos sin guantes. Cuando terminéis cada prueba, anotad los resultados en la tabla. Si algo no funciona como esperáis, no intentéis repararlo solos: llamadme para que lo revisemos juntos.",
  },
  // Level 6: imperfect subjunctive, conditional sentences, passive voice
  {
    id: "d6-acento",
    level: 6,
    text: "Si hubiera estudiado español de niño, ahora lo hablaría sin acento. Mis padres querían que aprendiera alemán, porque pensaban que sería más útil para mi carrera. No me arrepiento, pero a veces me pregunto qué habría pasado si hubiéramos vivido en Madrid. Quizá habría trabajado en otro sector o habría conocido a otras personas. Nunca lo sabré.",
  },
  {
    id: "d6-puente",
    level: 6,
    text: "El puente fue diseñado por una ingeniera catalana y construido en apenas dos años. Aunque al principio muchos vecinos se opusieron al proyecto, hoy nadie imagina la ciudad sin él. Los técnicos explicaron que, si no se hubiera reforzado la estructura, el viento habría provocado vibraciones peligrosas. Se calcula que lo cruzan más de veinte mil personas al día.",
  },
  {
    id: "d6-charla",
    level: 6,
    text: "Me pidieron que diera una charla sobre inteligencia artificial en la universidad. Acepté con la condición de que los estudiantes pudieran hacer preguntas durante toda la sesión. Fue una experiencia estimulante: plantearon dudas tan precisas que tuve que reconocer los límites de mis conocimientos. Ojalá todas las clases fueran así de participativas.",
  },
  {
    id: "d6-valencia",
    level: 6,
    text: "Cuando decidí dejar París, nadie entendía que abandonara un trabajo estable para empezar de cero en Valencia. Sin embargo, sentía que necesitaba un cambio. Si me hubieran dicho entonces lo difícil que sería encontrar piso, quizá no me habría atrevido. Hoy, en cambio, no cambiaría mi vida aquí por nada, aunque me ofrecieran el doble de sueldo.",
  },
];

export const WRITING_PROMPTS: WritingPrompt[] = [
  // Level 1 (about 70 words)
  {
    id: "w1-day",
    level: 1,
    prompt: {
      en: "Describe your typical working or study day: what you do, when, where and with whom. Mention one thing you like and one thing you would change.",
      fr: "Décrivez une journée typique de travail ou d'études : ce que vous faites, quand, où et avec qui. Mentionnez une chose que vous aimez et une chose que vous changeriez.",
    },
    guidance: [
      { en: "Use time expressions (por la mañana, después, a las ocho).", fr: "Utilisez des expressions de temps (por la mañana, después, a las ocho)." },
      { en: "Use connectors such as pero, además, porque.", fr: "Employez des connecteurs comme pero, además, porque." },
    ],
    model:
      "Me levanto a las siete y desayuno un café con tostadas. A las ocho cojo el metro y llego a la oficina a las ocho y media. Trabajo en un equipo de cinco ingenieros: por la mañana tenemos reuniones y por la tarde diseño piezas con el ordenador. A mediodía como con mis compañeros en un bar muy barato. Vuelvo a casa a las seis, voy al gimnasio y ceno con mi pareja. Me encanta mi equipo porque todos ayudan, pero no me gusta el horario: empiezo demasiado temprano y prefiero empezar a las nueve.",
  },
  {
    id: "w1-city",
    level: 1,
    prompt: {
      en: "Present the city where you live to a Spanish colleague who will move there: neighbourhoods, transport, cost of living and one recommendation.",
      fr: "Présentez la ville où vous habitez à un collègue espagnol qui va s'y installer : quartiers, transports, coût de la vie et une recommandation.",
    },
    guidance: [
      { en: "Use hay and estar correctly.", fr: "Employez correctement hay et estar." },
      { en: "Give at least one comparison.", fr: "Faites au moins une comparaison." },
    ],
    model:
      "Vivo en Lyon, una ciudad grande y tranquila en el este de Francia. El centro está entre dos ríos, el Ródano y el Saona. Hay muchos barrios interesantes: el casco antiguo es precioso y la Croix-Rousse está en una colina. El transporte funciona bien porque hay metro, tranvía y autobuses. La vida es más barata que en París, pero los pisos del centro son caros. Te recomiendo buscar piso cerca de la universidad: es un barrio joven y está bien comunicado.",
  },
  {
    id: "w1-family",
    level: 1,
    prompt: {
      en: "Introduce your family or the people you live with: who they are, what they do and what you do together.",
      fr: "Présentez votre famille ou les personnes avec qui vous vivez : qui elles sont, ce qu'elles font et ce que vous faites ensemble.",
    },
    guidance: [
      { en: "Use ser and tener to describe people.", fr: "Utilisez ser et tener pour décrire les personnes." },
      { en: "Use possessives (mi, su, nuestro).", fr: "Employez les possessifs (mi, su, nuestro)." },
    ],
    model:
      "Vivo con mi pareja, Julien, y con nuestro gato, Bigote. Julien es profesor de matemáticas en un instituto y le encanta cocinar. Mis padres viven en Burdeos y tienen una casa con jardín. Mi hermana pequeña se llama Inès; es enfermera y trabaja de noche. Los domingos comemos todos juntos en casa de mis padres. Mi padre prepara la paella, mi madre pone la mesa y nosotros traemos el postre. Son días muy divertidos.",
  },
  // Level 2 (about 100 words)
  {
    id: "w2-email",
    level: 2,
    prompt: {
      en: "Write an email to a professor asking to change the date of an exam. Explain the reason and propose two alternatives.",
      fr: "Écrivez un courriel à un professeur pour demander de changer la date d'un examen. Expliquez la raison et proposez deux alternatives.",
    },
    guidance: [
      { en: "Use a formal register (usted) and polite forms (podría, me gustaría).", fr: "Utilisez un registre formel (usted) et des formules de politesse (podría, me gustaría)." },
      { en: "Structure: greeting, request, reasons, proposal, closing.", fr: "Structure : salutation, demande, raisons, proposition, formule finale." },
    ],
    model:
      "Estimado profesor García: Le escribo porque tengo un problema con la fecha del examen de Termodinámica. Esta mañana me han confirmado una entrevista de prácticas en una empresa de Bilbao el mismo día, el 14 de junio. Es una oportunidad muy importante para mí y no puedo cambiarla. Por eso, me gustaría saber si podría hacer el examen otro día. Le propongo dos alternativas: el 12 de junio por la tarde o el 17 de junio por la mañana. Muchas gracias por su comprensión. Un cordial saludo, Camille Martin",
  },
  {
    id: "w2-weekend",
    level: 2,
    prompt: {
      en: "Write a message to a friend: what you have done this week and what you are going to do this weekend.",
      fr: "Écrivez un message à un ami : ce que vous avez fait cette semaine et ce que vous allez faire ce week-end.",
    },
    guidance: [
      { en: "Use the pretérito perfecto for this week (he trabajado, hemos visto).", fr: "Utilisez le pretérito perfecto pour cette semaine (he trabajado, hemos visto)." },
      { en: "Use ir a + infinitive for your plans.", fr: "Utilisez ir a + infinitif pour vos projets." },
    ],
    model:
      "¡Hola, Sergio! ¿Qué tal estás? Esta semana ha sido muy larga. He trabajado mucho porque hemos terminado un proyecto para un cliente nuevo. El miércoles he ido al cine con mis compañeros y hemos visto una película española muy divertida. Además, he empezado un curso de cocina los jueves. Este fin de semana voy a descansar: el sábado voy a dormir hasta tarde y por la noche voy a cenar con unos amigos en el centro. El domingo vamos a hacer una excursión a la montaña. ¿Te apetece venir? ¡Escríbeme! Un abrazo.",
  },
  {
    id: "w2-flat",
    level: 2,
    prompt: {
      en: "You are looking for a flatmate. Write an ad describing the flat, the neighbourhood and the person you are looking for.",
      fr: "Vous cherchez un colocataire. Rédigez une annonce qui décrit l'appartement, le quartier et la personne recherchée.",
    },
    guidance: [
      { en: "Use comparatives (más grande que, tan tranquilo como).", fr: "Employez des comparatifs (más grande que, tan tranquilo como)." },
      { en: "Use estar for location and ser for description.", fr: "Utilisez estar pour la localisation et ser pour la description." },
    ],
    model:
      "Busco compañero o compañera de piso en Valencia. El piso está en el barrio de Ruzafa, a cinco minutos de la estación. Es más grande que la mayoría de los pisos de la zona: tiene tres habitaciones, dos baños y una terraza con mucha luz. La habitación libre es tranquila y da a un patio interior. El alquiler cuesta 420 euros al mes, gastos incluidos. Yo soy ingeniero, trabajo de lunes a viernes y me gusta cocinar. Busco una persona ordenada, simpática y tan tranquila como yo. Si te interesa, escríbeme y quedamos para ver el piso.",
  },
  // Level 3 (about 130 words)
  {
    id: "w3-trip",
    level: 3,
    prompt: {
      en: "Tell the story of a trip or a project that did not go as planned. What happened, how did you react, and what did you learn?",
      fr: "Racontez un voyage ou un projet qui ne s'est pas passé comme prévu. Que s'est-il passé, comment avez-vous réagi et qu'en avez-vous retenu ?",
    },
    guidance: [
      { en: "Combine the pretérito indefinido (events) and imperfecto (background).", fr: "Combinez le pretérito indefinido (événements) et l'imperfecto (contexte)." },
      { en: "Use at least three connectors (al principio, de repente, al final).", fr: "Employez au moins trois connecteurs (al principio, de repente, al final)." },
    ],
    model:
      "El verano pasado organicé un viaje a Galicia con dos amigos. Queríamos hacer una parte del Camino de Santiago y después visitar la costa. Al principio todo iba bien: hacía buen tiempo y caminábamos unos veinte kilómetros al día. Por las noches dormíamos en albergues y conocíamos a peregrinos de todo el mundo. Sin embargo, el tercer día empezó a llover sin parar y uno de mis amigos se torció el tobillo. De repente, tuvimos que cambiar todos nuestros planes. Alquilamos un coche, buscamos un médico en Lugo y pasamos dos días en un hotel pequeño. Al final, el viaje fue muy diferente, pero aprendí algo importante: con buenos amigos, los problemas se convierten en buenos recuerdos.",
  },
  {
    id: "w3-engineering",
    level: 3,
    prompt: {
      en: "Compare studying engineering in France and in Spain (or two universities you know): access, teaching style, workload, career prospects.",
      fr: "Comparez les études d'ingénieur en France et en Espagne (ou deux universités que vous connaissez) : accès, pédagogie, charge de travail, débouchés.",
    },
    guidance: [
      { en: "Use comparatives and superlatives.", fr: "Employez comparatifs et superlatifs." },
      { en: "Conclude with a recommendation.", fr: "Concluez par une recommandation." },
    ],
    model:
      "En Francia, para estudiar ingeniería, muchos estudiantes pasan primero dos años en las clases preparatorias, que son durísimas. Después hacen un concurso para entrar en una escuela. En España, en cambio, el acceso depende de la nota de la selectividad y los alumnos entran directamente en la universidad. Cuando yo estudiaba en Toulouse, las clases eran más teóricas que en Madrid, donde hice un año de Erasmus: allí los profesores proponían más proyectos prácticos. La carga de trabajo me pareció parecida, aunque los exámenes franceses eran más largos. En cuanto a las salidas profesionales, los ingenieros franceses suelen encontrar trabajo más rápido y con sueldos más altos. Sin embargo, la experiencia española fue la más enriquecedora de mis estudios. Por eso, recomiendo a cualquier estudiante combinar los dos sistemas.",
  },
  {
    id: "w3-childhood",
    level: 3,
    prompt: {
      en: "Describe a place where you spent a lot of time as a child and tell one memorable thing that happened there.",
      fr: "Décrivez un lieu où vous passiez beaucoup de temps enfant et racontez un événement marquant qui s'y est produit.",
    },
    guidance: [
      { en: "Use the imperfecto to describe (era, había, solíamos).", fr: "Utilisez l'imperfecto pour décrire (era, había, solíamos)." },
      { en: "Use the indefinido for the events (un día, de repente).", fr: "Utilisez l'indefinido pour les événements (un día, de repente)." },
    ],
    model:
      "Cuando era niño, pasaba todos los veranos en la casa de mis abuelos, en un pueblo de la Provenza. La casa era antigua y tenía un jardín enorme con higueras. Por las mañanas, mi hermano y yo ayudábamos a mi abuelo en el huerto y por las tardes íbamos al río con los otros niños del pueblo. Un verano, cuando yo tenía diez años, encontramos un perro abandonado cerca del puente. Estaba muy delgado y tenía miedo de todo. Lo llevamos a casa y mi abuela, que normalmente no quería animales, decidió quedárselo. Lo llamamos Pirata. Desde ese día, Pirata nos acompañó en todas nuestras aventuras. Todavía hoy, cuando pienso en esos veranos, recuerdo su ladrido.",
  },
  // Level 4 (about 170 words)
  {
    id: "w4-explain",
    level: 4,
    prompt: {
      en: "Explain a technical concept from your field (for example an algorithm, a material or a machine) to a non-specialist audience.",
      fr: "Expliquez un concept technique de votre domaine (par exemple un algorithme, un matériau ou une machine) à un public non spécialiste.",
    },
    guidance: [
      { en: "Define terms precisely and use examples.", fr: "Définissez précisément les termes et donnez des exemples." },
      { en: "Use impersonal se and passive constructions where natural.", fr: "Utilisez le se impersonnel et la voix passive lorsque c'est naturel." },
    ],
    model:
      "Hoy os voy a explicar qué es un algoritmo de recomendación, una herramienta que se usa en casi todas las aplicaciones. Un algoritmo es simplemente una serie de instrucciones que un ordenador sigue para resolver un problema. En este caso, el problema consiste en adivinar qué película, canción o producto os gustará. Para conseguirlo, se recogen datos sobre lo que cada usuario ha visto o comprado. Después, el sistema compara vuestros gustos con los de miles de personas parecidas. Si alguien que ha elegido las mismas películas que vosotros ha disfrutado de una serie nueva, el algoritmo os la propondrá. Estos sistemas fueron desarrollados en los años noventa y hoy se aplican en el comercio, la música y la información. Sin embargo, tienen límites: si solo veis lo que os recomiendan, nunca descubriréis nada diferente. Por eso, de vez en cuando, buscad algo nuevo por vuestra cuenta: el algoritmo no lo sabe todo sobre vosotros.",
  },
  {
    id: "w4-future",
    level: 4,
    prompt: {
      en: "How do you imagine your life in ten years? Talk about your work, where you will live and what you would like to change.",
      fr: "Comment imaginez-vous votre vie dans dix ans ? Parlez de votre travail, de l'endroit où vous vivrez et de ce que vous aimeriez changer.",
    },
    guidance: [
      { en: "Use the futuro simple for predictions.", fr: "Utilisez le futuro simple pour les prévisions." },
      { en: "Use the condicional for wishes (me gustaría, sería).", fr: "Utilisez le conditionnel pour les souhaits (me gustaría, sería)." },
    ],
    model:
      "Dentro de diez años, creo que viviré en España, probablemente en Valencia o en Málaga, porque me encanta el mar y la luz del Mediterráneo. Trabajaré como ingeniero en una empresa de energías renovables y, si todo va bien, dirigiré un pequeño equipo. Hablaré español con fluidez y podré leer novelas sin diccionario. Tendré una casa con terraza, donde cultivaré tomates y hierbas aromáticas. Por supuesto, no todo será perfecto: echaré de menos a mi familia y a mis amigos de Francia. Por eso, me gustaría volver a menudo y recibir muchas visitas. También me gustaría cambiar algunos hábitos: pasaría menos tiempo delante de las pantallas y haría más deporte. Sería maravilloso tener tiempo para viajar por Latinoamérica, sobre todo por Chile y Argentina. En cualquier caso, sé que la vida da muchas vueltas y que mis planes cambiarán. Lo importante será seguir aprendiendo.",
  },
  {
    id: "w4-advice",
    level: 4,
    prompt: {
      en: "A Spanish friend is moving to France for work. Give them practical advice for the first weeks.",
      fr: "Un ami espagnol s'installe en France pour son travail. Donnez-lui des conseils pratiques pour les premières semaines.",
    },
    guidance: [
      { en: "Use affirmative and negative imperatives (abre, no olvides).", fr: "Employez l'impératif affirmatif et négatif (abre, no olvides)." },
      { en: "Use the future for what will happen (necesitarás, tendrás que).", fr: "Utilisez le futur pour ce qui arrivera (necesitarás, tendrás que)." },
    ],
    model:
      "Querido Andrés: Me alegro mucho de tu nuevo trabajo en Lyon. Aquí tienes algunos consejos para las primeras semanas. Primero, abre una cuenta en un banco francés lo antes posible, porque la necesitarás para alquilar un piso y para cobrar tu sueldo. No busques piso en agosto: mucha gente está de vacaciones y las agencias trabajan poco. Pide a tu empresa una copia de tu contrato; te ayudará mucho con los propietarios. Después, hazte la tarjeta de transporte para residentes: con ella, el abono mensual sale más barato y funciona en el metro, el tranvía y los autobuses. Aprende algunas frases básicas en francés, aunque en la oficina hablarás inglés. Los franceses agradecen mucho el esfuerzo. Además, no olvides que aquí se cena temprano: a las ocho de la tarde, muchos restaurantes ya estarán llenos. Por último, llámame el primer fin de semana y te enseñaré mis rincones favoritos de la ciudad. ¡Te encantará! Un abrazo fuerte.",
  },
  // Level 5 (about 210 words)
  {
    id: "w5-remote",
    level: 5,
    prompt: {
      en: "Is remote work better for productivity? Give your opinion with arguments for and against.",
      fr: "Le télétravail est-il meilleur pour la productivité ? Donnez votre avis avec des arguments pour et contre.",
    },
    guidance: [
      { en: "Use creo que / no creo que with the correct mood.", fr: "Employez creo que / no creo que avec le mode correct." },
      { en: "Organise with por un lado, por otro lado, sin embargo, en conclusión.", fr: "Organisez avec por un lado, por otro lado, sin embargo, en conclusión." },
    ],
    model:
      "El teletrabajo se ha extendido mucho en los últimos años y hoy muchas empresas se preguntan si es mejor para la productividad. En mi opinión, la respuesta depende del tipo de tarea y de la persona. Por un lado, trabajar desde casa tiene ventajas evidentes. Se ahorra el tiempo del transporte, que en las grandes ciudades puede superar una hora al día, y es más fácil concentrarse en tareas que exigen mucha atención, como programar o redactar informes. Además, muchos trabajadores organizan mejor su horario y se sienten más satisfechos. Por otro lado, no creo que el teletrabajo sea adecuado para todo. Las ideas nuevas suelen surgir en conversaciones informales, y es difícil que un equipo cree confianza solo a través de una pantalla. Los empleados jóvenes, en particular, necesitan que alguien les explique cómo funciona la empresa y aprenden mucho observando a sus compañeros. Sin embargo, la solución no es volver a la oficina cinco días por semana. Es importante que cada empresa encuentre un equilibrio y que defina para qué sirven los días presenciales. En conclusión, creo que un modelo mixto, con dos o tres días en la oficina, es el más productivo.",
  },
  {
    id: "w5-housing",
    level: 5,
    prompt: {
      en: "Housing in large Spanish cities has become very expensive. Analyse the causes and propose measures.",
      fr: "Le logement dans les grandes villes espagnoles est devenu très cher. Analysez les causes et proposez des mesures.",
    },
    guidance: [
      { en: "Use es necesario que / habría que + appropriate forms.", fr: "Employez es necesario que / habría que avec les formes appropriées." },
      { en: "Distinguish causes and consequences with precise connectors.", fr: "Distinguez causes et conséquences avec des connecteurs précis." },
    ],
    model:
      "En los últimos diez años, el precio de la vivienda en Madrid, Barcelona o Málaga ha subido mucho más rápido que los sueldos. Las causas son varias. En primer lugar, estas ciudades atraen a muchos trabajadores, porque allí se concentran las empresas y las universidades. Como la demanda crece y se construyen pocos pisos nuevos, los precios aumentan. En segundo lugar, una parte importante de las viviendas del centro se ha convertido en apartamentos turísticos, que son más rentables para los propietarios. Por consiguiente, quedan menos pisos para los residentes. Por último, algunos fondos de inversión compran edificios enteros y suben los alquileres. Para mejorar la situación, es necesario que las administraciones construyan vivienda pública de alquiler y que la mantengan a largo plazo. Además, habría que limitar los pisos turísticos en los barrios más afectados, para que los vecinos no tengan que marcharse. También es importante que se mejore el transporte entre las ciudades y los pueblos cercanos, de modo que vivir fuera no signifique perder horas cada día. En definitiva, el problema no tiene una única solución, pero sin una política firme los jóvenes seguirán sin poder independizarse.",
  },
  {
    id: "w5-proposals",
    level: 5,
    prompt: {
      en: "Your town hall asks residents for proposals to improve the neighbourhood. Write a formal letter with three proposals and justify them.",
      fr: "Votre mairie demande aux habitants des propositions pour améliorer le quartier. Écrivez une lettre formelle avec trois propositions argumentées.",
    },
    guidance: [
      { en: "Use propongo que / es importante que + present subjunctive.", fr: "Employez propongo que / es importante que + présent du subjonctif." },
      { en: "Use para que and cuando + subjunctive where needed.", fr: "Utilisez para que et cuando + subjonctif lorsque c'est nécessaire." },
    ],
    model:
      "Estimados señores del Ayuntamiento: Les escribo como vecino del barrio de San Francisco para presentarles tres propuestas que, en mi opinión, mejorarían la vida de los residentes. En primer lugar, propongo que la calle Mayor se convierta en peatonal los fines de semana. Hoy los coches ocupan casi todo el espacio y las familias no tienen dónde pasear. Si la calle es peatonal, los comercios tendrán más clientes y habrá menos ruido. En segundo lugar, es importante que se instalen más bancos y fuentes en el parque de la Ribera. Muchas personas mayores van allí cada mañana, pero tienen que volver pronto a casa porque no pueden descansar ni beber agua. Por último, les pido que organicen un servicio de préstamo de bicicletas para que los estudiantes puedan ir al instituto sin depender del autobús, que solo pasa cada media hora. Sé que estas medidas tienen un coste, pero estoy convencido de que el barrio ganará en calidad de vida. Cuando empiecen las obras, los vecinos estaremos encantados de colaborar. Atentamente, Thomas Leroy",
  },
  // Level 6 (about 250 words)
  {
    id: "w6-ai",
    level: 6,
    prompt: {
      en: "Should artificial intelligence be regulated? Write a structured argument considering innovation, risks and responsibility.",
      fr: "Faut-il réguler l'intelligence artificielle ? Rédigez une argumentation structurée qui considère l'innovation, les risques et la responsabilité.",
    },
    guidance: [
      { en: "Use concessive structures (aunque, si bien, a pesar de que).", fr: "Employez des structures concessives (aunque, si bien, a pesar de que)." },
      { en: "Include at least one hypothetical sentence (si + imperfecto de subjuntivo).", fr: "Incluez au moins une hypothèse (si + imperfecto de subjuntivo)." },
    ],
    model:
      "La inteligencia artificial avanza a una velocidad que pocos imaginaban hace diez años. Hoy redacta textos, analiza radiografías y conduce coches. Ante este panorama, la pregunta ya no es si debemos regularla, sino cómo hacerlo. Si bien es cierto que la innovación necesita libertad, la historia demuestra que las tecnologías poderosas exigen normas claras. Nadie aceptaría que se vendieran medicamentos sin ensayos clínicos ni que se construyeran puentes sin control. Del mismo modo, sería imprudente permitir que sistemas capaces de decidir sobre un crédito o un diagnóstico funcionaran sin supervisión. Por otro lado, una regulación excesiva podría frenar a las empresas pequeñas, que no tienen los recursos de los grandes grupos para cumplir con trámites complejos. A pesar de que este riesgo es real, se puede evitar con normas proporcionales: requisitos estrictos para los usos de alto riesgo y reglas sencillas para el resto. La cuestión de la responsabilidad es quizá la más delicada. Si un sistema automático cometiera un error grave, ¿quién respondería: el desarrollador, la empresa que lo utiliza o el usuario? Aunque la respuesta no es sencilla, conviene establecerla antes de que ocurran los problemas, no después. En conclusión, regular la inteligencia artificial no significa oponerse al progreso, sino orientarlo. Una ley bien diseñada protegería a los ciudadanos y, al mismo tiempo, daría a las empresas la seguridad jurídica que necesitan para invertir.",
  },
  {
    id: "w6-decision",
    level: 6,
    prompt: {
      en: "Describe a decision you made that changed your path. What would have happened if you had chosen differently?",
      fr: "Décrivez une décision qui a changé votre parcours. Que se serait-il passé si vous aviez choisi autrement ?",
    },
    guidance: [
      { en: "Use past hypotheticals (si hubiera..., habría...).", fr: "Employez l'hypothèse passée (si hubiera..., habría...)." },
      { en: "Vary past tenses accurately.", fr: "Variez avec précision les temps du passé." },
    ],
    model:
      "Hace seis años, cuando terminé la carrera, tuve que elegir entre dos ofertas de trabajo. La primera era de una gran empresa aeronáutica de Toulouse, con un buen sueldo y un contrato indefinido. La segunda venía de una pequeña empresa de energía solar en Sevilla, que me ofrecía menos dinero y un contrato de un año. Todos mis amigos me aconsejaron que aceptara la primera. Sin embargo, durante mi Erasmus en España había descubierto un país que me fascinaba, y la idea de trabajar en energías renovables me parecía mucho más estimulante. Después de varias noches sin dormir, elegí Sevilla. Los primeros meses no fueron fáciles: mi español era limitado, el calor de agosto me resultaba insoportable y echaba de menos a mi familia. Aun así, aprendí más en ese año que en toda la carrera, porque en una empresa pequeña todos hacíamos de todo. Si hubiera aceptado la oferta de Toulouse, probablemente ahora tendría un puesto más estable y viviría cerca de mis padres. Quizá habría ahorrado más dinero y me habría comprado un piso. Pero no habría conocido a las personas que hoy son mis mejores amigos, ni habría descubierto que me apasiona dirigir proyectos. A veces me pregunto qué habría pasado si la empresa sevillana hubiera cerrado aquel primer año. No lo sé, pero estoy convencido de que tomé la decisión correcta, porque la tomé por convicción y no por miedo.",
  },
  {
    id: "w6-university",
    level: 6,
    prompt: {
      en: "Write a short opinion column on the role of universities in a society transformed by technology.",
      fr: "Rédigez une courte tribune sur le rôle des universités dans une société transformée par la technologie.",
    },
    guidance: [
      { en: "Adopt a formal written register and nuanced claims.", fr: "Adoptez un registre écrit soutenu et des affirmations nuancées." },
      { en: "Use advanced connectors (no obstante, por consiguiente, en definitiva).", fr: "Employez des connecteurs avancés (no obstante, por consiguiente, en definitiva)." },
    ],
    model:
      "Durante siglos, la universidad fue el lugar privilegiado del saber: allí se conservaban los libros, enseñaban los expertos y se formaban las élites. Hoy, cualquier persona con un teléfono puede acceder a cursos de las mejores instituciones del mundo y consultar a una inteligencia artificial a cualquier hora. Cabe preguntarse, por tanto, qué papel le queda. A mi juicio, la universidad no debe competir con internet en la transmisión de información, una batalla que ya ha perdido. Su función es otra: enseñar a pensar con rigor. Saber distinguir una fuente fiable de una manipulación, formular una hipótesis o defender un argumento ante un auditorio crítico son capacidades que no se adquieren viendo vídeos, sino a través del diálogo con profesores y compañeros. No obstante, sería ingenuo afirmar que la institución puede seguir funcionando como hace treinta años. Las clases magistrales en las que el profesor dicta y los alumnos copian han perdido gran parte de su sentido. Convendría sustituirlas por seminarios, proyectos y prácticas en colaboración con empresas y centros de investigación. Asimismo, la universidad debería abrirse a quienes ya trabajan: en un mundo en el que las profesiones cambian cada década, la formación no puede limitarse a los veinte años. En definitiva, la tecnología no hace innecesaria la universidad; al contrario, la obliga a concentrarse en lo esencial. Si lo consigue, seguirá siendo imprescindible. Si se resiste, otros ocuparán su lugar.",
  },
];
