import { useSyncExternalStore } from 'react'

// yt ids verified against the official channel uploads. To use your own audio file instead, put it in public/music/<key>.mp3
export const SONGS = {
  lloviendo: { title: 'Lloviendo estrellas', artist: 'Cristian Castro', yt: ['V-FlD5R6AqY', 'QnNqUEDDS0A', 'B8rBl4pwN0E'], mood: 'para estar tranquilos' },
  holdon: { title: "Hold On, We're Going Home", artist: 'Drake', yt: ['Ni6izPw1xSU', 'QKYkZnxZ3ZA', 'GxgqpCdOKak'], mood: 'para las cartas' },
  rumores: { title: 'Rumores', artist: 'Joan Sebastian', yt: ['riDCFCCO55g', 'z0e2l--wCJA', 'FL7ktlvZnH8'], mood: 'para querernos' },
  yellow: { title: 'Yellow', artist: 'Coldplay', yt: ['tdVAqxNLXiw', 'q7mlB-adMBc', 'yKNxeF4KMsY'], mood: 'el día que me dijiste que sí' },
  nothin: { title: "Nothin' on You", artist: "B.o.B ft. Bruno Mars", yt: ['63POUDRcK9E', 'u3lz7oSd6JE', '8PTDv_szmL0'], mood: 'para ir a toda velocidad' },
  feeling: { title: 'What a Feeling', artist: 'Irene Cara', yt: ['OtTm41dyYfk', '9HSxzkt0rTM', 'A64KVUfo4ew'], mood: 'para cantar y bailar' },
  dieforyou: { title: 'Die For You', artist: 'The Weeknd', yt: ['2AH5l-vrY9Q', 'QLCpqdqeoII', 'uPD0QOGTmMI'], mood: 'para cocinar' },
  goosebumps: { title: 'goosebumps', artist: 'Travis Scott', yt: ['FhTtYSU7Q7g', '_9XaXHD3680', 'Dst9gZkq1a8'], mood: 'para los conciertos' },
}
export const ytUrl = (ids) => `https://www.youtube.com/watch?v=${[].concat(ids)[0]}`
const bad = new Set()
const okIds = (key) => SONGS[key].yt.filter((id) => !bad.has(id))
let curId = null

let state = { armed: false, key: null, playing: false, muted: false, error: null, local: {} }
const subs = new Set()
const set = (p) => { state = { ...state, ...p }; subs.forEach((f) => f()) }
export const useMusic = () => useSyncExternalStore((f) => (subs.add(f), () => subs.delete(f)), () => state)

const VOL = 0.65
let audio = null, yt = null, ytReady = false, pending = 'lloviendo', fadeT = null, autoMuted = false, userPaused = false

// which songs have a local file?
Object.keys(SONGS).forEach((k) => {
  fetch(`/music/${k}.mp3`, { method: 'HEAD' }).then((r) => { if (r.ok && (r.headers.get('content-type') || '').includes('audio')) set({ local: { ...state.local, [k]: true } }) }).catch(() => {})
})

function loadYT() {
  if (window.YT?.Player) return Promise.resolve()
  return new Promise((res) => {
    const prev = window.onYouTubeIframeAPIReady
    window.onYouTubeIframeAPIReady = () => { prev?.(); res() }
    if (!document.getElementById('yt-api')) { const s = document.createElement('script'); s.id = 'yt-api'; s.src = 'https://www.youtube.com/iframe_api'; document.head.appendChild(s) }
  })
}
let ytP = null
function ensureYT() { return (ytP ||= buildYT()) }
async function buildYT() {
  await loadYT()
  let host = document.getElementById('yt-host')
  if (!host) { host = document.createElement('div'); host.id = 'yt-host'; host.style.cssText = 'position:fixed;left:-9999px;top:0;width:200px;height:200px;pointer-events:none;opacity:0'; document.body.appendChild(host); const inner = document.createElement('div'); inner.id = 'yt-inner'; host.appendChild(inner) }
  await new Promise((res) => {
    yt = new window.YT.Player('yt-inner', {
      width: 200, height: 200, playerVars: { autoplay: 1, controls: 0, playsinline: 1, rel: 0, modestbranding: 1, enablejsapi: 1, origin: location.origin },
      events: {
        onReady: () => { ytReady = true; res() },
        onStateChange: (e) => { if (e.data === 0) { yt.seekTo(0); yt.playVideo() } if (e.data === 1) set({ playing: true, error: null }) },
        onError: () => {
          bad.add(curId)
          const nx = okIds(state.key)[0]
          if (nx) { curId = nx; yt.loadVideoById(nx) } else set({ error: state.key, playing: false })
        },
      },
    })
  })
}
function fade(to, ms = 700, done) {
  clearInterval(fadeT)
  const get = () => (audio && !audio.paused ? audio.volume * 100 : ytReady && yt?.getVolume ? yt.getVolume() : 0)
  const from = get(); const t0 = performance.now()
  fadeT = setInterval(() => {
    const k = Math.min(1, (performance.now() - t0) / ms); const v = from + (to * 100 - from) * k
    if (audio) audio.volume = Math.max(0, Math.min(1, v / 100))
    if (ytReady && yt?.setVolume) yt.setVolume(Math.round(v))
    if (k >= 1) { clearInterval(fadeT); done?.() }
  }, 40)
}
function stopAll() { try { audio?.pause() } catch {} try { yt?.pauseVideo?.() } catch {} }

async function start(key) {
  const s = SONGS[key]; if (!s) return
  set({ key, error: null, playing: false })
  stopAll()
  if (state.local[key]) {
    if (!audio) { audio = new Audio(); audio.loop = true }
    audio.src = `/music/${key}.mp3`; audio.volume = 0; audio.muted = state.muted
    try { await audio.play(); set({ playing: true }); fade(VOL) } catch { set({ error: key }) }
  } else {
    await ensureYT()
    curId = okIds(key)[0] || s.yt[0]; yt.loadVideoById(curId); yt.setVolume(0)
    const gesture = navigator.userActivation ? navigator.userActivation.hasBeenActive : true
    autoMuted = !gesture
    state.muted || autoMuted ? yt.mute() : yt.unMute()
    setTimeout(() => fade(VOL), 600)
  }
}
export function arm() { if (!state.armed) { set({ armed: true }); if (pending) start(pending) } }
export function playFor(key) {
  if (!key || !SONGS[key]) return
  pending = key
  if (!state.armed || state.key === key) return
  const go = () => start(key)
  if (state.playing) fade(0, 450, go); else go()
}
export function toggle() {
  if (!state.armed) { arm(); return }
  userPaused = state.playing
  if (autoMuted) { autoMuted = false; if (ytReady && !state.muted) yt.unMute() }
  if (state.playing) { stopAll(); set({ playing: false }) }
  else if (state.key) { if (state.local[state.key] && audio) { audio.play(); fade(VOL) } else { yt?.playVideo(); setTimeout(() => fade(VOL), 200) } set({ playing: true }) }
  else if (pending) start(pending)
}
export function toggleMute() {
  const m = !state.muted; set({ muted: m })
  if (audio) audio.muted = m
  if (ytReady) m ? yt.mute() : yt.unMute()
}

// Starts by itself on the first scroll / touch / key. If the browser still blocks sound, it plays muted and unmutes on the first real click or tap.
function retry() {
  if (!state.armed) return
  if (autoMuted && !state.muted) { autoMuted = false; try { yt?.unMute?.(); yt?.setVolume?.(Math.round(VOL * 100)) } catch {} }
  if (!state.playing && !userPaused && state.key) {
    if (state.local[state.key] && audio) audio.play().then(() => set({ playing: true })).catch(() => {})
    else try { yt?.playVideo?.() } catch {}
  }
}
let autoOn = false
export function autoStart() {
  if (autoOn) return; autoOn = true
  const first = () => { arm(); ['wheel', 'touchstart', 'scroll', 'keydown'].forEach((e) => window.removeEventListener(e, first)) }
  ;['wheel', 'touchstart', 'scroll', 'keydown'].forEach((e) => window.addEventListener(e, first, { passive: true }))
  ;['pointerdown', 'keydown', 'touchend', 'click'].forEach((e) => window.addEventListener(e, () => { if (navigator.userActivation?.isActive !== false) retry() }, { passive: true }))
}
