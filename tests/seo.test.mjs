import test from 'node:test'
import assert from 'node:assert/strict'
import { seoPages } from '../src/data/pageRegistry.js'
import { blogPosts } from '../src/data/blog.js'
import { DEFAULT_SITE_URL, getPageMetadata, getStructuredData, isIndexableBuild, normalizePagePath, renderRobots, renderSeoHead, renderSitemap, resolveSiteUrl } from '../src/seo/site.js'

test('the public origin defaults to the live site and accepts an explicit domain migration', () => {
  assert.equal(resolveSiteUrl(), DEFAULT_SITE_URL)
  assert.equal(DEFAULT_SITE_URL, 'https://securiva.vercel.app')
  assert.equal(resolveSiteUrl({ SEO_SITE_URL: 'https://example.org/' }), 'https://example.org')
  assert.equal(resolveSiteUrl({ SITE_URL: 'https://example.org' }), 'https://example.org')
  assert.equal(resolveSiteUrl({ SEO_SITE_URL: 'https://example.org', SITE_URL: 'https://example.net' }), 'https://example.org')
  for (const value of ['http://example.org', 'https://example.org/folder', 'https://user:password@example.org', 'https://example.org/?token=x', 'https://localhost', 'file:///tmp/site']) {
    assert.throws(() => resolveSiteUrl({ SEO_SITE_URL: value }), value)
  }
})

test('every published page has a distinct title, description and canonical URL', () => {
  assert.equal(new Set(seoPages.map(page => page.path)).size, seoPages.length)
  assert.equal(new Set(seoPages.map(page => page.title)).size, seoPages.length)
  assert.equal(new Set(seoPages.map(page => page.description)).size, seoPages.length)
  const canonicalUrls = new Set()
  for (const page of seoPages) {
    const metadata = getPageMetadata(page.path)
    assert.equal(metadata.canonical, `${DEFAULT_SITE_URL}${page.path}`)
    assert.ok(page.description.length > 70)
    canonicalUrls.add(metadata.canonical)
  }
  assert.equal(canonicalUrls.size, seoPages.length)
  assert.equal(normalizePagePath('/pentesting-web/?from=test#alcance'), '/pentesting-web')
  assert.throws(() => getPageMetadata('/ruta-inexistente'))
})

test('preview builds remain noindex and do not advertise a production sitemap', () => {
  assert.equal(isIndexableBuild({ VERCEL_ENV: 'production' }), true)
  for (const env of [{ VERCEL_ENV: 'preview' }, { SEO_NOINDEX: 'true' }, { SEO_INDEXABLE: 'false' }]) {
    assert.equal(isIndexableBuild(env), false)
    for (const page of seoPages) {
      const head = renderSeoHead(getPageMetadata(page.path, env))
      assert.ok(head.includes('content="noindex, follow"'))
      assert.ok(!head.includes('content="index, follow'))
    }
    assert.ok(!renderRobots(env).includes('Sitemap:'))
    assert.ok(renderRobots(env).includes('Allow: /'))
  }
})

test('schema describes the real organization and services without invented social proof or offices', () => {
  for (const page of seoPages) {
    const metadata = getPageMetadata(page.path)
    const data = getStructuredData(metadata)
    const graph = data['@graph']
    assert.equal(data['@context'], 'https://schema.org')
    assert.equal(new Set(graph.map(item => item['@id'])).size, graph.length)
    const organization = graph.find(item => item['@type'] === 'Organization')
    assert.equal(organization.url, `${DEFAULT_SITE_URL}/`)
    assert.equal(organization.name, 'SECURIVA')
    assert.equal(organization.email, 'dessenaluca53@gmail.com')
    assert.equal(graph.some(item => item['@type'] === 'Service'), ['pentest','api','label','bounty'].includes(page.kind))
    for (const item of graph) {
      assert.ok(!['Review', 'AggregateRating', 'LocalBusiness'].includes(item['@type']))
      assert.ok(!item.address && !item.geo && !item.aggregateRating && !item.review && !item.hasCredential)
    }
    const service = graph.find(item => item['@type'] === 'Service')
    if (service) assert.equal(service.provider['@id'], organization['@id'])
  }
})

test('metadata is escaped and structured data cannot terminate its script element', () => {
  const metadata = { ...getPageMetadata('/'), title: 'SECURIVA <script>test</script> " &', description: 'Descripción </script><script>alert(1)</script>' }
  const head = renderSeoHead(metadata)
  assert.ok(head.includes('&lt;script&gt;'))
  assert.ok(!head.includes('<script>alert(1)</script>'))
  assert.equal((head.match(/<script\b/g) || []).length, 1)
  assert.equal((head.match(/rel="canonical"/g) || []).length, 1)
  const serialized = head.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]
  assert.ok(serialized.includes('\\u003c'))
  assert.equal(JSON.parse(serialized)['@graph'].find(item => item['@type'] === 'WebPage').description, metadata.description)
})

test('sitemap contains only the published pages and migrates consistently with the configured origin', () => {
  const sitemap = renderSitemap()
  assert.equal((sitemap.match(/<loc>/g) || []).length, seoPages.length)
  for (const page of seoPages) assert.ok(sitemap.includes(`<loc>${DEFAULT_SITE_URL}${page.path}</loc>`))
  assert.ok(!sitemap.includes('<lastmod>'))
  assert.ok(!sitemap.includes('securiva.com'))
  const migrated = renderSitemap({ SEO_SITE_URL: 'https://example.org' })
  assert.ok(migrated.includes('https://example.org/pentesting-web'))
  assert.ok(!migrated.includes(DEFAULT_SITE_URL))
  assert.ok(renderRobots().includes(`Sitemap: ${DEFAULT_SITE_URL}/sitemap.xml`))
})

test('country pages use their actual service coverage and resources are articles, not services', () => {
  for (const [path, country, language] of [['/argentina','Argentina','es-AR'],['/mexico','México','es-MX']]) {
    const graph = getStructuredData(getPageMetadata(path))['@graph']
    assert.equal(graph.find(item => item['@type'] === 'Service').areaServed.name,country)
    assert.equal(graph.find(item => item['@type'] === 'WebPage').inLanguage,language)
    assert.deepEqual(graph.find(item => item['@type'] === 'Organization').areaServed.map(item => item.name),['Argentina','México'])
  }
  const graph = getStructuredData(getPageMetadata('/recursos/checklist-pentesting-white-label'))['@graph']
  assert.ok(graph.some(item => item['@type'] === 'Article'))
  assert.ok(!graph.some(item => item['@type'] === 'Service'))
})

test('blog entries have article metadata, author identity and working related routes', () => {
  assert.equal(blogPosts.length,16)
  for (const post of blogPosts) {
    const metadata=getPageMetadata(post.path)
    const graph=getStructuredData(metadata)['@graph']
    const article=graph.find(item=>item['@type']==='BlogPosting')
    assert.ok(article,post.path)
    assert.equal(article.author.url,`${DEFAULT_SITE_URL}/sobre-securiva#luca-dessena-maffucci`)
    assert.equal(article.image,metadata.image)
    assert.equal(article.datePublished,post.updatedAt)
    assert.ok(!graph.some(item=>item['@type']==='Service'))
    assert.equal(graph.find(item=>item['@type']==='BreadcrumbList').itemListElement.length,3)
    for (const path of post.relatedPaths) assert.ok(seoPages.some(page=>page.path===path),`${post.path}: ${path}`)
  }
})
