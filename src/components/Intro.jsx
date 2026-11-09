import { useCallback, useRef, useState } from 'react'
import Particles from './Particles'
import Lightbox from './Lightbox'
import { mediaUrl, fmtDate } from '../store'
import { scrollToEl } from '../motion'
import { arm, playFor, useMusic } from '../music'
import Sticker from './Stickers'

// "Ofrenda"-style first frame: floating petals; every click blooms a memory.
export default function Intro({ site, pool, ready }) {
  const [cards, setCards] = useState([])
  const [lb, setLb] = useState(null)
  const m = useMusic()
  const seq = useRef(0)
  const bag = useRef([])

  const next = useCallback(() => {
    if (!bag.current.length) bag.current = pool.slice().sort(() => Math.random() - 0.5)
    return bag.current.pop()
  }, [pool])

  const bloom = useCallback(({ x, y }) => {
    const m = next(); if (!m) return
    const id = ++seq.current
    const w = Math.min(220, window.innerWidth * 0.5)
    const left = Math.max(10, Math.min(window.innerWidth - w - 10, x - w / 2))
    const top = Math.max(70, Math.min(window.innerHeight - w * 1.3, y - w * 0.6))
    setCards((c) => [...c.slice(-6), { id, m, left, top, w, rot: (Math.random() - 0.5) * 12 }])
    setTimeout(() => setCards((c) => c.filter((k) => k.id !== id)), 9000)
  }, [next])

  return (
    <section className={`intro ${ready ? 'ready' : ''}`} id="intro">
      <div className="intro-glow" aria-hidden />
      <Particles mode="petals" interactive intensity={1.2} onPetalClick={bloom} />
      <div className="intro-copy">
        <p className="intro-eyebrow">{site.eyebrow}</p>
        <h1>Para <em>{site.to}</em></h1>
        <p className="intro-line">{site.introLine}</p>
        <p className="intro-hint"><span /> {site.introHint}</p>
        <div className="intro-actions">
          <button className="intro-btn" onClick={() => { arm(); scrollToEl('#prologue') }}>Abrir la carta <i>↓</i></button>
          {!m.armed && <button className="intro-btn ghost" onClick={() => { arm(); playFor('lloviendo') }}>♪ con música</button>}
        </div>
      </div>
      {cards.map((k) => (
        <button key={k.id} className="memory" style={{ left: k.left, top: k.top, width: k.w, '--rot': `${k.rot}deg` }} onClick={() => setLb(k.m)}>
          <img src={mediaUrl(k.m.src)} alt={k.m.caption || ''} style={{ aspectRatio: `${k.m.w}/${k.m.h}`, background: k.m.color }} />
          <span>{k.m.caption || fmtDate(k.m.date)}</span>
        </button>
      ))}
      {lb && <Lightbox items={[lb]} index={0} setIndex={() => {}} onClose={() => setLb(null)} themeKey="petals" chapterTitle="Un recuerdo" />}
    </section>
  )
}
