import { useEffect, useRef, useState } from 'react'
import { THEMES } from '../themes'
import { scrollToEl, stopScroll, resumeScroll } from '../motion'
import { fmtDate } from '../store'
import { SONGS, useMusic, toggle, toggleMute, ytUrl } from '../music'
import Sticker, { THEME_ICON } from './Stickers'
import { canEdit, openEditor } from '../edit'

const lum = (hex) => { const n = parseInt(hex.slice(1), 16); return (0.299 * (n >> 16) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) / 255 }

export default function TopMenu({ story, activeId, songOf }) {
  const [hidden, setHidden] = useState(false)
  const [open, setOpen] = useState(false)
  const [discOpen, setDiscOpen] = useState(false)
  const last = useRef(0)
  const m = useMusic()
  const ch = story.shown.find((c) => c.id === activeId)
  const song = SONGS[m.key]
  // text colour follows the background of the section underneath
  const lightBg = activeId === 'recetas' ? true : ch ? lum(THEMES[ch.theme].bg) > 0.58 : false
  const accent = ch ? THEMES[ch.theme].accent : '#ff3d71'

  useEffect(() => {
    const on = () => {
      const y = window.scrollY
      if (y < 60) setHidden(false)
      else if (y > last.current + 6) setHidden(true)   // scrolling down -> disappears
      else if (y < last.current - 6) setHidden(false)  // scrolling up -> appears
      last.current = y
    }
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])
  useEffect(() => { open ? stopScroll() : resumeScroll(); document.documentElement.classList.toggle('no-scroll', open) }, [open])
  useEffect(() => { const k = (e) => e.key === 'Escape' && setOpen(false); window.addEventListener('keydown', k); return () => window.removeEventListener('keydown', k) }, [])

  const go = (sel) => { setOpen(false); setHidden(false); setTimeout(() => scrollToEl(sel), 150) }
  const off = hidden && !open
  return (
    <>
      <header className={`topbar ${lightBg ? 'ink-dark' : 'ink-light'} ${open ? 'is-open' : ''} ${off ? 'off' : ''}`}>
        <button className="tb-brand" onClick={() => go('#intro')}>Para {story.site.to}</button>
        <div className="tb-now" aria-live="polite">{ch ? <><b>{ch.title}</b><i>{fmtDate(ch.start, { month: 'short', year: 'numeric' })}</i></> : null}</div>
        <button className="tb-burger" onClick={() => setOpen((o) => !o)} aria-label="Menú" aria-expanded={open}><i /><i /><i /></button>
      </header>
      <button className={`tb-tab ${lightBg ? 'ink-dark' : 'ink-light'}`} onClick={() => setHidden((h) => !h)} aria-label={off ? 'Mostrar menú' : 'Ocultar menú'}>{off ? '▾' : '▴'}</button>

      <div className={`disc-wrap ${discOpen || !m.armed ? 'peek' : ''}`} style={{ '--ac': accent }}>
        <div className="disc-info" aria-live="polite">
          {song && m.armed ? <><b>{song.title}</b><i>{song.artist}</i></> : <><b>Música</b><i>toca el disco</i></>}
          <span>
            {m.armed && <button onClick={toggleMute} aria-label={m.muted ? 'Quitar silencio' : 'Silenciar'}>{m.muted ? 'sin sonido' : 'con sonido'}</button>}
            {m.error && <a href={ytUrl(SONGS[m.error].yt)} target="_blank" rel="noopener noreferrer">abrir en YouTube</a>}
          </span>
        </div>
        <button className={`disc ${m.playing ? 'spin' : ''}`} onClick={() => { toggle(); setDiscOpen(true); setTimeout(() => setDiscOpen(false), 3500) }} aria-label={m.playing ? 'Pausar música' : 'Activar música'} aria-pressed={m.playing}>
          <svg viewBox="0 0 100 100" aria-hidden>
            <circle cx="50" cy="50" r="48" fill="#0d0d12" stroke="#000" strokeWidth="2" />
            {[40, 34, 28].map((r) => <circle key={r} cx="50" cy="50" r={r} fill="none" stroke="#ffffff1c" strokeWidth="1.2" />)}
            <path d="M50 2A48 48 0 0 1 98 50" stroke="#ffffff33" strokeWidth="5" fill="none" strokeLinecap="round" />
            <circle cx="50" cy="50" r="17" fill="var(--ac)" /><circle cx="50" cy="50" r="3.5" fill="#0d0d12" />
            {!m.playing && <path d="M45 41l14 9-14 9z" fill="#fff" />}
          </svg>
        </button>
      </div>

      <div className={`menu ${open ? 'open' : ''}`} aria-hidden={!open}>
        <div className="menu-in">
          <button className="menu-x" onClick={() => setOpen(false)} aria-label="Cerrar">×</button>
          <p className="menu-eyebrow">navegar</p>
          <div className="menu-quick">
            <button onClick={() => go('#intro')}>Inicio</button>
            <button onClick={() => go('#prologue')}>Introducción</button>
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
          <p className="menu-foot">Esto es solo una parte de todo lo que hemos vivido. Faltan muchos recuerdos por agregar.</p>
        </div>
      </div>
    </>
  )
}
