import { useLayoutEffect, useRef } from 'react'
import { RECIPES } from '../data/recipes'
import Sticker from './Stickers'
import { gsap, reduceMotion } from '../motion'

export default function Recipes() {
  const ref = useRef(null)
  useLayoutEffect(() => {
    if (reduceMotion()) return
    const ctx = gsap.context(() => {
      gsap.from('.rc', { y: 70, opacity: 0, rotate: () => gsap.utils.random(-4, 4), duration: 0.9, stagger: 0.08, ease: 'back.out(1.5)', scrollTrigger: { trigger: '.rc-grid', start: 'top 85%' } })
    }, ref)
    return () => ctx.revert()
  }, [])
  return (
    <section className="recipes theme-kitchen" id="recetas" ref={ref} data-theme="kitchen">
      <Sticker name="chefhat" size={150} className="rc-hat" />
      <header>
        <small>por si un día te toca cocinar lejos de casa</small>
        <h2>10 recetas de menos de 30 minutos</h2>
        <p>Fáciles, baratas y casi a prueba de errores. Para cuando tengas hambre, poco tiempo y nadie que te cocine (todavía). Cada una lleva a la receta completa.</p>
      </header>
      <ol className="rc-grid">
        {RECIPES.map((r, i) => (
          <li className="rc" key={r.n}>
            <span className="rc-n">{String(i + 1).padStart(2, '0')}</span>
            <span className="rc-min">{r.min} min</span>
            <h3>{r.n}</h3>
            <p><b>Necesitas:</b> {r.need}.</p>
            <p className="rc-tip"><b>Truquito:</b> {r.tip}</p>
            <a href={r.url} target="_blank" rel="noopener noreferrer">Ver receta completa <i>↗</i><small>{r.src}</small></a>
          </li>
        ))}
      </ol>
    </section>
  )
}
