import { useState } from 'react'
import { ArrowLeft, ArrowUpRight, Check, Menu, X } from 'lucide-react'
import ContactDialog from './ContactDialog'
import SecurityScopeTool from './SecurityScopeTool'
import { FaqList, ServiceLinks, MarketResourceLinks } from './ServiceDirectory'
import { resourcePages } from '../data/securityResources'
import { CONTACT_EMAIL } from '../config'
import './ResourceLanding.css'

export default function ResourceLanding({ page }) {
  const [contact, setContact] = useState(false)
  const [menu, setMenu] = useState(false)
  return <div className="editorial-site rl-page">
    <a className="skip-link" href="#contenido">Saltar al contenido</a>
    <header className="editorial-header"><a className="brand" href="/" aria-label="SECURIVA — inicio"><img src="/brand/securiva-mark-dark.svg" alt="" width="31" height="36"/><span>SECURIVA</span></a><nav className={menu ? 'main-nav is-open' : 'main-nav'} aria-label="Navegación principal"><a href="/recursos">Recursos</a><a href="/white-label-ciberseguridad">Para agencias</a><a href="/preparar-pentest">Preparar evaluación</a></nav><button className="header-cta" onClick={() => setContact(true)}>Hablemos<ArrowUpRight size={17}/></button><button className="menu-button" aria-expanded={menu} aria-label={menu ? 'Cerrar menú' : 'Abrir menú'} onClick={() => setMenu(!menu)}>{menu ? <X/> : <Menu/>}</button></header>
    <main id="contenido" className="rl-shell">
      <nav className="rl-breadcrumb" aria-label="Ubicación"><a href="/">SECURIVA</a><span>/</span>{page.path !== '/recursos' && <><a href="/recursos">Recursos</a><span>/</span></>}<span>{page.label}</span></nav>
      <section className="rl-hero"><p className="rl-eyebrow">SECURIVA / CONOCIMIENTO APLICADO</p><h1>{page.title}<br/><span>{page.emphasis}</span></h1><p className="rl-summary">{page.summary}</p><div className="rl-byline"><span>Por Luca Dessena Maffucci · SECURIVA</span><time dateTime="2026-10-28">Actualizado el 28 de octubre de 2026</time></div></section>
      {(page.kind === 'tool' || page.tool) && <SecurityScopeTool/>}
      {page.kind === 'resource-index' && <div className="rl-resource-grid">{resourcePages.map((item, i) => <a href={item.path} key={item.path}><span className="rl-eyebrow">GUÍA / 0{i + 1}</span><h2>{item.title}<br/><span>{item.emphasis}</span></h2><p>{item.description}</p><span className="rl-read">Leer la guía<ArrowUpRight size={22}/></span></a>)}<a className="rl-tool-card" href="/preparar-pentest"><span className="rl-eyebrow">HERRAMIENTA GRATUITA</span><h2>Un alcance claro.<br/><span>Antes de cotizar.</span></h2><p>Organiza activos, roles, flujos y autorizaciones en un brief que puedes descargar y compartir.</p><span className="rl-read">Preparar mi alcance<ArrowUpRight size={22}/></span></a></div>}
      {page.sections?.length > 0 && <div className="rl-content-grid"><aside className="rl-toc"><span className="rl-eyebrow">EN ESTA GUÍA</span><ol>{page.sections.map(section => <li key={section.id}><a href={'#' + section.id}>{section.title}</a></li>)}</ol></aside><article className="rl-article">{page.sections.map((section, i) => <section id={section.id} key={section.id}><span className="rl-eyebrow">{String(i + 1).padStart(2, '0')} / LO QUE NECESITAS SABER</span><h2>{section.title}</h2>{section.intro && <p>{section.intro}</p>}{section.paragraphs?.map(p => <p key={p}>{p}</p>)}{section.items && <div className="rl-items">{section.items.map(item => <div key={item.title}><h3>{item.title}</h3><p>{item.text}</p></div>)}</div>}{section.checklist && <ul className="rl-checklist">{section.checklist.map(item => <li key={item}><Check size={18} aria-hidden="true"/><span>{item}</span></li>)}</ul>}</section>)}</article></div>}
      {page.faq?.length > 0 && <section className="rl-faq"><div><span className="rl-eyebrow">PREGUNTAS FRECUENTES</span><h2>Respuestas.<br/><span>Sin rodeos.</span></h2></div><FaqList items={page.faq}/></section>}
      {page.references?.length > 0 && <section className="rl-references"><span className="rl-eyebrow">FUENTES Y REFERENCIAS TÉCNICAS</span><ul>{page.references.map(reference => <li key={reference.url}><a href={reference.url} target="_blank" rel="noopener noreferrer">{reference.label}<ArrowUpRight size={16}/></a></li>)}</ul><p>Estas referencias orientan la metodología. El alcance y los entregables se acuerdan para cada evaluación.</p></section>}
      <section className="rl-contact"><span className="rl-eyebrow">DEL CONTEXTO A LA ACCIÓN</span><h2>Convirtamos la pregunta<br/><span>en un alcance.</span></h2><button onClick={() => setContact(true)}>Hablar de mi proyecto<ArrowUpRight size={22}/></button></section>
      <section className="rl-services"><span className="rl-eyebrow">SERVICIOS DE SECURIVA</span><ServiceLinks/><MarketResourceLinks/></section>
    </main>
    <footer className="rl-footer rl-shell"><a href="/"><ArrowLeft size={15}/>Volver a SECURIVA</a><a href={'mailto:' + CONTACT_EMAIL}>{CONTACT_EMAIL}</a><span>REAL SECURITY. REAL IMPACT.</span></footer>
    <ContactDialog open={contact} onClose={() => setContact(false)} initialService="Pentesting"/>
  </div>
}
