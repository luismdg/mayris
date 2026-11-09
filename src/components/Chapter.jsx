import { useLayoutEffect, useRef, useState } from 'react'
import { THEMES } from '../themes'
import { LAYOUTS } from './Layouts'
import Lightbox from './Lightbox'
import Sticker, { DECOR } from './Stickers'
import { gsap, reduceMotion } from '../motion'
import { fmtRange } from '../store'
import { canEdit, openEditor } from '../edit'

export default function Chapter({ ch, index, total, onActive, prevBg }) {
  const T = THEMES[ch.theme]
  const Layout = LAYOUTS[ch.layoutOverride] || LAYOUTS[T.layout]
  const root = useRef(null)
  const [lb, setLb] = useState(null)
  const letter = (ch.letter || '').trim()
  const bigChars = [...(ch.bigWord || ch.title)]

  useLayoutEffect(() => {
    const el = root.current
    const ctx = gsap.context(() => {
      // active-theme tracker
      gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 55%', end: 'bottom 55%', onToggle: (s) => s.isActive && onActive(ch.id) } })
      if (reduceMotion()) return
      const chars = el.querySelectorAll('.ch-big .c')
      const trig = { trigger: el.querySelector('.ch-hero'), start: 'top 65%', toggleActions: 'play none none reverse' }
      const t = ch.theme
      const T0 = { trigger: el.querySelector('.ch-hero'), start: 'top 65%', toggleActions: 'play none none reverse' }
      const E = {
        flash: () => { gsap.fromTo(chars, { x: -420, skewX: -35, opacity: 0 }, { x: 0, skewX: -8, opacity: 1, duration: 0.55, stagger: 0.05, ease: 'power4.out', scrollTrigger: trig }); gsap.fromTo(el.querySelector('.bolt'), { opacity: 0 }, { keyframes: { opacity: [0, 1, 0, 0.8, 0, 0.4, 0] }, duration: 0.7, scrollTrigger: trig }) },
        club: () => gsap.fromTo(chars, { opacity: 0 }, { keyframes: { opacity: [0, 1, 0.1, 1, 0.3, 1, 0.6, 1] }, duration: 0.9, stagger: 0.12, ease: 'none', scrollTrigger: trig }),
        terminal: () => gsap.fromTo(chars, { opacity: 0 }, { opacity: 1, duration: 0.02, stagger: 0.09, ease: 'none', scrollTrigger: trig }),
        concert: () => gsap.fromTo(chars, { scale: 3.2, opacity: 0, filter: 'blur(24px)' }, { scale: 1, opacity: 1, filter: 'blur(0px)', duration: 1.4, stagger: 0.07, ease: 'expo.out', scrollTrigger: trig }),
        garage: () => gsap.fromTo(chars, { x: 900, skewX: 40, opacity: 0 }, { x: 0, skewX: 0, opacity: 1, duration: 0.9, stagger: -0.06, ease: 'power4.out', scrollTrigger: trig }),
        y2k: () => gsap.fromTo(chars, { y: -300, opacity: 0, rotate: () => gsap.utils.random(-40, 40) }, { y: 0, opacity: 1, rotate: 0, duration: 0.9, stagger: 0.07, ease: 'bounce.out', scrollTrigger: trig }),
        bloom: () => gsap.fromTo(chars, { scale: 0, rotate: -120, opacity: 0 }, { scale: 1, rotate: 0, opacity: 1, duration: 1.3, stagger: 0.09, ease: 'back.out(2)', scrollTrigger: trig }),
        grinch: () => gsap.fromTo(chars, { y: -500, opacity: 0, rotate: () => gsap.utils.random(-25, 25) }, { y: 0, opacity: 1, rotate: () => gsap.utils.random(-4, 4), duration: 1.4, stagger: 0.07, ease: 'bounce.out', scrollTrigger: trig }),
        letter: () => gsap.fromTo(el.querySelector('.ch-big'), { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', duration: 2.2, ease: 'power1.inOut', scrollTrigger: trig }),
        arcade: () => gsap.fromTo(chars, { scale: 0, y: 60 }, { scale: 1, y: 0, duration: 0.6, stagger: 0.08, ease: 'steps(6)', scrollTrigger: trig }),
        kitchen: () => gsap.fromTo(chars, { rotateX: -90, opacity: 0, transformOrigin: '50% 100%' }, { rotateX: 0, opacity: 1, duration: 1, stagger: 0.08, ease: 'back.out(1.6)', scrollTrigger: trig }),
        minion: () => gsap.fromTo(chars, { scale: 0, y: 120 }, { scale: 1, y: 0, duration: 1.4, stagger: 0.08, ease: 'elastic.out(1,0.45)', scrollTrigger: trig }),
        calm: () => gsap.fromTo(chars, { yPercent: 40, opacity: 0, filter: 'blur(14px)' }, { yPercent: 0, opacity: 1, filter: 'blur(0px)', duration: 1.8, stagger: 0.09, ease: 'power3.out', scrollTrigger: trig }),
        valentine: () => E.calm(),
      }
      ;(E[t] || (() => gsap.fromTo(chars, { yPercent: 115, rotate: 8 }, { yPercent: 0, rotate: 0, duration: 1.1, stagger: 0.06, ease: 'power4.out', scrollTrigger: trig })))()
      gsap.fromTo(el.querySelectorAll('.ch-title,.ch-meta,.ch-index'), { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 1, stagger: 0.12, ease: 'power3.out', scrollTrigger: trig })
      // exit: the title dissolves as you scroll on
      gsap.to(el.querySelector('.ch-sticky'), { scale: t === 'flash' ? 1.25 : 1.12, opacity: 0, ease: 'none', scrollTrigger: { trigger: el.querySelector('.ch-hero'), start: '55% top', end: 'bottom top', scrub: true } })
      // letter: words light up as you read
      el.querySelectorAll('.lp').forEach((p) => gsap.from(p, { opacity: 0, y: 36, duration: 1.1, ease: 'power3.out', scrollTrigger: { trigger: p, start: 'top 88%' } }))
      const lw = el.querySelectorAll('.ch-letter .w')
      if (lw.length) gsap.fromTo(lw, { opacity: 0.12 }, { opacity: 1, stagger: 0.5, ease: 'none', scrollTrigger: { trigger: el.querySelector('.ch-letter'), start: 'top 78%', end: 'bottom 55%', scrub: true } })
    }, el)
    return () => ctx.revert()
  }, [ch.id, ch.theme, ch.bigWord, ch.letter, ch.items.length])

  const open = (m) => setLb(ch.items.findIndex((x) => x.id === m.id))
  const lbIndexSetter = (fn) => setLb((i) => (typeof fn === 'function' ? fn(i) : fn))

  return (
    <section ref={root} className={`chapter theme-${ch.theme}`} id={`ch-${ch.id}`} data-theme={ch.theme} style={{ '--prev': prevBg }}>
      <div className="ch-hero">
        <div className="ch-sticky">
          {ch.theme === 'flash' && <svg className="bolt" viewBox="0 0 100 200" aria-hidden><path d="M60 0L10 110h38L30 200 92 80H54z" fill="currentColor" /></svg>}
          <div className="decor" aria-hidden>{(DECOR[ch.theme] || []).map(([n, x, y, size, anim], i) => <Sticker key={i} name={n} size={size} className={`dc-${anim}`} style={{ left: x + '%', top: y + '%' }} />)}</div>
          <span className="ch-index">Capítulo {String(index + 1).padStart(2, '0')} <i>/ {String(total).padStart(2, '0')}</i></span>
          <h2 className="ch-big" aria-label={ch.bigWord || ch.title}>
            {bigChars.map((c, i) => <span className="cw" key={i} aria-hidden><span className="c">{c === ' ' ? ' ' : c}</span></span>)}
          </h2>
          <div className="ch-title">{ch.title}</div>
          {ch.subtitle && <div className="ch-sub">{ch.subtitle}</div>}
          <div className="ch-meta">
            <span>{fmtRange(ch.start, ch.end)}</span>
            <span>{ch.items.length} recuerdos</span>
            {ch.tag && <span className="chip">{ch.tag}</span>}
          </div>
          {canEdit && <button className="edit-ch" onClick={() => openEditor({ chapter: ch.id })}>✎ editar capítulo</button>}
          <div className="ch-cue" aria-hidden>↓</div>
        </div>
      </div>
      {letter && ch.theme === 'letter' && (
        <div className="lsheet">
          <Sticker name="snoopy" size={230} className="ls-snoopy dc-bob" />
          <Sticker name="woodstock" size={80} className="ls-wood dc-hop" />
          <article>
            {letter.split(/\n\s*\n/).map((p, i) => <p className="lp" key={i}>{p.split(String.fromCharCode(10)).map((l, j) => <span key={j}>{l}<br /></span>)}</p>)}
          </article>
        </div>
      )}
      {letter && ch.theme !== 'letter' && (
        <div className="ch-letter">
          <p>{letter.split(/\s+/).map((w, i) => <span className="w" key={i}>{w} </span>)}</p>
        </div>
      )}
      <Layout items={ch.items} onOpen={open} title={ch.title} theme={ch.theme} />
      {lb != null && <Lightbox items={ch.items} index={lb} setIndex={lbIndexSetter} onClose={() => setLb(null)} themeKey={ch.theme} chapterTitle={ch.title} />}
    </section>
  )
}
