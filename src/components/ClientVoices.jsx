import { useEffect, useId, useRef } from 'react'
import { ArrowUpRight, MoveHorizontal } from 'lucide-react'
import { approvedReviews, illustrativeCases } from '../data/socialProof'
import './ClientVoices.css'

function VoiceCard({ item, illustrative, duplicate = false }) {
  return <article className={'cv-card cv-card-' + (item.accent || 'paper')} aria-hidden={duplicate || undefined}>
    <div className="cv-card-topline"><span>{illustrative ? 'CASO ILUSTRATIVO' : 'EXPERIENCIA DE CLIENTE'}</span><ArrowUpRight size={15} strokeWidth={1.3} aria-hidden="true"/></div>
    {illustrative ? <div className="cv-card-copy"><h3>{item.title}</h3><p>{item.description}</p></div> : <blockquote className="cv-quote">{item.quote}</blockquote>}
    <div className="cv-card-footer"><span className="cv-monogram" aria-hidden="true">{item.initials || item.company?.slice(0, 2).toUpperCase() || 'S'}</span><div><strong>{illustrative ? item.company : item.name}</strong><span>{illustrative ? item.category : [item.role, item.company].filter(Boolean).join(' · ')}</span></div><span className="cv-card-dot" aria-hidden="true"/></div>
  </article>
}

function VoiceRow({ items, reverse, illustrative, index }) {
  const group = items.length >= 8 ? items : Array.from({ length:Math.max(8, items.length * 2) }, (_, i) => items[i % items.length])
  return <div className={'cv-row ' + (reverse ? 'cv-row-reverse' : '')} aria-label={'Fila ' + (index + 1)}>
    <div className="cv-conveyor" style={{ '--cv-duration': group.length * 19 + 's' }}>
      <div className="cv-group" role="list">{group.map((item, i) => <div key={(item.id || item.name) + '-' + i} role="listitem" aria-hidden={i >= items.length || undefined}><VoiceCard item={item} illustrative={illustrative}/></div>)}</div>
      <div className="cv-group cv-group-copy" aria-hidden="true">{group.map((item, i) => <div key={(item.id || item.name) + '-' + i}><VoiceCard item={item} illustrative={illustrative} duplicate/></div>)}</div>
    </div>
  </div>
}

export default function ClientVoices({ motionEnabled = true, data = approvedReviews }) {
  const sectionRef = useRef(null)
  const id = useId()
  const reviews = Array.isArray(data) ? data.filter(review => typeof review?.quote === 'string' && review.quote.trim() && typeof review?.name === 'string' && review.name.trim()) : []
  const illustrative = reviews.length === 0
  const items = illustrative ? illustrativeCases : reviews
  const split = Math.ceil(items.length / 2)
  const rows = [items.slice(0, split), items.slice(split)]
  if (!rows[1].length) rows[1] = rows[0]

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return undefined
    let visible = true
    const sync = () => { section.dataset.running = String(motionEnabled && visible && !document.hidden) }
    const observer = typeof IntersectionObserver !== 'undefined' ? new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync() }, { rootMargin:'160px' }) : null
    observer?.observe(section)
    document.addEventListener('visibilitychange', sync)
    sync()
    return () => { observer?.disconnect(); document.removeEventListener('visibilitychange', sync) }
  }, [motionEnabled])

  return <section ref={sectionRef} id="experiencias" className={'cv-section ' + (!motionEnabled ? 'cv-motion-off' : '')} data-running={motionEnabled} aria-labelledby={id + '-title'}>
    <div className="cv-shell cv-heading" data-reveal><div><span className="cv-eyebrow">04 / SEGURIDAD EN CONTEXTO</span><h2 id={id + '-title'}>{illustrative ? <>El valor está<br/><span>en lo que cambia.</span></> : <>La experiencia,<br/><span>en sus palabras.</span></>}</h2></div><p className="cv-intro">{illustrative ? 'Comercio, pagos e identidad. Distintos productos, el mismo criterio: entender el riesgo y hacerlo accionable.' : 'La perspectiva de quienes han trabajado con SECURIVA, compartida con su autorización.'}</p></div>
    <div className="cv-marquees" role="region" aria-label={illustrative ? 'Ejemplos ilustrativos de evaluación de seguridad' : 'Experiencias de clientes'} tabIndex={0}>
      {rows.map((row, index) => <VoiceRow key={index} items={row} reverse={index === 1} illustrative={illustrative} index={index}/>)}
      <div className="cv-edge cv-edge-left" aria-hidden="true"/><div className="cv-edge cv-edge-right" aria-hidden="true"/>
    </div>
    <div className="cv-shell cv-bottomline"><p>{illustrative ? 'Textos ilustrativos sobre los tipos de proyectos compartidos. No son citas ni resultados atribuidos a estas marcas.' : 'Testimonios reales publicados con autorización.'}</p><span className="cv-flow-note"><MoveHorizontal size={15} aria-hidden="true"/> DOS PERSPECTIVAS. UN MISMO RIGOR.</span></div>
  </section>
}
