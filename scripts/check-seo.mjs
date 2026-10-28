import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { seoPages } from '../src/data/pageRegistry.js'
import { getPageMetadata, isIndexableBuild } from '../src/seo/site.js'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const output = path.join(root, 'dist')
const indexable = isIndexableBuild(process.env)
const headings = new Set()
for (const page of seoPages) {
  const metadata = getPageMetadata(page.path, process.env)
  const filename = page.path === '/' ? 'index.html' : `${page.path.slice(1)}.html`
  const html = await fs.readFile(path.join(output, filename), 'utf8')
  const h1s = html.match(/<h1\b[^>]*>[\s\S]*?<\/h1>/g) || []
  assert.equal(h1s.length, 1, `${page.path}: debe existir un único H1 en el HTML servido`)
  headings.add(h1s[0])
  assert.equal((html.match(/rel="canonical"/g) || []).length, 1, `${page.path}: canonical duplicado`)
  assert.ok(html.includes(`href="${metadata.canonical}"`), `${page.path}: canonical incorrecto`)
  assert.ok(html.includes(`content="${indexable ? 'index, follow, max-image-preview:large' : 'noindex, follow'}"`), `${page.path}: estado de indexación incorrecto`)
  assert.ok(!html.includes('<!--app-html-->') && !html.includes('<!--seo-head:'), `${page.path}: quedaron puntos de inserción vacíos`)
  assert.ok(!html.includes('<div id="root"></div>'), `${page.path}: falta contenido prerenderizado`)
  assert.ok(html.includes(`property="og:image" content="${metadata.image}"`),`${page.path}: imagen social incorrecta`)
  if (page.socialImage) {
    const social = await fs.readFile(path.join(output,page.socialImage.slice(1)))
    assert.equal(social.subarray(0,8).toString('hex'),'89504e470d0a1a0a')
    assert.equal(social.readUInt32BE(16),1200)
    assert.equal(social.readUInt32BE(20),630)
  }
  for (const match of html.matchAll(/<a\b[^>]*href="(\/(?!\/)[^"]*)"/g)) {
    const href=match[1].split(/[?#]/)[0] || '/'
    assert.ok(seoPages.some(item=>item.path===href),`${page.path}: enlace interno sin página publicada: ${href}`)
  }
  const schema = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1])
  assert.equal(schema['@context'], 'https://schema.org')
  assert.ok(!schema['@graph'].some(item => ['Review', 'AggregateRating'].includes(item['@type']) || item.address || item.geo))
  assert.equal(schema['@graph'].some(item => item['@type'] === 'Service'), ['pentest','api','label','bounty'].includes(page.kind))
}
assert.equal(headings.size, seoPages.length, 'Cada página debe tener su propio H1')
const robots = await fs.readFile(path.join(output, 'robots.txt'), 'utf8')
if (indexable) {
  const sitemap = await fs.readFile(path.join(output, 'sitemap.xml'), 'utf8')
  assert.equal((sitemap.match(/<loc>/g) || []).length, seoPages.length)
  for (const page of seoPages) assert.ok(sitemap.includes(`<loc>${getPageMetadata(page.path, process.env).canonical}</loc>`))
  assert.ok(robots.includes(`Sitemap: ${getPageMetadata('/', process.env).origin}/sitemap.xml`))
} else {
  assert.ok(!robots.includes('Sitemap:'))
  await assert.rejects(fs.access(path.join(output, 'sitemap.xml')))
}
const image = await fs.readFile(path.join(output, 'og', 'securiva-social.png'))
assert.equal(image.subarray(0, 8).toString('hex'), '89504e470d0a1a0a')
assert.equal(image.readUInt32BE(16), 1200)
assert.equal(image.readUInt32BE(20), 630)
console.log(`SEO verificado: ${seoPages.length} páginas HTML, H1 y canonical únicos, schema coherente, imagen social 1200×630 y ${indexable ? 'sitemap público' : 'preview noindex sin sitemap'}.`)
