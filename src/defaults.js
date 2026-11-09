// Textos por defecto (editables desde "Modo configuración"). Todo en español, en tono de plática.
export const DEFAULT_SITE = {
  to: 'Mayris',
  from: 'Luis',
  introLine: 'Para ti, que eres mi casa.',
  introHint: 'toca los pétalos',
  startDate: '2024-03-09',
  anniversaryDate: '2024-11-09',
  prologue: [
    'Nos conocimos en el club. Y el primer video que tengo de nosotros es un beso.',
    'De eso han pasado {days} días.',
    'Desde entonces guardé {photos} fotos y {videos} videos, porque no quería que se me olvidara ni un solo día contigo.',
    'Y quiero que recuerdes algo: cada te quiero que te dije, lo dije en serio.',
  ],
  likesTitle: 'Todo lo que me gusta de ti',
  likes: [
    'cuando dices que eres Grinch y luego pones música de Navidad', 'bailar en tu cuarto cuando crees que nadie te ve', 'cantar (y que yo cante contigo, jaja)',
    'The Flash', 'Roblox y Steal a Brainrot', 'tus flores', 'cocinar aunque no sepas cómo (todavía)', 'The Weeknd y Travis Scott', 'lo inteligente que eres',
    'el rosa y el rojo', 'los Minions', 'los carros', 'las fotos y los videos como los de antes', 'las cartas escritas a mano', 'Snoopy',
  ],
  finaleTitle: 'Te amo.',
  letter:
    'Mayris,\n\nQuiero que recuerdes algo: cada te quiero y cada te amo que te he dicho, lo dije en serio. No fue costumbre ni una frase para llenar el silencio. Siempre fue verdad.\n\nGracias por empujarme a cosas que yo solo jamás habría hecho: los viajes, la compu y hasta cantar (jaja). Contigo aprendí que crecer no da miedo cuando se hace de la mano.\n\nSi algún día te sientes lejos, vuelve aquí. Estamos nosotros, riéndonos de lo mismo de siempre.\n\nSiempre tuyo,\nLuis',
}

const LETTER = `Querida Mayris:

Crecimos creyendo que el amor se encontraba como en las películas: sin tropiezos, sin discusiones, perfecto desde el primer minuto. Y mira, contigo me di cuenta de que no es así. Desde el día que nos conocimos todo fue diferente. Me enamoré de la persona más talentosa, inteligente y apasionada del mundo, y eso no fue lo único que hizo nuestra relación tan divertida y tan nuestra. Fue cada risa, cada momento, cada discusión (sí, también esas) y cada vez que nos echamos porras para crecer juntos.

Sé que lo nuestro no se parece a lo de los demás. Pero ¿para qué querer parecernos a los demás si contigo encontré justo la relación que quería? Todavía hay cosas por cambiar, y las vamos a cambiar, pero me encantaría que supieras esto: cada te quiero, cada te amo y cada te extraño no vienen de acordarme de nuestro compromiso. Vienen de acordarme de todo lo que hemos vivido, de las experiencias que nos han hecho todavía más cercanos.

Lo que hemos pasado no es poca cosa. Ya son más de dos años de convivencia diaria, y lo más valioso de todos esos días eres tú. Me encanta verte los ojos, la cara y a toda esa persona valiente, explosiva y arriesgada de la que me enamoré.

Con todo mi cariño,
Luis`

const C = (theme, title, bigWord, letter, extra = {}) => ({ theme, title, bigWord, subtitle: '', letter, ...extra })
export const DEFAULT_CHAPTERS = {
  c01: C('calm', 'Nos conocimos en el club', 'HOLA',
    'Todo empezó en el club, y el primer video que tengo de nosotros es un beso. Ni te imaginas lo que me hizo ese día. Luego, entre días normales (el gym, la tarea, tu gelatina favorita, un Nutella con tu nombre) agarramos confianza bien rápido. Ahí supe que contigo hasta lo más común se volvía especial.',
    { tag: 'Chill', song: 'lloviendo' }),
  c02: C('y2k', 'Clases, Lego y Mario Kart', 'CLASES',
    'Nos sentábamos juntos en todas las clases (sí, también me metí a las tuyas, no lo niegues). Nuestra primera cita fue en Lego y jugando Mario Kart. Gané yo; tú dices que estuvo arreglado. Sigo diciendo que no.',
    { tag: 'Clase' }),
  c03: C('bloom', 'Tus cumpleaños', '16·SEP',
    'Cada 16 de septiembre quise llenarte de flores, porque contigo todo florece. El primer año llegué disfrazado de El Patrón y terminamos cubiertos de confeti. El siguiente, otra vez flores, y unos boletos para ir a ver a The Weeknd.',
    { tag: 'Cumpleaños' }),
  c04: C('concert', 'Travis Scott y The Weeknd', 'EN·VIVO',
    'Me encanta verte cantar cada canción como si fuera tuya. Travis, The Weeknd… hasta te pintaste las uñas para el concierto. De esas noches me quedo con tu cara de felicidad.',
    { tag: 'Concierto', song: 'goosebumps' }),
  c05: C('garage', 'Soldando y todo lo demás', 'MOTOR',
    'Aprendimos a soldar para un carro (y a ti te encantan los carros), y nos reímos más de lo que soldamos. Entre eso, los tacos del hackathon y el gym, siempre había algo nuevo que probar juntos.',
    { tag: 'Carros' }),
  c06: C('petals', '9 de noviembre', 'SÍ',
    'Ese día te pregunté si querías ser mi novia, y dijiste que sí. Todavía se me acelera el corazón cuando me acuerdo. El pastel, las velitas, tú. Es mi fecha favorita de todo el calendario.',
    { tag: 'Aniversario', song: 'holdon' }),
  c07: C('grinch', 'Navidad (según tú)', 'NAVIDAD',
    'Dices que eres una Grinch, pero yo vi cómo se te iluminan los ojos con los regalos, con las luces, con Santa. Hasta nuestro hijo (el peluche) llegó de viaje para la foto. En el fondo, la Navidad te encanta, y yo lo sé.',
    { tag: 'Navidad' }),
  c08: C('valentine', 'Flores y febrero', 'FEBRERO',
    'Armamos un negocio de flores. Porque te gustan, y porque contigo hasta trabajar se siente como jugar. Y en febrero, entre regalos, dibujitos con pluma y Minecraft, me di cuenta de que cualquier día contigo ya es 14.',
    { tag: 'San Valentín', song: 'rumores' }),
  c09: C('letter', 'Querida Mayris', 'Cartas', LETTER, { song: 'yellow' }),
  c10: C('arcade', 'Roblox y Steal a Brainrot', 'BRAINROT',
    'Nadie me hace reír jugando como tú. Steal a Brainrot contigo es el único juego en el que no me importa perder. Entre partidas, citas, el cumpleaños de tu mamá y las videollamadas que siempre se alargan, este verano se nos pasó volando.',
    { tag: 'Videojuegos' }),
  c11: C('flash', 'HackMTY', 'FLASH',
    'Sé que The Flash es de tus favoritos, y en HackMTY entendí por qué: tú piensas, resuelves y avanzas más rápido que todos, y todavía me jalas contigo. Trabajar contigo es de lo que más me gusta. Nos complementamos, y nos empujamos a hacer cosas que ni imaginábamos: viajes, CS y hasta yo cantando, jaja.',
    { tag: 'Hackathon', song: 'nothin' }),
  c12: C('club', 'Cuando cantas y bailas', 'TU·VOZ',
    'Cantas, bailas en tu cuarto cuando crees que nadie te ve (yo sí te veo, y me encanta), y hasta ganaste un concurso de canto. Yo, que jamás cantaba, terminé cantando contigo. Todavía me da risa.',
    { tag: 'Cantando', song: 'feeling' }),
  c13: C('terminal', 'La persona más inteligente que conozco', 'EQUIPO',
    'Eres la persona más inteligente que he conocido, y lo demuestras en cada presentación, en cada proyecto, en ese segundo lugar que se quedó corto para lo que vales. Lo mejor es trabajar contigo: tú me enseñas, yo te sigo el ritmo, y entre los dos sale algo que ninguno haría solo.',
    { tag: 'Clase' }),
  c14: C('minion', 'Saltando y viajando', 'BELLO',
    'Con un plátano y contigo me basta (y sí, aquí hay minions, no me juzgues). CDMX, el parque de trampolines, fiestas con amigos… contigo me río hasta de lo más tonto.',
    { tag: 'Viaje' }),
  c15: C('kitchen', 'Cocinando (más o menos)', 'A·COCINAR',
    'Te encanta cocinar, aunque todavía no sepas cómo (todavía). Tu pastel de nuestros seis meses sigue siendo el más rico que me han hecho. Y por si algún día te toca cocinar lejos de casa, más abajo te dejé unas recetas de menos de 30 minutos.',
    { tag: 'Cocinando' }),
}
export const FALLBACK_CHAPTER = C('calm', 'Nuevo capítulo', 'CAPÍTULO', '')
