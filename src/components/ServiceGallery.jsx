import { lazy, Suspense, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { ArrowDown, ArrowUpRight } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SceneBoundary from './SceneBoundary'
import ServiceSceneFallback from './ServiceSceneFallback'
import './newServiceGallery.css'

const ServiceScene = lazy(() => import('./ServiceScene'))
const sceneBoundaries = [0, .5, 1.5, 2]

gsap.registerPlugin(ScrollTrigger)
const offers = [
  { id:'01', name:'Pentesting', kind:'pentest', category:'WEB / APIs / INFRAESTRUCTURA', caption:'De la superficie al hallazgo.', sceneLabel:'Modelo de investigación de vulnerabilidades en una aplicación web', title:<>Ponerlo<br/><em>a prueba.</em></>, text:'Investigamos como un atacante. Evidencia concreta para que tu equipo sepa dónde actuar.', facts:['Alcance y permisos acordados','Hallazgos reproducibles','Correcciones + retest según alcance'], cta:'Evaluemos tu seguridad' },
  { id:'02', name:'Private Bug Bounty', kind:'bounty', category:'INVESTIGACIÓN PRIVADA', caption:'El impacto se demuestra.', sceneLabel:'Modelo de validación de un hallazgo en un programa privado de bug bounty', title:<>Solo cuenta<br/><em>lo real.</em></>, text:'Base de activación + recompensas por vulnerabilidades validadas. Tú apruebas el presupuesto.', facts:['Reglas de elegibilidad claras','Validación manual de hallazgos','Presupuesto máximo aprobado por ti'], cta:'Diseñemos tu programa' },
  { id:'03', name:'White label', kind:'label', category:'PARA AGENCIAS DIGITALES', caption:'El mismo rigor. Tu identidad.', sceneLabel:'Modelo de un informe técnico personalizado con la identidad de una agencia', title:<>Tu marca.<br/><em>Nuestro criterio.</em></>, text:'Ciberseguridad bajo tu marca. Tú mantienes la relación; nosotros aportamos el trabajo técnico.', facts:['Reportes con tu identidad','Pruebas ajustadas a cada proyecto','Soporte técnico dentro del alcance'], cta:'Sumemos fuerzas' },
]

export default function ServiceGallery({ onContact }) {
  const [active,setActive] = useState(0)
  const [loadScenes,setLoadScenes] = useState(false)
  const modelProgress = useRef([{current:0},{current:0},{current:0}])
  const sectionRef = useRef(null)
  const sceneRef = useRef(null)
  const activeRef = useRef(0)
  const navigateRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if(entry.isIntersecting){setLoadScenes(true);observer.disconnect()}
    },{rootMargin:'200px'})
    if(sectionRef.current) observer.observe(sectionRef.current)
    return()=>observer.disconnect()
  },[])

  useLayoutEffect(() => {
    const section = sectionRef.current, scene = sceneRef.current
    if (!section || !scene) return undefined
    const cards = [...scene.querySelectorAll('.ds-sheet')]
    const navigation = [...scene.querySelectorAll('.ds-nav button')]
    const progressBar = scene.querySelector('.ds-progress i')
    const view = { cursor:0 }
    let trigger, transition, pinned, disposed=false, frame=0, measure=''
    let raw=0
    const activate = next => {
      if (activeRef.current === next) return
      // A disappearing sheet must never leave keyboard focus behind it.
      if (cards[activeRef.current]?.contains(document.activeElement)) navigation[next]?.focus({preventScroll:true})
      activeRef.current=next
      setActive(next)
    }
    const draw = () => {
      if (disposed) return
      const cursor=gsap.utils.clamp(0,2,view.cursor)
      let next=activeRef.current
      while(next<2 && cursor>next+.53) next++
      while(next>0 && cursor<next-.53) next--
      activate(next)
      cards.forEach((card,index)=>{
        const relative=cursor-index
        // Each visible chapter traverses its complete local 3D path.
        modelProgress.current[index].current=gsap.utils.clamp(0,1,(cursor-sceneBoundaries[index])/(sceneBoundaries[index+1]-sceneBoundaries[index]))
        if(relative<0){
          const depth=-relative
          gsap.set(card,{y:depth*17,yPercent:0,rotation:(index%2?1.15:-1.15)*Math.min(1,depth),scale:1-depth*.025,opacity:1,zIndex:10-index})
        }else{
          const exit=gsap.utils.clamp(0,1,(relative-.08)/.84)
          const eased=exit*exit*(3-2*exit)
          gsap.set(card,{y:pinned?0:(raw-.5)*5,yPercent:-116*eased,rotation:-3.5*eased,scale:1-eased*.035,opacity:exit>.94?1-(exit-.94)/.06:1,zIndex:10-index})
        }
      })
      if(progressBar) progressBar.style.transform=`scaleX(${pinned?raw:cursor/2})`
    }
    const update = self => {
      raw=self.progress
      if(pinned){view.cursor=raw*2;draw()}
      else if(!transition?.isActive()) draw()
    }
    const setup = () => {
      if(disposed) return
      const currentMeasure=`${scene.clientWidth}/${scene.clientHeight}/${window.innerWidth}/${window.innerHeight}`
      if(currentMeasure===measure&&trigger) return
      measure=currentMeasure
      const nextPinned=Math.max(scene.clientHeight,scene.scrollHeight)<=window.innerHeight*.88
      if(trigger&&nextPinned===pinned){trigger.refresh();return}
      transition?.kill()
      trigger?.kill()
      pinned=nextPinned
      section.dataset.dossierMode=pinned?'pinned':'natural'
      if(!pinned) view.cursor=activeRef.current
      trigger=ScrollTrigger.create({
        trigger:scene,start:pinned?'top 6%':'top 82%',
        end:pinned?()=>`+=${Math.round(window.innerHeight*(window.innerWidth<701?1:1.15))}`:'bottom 20%',
        pin:pinned?scene:false,pinSpacing:pinned,anticipatePin:pinned?1:0,
        invalidateOnRefresh:true,onUpdate:update,onRefresh:update,
      })
      draw()
      ScrollTrigger.refresh()
    }
    const schedule = () => { if(!disposed&&!frame) frame=requestAnimationFrame(()=>{frame=0;setup()}) }
    navigateRef.current = index => {
      if(pinned&&trigger){
        const target=trigger.start+(trigger.end-trigger.start)*index/2
        window.scrollTo({top:Math.max(0,Math.min(ScrollTrigger.maxScroll(window),target)),behavior:'smooth'})
      }else{
        transition?.kill()
        transition=gsap.to(view,{cursor:index,duration:.6,ease:'power2.inOut',onUpdate:draw,onComplete:draw})
      }
    }
    setup()
    const observer=new ResizeObserver(schedule)
    observer.observe(scene)
    window.addEventListener('resize',schedule,{passive:true})
    document.fonts?.ready.then(()=>{if(!disposed)schedule()})
    return()=>{
      disposed=true
      cancelAnimationFrame(frame)
      observer.disconnect()
      window.removeEventListener('resize',schedule)
      transition?.kill()
      trigger?.kill()
      navigateRef.current=null
      gsap.set(cards,{clearProps:'transform,opacity,zIndex'})
      delete section.dataset.dossierMode
    }
  },[])

  return <section className="ds-section" id="servicios" ref={sectionRef} aria-labelledby="services-heading">
    <header className="ds-heading"><span className="ds-mono">02 / SERVICIOS</span><h2 id="services-heading" data-reveal>Tres maneras<br/><span>de ir a fondo.</span></h2><p>La misma exigencia técnica.<br/>La forma de trabajar que tu proyecto necesita.</p></header>
    <div className="ds-experience" ref={sceneRef}>
      <nav className="ds-nav" aria-label="Elegir un servicio">{offers.map((offer,index)=><button key={offer.id} type="button" aria-label={`${offer.id} — ${offer.name}`} aria-pressed={active===index} aria-controls={`dossier-${offer.id}`} onClick={()=>navigateRef.current?.(index)}><span>{offer.id}</span><span className="ds-nav-line"/></button>)}<span className="ds-nav-caption">DESLIZA<ArrowDown size={12} aria-hidden="true"/></span></nav>
      <div className="ds-stack">{offers.map((offer,index)=><article id={`dossier-${offer.id}`} key={offer.id} className={`ds-sheet ds-${offer.kind} ${active===index?'is-active':''}`} aria-hidden={active!==index} inert={active!==index} aria-labelledby={`dossier-title-${offer.id}`}>
        <div className="ds-sheet-top ds-mono"><span>{offer.name}</span><span>SECURIVA / {offer.id}</span></div>
        <div className="ds-main">
          <div className="ds-title-area"><span className="ds-category ds-mono">{offer.category}</span><h3 id={`dossier-title-${offer.id}`}>{offer.title}</h3></div>
          <figure className="ds-model">
            <div className="ds-service-art"><SceneBoundary fallback={<ServiceSceneFallback kind={offer.kind}/>}>
              {loadScenes ? <Suspense fallback={<ServiceSceneFallback kind={offer.kind}/>}><ServiceScene kind={offer.kind} active={active===index} progressRef={modelProgress.current[index]} ariaLabel={offer.sceneLabel}/></Suspense> : <ServiceSceneFallback kind={offer.kind}/>}
            </SceneBoundary></div>
            <figcaption className="ds-mono">{offer.caption}</figcaption>
          </figure>
          <p className="ds-summary">{offer.text}</p>
        </div>
        <div className="ds-bottom"><ul className="ds-facts">{offer.facts.map((fact,i)=><li key={fact}><span className="ds-mono">0{i+1}</span><span>{fact}</span></li>)}</ul><button className="ds-cta" type="button" onClick={()=>onContact(offer.name)} tabIndex={active===index?0:-1}><span>{offer.cta}</span><ArrowUpRight size={25} strokeWidth={1.2} aria-hidden="true"/></button></div>
        <span className="ds-spine ds-mono" aria-hidden="true">REAL SECURITY. REAL IMPACT.</span>
      </article>)}</div>
      <div className="ds-progress" aria-hidden="true"><i/></div>
    </div>
  </section>
}
