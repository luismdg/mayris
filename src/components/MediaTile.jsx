import { useEffect, useRef, useState } from 'react'
import { mediaUrl, fmtDate } from '../store'

export function useInView(rootMargin = '250px', once = false) {
  const ref = useRef(null)
  const [vis, setVis] = useState(false)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const io = new IntersectionObserver(([e]) => { setVis(e.isIntersecting); if (e.isIntersecting && once) io.disconnect() }, { rootMargin })
    io.observe(el)
    return () => io.disconnect()
  }, [rootMargin, once])
  return [ref, vis]
}

export function Badge({ item }) {
  if (item.type === 'live') return <span className="badge"><i className="dot" />EN VIVO</span>
  if (item.type === 'video') return <span className="badge"><svg viewBox="0 0 10 10" width="8" height="8"><path d="M1 0l9 5-9 5z" fill="currentColor" /></svg>{Math.round(item.dur)}s</span>
  return null
}

export default function MediaTile({ item, onOpen, auto = true, className = '', style, caption = false, label, children }) {
  const [ref, vis] = useInView()
  const [playing, setPlaying] = useState(false)
  const v = useRef(null)
  const wantsVideo = auto && item.video && vis

  useEffect(() => { if (!wantsVideo) setPlaying(false) }, [wantsVideo])

  return (
    <figure
      ref={ref}
      className={`tile ${className}`}
      style={{ aspectRatio: `${item.w} / ${item.h}`, backgroundColor: item.color, backgroundImage: `url(${item.lqip})`, backgroundSize: 'cover', ...style }}
      onClick={() => onOpen?.(item)}
      tabIndex={0}
      role="button"
      aria-label={item.caption || label || `Recuerdo ${fmtDate(item.date)}`}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), onOpen?.(item))}
    >
      <img src={mediaUrl(item.src)} alt={item.caption || ''} loading="lazy" decoding="async" draggable="false" />
      {wantsVideo && (
        <video
          ref={v} src={mediaUrl(item.video)} muted loop playsInline autoPlay preload="metadata"
          className={playing ? 'on' : ''} onPlaying={() => setPlaying(true)}
        />
      )}
      <Badge item={item} />
      {children}
      {caption && (item.caption || label) && <figcaption>{item.caption || label}</figcaption>}
    </figure>
  )
}
