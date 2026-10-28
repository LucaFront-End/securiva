import { useId } from 'react'
import './EvidencePanel.css'

const states = [
  { title: 'Definimos el alcance', code: 'scope.define()', card: 'Alcance acordado', detail: 'Activos y límites definidos' },
  { title: 'Investigamos a fondo', code: 'attack_surface.explore()', card: 'Investigación manual', detail: 'Criterio humano en cada ruta' },
  { title: 'Validamos la evidencia', code: 'findings.validate()', card: 'Hallazgo reproducible', detail: 'Impacto y contexto documentados' },
  { title: 'Cerramos el círculo', code: 'security.verify()', card: 'Corrección verificada', detail: 'Retest dentro del alcance' },
]

export default function EvidencePanel({ activeStep = 0 }) {
  const step = Number.isFinite(activeStep) ? Math.max(0, Math.min(3, Math.floor(activeStep))) : 0
  const state = states[step]
  const id = useId().replace(/:/g, '')

  return (
    <div
      className={`evidence-panel state-${step} evidence-state-${step}`}
      role="img"
      aria-label={`Demostración del proceso. Estado ${step + 1} de 4: ${state.title}. ${state.card}. Activos ilustrativos: web, API y cloud.`}
    >
      <div className="evidence-topline" aria-hidden="true">
        <span><i />DEMOSTRACIÓN DEL PROCESO</span>
        <span className="evidence-counter"><b>0{step + 1}</b><span>/ 04</span></span>
      </div>

      <div className="evidence-map" aria-hidden="true">
        <svg viewBox="0 0 400 160" fill="none" focusable="false">
          <defs>
            <radialGradient id={`${id}-glow`}>
              <stop stopColor="#2563eb" stopOpacity=".16" />
              <stop offset="1" stopColor="#2563eb" stopOpacity="0" />
            </radialGradient>
            <linearGradient id={`${id}-route`} x1="68" y1="70" x2="332" y2="103" gradientUnits="userSpaceOnUse">
              <stop stopColor="#2563eb" />
              <stop offset=".5" stopColor="#669bff" />
              <stop offset="1" stopColor="#06b6d4" />
            </linearGradient>
          </defs>

          <ellipse cx="200" cy="89" rx="144" ry="86" fill={`url(#${id}-glow)`} />
          <path className="evidence-construction" d="M200 2v148M24 103h352M68 43v74M332 43v74" strokeDasharray="2 7" />
          <path className="evidence-corners" d="M25 29V17h12m326 0h12v12M25 131v12h12m326 0h12v-12" />
          <path className="evidence-scope-base" d="M55 36H159l13-13h56l13 13h104v92H55V36Z" />
          <path className="evidence-scope-trace" d="M55 36H159l13-13h56l13 13h104v92H55V36Z" pathLength="100" />

          <g className="evidence-route-base">
            <path d="M97 70h31l48 33M303 70h-31l-48 33M200 39v40" />
          </g>
          <g stroke={`url(#${id}-route)`} className="evidence-routes">
            <path className="evidence-route evidence-route-one" d="M176 103l-48-33H97" pathLength="100" />
            <path className="evidence-route evidence-route-two" d="M224 103l48-33h31" pathLength="100" />
            <path className="evidence-route evidence-route-three" d="M200 79V39" pathLength="100" />
          </g>

          <g className="evidence-node evidence-node-web">
            <rect x="39" y="56" width="58" height="28" rx="3" />
            <circle cx="50" cy="70" r="2" />
            <text x="61" y="73">WEB</text>
          </g>
          <g className="evidence-node evidence-node-api">
            <rect x="303" y="56" width="58" height="28" rx="3" />
            <circle cx="314" cy="70" r="2" />
            <text x="325" y="73">API</text>
          </g>
          <g className="evidence-node evidence-node-cloud">
            <rect x="163" y="11" width="74" height="28" rx="3" />
            <circle cx="175" cy="25" r="2" />
            <text x="186" y="28">CLOUD</text>
          </g>

          <g className="evidence-core">
            <rect x="176" y="79" width="48" height="48" rx="8" />
            <rect className="evidence-core-inner" x="180" y="83" width="40" height="40" rx="5" />
            <path className="evidence-core-shield" d="m200 91 10 4v8c0 6-5 10-10 13-5-3-10-7-10-13v-8l10-4Z" />
            <path className="evidence-core-cross" d="M196 103h8m-4-4v8" />
            <path className="evidence-core-check" d="m195 103 3.5 3.5 6.5-7" />
          </g>

          <g className="evidence-investigation-dots">
            <circle className="evidence-dot-one" cx="176" cy="103" r="2.5" />
            <circle className="evidence-dot-two" cx="224" cy="103" r="2.5" />
            <circle className="evidence-dot-three" cx="200" cy="79" r="2.5" />
          </g>
          <g className="evidence-finding-marker">
            <path d="M298 51h-5v5m73-5h5v5m-78 28v5h5m68 0h5v-5" />
            <circle cx="361" cy="56" r="4" />
          </g>
          <text className="evidence-map-note" x="200" y="151" textAnchor="middle">ACTIVOS ILUSTRATIVOS / PRUEBAS AUTORIZADAS</text>
        </svg>
      </div>

      <div className="evidence-card" aria-hidden="true">
        <span className="evidence-card-mark">
          <svg viewBox="0 0 16 16" fill="none" focusable="false"><path d="M3 8h10M8 3v10" className="evidence-card-plus" /><path d="m3.5 8 3 3 6-6" className="evidence-card-check" /></svg>
        </span>
        <div><strong>{state.card}</strong><span>{state.detail}</span></div>
        <span className="evidence-card-index">0{step + 1}</span>
      </div>

      <div className="evidence-bottomline" aria-hidden="true">
        <span className="evidence-state-title">{state.title}</span>
        <code>{state.code}</code>
      </div>
      <div className="evidence-progress" aria-hidden="true">{states.map((_, index) => <span key={index} className={index <= step ? 'is-complete' : ''} />)}</div>
    </div>
  )
}
