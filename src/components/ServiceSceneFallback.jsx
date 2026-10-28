export default function ServiceSceneFallback({ kind = 'pentest' }) {
  return <svg className="service-scene-placeholder" viewBox="0 0 600 420" aria-hidden="true">
    <ellipse cx="300" cy="339" rx="187" ry="34" fill="#071323" opacity=".12"/>
    <path d="m103 265 192-107 203 112v23L305 400 103 289Z" fill="#263442"/>
    <path d="m103 265 192-107 203 112-193 108Z" fill="#788a9c"/>
    {kind === 'pentest' ? <>
      {[0,1,2].map(i=><g key={i} transform={`translate(0 ${-i*37})`}><path d="m202 249 95-52 105 56v16l-97 55-103-55Z" fill="#23374e"/><path d="m202 249 95-52 105 56-97 55Z" fill="#a9b7c4"/><path d="m218 251 80-43 88 47-81 45Z" fill="#254a78"/></g>)}
      <path d="M179 277V115l191-9 53 29v150" fill="none" stroke="#9aaabc" strokeWidth="9"/>
      <path d="m255 125 71 36v91l-71-34Z" fill="#4592ff" opacity=".22"/>
      <path d="m316 241 13-7 15 8v17l-14 8-14-8Z" fill="#f28369"/>
    </> : kind === 'bounty' ? <>
      <path d="m160 281 68-37 55 30v16l-68 39-55-32Z" fill="#a5b9ce"/>
      <path d="m316 208 77-42 54 30v17l-77 44-54-32Z" fill="#b4c4d2"/>
      <path d="M259 309V149l97-54 58 31v161" stroke="#c7d1d9" strokeWidth="15" fill="none"/>
      <path d="m272 156 70-39 58 31v110l-68 39-60-32Z" fill="#82bfff" opacity=".24"/>
      <path d="m355 210 18-10 20 11v23l-19 11-19-11Z" fill="#24b48e"/>
      <path d="m363 219 7 6 13-18" fill="none" stroke="#eef8f5" strokeWidth="4"/>
    </> : <>
      <path d="m188 279 122-165 141 65-126 168Z" fill="#1e3e72"/>
      <path d="m178 263 122-165 141 65-126 168Z" fill="#b7c7d5"/>
      <path d="m189 259 114-151 126 58-115 154Z" fill="#e3e8eb"/>
      <path d="m213 229 35-46 105 49-35 46Z" fill="#2563eb"/>
      <path d="m276 149 91 42m-101-28 91 42m-72 69 58 27" stroke="#70859b" strokeWidth="4"/>
      <path d="m167 253 41-55 65 30-42 57Z" fill="#425e83"/>
    </>}
  </svg>
}
