import { useState } from 'react'
import { ArrowLeft, ArrowUpRight, Check, Menu, X } from 'lucide-react'
import ContactDialog from './ContactDialog'
import ServiceSceneFallback from './ServiceSceneFallback'
import { FaqList, ServiceLinks, MarketResourceLinks } from './ServiceDirectory'
import { CONTACT_EMAIL, CONTACT_WHATSAPP } from '../config'
import { trackEvent } from '../lib/analytics'
import './ServiceLanding.css'

export default function ServiceLanding({ page }) {
  const [menu, setMenu] = useState(false)
  const [contact, setContact] = useState(false)
  const openContact = () => { setMenu(false); setContact(true); trackEvent('contact_dialog_open', { service:page.label, placement:'service_page' }) }
  return <div className="editorial-site sl-page" data-motion="full">
    <a className="skip-link" href="#contenido">Saltar al contenido</a>
    <header className="editorial-header"><a className="brand" href="/" aria-label="SECURIVA — inicio"><img src="/brand/securiva-mark-dark.svg" alt="" width="31" height="36"/><span>SECURIVA</span></a><nav className={menu ? 'main-nav is-open' : 'main-nav'} aria-label="Navegación principal"><a href="/#servicios">Qué hacemos</a><a href="/white-label-ciberseguridad">Para agencias</a><a href="/blog">Blog</a></nav><button className="header-cta" onClick={openContact}>Hablemos<ArrowUpRight size={17}/></button><button className="menu-button" aria-label={menu ? 'Cerrar menú' : 'Abrir menú'} aria-expanded={menu} onClick={() => setMenu(!menu)}>{menu ? <X/> : <Menu/>}</button></header>
    <main id="contenido">
      <section className="sl-hero sl-shell"><nav className="sl-breadcrumb sl-mono" aria-label="Ubicación"><a href="/">SECURIVA</a><span aria-hidden="true">/</span><span>{page.label}</span></nav><div className="sl-hero-grid"><div><p className="sl-mono sl-kicker">{page.label.toUpperCase()} / {page.marketLabel || 'ARGENTINA + MÉXICO'}</p><h1>{page.title}<br/><span>{page.emphasis}</span></h1><p className="sl-summary">{page.summary}</p><button className="sl-primary" onClick={openContact}>{page.cta}<ArrowUpRight size={20}/></button></div><figure className={'sl-hero-art sl-art-' + page.kind}><ServiceSceneFallback kind={page.kind === 'api' ? 'pentest' : page.kind}/><figcaption className="sl-mono">REPRESENTACIÓN ILUSTRATIVA / {page.label.toUpperCase()}</figcaption></figure></div><div className="sl-hero-footer"><span className="sl-mono">REAL SECURITY. REAL IMPACT.</span><p>{page.forWhom}</p></div></section>
      <section className="sl-scope"><div className="sl-shell"><div className="sl-section-heading"><span className="sl-mono">01 / QUÉ EVALUAMOS</span><h2>{page.promise}</h2></div><div className="sl-topics">{page.topics.map((topic, i) => <article key={topic.title}><span className="sl-mono">0{i + 1}</span><h3>{topic.title}</h3><p>{topic.text}</p></article>)}</div></div></section>
      <section className="sl-delivery sl-shell"><div className="sl-section-heading"><span className="sl-mono">02 / LO QUE RECIBES</span><h2>Una entrega<br/><span>para tomar decisiones.</span></h2></div><div className="sl-deliverables">{page.deliverables.map(([title, text], i) => <article key={title}><span className="sl-mono">0{i + 1}</span><h3>{title}</h3><p>{text}</p></article>)}</div><div className="sl-inputs"><h3>Para definir el alcance</h3><ul>{page.inputs.map(input => <li key={input}><Check size={15} aria-hidden="true"/>{input}</li>)}</ul><p>La cotización confirma la cobertura, las exclusiones, los accesos, las fechas y las condiciones antes de las pruebas.</p></div></section>
      <section className="sl-faq sl-shell" aria-labelledby="sl-faq-title"><div><span className="sl-mono">03 / PREGUNTAS FRECUENTES</span><h2 id="sl-faq-title">Hablemos<br/><span>con claridad.</span></h2></div><FaqList items={page.faq}/></section>
      <section className="sl-next sl-shell"><span className="sl-mono">04 / TU PRÓXIMO PASO</span><h2>Lo definimos<br/><span>contigo.</span></h2><button onClick={openContact}>{page.cta}<ArrowUpRight size={25}/></button><div className="sl-direct"><a href={'mailto:' + CONTACT_EMAIL}>{CONTACT_EMAIL}</a><a href={'https://wa.me/' + CONTACT_WHATSAPP} target="_blank" rel="noopener noreferrer">WhatsApp<ArrowUpRight size={15}/></a></div></section>
      <section className="sl-related sl-shell"><span className="sl-mono">OTRAS FORMAS DE TRABAJAR JUNTOS</span><ServiceLinks currentPath={page.path}/><MarketResourceLinks/></section>
    </main>
    <footer className="sl-footer sl-shell"><a href="/" className="sl-back"><ArrowLeft size={15}/>Volver a SECURIVA</a><div><span>Responsable técnico: Luca Dessena Maffucci.</span><span>Contenido actualizado el 28 de octubre de 2026.</span>{page.reference && <a href={page.reference.url} target="_blank" rel="noopener noreferrer">Referencia técnica: {page.reference.label}<ArrowUpRight size={12}/></a>}</div><span className="sl-mono">SECURIVA / REAL SECURITY. REAL IMPACT.</span></footer>
    <ContactDialog open={contact} onClose={() => setContact(false)} initialService={page.contactService}/>
  </div>
}

export function NotFoundPage() {
  return <main className="sl-not-found"><a className="brand" href="/"><img src="/brand/securiva-mark-dark.svg" alt="" width="31" height="36"/><span>SECURIVA</span></a><p className="sl-mono">404 / PÁGINA NO ENCONTRADA</p><h1>Volvamos<br/>al principio.</h1><a className="sl-primary" href="/">Ir a SECURIVA<ArrowUpRight size={20}/></a></main>
}
