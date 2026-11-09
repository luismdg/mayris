import { useState } from 'react'
import { Flower } from './Layouts2'

// Hand-drawn SVG stickers. To use real artwork instead, drop files into public/stickers/<name>.png (or .webp/.svg) — they replace the drawing automatically.
const Minion = ({ eyes = 1 }) => (
  <svg viewBox="0 0 120 230" aria-hidden>
    <defs><clipPath id={`mc${eyes}`}><rect x="22" y="14" width="76" height="186" rx="38" /></clipPath></defs>
    <g clipPath={`url(#mc${eyes})`}>
      <rect x="22" y="14" width="76" height="186" fill="#ffd90f" />
      <rect x="22" y="128" width="76" height="80" fill="#2f5fa8" />
      <rect x="22" y="196" width="76" height="8" fill="#244b87" />
    </g>
    <rect x="22" y="14" width="76" height="186" rx="38" fill="none" stroke="#c9a400" strokeWidth="3" />
    <rect x="34" y="112" width="12" height="40" fill="#2f5fa8" /><rect x="74" y="112" width="12" height="40" fill="#2f5fa8" />
    <rect x="48" y="150" width="24" height="22" rx="4" fill="#244b87" />
    <rect x="22" y="58" width="76" height="12" fill="#2b2b2b" />
    {(eyes === 2 ? [43, 77] : [60]).map((cx) => (
      <g key={cx}>
        <circle cx={cx} cy="64" r={eyes === 2 ? 17 : 26} fill="#b9bec7" stroke="#8d939c" strokeWidth="4" />
        <circle cx={cx} cy="64" r={eyes === 2 ? 12 : 19} fill="#fff" />
        <circle cx={cx + 2} cy="65" r={eyes === 2 ? 5.5 : 8} fill="#6b3f1d" /><circle cx={cx + 2} cy="65" r={eyes === 2 ? 2.6 : 4} fill="#111" /><circle cx={cx + 4} cy="62" r="1.8" fill="#fff" />
      </g>
    ))}
    <path d="M44 106q16 16 32 0" fill="none" stroke="#333" strokeWidth="3.2" strokeLinecap="round" />
    <path d="M52 14q-2-12-8-16M60 14q0-12 0-18M68 14q3-10 8-14" fill="none" stroke="#333" strokeWidth="2.2" strokeLinecap="round" />
    <ellipse cx="18" cy="118" rx="9" ry="14" fill="#ffd90f" stroke="#c9a400" strokeWidth="2.5" /><ellipse cx="102" cy="118" rx="9" ry="14" fill="#ffd90f" stroke="#c9a400" strokeWidth="2.5" />
    <circle cx="16" cy="134" r="7" fill="#222" /><circle cx="104" cy="134" r="7" fill="#222" />
    <ellipse cx="42" cy="214" rx="16" ry="9" fill="#222" /><ellipse cx="78" cy="214" rx="16" ry="9" fill="#222" />
  </svg>
)
const Snoopy = () => (
  <svg viewBox="0 0 220 190" aria-hidden>
    <ellipse cx="110" cy="182" rx="90" ry="6" fill="#0002" />
    <rect x="44" y="92" width="132" height="86" fill="#c4572e" stroke="#7a2e14" strokeWidth="3" />
    <path d="M110 108c-22 0-30 16-30 30v40h60v-40c0-14-8-30-30-30z" fill="#2a1a16" />
    <path d="M30 96L110 36l80 60z" fill="#d93a2b" stroke="#8d1d12" strokeWidth="3" strokeLinejoin="round" />
    <path d="M110 36l0 0" stroke="#8d1d12" />
    {/* Snoopy lying on the roof */}
    <ellipse cx="96" cy="30" rx="48" ry="13" fill="#fff" stroke="#111" strokeWidth="3" transform="rotate(-8 96 30)" />
    <path d="M52 34q-16-4-22 10" fill="none" stroke="#111" strokeWidth="3" strokeLinecap="round" />
    <circle cx="150" cy="18" r="17" fill="#fff" stroke="#111" strokeWidth="3" />
    <ellipse cx="164" cy="22" rx="6" ry="14" fill="#111" transform="rotate(-18 164 22)" />
    <ellipse cx="166" cy="10" rx="7" ry="5.5" fill="#111" /><circle cx="148" cy="12" r="2.4" fill="#111" />
    <path d="M142 24q6 5 14 1" fill="none" stroke="#111" strokeWidth="2.2" strokeLinecap="round" />
    <path d="M118 26q10 8 22-2" fill="none" stroke="#111" strokeWidth="3" strokeLinecap="round" />
  </svg>
)
const Woodstock = () => (
  <svg viewBox="0 0 80 80" aria-hidden>
    <path d="M38 8q-6-8-12-6M42 8q2-8 8-8M40 8q-2-8 2-10" fill="none" stroke="#d9a400" strokeWidth="3" strokeLinecap="round" />
    <circle cx="40" cy="44" r="30" fill="#ffd54a" stroke="#d9a400" strokeWidth="3" />
    <circle cx="30" cy="38" r="3.2" fill="#111" /><path d="M42 40l22 6-20 4z" fill="#ff8a00" stroke="#c46500" strokeWidth="2" strokeLinejoin="round" />
    <path d="M26 58q-6 10 0 16M54 58q6 10 0 16" stroke="#ff8a00" strokeWidth="3" fill="none" strokeLinecap="round" />
  </svg>
)
const Bolt = () => (
  <svg viewBox="0 0 120 120" aria-hidden>
    <circle cx="60" cy="60" r="56" fill="#d11a1a" stroke="#ffd400" strokeWidth="6" />
    <path d="M70 12L30 66h26L44 108l46-58H64z" fill="#ffd400" stroke="#fff3a0" strokeWidth="2" strokeLinejoin="round" />
  </svg>
)
const Car = () => (
  <svg viewBox="0 0 160 70" aria-hidden>
    <path d="M10 48l8-18c3-6 8-10 15-10h52c8 0 13 3 18 9l12 11 18 3c5 1 8 4 8 9v6H8v-6c0-2 1-3 2-4z" fill="#e11d2e" stroke="#7a0c16" strokeWidth="3" strokeLinejoin="round" />
    <path d="M36 26h26v14H28zM68 26h22l12 14H68z" fill="#a9e3ff" stroke="#3b6b85" strokeWidth="2" />
    <circle cx="42" cy="56" r="11" fill="#1a1a1a" stroke="#ddd" strokeWidth="4" /><circle cx="116" cy="56" r="11" fill="#1a1a1a" stroke="#ddd" strokeWidth="4" />
  </svg>
)
const SantaHat = () => (<svg viewBox="0 0 120 100" aria-hidden><path d="M16 78c4-40 30-66 70-58 14 3 20 12 18 26-6-6-14-6-22-2 6 10 6 22 6 34z" fill="#d11a1a" stroke="#8a0f0f" strokeWidth="3" strokeLinejoin="round" /><rect x="6" y="74" width="108" height="20" rx="10" fill="#fff" stroke="#ddd" strokeWidth="2" /><circle cx="104" cy="44" r="12" fill="#fff" stroke="#ddd" strokeWidth="2" /></svg>)
const ChefHat = () => (<svg viewBox="0 0 120 110" aria-hidden><path d="M26 70c-18-4-20-30-2-36 2-18 24-24 36-12 10-12 34-6 34 14 16 6 14 32-4 34v18H26z" fill="#fff" stroke="#cfd3d9" strokeWidth="3" strokeLinejoin="round" /><rect x="26" y="86" width="68" height="14" rx="3" fill="#e11d48" /></svg>)
const DiscoBall = () => (<svg viewBox="0 0 100 120" aria-hidden><path d="M50 0v22" stroke="#aaa" strokeWidth="3" /><circle cx="50" cy="70" r="42" fill="#d6d9e6" stroke="#8d93ad" strokeWidth="3" />{[-28, -14, 0, 14, 28].map((y) => <ellipse key={y} cx="50" cy={70 + y} rx={Math.sqrt(1764 - y * y)} ry="5" fill="none" stroke="#8d93ad" strokeWidth="1.6" />)}{[-24, -8, 8, 24].map((x) => <path key={x} d={`M${50 + x} 30Q${50 + x * 1.9} 70 ${50 + x} 110`} fill="none" stroke="#8d93ad" strokeWidth="1.6" />)}<path d="M28 48q10-14 24-16" stroke="#fff" strokeWidth="5" strokeLinecap="round" fill="none" /></svg>)
const Mic = () => (<svg viewBox="0 0 70 130" aria-hidden><rect x="20" y="4" width="30" height="48" rx="15" fill="#333" stroke="#111" strokeWidth="3" />{[16, 24, 32, 40].map((y) => <path key={y} d={`M22 ${y}h26`} stroke="#777" strokeWidth="2" />)}<path d="M12 36v8c0 14 10 24 23 24s23-10 23-24v-8M35 68v36M20 112h30" fill="none" stroke="#bbb" strokeWidth="5" strokeLinecap="round" /></svg>)
const Controller = () => (<svg viewBox="0 0 140 90" aria-hidden><path d="M30 10h80c16 0 24 14 28 40 3 20-6 34-18 30-8-2-12-12-20-12H40c-8 0-12 10-20 12C8 84-1 70 2 50 6 24 14 10 30 10z" fill="#ff2bd6" stroke="#000" strokeWidth="5" strokeLinejoin="round" /><path d="M36 30v24M24 42h24" stroke="#000" strokeWidth="7" strokeLinecap="round" /><circle cx="98" cy="34" r="6" fill="#ffe600" stroke="#000" strokeWidth="3" /><circle cx="114" cy="48" r="6" fill="#00f0ff" stroke="#000" strokeWidth="3" /></svg>)
const Block = () => (<svg viewBox="0 0 100 100" aria-hidden><rect x="14" y="14" width="72" height="72" fill="#ff2bd6" stroke="#000" strokeWidth="6" transform="rotate(14 50 50)" /><rect x="36" y="36" width="28" height="28" fill="#22094a" stroke="#000" strokeWidth="4" transform="rotate(14 50 50)" /></svg>)
const Disc = () => (<svg viewBox="0 0 100 100" aria-hidden><defs><linearGradient id="cdg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#ff7ac8" /><stop offset=".35" stopColor="#7ae7ff" /><stop offset=".7" stopColor="#fff3a8" /><stop offset="1" stopColor="#ff7ac8" /></linearGradient></defs><circle cx="50" cy="50" r="46" fill="url(#cdg)" stroke="#b6a5c9" strokeWidth="3" /><circle cx="50" cy="50" r="12" fill="#fff" stroke="#b6a5c9" strokeWidth="3" /><circle cx="50" cy="50" r="4" fill="#ffd3ec" /></svg>)
const Cam = () => (<svg viewBox="0 0 130 90" aria-hidden><rect x="6" y="18" width="118" height="66" rx="12" fill="#e8e9ee" stroke="#8a8d9a" strokeWidth="3" /><rect x="40" y="8" width="28" height="12" rx="4" fill="#ff2d95" /><circle cx="64" cy="52" r="24" fill="#2b2f3a" stroke="#8a8d9a" strokeWidth="4" /><circle cx="64" cy="52" r="13" fill="#5a7bd6" /><circle cx="58" cy="46" r="4" fill="#fff" /><circle cx="108" cy="30" r="5" fill="#ff3030" /></svg>)
const Heart = () => (<svg viewBox="0 0 100 90" aria-hidden><path d="M50 84C14 56 4 38 8 24 12 8 34 4 50 24 66 4 88 8 92 24c4 14-6 32-42 60z" fill="#ff3d71" stroke="#b0123a" strokeWidth="4" strokeLinejoin="round" /><path d="M24 26q4-8 14-6" stroke="#fff" strokeWidth="5" strokeLinecap="round" fill="none" opacity=".7" /></svg>)
const Star = () => (<svg viewBox="0 0 100 100" aria-hidden><path d="M50 4l12 30 32 3-24 21 8 32-28-17-28 17 8-32L6 37l32-3z" fill="#ffe14a" stroke="#d9a400" strokeWidth="4" strokeLinejoin="round" /></svg>)
const Banana = () => (<svg viewBox="0 0 120 100" aria-hidden><path d="M16 20c8 50 50 70 96 54-4 8-14 16-34 18C42 98 8 68 8 24z" fill="#ffe24d" stroke="#b58a00" strokeWidth="4" strokeLinejoin="round" /><path d="M8 24q-2-12 6-14" stroke="#6b4a00" strokeWidth="6" strokeLinecap="round" fill="none" /></svg>)

const ART = {
  minion: () => <Minion eyes={1} />, minion2: () => <Minion eyes={2} />, snoopy: Snoopy, woodstock: Woodstock, bolt: Bolt, car: Car, santahat: SantaHat, chefhat: ChefHat,
  discoball: DiscoBall, mic: Mic, controller: Controller, block: Block, disc: Disc, cam: Cam, heart: Heart, star: Star, banana: Banana,
  flower: () => <Flower size={100} />,
}

export default function Sticker({ name, size = 120, className = '', style, external = true }) {
  const [ext, setExt] = useState(external)
  const Art = ART[name]
  return (
    <span className={`sticker st-${name} ${className}`} style={{ width: size, ...style }} aria-hidden>
      {ext && <img src={`/stickers/${name}.png`} alt="" onError={() => setExt(false)} style={{ width: '100%', height: 'auto' }} draggable="false" />}
      {!ext && Art && <Art />}
    </span>
  )
}

// where each world puts its little friends in the hero
export const DECOR = {
  calm: [['heart', 8, 22, 70, 'bob'], ['flower', 84, 62, 80, 'spin']],
  y2k: [['disc', 8, 24, 110, 'spin'], ['cam', 82, 62, 150, 'bob'], ['star', 76, 16, 70, 'twinkle']],
  bloom: [['flower', 7, 20, 150, 'spin'], ['flower', 84, 58, 110, 'spin']],
  concert: [['mic', 8, 50, 90, 'bob']],
  garage: [['car', 62, 74, 280, 'drive']],
  petals: [['flower', 8, 26, 100, 'spin'], ['heart', 84, 60, 80, 'bob']],
  grinch: [['santahat', 76, 12, 170, 'bob']],
  valentine: [['heart', 8, 24, 100, 'bob'], ['flower', 84, 60, 100, 'spin']],
  letter: [['snoopy', 4, 55, 270, 'bob'], ['woodstock', 80, 22, 90, 'hop']],
  arcade: [['controller', 6, 22, 190, 'bob'], ['block', 82, 62, 110, 'spin']],
  flash: [['bolt', 8, 22, 120, 'twinkle']],
  club: [['discoball', 8, 0, 120, 'swing'], ['mic', 86, 52, 80, 'bob']],
  minion: [['minion', 4, 40, 150, 'hop'], ['minion2', 84, 38, 140, 'hop'], ['banana', 72, 74, 110, 'bob']],
  kitchen: [['chefhat', 8, 20, 150, 'bob']],
  party: [['star', 8, 22, 90, 'twinkle']],
}
export const THEME_ICON = { calm: 'heart', y2k: 'cam', bloom: 'flower', concert: 'mic', garage: 'car', petals: 'flower', grinch: 'santahat', valentine: 'heart', letter: 'snoopy', arcade: 'controller', flash: 'bolt', club: 'discoball', terminal: 'block', minion: 'minion', sunset: 'star', kitchen: 'chefhat', party: 'star' }
