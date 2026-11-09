import { useLayoutEffect, useRef, useState } from 'react'
import MediaTile from './MediaTile'
import { gsap, ScrollTrigger, reduceMotion } from '../motion'
import { fmtDate } from '../store'

const hash = (s) => [...s].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7)
const useCtx = (fn, deps) => {
  const ref = useRef(null)
  useLayoutEffect(() => {
    if (reduceMotion()) return
    const ctx = gsap.context(() => fn(ref.current), ref)
    return () => ctx.revert()
  }, deps)
  return ref
}
const cap = (m) => m.caption || ''
const dl = (m) => fmtDate(m.date, { day: 'numeric', month: 'short', year: 'numeric' })
const stamp = (m) => { const d = new Date(m.date || Date.now()); return `'${String(d.getFullYear()).slice(2)} ${d.getMonth() + 1} ${d.getDate()}` }

export const Flower = ({ size = 40, color = '#ff3d71', center = '#ffd166', style, className }) => (
  <svg className={className} style={style} width={size} height={size} viewBox="-50 -50 100 100" aria-hidden>
    {[0, 72, 144, 216, 288].map((a) => <ellipse key={a} cx="0" cy="-26" rx="17" ry="27" fill={color} transform={`rotate(${a})`} opacity=".92" />)}
    <circle r="11" fill={center} />
  </svg>
)

/* ---------- Y2K: digital-camera frames ---------- */
export function Digicam({ items, onOpen }) {
  const ref = useCtx((root) => {
    ScrollTrigger.batch(gsap.utils.toArray('.dc', root), {
      start: 'top 92%',
      onEnter: (els) => gsap.fromTo(els, { opacity: 0, scale: 1.12, filter: 'hue-rotate(90deg) saturate(3)' }, { opacity: 1, scale: 1, filter: 'hue-rotate(0deg) saturate(1.15)', duration: 0.5, stagger: 0.09, ease: 'steps(6)' }),
    })
  }, [items.length])
  return (
    <div className="digicam" ref={ref}>
      {items.map((m, i) => (
        <div className="dc" key={m.id} style={{ '--rot': `${(hash(m.id) % 5) - 2}deg` }}>
          <div className="dc-screen">
            <MediaTile item={m} onOpen={onOpen} />
            <span className="dc-rec">{m.video ? <><i /> REC</> : '[ AUTO ]'}</span>
            <span className="dc-bat">▮▮▮</span>
            <span className="dc-stamp">{stamp(m)}</span>
            <span className="dc-count">{String(i + 1).padStart(3, '0')}</span>
            <span className="dc-corner tl" /><span className="dc-corner tr" /><span className="dc-corner bl" /><span className="dc-corner br" />
          </div>
          <p>{cap(m) || dl(m)}</p>
        </div>
      ))}
    </div>
  )
}

/* ---------- CONCERT: pinned cinematic slideshow ---------- */
export function Cinema({ items, onOpen }) {
  const root = useRef(null)
  const [cur, setCur] = useState(0)
  useLayoutEffect(() => {
    const st = ScrollTrigger.create({
      trigger: root.current, start: 'top top', end: 'bottom bottom',
      onUpdate: (s) => setCur(Math.min(items.length - 1, Math.floor(s.progress * items.length))),
    })
    return () => st.kill()
  }, [items.length])
  const m = items[cur]
  return (
    <div className="cinema" ref={root} style={{ height: `${items.length * 62 + 40}vh` }}>
      <div className="cin-stick">
        <div className="cin-bar top" /><div className="cin-bar bot" />
        {items.map((it, i) => (
          <div className={`cin-slide ${i === cur ? 'on' : ''} ${i < cur ? 'past' : ''}`} key={it.id} aria-hidden={i !== cur}>
            <MediaTile item={it} onOpen={onOpen} auto={Math.abs(i - cur) < 1} />
          </div>
        ))}
        <div className="cin-hud">
          <b>{String(cur + 1).padStart(2, '0')}</b><i>/ {String(items.length).padStart(2, '0')}</i>
          <span>{m && (cap(m) || dl(m))}</span>
        </div>
        <div className="cin-lights" aria-hidden />
      </div>
    </div>
  )
}

/* ---------- BLOOM: arched garden windows ---------- */
export function Arch({ items, onOpen }) {
  const ref = useCtx((root) => {
    ScrollTrigger.batch(gsap.utils.toArray('.arch', root), {
      start: 'top 92%',
      onEnter: (els) => gsap.fromTo(els, { y: 80, opacity: 0, scale: 0.9 }, { y: 0, opacity: 1, scale: 1, duration: 1.1, stagger: 0.14, ease: 'power3.out' }),
    })
    gsap.utils.toArray('.arch-fl', root).forEach((f, i) => gsap.to(f, { rotate: i % 2 ? 90 : -90, ease: 'none', scrollTrigger: { trigger: f, scrub: 1, start: 'top bottom', end: 'bottom top' } }))
  }, [items.length])
  const cols = ['#ff3d71', '#e11d48', '#ff8fab', '#ff5c8a']
  return (
    <div className="arches" ref={ref}>
      {items.map((m, i) => (
        <div className="arch" key={m.id} style={{ '--off': `${(i % 3) * 34}px` }}>
          <div className="arch-frame"><MediaTile item={m} onOpen={onOpen} /></div>
          <Flower className="arch-fl" size={54 + (hash(m.id) % 30)} color={cols[i % 4]} style={{ [i % 2 ? 'left' : 'right']: -22 }} />
          <p>{cap(m) || dl(m)}</p>
        </div>
      ))}
    </div>
  )
}

/* ---------- GARAGE: road with a driving car ---------- */
export function Road({ items, onOpen }) {
  const ref = useCtx((root) => {
    gsap.to(root.querySelector('.road-car'), { top: '98%', ease: 'none', scrollTrigger: { trigger: root, scrub: 0.6, start: 'top 60%', end: 'bottom 60%' } })
    ScrollTrigger.batch(gsap.utils.toArray('.rd', root), {
      start: 'top 90%',
      onEnter: (els) => els.forEach((el) => gsap.fromTo(el, { x: el.classList.contains('l') ? -240 : 240, opacity: 0, skewX: el.classList.contains('l') ? 20 : -20 }, { x: 0, opacity: 1, skewX: 0, duration: 0.8, ease: 'power4.out' })),
    })
  }, [items.length])
  return (
    <div className="road" ref={ref}>
      <div className="road-line" aria-hidden />
      <svg className="road-car" viewBox="0 0 120 60" aria-hidden><path d="M8 40l6-14c2-5 6-8 12-8h40c6 0 10 2 14 7l10 9 10 2c4 1 6 3 6 7v4H4v-4c0-2 1-3 4-3z" fill="#ff2d3d" /><circle cx="34" cy="46" r="9" fill="#111" stroke="#ddd" strokeWidth="3" /><circle cx="92" cy="46" r="9" fill="#111" stroke="#ddd" strokeWidth="3" /><path d="M30 24h22v12H24zM58 24h18l10 12H58z" fill="#9de1ff" /></svg>
      {items.map((m, i) => (
        <div className={`rd ${i % 2 ? 'r' : 'l'}`} key={m.id}>
          <div className="rd-sign">KM {String(i * 7 + 1).padStart(3, '0')}</div>
          <MediaTile item={m} onOpen={onOpen} />
          <div className="rd-plate">{(cap(m) || dl(m)).slice(0, 28).toUpperCase()}</div>
        </div>
      ))}
    </div>
  )
}

/* ---------- GRINCH: hanging ornaments in the snow ---------- */
export function Ornaments({ items, onOpen }) {
  const ref = useCtx((root) => {
    ScrollTrigger.batch(gsap.utils.toArray('.orn', root), {
      start: 'top 94%',
      onEnter: (els) => gsap.fromTo(els, { y: -160, opacity: 0 }, { y: 0, opacity: 1, duration: 1.4, stagger: 0.12, ease: 'bounce.out' }),
    })
  }, [items.length])
  const caps = ['#ffd166', '#f4c542', '#ffe9a8']
  return (
    <div className="ornaments" ref={ref}>
      {items.map((m, i) => (
        <div className="orn" key={m.id} style={{ '--d': `${(hash(m.id) % 30) / 10}s`, '--len': `${30 + (hash(m.id) % 90)}px`, '--cap': caps[i % 3], '--ball': i % 3 === 0 ? '#e63946' : i % 3 === 1 ? '#2a9d5f' : '#c1121f' }}>
          <i className="orn-string" /><i className="orn-cap" />
          <div className="orn-ball"><MediaTile item={m} onOpen={onOpen} /></div>
          <p>{cap(m) || dl(m)}</p>
        </div>
      ))}
    </div>
  )
}

/* ---------- LETTER: handwritten pages with taped photos ---------- */
export function Paper({ items, onOpen }) {
  const ref = useCtx((root) => {
    gsap.fromTo(root.querySelector('.env-flap'), { rotateX: 0 }, { rotateX: 180, ease: 'none', scrollTrigger: { trigger: root.querySelector('.env'), start: 'top 70%', end: 'bottom 40%', scrub: true } })
    gsap.utils.toArray('.sheet', root).forEach((el, i) => gsap.fromTo(el, { y: 90, rotate: (i % 2 ? 4 : -4), opacity: 0 }, { y: 0, rotate: (i % 2 ? 1.2 : -1.2), opacity: 1, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 90%' } }))
  }, [items.length])
  return (
    <div className="paper" ref={ref}>
      <div className="env"><div className="env-back" /><div className="env-flap" /><div className="env-seal">♥</div></div>
      {items.map((m, i) => (
        <article className={`sheet ${i % 2 ? 'r' : 'l'}`} key={m.id}>
          <div className="sheet-photo"><i className="washi" /><MediaTile item={m} onOpen={onOpen} /></div>
          <div className="sheet-text">
            <span className="stampbox"><b>{new Date(m.date || Date.now()).getDate()}</b><small>{fmtDate(m.date, { month: 'short', year: '2-digit' })}</small></span>
            <p>{cap(m) || (i === 0 ? 'Querida Mayris:' : '…')}</p>
          </div>
        </article>
      ))}
    </div>
  )
}

/* ---------- ARCADE: chunky game cards ---------- */
export function Blocks({ items, onOpen }) {
  const ref = useCtx((root) => {
    ScrollTrigger.batch(gsap.utils.toArray('.blk', root), {
      start: 'top 94%',
      onEnter: (els) => gsap.fromTo(els, { scale: 0, rotate: -12 }, { scale: 1, rotate: 0, duration: 0.5, stagger: 0.07, ease: 'steps(5)' }),
    })
  }, [items.length])
  return (
    <div className="blocks" ref={ref}>
      {items.map((m, i) => (
        <div className={`blk c${hash(m.id) % 4} ${i % 7 === 3 ? 'big' : ''}`} key={m.id} style={{ '--rot': `${(hash(m.id) % 7) - 3}deg` }}>
          <span className="blk-lv">LV {String(i + 1).padStart(2, '0')}</span>
          <MediaTile item={m} onOpen={onOpen} />
          <span className="blk-xp">+{(hash(m.id) % 9 + 1) * 100} XP</span>
          {cap(m) && <p>{cap(m)}</p>}
        </div>
      ))}
    </div>
  )
}

/* ---------- KITCHEN: recipe steps ---------- */
export function Steps({ items, onOpen }) {
  const ref = useCtx((root) => {
    gsap.utils.toArray('.step', root).forEach((el) => gsap.from(el, { x: el.classList.contains('r') ? 100 : -100, opacity: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 90%' } }))
    gsap.from('.recipe-head', { y: 60, opacity: 0, duration: 1, scrollTrigger: { trigger: '.recipe-head', start: 'top 88%' } })
  }, [items.length])
  return (
    <div className="steps" ref={ref}>
      <div className="recipe-head">
        <b>RECETA</b><h3>Cómo enamorarse en {items.length} pasos</h3>
        <ul><li>porciones: 2</li><li>tiempo: toda la vida</li><li>dificultad: facilísima contigo</li><li>sal: al gusto (la quemamos un poco)</li></ul>
      </div>
      <i className="steps-line" aria-hidden />
      {items.map((m, i) => (
        <div className={`step ${i % 2 ? 'r' : 'l'}`} key={m.id}>
          <span className="step-n">{i + 1}</span>
          <div className="step-card"><MediaTile item={m} onOpen={onOpen} /><p><small>PASO {i + 1}</small>{cap(m) || dl(m)}</p></div>
        </div>
      ))}
    </div>
  )
}

/* ---------- MINION: goggle portholes ---------- */
export function Porthole({ items, onOpen }) {
  const ref = useCtx((root) => {
    ScrollTrigger.batch(gsap.utils.toArray('.ph', root), {
      start: 'top 94%',
      onEnter: (els) => gsap.fromTo(els, { y: 100, scale: 0.4, opacity: 0 }, { y: 0, scale: 1, opacity: 1, duration: 1.1, stagger: 0.1, ease: 'elastic.out(1,0.55)' }),
    })
  }, [items.length])
  return (
    <div className="portholes" ref={ref}>
      <div className="strap" aria-hidden />
      {items.map((m, i) => (
        <div className="ph" key={m.id} style={{ '--s': `${i % 5 === 2 ? 1.25 : 1}` }}>
          <div className="ph-ring"><div className="ph-glass"><MediaTile item={m} onOpen={onOpen} /></div></div>
          <p>{cap(m) || dl(m)}</p>
        </div>
      ))}
    </div>
  )
}
