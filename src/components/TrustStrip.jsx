import { useEffect, useRef, useState } from 'react'
import { approvedBrands, referenceBrands } from '../data/socialProof'
import './TrustStrip.css'

function ReservedMark({ variant }) {
  const shapes = [
    <><path d="m22 2 20 20-20 20L2 22 22 2Z" /><path d="m22 12 10 10-10 10-10-10 10-10Z" /></>,
    <><path d="M5 12h24v24H5z" /><path d="M15 3h24v24H15z" /></>,
    <><path d="M5 38V23a17 17 0 0 1 34 0v15M13 38V23a9 9 0 0 1 18 0v15" /><path d="M21 16v22" /></>,
    <><circle cx="22" cy="22" r="19" /><path d="M3 22h38M22 3v38M8.5 8.5l27 27M8.5 35.5l27-27" /></>,
    <><path d="m22 3 20 35H2L22 3Z" /><path d="m22 16 12 22H10l12-22Z" /></>,
  ]
  return <svg viewBox="0 0 44 44" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true" focusable="false">{shapes[variant % shapes.length]}</svg>
}

function BrandItem({ brand, placeholder, reference, index, duplicate }) {
  const content = placeholder
    ? <><ReservedMark variant={index} /><span>LOGO DE CLIENTE</span></>
    : brand.logoUrl ? <img src={brand.logoUrl} alt={brand.name} loading="lazy" /> : <span className="ts-brand-wordmark">{brand.name}</span>
  return <div className={`ts-brand ${placeholder ? 'ts-brand-reserved' : ''} ${reference ? 'ts-brand-reference' : ''}`} role={duplicate ? undefined : 'listitem'}>
    {!placeholder && !reference && brand.href && !duplicate
      ? <a href={brand.href} target="_blank" rel="noopener noreferrer" aria-label={`Visitar ${brand.name}`}>{content}</a>
      : <span className="ts-brand-content">{content}</span>}
  </div>
}

export default function TrustStrip({ motionEnabled = true, data = approvedBrands, referenceData = referenceBrands }) {
  const rootRef = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    if (!('IntersectionObserver' in window)) { setVisible(true); return }
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { rootMargin: '100px', threshold: 0 })
    observer.observe(root)
    return () => observer.disconnect()
  }, [])
  const brands = Array.isArray(data) ? data.filter(brand => brand && typeof brand.name === 'string' && brand.name.trim()) : []
  const empty = brands.length === 0
  const references = Array.isArray(referenceData) ? referenceData.filter(name => typeof name === 'string' && name.trim()).map(name => ({ name: name.trim() })) : []
  const referenceMode = empty && references.length > 0
  const placeholder = empty && !referenceMode
  const items = empty ? referenceMode ? references : Array.from({ length: 5 }, () => null) : brands
  const effectivePaused = !visible || !motionEnabled

  return <section ref={rootRef} className={`ts-section ${referenceMode ? 'ts-reference-mode' : ''} ${!motionEnabled ? 'ts-motion-off' : ''}`} aria-label={referenceMode ? 'Maqueta con marcas de referencia, no clientes confirmados' : empty ? 'Espacio reservado para marcas autorizadas' : 'Equipos que confían en SECURIVA'}>
    <div className="ts-topline"><h2>{empty ? 'Un espacio para la confianza.' : 'Equipos que confían en SECURIVA'}</h2><div className="ts-meta"><span>{referenceMode ? 'MAQUETA · MARCAS DE REFERENCIA, NO CLIENTES CONFIRMADOS' : empty ? 'ESPACIO RESERVADO PARA MARCAS AUTORIZADAS' : 'REFERENCIAS AUTORIZADAS'}</span></div></div>
    <div className="ts-marquee" data-paused={effectivePaused} tabIndex={0} aria-label={referenceMode ? 'Referencias tipográficas de diseño. Estas marcas no se presentan como clientes de SECURIVA.' : empty ? 'Vista previa con cinco espacios para logos de clientes; todavía no se muestran marcas de clientes.' : 'Marcas de clientes. El movimiento se pausa al enfocar esta colección.'}>
      <div className="ts-track" style={{ '--ts-duration': `${Math.max(37, items.length * 6)}s` }}>
        <div className="ts-group" role="list">{items.map((brand, index) => <BrandItem key={index} brand={brand} placeholder={placeholder} reference={referenceMode} index={index} />)}</div>
        <div className="ts-group ts-group-duplicate" aria-hidden="true">{items.map((brand, index) => <BrandItem key={index} brand={brand} placeholder={placeholder} reference={referenceMode} index={index} duplicate />)}</div>
      </div>
    </div>
  </section>
}
