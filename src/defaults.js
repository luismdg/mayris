// Textos por defecto (editables desde "Modo configuración"). Todo en español, con lenguaje sencillo y sincero.
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
    'Todo empezó el 9 de marzo de 2024. Nos conocimos de forma inesperada, en un lugar no tan adecuado, pero el ideal para que me enamorara de ti desde el primer instante. El primer video que tengo de nosotros es un beso.',
    'En los días que siguieron, entre cosas normales y de todos los días, fuimos tomando confianza y yo me fui enamorando de ti, cada día un poco más.',
    'Hoy cumplimos dos años. Aquí guardé {photos} fotos y {videos} videos de lo que hemos vivido, porque no quería olvidar ni un solo día contigo. Y quiero que recuerdes algo: cada te quiero que te dije, lo dije muy en serio.',
  ],
  likesTitle: 'Todo lo que me encanta de ti',
  likes: [
    'tu lado Grinch con corazón navideño', 'bailar en tu cuarto cuando crees que nadie te ve', 'cuando cantamos juntos',
    'The Flash', 'Roblox y Steal a Brainrot', 'tus flores', 'cocinar aunque todavía no sepas cómo', 'The Weeknd y Travis Scott', 'lo inteligente que eres',
    'el rosa y el rojo', 'los Minions', 'los carros', 'las fotos y videos estilo 2000', 'las cartas escritas a mano', 'Snoopy',
  ],
  finaleKicker: 'Feliz segundo aniversario',
  finaleTitle: 'Te amo.',
  letter:
    'Mi amor, Mayris preciosa,\n\nHoy cumplimos dos años y quiero que recuerdes algo: cada te quiero y cada te amo que te he dicho, lo dije muy en serio. No fue costumbre ni una forma de llenar el silencio, siempre fue verdad.\n\nGracias por empujarme a hacer cosas que yo solo nunca habría hecho: los viajes, la computación y hasta cantar. Contigo aprendí que crecer no da miedo cuando se hace de la mano.\n\nPara lo que viene solo te deseo cosas bonitas. Vas a aprender muchísimo, vas a crecer y va a ser de lo más importante de tu vida. Disfrútalo al máximo y nunca te quedes con las ganas de nada, aunque te dé pena.\n\nSi algún día te sientes lejos de mí, vuelve aquí. Estamos nosotros, riéndonos de lo mismo de siempre.\n\nSiempre tuyo,\nLuis',
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
    'Nos conocimos de forma inesperada, en un lugar no tan adecuado, pero el ideal para que me enamorara de ti desde el primer instante. El primer video que tengo de nosotros es un beso. En los días siguientes fuimos tomando confianza y poco a poco me fui enamorando de ti.',
    { tag: 'Chill', song: 'lloviendo' }),
  c02: C('y2k', 'Las primeras veces', 'AYER',
    'Las primeras veces contigo fueron nuevas y muy bonitas, y aun así sentía que ya te conocía. Me gusta mucho acordarme de esos días.',
    { tag: 'Chill' }),
  c03: C('bloom', 'Tus cumpleaños', '16·SEP',
    'Cada cumpleaños tuyo es una razón más para celebrar a la persona más linda, genuina y divertida que conozco. Me encanta verte feliz, rodeada de flores y de la gente que te quiere.',
    { tag: 'Cumpleaños' }),
  c04: C('concert', 'Travis Scott y The Weeknd', 'EN·VIVO',
    'Me encanta verte cantar cada canción como si fuera tuya, con todo y sin pena. Entre la música, las luces y tanta gente, mi parte favorita siempre eres tú.',
    { tag: 'Concierto', song: 'goosebumps' }),
  c05: C('garage', 'Nuestras locuras', 'MOTOR',
    'Contigo hasta lo inesperado se vuelve un buen plan: probar cosas nuevas, reírnos, equivocarnos y volver a intentarlo. Siempre hay algo nuevo por vivir a tu lado.',
    { tag: 'Amigos' }),
  c06: C('petals', '9 de noviembre', 'SÍ',
    'Esa fecha cambió todo para mí. Cada 9 de noviembre recuerdo lo afortunado que soy de tenerte.',
    { tag: 'Aniversario', song: 'yellow' }),
  c07: C('grinch', 'Navidad según tú', 'NAVIDAD',
    'Dices que eres una Grinch, pero en el fondo la Navidad te encanta. Y a mí me encanta verte con esa ilusión.',
    { tag: 'Navidad' }),
  c08: C('valentine', 'Flores y febrero', 'FEBRERO',
    'Las flores siempre me recuerdan a ti, a lo bonita y fuerte que eres. Y febrero, con el día de los enamorados, es otra razón para decirte lo mucho que te quiero.',
    { tag: 'San Valentín', song: 'rumores' }),
  c09: C('letter', 'Querida Mayris', 'Cartas', LETTER, { song: 'holdon' }),
  c10: C('arcade', 'Risas y juegos', 'BRAINROT',
    'Nadie me hace reír jugando como tú. Roblox, Steal a Brainrot o cualquier otro juego, contigo hasta perder se disfruta.',
    { tag: 'Videojuegos' }),
  c11: C('flash', 'Contigo todo va más rápido', 'FLASH',
    'Sé que The Flash es de tus favoritos, y contigo entiendo por qué: piensas y resuelves más rápido que todos, y aun así me llevas contigo. Trabajar contigo es de lo que más disfruto. Nos complementamos y nos empujamos a hacer cosas que no imaginábamos, como los viajes, CS y hasta yo cantando.',
    { tag: 'Hackathon', song: 'nothin' }),
  c12: C('club', 'Cuando cantas y bailas', 'TU·VOZ',
    'Cantas y bailas en tu cuarto cuando crees que nadie te ve, y a mí me encanta verte. Tu voz es una de mis cosas favoritas y ojalá nunca te dé pena usarla.',
    { tag: 'Cantando', song: 'feeling' }),
  c13: C('terminal', 'Mi persona favorita para trabajar', 'EQUIPO',
    'Eres la persona más inteligente que he conocido y aprendo mucho de ti. Tú me enseñas, yo te acompaño, y juntos hacemos cosas que solos no haríamos.',
    { tag: 'Clase' }),
  c14: C('minion', 'Saltando y viajando', 'BELLO',
    'Contigo me basta un plátano y buena compañía, y sí, aquí hay Minions. Contigo todo es más divertido, hasta lo más sencillo.',
    { tag: 'Viaje' }),
  c15: C('kitchen', 'Hasta hoy', 'HOY',
    'Te encanta cocinar aunque todavía no sepas cómo, y a mí me encanta probar todo lo que prepares. Como sigues de intercambio, más abajo te dejé recetas de menos de 30 minutos para lo que te falta por allá.',
    { tag: 'Cocinando', song: 'dieforyou' }),
}
export const FALLBACK_CHAPTER = C('calm', 'Nuevo capítulo', 'CAPÍTULO', '')
