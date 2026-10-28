import { useId } from 'react'

/** Independent process illustration, available before or without WebGL. */
export default function ProcessFallback({ stage = 0 }) {
  const id = useId().replace(/:/g, '')
  const current = Math.max(0, Math.min(3, Math.round(Number(stage) || 0)))
  const spread = [7, 18, 26, 5][current]
  const captions = ['ALCANCE', 'INVESTIGACIÓN', 'EVIDENCIA', 'VERIFICACIÓN']
  return <svg className="sp-process-fallback" viewBox="0 0 780 520" role="img" aria-labelledby={`${id}-title ${id}-description`}>
    <title id={`${id}-title`}>De la evaluación a una decisión documentada</title>
    <desc id={`${id}-description`}>Modelo ilustrativo de un informe técnico por capas. Etapa actual: {captions[current].toLowerCase()}.</desc>
    <defs>
      <linearGradient id={`${id}-base`} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#66738a"/><stop offset=".55" stopColor="#303a49"/><stop offset="1" stopColor="#202834"/></linearGradient>
      <linearGradient id={`${id}-paper`} x1="0" y1="0" x2=".8" y2="1"><stop stopColor="#f2f1ec"/><stop offset="1" stopColor="#b4c4da"/></linearGradient>
      <linearGradient id={`${id}-blue`} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#7aa9ff"/><stop offset="1" stopColor="#2455bc"/></linearGradient>
    </defs>
    <ellipse cx="391" cy="415" rx="231" ry="42" fill="#05080e" opacity=".34"/>
    <path d="m128 290 262-139 269 145v31L393 470 128 325Z" fill="#111821" stroke="#344256"/>
    <path d="m128 290 262-139 269 145-266 143Z" fill={`url(#${id}-base)`} stroke="#73839a" strokeWidth="1.5"/>
    <path d="m151 289 239-126 245 132-242 129Z" fill="none" stroke="#829dc4" opacity=".35"/>
    {[3, 2, 1, 0].map(layer => <g key={layer} transform={`translate(0 ${-((3-layer)*spread)})`}>
      <path d="m193 263 196-105 202 109v9L392 384 193 276Z" fill={layer === 0 ? '#90a4bf' : '#49607e'}/>
      <path d="m193 263 196-105 202 109-199 107Z" fill={layer === 0 ? `url(#${id}-paper)` : layer === 1 ? '#a4b6ce' : '#7185a1'} stroke={layer === 0 ? '#e6ecf4' : '#8da0bc'} strokeWidth=".8"/>
      {layer === 0 && <>
        <path d="m250 256 109-58M267 268l158-84M283 281l111-59" stroke="#607592" strokeWidth="4" opacity=".65"/>
        <path d="m307 309 55-30 35 19-55 29Z" fill="#285dc9"/>
        <path d="m372 274 55-29 35 18-55 30Z" fill="#4a7bda"/>
        <path d="m438 239 55-29 35 18-55 30Z" fill={current === 2 ? '#d17d68' : '#81a2db'}/>
        <path d="m333 330 108-58" stroke="#8d9db3" strokeWidth="2"/>
      </>}
    </g>)}
    <g transform={`translate(535 ${282-spread})`}>
      <path d="m-39-8 37-20L40-7V6L2 27-39 6Z" fill="#15356e" stroke="#698dc8"/>
      <path d="m-39-8 37-20L40-7 2 14Z" fill={`url(#${id}-blue)`}/>
      {current === 3 ? <path d="m-17-4 14 7L19-10" fill="none" stroke="#eef4ff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/> : <path d="m-14-5 16-8 14 7-16 8Z" fill="none" stroke="#edf3ff" strokeWidth="2"/>}
    </g>
    <g fill="#9aabc2" fontFamily="'JetBrains Mono',monospace" fontSize="11" letterSpacing="1.5">
      <text x="390" y="101" textAnchor="middle">{captions[current]}</text>
      <text x="392" y="501" textAnchor="middle">0{current+1} / SECURIVA</text>
    </g>
  </svg>
}
