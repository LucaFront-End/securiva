import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { ArrowDown, ArrowUpRight, Check } from 'lucide-react'
import SceneBoundary, { ArchitectureFallback } from './SceneBoundary'
import useArchitectureScroll from '../hooks/useArchitectureScroll'
import './SecurityArchitecture.css'

const IsometricSecurity = lazy(() => import('./IsometricSecurity'))
const chapters = [
  { label:'Superficie', title:'Primero, conectamos los puntos.', description:'Tu aplicación, sus integraciones y los datos que utiliza. Definimos qué entra en la evaluación y qué necesita más atención.', result:'Un alcance claro, acordado contigo.', tags:['Aplicación web','APIs e integraciones','Accesos y datos'] },
  { label:'Ruta de ataque', title:'Una conexión puede cambiarlo todo.', description:'En este ejemplo, un control de autorización incorrecto en la API permite acceder a información de otra cuenta. Investigamos el recorrido completo.', result:'El fallo técnico se traduce en impacto para el negocio.', tags:['Autorización','Lógica de negocio','Exposición de datos'] },
  { label:'Evidencia', title:'Lo demostramos. Lo documentamos.', description:'Reproducimos el hallazgo dentro del alcance autorizado y entregamos evidencia, contexto y una recomendación concreta para tu equipo.', result:'Una decisión informada, no una alerta más.', tags:['Prueba reproducible','Impacto explicado','Ruta de corrección'] },
  { label:'Retest', title:'Volvemos a probar la misma puerta.', description:'Una vez aplicada la corrección, verificamos los hallazgos incluidos en el retest. La evidencia muestra qué cambió y qué sigue pendiente.', result:'Correcciones verificadas, dentro del alcance acordado.', tags:['Validación técnica','Estado actualizado','Cierre documentado'] },
]

export default function SecurityArchitecture({motionEnabled=true,onContact}) {
  const [stage,setStage]=useState(0)
  const [loadScene,setLoadScene]=useState(false)
  const sceneRef=useRef(null)
  const sectionRef=useRef(null)
  const experienceRef=useRef(null)
  const progressRef=useRef(0)
  const selectStage=useArchitectureScroll(sectionRef,experienceRef,setStage,progressRef)
  useEffect(()=>{
    const observer=new IntersectionObserver(([entry])=>{
      if(entry.isIntersecting){setLoadScene(true);observer.disconnect()}
    },{rootMargin:'200px'})
    if(sceneRef.current) observer.observe(sceneRef.current)
    return()=>observer.disconnect()
  },[])
  return <section ref={sectionRef} className="sa-section" id="riesgo" aria-labelledby="architecture-title">
    <div className="sa-heading"><div><span className="eyebrow">01 / ASÍ SE HACE VISIBLE EL RIESGO</span><h2 id="architecture-title" data-reveal>De tu web<br/><span>a tus datos.</span></h2></div><p data-reveal>La seguridad de tu producto no termina en la pantalla. Investigamos lo que ocurre detrás.</p></div>
    <div ref={experienceRef} className="sa-experience">
      <div className="sa-scene-wrap"><div className="sa-scene-caption mono"><span>APLICACIÓN → API → DATOS</span><span className="sa-stage-count">0{stage+1} / 04</span></div><div className="sa-visual" ref={sceneRef}><SceneBoundary fallback={<ArchitectureFallback stage={stage}/>}>{loadScene?<Suspense fallback={<ArchitectureFallback stage={stage}/>}><IsometricSecurity motionEnabled={motionEnabled} stage={stage} progressRef={progressRef}/></Suspense>:<ArchitectureFallback stage={stage}/>}</SceneBoundary></div><div className="sa-scene-note mono"><span>ESCENARIO ILUSTRATIVO · NO ES UN ESCANEO</span><span><ArrowDown size={12}/> DESLIZA PARA INVESTIGAR</span></div></div>
      <div className="sa-details"><div className="sa-selector" role="group" aria-label="Etapa de la evaluación">{chapters.map((item,i)=><button id={`architecture-stage-${i}`} key={item.label} onClick={()=>selectStage(i)} aria-pressed={i===stage} aria-controls="architecture-description"><span className="mono">0{i+1}</span>{item.label}</button>)}</div><div className="sa-reading-progress" aria-hidden="true"><span/></div><div id="architecture-description" className="sa-description" role="region" aria-labelledby={`architecture-stage-${stage}`}>{chapters.map((chapter,index)=><div className={`sa-panel ${index===stage?'is-active':''}`} key={chapter.label} aria-hidden={index!==stage}><h3>{chapter.title}</h3><p>{chapter.description}</p><div className="sa-tags">{chapter.tags.map(tag=><span key={tag}>{tag}</span>)}</div><div className="sa-result"><Check size={16}/><span>{chapter.result}</span></div></div>)}</div><button className="sa-contact" onClick={()=>onContact('Pentesting')}>¿Qué necesita tu proyecto?<ArrowUpRight size={20}/></button></div>
    </div>
  </section>
}
