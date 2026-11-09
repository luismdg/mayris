import { useEffect, useMemo, useRef, useState } from 'react'
import { useEditor, closeEditor, openEditor, canEdit } from '../edit'
import { useStory, getConfig, setConfig, resetConfig, setSite, setChapter, setMedia, setMediaMany, addChapter, moveChapter, fmtRange, fmtDate, mediaUrl } from '../store'
import { THEMES, THEME_KEYS, TAGS } from '../themes'
import { scrollToEl } from '../motion'
import { SONGS } from '../music'

const Field = ({ label, children, hint }) => <label className="cf"><span>{label}</span>{children}{hint && <em>{hint}</em>}</label>

function SiteTab({ site }) {
  const t = (k, label, extra = {}) => <Field label={label}><input value={site[k]} onChange={(e) => setSite(k, e.target.value)} {...extra} /></Field>
  return (
    <div className="cfg-pane">
      <div className="cf-row">{t('to', 'Para (nombre)')}{t('from', 'De (tu nombre)')}</div>
      {t('eyebrow', 'Texto pequeño de la portada')}
      {t('introLine', 'Frase de la portada')}
      {t('introHint', 'Pista bajo el título')}
      <div className="cf-row">{t('startDate', 'Primer recuerdo', { type: 'date' })}{t('anniversaryDate', 'Aniversario', { type: 'date' })}</div>
      <Field label="Introducción (un párrafo por línea)" hint="Usa {days}, {photos}, {videos}, {total}">
        <textarea rows={6} value={site.prologue.join('\n')} onChange={(e) => setSite('prologue', e.target.value.split('\n'))} />
      </Field>
      <Field label="Sus gustos (uno por línea, salen en el final)"><textarea rows={8} value={site.likes.join(String.fromCharCode(10))} onChange={(e) => setSite('likes', e.target.value.split(String.fromCharCode(10)))} /></Field>
      <Field label="Carta final"><textarea rows={12} value={site.letter} onChange={(e) => setSite('letter', e.target.value)} /></Field>
      {t('finaleKicker', 'Frase sobre el título final')}
      {t('finaleTitle', 'Título final')}
    </div>
  )
}

function ChaptersTab({ chapters, focus }) {
  const [open, setOpen] = useState(focus?.chapter || null)
  useEffect(() => { if (focus?.chapter) setOpen(focus.chapter) }, [focus])
  return (
    <div className="cfg-pane">
      <button className="cfg-btn primary" onClick={() => setOpen(addChapter())}>+ Nuevo capítulo</button>
      {chapters.map((ch, i) => (
        <div key={ch.id} className={`cfg-ch ${open === ch.id ? 'open' : ''} ${ch.hidden ? 'off' : ''}`}>
          <button className="cfg-ch-head" onClick={() => setOpen(open === ch.id ? null : ch.id)}>
            <i style={{ background: THEMES[ch.theme].accent }} />
            <b>{ch.title || '(sin título)'}</b>
            <small>{fmtRange(ch.start, ch.end)} · {ch.items.length}</small>
          </button>
          {open === ch.id && (
            <div className="cfg-ch-body">
              <div className="cf-row">
                <Field label="Título"><input value={ch.title} onChange={(e) => setChapter(ch.id, 'title', e.target.value)} /></Field>
                <Field label="Palabra gigante"><input value={ch.bigWord} onChange={(e) => setChapter(ch.id, 'bigWord', e.target.value)} /></Field>
              </div>
              <Field label="Subtítulo (ej. lugar, evento)"><input value={ch.subtitle || ''} onChange={(e) => setChapter(ch.id, 'subtitle', e.target.value)} /></Field>
              <div className="cf-row">
                <Field label="Estilo / época">
                  <select value={ch.theme} onChange={(e) => setChapter(ch.id, 'theme', e.target.value)}>
                    {THEME_KEYS.map((k) => <option key={k} value={k}>{THEMES[k].label}</option>)}
                  </select>
                </Field>
                <Field label="Etiqueta">
                  <select value={ch.tag || ''} onChange={(e) => setChapter(ch.id, 'tag', e.target.value)}>
                    <option value="">—</option>{TAGS.map((t) => <option key={t}>{t}</option>)}
                  </select>
                </Field>
              </div>
              <Field label="Canción de este capítulo">
                <select value={ch.song || ''} onChange={(e) => setChapter(ch.id, 'song', e.target.value)}>
                  <option value="">(seguir con la anterior)</option>{Object.entries(SONGS).map(([k, v]) => <option key={k} value={k}>{v.title} — {v.artist}</option>)}
                </select>
              </Field>
              <Field label="Texto del capítulo (aparece palabra por palabra al hacer scroll)">
                <textarea rows={5} value={ch.letter || ''} onChange={(e) => setChapter(ch.id, 'letter', e.target.value)} />
              </Field>
              <div className="cfg-actions">
                <button className="cfg-btn" onClick={() => { closeEditor(); setTimeout(() => scrollToEl(`#ch-${ch.id}`), 100) }}>Ir al capítulo</button>
                <button className="cfg-btn" disabled={i === 0} onClick={() => moveChapter(ch.id, -1)}>↑</button>
                <button className="cfg-btn" disabled={i === chapters.length - 1} onClick={() => moveChapter(ch.id, 1)}>↓</button>
                <button className="cfg-btn" onClick={() => setChapter(ch.id, 'hidden', !ch.hidden)}>{ch.hidden ? 'Mostrar' : 'Ocultar'}</button>
                <button className="cfg-btn" onClick={() => openEditor({ media: ch.id })}>Ver recuerdos</button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

function MediaTab({ chapters, focus }) {
  const [filter, setFilter] = useState(focus?.media || 'all')
  const [sel, setSel] = useState([])
  const [bulk, setBulk] = useState('')
  useEffect(() => { if (focus?.media) { setFilter(focus.media); setSel([]) } }, [focus])
  const list = useMemo(() => chapters.flatMap((ch) => ch.all.map((m) => ({ ...m, ch: ch.id, chTitle: ch.title }))).filter((m) => filter === 'all' || m.ch === filter), [chapters, filter])
  const one = sel.length === 1 ? list.find((m) => m.id === sel[0]) : null
  const labeled = list.filter((m) => m.caption).length
  const toggle = (id) => setSel((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]))
  return (
    <div className="cfg-pane">
      <div className="cf-row">
        <Field label="Capítulo">
          <select value={filter} onChange={(e) => { setFilter(e.target.value); setSel([]) }}>
            <option value="all">Todos ({chapters.reduce((a, c) => a + c.all.length, 0)})</option>
            {chapters.map((c) => <option key={c.id} value={c.id}>{c.title} · {fmtRange(c.start, c.end)} ({c.all.length})</option>)}
          </select>
        </Field>
      </div>
      <div className="cfg-actions">
        <small>{labeled}/{list.length} con texto · {sel.length} seleccionados</small>
        <button className="cfg-btn" onClick={() => setSel(list.map((m) => m.id))}>Seleccionar todo</button>
        <button className="cfg-btn" onClick={() => setSel([])}>Nada</button>
      </div>
      <div className="cfg-grid">
        {list.map((m) => (
          <button key={m.id} className={`cfg-th ${sel.includes(m.id) ? 'sel' : ''} ${m.hidden ? 'off' : ''}`} onClick={() => toggle(m.id)} title={`${fmtDate(m.date)} · ${m.desc || m.slug || ''}`}>
            <img src={mediaUrl(m.src)} loading="lazy" alt="" style={{ background: m.color }} />
            {m.caption && <i className="dot" />}
            {m.type !== 'photo' && <b>{m.type === 'live' ? '◉' : '▶'}</b>}
          </button>
        ))}
      </div>
      {sel.length > 0 && (
        <div className="cfg-bulk">
          {one && <small>{one.desc || '(sin nombre)'} · {fmtDate(one.date, { dateStyle: 'full', timeStyle: undefined })}</small>}
          <Field label={sel.length > 1 ? `Texto para los ${sel.length} seleccionados (un grupo)` : 'Texto de este recuerdo'}>
            <textarea rows={3} value={one ? one.caption : bulk} onChange={(e) => (one ? setMedia(one.id, 'caption', e.target.value) : setBulk(e.target.value))}
              placeholder="Ej. Hackathon en Monterrey — ganamos el 2º lugar…" />
          </Field>
          <div className="cfg-actions">
            {!one && <button className="cfg-btn primary" onClick={() => setMediaMany(sel, 'caption', bulk)}>Aplicar texto al grupo</button>}
            <select onChange={(e) => e.target.value && setMediaMany(sel, 'tag', e.target.value === '__none' ? '' : e.target.value)} defaultValue="">
              <option value="">Etiqueta…</option><option value="__none">(quitar)</option>{TAGS.map((t) => <option key={t}>{t}</option>)}
            </select>
            <select onChange={(e) => { if (e.target.value) { setMediaMany(sel, 'chapter', e.target.value); setSel([]) } }} defaultValue="">
              <option value="">Mover a capítulo…</option>{chapters.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
            </select>
            <button className="cfg-btn" onClick={() => setMediaMany(sel, 'hidden', !list.find((m) => m.id === sel[0])?.hidden)}>Ocultar / mostrar</button>
          </div>
        </div>
      )}
    </div>
  )
}

function DataTab() {
  const [msg, setMsg] = useState('')
  const file = useRef(null)
  const json = () => JSON.stringify(getConfig(), null, 2)
  const saveProject = async () => {
    try { const r = await fetch('/__story/save', { method: 'POST', body: json() }); setMsg(r.ok ? 'Guardado en src/data/story.config.json ✔' : 'Error al guardar') }
    catch { setMsg('Solo funciona con npm run dev. Usa Exportar.') }
  }
  const exportJson = () => { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([json()], { type: 'application/json' })); a.download = 'story.config.json'; a.click() }
  const importJson = (f) => { const r = new FileReader(); r.onload = () => { try { setConfig(JSON.parse(r.result)); setMsg('Importado ✔') } catch { setMsg('Archivo inválido') } }; r.readAsText(f) }
  return (
    <div className="cfg-pane">
      <p className="cfg-note">Tus cambios se guardan automáticamente en este navegador. Para dejarlos en el proyecto (y publicarlos) usa <b>Guardar en el proyecto</b> (con <code>npm run dev</code>) o <b>Exportar</b> y reemplaza <code>src/data/story.config.json</code>.</p>
      <button className="cfg-btn primary" onClick={saveProject}>Guardar en el proyecto</button>
      <button className="cfg-btn" onClick={exportJson}>Exportar JSON</button>
      <button className="cfg-btn" onClick={() => file.current.click()}>Importar JSON</button>
      <input ref={file} type="file" accept="application/json" hidden onChange={(e) => e.target.files[0] && importJson(e.target.files[0])} />
      <button className="cfg-btn danger" onClick={() => confirm('¿Borrar todos los cambios locales?') && resetConfig()}>Restablecer todo</button>
      {msg && <p className="cfg-msg">{msg}</p>}
    </div>
  )
}

export default function Config() {
  const { open, focusMedia } = useEditor()
  const story = useStory()
  const [tab, setTab] = useState('chapters')
  useEffect(() => { if (focusMedia?.chapter) setTab('chapters'); else if (focusMedia?.media) setTab('media') }, [focusMedia])
  if (!canEdit) return null
  const unlabeled = story.chapters.reduce((a, c) => a + c.all.filter((m) => !m.caption).length, 0)
  return (
    <>
      {!open && <button className="cfg-fab" onClick={() => openEditor()} aria-label="Modo configuración">✎ <span>Configurar</span></button>}
      {open && (
        <aside className="cfg">
          <header>
            <b>Modo configuración</b>
            <small>{unlabeled} recuerdos sin texto</small>
            <button onClick={closeEditor} aria-label="Cerrar">×</button>
          </header>
          <nav>
            {[['site', 'Historia'], ['chapters', 'Capítulos'], ['media', 'Recuerdos'], ['data', 'Datos']].map(([k, l]) => <button key={k} className={tab === k ? 'on' : ''} onClick={() => setTab(k)}>{l}</button>)}
          </nav>
          <div className="cfg-body">
            {tab === 'site' && <SiteTab site={story.site} />}
            {tab === 'chapters' && <ChaptersTab chapters={story.chapters} focus={focusMedia} />}
            {tab === 'media' && <MediaTab chapters={story.chapters} focus={focusMedia} />}
            {tab === 'data' && <DataTab />}
          </div>
        </aside>
      )}
    </>
  )
}
