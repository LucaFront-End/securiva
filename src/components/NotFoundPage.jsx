import { ArrowUpRight } from 'lucide-react'
import './NotFoundPage.css'

export default function NotFoundPage() {
  return <main className="sl-not-found"><a className="brand" href="/"><img src="/brand/securiva-mark-dark.svg" alt="" width="31" height="36"/><span>SECURIVA</span></a><p className="sl-mono">404 / PÁGINA NO ENCONTRADA</p><h1>Volvamos<br/>al principio.</h1><a className="sl-primary" href="/">Ir a SECURIVA<ArrowUpRight size={20}/></a></main>
}
