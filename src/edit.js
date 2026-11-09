import { useSyncExternalStore } from 'react'

// "Configuration mode" visibility. Available in dev, or in production by opening /?edit
const allowed = () => import.meta.env.DEV || new URLSearchParams(location.search).has('edit') || (() => { try { return localStorage.getItem('mayris-edit') === '1' } catch { return false } })()
export const canEdit = allowed()

let state = { open: false, focusMedia: null }
const subs = new Set()
const set = (s) => { state = { ...state, ...s }; subs.forEach((f) => f()) }
export const editState = () => state
export const openEditor = (focusMedia = null) => set({ open: true, focusMedia })
export const closeEditor = () => set({ open: false, focusMedia: null })
export const useEditor = () => useSyncExternalStore((f) => (subs.add(f), () => subs.delete(f)), () => state)
