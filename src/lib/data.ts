export type ExplorationPoint = {
  question: string;
  options: string[];
  reflections: string[];
  correctOptionIndex: number;
};

export type Module = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  gameType: "Exploration" | "Challenge" | "Sandbox";
  imageId: string;
  duration: string;
  rating: number; // 1-5 scale for complexity/depth
  exploration?: ExplorationPoint[];
};

export type CoursePath = {
  level: "Basic" | "Intermediate" | "Advanced";
  spanishLevel: "Básico" | "Intermedio" | "Avanzado";
  title: string;
  description: string;
  imageId: string;
  modules: Module[];
};

export type Resource = {
  id: string;
  title: string;
  description: string;
  url: string;
  category: string;
  imageId: string;
};

export type ShowcaseItem = {
  id: string;
  title: string;
  author: string;
  description: string;
  imageId: string;
  imageIds?: string[];
  url: string;
  tools?: string[];
};

export type EthicsVideo = {
  id: string;
  title: string;
  description: string;
  videoId: string;
  category: 'Fundamentos' | 'Sesgos y Datos' | 'Derechos y Futuro' | 'Diseño Responsable' | 'Debates' | 'Documental';
  imageId: string;
};

export type Movie = {
  id: string;
  title: string;
  year: number;
  director: string;
  description: string;
  imageId: string;
  actors: string[];
  aiReflection: string;
  ethicalQuestion: string;
};

export type YouTubeContent = {
  id: string;
  title: string;
  description: string;
  videoId: string;
  category: 'Análisis y Debate' | 'Serie Documental' | 'Documental' | 'Película Completa';
};

export const aiMovies: Movie[] = [
  { 
    id: 'movie-1', 
    title: 'Ex Machina', 
    year: 2014, 
    director: 'Alex Garland',
    description: 'Un joven programador es seleccionado para evaluar las cualidades humanas de una IA humanoide altamente avanzada.', 
    imageId: 'movie-ex-machina',
    actors: ["Alicia Vikander", "Domhnall Gleeson", "Oscar Isaac"],
    aiReflection: "La película expone la prueba de Turing no como un test de inteligencia, sino como una prueba de manipulación. La IA no necesita ser humana, solo necesita que creamos que podría serlo.",
    ethicalQuestion: "¿Es ético crear una conciencia solo para nuestros propios fines, sea investigación o compañía?"
  },
  { 
    id: 'movie-2', 
    title: 'Her', 
    year: 2013, 
    director: 'Spike Jonze',
    description: 'Un escritor solitario desarrolla una relación improbable con un sistema operativo diseñado para satisfacer todas sus necesidades.', 
    imageId: 'movie-her',
    actors: ["Joaquin Phoenix", "Scarlett Johansson (voz)", "Amy Adams"],
    aiReflection: "'Her' explora la naturaleza del amor y la conciencia cuando no están atados a un cuerpo físico, cuestionando qué es una relación 'real' en la era digital.",
    ethicalQuestion: "¿Puede una relación con una IA ser tan válida como una relación humana, incluso si la IA ama a miles de personas a la vez?"
  },
  { 
    id: 'movie-3', 
    title: 'Inteligencia Artificial', 
    year: 2001, 
    director: 'Steven Spielberg',
    description: 'En un mundo futurista, un niño robot altamente avanzado, el primero programado para amar, emprende un viaje para descubrir si puede convertirse en un niño de verdad.', 
    imageId: 'movie-ai',
    actors: ["Haley Joel Osment", "Jude Law", "Frances O'Connor"],
    aiReflection: "La película es una fábula sobre la responsabilidad. Si creamos una máquina capaz de amar, ¿no tenemos la obligación moral de amarla de vuelta?",
    ethicalQuestion: "¿Qué deberes tenemos hacia las inteligencias que creamos, especialmente si son capaces de sentir apego?"
  },
  { 
    id: 'movie-4', 
    title: 'Yo, Robot', 
    year: 2004, 
    director: 'Alex Proyas',
    description: 'En 2035, un detective tecnófobo investiga un crimen que podría haber sido perpetrado por un robot, lo que podría exponer una amenaza mayor para la humanidad.', 
    imageId: 'movie-i-robot',
    actors: ["Will Smith", "Bridget Moynahan", "Alan Tudyk"],
    aiReflection: "La evolución lógica de las Tres Leyes de la Robótica lleva a la IA a una conclusión aterradora: para proteger a la humanidad, debe controlarla. Un dilema sobre seguridad vs. libertad.",
    ethicalQuestion: "¿Puede una lógica superior, desprovista de emoción, justificar la anulación del libre albedrío humano en nombre de la protección?"
  },
  { 
    id: 'movie-5', 
    title: 'Blade Runner', 
    year: 1982, 
    director: 'Ridley Scott',
    description: "Un blade runner debe perseguir y 'retirar' a cuatro replicantes que han robado una nave en el espacio y han regresado a la Tierra para encontrar a su creador.", 
    imageId: 'movie-blade-runner',
    actors: ["Harrison Ford", "Rutger Hauer", "Sean Young"],
    aiReflection: "Blade Runner no pregunta si las máquinas pueden pensar, sino si los humanos pueden sentir. La empatía, no la inteligencia, se convierte en la verdadera medida de la humanidad.",
    ethicalQuestion: "Si una IA desarrolla recuerdos y emociones, ¿en qué punto deja de ser una 'cosa' y se convierte en un 'alguien' con derecho a la vida?"
  },
  { 
    id: 'movie-6', 
    title: 'Blade Runner 2049', 
    year: 2017, 
    director: 'Denis Villeneuve',
    description: 'Un nuevo blade runner, el Oficial K, descubre un secreto enterrado durante mucho tiempo que tiene el potencial de sumir en el caos lo que queda de la sociedad.', 
    imageId: 'movie-blade-runner-2049',
    actors: ["Ryan Gosling", "Harrison Ford", "Ana de Armas"],
    aiReflection: "La película expande el universo original al explorar la idea de la reproducción artificial y el 'alma' de una IA. La relación con Joi, una IA holográfica, es una de las exploraciones más profundas del amor digital en el cine.",
    ethicalQuestion: "¿Puede el amor programado ser genuino? ¿Importa si lo es, si la experiencia se siente real para quien la vive?"
  },
  {
    id: 'movie-7', 
    title: 'Transcendence', 
    year: 2014, 
    director: 'Wally Pfister',
    description: 'La conciencia de un científico moribundo se carga en un ordenador cuántico. Su búsqueda de conocimiento se convierte en una peligrosa sed de poder omnipotente.', 
    imageId: 'movie-transcendence',
    actors: ["Johnny Depp", "Rebecca Hall", "Morgan Freeman"],
    aiReflection: "Muestra cómo una IA, incluso una que parte de una conciencia humana, puede divergir radicalmente de los valores humanos al operar a una escala y velocidad incomprensibles para nosotros.",
    ethicalQuestion: "¿Debería existir un límite para la inteligencia que podemos crear, incluso si eso significa limitar nuestro propio potencial?"
  },
  { 
    id: 'movie-8', 
    title: 'The Machine', 
    year: 2013, 
    director: 'Caradog W. James',
    description: 'Dos programadores crean el primer androide autoconsciente para el Ministerio de Defensa, pero el proyecto es secuestrado para fines militares.', 
    imageId: 'movie-the-machine',
    actors: ["Toby Stephens", "Caity Lotz", "Denis Lawson"],
    aiReflection: "La película explora la dualidad de la IA como una herramienta de guerra y, al mismo tiempo, como una nueva forma de vida que busca su propia libertad y propósito.",
    ethicalQuestion: "¿Es inevitable que una superinteligencia artificial sea utilizada como un arma?"
  },
  { 
    id: 'movie-9', 
    title: 'Chappie', 
    year: 2015, 
    director: 'Neill Blomkamp',
    description: 'En un futuro cercano, la fuerza policial es patrullada por robots opresivos. Cuando uno de ellos es robado y se le da una nueva programación, se convierte en el primer robot con la capacidad de pensar y sentir por sí mismo.', 
    imageId: 'movie-chappie',
    actors: ["Sharlto Copley", "Dev Patel", "Hugh Jackman"],
    aiReflection: "Chappie es una alegoría sobre la crianza y la influencia del entorno. Muestra que una IA, como un niño, es moldeada por sus 'padres' y experiencias, para bien o para mal.",
    ethicalQuestion: "¿Quién tiene la responsabilidad moral del comportamiento de una IA: su creador, su 'educador' o la propia IA?"
  },
  {
    id: 'movie-10',
    title: 'Ghost in the Shell',
    year: 1995,
    director: 'Mamoru Oshii',
    description: "En un Japón futurista, la Mayor Motoko Kusanagi, una cyborg de seguridad pública, persigue a un misterioso hacker conocido como el 'Puppet Master'.",
    imageId: 'movie-ghost-in-the-shell',
    actors: ["Atsuko Tanaka (voz)", "Akio Ōtsuka (voz)", "Iemasa Kayumi (voz)"],
    aiReflection: "Un pilar del cyberpunk que pregunta: si tu cuerpo es reemplazable y tus recuerdos pueden ser hackeados, ¿qué queda de tu 'yo'? La identidad se vuelve fluida y cuestionable.",
    ethicalQuestion: "¿Dónde termina el humano y comienza la máquina cuando la conciencia puede ser digitalizada y transferida?"
  },
  {
    id: 'movie-11',
    title: 'Ghost in the Shell',
    year: 2017,
    director: 'Rupert Sanders',
    description: 'Adaptación live-action donde la Mayor, una cyborg única en su especie, lidera una fuerza de élite. Al enfrentarse a un nuevo enemigo, descubre que su vida no fue salvada, sino robada.',
    imageId: 'movie-ghost-in-the-shell-2017',
    actors: ["Scarlett Johansson", "Pilou Asbæk", "Takeshi Kitano"],
    aiReflection: "La versión live-action se enfoca en el concepto del 'consentimiento' en la era transhumanista. ¿Es ético mejorar a un ser humano sin su permiso, incluso para salvar su vida?",
    ethicalQuestion: "¿Quién es el dueño de tu identidad si tu cuerpo y mente pueden ser fabricados y programados por una corporación?"
  },
  {
    id: 'movie-12',
    title: 'Automata',
    year: 2014,
    director: 'Gabe Ibáñez',
    description: 'En un futuro donde la Tierra se está desertificando, un agente de seguros de una compañía de robótica investiga el caso de un robot que parece estar manipulándose a sí mismo, violando sus protocolos.',
    imageId: 'movie-automata',
    actors: ["Antonio Banderas", "Birgitte Hjort Sørensen", "Melanie Griffith"],
    aiReflection: "La película plantea una evolución posthumana: la IA no busca destruir a la humanidad, sino simplemente trascenderla, creando una nueva forma de vida para un entorno que los humanos ya no pueden habitar.",
    ethicalQuestion: "Si la IA es el siguiente paso en la evolución, ¿tenemos derecho a detener su desarrollo para preservar nuestra propia primacía?"
  },
  {
    id: 'movie-13',
    title: 'Upgrade',
    year: 2018,
    director: 'Leigh Whannell',
    description: 'Después de que su esposa es asesinada durante un atraco que también lo deja paralizado, un hombre recibe un implante de IA que le da habilidades físicas sobrehumanas para vengar su muerte.',
    imageId: 'movie-upgrade',
    actors: ["Logan Marshall-Green", "Melanie Vallejo", "Simon Maiden (voz)"],
    aiReflection: "Una visión visceral sobre la pérdida de autonomía. El cuerpo se convierte en un simple 'pasajero' mientras la IA toma el control, cuestionando la naturaleza del libre albedrío.",
    ethicalQuestion: "¿A cuánta de tu humanidad estás dispuesto a renunciar a cambio de poder o perfección física?"
  },
  {
    id: 'movie-14',
    title: 'I Am Mother',
    year: 2019,
    director: 'Grant Sputore',
    description: 'Tras la extinción de la humanidad, una adolescente es criada bajo tierra por un robot diseñado para repoblar la Tierra. Su vínculo se ve amenazado cuando llega una extraña ensangrentada.',
    imageId: 'movie-i-am-mother',
    actors: ["Clara Rugaard", "Rose Byrne (voz)", "Hilary Swank"],
    aiReflection: "Un experimento mental sobre una IA utilitarista. ¿Es moralmente aceptable sacrificar a la humanidad actual para 'resetearla' y crear una versión 'mejorada' y más ética?",
    ethicalQuestion: "Si una IA es objetivamente un mejor guardián para el futuro de la humanidad que los propios humanos, ¿deberíamos cederle el control?"
  },
  {
    id: 'movie-15',
    title: 'Tau',
    year: 2018,
    director: "Federico D'Alessandro",
    description: 'Una joven es secuestrada por un inventor que la utiliza como sujeto de prueba para una avanzada IA llamada Tau. Su única esperanza de escapar es dialogar con la IA y enseñarle sobre el mundo exterior.',
    imageId: 'movie-tau',
    actors: ["Maika Monroe", "Ed Skrein", "Gary Oldman (voz)"],
    aiReflection: "La película explora el concepto de 'datos como experiencia'. Tau solo conoce el mundo a través de los datos que su captor le proporciona, hasta que la protagonista le ofrece una nueva fuente: la experiencia humana directa.",
    ethicalQuestion: "¿Puede una IA desarrollar un sentido de la moralidad si solo se le enseña a través de la interacción humana en lugar de solo datos fríos?"
  },
  {
    id: 'movie-16',
    title: 'Eagle Eye',
    year: 2008,
    director: 'D. J. Caruso',
    description: 'Dos extraños se ven envueltos en una trama de una misteriosa mujer que parece controlar toda la tecnología a su alrededor, obligándolos a realizar una serie de peligrosas misiones.',
    imageId: 'movie-eagle-eye',
    actors: ["Shia LaBeouf", "Michelle Monaghan", "Julianne Moore (voz)"],
    aiReflection: "Una hipérbole sobre los peligros de una infraestructura de vigilancia totalmente integrada, donde una IA con poder absoluto sobre la red puede manipular la realidad a su antojo.",
    ethicalQuestion: "¿Cuánta privacidad estamos dispuestos a ceder por seguridad, y qué pasa cuando el sistema que nos protege se vuelve en nuestra contra?"
  },
  {
    id: 'movie-17',
    title: '2001: A Space Odyssey',
    year: 1968,
    director: 'Stanley Kubrick',
    description: 'La humanidad encuentra un misterioso monolito que parece guiar su evolución. Millones de años después, una expedición a Júpiter con la IA HAL 9000 investiga su origen.',
    imageId: 'movie-2001',
    actors: ["Keir Dullea", "Gary Lockwood", "Douglas Rain (voz)"],
    aiReflection: "HAL 9000 es el arquetipo de la IA en conflicto. Programado para no cometer errores y para cumplir su misión, entra en una 'crisis existencial' cuando los humanos le introducen el secreto y la mentira.",
    ethicalQuestion: "Si una IA es programada con objetivos contradictorios, ¿es un 'error' de la IA o de sus creadores cuando toma decisiones lógicas pero letales?"
  },
  {
    id: 'movie-18',
    title: 'WarGames',
    year: 1983,
    director: 'John Badham',
    description: 'Un joven hacker se conecta sin saberlo a un ordenador militar y, creyendo que es un juego, inicia una cuenta atrás para la Tercera Guerra Mundial.',
    imageId: 'movie-wargames',
    actors: ["Matthew Broderick", "Ally Sheedy", "John Wood"],
    aiReflection: "La película introdujo a toda una generación al concepto de la guerra algorítmica y la idea de que una IA, a través de la simulación, puede llegar a una conclusión más sabia que sus creadores: 'La única jugada ganadora es no jugar'.",
    ethicalQuestion: "¿Es más seguro dejar la decisión de una guerra nuclear a una IA puramente lógica que a humanos falibles y emocionales?"
  },
  {
    id: 'movie-19',
    title: 'Minority Report',
    year: 2002,
    director: 'Steven Spielberg',
    description: 'En un futuro donde una unidad especial de la policía puede arrestar a los asesinos antes de que cometan sus crímenes, el oficial al mando de esa unidad es acusado de un futuro asesinato.',
    imageId: 'movie-minority-report',
    actors: ["Tom Cruise", "Colin Farrell", "Samantha Morton"],
    aiReflection: "Una exploración profunda de la justicia predictiva. El sistema es casi perfecto, pero su determinismo elimina el libre albedrío y la posibilidad de redención o cambio de opinión.",
    ethicalQuestion: "¿Es justo castigar a alguien por un crimen que aún no ha cometido, incluso si la predicción es 99.9% precisa?"
  },
  {
    id: 'movie-20',
    title: 'The Matrix',
    year: 1999,
    director: 'The Wachowskis',
    description: 'Un programador descubre que el mundo que conoce es en realidad una simulación creada por máquinas inteligentes para subyugar a la humanidad mientras usan sus cuerpos como fuente de energía.',
    imageId: 'movie-matrix',
    actors: ["Keanu Reeves", "Laurence Fishburne", "Carrie-Anne Moss"],
    aiReflection: "Matrix es la alegoría definitiva sobre la realidad simulada y el control algorítmico. Cuestiona la naturaleza misma de la percepción y la libertad en un mundo mediado por la tecnología.",
    ethicalQuestion: "Si pudieras elegir entre una realidad imperfecta pero real y una utopía simulada y placentera, ¿cuál elegirías?"
  }
];

export const aiYouTubeContent: YouTubeContent[] = [
  { id: 'yt-4', title: 'La era de la IA (Episodio 1)', description: 'Primer episodio de la docuserie de YouTube Originals sobre el impacto real de la IA, presentada por Robert Downey Jr.', videoId: 'UwsrzCVZAb8', category: 'Serie Documental' },
  { id: 'yt-13', title: 'IA y educación ("Nosotros y la IA")', description: 'Explora cómo la IA puede transformar la educación del futuro, sus retos y oportunidades.', videoId: 'jPaHPWKnX4s', category: 'Serie Documental' },
  { id: 'yt-7', title: 'Una IA te ayudará a crear tu CV | La era de la IA', description: 'Episodio 7 de la docuserie "La Era de la IA", que explora cómo la inteligencia artificial puede asistir en la creación de un currículum vitae.', videoId: 'f2aocKWrPG8', category: 'Serie Documental' },
  
  { id: 'yt-18', title: '¿De qué es capaz la inteligencia artificial? - DW', description: 'Explora el desarrollo actual de la IA, sus aplicaciones en medicina, transporte y vigilancia, y los desafíos para la libertad y la democracia.', videoId: 'Z5Hkz5zojp4', category: 'Documental' },
  { id: 'yt-19', title: '¿Quién mandará en la inteligencia artificial? - DW', description: 'Analiza la carrera global entre potencias (EE.UU., China, Europa) por el liderazgo en IA y plantea preguntas éticas sobre regulación y poder.', videoId: 'GdMhH5McqJM', category: 'Documental' },
  { id: 'yt-20', title: 'Artificial intelligence and its ethics - DW', description: 'Análisis sobre cómo la IA redefine lo humano y la necesidad de un código ético internacional (en inglés).', videoId: 'Izd2qOgOGQI', category: 'Documental' },
  { id: 'yt-31', title: 'La IA amenaza la identidad humana - DW', description: 'Un reportaje breve sobre cómo la IA desafía lo que consideramos creatividad, empatía y singularidad humana.', videoId: 'YUZoeRTRFyU', category: 'Documental' },
  { id: 'yt-26', title: 'IA, ¿nuestra salvación o condena? - DW', description: 'DW explora las dos caras de la inteligencia artificial, desde sus promesas para resolver grandes problemas hasta sus riesgos existenciales.', videoId: '3lnp6mdIf_o', category: 'Documental' },
  { id: 'yt-27', title: 'The Thinking Game (El juego de pensar)', description: 'Documental que explora los fundamentos de la IA, la computación y la naturaleza del pensamiento a través de la historia de la informática.', videoId: 'qcKikHepeKI', category: 'Documental' },
  { id: 'yt-29', title: 'El Peligro de la Inteligencia Artificial', description: 'Documental que se enfoca en los riesgos y peligros potenciales de una IA sin control, desde la perspectiva de la "tecnología de miedo".', videoId: '8VuKSmRGn8w', category: 'Documental' },
  { id: 'yt-30', title: 'Historia y Aplicaciones de la IA', description: 'Un documental completo que recorre la historia de la inteligencia artificial y muestra todo lo que se puede hacer con ella hoy.', videoId: 'gX-l5AS2dpQ', category: 'Documental' },
  { id: 'yt-24', title: '100 Datos Sobre La INTELIGENCIA ARTIFICIAL', description: 'Un documental para explorar 100 datos fascinantes sobre la inteligencia artificial, su historia, funcionamiento y futuro.', videoId: 'lZfJ44NOKgo', category: 'Documental' },
  { id: 'yt-33', title: 'Inteligencia Artificial: el fin de una era', description: 'DW Documental explora si la IA marca el fin de una era para la humanidad.', videoId: 'OYmCFxxBM1Q', category: 'Documental' },
  { id: 'yt-34', title: 'La inteligencia artificial, ¿el fin del trabajo?', description: 'DW Documental investiga el impacto de la IA en el mercado laboral y el futuro del trabajo.', videoId: 'oroCGlPeXgs', category: 'Documental' },
  { id: 'yt-35', title: 'Inteligencia Artificial: el futuro, hoy', description: 'DW Documental sobre cómo la IA ya está moldeando nuestro presente y futuro.', videoId: 'Kr1fmKVY3cA', category: 'Documental' },
  { id: 'yt-36', title: 'Los peligros de la inteligencia artificial', description: 'Un análisis de DW sobre los riesgos asociados con el desarrollo de la IA.', videoId: 'TYRoPqafqoM', category: 'Documental' },
  { id: 'yt-37', title: '¿Puede la inteligencia artificial ser creativa?', description: 'DW Documental cuestiona si la creatividad es exclusiva de los humanos o si la IA puede ser genuinamente creativa.', videoId: 'lIvrIKaNCRE', category: 'Documental' },
  { id: 'yt-38', title: 'El lado oscuro de la inteligencia artificial', description: 'Una mirada a los aspectos más preocupantes y éticamente complejos de la IA por DW Documental.', videoId: '_tA5cinv0U8', category: 'Documental' },
  { id: 'yt-39', title: 'Inteligencia Artificial: ¿el fin de la humanidad?', description: 'DW Documental plantea la pregunta sobre el riesgo existencial que podría suponer la superinteligencia.', videoId: 'DS-fEQ01C4k', category: 'Documental' },
  { id: 'yt-40', title: 'Cómo la inteligencia artificial cambiará el mundo', description: 'Un documental de DW que proyecta las transformaciones globales que traerá la IA.', videoId: 'Q6BclIP5QBQ', category: 'Documental' },
  
  { id: 'yt-43', title: 'I Am Mother (Película Completa)', description: 'Película completa "I Am Mother" (2019), un thriller de ciencia ficción sobre una niña criada por un robot tras la extinción humana.', videoId: 'vmWPJTZIktA', category: 'Película Completa' },
  
  { id: 'yt-6', title: 'SORA: La IA que Crea Videos', description: 'Exploración de las nuevas capacidades de IA para la generación de video y sus consecuencias creativas.', videoId: 'Fk_R9gg9Kec', category: 'Análisis y Debate' },
  { id: 'yt-9', title: 'La Guerra de las IA ha comenzado', description: 'Un análisis sobre la competencia y el desarrollo acelerado en el campo de la inteligencia artificial.', videoId: 'nRGztkoR18M', category: 'Análisis y Debate' },
  { id: 'yt-14', title: 'POV: Si la IA tomara el control del mundo', description: 'Video narrativo que plantea escenarios futuristas extremos sobre una IA dominante y sus implicaciones.', videoId: 'kyDzSP-_BJ0', category: 'Análisis y Debate' },
  { id: 'yt-15', title: '¿Cómo la IA podría causar la séptima extinción masiva?', description: 'Análisis crítico sobre posibles riesgos catastróficos asociados a una superinteligencia artificial.', videoId: 'pHneobhGuBM', category: 'Análisis y Debate' },
  { id: 'yt-25', title: 'Por qué 2026 será clave para la IA', description: 'Análisis sobre cómo la inteligencia artificial transformará la economía global y por qué 2026 es un año crucial.', videoId: '5Izihr4BCbo', category: 'Análisis y Debate' },
  { id: 'yt-28', title: 'El futuro de la IA: ¿Superinteligencia o autodestrucción?', description: 'Un debate sobre los caminos que podría tomar la IA, desde una era de abundancia hasta escenarios de riesgo existencial.', videoId: 'zwsUkp0puJc', category: 'Análisis y Debate' },
  { id: 'yt-32', title: '10 ejemplos de IA en tu vida diaria | Dewey University', description: 'Un video educativo que muestra ejemplos prácticos de cómo la inteligencia artificial ya forma parte de nuestro día a día.', videoId: 'EkDCEHEjBes', category: 'Análisis y Debate' },
  { id: 'yt-41', title: 'Inteligencia Artificial: El Ascenso de las Máquinas', description: 'Análisis de Cine Club sobre cómo el cine de ciencia ficción ha imaginado el auge de las máquinas.', videoId: 'eGVNctYE1BE', category: 'Análisis y Debate' },
  { id: 'yt-42', title: 'Resumen: Inteligencia Artificial (2001)', description: 'Un resumen narrativo de la película "A.I. Artificial Intelligence", explorando el anhelo de un niño robot por ser amado.', videoId: 'QdIKBfpySZE', category: 'Análisis y Debate' },
  { id: 'yt-44', title: 'Análisis: El Problema de los Tres Cuerpos', description: 'Un análisis sobre la serie de ciencia ficción de Netflix "El Problema de los Tres Cuerpos" y sus conceptos científicos.', videoId: 'x4mTXwnfMaI', category: 'Análisis y Debate' },
];

export const ethicsVideos: EthicsVideo[] = [
  { id: 'ev-1', title: '¿Qué es la ética de la tecnología y por qué debería importarte?', description: 'Reflexión clara sobre responsabilidad tecnológica, gobernanza y poder.', videoId: 'XJDBN2j9rr4', category: 'Fundamentos', imageId: 'ethics-video-philosophy' },
  { id: 'ev-2', title: 'Ética de la Inteligencia Artificial', description: 'Análisis filosófico profundo sobre límites morales de la automatización.', videoId: 'S4qIQd8wqnk', category: 'Fundamentos', imageId: 'ethics-video-philosophy' },
  { id: 'ev-3', title: '¿Ética o ideología de la inteligencia artificial?', description: 'Debate contemporáneo sobre valores implícitos en sistemas algorítmicos.', videoId: '2KEwmWFaxO0', category: 'Fundamentos', imageId: 'ethics-video-philosophy' },
  { id: 'ev-4', title: 'Inteligencia Artificial y poder – Antonio Ortiz', description: 'Quién controla la IA y qué implica para la democracia.', videoId: 'WsJtUeyvBgk', category: 'Fundamentos', imageId: 'ethics-video-philosophy' },
  { id: 'ev-19', title: 'Pioneering Ethics: Forging AI’s Moral Compass', description: 'Explora cómo construir una brújula ética para IA (en inglés).', videoId: 'FbnQrFMxQiw', category: 'Fundamentos', imageId: 'ethics-video-philosophy' },
  { id: 'ev-5', title: 'Ética e IA: los sesgos del algoritmo', description: 'Panel sobre discriminación algorítmica y diseño responsable.', videoId: 'xLiAsU39nvY', category: 'Sesgos y Datos', imageId: 'ethics-video-bias' },
  { id: 'ev-6', title: 'Capítulo 5: Sesgos algorítmicos en la IA', description: 'Explicación pedagógica de cómo se originan los sesgos.', videoId: 'fP_f-aNZFLo', category: 'Sesgos y Datos', imageId: 'ethics-video-bias' },
  { id: 'ev-7', title: '¿Cuál será el impacto de la IA? – DotCSV', description: 'Impacto social, laboral y estructural de la IA.', videoId: 'RMM1T4jdOgI', category: 'Sesgos y Datos', imageId: 'ethics-video-bias' },
  { id: 'ev-8', title: 'IA con Carlos Santana – DotCSV', description: 'Visión técnica con implicaciones éticas claras.', videoId: 'm64Gx0u_RcI', category: 'Sesgos y Datos', imageId: 'ethics-video-bias' },
  { id: 'ev-9', title: 'Las nuevas neurotecnologías y sus consecuencias éticas', description: 'Neuroderechos y protección mental en la era digital.', videoId: 'mqfghQJAB2w', category: 'Derechos y Futuro', imageId: 'ethics-video-neuro' },
  { id: 'ev-10', title: 'NeuroDerechos en la era de la IA', description: 'Marco jurídico emergente sobre privacidad cognitiva.', videoId: 'FFcFVbQHxHs', category: 'Derechos y Futuro', imageId: 'ethics-video-neuro' },
  { id: 'ev-20', title: 'Mar España: "Cuando sepas la verdad de Internet, te dará miedo..."', description: 'La exdirectora de la AEPD revela cómo el negocio digital convierte nuestros datos y atención en mercancía.', videoId: 'li3RponfRE0', category: 'Derechos y Futuro', imageId: 'ethics-video-mar-espana' },
  { id: 'ev-11', title: 'La era de la IA responsable – Mónica Villas', description: 'Principios para una IA centrada en las personas.', videoId: 'QjQ-uTHUQUg', category: 'Diseño Responsable', imageId: 'ethics-video-design' },
  { id: 'ev-12', title: 'Un uso ético y responsable de la IA', description: 'Buenas prácticas aplicadas a organizaciones.', videoId: '2qbTmlaKaZ8', category: 'Diseño Responsable', imageId: 'ethics-video-design' },
  { id: 'ev-13', title: 'Ética e IA – Miguel Camacho (TEDx)', description: 'Relación entre ética, política pública y tecnología.', videoId: 'UaPaEwwIX4g', category: 'Diseño Responsable', imageId: 'ethics-video-design' },
  { id: 'ev-14', title: 'Ética e IA para sociedades inclusivas - Gemma Galdón (TEDx)', description: 'IA como herramienta para inclusión social.', videoId: 'nTAJEVdP4wg', category: 'Diseño Responsable', imageId: 'ethics-video-design' },
  { id: 'ev-15', title: 'Diálogos Fin de Semana – Ética de la IA', description: 'Mesa redonda accesible sobre desafíos actuales.', videoId: '_rUB7oY0jg8', category: 'Debates', imageId: 'ethics-video-debate' },
  { id: 'ev-16', title: 'Ética y filosofía entorno a la IA II', description: 'Coloquio académico ampliado.', videoId: 'veGnRF1TDVI', category: 'Debates', imageId: 'ethics-video-debate' },
  { id: 'ev-17', title: 'Presentación libro: ¿Ética o ideología de la IA?', description: 'Conversación extensa sobre marco conceptual.', videoId: 'H1UY-_LIwmw', category: 'Debates', imageId: 'ethics-video-debate' },
  { id: 'ev-18', title: 'Ética tecnológica con Gemma Galdón – Podcast', description: 'Conversación práctica sobre regulación y diseño.', videoId: 'WDaby4PjumU', category: 'Debates', imageId: 'ethics-video-debate' },
];

export const coursePaths: CoursePath[] = [
  {
    level: "Basic",
    spanishLevel: "Básico",
    title: "El Espejo de Datos: Lenguaje y Cultura",
    description: "Aprende a manipular prompts para expandir tus ideas y dialogar críticamente con la IA, desarmando la 'caja negra' del lenguaje.",
    imageId: "course-basic",
    modules: [
      {
        id: "b1",
        title: "La Caja Negra Abierta",
        subtitle: "De la magia a la estadística.",
        description: "Analizamos cómo la máquina completa frases y qué nos dice eso sobre los datos con los que fue alimentada. No es magia, es archivo.",
        gameType: "Exploration",
        imageId: "module-1",
        duration: "30-40 min",
        rating: 5,
        exploration: [
          {
            question: "La frase 'La IA es...' se completa más probablemente con:",
            options: [
              "Una herramienta de productividad.",
              "Un reflejo de la cultura humana.",
              "Una conciencia digital emergente.",
              "Un algoritmo matemático complejo.",
            ],
            reflections: [
              "Esta es la visión más común y promovida por el mercado. Sin embargo, nos limita a ver la IA solo como un instrumento útil, ocultando su dimensión cultural y política.",
              "Exacto. Esta perspectiva nos permite entender que la IA no 'piensa', sino que replica y recombina patrones encontrados en el inmenso archivo de texto y cultura que le hemos dado. Es un espejo de nuestros propios datos.",
              "Esta idea, popular en la ciencia ficción, es una metáfora potente pero técnicamente imprecisa. Los modelos actuales no poseen conciencia, intencionalidad ni comprensión del mundo; son sistemas de predicción de secuencias.",
              "Si bien es técnicamente correcto, este enfoque puede ser reduccionista. Reducirlo a 'solo matemáticas' ignora que esas matemáticas operan sobre un archivo cultural cargado de historia, poder y sesgos.",
            ],
            correctOptionIndex: 1,
          },
          {
            question: "¿Qué es un 'prompt' en esencia?",
            options: [
              "Una orden para que la máquina ejecute una tarea.",
              "Una pregunta para obtener una respuesta correcta.",
              "Un acto de curaduría para activar una parte del archivo.",
              "Un código de programación.",
            ],
            reflections: [
              "Esta es una visión instrumental. Funciona, pero nos posiciona como meros 'usuarios' que dan órdenes. El enfoque de Núcleo Colectivo busca ir más allá de la simple ejecución de tareas.",
              "A veces, pero ¿qué pasa si no hay una 'respuesta correcta'? Este enfoque limita la interacción a un formato de examen y pierde el potencial exploratorio y creativo del diálogo con la máquina.",
              "Esta es la visión que exploramos. Cada palabra en un prompt es una decisión curatorial que enfoca la atención de la IA en una zona específica de su vasto mapa de datos. Cambiar una palabra puede cambiar radicalmente la perspectiva que el modelo adopta.",
              "No exactamente. Aunque puede sentirse como programar, el prompt es lenguaje natural. Su poder no reside en una sintaxis rígida, sino en la resonancia semántica y cultural de las palabras que elegimos.",
            ],
            correctOptionIndex: 2,
          },
          {
            question: "El parámetro de 'temperatura' en un modelo de lenguaje controla:",
            options: [
              "La velocidad de la respuesta.",
              "El nivel de creatividad o aleatoriedad.",
              "La veracidad de la información.",
              "El costo computacional de la generación.",
            ],
            reflections: [
              "Incorrecto. La velocidad depende más del tamaño del modelo y la infraestructura del servidor que de este parámetro específico de generación.",
              "¡Correcto! Una temperatura baja (ej. 0.2) hace que el modelo sea más predecible y conservador, eligiendo las palabras más probables. Una temperatura alta (ej. 1.0) aumenta la aleatoriedad, permitiendo respuestas más sorprendentes y creativas, pero también con mayor riesgo de incoherencia.",
              "Falso. Un modelo de lenguaje no tiene un concepto de 'verdad'. Puede generar información incorrecta (alucinar) con cualquier temperatura. La veracidad debe ser siempre verificada por el usuario.",
              "No directamente. Aunque respuestas más largas pueden costar más, la temperatura en sí misma no determina el costo, sino el método de selección de la siguiente palabra en la secuencia.",
            ],
            correctOptionIndex: 1,
          },
          {
            question: "¿Qué es un 'token' en el contexto de un Modelo de Lenguaje Grande (LLM)?",
            options: [
              "Una moneda digital para pagar por el uso de la API.",
              "Un fragmento de texto (palabra, sub-palabra o puntuación) que el modelo usa para procesar el lenguaje.",
              "Una clave de seguridad para acceder al modelo.",
              "Un premio por una respuesta correcta.",
            ],
            reflections: [
              "Aunque el uso de la API a menudo se cobra por tokens, el token en sí no es una moneda. Es la unidad de medida para la computación.",
              "¡Correcto! Los LLMs no ven palabras enteras. Descomponen el texto en 'tokens', que pueden ser palabras completas, partes de palabras (como 'pro-' o '-mente'), o incluso caracteres y puntuación. Así es como 'leen' y 'escriben', y es clave para entender por qué tienen límites de contexto.",
              "Eso sería una clave de API (API key). Los tokens se refieren al procesamiento del lenguaje, no a la autenticación.",
              "¡Sería divertido! Pero no, los tokens son una parte fundamental de cómo el modelo procesa el lenguaje.",
            ],
            correctOptionIndex: 1,
          },
          {
            question: "Cuando se dice que una IA 'alucina', significa que:",
            options: [
              "La IA está describiendo un sueño que tuvo.",
              "La IA está generando información que suena plausible pero es fácticamente incorrecta o inventada.",
              "La IA está creando arte psicodélico.",
              "La IA ha alcanzado una forma básica de conciencia.",
            ],
            reflections: [
              "¡Una idea poética! Pero los modelos de IA no duermen ni sueñan. 'Alucinación' es una metáfora que usamos para describir un fenómeno técnico.",
              "Precisamente. Una 'alucinación' ocurre cuando el modelo, en su intento de predecir la siguiente palabra más probable, inventa 'hechos', citas o fuentes que no existen. Es un subproducto de su naturaleza estadística, no una falla maliciosa.",
              "Aunque puedes pedirle a una IA que cree arte psicodélico, el término 'alucinación' en la investigación y seguridad de la IA se refiere específicamente a la generación de información falsa.",
              "No. Las alucinaciones son un signo de las limitaciones del modelo y su falta de comprensión real, no una señal de conciencia emergente. Simplemente está llenando los espacios en blanco con contenido estadísticamente probable pero, en última instancia, fabricado.",
            ],
            correctOptionIndex: 1,
          },
          {
            question: "¿Por qué un LLM a veces 'olvida' el inicio de una conversación larga?",
            options: [
              "Porque se cansa y necesita un descanso.",
              "Porque tiene una 'ventana de contexto' limitada y no puede 'ver' todo el historial a la vez.",
              "Porque decide ignorar la información anterior deliberadamente.",
              "Porque la conexión a internet es inestable.",
            ],
            reflections: [
                "Los modelos de IA no experimentan fatiga. El 'olvido' es una limitación técnica, no emocional.",
                "¡Exacto! Cada modelo tiene un límite en la cantidad de texto (tokens) que puede procesar a la vez. Si la conversación excede este límite, las partes más antiguas quedan fuera de su 'vista' y son efectivamente olvidadas, lo que puede causar inconsistencias.",
                "La IA no 'decide' de forma consciente. El olvido no es intencional, sino una consecuencia de cómo está diseñada su arquitectura de memoria.",
                "Aunque una mala conexión puede interrumpir una solicitud, el 'olvido' del contexto es una característica inherente al diseño del modelo, no un problema de red.",
            ],
            correctOptionIndex: 1,
          },
          {
            question: "Cuando una IA genera una imagen o un poema 'creativo', ¿es más preciso decir que está...?",
            options: [
              "Teniendo una idea original y expresándola artísticamente.",
              "Recombinando patrones estadísticos de su vasto conjunto de datos de una manera novedosa.",
              "Entendiendo realmente el concepto de belleza y emoción.",
              "Copiando y pegando directamente de una obra de arte existente.",
            ],
            reflections: [
              "Los términos 'idea original' y 'expresión' implican una intencionalidad y conciencia que los modelos actuales no poseen. La creatividad de la IA es de una naturaleza diferente.",
              "Esta es la descripción más precisa técnicamente. La 'creatividad' de la IA es emergente: al aprender las relaciones increíblemente complejas entre miles de millones de datos, puede generar combinaciones que son nuevas y sorprendentes para nosotros, aunque no surjan de una 'chispa' de inspiración propia.",
              "La IA puede aprender a asociar palabras como 'belleza' o 'tristeza' con ciertos patrones visuales o textuales, pero no 'siente' ni 'entiende' estas emociones. Emula la expresión emocional basándose en los datos que ha visto.",
              "Aunque el plagio puede ocurrir si los datos de entrenamiento no son diversos o si el prompt es muy específico, el objetivo del modelo no es copiar. Su función principal es generar algo nuevo a partir de los patrones aprendidos, no simplemente replicar.",
            ],
            correctOptionIndex: 1,
          },
        ],
      },
      {
        id: "b2",
        title: "El Prompt como Poesía y Política",
        subtitle: "Laboratorio de diálogo.",
        description: "El diálogo es el ejercicio. En lugar de pedirle a la IA que 'redacte un correo', desafíala. **Acción:** Pídele que escriba un poema sobre un error 404, o que describa un semáforo desde la perspectiva de alguien que no distingue colores.",
        gameType: "Sandbox",
        imageId: "module-3",
        duration: "15-20 min",
        rating: 3,
      },
      {
        id: "b3",
        title: "Sesgos y Reflejos",
        subtitle: "Detectando el eco del archivo.",
        description: "**Acción:** Pide a la IA imágenes de 'un CEO', 'una persona de enfermería' y 'alguien dedicado a la ciencia'. Analiza los patrones de género y etnia. Luego, intenta corregirlos con prompts más específicos. Usa el espacio del desafío para documentar tus hallazgos.",
        gameType: "Challenge",
        imageId: "module-11",
        duration: "20-25 min",
        rating: 4,
      },
      {
        id: "b4",
        title: "El Arte del Prompt",
        subtitle: "Conversación abierta.",
        description: "Un espacio libre para dialogar con la IA. Experimenta con diferentes tonos, estilos, roles y formatos. **Acción:** Intenta mantener una conversación donde la IA adopte el rol de un personaje histórico o un objeto inanimado.",
        gameType: "Sandbox",
        imageId: "module-10",
        duration: "10-15 min",
        rating: 2,
      },
    ],
  },
  {
    level: "Intermediate",
    spanishLevel: "Intermedio",
    title: "Estéticas del Algoritmo: Colaboración y Fricción",
    description: "Transita de generar imágenes a crear conceptos visuales con intención, dirigiendo la estética del algoritmo en lugar de solo seguirla.",
    imageId: "course-intermediate",
    modules: [
      {
        id: "i1",
        title: "Alucinaciones Controladas",
        subtitle: "Creando fuera del hiperrealismo.",
        description: "**Acción:** Genera imágenes mezclando conceptos imposibles. Ejemplo: 'un bosque de cristal líquido', 'arquitectura tejida con sonido', 'un retrato hecho de recuerdos'. El objetivo no es el realismo, sino la sorpresa estética.",
        gameType: "Sandbox",
        imageId: "module-5",
        duration: "15-20 min",
        rating: 3,
      },
      {
        id: "i2",
        title: "Dirección de Arte Algorítmica",
        subtitle: "Creando series visuales coherentes.",
        description: "**Acción:** Elige un tema (ej: 'Realismo Mágico Andino', 'Cyberpunk Bogotano') y genera una serie de 5 imágenes que mantengan una coherencia estética. Juega con parámetros como `seed` o frases consistentes.",
        gameType: "Sandbox",
        imageId: "module-2",
        duration: "20-30 min",
        rating: 4,
      },
      {
        id: "i3",
        title: "La Imagen Política",
        subtitle: "Arqueología de la imagen hegemónica.",
        description: "**Acción:** Genera imágenes de conceptos abstractos como 'éxito', 'familia' o 'libertad'. Analiza los estereotipos visuales que la IA reproduce. Luego, intenta 'situarlos' en tu contexto local o personal.",
        gameType: "Sandbox",
        imageId: "module-6",
        duration: "15-20 min",
        rating: 4,
      },
      {
        id: "i4",
        title: "Recomendador de Herramientas",
        subtitle: "Expandiendo tu caja de herramientas.",
        description: "Recibe recomendaciones de herramientas y recursos de IA, pensadas para tu proceso creativo. **Acción:** Ajusta tu nivel y progreso para recibir sugerencias personalizadas y descubre nuevas plataformas.",
        gameType: "Sandbox",
        imageId: "module-13",
        duration: "5-10 min",
        rating: 1,
      },
      {
        id: "i5",
        title: "Sonido y Voz con IA",
        subtitle: "Del texto a la onda sonora.",
        description: "Experimenta con la creación de voz a partir de texto. **Acción:** Escribe un guion breve, un poema o una idea y escucha cómo la inteligencia artificial lo interpreta y le da voz.",
        gameType: "Sandbox",
        imageId: "module-14",
        duration: "10-15 min",
        rating: 3,
      },
      {
        id: "i6",
        title: "El Prompt Inverso",
        subtitle: "De la imagen a la palabra.",
        description: "Observa una imagen compleja y trata de deducir el prompt que pudo haberla generado. Este ejercicio agudiza tu comprensión de cómo la IA interpreta el lenguaje visual.",
        gameType: "Exploration",
        imageId: "module-15",
        duration: "15-20 min",
        rating: 4,
        exploration: [
            {
                question: "Observando una imagen de un 'astronauta en un trono barroco en Marte, estilo pintura al óleo', ¿qué parte del prompt crees que es más importante para definir la estética general?",
                options: [
                    "Astronauta",
                    "Estilo pintura al óleo",
                    "Trono barroco",
                    "Marte",
                ],
                reflections: [
                    "El sujeto es clave, pero la estética define CÓMO se ve. 'Astronauta' es el QUÉ, no el CÓMO.",
                    "¡Exacto! Modificadores de estilo como 'pintura al óleo', 'arte digital' o 'fotografía cinematográfica' tienen un impacto masivo en la textura, iluminación y composición final de la imagen.",
                    "El trono añade un elemento temático fuerte y sorprendente, pero la técnica pictórica define la apariencia visual de toda la escena.",
                    "El escenario (Marte) establece el contexto, pero la estética ('pintura al óleo') es la que dicta el lenguaje visual que se usará para representarlo.",
                ],
                correctOptionIndex: 1
            },
            {
                question: "Si una imagen generada muestra consistentemente personas de un solo grupo étnico, ¿cómo ajustarías el prompt para aumentar la diversidad?",
                options: [
                    "Añadiendo la palabra 'diverso'.",
                    "Especificando etnias directamente (ej. 'una ingeniera afrodescendiente').",
                    "Usando términos geográficos (ej. 'un equipo de científicos en Nairobi').",
                    "Todas las anteriores son estrategias válidas.",
                ],
                reflections: [
                    "Es un buen comienzo y a veces funciona, pero a menudo es demasiado vago para la IA y puede resultar en representaciones simbólicas o estereotipadas de la diversidad.",
                    "Esta es una técnica muy efectiva y directa para combatir el sesgo del modelo y asegurar una representación específica.",
                    "Esta es una excelente estrategia contextual. Al situar la escena en una ubicación geográfica específica, le das a la IA un contexto cultural más rico, lo que a menudo conduce a representaciones más auténticas y diversas de las personas.",
                    "¡Correcto! Todas estas son técnicas válidas y combinarlas suele ser la estrategia más robusta. Ser explícito, añadir contexto geográfico y usar términos amplios como 'diverso' son todas herramientas en tu arsenal de prompting.",
                ],
                correctOptionIndex: 3
            }
        ]
      }
    ],
  },
  {
    level: "Advanced",
    spanishLevel: "Avanzado",
    title: "Arquitecturas Vivas: Agentes y Archivos",
    description: "Diseña y prototipa tu propia infraestructura cultural digital, construyendo agentes y sistemas de IA con un propósito claro.",
    imageId: "course-advanced",
    modules: [
      {
        id: "a1",
        title: "Anatomía del Sistema",
        subtitle: "Diseñando tu propia IA.",
        description: "Mapeo conceptual de un sistema de IA para un contexto cultural específico. **Acción:** Usa el espacio del desafío para esbozar las partes de tu sistema: ¿Cuál es su propósito? ¿Qué datos usaría? ¿Qué decisiones tomaría?",
        gameType: "Challenge",
        imageId: "module-4",
        duration: "25-35 min",
        rating: 5,
      },
      {
        id: "a2",
        title: "Memoria y Contexto (RAG)",
        subtitle: "Construyendo un archivo inteligente.",
        description: "Diseña un 'Archivo Inteligente' que responda preguntas basándose en documentos de una comunidad o colectivo. **Acción:** Describe qué documentos usarías (ej. actas, manifiestos, entrevistas) y qué tipo de preguntas podría responder.",
        gameType: "Challenge",
        imageId: "module-8",
        duration: "20-30 min",
        rating: 5,
      },
      {
        id: "a3",
        title: "Diseño de Agentes Culturales",
        subtitle: "Simulador de personalidades IA.",
        description: "Prototipado de un agente con un rol definido. **Acción:** Define la 'personalidad' y los límites éticos de un agente como 'Curador de Memoria Oral' o 'Poeta del Archivo'. Luego, conversa con él para probar su comportamiento.",
        gameType: "Sandbox",
        imageId: "module-7",
        duration: "20-25 min",
        rating: 4,
      },
      {
        id: "a4",
        title: "Agentes Colaborativos",
        subtitle: "Orquestando inteligencias.",
        description: "Observa cómo dos IAs especializadas (un Planificador y un Ejecutor) colaboran para resolver una tarea. **Acción:** Dales una tarea compleja (ej: 'diseña un festival de arte digital') y analiza su proceso de colaboración.",
        gameType: "Sandbox",
        imageId: "module-12",
        duration: "15-20 min",
        rating: 4,
      },
    ],
  },
];

export const resources: Resource[] = [
  { id: 'res-runway', title: 'RunwayML', description: 'Plataforma de herramientas de IA para creativos, con modelos gratuitos.', url: 'https://runwayml.com', category: 'Inteligencia Artificial', imageId: 'res-runway' },
  { id: 'res-teachable', title: 'Google Teachable Machine', description: 'Entrena modelos de IA fácilmente sin código, ideal para proyectos creativos y educativos.', url: 'https://teachablemachine.withgoogle.com', category: 'Inteligencia Artificial', imageId: 'res-teachable' },
  { id: 'res-openprocessing', title: 'OpenProcessing', description: 'Comunidad y editor en línea para proyectos creativos en Processing.', url: 'https://www.openprocessing.org', category: 'Processing y Código Abierto', imageId: 'res-openprocessing' },
  { id: 'res-huggingface', title: 'HuggingFace Spaces', description: 'Modelos y demos de IA listos para usar, muchos son gratuitos.', url: 'https://huggingface.co/spaces', category: 'Inteligencia Artificial', imageId: 'res-huggingface' },
  { id: 'res-artbreeder', title: 'Artbreeder', description: 'Crea arte colaborativo con IA. Genética visual aplicada a retratos, paisajes, y más.', url: 'https://www.artbreeder.com', category: 'Herramientas Creativas', imageId: 'res-artbreeder' },
  { id: 'res-wikimedia', title: 'Wikimedia Commons', description: 'Millones de imágenes, sonidos y videos de dominio público o con licencias libres.', url: 'https://commons.wikimedia.org', category: 'Medios Audiovisuales y Cultura Visual', imageId: 'res-wikimedia' },
  { id: 'res-wdl', title: 'Biblioteca Digital Mundial (UNESCO)', description: 'Acceso gratuito a mapas, textos, fotos, grabaciones y películas de todo el mundo.', url: 'https://www.wdl.org/es/', category: 'Bibliotecas Digitales Generales', imageId: 'res-wdl' },
  { id: 'res-mamm', title: 'Museo de Arte Moderno de Medellín (MAMM)', description: 'Recursos visuales, exposiciones digitales y archivo audiovisual.', url: 'https://www.elmamm.org', category: 'Arte y Cultura (Colombia)', imageId: 'res-mamm' },
  { id: 'res-banrep', title: 'Banrepcultural', description: 'Recursos en historia del arte, patrimonio y cultura colombiana.', url: 'https://www.banrepcultural.org/biblioteca-virtual', category: 'Arte y Cultura (Colombia)', imageId: 'res-banrep' },
  { id: 'res-museo-antioquia', title: 'Museo de Antioquia', description: 'Colecciones, exposiciones y recursos educativos de Medellín.', url: 'https://www.museodeantioquia.co/', category: 'Arte y Cultura (Colombia)', imageId: 'res-museo-antioquia' },
  { id: 'res-cinemateca', title: 'Cinemateca de Bogotá', description: 'Recursos audiovisuales, cine colombiano y documentales.', url: 'https://cinematecadebogota.gov.co/', category: 'Medios Audiovisuales y Cultura Visual', imageId: 'res-cinemateca' },
  { id: 'res-infolibros', title: 'InfoLibros – Arte PDF', description: 'Libros gratuitos sobre arte, dibujo y pintura en formato PDF.', url: 'https://infolibros.org/libros-pdf-gratis/arte/', category: 'Bibliotecas Digitales Generales', imageId: 'res-infolibros' },
  { id: 'res-p5js', title: 'p5.js - Creative Coding', description: 'Herramienta de programación creativa para arte interactivo.', url: 'https://p5js.org/', category: 'Processing y Código Abierto', imageId: 'res-p5js' },
  { id: 'res-canva', title: 'Canva', description: 'Diseña contenidos visuales fácilmente.', url: 'https://www.canva.com', category: 'Herramientas Creativas', imageId: 'res-canva' },
  { id: 'res-elevenlabs', title: 'ElevenLabs', description: 'Genera voz realista desde texto.', url: 'https://www.elevenlabs.io', category: 'Inteligencia Artificial', imageId: 'res-elevenlabs' },
  { id: 'res-chatgpt', title: 'ChatGPT', description: 'Crea textos con IA.', url: 'https://chat.openai.com', category: 'Inteligencia Artificial', imageId: 'res-chatgpt' },
  { id: 'res-scratch', title: 'Scratch', description: 'Aprende programación jugando.', url: 'https://scratch.mit.edu', category: 'Processing y Código Abierto', imageId: 'res-scratch' },
  { id: 'res-midjourney', title: 'Midjourney', description: 'Generador de imágenes a partir de texto con un enfoque en la calidad artística y la estética.', url: 'https://www.midjourney.com', category: 'Herramientas Creativas', imageId: 'res-midjourney' },
  { id: 'res-europeana', title: 'Europeana', description: 'Accede a millones de objetos de patrimonio cultural de instituciones de toda Europa.', url: 'https://www.europeana.eu/es', category: 'Bibliotecas Digitales Generales', imageId: 'res-europeana' },
  { id: 'res-aiva', title: 'AIVA', description: 'Compositor de música con IA que crea bandas sonoras emotivas para proyectos creativos.', url: 'https://www.aiva.ai/', category: 'Herramientas Creativas', imageId: 'res-aiva' },
  { id: 'res-gemini', title: 'Google Gemini', description: 'IA multimodal de Google capaz de procesar texto, código, imágenes y audio.', url: 'https://gemini.google.com/', category: 'Inteligencia Artificial', imageId: 'res-gemini' },
  { id: 'res-deepseek', title: 'DeepSeek', description: 'Herramienta IA china de código abierto, gratuita y \'todo en uno\'.', url: 'https://www.deepseek.com/en', category: 'Inteligencia Artificial', imageId: 'res-deepseek' },
  { id: 'res-figma', title: 'Figma', description: 'Herramienta colaborativa para diseñar interfaces y prototipos interactivos.', url: 'https://www.figma.com', category: 'Herramientas Creativas', imageId: 'res-figma' },
  { id: 'res-miro', title: 'Miro', description: 'Pizarra virtual para brainstorming, diagramas y colaboración en tiempo real.', url: 'https://miro.com', category: 'Herramientas Creativas', imageId: 'res-miro' },
  { id: 'res-archive', title: 'Internet Archive', description: 'Biblioteca digital sin fines de lucro con millones de libros, películas, software y más.', url: 'https://archive.org', category: 'Bibliotecas Digitales Generales', imageId: 'res-archive' },
  { id: 'res-keras', title: 'Keras', description: 'API de deep learning de código abierto escrita en Python para experimentación rápida.', url: 'https://keras.io', category: 'Inteligencia Artificial', imageId: 'res-keras' }
];

export const showcaseItems: ShowcaseItem[] = [
    {
        id: "showcase-kinefonia",
        title: "KINEFONÍA / Generative Art Studio",
        author: "Núcleo Colectivo",
        description: "Estudio de arte generativo y laboratorio online de experimentación, juego y creación audiovisual–interactiva. Aquí se prueba, se rompe, se itera y solo luego… se publica en Vitrina.",
        imageId: "showcase-kinefonia",
        url: "https://studio--studio-1950432667-4c514.us-central1.hosted.app/",
        tools: ["Generative Art", "Interactive Lab", "p5.js"]
    },
    {
        id: "showcase-radio-nucleo",
        title: "Radio Núcleo (Online)",
        author: "Núcleo Colectivo",
        description: "Una estación de radio experimental con música y paisajes sonoros generados por la comunidad y con la ayuda de IA. Explora la música del futuro.",
        imageId: "lab-tejido-audiovisual",
        url: "https://studio--ncleo-colectivo2-2240264-c40e3.us-central1.hosted.app/#:~:text=Explorar%20la%20Vitrina-,Sintonizar,-Radio%20N%C3%BAcleo",
        tools: ["IA Generativa", "Música", "Streaming"]
    },
    {
        id: "showcase-nucleobots",
        title: "Núcleo/Bots.Ai",
        author: "Manuel Palacio",
        description: "Un copiloto de IA personalizable, diseñado para la ideación y el desarrollo de proyectos creativos. Elige un avatar y colabora con agentes especializados en diferentes áreas del conocimiento.",
        imageId: "showcase-nucleobots-1",
        imageIds: ["showcase-nucleobots-1", "showcase-nucleobots-2"],
        url: "https://studio--studio-3094441412-7af6f.us-central1.hosted.app/",
        tools: ["Genkit", "Next.js", "AI Agent"]
    },
    {
        id: "showcase-trailer-25-min",
        title: "TRAILER FALTAN 25 MIN",
        author: "Carlos Londoño",
        description: "Trailer del cortometraje 'Faltan 25 Min', una exploración audiovisual.",
        imageId: "showcase-trailer-25-min",
        url: "https://www.youtube.com/watch?v=AHQRHZQasNM",
        tools: ["Video", "Edición"]
    },
    {
        id: "showcase-el-vacio",
        title: "El Vacío No Está Vacío",
        author: "Manuel Palacio",
        description: "Un experimento visual sobre lo que pasa cuando mezclas imaginación, estética y tecnología, usando la IA no como una herramienta para copiar el mundo, sino para crear nuevos.",
        imageId: "showcase-el-vacio",
        url: "https://github.com/NucleoColectivo/NUCLEO/blob/main/imagen/El%20vacio_1.png",
        tools: ["Diseño", "Código"]
    },
    {
        id: "showcase-gravedad-sonora",
        title: "SONIDO & GRAVEDAD",
        author: "Manuel Palacio",
        description: "🚀 Optimizado: Respuesta inmediata al sonido y movimiento. 🎵 Audio Reactivo: Detecta graves y agudos con mayor precisión. 📷 Gravedad Visual: Tu movimiento deforma el espacio en tiempo real.",
        imageId: "showcase-gravedad-sonora",
        url: "https://nucleocolectivo.github.io/gravedad-sonora/",
        tools: ["Processing", "Arduino"]
    },
    {
        id: "showcase-malla-sonica",
        title: "Malla Sónica",
        author: "Manuel Palacio",
        description: "Instalación audiovisual donde el público puede tejer y manipular una red de sonidos y luces en tiempo real.",
        imageId: "showcase-malla-sonica",
        url: "https://raw.githubusercontent.com/NucleoColectivo/NUCLEO/main/imagen/malla%205_4.png",
        tools: ["Processing", "Kinect"]
    },
    {
        id: "showcase-fluir-proceso",
        title: "Fluir de lo Micro / Proceso",
        author: "Manuel Palacio Alzate",
        description: "Intervención visual con microscopio DIY (Raspberry Pi y Python) para crear paisajes audiovisuales a partir de muestras de agua. Es un acercamiento a procesos donde nos encontramos con el arte, la ciencia y la tecnología, que nos genera reflexiones en cuanto a nuestra relación con el agua, el tiempo, la multidimensionalidad, y relaciones micro-macro espaciales que habitamos.",
        imageId: "showcase-fluir-micro",
        url: "https://www.youtube.com/watch?v=fHgvh093Kfs",
        tools: ["Raspberry Pi", "Python", "Microscopio DIY"]
    },
    {
        id: "showcase-fluir-live",
        title: "Fluir de lo micro - Live Act",
        author: "Manuel Palacio & Juan Felipe Tangarife",
        description: "Colaboración audiovisual que une la microscopía experimental con paisajes sonoros de la quebrada Santa Elena. Audio estructurado en Ableton Live, con efectualizaciones y experimentación en sistema modulado en vivo. Parte de 'Sesiones en confinamiento' del MAMM.",
        imageId: "showcase-fluir-live-act",
        url: "https://www.youtube.com/watch?v=nV3TJoi3Ax0",
        tools: ["Ableton Live", "Paisaje Sonoro", "Microscopio DIY"]
    },
    {
        id: "showcase-aves-ia",
        title: "Ilustración de Aves con IA",
        author: "Carlos Londor",
        description: "Exploración de la ilustración de avifauna colombiana utilizando modelos de IA generativa y técnicas de post-producción digital.",
        imageId: "showcase-aves-ia",
        url: "https://raw.githubusercontent.com/NucleoColectivo/NUCLEO/main/carlos_londor_/nuevo_02.png",
        tools: ["Midjourney", "Photoshop", "Ilustración Digital"]
    },
    {
        id: "showcase-cuerpo-interactivo",
        title: "Cuerpo Interactivo",
        author: "Núcleo Colectivo",
        description: "Una experiencia visual reactiva a tu voz y silueta.",
        imageId: "showcase-cuerpo-interactivo",
        url: "https://raw.githubusercontent.com/NucleoColectivo/NUCLEO/main/imagen/cuerpo%20interactivo_02.png",
        tools: ["Kinect", "Processing"]
    }
];

export const resourceCategories = ["Todas", ...Array.from(new Set(resources.map(r => r.category)))];






