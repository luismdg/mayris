import { useEffect, useRef, useState } from 'react'
import { THEMES } from '../themes'
import { scrollToEl, stopScroll, resumeScroll } from '../motion'
import { fmtDate } from '../store'
import { SONGS, useMusic, toggle, toggleMute, ytUrl } from '../music'
import Sticker, { THEME_ICON } from './Stickers'
import { canEdit, openEditor } from '../edit'

export default function TopMenu({ story, activeId, songOf }) {
  const [hidden, setHidden] = useState(false)   // slid away by scrolling down
  const [folded, setFolded] = useState(false)   // folded by hand with the little tab
  const [open, setOpen] = useState(false)
  const last = useRef(0)
  const m = useMusic()
  const ch = story.shown.find((c) => c.id === activeId)
  const song = SONGS[m.key]

  useEffect(() => {
    const on = () => {
      const y = window.scrollY
      if (y < 80) setHidden(false)
      else if (y > last.current + 8) setHidden(true)
      else if (y < last.current - 8) setHidden(false)
      last.current = y
    }
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])
  useEffect(() => { open ? stopScroll() : resumeScroll(); document.documentElement.classList.toggle('no-scroll', open) }, [open])
  useEffect(() => { const k = (e) => e.key === 'Escape' && setOpen(false); window.addEventListener('keydown', k); return () => window.removeEventListener('keydown', k) }, [])

  const go = (sel) => { setOpen(false); setTimeout(() => scrollToEl(sel), 150) }
  const off = folded || (hidden && !open)
  return (
    <>
      <header className={`topbar ${off ? 'off' : ''}`}>
        <button className="tb-brand" onClick={() => go('#intro')}><span>Para {story.site.to}</span></button>
        <div className="tb-now" aria-live="polite">
          {ch ? <><b>{ch.title}</b><i>{fmtDate(ch.start, { month: 'short', year: 'numeric' })}</i></> : <b>{story.site.to} · {story.site.from}</b>}
        </div>
        <div className="tb-music">
          <button className={`tb-note ${m.playing ? 'on' : ''}`} onClick={toggle} aria-label={m.playing ? 'Pausar música' : 'Activar música'} title={m.playing ? 'Pausar' : 'Activar música'}>
            {m.playing ? '❚❚' : '♪'}
          </button>
          {song && m.armed && <span className="tb-song"><b>{song.title}</b><i>{song.artist}</i></span>}
          {m.armed && <button className="tb-mute" onClick={toggleMute} aria-label={m.muted ? 'Quitar silencio' : 'Silenciar'}>{m.muted ? '🔇' : '🔊'}</button>}
          {m.error && <a className="tb-err" href={ytUrl(SONGS[m.error].yt)} target="_blank" rel="noopener noreferrer">abrir en YouTube</a>}
        </div>
        <button className="tb-burger" onClick={() => setOpen((o) => !o)} aria-label="Menú" aria-expanded={open}><i /><i /><i /></button>
      </header>
      <button className={`tb-tab ${off ? 'off' : ''}`} onClick={() => { setFolded((f) => !f); setHidden(false) }} aria-label={folded ? 'Mostrar menú' : 'Ocultar menú'}>
        <span>{folded ? '▾' : '▴'}</span>
      </button>

      <div className={`menu ${open ? 'open' : ''}`} aria-hidden={!open}>
        <div className="menu-in">
          <button className="menu-x" onClick={() => setOpen(false)} aria-label="Cerrar">×</button>
          <p className="menu-eyebrow">navegar</p>
          <div className="menu-quick">
            <button onClick={() => go('#intro')}>Inicio</button>
            <button onClick={() => go('#prologue')}>Cómo empezó</button>
            <button onClick={() => go('#recetas')}>Recetas</button>
            <button onClick={() => go('#finale')}>La carta final</button>
            {canEdit && <button className="edit" onClick={() => { setOpen(false); openEditor() }}>✎ Configurar</button>}
          </div>
          <p className="menu-eyebrow">capítulos</p>
          <ol className="menu-grid">
            {story.shown.map((c, i) => {
              const s = SONGS[songOf(c)]
              return (
                <li key={c.id}>
                  <button onClick={() => go(`#ch-${c.id}`)} className={`mi theme-${c.theme} ${c.id === activeId ? 'now' : ''}`} style={{ '--c': THEMES[c.theme].accent }}>
                    <Sticker name={THEME_ICON[c.theme] || 'heart'} size={46} className="mi-ico" />
                    <span><small>{String(i + 1).padStart(2, '0')} · {fmtDate(c.start, { month: 'short', year: '2-digit' })}</small><b>{c.title}</b>{s && <em>♪ {s.title}</em>}</span>
                  </button>
                </li>
              )
            })}
          </ol>
          <p className="menu-foot">Esto es solo una parte de todo lo que hemos vivido. Faltan muchísimos recuerdos por agregar.</p>
        </div>
      </div>
    </>
  )
}
