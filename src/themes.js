// Each "era" of the relationship gets its own visual world. Main palette of the whole site: pink + red + flowers.
export const THEMES = {
  calm:      { label: 'Calma · amanecer rosa',     layout: 'masonry',   fx: 'dust',     bg: '#fdeef0', ink: '#4a1d2b', accent: '#e8587a' },
  y2k:       { label: 'Y2K · cámara digital 2000s',layout: 'digicam',   fx: 'sparkle',  bg: '#ffd3ec', ink: '#4a0e3c', accent: '#ff2d95' },
  bloom:     { label: 'Flores · jardín rosa y rojo',layout: 'arch',     fx: 'flowers',  bg: '#ffdfe6', ink: '#5a0a22', accent: '#ff3d71' },
  concert:   { label: 'Concierto · Weeknd / Travis',layout: 'cinema',   fx: 'stage',    bg: '#0b0102', ink: '#ffe5e5', accent: '#ff1a2e' },
  garage:    { label: 'Garage · carros',           layout: 'road',      fx: 'asphalt',  bg: '#101216', ink: '#f2f2f2', accent: '#ff2d3d' },
  petals:    { label: 'Pétalos · altar',           layout: 'polaroids', fx: 'petals',   bg: '#1a0509', ink: '#f6e3c8', accent: '#ff5c8a' },
  grinch:    { label: 'Navidad · la Grinch',       layout: 'ornaments', fx: 'snow',     bg: '#0b3b24', ink: '#fff5e6', accent: '#ff3b3b' },
  valentine: { label: 'San Valentín · corazones',  layout: 'masonry',   fx: 'hearts',   bg: '#ffe3ea', ink: '#6b1230', accent: '#e5195a' },
  letter:    { label: 'Cartas a mano',             layout: 'paper',     fx: 'dust',     bg: '#f3e6cf', ink: '#3a2a1e', accent: '#c1121f' },
  arcade:    { label: 'Arcade · Roblox / Brainrot',layout: 'blocks',    fx: 'pixels',   bg: '#22094a', ink: '#ffffff', accent: '#ff2bd6' },
  flash:     { label: 'The Flash · velocidad',     layout: 'rail',      fx: 'speed',    bg: '#150404', ink: '#fff3c4', accent: '#ffd400' },
  club:      { label: 'Club · cantar y bailar',    layout: 'strobe',    fx: 'lasers',   bg: '#07030f', ink: '#f4eaff', accent: '#ff2bd6' },
  terminal:  { label: 'Terminal · genio',          layout: 'bento',     fx: 'code',     bg: '#04100b', ink: '#c9ffe3', accent: '#39ff88' },
  minion:    { label: 'Minions · banana',          layout: 'porthole',  fx: 'bubbles',  bg: '#ffd90f', ink: '#16315e', accent: '#1e6bd6' },
  sunset:    { label: 'Atardecer · viaje',         layout: 'stack',     fx: 'embers',   bg: '#2a1233', ink: '#ffe9d6', accent: '#ff7a9c' },
  kitchen:   { label: 'Cocina · receta',           layout: 'steps',     fx: 'steam',    bg: '#fff3ee', ink: '#6b0f1a', accent: '#e11d48' },
  party:     { label: 'Fiesta · cumpleaños',       layout: 'polaroids', fx: 'confetti', bg: '#fff6d6', ink: '#2b1b4d', accent: '#7a3cff' },
}
export const THEME_KEYS = Object.keys(THEMES)
export const TAGS = ['Aniversario', 'Cumpleaños', 'Viaje', 'Hackathon', 'Clase', 'Negocio', 'San Valentín', 'Navidad', 'Concierto', 'Cantando', 'Cocinando', 'Carros', 'Videojuegos', 'Chill', 'Familia', 'Amigos', 'Comida', 'Salida']
