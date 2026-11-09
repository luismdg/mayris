import { useEffect, useMemo, useState } from 'react'
import { useStory, fmtDate } from './store'
import { THEMES } from './themes'
import { startSmoothScroll, ScrollTrigger, scrollToEl, gsap } from './motion'
import Intro from './components/Intro'
import Prologue from './components/Prologue'
import Chapter from './components/Chapter'
import Finale from './components/Finale'
import Particles from './components/Particles'
import Config from './components/Config'
import Recipes from './components/Recipes'
import TopMenu from './components/TopMenu'
import { playFor, autoStart } from './music'
import { canEdit } from './edit'

function Loader({ to, done }) {
  const [pct, setPct] = useState(0)
  const [leaving, setLeaving] = useState(false)
  useEffect(() => {
    let raf, t0 = performance.now(), fontsOk = false
    const fams = ['Anton', 'Bebas Neue', 'Bungee', 'Caveat', 'Cormorant Garamond', 'Fredoka', 'Homemade Apple', 'Inter', 'JetBrains Mono', 'Permanent Marker', 'Playfair Display', 'Press Start 2P', 'Syne', 'VT323']
    Promise.all(fams.map((f) => document.fonts?.load(`16px "${f}"`).catch(() => {}))).then(() => document.fonts?.ready).then(() => { fontsOk = true }).catch(() => { fontsOk = true })
    const tick = (t) => {
      const p = Math.min(1, (t - t0) / 2200)
      setPct(Math.round((fontsOk || p < 0.8 ? p : 0.8) * 100))
      if (p >= 1 && fontsOk) { setLeaving(true); setTimeout(done, 900) } else raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])
  return (
    <div className={`loader ${leaving ? 'leave' : ''}`}>
      <div className="loader-panel">
        <h1>{to.toUpperCase()}</h1>
        <p>Para ti, que sigues siendo parte de casa.</p>
        <div className="loader-bar"><span style={{ transform: `scaleX(${pct / 100})` }} /></div>
        <small>Cargando {pct}%</small>
      </div>
    </div>
  )
}

function Nav({ chapters, active }) {
  return (
    <>
      <div className="progress"><span /></div>
      <nav className="dots" aria-label="Capítulos">
        {chapters.map((c) => (
          <button key={c.id} className={active === c.id ? 'on' : ''} onClick={() => scrollToEl(`#ch-${c.id}`)} style={{ '--c': THEMES[c.theme].accent }} aria-label={c.title}>
            <i /><span>{c.title}</span>
          </button>
        ))}
      </nav>
    </>
  )
}

export default function App() {
  const story = useStory()
  const [phase, setPhase] = useState('loading')
  const [active, setActive] = useState(null)
  const chapters = story.shown
  const pool = useMemo(() => chapters.flatMap((c) => c.items), [chapters])
  const activeCh = chapters.find((c) => c.id === active)
  const fx = activeCh ? THEMES[activeCh.theme].fx : null

  useEffect(() => {
    if (phase === 'loading') return
    startSmoothScroll()
    autoStart()
    const prog = gsap.to('.progress span', { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: 0.2 } })
    return () => { prog.scrollTrigger?.kill(); prog.kill() }
  }, [phase])

  useEffect(() => {
    if (phase === 'loading') return
    const a = ScrollTrigger.create({ trigger: '#prologue', start: 'top 60%', onEnter: () => setActive(null), onEnterBack: () => setActive(null) })
    const r2 = ScrollTrigger.create({ trigger: '#recetas', start: 'top 60%', onEnter: () => setActive('recetas'), onLeaveBack: () => setActive(chapters.at(-1)?.id ?? null) })
    const b = ScrollTrigger.create({ trigger: '#finale', start: 'top 60%', onEnter: () => setActive('finale'), onLeaveBack: () => setActive('recetas') })
    const r = setTimeout(() => ScrollTrigger.refresh(), 600)
    const r3 = setTimeout(() => ScrollTrigger.refresh(), 2500), r4 = setTimeout(() => ScrollTrigger.refresh(), 6000)
    const onLoad = () => ScrollTrigger.refresh(); window.addEventListener('load', onLoad)
    return () => { a.kill(); b.kill(); r2.kill(); clearTimeout(r); clearTimeout(r3); clearTimeout(r4); window.removeEventListener('load', onLoad) }
  }, [phase, chapters.length])

  useEffect(() => { const k = active === 'recetas' ? 'dieforyou' : activeCh?.song; if (k) playFor(k) }, [active, activeCh?.id, activeCh?.song])

  const dataTheme = active === 'finale' ? 'petals' : active === 'recetas' ? 'kitchen' : activeCh?.theme || 'petals'
  return (
    <div className="app" data-active={dataTheme}>
      {phase === 'loading' && <Loader to={story.site.to} done={() => setPhase('intro')} />}
      <Intro site={story.site} pool={pool} ready={phase !== 'loading'} />
      <Prologue site={story.site} counts={story.counts} />
      {fx && (
        <div className={`fx fx-${fx}`} key={fx} aria-hidden>
          {fx === 'lasers' && <><span className="beam b1" /><span className="beam b2" /><span className="beam b3" /><span className="scan" /></>}
          {fx === 'speed' && <><span className="streak s1" /><span className="streak s2" /><span className="streak s3" /></>}
          {fx === 'stage' && <><span className="spot s1" /><span className="spot s2" /><span className="spot s3" /><span className="haze" /></>}
          {fx === 'asphalt' && <><span className="lane" /><span className="lane l2" /><span className="headlight" /></>}
          {['dust', 'embers', 'hearts', 'confetti', 'code', 'petals', 'flowers', 'snow', 'sparkle', 'pixels', 'steam', 'bubbles'].includes(fx) && <Particles mode={fx} intensity={0.8} />}
        </div>
      )}
      {chapters.map((ch, i) => (
        <Chapter key={ch.id} ch={ch} index={i} total={chapters.length} prevBg={THEMES[(chapters[i - 1] || { theme: 'petals' }).theme].bg} onActive={setActive} />
      ))}
      <Recipes />
      <Finale site={story.site} counts={story.counts} all={pool} />
      {phase !== 'loading' && <TopMenu story={story} activeId={active} songOf={(c) => c.song} />}
      <Config />
    </div>
  )
}
