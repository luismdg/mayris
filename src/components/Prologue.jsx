import { Fragment, useLayoutEffect, useRef } from 'react'
import { gsap, reduceMotion } from '../motion'

const daysSince = (iso) => Math.max(0, Math.floor((Date.now() - new Date(iso + 'T00:00:00')) / 864e5))

// Cafeteria-style: a sticky stage where big statements take over the screen one by one as you scroll.
export default function Prologue({ site, counts }) {
  const root = useRef(null)
  const lines = site.prologue.map((l) => l
    .replace('{days}', daysSince(site.startDate).toLocaleString('es-MX'))
    .replace('{photos}', counts.photos).replace('{videos}', counts.videos).replace('{total}', counts.total))

  useLayoutEffect(() => {
    const el = root.current
    if (reduceMotion()) { el.classList.add('static'); return }
    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray('.pl-line', el)
      const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: 'top top', end: 'bottom bottom', scrub: 0.6 } })
      items.forEach((it, i) => {
        const chars = it.querySelectorAll('.pw')
        tl.fromTo(chars, { yPercent: 110, opacity: 0 }, { yPercent: 0, opacity: 1, stagger: 0.05, duration: 1, ease: 'power3.out' })
          .to(it, { duration: 1.2 }) // hold
        if (i < items.length - 1) tl.to(chars, { yPercent: -110, opacity: 0, stagger: 0.03, duration: 0.8, ease: 'power3.in' })
      })
      gsap.to('.pl-bar span', { scaleX: 1, ease: 'none', scrollTrigger: { trigger: el, start: 'top top', end: 'bottom bottom', scrub: true } })
    }, el)
    return () => ctx.revert()
  }, [lines.join('|')])

  return (
    <section className="prologue" id="prologue" ref={root} style={{ height: `${lines.length * 130}vh` }}>
      <div className="pl-sticky">
        <div className="pl-bar"><span /></div>
        {lines.map((l, i) => (
          <h2 className="pl-line" key={i}>
            {l.split(' ').map((w, j) => <Fragment key={j}><span className="pwrap"><span className="pw">{w}</span></span>{' '}</Fragment>)}
          </h2>
        ))}
      </div>
    </section>
  )
}
