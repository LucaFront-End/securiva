import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import { seoPages } from '../src/data/pageRegistry.js'
import { getPageMetadata, resolveSiteUrl } from '../src/seo/site.js'

const origin = resolveSiteUrl(process.env)
const linkedAssets=new Set()
const results = await Promise.all(seoPages.map(async page => {
  const metadata = getPageMetadata(page.path,process.env)
  const response = await fetch(metadata.canonical,{redirect:'manual'})
  assert.equal(response.status,200,page.path)
  const html = await response.text()
  for(const link of html.matchAll(/<link\b[^>]*href="(\/assets\/[^"]+)"/g))linkedAssets.add(origin+link[1])
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
for(const url of linkedAssets){const response=await fetch(url,{method:'HEAD'});assert.equal(response.status,200,`CSS/JS de ruta inaccesible: ${url}`)}
const feed=await fetch(`${origin}/feed.xml`)
assert.equal(feed.status,200)
assert.ok(feed.headers.get('content-type')?.includes('application/rss+xml'))
assert.ok(feed.headers.get('x-robots-tag')?.includes('noindex'))
const feedText=await feed.text()
const indexResponse=await fetch(`${origin}/content-index.json`)
assert.equal(indexResponse.status,200)
assert.ok(indexResponse.headers.get('x-robots-tag')?.includes('noindex'))
const publicIndex=await indexResponse.json()
assert.equal((feedText.match(/<item>/g)||[]).length,publicIndex.items.length)
const sample=await fetch(`${origin}/samples/securiva-informe-demostracion.txt`,{method:'HEAD'})
assert.equal(sample.status,200)
assert.ok(sample.headers.get('content-disposition')?.includes('attachment'))
const result={checkedAt:new Date().toISOString(),origin,publishedPages:results.length,results,sitemapUrls:seoPages.length,missingRouteStatus:missing.status,linkedAssets:linkedAssets.size,feedItems:publicIndex.items.length,sampleDownloadStatus:sample.status}
await fs.mkdir(new URL('../work/seo/',import.meta.url),{recursive:true})
await fs.writeFile(new URL('../work/seo/live-verification.json',import.meta.url),JSON.stringify(result,null,2)+'\n')
console.log(`Producción verificada: ${results.length} páginas, ${linkedAssets.size} assets CSS/JS, feed con ${publicIndex.items.length} entradas, descarga de muestra y HTTP 404 correcto.`)
