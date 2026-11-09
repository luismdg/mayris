// Textos por defecto (editables desde "Modo configuración"). Todo en español, escritos como habla Luis: cariñoso, con listas, sin ser formal.
// Las descripciones de los capítulos son a propósito generales: recuerdos bonitos, sin fechas ni detalles que puedan no coincidir con las fotos.
export const DEFAULT_SITE = {
  to: 'Mayris',
  from: 'Luis',
  eyebrow: 'nuestro segundo aniversario · 9 de noviembre de 2026',
  introLine: 'por muchos años más...',
  introHint: 'toca los pétalos',
  startDate: '2024-03-09',
  anniversaryDate: '2024-11-09',
  prologue: [
    'Nos conocimos de la forma más inesperada, en un lugar no tan adecuado, pero el ideal para que me enamorara de ti desde el primer instante.',
    'Y el primer video que tengo de nosotros es un beso, mi amor.',
    'Hoy cumplimos dos años, y ya van {days} días desde ese primer recuerdo.',
    'Guardé {photos} fotos y {videos} videos porque no quería que se me olvidara ni un solo día contigo, ni los más normales.',
    'Y quiero que recuerdes algo, cada te quiero que te dije, lo dije muy en serio.',
  ],
  likesTitle: 'Todo lo que me encanta de ti',
  likes: [
    'cuando dices que eres Grinch y luego pones música de Navidad', 'bailar en tu cuarto cuando crees que nadie te ve', 'cantar, y que yo cante contigo jaja',
    'The Flash', 'Roblox y Steal a Brainrot', 'tus flores', 'cocinar aunque todavía no sepas cómo', 'The Weeknd y Travis Scott', 'lo inteligente que eres',
    'el rosa y el rojo', 'los Minions', 'los carros', 'las fotos y videos estilo 2000', 'las cartas escritas a mano', 'Snoopy',
  ],
  finaleKicker: 'Feliz segundo aniversario',
  finaleTitle: 'Te amo.',
  letter:
    'Mi amor, Mayris preciosa,\n\nHoy cumplimos dos años y quiero que recuerdes algo, cada te quiero y cada te amo que te he dicho, lo dije muy en serio. No fue costumbre ni por llenar el silencio, siempre fue verdad.\n\nGracias por empujarme a cosas que yo solo jamás habría hecho, los viajes, la compu y hasta cantar jaja. Contigo aprendí que crecer no da miedo cuando se hace de la mano.\n\nPara lo que viene solo te deseo cosas bonitas, vas a aprender muchísimo, vas a crecer, y estoy seguro de que va a ser de lo más importante de tu vida. Disfrútalo al máximo y nunca te quedes con las ganas de nada, aunque te dé pena.\n\nY si algún día te sientes lejos de mí, vuelve aquí, estamos nosotros, riéndonos de lo mismo de siempre.\n\nSiempre tuyo,\nLuis',
}

const LETTER = `Querida Mayris:

Crecimos creyendo que el amor se encontraba como en las películas: sin tropiezos, sin discusiones, perfecto desde el primer minuto. Y mira, contigo me di cuenta de que no es así. Desde el día que nos conocimos todo fue diferente. Me enamoré de la persona más talentosa, inteligente y apasionada del mundo, y eso no fue lo único que hizo nuestra relación tan divertida y tan nuestra. Fue cada risa, cada momento, cada discusión (sí, también esas) y cada vez que nos echamos porras para crecer juntos.

Sé que lo nuestro no se parece a lo de los demás. Pero ¿para qué querer parecernos a los demás si contigo encontré justo la relación que quería? Todavía hay cosas por cambiar, y las vamos a cambiar, pero me encantaría que supieras esto: cada te quiero, cada te amo y cada te extraño no vienen de acordarme de nuestro compromiso. Vienen de acordarme de todo lo que hemos vivido, de las experiencias que nos han hecho todavía más cercanos.

Lo que hemos pasado no es poca cosa. Ya son más de dos años de convivencia diaria, y lo más valioso de todos esos días eres tú. Me encanta verte los ojos, la cara y a toda esa persona valiente, explosiva y arriesgada de la que me enamoré.

Con todo mi cariño,
Luis`

const C = (theme, title, bigWord, letter, extra = {}) => ({ theme, title, bigWord, subtitle: '', letter, ...extra })
export const DEFAULT_CHAPTERS = {
  c01: C('calm', 'Cómo empezó todo', 'HOLA',
    'Nos conocimos de la forma más inesperada, en un lugar no tan adecuado, pero el ideal para que me enamorara de ti desde el primer instante. El primer video que tengo de nosotros es un beso, y ya después, en días de lo más normales, nos fuimos agarrando confianza rapidísimo.',
    { tag: 'Chill', song: 'lloviendo' }),
  c02: C('y2k', 'Las primeras veces', 'AYER',
    'Las primeras veces contigo, todo nuevo, todo bonito, y aun así sentía que ya te conocía de siempre. Cómo me gusta acordarme de esos días, mi amor.',
    { tag: 'Chill' }),
  c03: C('bloom', 'Tus cumpleaños', '16·SEP',
    'Cada cumpleaños tuyo es una excusa más para celebrar a la persona más linda, genuina y divertida del mundo. Me encanta verte feliz, y más si es con flores y con toda la gente que te quiere.',
    { tag: 'Cumpleaños' }),
  c04: C('concert', 'Travis Scott y The Weeknd', 'EN·VIVO',
    'Me encanta verte cantar cada canción como si fuera tuya, con todo, con ganas, sin pena. Entre la música, las luces y tanta gente, mi parte favorita siempre vas a ser tú.',
    { tag: 'Concierto', song: 'goosebumps' }),
  c05: C('garage', 'Nuestras locuras', 'MOTOR',
    'Contigo hasta lo más inesperado se vuelve plan, probar cosas nuevas, reírnos de todo, equivocarnos y volver a intentar. Siempre hay algo nuevo por vivir a tu lado y eso me encanta.',
    { tag: 'Amigos' }),
  c06: C('petals', '9 de noviembre', 'SÍ',
    'Esa fecha cambió todo para mí. Cada 9 de noviembre me acuerdo de lo suertudo que soy de tenerte.',
    { tag: 'Aniversario', song: 'holdon' }),
  c07: C('grinch', 'Navidad según tú', 'NAVIDAD',
    'Dices que eres una Grinch, pero a mí no me engañas, en el fondo la Navidad te encanta, y a mí me encanta verte con esa carita de ilusión.',
    { tag: 'Navidad' }),
  c08: C('valentine', 'Flores y febrero', 'FEBRERO',
    'Las flores siempre me recuerdan a ti, a lo bonita, delicada y fuerte que eres. Y febrero, con todo y el día de los enamorados, es otro buen pretexto para decirte lo mucho que te quiero.',
    { tag: 'San Valentín', song: 'rumores' }),
  c09: C('letter', 'Querida Mayris', 'Cartas', LETTER, { song: 'yellow' }),
  c10: C('arcade', 'Risas y juegos', 'BRAINROT',
    'Nadie me hace reír jugando como tú, y mira que hay mucha gente. Roblox, Steal a Brainrot o lo que sea, contigo hasta perder me divierte.',
    { tag: 'Videojuegos' }),
  c11: C('flash', 'Contigo todo va más rápido', 'FLASH',
    'Sé que The Flash es de tus favoritos y contigo entiendo por qué, piensas y resuelves más rápido que todos, y todavía me jalas contigo. Trabajar contigo es de lo que más disfruto, nos complementamos y nos empujamos a hacer cosas que ni imaginábamos, como los viajes, CS y hasta yo cantando jaja.',
    { tag: 'Hackathon', song: 'nothin' }),
  c12: C('club', 'Cuando cantas y bailas', 'TU·VOZ',
    'Cantas, bailas en tu cuarto cuando crees que nadie te ve, y yo sí te veo y me encanta. Tu voz es de mis cosas favoritas, y ojalá nunca te dé pena usarla.',
    { tag: 'Cantando', song: 'feeling' }),
  c13: C('terminal', 'Mi persona favorita para trabajar', 'EQUIPO',
    'Eres la persona más inteligente que he conocido y aprendo muchísimo de ti. Tú me enseñas, yo te sigo el ritmo, y entre los dos sale algo que ninguno haría solo.',
    { tag: 'Clase' }),
  c14: C('minion', 'Saltando y viajando', 'BELLO',
    'Con un plátano y contigo me basta, y sí, aquí hay minions, no me juzgues. Contigo me río hasta de lo más tonto, personita.',
    { tag: 'Viaje' }),
  c15: C('kitchen', 'Hasta hoy', 'HOY',
    'Te encanta cocinar aunque todavía no sepas cómo, y yo feliz de probar todo lo que hagas. Como sigues de intercambio, más abajo te dejé unas recetas de menos de 30 minutos, para lo que te falta por allá.',
    { tag: 'Cocinando' }),
}
export const FALLBACK_CHAPTER = C('calm', 'Nuevo capítulo', 'CAPÍTULO', '')
