import { useLayoutEffect, useRef } from 'react'
import MediaTile from './MediaTile'
import { gsap, ScrollTrigger, velocity, reduceMotion } from '../motion'
import { fmtDate } from '../store'
import { Digicam, Cinema, Arch, Road, Ornaments, Paper, Blocks, Steps, Porthole } from './Layouts2'

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
const label = (m) => m.caption || ''
const dateLabel = (m) => fmtDate(m.date, { day: 'numeric', month: 'short', year: 'numeric' })

/* ---------- CALM / VALENTINE: drifting masonry with gentle parallax ---------- */
export function Masonry({ items, onOpen }) {
  const ref = useCtx((root) => {
    gsap.utils.toArray('.m-item', root).forEach((el, i) => {
      gsap.from(el.querySelector('.m-in'), { y: 70, opacity: 0, duration: 1.2, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 94%' } })
      gsap.to(el, { y: [-40, 25, -60, 10][i % 4], ease: 'none', scrollTrigger: { trigger: el, scrub: true, start: 'top bottom', end: 'bottom top' } })
    })
  }, [items.length])
  return (
    <div className="masonry" ref={ref}>
      {items.map((m) => (
        <div className="m-item" key={m.id}>
          <div className="m-in">
            <MediaTile item={m} onOpen={onOpen} />
            <p className="m-cap"><small>{dateLabel(m)}</small>{label(m) && <span>{label(m)}</span>}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

/* ---------- CLUB: neon strobe grid + marquee strips ---------- */
export function Strobe({ items, onOpen, title }) {
  const ref = useCtx((root) => {
    gsap.utils.toArray('.s-tile', root).forEach((el) => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 95%' } })
      tl.set(el, { opacity: 0 }).to(el, { opacity: 1, duration: 0.05 }).to(el, { opacity: 0.1, duration: 0.07 }).to(el, { opacity: 1, duration: 0.05 }).to(el, { opacity: 0.35, duration: 0.06 }).to(el, { opacity: 1, duration: 0.2 })
    })
  }, [items.length])
  const out = []
  items.forEach((m, i) => {
    if (i && i % 9 === 0) out.push(<div className="marquee" key={'mq' + i} aria-hidden><div>{Array.from({ length: 8 }, (_, k) => <span key={k}>{title} ✦ {dateLabel(m)} ✦ </span>)}</div></div>)
    out.push(
      <div className={`s-tile ${m.h > m.w ? 'tall' : 'wide'}`} key={m.id}>
        <MediaTile item={m} onOpen={onOpen} />
        {label(m) && <span className="s-cap">{label(m)}</span>}
      </div>
    )
  })
  return <div className="strobe" ref={ref}>{out}</div>
}

/* ---------- FLASH: pinned horizontal super-speed rail ---------- */
export function Rail({ items, onOpen }) {
  const sec = useRef(null), track = useRef(null)
  useLayoutEffect(() => {
    if (reduceMotion()) return
    const dist = () => Math.max(0, track.current.scrollWidth - window.innerWidth + 80)
    const ctx = gsap.context(() => {
      gsap.to(track.current, { x: () => -dist(), ease: 'none', scrollTrigger: { trigger: sec.current, start: 'top top', end: () => '+=' + dist(), pin: true, scrub: 0.5, invalidateOnRefresh: true, anticipatePin: 1 } })
    }, sec)
    const tiles = () => track.current?.querySelectorAll('.r-tile') || []
    const skew = () => {
      const k = gsap.utils.clamp(-16, 16, velocity.v * -0.9)
      gsap.to(tiles(), { skewX: k, duration: 0.25, overwrite: 'auto' })
    }
    gsap.ticker.add(skew)
    return () => { gsap.ticker.remove(skew); ctx.revert() }
  }, [items.length])
  return (
    <div className="rail" ref={sec}>
      <div className="speedlines" aria-hidden />
      <div className="r-track" ref={track}>
        {items.map((m, i) => (
          <div className="r-tile" key={m.id}>
            <MediaTile item={m} onOpen={onOpen} />
            <span className="r-num">{String(i + 1).padStart(2, '0')}</span>
            <span className="r-cap">{label(m) || dateLabel(m)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ---------- PETALS / PARTY: scattered polaroids ---------- */
export function Polaroids({ items, onOpen }) {
  const ref = useCtx((root) => {
    ScrollTrigger.batch(gsap.utils.toArray('.pol', root), {
      start: 'top 92%',
      onEnter: (els) => gsap.fromTo(els, { y: 90, opacity: 0, scale: 0.85 }, { y: 0, opacity: 1, scale: 1, duration: 1, stagger: 0.12, ease: 'back.out(1.4)' }),
    })
  }, [items.length])
  return (
    <div className="polaroids" ref={ref}>
      {items.map((m) => {
        const h = hash(m.id)
        return (
          <div className="pol" key={m.id} style={{ '--rot': `${(h % 9) - 4}deg`, '--dy': `${(h % 5) * 10 - 10}px`, '--tape': `${(h % 40) - 20}deg` }}>
            <i className="tape" />
            <MediaTile item={m} onOpen={onOpen} />
            <p>{label(m) || dateLabel(m)}</p>
          </div>
        )
      })}
    </div>
  )
}

/* ---------- SUNSET: sticky stacking postcards ---------- */
export function Stack({ items, onOpen }) {
  const ref = useCtx((root) => {
    const cards = gsap.utils.toArray('.stk', root)
    cards.forEach((el, i) => {
      if (i === cards.length - 1) return
      gsap.to(el.querySelector('.stk-in'), { scale: 0.9, opacity: 0.35, filter: 'blur(3px)', ease: 'none', scrollTrigger: { trigger: cards[i + 1], start: 'top 85%', end: 'top 12%', scrub: true } })
    })
  }, [items.length])
  return (
    <div className="stack" ref={ref}>
      {items.map((m, i) => (
        <div className="stk" key={m.id} style={{ '--i': i }}>
          <div className="stk-in">
            <div className="stk-side"><b>{String(i + 1).padStart(2, '0')}</b><small>{dateLabel(m)}</small>{label(m) && <em>{label(m)}</em>}</div>
            <MediaTile item={m} onOpen={onOpen} />
          </div>
        </div>
      ))}
    </div>
  )
}

/* ---------- TERMINAL: IDE-window bento ---------- */
export function Bento({ items, onOpen }) {
  const ref = useCtx((root) => {
    ScrollTrigger.batch(gsap.utils.toArray('.win', root), {
      start: 'top 92%',
      onEnter: (els) => gsap.fromTo(els, { y: 40, opacity: 0, clipPath: 'inset(0 0 100% 0)' }, { y: 0, opacity: 1, clipPath: 'inset(0 0 0% 0)', duration: 0.7, stagger: 0.1, ease: 'power3.out' }),
    })
  }, [items.length])
  return (
    <div className="bento" ref={ref}>
      {items.map((m) => (
        <div className="win" key={m.id}>
          <div className="win-bar"><i /><i /><i /><span>recuerdo_{String(items.indexOf(m) + 1).padStart(3, '0')}{m.video ? '.mov' : '.jpg'}</span></div>
          <MediaTile item={m} onOpen={onOpen} />
          <p className="win-cap"><b>$</b> {label(m) || `cat ${dateLabel(m)}`}<u /></p>
        </div>
      ))}
    </div>
  )
}

export const LAYOUTS = { masonry: Masonry, strobe: Strobe, rail: Rail, polaroids: Polaroids, stack: Stack, bento: Bento, digicam: Digicam, cinema: Cinema, arch: Arch, road: Road, ornaments: Ornaments, paper: Paper, blocks: Blocks, steps: Steps, porthole: Porthole }
