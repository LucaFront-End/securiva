import { ArrowUpRight, Plus } from 'lucide-react'
import { commonFaqs, servicePages } from '../data/seoPages'
import './ServiceLanding.css'

export function ServiceLinks({ currentPath = '' }) {
  return <nav className="sl-service-links" aria-label="Servicios de ciberseguridad">{servicePages.filter(page => page.path !== currentPath).map(page => <a key={page.path} href={page.path}><span className="sl-mono">{page.number}</span><span>{page.label}</span><ArrowUpRight size={20} strokeWidth={1.2} aria-hidden="true"/></a>)}</nav>
}

export function FaqList({ items, id = 'preguntas' }) {
  return <div className="sl-faq-list" id={id}>{items.map(item => <details key={item.question}><summary><span>{item.question}</span><Plus size={20} strokeWidth={1.2} aria-hidden="true"/></summary><p>{item.answer}</p></details>)}</div>
}

export function MarketResourceLinks() {
  return <div className="sl-market-resources"><div><span className="sl-mono">COBERTURA REMOTA EN ESPAÑOL</span><nav className="sl-service-links" aria-label="Cobertura de SECURIVA"><a href="/argentina"><span className="sl-mono">AR</span><span>Argentina</span><ArrowUpRight size={20}/></a><a href="/mexico"><span className="sl-mono">MX</span><span>México</span><ArrowUpRight size={20}/></a></nav></div><div><span className="sl-mono">PARA PREPARAR UNA MEJOR EVALUACIÓN</span><nav className="sl-service-links" aria-label="Herramientas y guías"><a href="/blog"><span className="sl-mono">01</span><span>Guías y blog</span><ArrowUpRight size={20}/></a><a href="/preparar-pentest"><span className="sl-mono">02</span><span>Preparar mi alcance</span><ArrowUpRight size={20}/></a></nav></div></div>
}

export default function ServiceDirectory() {
  return <section className="sl-directory" aria-labelledby="service-directory-title"><div className="sl-shell"><div className="sl-section-heading"><span className="sl-mono">SERVICIOS / ALCANCES Y ENTREGABLES</span><h2 id="service-directory-title">Más claridad.<br/><span>Desde el principio.</span></h2></div><ServiceLinks/><MarketResourceLinks/><div className="sl-home-faq"><div><span className="sl-mono">ANTES DE EMPEZAR</span><h2>Las preguntas<br/>que importan.</h2><p>Alcance, entregables y forma de trabajar. Lo que necesitas saber antes de una evaluación.</p></div><FaqList items={commonFaqs}/></div></div></section>
}
