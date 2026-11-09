import { useEffect, useRef } from 'react'

// One canvas engine, many moods: petals/flowers, hearts, confetti, dust, embers, code rain, snow, sparkles, pixels, steam, bubbles.
const rnd = (a, b) => a + Math.random() * (b - a)
const PAL = {
  petals: ['#ff2d6f', '#e11d48', '#ff6b8f', '#ff9eb5', '#ffc2d1', '#b0123a'],
  flowers: ['#ff2d6f', '#e11d48', '#ff8fab', '#ffc2d1', '#ff5c8a'],
  hearts: ['#e5195a', '#ff5c8a', '#ff8fab', '#ffb3c6', '#c9184a'],
  confetti: ['#7a3cff', '#ff4d8d', '#ffbe0b', '#06d6a0', '#3a86ff', '#fb5607'],
  dust: ['#ffffff', '#ffd9e2', '#ffe9b0'],
  embers: ['#ff8a5b', '#ffb347', '#ffd9a0', '#ff5e8a'],
  code: ['#39ff88', '#1fbf62', '#a2ffd0'],
  snow: ['#ffffff', '#e6f4ff', '#fff0f0'],
  sparkle: ['#ffffff', '#ff7ac8', '#ffd1ec', '#b7f0ff', '#fff3a8'],
  pixels: ['#ff2bd6', '#00f0ff', '#ffe600', '#7cff3b', '#ffffff'],
  steam: ['#ffffff', '#ffe4e1'],
  bubbles: ['#ffffff', '#bfe3ff', '#fff3a8'],
}
const GLYPHS = 'ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍ01<>/{}=;♥'.split('')

function make(mode, w, h, scatter) {
  const c = PAL[mode] ? PAL[mode][Math.floor(Math.random() * PAL[mode].length)] : '#fff'
  const p = { c, x: rnd(0, w), y: scatter ? rnd(0, h) : rnd(-60, -10), r: rnd(0, 6.28), vr: rnd(-0.03, 0.03), ph: rnd(0, 6.28), s: rnd(0.6, 1.4) }
  const up = (o) => Object.assign(p, o, { y: scatter ? p.y : h + 30 })
  if (mode === 'petals') Object.assign(p, { size: rnd(10, 22), vy: rnd(0.5, 1.4), vx: rnd(-0.3, 0.5), flower: Math.random() < 0.22 })
  else if (mode === 'flowers') Object.assign(p, { size: rnd(12, 28), vy: rnd(0.4, 1.1), vx: rnd(-0.3, 0.3), flower: Math.random() < 0.7 })
  else if (mode === 'hearts') up({ size: rnd(8, 20), vy: -rnd(0.4, 1.1), vx: rnd(-0.2, 0.2) })
  else if (mode === 'confetti') Object.assign(p, { size: rnd(6, 12), vy: rnd(1, 2.6), vx: rnd(-0.6, 0.6) })
  else if (mode === 'dust') up({ size: rnd(1, 3.2), vy: -rnd(0.05, 0.3), vx: rnd(-0.1, 0.2) })
  else if (mode === 'embers') up({ size: rnd(1, 3.5), vy: -rnd(0.3, 1.1), vx: rnd(-0.3, 0.3) })
  else if (mode === 'code') Object.assign(p, { size: rnd(11, 16), vy: rnd(1.5, 4), vx: 0, g: GLYPHS[Math.floor(Math.random() * GLYPHS.length)], x: Math.floor(rnd(0, w) / 18) * 18 })
  else if (mode === 'snow') Object.assign(p, { size: rnd(1.5, 4.5), vy: rnd(0.6, 1.8), vx: rnd(-0.3, 0.3) })
  else if (mode === 'sparkle') Object.assign(p, { size: rnd(5, 14), vy: rnd(-0.2, 0.5), vx: rnd(-0.2, 0.2), y: scatter ? p.y : rnd(0, h), life2: rnd(0, 6.28) })
  else if (mode === 'pixels') Object.assign(p, { size: Math.floor(rnd(2, 5)) * 4, vy: -rnd(0.3, 1.2), vx: 0, x: Math.floor(rnd(0, w) / 12) * 12, y: scatter ? p.y : h + 20 })
  else if (mode === 'steam') up({ size: rnd(20, 60), vy: -rnd(0.3, 0.8), vx: rnd(-0.2, 0.2) })
  else if (mode === 'bubbles') up({ size: rnd(6, 26), vy: -rnd(0.4, 1.2), vx: rnd(-0.2, 0.2) })
  return p
}
const COUNT = { petals: 38, flowers: 30, hearts: 30, confetti: 70, dust: 55, embers: 60, code: 40, snow: 110, sparkle: 40, pixels: 40, steam: 14, bubbles: 30 }

function flowerPath(ctx, s) {
  for (let i = 0; i < 5; i++) {
    ctx.save(); ctx.rotate((i * 6.2832) / 5)
    ctx.beginPath(); ctx.ellipse(0, -s * 0.5, s * 0.34, s * 0.55, 0, 0, 6.2832); ctx.fill()
    ctx.restore()
  }
}
function draw(ctx, mode, p, t) {
  ctx.save(); ctx.translate(p.x, p.y); ctx.fillStyle = p.c
  if (mode === 'petals' || mode === 'flowers') {
    ctx.rotate(p.r)
    if (p.flower) {
      ctx.globalAlpha = 0.9; ctx.rotate(Math.sin(t * 0.0008 + p.ph) * 0.4); flowerPath(ctx, p.size)
      ctx.fillStyle = '#ffd166'; ctx.beginPath(); ctx.arc(0, 0, p.size * 0.16, 0, 6.2832); ctx.fill()
    } else {
      ctx.scale(1, Math.abs(Math.cos(p.ph + t * 0.002 * p.s)) * 0.8 + 0.25); ctx.globalAlpha = 0.9
      const s = p.size; ctx.beginPath(); ctx.moveTo(0, -s); ctx.bezierCurveTo(s * 0.9, -s * 0.6, s * 0.8, s * 0.6, 0, s); ctx.bezierCurveTo(-s * 0.8, s * 0.6, -s * 0.9, -s * 0.6, 0, -s); ctx.fill()
    }
  } else if (mode === 'hearts') {
    ctx.rotate(Math.sin(t * 0.001 + p.ph) * 0.4); ctx.globalAlpha = 0.75; const s = p.size
    ctx.beginPath(); ctx.moveTo(0, s * 0.35); ctx.bezierCurveTo(-s, -s * 0.3, -s * 0.4, -s, 0, -s * 0.4); ctx.bezierCurveTo(s * 0.4, -s, s, -s * 0.3, 0, s * 0.35); ctx.fill()
  } else if (mode === 'confetti') {
    ctx.rotate(p.r); ctx.scale(1, Math.cos(p.ph + t * 0.004)); ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2)
  } else if (mode === 'code') {
    ctx.font = `${p.size}px "JetBrains Mono", monospace`; ctx.globalAlpha = 0.5; ctx.fillText(p.g, 0, 0)
  } else if (mode === 'sparkle') {
    const k = 0.5 + 0.5 * Math.sin(t * 0.004 + p.life2); const s = p.size * (0.4 + k); ctx.globalAlpha = 0.3 + k * 0.7; ctx.rotate(p.r)
    ctx.beginPath(); ctx.moveTo(0, -s); ctx.quadraticCurveTo(0, 0, s, 0); ctx.quadraticCurveTo(0, 0, 0, s); ctx.quadraticCurveTo(0, 0, -s, 0); ctx.quadraticCurveTo(0, 0, 0, -s); ctx.fill()
  } else if (mode === 'pixels') {
    ctx.globalAlpha = 0.8; ctx.fillRect(0, 0, p.size, p.size)
  } else if (mode === 'steam') {
    ctx.globalAlpha = 0.12 + 0.08 * Math.sin(p.ph); ctx.filter = 'blur(10px)'; ctx.beginPath(); ctx.arc(0, 0, p.size, 0, 6.2832); ctx.fill()
  } else if (mode === 'bubbles') {
    ctx.globalAlpha = 0.5; ctx.strokeStyle = p.c; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(0, 0, p.size, 0, 6.2832); ctx.stroke()
    ctx.globalAlpha = 0.25; ctx.beginPath(); ctx.arc(-p.size * 0.3, -p.size * 0.3, p.size * 0.25, 0, 6.2832); ctx.fill()
  } else {
    ctx.globalAlpha = mode === 'snow' ? 0.85 : 0.55 + Math.sin(t * 0.002 + p.ph) * 0.3
    ctx.shadowColor = p.c; ctx.shadowBlur = mode === 'embers' ? 10 : 6
    ctx.beginPath(); ctx.arc(0, 0, p.size, 0, 6.28); ctx.fill()
  }
  ctx.restore()
}

export default function Particles({ mode = 'petals', interactive = false, intensity = 1, onPetalClick, style }) {
  const ref = useRef(null)
  const cb = useRef(onPetalClick); cb.current = onPetalClick
  const mouse = useRef({ x: -999, y: -999 })
  const burst = useRef(null)

  useEffect(() => {
    const cv = ref.current; if (!cv) return
    const ctx = cv.getContext('2d')
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let w, h, raf, parts = [], dpr = Math.min(window.devicePixelRatio || 1, 2), last = 0
    const resize = () => {
      w = cv.clientWidth; h = cv.clientHeight; cv.width = w * dpr; cv.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    const n = Math.round((COUNT[mode] || 40) * intensity * (w < 700 ? 0.6 : 1))
    parts = Array.from({ length: n }, () => make(mode, w, h, true))
    window.addEventListener('resize', resize)

    burst.current = (x, y, k = 18) => {
      for (let i = 0; i < k; i++) {
        const p = make(mode === 'petals' || mode === 'flowers' ? mode : 'petals', w, h, true); p.x = x; p.y = y
        const a = rnd(0, 6.28), v = rnd(2, 7); p.bx = Math.cos(a) * v; p.by = Math.sin(a) * v - 2; p.life = 1
        parts.push(p)
      }
    }
    const tick = (t) => {
      raf = requestAnimationFrame(tick)
      if (t - last < 14) return
      last = t
      ctx.clearRect(0, 0, w, h)
      for (let i = parts.length - 1; i >= 0; i--) {
        const p = parts[i]
        const dm = p.life != null ? 'petals' : mode
        if (p.life != null) { p.x += p.bx; p.y += p.by; p.bx *= 0.95; p.by = p.by * 0.95 + 0.12; p.life -= 0.012; if (p.life <= 0) { parts.splice(i, 1); continue }; ctx.globalAlpha = p.life }
        else {
          p.ph += 0.02; p.r += p.vr
          p.x += p.vx + Math.sin(p.ph) * (mode === 'petals' || mode === 'flowers' ? 0.7 : mode === 'confetti' || mode === 'snow' ? 0.5 : 0.2); p.y += p.vy
          if (interactive) {
            const dx = p.x - mouse.current.x, dy = p.y - mouse.current.y, d2 = dx * dx + dy * dy
            if (d2 < 9000) { const f = (1 - d2 / 9000) * 2.2; p.x += (dx / Math.sqrt(d2 + 1)) * f; p.y += (dy / Math.sqrt(d2 + 1)) * f }
          }
          const out = p.vy < 0 ? p.y < -40 : p.y > h + 40
          if (mode === 'sparkle') { if (p.y > h + 20 || p.y < -20) p.y = rnd(0, h) }
          else if (out || p.x < -60 || p.x > w + 60) { Object.assign(p, make(mode, w, h, false)) }
        }
        draw(ctx, dm, p, t)
      }
      ctx.globalAlpha = 1
    }
    if (!reduce) raf = requestAnimationFrame(tick)
    else { ctx.clearRect(0, 0, w, h); parts.forEach((p) => draw(ctx, mode, p, 0)) }

    const rect = () => cv.getBoundingClientRect()
    const move = (e) => { const r = rect(); mouse.current = { x: e.clientX - r.left, y: e.clientY - r.top } }
    const click = (e) => {
      const r = rect(); const x = e.clientX - r.left, y = e.clientY - r.top
      let hit = null
      for (const p of parts) { if (p.life == null && Math.hypot(p.x - x, p.y - y) < (p.size || 14) * 2.4) { hit = p; break } }
      burst.current?.(hit ? hit.x : x, hit ? hit.y : y, hit ? 16 : 10)
      cb.current?.({ x: e.clientX, y: e.clientY, hit: !!hit })
    }
    if (interactive) {
      window.addEventListener('pointermove', move)
      cv.addEventListener('click', click)
    }
    return () => {
      cancelAnimationFrame(raf); window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', move); cv.removeEventListener('click', click)
    }
  }, [mode, interactive, intensity])

  return <canvas ref={ref} className="particles" style={style} />
}
