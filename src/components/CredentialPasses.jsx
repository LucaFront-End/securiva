import { useEffect, useId, useRef, useState } from 'react'
import { ArrowUpRight, X } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './CredentialPasses.css'

gsap.registerPlugin(ScrollTrigger)

const credentials = [
  { short: 'OSCP+', org: 'OffSec', title: 'OffSec Certified Professional Plus', date: '01 JUN 2021', label: 'EMISIÓN', note: 'El documento indica expiración a los 3 años.', file: '/brand/credential-oscp.png', className: 'offsec' },
  { short: 'CPTS', org: 'Hack The Box', title: 'Certified Penetration Testing Specialist', date: '24 AGO 2022', label: 'EMISIÓN', note: 'Fecha de emisión indicada en el documento.', file: '/brand/credential-cpts.png', className: 'htb' },
  { short: 'CC', org: 'ISC2', title: 'Certified in Cybersecurity', date: '2023 — 2025', label: 'CICLO', note: 'Ciclo de certificación indicado en el documento.', file: '/brand/credential-cc.png', className: 'isc2' },
]

function CredentialPass({ credential, index, motionEnabled, onOpen }) {
  const ref = useRef(null)
  const resetTilt = () => {
    ref.current?.style.removeProperty('--cp-tilt-x')
    ref.current?.style.removeProperty('--cp-tilt-y')
  }
  useEffect(() => { if (!motionEnabled) resetTilt() }, [motionEnabled])
  function tilt(event) {
    if (!motionEnabled || event.pointerType === 'touch' || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    const bounds = event.currentTarget.getBoundingClientRect()
    const x = (event.clientX - bounds.left) / bounds.width - .5
    const y = (event.clientY - bounds.top) / bounds.height - .5
    ref.current.style.setProperty('--cp-tilt-x', `${(-y * 8).toFixed(2)}deg`)
    ref.current.style.setProperty('--cp-tilt-y', `${(x * 10).toFixed(2)}deg`)
  }
  return <div className={`cp-pass-slot cp-slot-${index}`}>
    <button ref={ref} type="button" className={`cp-pass cp-pass-${credential.className}`} onClick={() => onOpen(credential)} onPointerMove={tilt} onPointerLeave={resetTilt} onBlur={resetTilt} aria-label={`Ver documento ${credential.short}, ${credential.label.toLowerCase()} ${credential.date}`}>
      <span className="cp-pass-topline"><span>{credential.org}</span><span className="cp-pass-arrow"><ArrowUpRight size={20} aria-hidden="true" /></span></span>
      <span className="cp-pass-type">FORMACIÓN PROFESIONAL</span>
      <span className="cp-pass-short">{credential.short}</span>
      <span className="cp-pass-title">{credential.title}</span>
      <span className="cp-pass-person">Luca Dessena Maffucci</span>
      <span className="cp-pass-tear" aria-hidden="true" />
      <span className="cp-pass-bottom"><span className="cp-pass-date"><span>{credential.label}</span><strong>{credential.date}</strong></span><span className="cp-pass-open">VER<br />DOCUMENTO</span></span>
      <span className="cp-pass-note">{credential.note}</span>
    </button>
  </div>
}

export default function CredentialPasses({ motionEnabled = true }) {
  const [active, setActive] = useState(null)
  const sectionRef = useRef(null)
  const dialogRef = useRef(null)
  const id = useId()
  useEffect(() => {
    const section = sectionRef.current
    if (!section || !motionEnabled) return
    const cards = Array.from(section.querySelectorAll('.cp-pass-scroll'))
    const passes = section.querySelector('.cp-passes')
    const media = gsap.matchMedia()
    const context = gsap.context(() => {
      media.add('(min-width: 761px)', () => {
        gsap.fromTo(cards, {
          x: (index, element) => (1 - index) * element.offsetWidth * .92,
          y: index => index === 1 ? 22 : 58,
          rotation: index => [7, -1, -7][index], scale: .96, transformOrigin: '50% 70%',
        }, {
          x: 0, y: 0, rotation: 0, scale: 1, ease: 'none',
          scrollTrigger: { trigger: passes, start: 'top 90%', end: 'top 25%', scrub: .7, invalidateOnRefresh: true },
        })
      })
      media.add('(max-width: 760px)', () => {
        cards.forEach((card, index) => gsap.fromTo(card, { y: 25, rotation: index % 2 ? 1.5 : -1.5, scale: .985 }, {
          y: 0, rotation: 0, scale: 1, ease: 'none',
          scrollTrigger: { trigger: card, start: 'top 96%', end: 'top 64%', scrub: .4, invalidateOnRefresh: true },
        }))
      })
    }, section)
    return () => { media.revert(); context.revert() }
  }, [motionEnabled])
  useEffect(() => {
    const dialog = dialogRef.current
    if (!active) return
    const previousOverflow = document.body.style.overflow
    if (!dialog.open) dialog.showModal()
    document.body.style.overflow = 'hidden'
    return () => {
      if (dialog.open) dialog.close()
      document.body.style.overflow = previousOverflow
    }
  }, [active])
  function backdropClick(event) {
    if (event.target !== event.currentTarget) return
    const rect = event.currentTarget.getBoundingClientRect()
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) setActive(null)
  }
  return <section ref={sectionRef} id="experiencia" className={`cp-section ${motionEnabled ? '' : 'cp-motion-off'}`}>
    <div className="cp-shell">
      <div className="cp-topline"><span>05 / EL CRITERIO DETRÁS</span><span>LUCA DESSENA MAFFUCCI</span></div>
      <div className="cp-heading" data-reveal><h2>La curiosidad<br /><span>también se entrena.</span></h2><p>Investigación, criterio y alguien<br />que responde del otro lado.</p></div>
      <div className="cp-passes">{credentials.map((credential, index) => <div key={credential.short} className={`cp-pass-scroll cp-scroll-${index}`}><CredentialPass credential={credential} index={index} motionEnabled={motionEnabled} onOpen={setActive} /></div>)}</div>
      <div className="cp-footnote"><span className="cp-footnote-mark" aria-hidden="true">↗</span><p>Documentación de formación individual. Las fechas y los ciclos corresponden a los certificados aportados; la vigencia actual requiere confirmación.</p><span>ABRE CADA PASE<br />PARA VER EL DOCUMENTO</span></div>
    </div>
    <dialog ref={dialogRef} className="cp-document-dialog" aria-labelledby={`${id}-title`} onCancel={(event) => { event.preventDefault(); setActive(null) }} onClose={() => { if (active) setActive(null) }} onClick={backdropClick}>
      <div className="cp-dialog-heading"><div><span>DOCUMENTO PROFESIONAL APORTADO</span><h3 id={`${id}-title`}>{active?.title}</h3></div><button type="button" onClick={() => setActive(null)} aria-label="Cerrar documento"><X size={21} aria-hidden="true" /></button></div>
      {active && <img src={active.file} alt={`${active.title}, documento de Luca Dessena Maffucci. ${active.label}: ${active.date}. ${active.note}`} />}
      <p>Consulta la fecha y el ciclo indicados en el documento. Se presenta como formación individual del profesional.</p>
    </dialog>
  </section>
}
