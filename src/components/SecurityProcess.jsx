import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { ArrowDown, ArrowUpRight } from 'lucide-react'
import SceneBoundary from './SceneBoundary'
import ProcessFallback from './ProcessFallback'
import useProcessScroll from '../hooks/useProcessScroll'
import './SecurityProcess.css'

const IsometricSecurity = lazy(() => import('./IsometricSecurity'))
const steps = [
  { title: 'Definimos.', short: 'Alcance', label: 'ALCANCE', text: 'Activos, permisos y objetivos acordados antes de la primera prueba.', deliverable: 'Plan de evaluación', detail: 'Qué se prueba, con qué límites y para qué.' },
  { title: 'Investigamos.', short: 'Pruebas', label: 'PRUEBAS', text: 'Herramientas y pruebas manuales para revisar accesos, integraciones y lógica de negocio.', deliverable: 'Hallazgos validados', detail: 'Criterio humano para separar señales de riesgos reales.' },
  { title: 'Demostramos.', short: 'Evidencia', label: 'EVIDENCIA', text: 'Impacto, pasos de reproducción y recomendaciones que tu equipo puede llevar a la práctica.', deliverable: 'Reporte técnico + ejecutivo', detail: 'Profundidad para desarrollo. Claridad para decidir.' },
  { title: 'Verificamos.', short: 'Retest', label: 'RETEST', text: 'Acompañamos las correcciones y verificamos los hallazgos incluidos en el alcance del retest.', deliverable: 'Estado de las correcciones', detail: 'Qué quedó resuelto y qué requiere más atención.' },
]

export default function SecurityProcess({ motionEnabled = true }) {
  const [step, setStep] = useState(0)
  const [loadScene, setLoadScene] = useState(false)
  const sectionRef = useRef(null)
  const experienceRef = useRef(null)
  const sceneRef = useRef(null)
  const progressRef = useRef(0)
  const selectStep = useProcessScroll(sectionRef, experienceRef, setStep, progressRef)
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setLoadScene(true); observer.disconnect() }
    }, { rootMargin: '200px' })
    if (sceneRef.current) observer.observe(sceneRef.current)
    return () => observer.disconnect()
  }, [])

  const fallback = <ProcessFallback stage={step}/>
  return <section ref={sectionRef} data-scroll-step={step} id="metodo" className="sp-section" aria-labelledby="process-title">
    <div className="sp-top"><span className="eyebrow">04 / CLARIDAD DE PRINCIPIO A FIN</span><h2 id="process-title" data-reveal>No termina en un hallazgo.<br/><span>Termina en una decisión.</span></h2></div>
    <div className="sp-scroll-guidance"><span>UNA PREGUNTA. CUATRO PASOS.</span><span><ArrowDown size={12} aria-hidden="true"/> DESLIZA PARA DESCUBRIR</span></div>
    <div className="sp-experience" ref={experienceRef}>
      <div className="sp-scene-group">
        <div className="sp-scene-caption"><span>{steps[step].label}</span><span>0{step + 1} / 04</span></div>
        <div className="sp-visual" ref={sceneRef}>
          <SceneBoundary fallback={fallback}>{loadScene ? <Suspense fallback={fallback}><IsometricSecurity variant="process" progressRef={progressRef} motionEnabled={motionEnabled} stage={step} fallback={fallback} ariaLabel="Proceso ilustrativo de evaluación: alcance, investigación, evidencia y verificación"/></Suspense> : fallback}</SceneBoundary>
        </div>
        <div className="sp-scene-foot"><span>DE LA PREGUNTA A LA EVIDENCIA.</span><span>SECURIVA / MÉTODO</span></div>
      </div>
      <div className="sp-steps" role="group" aria-label="Etapas de nuestro proceso">{steps.map((item, index) => <button key={item.label} type="button" id={`process-step-${index}`} aria-pressed={step === index} aria-controls="process-description process-deliverable" onClick={() => selectStep(index)} className={step === index ? 'is-active' : ''}>
        <span className="sp-number">0{index + 1}</span><span><strong className="sp-step-title">{item.title}</strong><span className="sp-step-short">{item.short}</span><span className="sp-step-copy">{item.text}</span></span><ArrowUpRight size={20} aria-hidden="true"/>
      </button>)}</div>
      <div className="sp-mobile-copy" id="process-description" role="region" aria-labelledby={`process-step-${step}`}>{steps.map((item, index) => <div key={item.label} className={`sp-copy-panel ${step === index ? 'is-active' : ''}`} aria-hidden={step !== index}><h3>{item.title}</h3><p>{item.text}</p></div>)}</div>
      <div className="sp-deliverable-stack" id="process-deliverable" role="region" aria-labelledby={`process-step-${step}`}>{steps.map((item, index) => <div key={item.label} className={`sp-deliverable ${step === index ? 'is-active' : ''}`} aria-hidden={step !== index}><span>LO QUE RECIBES / 0{index + 1}</span><h3>{item.deliverable}</h3><p>{item.detail}</p></div>)}</div>
      <div className="sp-reading-progress" aria-hidden="true"><i/></div>
    </div>
  </section>
}
