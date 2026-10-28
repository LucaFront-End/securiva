import { Component, useId } from 'react'

/** Keeps an optional visual from taking down the rest of the landing. */
export default class SceneBoundary extends Component {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    return this.state.hasError
      ? (this.props.fallback ?? <ArchitectureFallback />)
      : this.props.children
  }
}

/** Lightweight, independent fallback: no scene, image or WebGL dependency. */
export function ArchitectureFallback({ stage = 0 }) {
  const id = useId().replace(/:/g, '')
  const current = Math.max(0, Math.min(3, Math.round(Number(stage) || 0)))
  const risk = current === 1 || current === 2
  const route = risk ? '#d35f48' : '#2563eb'
  const descriptions = [
    'Aplicación web, API y datos conectados dentro de un alcance de evaluación.',
    'Una ruta de riesgo ilustrativa conecta la aplicación, la API y los datos.',
    'Las capas de la API se separan para representar la investigación y su evidencia.',
    'La ruta de acceso aparece verificada después de una corrección ilustrativa.',
  ]
  return <svg
    className="architecture-fallback"
    viewBox="0 0 780 520"
    role="img"
    aria-labelledby={`${id}-title ${id}-description`}
    style={{ display: 'block', width: '100%', height: '100%' }}
  >
    <title id={`${id}-title`}>Arquitectura de seguridad: web, API y datos</title>
    <desc id={`${id}-description`}>{descriptions[current]} Es un escenario ilustrativo.</desc>
    <defs>
      <linearGradient id={`${id}-board`} x1="0" y1="0" x2="1" y2="1">
        <stop stopColor="#5c6878"/><stop offset="1" stopColor="#26303e"/>
      </linearGradient>
      <linearGradient id={`${id}-metal`} x1="0" y1="0" x2="1" y2="1">
        <stop stopColor="#eef0ef"/><stop offset=".48" stopColor="#c3ccd4"/><stop offset="1" stopColor="#8f9faf"/>
      </linearGradient>
      <linearGradient id={`${id}-screen`} x1="0" y1="0" x2="1" y2="1">
        <stop stopColor="#192334"/><stop offset="1" stopColor="#273d5e"/>
      </linearGradient>
    </defs>
    <ellipse cx="398" cy="422" rx="278" ry="45" fill="#2b3545" opacity=".09"/>
    <path d="m80 277 302-153 318 157v28L396 464 80 305Z" fill="#283241"/>
    <path d="m80 277 302-153 318 157-304 155Z" fill={`url(#${id}-board)`} stroke="#8c9baa" strokeWidth="2"/>
    <path d="m110 276 274-138 285 140-273 139Z" fill="none" stroke="#7896bf" strokeWidth="1.2"/>
    <path d="m161 300 72 36 128-64 104 52 107-54" fill="none" stroke="#0d1726" strokeWidth="9" strokeLinejoin="round"/>
    <path d="m161 300 72 36 128-64 104 52 107-54" fill="none" stroke={route} strokeWidth="3.5" strokeLinejoin="round"/>
    <path d="m396 419 1-61 68-34" fill="none" stroke={route} strokeWidth="3"/>
    <g transform="translate(150 177)">
      <path d="m0 27 113-56 76 38v99l-114 57L0 127Z" fill={`url(#${id}-metal)`}/>
      <path d="m10 33 103-51 65 33v85l-103 51-65-32Z" fill={`url(#${id}-screen)`}/>
      <path d="m24 50 61-30M24 69l45-22M24 89l30-15" stroke="#9eacc1" strokeWidth="4"/>
      <path d="m93 79 65-33v42l-65 33Z" fill="#2563eb"/>
      <path d="m107 81 32-16v15l-32 16Z" fill="none" stroke="#d6e5ff" strokeWidth="2"/>
      <path d="m65 166 28-14v26l-28 14Z" fill="#a6b3c3"/>
      <path d="m34 199 42-21 44 22-43 22Z" fill="#b3bfcc"/>
    </g>
    <g transform={`translate(335 ${current === 2 ? 180 : 213})`}>
      {[2, 1, 0].map(layer => <g key={layer} transform={`translate(0 ${layer * (current === 2 ? 41 : 27)})`}>
        <path d="m0 25 62-31 68 34v20L63 82 0 50Z" fill={layer === 1 ? '#8797aa' : '#263347'}/>
        <path d="m0 25 62-31 68 34-67 34Z" fill={`url(#${id}-metal)`}/>
        <path d="m14 46 37 19" stroke="#4b8bff" strokeWidth="3"/>
        <path d="m14 51 37 19" stroke="#16263b" strokeWidth="1"/>
      </g>)}
      {risk && <g transform="translate(65 27)"><path d="m0-12 13 7v15L0 17l-13-7V-5Z" fill="#d35f48"/><path d="M0-3v10M0 10v1" stroke="#fff" strokeWidth="2"/></g>}
    </g>
    <g transform="translate(511 142)">
      <path d="m0 25 52-27 64 32v154l-63 32L0 189Z" fill="#1c2839"/>
      <path d="m0 25 52-27 64 32-63 32Z" fill={`url(#${id}-metal)`}/>
      <path d="m53 62 63-32v154l-63 32Z" fill="#142033"/>
      {[70, 109, 148].map(y => <g key={y}>
        <path d={`m9 ${y} 34 17v25L9 ${y+25}Z`} fill="#3d4d62"/>
        <path d={`m15 ${y+6}v15`} stroke="#568fff" strokeWidth="3"/>
        <path d={`m25 ${y+10} 12 6m-12 0 12 6m-12 0 12 6`} stroke="#93a3b9" strokeWidth="1"/>
      </g>)}
    </g>
    <g fontFamily="'JetBrains Mono',monospace" fontSize="12" letterSpacing="1.5" textAnchor="middle" fill="#56677d">
      <text x="210" y="429">WEB</text><text x="396" y="485">API</text><text x="593" y="403">DATOS</text>
    </g>
    {current === 3 && <g transform="translate(465 323)"><rect x="-18" y="-18" width="36" height="36" rx="7" fill="#2563eb" stroke="#c8dcff"/><path d="m-9 0 6 6L10-8" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></g>}
  </svg>
}
