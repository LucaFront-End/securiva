import { useId, useState } from 'react'
import { ArrowUpRight, Search } from 'lucide-react'
import { blogPosts } from '../data/blog'
import './BlogIndex.css'

const searchable = value => value.normalize('NFD').replace(/\p{M}/gu,'').toLocaleLowerCase('es')

function TopicArt({category}) {
  const gradient = useId()
  const kind = category === 'APIs' ? 'api' : category === 'Agencias' ? 'label' : category === 'Pentesting' ? 'pentest' : 'bounty'
  return <svg className={'bi-art bi-art-'+kind} viewBox="0 0 400 230" fill="none" aria-hidden="true"><defs><linearGradient id={gradient} x1="100" y1="0" x2="280" y2="230" gradientUnits="userSpaceOnUse"><stop stopColor="#8cb6ff"/><stop offset="1" stopColor="#174eca"/></linearGradient></defs><path d="m50 155 150-85 150 85-150 70z" stroke="currentColor" opacity=".12"/><path d="m90 145 110-62 110 62-110 63z" stroke="currentColor" opacity=".22"/><path d="m125 137 75-43 75 43-75 43z" stroke="currentColor" opacity=".18"/>{kind === 'api' ? <g><path d="m105 90 95-55 95 55-95 55z" fill={'url(#'+gradient+')'} opacity=".9"/><path d="M105 90v35l95 55 95-55V90l-95 55z" fill="#192b47" stroke="#6283ba"/><path d="m155 93 45-26 45 26-45 26z" stroke="#dce9ff"/><path d="M200 146v34" stroke="#8cb6ff"/><path d="M80 163 30 192m290-29 50 29" stroke="#8cb6ff"/></g> : kind === 'label' ? <g><path d="m110 105 130-74 50 86-129 76z" fill="#dde7f6"/><path d="m110 105 51 88v8l-51-88z" fill="#74839a"/><path d="m155 102 80-46m-70 63 80-46m-71 61 60-35" stroke="#7390b6"/><path d="m184 158 80-46 21 36-80 46z" fill={'url(#'+gradient+')'}/><path d="m202 160 49-28" stroke="#fff"/></g> : kind === 'pentest' ? <g><path d="m130 75 70-40 70 40v85l-70 40-70-40z" fill="#172334" stroke="#6481a8"/><path d="m130 75 70 40 70-40-70-40z" fill={'url(#'+gradient+')'}/><path d="M200 115v85m-70-91 70 40 70-40m-140 34 70 40 70-40" stroke="#7a98c4"/><path d="m95 145 105-60 105 60" stroke="#9fc1ff" strokeWidth="2"/></g> : <g><path d="m125 80 75-43 75 43v77l-75 44-75-44z" fill="#192b47" stroke="#6283ba"/><path d="m125 80 75 43 75-43-75-43z" fill={'url(#'+gradient+')'}/><path d="m168 150 22 13 41-47" stroke="#a3c8ff" strokeWidth="5"/><path d="m78 163 32 19m180-19 32-19" stroke="#8cb6ff"/></g>}</svg>
}

export default function BlogIndex() {
  const [category,setCategory]=useState('Todos')
  const [search,setSearch]=useState('')
  const categories=['Todos',...new Set(blogPosts.map(post=>post.category))]
  const query=searchable(search.trim())
  const posts=blogPosts.filter(post=>(category==='Todos'||post.category===category)&&(!query||searchable(`${post.title} ${post.emphasis} ${post.summary}`).includes(query)))
  return <section className="bi-index" aria-label="Artículos de ciberseguridad"><div className="bi-toolbar"><div className="bi-filters" aria-label="Filtrar por tema">{categories.map(item=><button key={item} aria-pressed={category===item} onClick={()=>setCategory(item)}>{item}</button>)}</div><label className="bi-search"><Search size={16} aria-hidden="true"/><span className="sr-only">Buscar artículos</span><input type="search" placeholder="Buscar un tema" value={search} onChange={event=>setSearch(event.target.value)}/></label></div><p className="bi-count" aria-live="polite">{posts.length} {posts.length===1?'artículo':'artículos'} para decidir mejor.</p><div className="bi-grid">{posts.map((post,i)=><article key={post.path}><a href={post.path}><div className="bi-cover"><span className="rl-eyebrow">SECURIVA / {post.category.toUpperCase()}</span><TopicArt category={post.category}/><span className="bi-cover-index">{String(i+1).padStart(2,'0')}</span></div><div className="bi-card-body"><span className="rl-eyebrow">{post.category} · {post.readingMinutes || 5} MIN DE LECTURA</span><h2>{post.title}<br/><span>{post.emphasis}</span></h2><p>{post.description}</p><span className="bi-read">Leer el artículo<ArrowUpRight size={20}/></span></div></a></article>)}</div>{posts.length===0&&<p className="bi-empty">No encontramos un artículo con esos filtros. Prueba otro tema o selecciona “Todos”.</p>}</section>
}

export function RelatedReading({page}) {
  const explicit = page.relatedPaths || []
  const priority = explicit.map(path=>blogPosts.find(post=>post.path===path&&post.path!==page.path)).filter(Boolean)
  const related = [...priority,...blogPosts.filter(post=>post.path!==page.path&&post.category===page.category&&!priority.includes(post))].slice(0,3)
  return <section className="bi-related"><span className="rl-eyebrow">PARA SEGUIR PROFUNDIZANDO</span><div>{related.map(post=><a href={post.path} key={post.path}><span className="rl-eyebrow">{post.category}</span><h3>{post.title} {post.emphasis}</h3><ArrowUpRight size={20}/></a>)}</div><a className="bi-all" href="/blog">Ver todos los artículos<ArrowUpRight size={16}/></a></section>
}
