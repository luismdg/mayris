import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

gsap.registerPlugin(ScrollTrigger)
export { gsap, ScrollTrigger }
export const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

export let lenis = null
export const velocity = { v: 0 }

export function startSmoothScroll() {
  if (lenis || reduceMotion()) return
  lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 0.95 })
  lenis.on('scroll', (e) => { velocity.v = e.velocity; ScrollTrigger.update() })
  gsap.ticker.add((t) => lenis.raf(t * 1000))
  gsap.ticker.lagSmoothing(0)
}
export const stopScroll = () => lenis?.stop()
export const resumeScroll = () => lenis?.start()
export function scrollToEl(target, offset = 0) {
  if (lenis) lenis.scrollTo(target, { offset, duration: 1.8 })
  else (typeof target === 'string' ? document.querySelector(target) : target)?.scrollIntoView({ behavior: 'smooth' })
}

// Split text into word spans for kinetic reveals
export const words = (s) => String(s).split(/(\s+)/).map((w, i) => (/\s+/.test(w) ? w : { w, i }))
