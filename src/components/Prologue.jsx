import { useLayoutEffect, useRef } from 'react'
import { gsap, reduceMotion } from '../motion'
import { fmtDate } from '../store'

const daysSince = (iso) => Math.max(0, Math.floor((Date.now() - new Date(iso + 'T00:00:00')) / 864e5))

// Introducción corta: el día en que todo empezó y los días en que nos fuimos enamorando.
export default function Prologue({ site, counts }) {
  const root = useRef(null)
  const paras = site.prologue.map((l) => l
    .replace('{days}', daysSince(site.startDate).toLocaleString('es-MX'))
    .replace('{photos}', counts.photos).replace('{videos}', counts.videos).replace('{total}', counts.total))

  useLayoutEffect(() => {
    if (reduceMotion()) return
    const ctx = gsap.context(() => {
      gsap.utils.toArray('.pi-el', root.current).forEach((el) => gsap.from(el, { y: 26, opacity: 0, duration: 1.1, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 88%' } }))
    }, root)
    return () => ctx.revert()
  }, [paras.join('|')])

  return (
    <section className="intro-text" id="prologue" ref={root}>
      <div>
        <small className="pi-el">{fmtDate(site.startDate, { day: 'numeric', month: 'long', year: 'numeric' })}</small>
        {paras.map((p, i) => <p className="pi-el" key={i}>{p}</p>)}
      </div>
    </section>
  )
}
