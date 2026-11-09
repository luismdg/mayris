import { useEffect, useRef, useState } from 'react'
import { mediaUrl, fmtDate, setMedia } from '../store'
import { canEdit } from '../edit'
import { TAGS } from '../themes'

// items: list in the current chapter, index: current one
export default function Lightbox({ items, index, setIndex, onClose, themeKey, chapterTitle }) {
  const item = items[index]
  const [sound, setSound] = useState(true)
  const touch = useRef(null)
  const go = (d) => setIndex((i) => (i + d + items.length) % items.length)

  useEffect(() => {
    const k = (e) => {
      if (e.target.tagName === 'TEXTAREA' || e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') { if (e.key === 'Escape') e.target.blur(); return }
      if (e.key === 'Escape') onClose(); if (e.key === 'ArrowRight') go(1); if (e.key === 'ArrowLeft') go(-1)
    }
    window.addEventListener('keydown', k)
    document.documentElement.classList.add('no-scroll')
    return () => { window.removeEventListener('keydown', k); document.documentElement.classList.remove('no-scroll') }
  }, [items.length])

  if (!item) return null
  const isVid = item.type === 'video'
  const isLive = item.type === 'live'
  return (
    <div className={`lightbox theme-${themeKey}`} onClick={onClose} role="dialog" aria-modal="true"
      onTouchStart={(e) => (touch.current = e.touches[0].clientX)}
      onTouchEnd={(e) => { const d = e.changedTouches[0].clientX - touch.current; if (Math.abs(d) > 60) go(d < 0 ? 1 : -1) }}>
      <button className="lb-x" onClick={onClose} aria-label="Cerrar">×</button>
      <button className="lb-nav prev" onClick={(e) => (e.stopPropagation(), go(-1))} aria-label="Anterior">‹</button>
      <button className="lb-nav next" onClick={(e) => (e.stopPropagation(), go(1))} aria-label="Siguiente">›</button>
      <div className="lb-stage" onClick={(e) => e.stopPropagation()}>
        <div className="lb-media" key={item.id}>
          {isVid ? (
            <video src={mediaUrl(item.video)} poster={mediaUrl(item.src)} controls autoPlay playsInline loop muted={!sound} />
          ) : isLive ? (
            <>
              <img src={mediaUrl(item.src)} alt={item.caption} />
              <video src={mediaUrl(item.video)} autoPlay muted loop playsInline />
            </>
          ) : (
            <img src={mediaUrl(item.src)} alt={item.caption} />
          )}
        </div>
        <div className="lb-meta">
          <div className="lb-top">
            <span>{chapterTitle}</span>
            <span>{fmtDate(item.date, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
            <span>{index + 1} / {items.length}</span>
          </div>
          {canEdit ? (
            <div className="lb-edit">
              <textarea value={item.caption} placeholder={item.desc ? `Ej.: ${item.desc}` : 'Escribe lo que pasó en este recuerdo…'} rows={2}
                onChange={(e) => setMedia(item.id, 'caption', e.target.value)} />
              <select value={item.tag || ''} onChange={(e) => setMedia(item.id, 'tag', e.target.value)}>
                <option value="">— etiqueta —</option>{TAGS.map((t) => <option key={t}>{t}</option>)}
              </select>
              <button onClick={() => { setMedia(item.id, 'hidden', true); go(1) }}>Ocultar</button>
            </div>
          ) : (
            item.caption && <p className="lb-cap">{item.caption}</p>
          )}
          {item.tag && !canEdit && <span className="lb-tag">{item.tag}</span>}
          {isVid && item.hasAudio && <button className="lb-sound" onClick={() => setSound((s) => !s)}>{sound ? 'con sonido' : 'sin sonido'}</button>}
          {item.trimmed && <span className="lb-tag">fragmento de {Math.round(item.dur)} s</span>}
        </div>
      </div>
    </div>
  )
}
