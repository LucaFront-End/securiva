import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import { seoPages } from '../src/data/pageRegistry.js'
import { getPageMetadata, resolveSiteUrl } from '../src/seo/site.js'

const origin = resolveSiteUrl(process.env)
const results = await Promise.all(seoPages.map(async page => {
  const metadata = getPageMetadata(page.path,process.env)
  const response = await fetch(metadata.canonical,{redirect:'manual'})
  assert.equal(response.status,200,page.path)
  const html = await response.text()
  assert.equal((html.match(/<h1\b/g)||[]).length,1,page.path)
  assert.ok(html.includes(`href="${metadata.canonical}"`),`Canonical incorrecto: ${page.path}`)
  assert.ok(html.includes('index, follow, max-image-preview:large'),`Falta index: ${page.path}`)
  assert.ok(html.includes(`lang="${page.language || 'es'}"`),`Idioma incorrecto: ${page.path}`)
  const graph = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1])['@graph']
  assert.equal(graph.find(item => item['@type'] === 'WebPage').name,page.title,page.path)
  assert.ok(!graph.some(item=>['Review','AggregateRating','LocalBusiness'].includes(item['@type'])))
  return {path:page.path,status:response.status,canonical:metadata.canonical,bytes:Buffer.byteLength(html)}
}))
const sitemap = await (await fetch(`${origin}/sitemap.xml`)).text()
assert.equal((sitemap.match(/<loc>/g)||[]).length,seoPages.length)
for (const page of seoPages) assert.ok(sitemap.includes(`${origin}${page.path}`),page.path)
const missing = await fetch(`${origin}/ruta-inexistente-verificacion-securiva`,{redirect:'manual'})
assert.equal(missing.status,404,'Las URLs inexistentes deben devolver 404.')
const result={checkedAt:new Date().toISOString(),origin,publishedPages:results.length,results,sitemapUrls:seoPages.length,missingRouteStatus:missing.status}
await fs.mkdir(new URL('../work/seo/',import.meta.url),{recursive:true})
await fs.writeFile(new URL('../work/seo/live-verification.json',import.meta.url),JSON.stringify(result,null,2)+'\n')
console.log(`Producción verificada: ${results.length} páginas con HTTP 200, HTML propio, idioma, canonical y schema; sitemap ${seoPages.length} URLs; ruta inexistente HTTP 404.`)
