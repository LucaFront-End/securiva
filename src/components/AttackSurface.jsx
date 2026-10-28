import { useState } from 'react'
import { ArrowUpRight, Check, Crosshair, LockKeyhole } from 'lucide-react'

const assets = {
  WEB: [
    { short: 'AUTH', title: 'Autenticación', text: 'Revisamos cómo se verifican las identidades y se protegen las sesiones.' },
    { short: 'ACCESS', title: 'Control de acceso', text: 'Ponemos a prueba los límites entre usuarios, roles y recursos de tu aplicación.' },
    { short: 'DATA', title: 'Protección de datos', text: 'Seguimos el recorrido de los datos para identificar exposición y entradas inseguras.' },
  ],
  API: [
    { short: 'TOKEN', title: 'Tokens y credenciales', text: 'Evaluamos la gestión de credenciales, tokens y mecanismos de autenticación.' },
    { short: 'API', title: 'Autorización por recurso', text: 'Comprobamos que cada endpoint respete los permisos y límites de cada usuario.' },
    { short: 'INPUT', title: 'Validación de entradas', text: 'Investigamos cómo responde la API ante datos y secuencias inesperadas.' },
  ],
  CLOUD: [
    { short: 'IAM', title: 'Permisos e identidad', text: 'Revisamos privilegios y relaciones de confianza dentro del alcance autorizado.' },
    { short: 'CONFIG', title: 'Configuración', text: 'Buscamos configuraciones que amplíen innecesariamente la superficie de ataque.' },
    { short: 'PUBLIC', title: 'Exposición de recursos', text: 'Identificamos qué servicios y datos pueden alcanzarse desde el exterior.' },
  ],
}

export default function AttackSurface({ active = 0 }) {
  const [asset, setAsset] = useState('WEB')
  const [selected, setSelected] = useState(0)
  const detail = assets[asset][selected]
  return <div className="surface-demo" data-node={selected}>
    <div className="demo-windowbar"><span className="window-dots"><i/><i/><i/></span><span className="mono">SECURIVA / RESEARCH LAB</span><LockKeyhole size={12}/></div>
    <div className="surface-tabs" role="group" aria-label="Explorar tipos de activo">{Object.keys(assets).map(item => <button key={item} className={`mono ${asset === item ? 'selected' : ''}`} aria-pressed={asset === item} onClick={() => {setAsset(item);setSelected(0)}}>{item}</button>)}<span className="mono demo-label">VISTA ILUSTRATIVA</span></div>
    <div className={`surface-map surface-${active}`}>
      <svg viewBox="0 0 500 270" preserveAspectRatio="none" aria-hidden="true" className="network-lines">
        <defs><radialGradient id="mapGlow"><stop stopColor="#2563eb" stopOpacity=".3"/><stop offset="1" stopColor="#2563eb" stopOpacity="0"/></radialGradient><linearGradient id="routeBlue"><stop stopColor="#3977ff"/><stop offset="1" stopColor="#a9c9ff"/></linearGradient></defs>
        <circle cx="250" cy="135" r="130" fill="url(#mapGlow)"/>
        <g fill="none" stroke="#283246" strokeWidth="1"><ellipse cx="250" cy="135" rx="170" ry="97"/><ellipse cx="250" cy="135" rx="115" ry="66"/><path d="M250 135 115 208M250 135 259 29"/></g>
        {['M94 92 250 135','M399 69 250 135','M356 217 250 135'].map((d,i)=><path key={i} className={`network-route ${selected===i?'route-active':''}`} d={d} fill="none" stroke={selected===i?'url(#routeBlue)':'#283246'} strokeWidth={selected===i?1.5:1}/>) }
        <g fill="#2563eb"><circle cx="115" cy="208" r="2"/><circle cx="259" cy="29" r="2"/></g>
      </svg>
      <span className="surface-scan" key={`${asset}-${selected}`} aria-hidden="true"/>
      <div className="map-core"><img src="/brand/securiva-mark.svg" alt="SECURIVA" width="36" height="44"/></div><span className="map-orbit" aria-hidden="true"/>
      <div className="map-nodes" role="group" aria-label="Explorar vectores de revisión">{assets[asset].map((node,i)=><button key={i} className={`map-node map-node-${i} ${selected===i?'node-active':''}`} aria-label={`Explorar ${node.title.toLowerCase()}`} aria-pressed={selected===i} onClick={()=>setSelected(i)}><i/><span className="mono">{node.short}</span></button>)}</div>
      <div className="map-finding mono"><span/>INVESTIGACIÓN MANUAL<Check size={12}/></div>
    </div>
    <div className="surface-caption" aria-live="polite"><div className="surface-insight" key={`${asset}-${selected}`}><span className="mono">{asset} / VECTOR 0{selected+1}</span><h4>{detail.title}</h4><p>{detail.text}</p></div><span className="surface-cross"><Crosshair size={23}/></span></div>
    <div className="surface-instruction mono"><span>EXPLORA LOS PUNTOS DEL MAPA</span><ArrowUpRight size={11}/></div>
  </div>
}
