import { lazy, Suspense, useEffect } from 'react'
import './components/NotFoundPage.css'
import { observeContactLinks } from './lib/analytics'

const ServiceRoutes = lazy(() => import('./components/ServiceRoutes'))
const HomePage = lazy(() => import('./HomePage'))
const KnowledgeRoutes = lazy(() => import('./components/KnowledgeRoutes'))

function RouteLoading() { return <main className="sl-not-found" aria-busy="true"><p className="sl-mono">SECURIVA / REAL SECURITY. REAL IMPACT.</p><p role="status">Cargando contenido…</p></main> }

export default function App({ path = '/' }) {
  useEffect(() => observeContactLinks(), [])
  const pathname = path === '/' ? '/' : '/' + path.replace(/^\/+|\/+$/g, '')
  if (pathname === '/') return <Suspense fallback={<main className="sl-not-found"><p className="sl-mono">SECURIVA / REAL SECURITY. REAL IMPACT.</p></main>}><HomePage/></Suspense>
  if (pathname === '/blog' || pathname.startsWith('/blog/') || pathname === '/recursos' || pathname.startsWith('/recursos/') || pathname === '/preparar-pentest' || pathname === '/sobre-securiva' || pathname === '/informe-pentest-ejemplo') {
    return <Suspense fallback={<main className="sl-not-found"><p className="sl-mono">SECURIVA / CONOCIMIENTO APLICADO</p><p>Cargando contenido…</p></main>}><KnowledgeRoutes path={pathname}/></Suspense>
  }
  return <Suspense fallback={<RouteLoading/>}><ServiceRoutes path={pathname}/></Suspense>
}
