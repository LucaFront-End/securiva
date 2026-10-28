import { useEffect, useRef, useState } from 'react'
import './ApplicationLayers.css'

function WebPlane() {
  return <svg viewBox="0 0 300 246" fill="none" focusable="false">
    <rect x="25" y="29" width="250" height="183" rx="5" className="al-web-frame" />
    <path d="M25 55h250M77 55v157" className="al-svg-faint" />
    <path d="M37 42h9m8 0h8m179 0h21M39 74h22M39 86h15M39 111h22M39 123h15M39 148h22" className="al-svg-detail" />
    <rect x="91" y="70" width="167" height="47" rx="2" className="al-web-hero" />
    <path d="M103 83h59m-59 9h91m-91 9h36" className="al-svg-accent" />
    <rect x="91" y="131" width="76" height="56" rx="2" className="al-web-block" />
    <rect x="181" y="131" width="77" height="56" rx="2" className="al-web-block" />
    <path d="M104 146h37m-37 10h50m40-10h34m-34 10h50" className="al-svg-detail" />
    <path d="M104 175h18m72 0h18" className="al-svg-accent" />
    <text x="27" y="232" className="al-plane-type">WEB / INTERFACE LAYER</text>
    <path d="M244 229h29m-5-4 5 4-5 4" className="al-svg-detail" />
  </svg>
}

function ApiPlane() {
  return <svg viewBox="0 0 300 246" fill="none" focusable="false">
    <path d="M27 44h246M27 203h246M47 63v121M253 63v121" className="al-api-grid" strokeDasharray="2 6" />
    <path d="M47 123h42V85h62v77h61v-39h41" className="al-api-path" />
    <path d="M47 123h42v39h62V85h61v38h41" className="al-api-path-secondary" />
    <rect x="31" y="106" width="33" height="34" rx="3" className="al-api-node" />
    <rect x="134" y="106" width="34" height="34" rx="3" className="al-api-node al-api-node-core" />
    <rect x="236" y="106" width="33" height="34" rx="3" className="al-api-node" />
    <path d="m42 118 5 5-5 5m9 0h5m90-14-5 9 5 9m10-18 5 9-5 9m89-14v10m-5-5h10" className="al-api-symbol" />
    <circle cx="89" cy="85" r="3" className="al-api-dot" /><circle cx="212" cy="162" r="3" className="al-api-dot" />
    <text x="47" y="157" textAnchor="middle" className="al-api-label">REQUEST</text><text x="151" y="99" textAnchor="middle" className="al-api-label">ACCESS</text><text x="253" y="157" textAnchor="middle" className="al-api-label">RESPONSE</text>
    <text x="27" y="232" className="al-plane-type">API / AUTHORIZATION LAYER</text>
    <path d="M244 229h29m-5-4 5 4-5 4" className="al-svg-detail" />
  </svg>
}

function DataPlane() {
  return <svg viewBox="0 0 300 246" fill="none" focusable="false">
    <path d="M27 49h246M27 79h246M27 109h246M27 139h246M27 169h246M27 199h246M47 29v185M88 29v185M129 29v185M170 29v185M211 29v185M252 29v185" className="al-data-grid" />
    <rect x="67" y="130" width="166" height="37" rx="3" className="al-data-slab al-data-slab-bottom" />
    <rect x="67" y="105" width="166" height="37" rx="3" className="al-data-slab" />
    <rect x="67" y="80" width="166" height="37" rx="3" className="al-data-slab al-data-slab-top" />
    <path d="M80 93h60m-60 9h97m-97 16h60m-60 9h97m-97 16h60m-60 9h97" className="al-data-lines" />
    <circle cx="215" cy="98" r="3" className="al-data-dot" /><circle cx="215" cy="123" r="3" className="al-data-dot" /><circle cx="215" cy="148" r="3" className="al-data-dot" />
    <text x="27" y="232" className="al-plane-type">DATA / INFORMATION LAYER</text>
    <path d="M244 229h29m-5-4 5 4-5 4" className="al-svg-detail" />
  </svg>
}

export default function ApplicationLayers() {
  const rootRef = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    if (!('IntersectionObserver' in window)) { setVisible(true); return }
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { rootMargin: '50px', threshold: 0 })
    observer.observe(root)
    return () => observer.disconnect()
  }, [])

  return <figure ref={rootRef} className="al-visual" data-in-view={visible} role="img" aria-label="Representación isométrica ilustrativa de tres capas de una aplicación: interfaz web, autorización de la API y flujos de datos. Alcance de una auditoría de seguridad.">
    <div className="al-stage" aria-hidden="true">
      <div className="al-ground-shadow" />
      <div className="al-world">
        <div className="al-foundation"><span /><span /><span /><span /></div>
        <div className="al-pane al-pane-data"><DataPlane /></div>
        <div className="al-pane al-pane-api"><ApiPlane /></div>
        <div className="al-pane al-pane-web"><WebPlane /></div>
        <div className="al-scan-plane" />
        <span className="al-vertical-rail al-rail-one" /><span className="al-vertical-rail al-rail-two" />
      </div>
      <div className="al-annotation al-annotation-web"><span>WEB</span><p>Interfaces y sesiones</p></div>
      <div className="al-annotation al-annotation-api"><span>API</span><p>Permisos y accesos</p></div>
      <div className="al-annotation al-annotation-data"><span>DATA</span><p>Flujos de información</p></div>
    </div>
    <figcaption className="al-caption" aria-hidden="true"><span>WEB / API / DATA</span><p>La seguridad también está<br />en cómo se conectan.</p><span className="al-caption-note">REPRESENTACIÓN<br />ILUSTRATIVA</span></figcaption>
  </figure>
}
