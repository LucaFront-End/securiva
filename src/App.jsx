import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { ArrowDown, ArrowUpRight, Menu, X } from 'lucide-react'
import ContactDialog from './components/ContactDialog'
import AgencyReveal from './components/AgencyReveal'
import CredentialPasses from './components/CredentialPasses'
import EditorialFooter from './components/EditorialFooter'
import ServiceGallery from './components/ServiceGallery'
import SecurityArchitecture from './components/SecurityArchitecture'
import SecurityProcess from './components/SecurityProcess'
import TrustStrip from './components/TrustStrip'
import ClientVoices from './components/ClientVoices'
import ServiceDirectory from './components/ServiceDirectory'
import ServiceLanding, { NotFoundPage } from './components/ServiceLanding'
import { servicePages } from './data/seoPages'
import { observeContactLinks, trackEvent } from './lib/analytics'
import useEditorialMotion from './hooks/useEditorialMotion'
import { CONTACT_EMAIL, CONTACT_WHATSAPP } from './config'

const LiquidArt = lazy(() => import('./components/LiquidArt'))
function Brand() {
  return <a className="brand" href="#inicio" aria-label="SECURIVA — inicio"><img src="/brand/securiva-mark-dark.svg" alt="" width="31" height="36"/><span>SECURIVA</span></a>
}
function HomePage() {
  const root = useRef(null)
  const [menu, setMenu] = useState(false)
  const [contact, setContact] = useState(false)
  const [service, setService] = useState('Pentesting')
  const motionEnabled = true
  useEditorialMotion(root, motionEnabled)
  const openContact = (next='Pentesting') => { setService(next); setContact(true); setMenu(false); trackEvent('contact_dialog_open', { service:next, placement:'home' }) }
  return <div ref={root} className="editorial-site" data-motion={motionEnabled?'full':'reduced'}>
    <a className="skip-link" href="#contenido">Saltar al contenido</a>
    <header className="editorial-header">
      <Brand/>
      <nav className={menu?'main-nav is-open':'main-nav'} aria-label="Navegación principal"><a href="#servicios" onClick={()=>setMenu(false)}>Qué hacemos</a><a href="#agencias" onClick={()=>setMenu(false)}>Para agencias</a><a href="#metodo" onClick={()=>setMenu(false)}>Cómo pensamos</a></nav>
      <button className="header-cta" onClick={()=>openContact()}>Hablemos <ArrowUpRight size={17}/></button>
      <button className="menu-button" aria-label={menu?'Cerrar menú':'Abrir menú'} aria-expanded={menu} onClick={()=>setMenu(!menu)}>{menu?<X/>:<Menu/>}</button>
    </header>
    <main id="contenido">
      <section id="inicio" className="cover">
        <div className="cover-kicker mono"><span>AUDITORÍAS DE VULNERABILIDADES Y PENTESTING</span><span>MÉXICO + LATINOAMÉRICA</span></div>
        <h1 className="cover-title"><span className="title-first">Lo invisible,</span><span className="title-last">a la vista<span className="blue-period">.</span></span></h1>
        <div className="cover-art"><Suspense fallback={<img className="art-fallback" src="/art/liquid-sculpture.webp" alt=""/>}><LiquidArt motionEnabled={motionEnabled}/></Suspense></div>
        <div className="cover-bottom"><a href="#riesgo" className="explore-link"><span className="circle-arrow"><ArrowDown size={23}/></span><span>Mira cómo<br/>lo investigamos.</span></a><p>Auditorías de vulnerabilidades y pentesting en México.<br className="desktop-break"/> Seguridad para empresas, SaaS y agencias con tu marca.</p></div>
        <span className="cover-edge mono">REAL SECURITY. REAL IMPACT.</span>
      </section>
      <TrustStrip motionEnabled={motionEnabled}/>
      <SecurityArchitecture motionEnabled={motionEnabled} onContact={openContact}/>
      <ServiceGallery onContact={openContact}/>
      <AgencyReveal onContact={()=>openContact('White label')} motionEnabled={motionEnabled}/>
      <SecurityProcess motionEnabled={motionEnabled}/>
      <ClientVoices motionEnabled={motionEnabled}/>
      <CredentialPasses motionEnabled={motionEnabled}/>
      <ServiceDirectory/>
      <section className="conversation" id="contacto"><div className="conversation-top"><span className="eyebrow">06 / EL SIGUIENTE MOVIMIENTO ES TUYO</span><span className="contact-star" aria-hidden="true">✳</span></div><h2 data-reveal>Pon tu seguridad<br/><span>sobre la mesa.</span></h2><div className="conversation-bottom"><p>Una aplicación. Una agencia. Una buena pregunta.<br/>Todo empieza con una conversación.</p><button className="conversation-button" onClick={()=>openContact()}><span>Hablemos de tu proyecto</span><ArrowUpRight strokeWidth={1}/></button></div><div className="direct-contact"><a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}<ArrowUpRight size={16}/></a><a href={`https://wa.me/${CONTACT_WHATSAPP}`} target="_blank" rel="noopener noreferrer">WhatsApp +54 11 2654 7874<ArrowUpRight size={16}/></a></div></section>
    </main>
    <EditorialFooter motionEnabled={motionEnabled}/>
    <ContactDialog open={contact} onClose={()=>setContact(false)} initialService={service}/>
  </div>
}

export default function App({ path = '/' }) {
  useEffect(() => observeContactLinks(), [])
  const pathname = path === '/' ? '/' : '/' + path.replace(/^\/+|\/+$/g, '')
  if (pathname === '/') return <HomePage/>
  const page = servicePages.find(service => service.path === pathname)
  return page ? <ServiceLanding page={page}/> : <NotFoundPage/>
}
