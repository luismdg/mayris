import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import Particles from './Particles'
import Sticker from './Stickers'
import { gsap, reduceMotion, scrollToEl } from '../motion'
import { mediaUrl, fmtDate } from '../store'

function useNow() {
  const [n, setN] = useState(Date.now())
  useEffect(() => { const t = setInterval(() => setN(Date.now()), 1000); return () => clearInterval(t) }, [])
  return n
}
function Counter({ since, label }) {
  const now = useNow()
  const ms = Math.max(0, now - new Date(since + 'T00:00:00'))
  const d = Math.floor(ms / 864e5), h = Math.floor(ms / 36e5) % 24, m = Math.floor(ms / 6e4) % 60, s = Math.floor(ms / 1e3) % 60
  return (
    <div className="counter">
      <small>{label} · {fmtDate(since)}</small>
      <div><b>{d.toLocaleString('es-MX')}</b><span>días</span><b>{String(h).padStart(2, '0')}</b><span>h</span><b>{String(m).padStart(2, '0')}</b><span>m</span><b>{String(s).padStart(2, '0')}</b><span>s</span></div>
    </div>
  )
}

export default function Finale({ site, counts, all }) {
  const root = useRef(null)
  const cols = [0, 1, 2, 3].map((c) => all.filter((_, i) => i % 4 === c).slice(0, 14))
  useLayoutEffect(() => {
    if (reduceMotion()) return
    const ctx = gsap.context(() => {
      gsap.utils.toArray('.wall-col').forEach((c, i) => gsap.fromTo(c, { yPercent: i % 2 ? -12 : 0 }, { yPercent: i % 2 ? 0 : -12, ease: 'none', scrollTrigger: { trigger: root.current, scrub: true, start: 'top bottom', end: 'bottom top' } }))
      gsap.from('.fin-letter p', { y: 40, opacity: 0, stagger: 0.25, duration: 1.2, ease: 'power3.out', scrollTrigger: { trigger: '.fin-letter', start: 'top 75%' } })
      gsap.from('.fin-title', { scale: 0.7, opacity: 0, duration: 1.6, ease: 'expo.out', scrollTrigger: { trigger: '.fin-title', start: 'top 85%' } })
    }, root)
    return () => ctx.revert()
  }, [])
  return (
    <section className="finale theme-petals" id="finale" ref={root} data-theme="petals">
      <div className="wall" aria-hidden>
        {cols.map((c, i) => <div className="wall-col" key={i}>{c.map((m) => <img key={m.id} src={mediaUrl(m.src)} loading="lazy" alt="" style={{ aspectRatio: `${m.w}/${m.h}`, background: m.color }} />)}</div>)}
      </div>
      <div className="wall-shade" />
      <div className="fin-friends" aria-hidden><Sticker name="snoopy" size={200} className="dc-bob" /><Sticker name="minion" size={110} className="dc-hop" /><Sticker name="bolt" size={90} className="dc-twinkle" /><Sticker name="woodstock" size={70} className="dc-hop" /></div>
      <div className="fin-inner">
        <div className="fin-letter">
          {site.letter.split(/\n\s*\n/).map((p, i) => <p key={i}>{p.split('\n').map((l, j) => <span key={j}>{l}<br /></span>)}</p>)}
        </div>
        <div className="likes" aria-label={site.likesTitle}>
          <small>{site.likesTitle}</small>
          {[0, 1].map((r) => (
            <div className={`likes-row r${r}`} key={r}><div>{[...Array(2)].flatMap((_, k) => site.likes.filter((_, i) => i % 2 === r).map((l, i) => <span key={k + '-' + i}>{l}<i>✿</i></span>))}</div></div>
          ))}
        </div>
        <p className="fin-kicker">{site.finaleKicker}</p>
        <h2 className="fin-title">{site.finaleTitle}</h2>
        <div className="counters">
          <Counter since={site.startDate} label="Desde nuestro primer recuerdo" />
          <Counter since={site.anniversaryDate} label="Desde que somos nosotros" />
        </div>
        <p className="fin-stats">{counts.total} recuerdos · {counts.photos} fotos y live photos · {counts.videos} videos</p>
        <button className="intro-btn" onClick={() => scrollToEl('#intro')}>Volver a empezar <i>↑</i></button>
      </div>
      <Particles mode="petals" intensity={0.7} />
    </section>
  )
}
