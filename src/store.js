import { useSyncExternalStore } from 'react'
import media from './data/media.json'
import baseChapters from './data/chapters.json'
import saved from './data/story.config.json'
import CAPS from './data/captions.es.json'
import { DEFAULT_SITE, DEFAULT_CHAPTERS, FALLBACK_CHAPTER } from './defaults'
import { THEMES } from './themes'

const LS = 'mayris-story-draft-v1'
const readDraft = () => { try { return JSON.parse(localStorage.getItem(LS)) } catch { return null } }
let config = readDraft() || saved || {}
const subs = new Set()
let cached = null

function emit() {
  cached = null
  try { localStorage.setItem(LS, JSON.stringify(config)) } catch {}
  subs.forEach((f) => f())
}
export const getConfig = () => config
export function patch(fn) { config = fn(structuredClone(config)); emit() }
export function setConfig(c) { config = c || {}; emit() }
export function resetConfig() { config = {}; try { localStorage.removeItem(LS) } catch {}; emit() }
const subscribe = (f) => (subs.add(f), () => subs.delete(f))

export const setSite = (k, v) => patch((c) => { (c.site ||= {})[k] = v; return c })
export const setChapter = (id, k, v) => patch((c) => { ((c.chapters ||= {})[id] ||= {})[k] = v; return c })
export const setMedia = (id, k, v) => patch((c) => { ((c.media ||= {})[id] ||= {})[k] = v; return c })
export function setMediaMany(ids, k, v) {
  patch((c) => { c.media ||= {}; ids.forEach((id) => { (c.media[id] ||= {})[k] = v }); return c })
}
export function addChapter() {
  const id = 'x' + Date.now().toString(36)
  patch((c) => { (c.extra ||= []).push(id); (c.chapters ||= {})[id] = { ...FALLBACK_CHAPTER }; return c })
  return id
}
function computeOrder(c) {
  const all = [...baseChapters.map((x) => x.id), ...(c.extra || [])]
  const ord = (c.order || []).filter((id) => all.includes(id))
  all.forEach((id) => { if (!ord.includes(id)) ord.push(id) })
  return ord
}
export function moveChapter(id, dir) {
  patch((c) => {
    const ord = computeOrder(c); const i = ord.indexOf(id); const j = i + dir
    if (i < 0 || j < 0 || j >= ord.length) return c
    const t = ord[i]; ord[i] = ord[j]; ord[j] = t
    c.order = ord
    return c
  })
}

export function buildStory(c) {
  const site = { ...DEFAULT_SITE, ...(c.site || {}) }
  const mcfg = c.media || {}
  const raw = {}
  baseChapters.forEach((ch) => { raw[ch.id] = ch })
  ;(c.extra || []).forEach((id) => { raw[id] = { id, media: [] } })
  const buckets = {}
  Object.keys(raw).forEach((id) => { buckets[id] = [] })
  baseChapters.forEach((ch) => ch.media.forEach((mid) => {
    const t = mcfg[mid]?.chapter
    buckets[t && buckets[t] ? t : ch.id].push(mid)
  }))
  const chapters = computeOrder(c).map((id) => {
    if (!raw[id]) return null
    const cfg = { ...(DEFAULT_CHAPTERS[id] || FALLBACK_CHAPTER), ...((c.chapters || {})[id] || {}) }
    const ids = buckets[id].slice().sort((a, b) => (media[a].date || 'z').localeCompare(media[b].date || 'z'))
    const all = ids.map((mid) => ({ ...media[mid], caption: mcfg[mid]?.caption !== undefined ? mcfg[mid].caption : (CAPS[media[mid].slug] || ''), tag: mcfg[mid]?.tag || '', hidden: !!mcfg[mid]?.hidden }))
    const items = all.filter((m) => !m.hidden)
    const dates = items.map((m) => m.date).filter(Boolean).sort()
    return { id, ...cfg, theme: THEMES[cfg.theme] ? cfg.theme : 'calm', start: dates[0]?.slice(0, 10) || '', end: dates[dates.length - 1]?.slice(0, 10) || '', items, all }
  }).filter(Boolean)
  const shown = chapters.filter((ch) => !ch.hidden && ch.items.length)
  const counts = { photos: 0, videos: 0, total: 0 }
  shown.forEach((ch) => ch.items.forEach((m) => { counts.total++; if (m.type === 'video') counts.videos++; else counts.photos++ }))
  return { site, chapters, shown, counts }
}
export function useStory() {
  return useSyncExternalStore(subscribe, () => (cached ||= buildStory(config)))
}
export const allMedia = media
export const fmtDate = (iso, opts = { day: 'numeric', month: 'short', year: 'numeric' }) =>
  iso ? new Date(iso.length === 10 ? iso + 'T12:00:00' : iso).toLocaleDateString('es-MX', opts) : ''
export const fmtRange = (a, b) => (!a ? 'sin fecha' : a === b ? fmtDate(a) : `${fmtDate(a, { day: 'numeric', month: 'short' })} – ${fmtDate(b)}`)
export const mediaUrl = (f) => `/media/${f}`
