import { useState } from 'react'
import { ArrowLeft, ArrowUpRight, Check, Menu, X } from 'lucide-react'
import ContactDialog from './ContactDialog'
import SecurityScopeTool from './SecurityScopeTool'
import { FaqList, ServiceLinks, MarketResourceLinks } from './ServiceDirectory'
import { resourcePages } from '../data/securityResources'
import { seoPages } from '../data/pageRegistry'
import BlogIndex, { RelatedReading } from './BlogIndex'
import SampleReport from './SampleReport'
import { CONTACT_EMAIL } from '../config'
import { editorialDate } from '../lib/editorialDate'
import './ResourceLanding.css'

export default function ResourceLanding({ page }) {
  const [contact, setContact] = useState(false)
  const [menu, setMenu] = useState(false)
  const modified=editorialDate(page.updatedAt)
  const contextualLinks=(page.relatedPaths || []).filter(path=>!path.startsWith('/blog')).map(path=>seoPages.find(item=>item.path===path)).filter(Boolean)
  return <div className={'editorial-site rl-page' + (page.isBlog ? ' bi-page' : '')}>
    <a className="skip-link" href="#contenido">Saltar al contenido</a>
    <header className="editorial-header"><a className="brand" href="/" aria-label="SECURIVA — inicio"><img src="/brand/securiva-mark-dark.svg" alt="" width="31" height="36"/><span>SECURIVA</span></a><nav className={menu ? 'main-nav is-open' : 'main-nav'} aria-label="Navegación principal"><a href="/blog">Blog</a><a href="/recursos">Recursos</a><a href="/preparar-pentest">Preparar evaluación</a></nav><button className="header-cta" onClick={() => setContact(true)}>Hablemos<ArrowUpRight size={17}/></button><button className="menu-button" aria-expanded={menu} aria-label={menu ? 'Cerrar menú' : 'Abrir menú'} onClick={() => setMenu(!menu)}>{menu ? <X/> : <Menu/>}</button></header>
    <main id="contenido" className="rl-shell">
      <nav className="rl-breadcrumb" aria-label="Ubicación"><a href="/">SECURIVA</a><span>/</span>{page.path !== '/recursos' && page.path !== '/blog' && page.kind !== 'about' && <><a href={page.isBlog ? '/blog' : '/recursos'}>{page.isBlog ? 'Blog' : 'Recursos'}</a><span>/</span></>}<span>{page.label}</span></nav>
      <section className="rl-hero"><p className="rl-eyebrow">SECURIVA / CONOCIMIENTO APLICADO</p><h1>{page.title}<br/><span>{page.emphasis}</span></h1><p className="rl-summary">{page.summary}</p><div className="rl-byline"><a href="/sobre-securiva#luca-dessena-maffucci">Por Luca Dessena Maffucci · SECURIVA</a>{modified && <time dateTime={page.updatedAt}>Actualizado el {modified}</time>}</div></section>
      {(page.kind === 'tool' || page.tool) && <SecurityScopeTool/>}
      {page.isSample && <SampleReport/>}
      {page.isBlog && <p className="bi-reading-meta">{page.category.toUpperCase()} / {page.readingMinutes || 5} MIN DE LECTURA</p>}
      {page.kind === 'blog-index' && <BlogIndex/>}
      {page.kind === 'resource-index' && <div className="rl-resource-grid">{resourcePages.map((item, i) => <a href={item.path} key={item.path}><span className="rl-eyebrow">GUÍA / 0{i + 1}</span><h2>{item.title}<br/><span>{item.emphasis}</span></h2><p>{item.description}</p><span className="rl-read">Leer la guía<ArrowUpRight size={22}/></span></a>)}<a className="rl-sample-card" href="/informe-pentest-ejemplo"><span className="rl-eyebrow">ENTREGA WHITE LABEL / MUESTRA TÉCNICA</span><h2>Así se documenta.<br/><span>Así se puede actuar.</span></h2><p>Un hallazgo de ejemplo con contexto ejecutivo, evidencia sintética, recomendaciones y una matriz de retest.</p><span className="rl-read">Ver el informe de muestra<ArrowUpRight size={22}/></span></a><a className="rl-tool-card" href="/preparar-pentest"><span className="rl-eyebrow">HERRAMIENTA GRATUITA</span><h2>Un alcance claro.<br/><span>Antes de cotizar.</span></h2><p>Organiza activos, roles, flujos y autorizaciones en un brief que puedes descargar y compartir.</p><span className="rl-read">Preparar mi alcance<ArrowUpRight size={22}/></span></a></div>}
      {page.sections?.length > 0 && <div className="rl-content-grid"><aside className="rl-toc"><span className="rl-eyebrow">EN ESTA GUÍA</span><ol>{page.sections.map(section => <li key={section.id}><a href={'#' + section.id}>{section.title.replace(/^\d+\.\s*/, '')}</a></li>)}</ol></aside><article className="rl-article">{page.sections.map((section, i) => <section id={section.id} key={section.id}><span className="rl-eyebrow">{String(i + 1).padStart(2, '0')} / LO QUE NECESITAS SABER</span><h2>{section.title.replace(/^\d+\.\s*/, '')}</h2>{section.intro && <p>{section.intro}</p>}{section.paragraphs?.map(p => <p key={p}>{p}</p>)}{section.items && <div className="rl-items">{section.items.map(item => <div key={item.title}><h3>{item.title}</h3><p>{item.text}</p></div>)}</div>}{section.checklist && <ul className="rl-checklist">{section.checklist.map(item => <li key={item}><Check size={18} aria-hidden="true"/><span>{item}</span></li>)}</ul>}</section>)}</article></div>}
      {page.faq?.length > 0 && <section className="rl-faq"><div><span className="rl-eyebrow">PREGUNTAS FRECUENTES</span><h2>Respuestas.<br/><span>Sin rodeos.</span></h2></div><FaqList items={page.faq}/></section>}
      {page.references?.length > 0 && <section className="rl-references"><span className="rl-eyebrow">FUENTES Y REFERENCIAS TÉCNICAS</span><ul>{page.references.map(reference => <li key={reference.url}><a href={reference.url} target="_blank" rel="noopener noreferrer">{reference.label}<ArrowUpRight size={16}/></a></li>)}</ul><p>Estas referencias orientan la metodología. El alcance y los entregables se acuerdan para cada evaluación.</p></section>}
      {contextualLinks.length > 0 && <nav className="bi-guide-links" aria-label="Recursos para llevarlo a la práctica">{contextualLinks.map(link=><a key={link.path} href={link.path}>{link.title.split(' | ')[0]}<ArrowUpRight size={16}/></a>)}</nav>}
      {(page.isBlog || (page.isSample && page.relatedPaths?.some(path=>path.startsWith('/blog/')))) && <RelatedReading page={page}/>}
      <section className="rl-contact"><span className="rl-eyebrow">DEL CONTEXTO A LA ACCIÓN</span><h2>Convirtamos la pregunta<br/><span>en un alcance.</span></h2><button onClick={() => setContact(true)}>Hablar de mi proyecto<ArrowUpRight size={22}/></button></section>
      <section className="rl-services"><span className="rl-eyebrow">SERVICIOS DE SECURIVA</span><ServiceLinks/><MarketResourceLinks/></section>
    </main>
    <footer className="rl-footer rl-shell"><a href="/"><ArrowLeft size={15}/>Volver a SECURIVA</a><a href={'mailto:' + CONTACT_EMAIL}>{CONTACT_EMAIL}</a><a href="/sobre-securiva">Sobre SECURIVA</a><span>REAL SECURITY. REAL IMPACT.</span></footer>
    <ContactDialog open={contact} onClose={() => setContact(false)} initialService="Pentesting"/>
  </div>
}
