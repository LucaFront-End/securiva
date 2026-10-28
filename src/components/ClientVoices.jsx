import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, MoveHorizontal } from 'lucide-react'
import { approvedReviews } from '../data/socialProof'
import './ClientVoices.css'

const reservedTopics = ['El impacto en el proyecto', 'La experiencia con el equipo', 'El acompañamiento técnico']

export default function ClientVoices({ motionEnabled = true, data = approvedReviews }) {
  const reviews = Array.isArray(data) ? data.filter(review => review && typeof review.quote === 'string' && review.quote.trim() && typeof review.name === 'string' && review.name.trim()) : []
  const empty = reviews.length === 0
  const items = empty ? reservedTopics : reviews
  const trackRef = useRef(null)
  const id = useId()
  const [edges, setEdges] = useState({ start: true, end: false })

  const updateEdges = useCallback(() => {
    const track = trackRef.current
    if (!track) return
    const next = { start: track.scrollLeft <= 2, end: track.scrollLeft + track.clientWidth >= track.scrollWidth - 2 }
    setEdges(previous => previous.start === next.start && previous.end === next.end ? previous : next)
  }, [])

  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    updateEdges()
    const observer = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(updateEdges) : undefined
    observer?.observe(track)
    window.addEventListener('resize', updateEdges, { passive: true })
    return () => { observer?.disconnect(); window.removeEventListener('resize', updateEdges) }
  }, [items.length, updateEdges])

  function move(direction) {
    const track = trackRef.current
    const card = track?.querySelector('.cv-card')
    if (!track || !card) return
    const gap = Number.parseFloat(window.getComputedStyle(track).columnGap) || 20
    track.scrollBy({ left: direction * (card.offsetWidth + gap), behavior: motionEnabled ? 'smooth' : 'auto' })
  }

  function keyboard(event) {
    if (event.altKey || event.ctrlKey || event.metaKey) return
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault()
      move(event.key === 'ArrowLeft' ? -1 : 1)
    } else if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault()
      trackRef.current?.scrollTo({ left: event.key === 'Home' ? 0 : trackRef.current.scrollWidth, behavior: motionEnabled ? 'smooth' : 'auto' })
    }
  }

  return <section className={`cv-section ${!motionEnabled ? 'cv-motion-off' : ''}`} aria-labelledby={`${id}-title`}>
    <div className="cv-shell">
      <div className="cv-heading" data-reveal><div><span className="cv-eyebrow">{empty ? 'VISTA PREVIA · RESEÑAS POR INCORPORAR' : 'EXPERIENCIAS DE CLIENTES'}</span><h2 id={`${id}-title`}>La experiencia,<br /><span>en sus palabras.</span></h2></div><span className="cv-quotation" aria-hidden="true">“</span></div>
      <div ref={trackRef} id={`${id}-track`} className="cv-track" tabIndex={0} role="region" aria-roledescription="carrusel" aria-label={empty ? 'Vista previa de espacios reservados para reseñas reales' : 'Reseñas de clientes'} onScroll={updateEdges} onKeyDown={keyboard}>
        {items.map((item, index) => <article key={empty ? item : `${item.name}-${index}`} className={`cv-card ${empty ? 'cv-card-reserved' : ''}`} tabIndex={0} aria-roledescription="diapositiva" aria-label={empty ? `Espacio para una reseña real: ${item}` : `Reseña de ${item.name}`}>
          <div className="cv-card-topline"><span>{empty ? 'ESPACIO RESERVADO' : 'RESEÑA DE CLIENTE'}</span><span className="cv-card-corner" aria-hidden="true">“</span></div>
          {empty ? <><p className="cv-placeholder">Espacio para<br />una reseña real<span>.</span></p><div className="cv-card-footer"><span className="cv-slot-line" aria-hidden="true" /><span>{item}</span></div></> : <><blockquote className="cv-quote">{item.quote}</blockquote><div className="cv-card-footer cv-author"><strong>{item.name}</strong>{(item.role || item.company) && <span>{[item.role, item.company].filter(Boolean).join(' · ')}</span>}</div></>}
        </article>)}
      </div>
      <div className="cv-bottomline"><p>{empty ? 'Este espacio se completará con experiencias reales y autorizadas.' : 'La perspectiva de quienes han trabajado con SECURIVA.'}</p><div className="cv-controls"><span><MoveHorizontal size={16} aria-hidden="true" /> EXPLORA</span><button type="button" aria-label="Reseña anterior" aria-controls={`${id}-track`} disabled={edges.start} onClick={() => move(-1)}><ArrowLeft size={20} aria-hidden="true" /></button><button type="button" aria-label="Siguiente reseña" aria-controls={`${id}-track`} disabled={edges.end} onClick={() => move(1)}><ArrowRight size={20} aria-hidden="true" /></button></div></div>
    </div>
  </section>
}
