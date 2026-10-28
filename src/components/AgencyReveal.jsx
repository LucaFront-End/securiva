import { useEffect, useId, useRef, useState } from 'react'
import { ArrowLeftRight, ArrowUpRight, MoveHorizontal } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './AgencyReveal.css'

gsap.registerPlugin(ScrollTrigger)

function ReportPaper({ agency = false }) {
  return <div className={`ar-paper ${agency ? 'ar-paper-agency' : ''}`}>
    <div className="ar-paper-header"><span className="ar-paper-wordmark">{agency ? 'TU AGENCIA' : 'SECURIVA'}<i /></span><span className="ar-paper-label">SECURITY<br />ASSESSMENT</span></div>
    <div className="ar-paper-rule" />
    <div className="ar-paper-title"><span>INFORME DE EVALUACIÓN</span><h3>La evidencia.<br />Con tu identidad.</h3><p>Aplicación web / Ejemplo ilustrativo</p></div>
    <div className="ar-paper-body"><div className="ar-paper-index"><span><b>01</b> Resumen ejecutivo</span><span><b>02</b> Evidencia técnica</span><span><b>03</b> Plan de remediación</span></div><div className="ar-paper-symbol"><svg viewBox="0 0 160 160" fill="none"><circle cx="80" cy="80" r="65" stroke="currentColor" strokeWidth=".6" /><circle cx="80" cy="80" r="49" stroke="currentColor" strokeWidth=".6" strokeDasharray="2 6" /><path d="M80 0v38m0 84v38M0 80h38m84 0h38" stroke="currentColor" strokeWidth=".7" /><path d="m80 46 27 12v22c0 18-14 31-27 39-13-8-27-21-27-39V58l27-12Z" stroke="currentColor" strokeWidth="1.5" /><path d="m66 81 10 10 20-23" stroke="currentColor" strokeWidth="2" /></svg><span>VALIDAR. DOCUMENTAR. CORREGIR.</span></div></div>
    <div className="ar-paper-footer"><span>EJEMPLO / SIN DATOS DE CLIENTES</span><span>CONFIDENCIALIDAD POR DISEÑO</span></div>
  </div>
}

export default function AgencyReveal({ onContact, motionEnabled = true }) {
  const [reveal, setReveal] = useState(50)
  const sectionRef = useRef(null)
  const sceneRef = useRef(null)
  const manualRef = useRef(false)
  const lastScrollRef = useRef(0)
  const id = useId()

  useEffect(() => {
    const scene = sceneRef.current
    const section = sectionRef.current
    if (!scene || !section || !motionEnabled) return
    lastScrollRef.current = window.scrollY
    const media = gsap.matchMedia()
    const context = gsap.context(() => {
      const updateReveal = trigger => {
        const currentScroll = window.scrollY
        const scrollChanged = Math.abs(currentScroll - lastScrollRef.current) > .1
        lastScrollRef.current = currentScroll
        if (manualRef.current && !scrollChanged) return
        manualRef.current = false
        const next = Math.round(gsap.utils.clamp(0, 1, trigger.progress) * 100)
        setReveal(previous => previous === next ? previous : next)
      }
      ScrollTrigger.create({ trigger: scene, start: 'top 85%', end: 'bottom 35%', invalidateOnRefresh: true, onUpdate: updateReveal, onRefresh: updateReveal })
      const stage = scene.querySelector('.ar-report-motion-stage')
      if (!stage) return
      media.add('(min-width: 761px) and (pointer: fine)', () => {
        gsap.fromTo(stage, { rotationX: 13, rotationY: -7, rotationZ: 3, y: 75, scale: .92, transformPerspective: 1500, transformOrigin: '50% 50%' }, {
          rotationX: 0, rotationY: 0, rotationZ: 0, y: -12, scale: 1, ease: 'none',
          scrollTrigger: { trigger: scene, start: 'top 92%', end: 'bottom 40%', scrub: .7, invalidateOnRefresh: true },
        })
      })
      media.add('(max-width: 760px), (pointer: coarse)', () => {
        gsap.fromTo(stage, { y: 24, rotationZ: 1.5, scale: .98 }, {
          y: -5, rotationZ: 0, scale: 1, ease: 'none',
          scrollTrigger: { trigger: scene, start: 'top 95%', end: 'bottom 40%', scrub: .45, invalidateOnRefresh: true },
        })
      })
    }, section)
    return () => { media.revert(); context.revert() }
  }, [motionEnabled])

  function manualReveal(event) {
    manualRef.current = true
    lastScrollRef.current = window.scrollY
    setReveal(Number(event.target.value))
  }

  return <section ref={sectionRef} id="agencias" className={`ar-section ${motionEnabled ? '' : 'ar-motion-off'}`}>
    <div className="ar-shell">
      <div className="ar-topline"><span>03 / WHITE LABEL</span><span>EL MISMO RIGOR. TU MARCA.</span></div>
      <div className="ar-intro" data-reveal><h2>Tu nombre.<br /><span>Nuestro oficio.</span></h2><div className="ar-intro-aside"><p>Nosotros investigamos, validamos y documentamos. Tú conservas la relación con tu cliente.</p><button type="button" onClick={() => onContact?.('White label')}>Hagamos equipo <ArrowUpRight size={21} aria-hidden="true" /></button></div></div>
      <div ref={sceneRef} className="ar-report-scene">
        <span className="ar-side-note" aria-hidden="true">EVIDENCIA TÉCNICA / IDENTIDAD PROPIA</span>
        <div className="ar-report-motion-stage">
        <div className="ar-report-back" aria-hidden="true" />
        <div className="ar-comparison" style={{ '--ar-reveal': `${reveal}%` }} role="group" aria-labelledby={`${id}-label`}>
          <div className="ar-report-layer" aria-hidden="true"><ReportPaper /></div>
          <div className="ar-report-layer ar-report-revealed" aria-hidden="true"><ReportPaper agency /></div>
          <span className="ar-comparison-divider" aria-hidden="true"><span><MoveHorizontal size={19} /></span></span>
          <input id={`${id}-range`} className="ar-comparison-input" type="range" min="0" max="100" step="1" value={reveal} onChange={manualReveal} aria-label="Mostrar el informe con la identidad de tu agencia" aria-valuetext={`${reveal}% con identidad de tu agencia`} />
        </div>
        </div>
      </div>
      <div className="ar-reveal-caption"><span>SECURIVA</span><label id={`${id}-label`} htmlFor={`${id}-range`}><ArrowLeftRight size={17} aria-hidden="true" /> Desliza. Hazlo tuyo.</label><span>TU AGENCIA</span></div>
      <div className="ar-bottomline"><p>El contenido técnico permanece.<br />La identidad es tuya.</p><span>INFORME ILUSTRATIVO<br />SIN DATOS DE CLIENTES</span></div>
    </div>
  </section>
}
