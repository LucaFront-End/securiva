import { useId, useMemo, useRef, useState } from 'react'
import { ArrowUpRight, Check, Copy, Download } from 'lucide-react'
import './SecurityScopeTool.css'

const preparation = [
  { key:'authorization', title:'Autorización identificada', text:'Sabemos quién puede autorizar las pruebas sobre los activos.' },
  { key:'inventory', title:'Activos inventariados', text:'Tenemos aplicaciones, APIs e integraciones que queremos incluir.' },
  { key:'accounts', title:'Accesos de prueba disponibles', text:'Podemos facilitar cuentas para los roles y organizaciones relevantes.' },
  { key:'owner', title:'Responsable de correcciones', text:'Hay un equipo que recibirá los hallazgos y coordinará las correcciones.' },
]

const researchPreparation = [
  { key:'known', title:'Hallazgos conocidos registrados', text:'Podemos compartir problemas previos para acordar duplicados.' },
  { key:'rules', title:'Reglas económicas por acordar', text:'Podemos aprobar una base, una tabla por severidad y un máximo.' },
  { key:'triage', title:'Canal de validación definido', text:'Tenemos una persona para resolver dudas sobre impacto y elegibilidad.' },
]

const assetLabels = { web:'Aplicación web', api:'API o integración', both:'Aplicación web y API' }
const roleLabels = { '1':'Un rol', '2':'Dos roles', '3+':'Tres o más roles', unknown:'Por definir' }
const flowLabels = { '1–3':'Entre uno y tres', '4–6':'Entre cuatro y seis', '7+':'Siete o más', unknown:'Por definir' }
const environmentLabels = { staging:'Entorno de pruebas', production:'Producción, sujeto a condiciones', unknown:'Por definir' }

export default function SecurityScopeTool({ compact = false }) {
  const id = useId()
  const [asset, setAsset] = useState('web')
  const [roles, setRoles] = useState('2')
  const [flows, setFlows] = useState('1–3')
  const [environment, setEnvironment] = useState('unknown')
  const [whiteLabel, setWhiteLabel] = useState(true)
  const [research, setResearch] = useState(false)
  const [checks, setChecks] = useState({})
  const [status, setStatus] = useState('')
  const outputRef = useRef(null)
  const previewRef = useRef(null)
  const readiness = preparation.filter(item => checks[item.key]).length
  const researchReady = researchPreparation.every(item => checks[item.key])
  const allReady = readiness === preparation.length
  const recommendation = !allReady
    ? 'Primero, cerrar el alcance.'
    : research && researchReady
      ? 'Valorar una fase de investigación privada.'
      : 'Comenzar por un pentest delimitado.'
  const recommendationDetail = !allReady
    ? 'Completa los puntos pendientes antes de acordar pruebas, precio y calendario.'
    : research && researchReady
      ? 'Ya identificaste las conversaciones necesarias para evaluar un modelo con base y honorarios por hallazgo. La viabilidad se confirma en la revisión técnica.'
      : 'Un alcance concreto facilita comparar propuestas y coordinar una primera evaluación. Si buscas pago por hallazgo, define antes las reglas de validación y presupuesto.'

  const brief = useMemo(() => {
    const lines = [
      'SECURIVA — BRIEF PRELIMINAR DE SEGURIDAD', '',
      `Activo: ${assetLabels[asset]}`,
      `Roles: ${roleLabels[roles]}`,
      `Flujos prioritarios: ${flowLabels[flows]}`,
      `Entorno: ${environmentLabels[environment]}`,
      `Entrega white label: ${whiteLabel ? 'Sí' : 'No'}`,
      `Interés en investigación por hallazgo: ${research ? 'Sí' : 'No'}`,
      '', 'PREPARACIÓN',
      ...preparation.map(item => `${checks[item.key] ? '[Listo]' : '[Pendiente]'} ${item.title}`),
      ...(research ? ['', 'CONDICIONES PARA INVESTIGACIÓN PRIVADA', ...researchPreparation.map(item => `${checks[item.key] ? '[Identificado]' : '[Pendiente]'} ${item.title}`)] : []),
      '', `Punto de partida: ${recommendation}`, recommendationDetail,
      '', 'PARA COMPLETAR EN LA REUNIÓN',
      'Activos exactos y exclusiones; autorización escrita; accesos; flujos; restricciones; fechas; entregables; retest; condiciones económicas.',
      '', 'Este brief prepara una conversación. No es una cotización, una autorización de pruebas ni una evaluación de seguridad.'
    ]
    return lines.join('\n')
  }, [asset, roles, flows, environment, whiteLabel, research, checks, recommendation, recommendationDetail])

  const copyBrief = async () => {
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable')
      await navigator.clipboard.writeText(brief)
      setStatus('Brief copiado. Puedes pegarlo en el canal que prefieras.')
    } catch {
      if (previewRef.current) previewRef.current.open = true
      outputRef.current?.focus()
      outputRef.current?.select()
      setStatus('Seleccionamos el brief. Usa la opción Copiar de tu dispositivo.')
    }
  }

  const downloadBrief = () => {
    const blob = new Blob([brief], { type:'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'SECURIVA_Brief_Preliminar.txt'
    document.body.appendChild(link)
    link.click()
    link.remove()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
    setStatus('Brief descargado en formato de texto.')
  }

  const toggle = key => { setChecks(current => ({ ...current, [key]:!current[key] })); setStatus('') }
  const renderCheck = item => <label className="sst-check" key={item.key} htmlFor={`${id}-${item.key}`}><input id={`${id}-${item.key}`} type="checkbox" checked={Boolean(checks[item.key])} onChange={() => toggle(item.key)}/><span className="sst-check-icon" aria-hidden="true"><Check size={13}/></span><span><strong>{item.title}</strong><small>{item.text}</small></span></label>

  return <section className={`sst-tool${compact ? ' sst-compact' : ''}`} aria-labelledby={`${id}-title`}>
    <div className="sst-intro"><p className="sst-mono">HERRAMIENTA GRATUITA / SIN REGISTRO</p><h2 id={`${id}-title`}>Un alcance claro.<br/><span>Un mejor comienzo.</span></h2><p>Prepara el brief de tu evaluación en pocos pasos. Elige el tipo de proyecto y revisa lo que falta para cotizar.</p></div>
    <div className="sst-layout">
      <div className="sst-inputs">
        <fieldset><legend><span className="sst-mono">01</span>Tu proyecto</legend><div className="sst-select-grid">
          <label htmlFor={`${id}-asset`}>Qué quieres evaluar<select id={`${id}-asset`} value={asset} onChange={event => { setAsset(event.target.value); setStatus('') }}>{Object.entries(assetLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
          <label htmlFor={`${id}-roles`}>Roles de usuario<select id={`${id}-roles`} value={roles} onChange={event => { setRoles(event.target.value); setStatus('') }}>{Object.entries(roleLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
          <label htmlFor={`${id}-flows`}>Flujos prioritarios<select id={`${id}-flows`} value={flows} onChange={event => { setFlows(event.target.value); setStatus('') }}>{Object.entries(flowLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
          <label htmlFor={`${id}-environment`}>Entorno previsto<select id={`${id}-environment`} value={environment} onChange={event => { setEnvironment(event.target.value); setStatus('') }}>{Object.entries(environmentLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
        </div><label className="sst-option"><input type="checkbox" checked={whiteLabel} onChange={event => { setWhiteLabel(event.target.checked); setStatus('') }}/><span>Quiero entregar el informe con la marca de mi agencia.</span></label></fieldset>
        <fieldset><legend><span className="sst-mono">02</span>Lo que ya tienes</legend><div className="sst-checks">{preparation.map(renderCheck)}</div></fieldset>
        <fieldset><legend><span className="sst-mono">03</span>La modalidad</legend><label className="sst-option"><input type="checkbox" checked={research} onChange={event => { setResearch(event.target.checked); setStatus('') }}/><span>También quiero evaluar investigación privada con pago por hallazgos validados.</span></label>{research && <div className="sst-checks sst-research">{researchPreparation.map(renderCheck)}</div>}<p className="sst-hint">El número de roles y flujos ayuda a conversar sobre complejidad. La cobertura y el precio se acuerdan después de la revisión técnica.</p></fieldset>
      </div>
      <aside className="sst-result" aria-labelledby={`${id}-result-title`}><div className="sst-result-top"><span className="sst-mono">TU BRIEF / EN PREPARACIÓN</span><ArrowUpRight size={19} aria-hidden="true"/></div><div className="sst-readiness"><strong>{readiness}<span> / {preparation.length}</span></strong><p>Puntos de preparación<br/>identificados</p></div><div className="sst-progress" aria-hidden="true">{preparation.map(item => <span key={item.key} className={checks[item.key] ? 'is-ready' : ''}/>)}</div><h3 id={`${id}-result-title`}>{recommendation}</h3><p className="sst-result-detail">{recommendationDetail}</p><dl><div><dt>Activo</dt><dd>{assetLabels[asset]}</dd></div><div><dt>Entrega</dt><dd>{whiteLabel ? 'Con la marca de tu agencia' : 'SECURIVA'}</dd></div><div><dt>Modalidad a conversar</dt><dd>{research ? 'Pentest o investigación privada' : 'Pentest con alcance definido'}</dd></div></dl><div className="sst-actions"><button type="button" onClick={copyBrief}><Copy size={15}/>Copiar brief</button><button type="button" onClick={downloadBrief}><Download size={15}/>Descargar .txt</button></div><p className="sst-status" role="status" aria-live="polite">{status}</p><details className="sst-preview" ref={previewRef}><summary>Ver el brief completo</summary><label className="sst-visually-hidden" htmlFor={`${id}-output`}>Brief listo para copiar</label><textarea id={`${id}-output`} ref={outputRef} readOnly value={brief} rows={15}/></details><p className="sst-privacy">Tus selecciones se procesan en este navegador. No pedimos datos de clientes, activos ni credenciales, y este formulario no envía el brief.</p></aside>
    </div>
  </section>
}
