// RSS: https://www.rssboard.org/rss-specification
// Dates: https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap
// These exports describe public content. They are not special ranking directives.
export const DISCOVERY_FEED_PATH = '/feed.xml'
export const CONTENT_MANIFEST_PATH = '/content-index.json'

function publicOrigin(value) {
  const url = new URL(value)
  if (url.protocol !== 'https:' || url.username || url.password || url.search || url.hash || url.pathname !== '/' || url.hostname === 'localhost' || url.hostname === '[::1]' || /^127\./.test(url.hostname)) {
    throw new TypeError('El origen de descubrimiento debe ser un origen HTTPS público, sin ruta ni credenciales.')
  }
  return url.origin
}

function plainText(value, field) {
  if (typeof value !== 'string' || !value.trim()) throw new TypeError(`Falta texto público en ${field}.`)
  // XML 1.0 disallows these controls even when entity-escaped.
  if (/[\u0000-\u0008\u000B\u000C\u000E-\u001F\uFFFE\uFFFF]/u.test(value) || value.toWellFormed() !== value) {
    throw new TypeError(`El texto de ${field} contiene caracteres XML inválidos.`)
  }
  return value.trim()
}

function escapeXml(value) {
  return value.replace(/[&<>"']/g, character => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[character]))
}

function datedValue(value, {now = new Date()} = {}) {
  if (value === undefined || value === null || value === '') return undefined
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) throw new TypeError('La fecha editorial debe tener formato YYYY-MM-DD.')
  const timestamp = Date.parse(`${value}T00:00:00.000Z`)
  if (!Number.isFinite(timestamp) || new Date(timestamp).toISOString().slice(0,10) !== value) throw new RangeError(`Fecha editorial inválida: ${value}.`)
  const nowTimestamp = new Date(now).getTime()
  if (!Number.isFinite(nowTimestamp)) throw new RangeError('La fecha de comprobación es inválida.')
  if (timestamp > nowTimestamp) throw new RangeError(`No se publica una fecha editorial futura: ${value}.`)
  return value
}

/** Returns only an explicitly recorded modification date; never the build date. */
export function getContentLastmod(record, options = {}) {
  return datedValue(record?.updatedAt, options)
}

function absolutePostUrl(origin, path) {
  if (typeof path !== 'string' || !/^\/blog\/[^?#\\\s]+$/u.test(path) || path.split('/').some(part => part === '.' || part === '..')) {
    throw new TypeError('Cada artículo debe tener una ruta canónica /blog/... sin query ni fragmento.')
  }
  const url = new URL(path,origin)
  if (url.origin !== origin || !url.pathname.startsWith('/blog/')) throw new TypeError('El artículo debe pertenecer al origen publicado.')
  return url.href
}

function referenceList(references = []) {
  if (!Array.isArray(references)) throw new TypeError('Las referencias públicas deben ser una lista.')
  const seen = new Set()
  return references.map(reference => {
    const url = new URL(reference.url)
    if (url.protocol !== 'https:' || url.username || url.password) throw new TypeError('Las referencias deben usar HTTPS sin credenciales.')
    return {title:plainText(reference.label,'referencia'),url:url.href}
  }).filter(reference => {
    if (seen.has(reference.url)) return false
    seen.add(reference.url)
    return true
  })
}

function publicPosts(origin, records, options) {
  if (!Array.isArray(records)) throw new TypeError('Los artículos públicos deben ser una lista.')
  const seen = new Set()
  return records.filter(record => record.published !== false && record.indexable !== false).map((record,position) => {
    const url = absolutePostUrl(origin,record.path)
    if (seen.has(url)) throw new TypeError(`Artículo duplicado en descubrimiento: ${url}.`)
    seen.add(url)
    const title = plainText([record.title,record.emphasis].filter(Boolean).join(' '),'título')
    const description = plainText(record.description || record.summary,'descripción')
    const dateModified = getContentLastmod(record,options)
    const datePublished = datedValue(record.publishedAt,options)
    if (datePublished && dateModified && dateModified < datePublished) throw new RangeError(`La modificación es anterior a la publicación: ${record.path}.`)
    return {record,url,title,description,dateModified,datePublished,position}
  }).sort((a,b) => (b.dateModified || b.datePublished || '').localeCompare(a.dateModified || a.datePublished || '') || a.position-b.position)
}

/** RSS 2.0 summaries. Missing publishedAt does not become an invented pubDate. */
export function renderBlogFeed(originValue, records, options = {}) {
  const origin = publicOrigin(originValue)
  const posts = publicPosts(origin,records,options)
  const lastmod = posts.map(post => post.dateModified || post.datePublished).filter(Boolean).sort().at(-1)
  const rssDate = value => new Date(`${value}T00:00:00.000Z`).toUTCString()
  const items = posts.map(post => [
    '    <item>',
    `      <title>${escapeXml(post.title)}</title>`,
    `      <link>${escapeXml(post.url)}</link>`,
    `      <guid isPermaLink="true">${escapeXml(post.url)}</guid>`,
    `      <description>${escapeXml(post.description)}</description>`,
    post.datePublished && `      <pubDate>${rssDate(post.datePublished)}</pubDate>`,
    post.record.category && `      <category>${escapeXml(plainText(post.record.category,'categoría'))}</category>`,
    '    </item>',
  ].filter(Boolean).join('\n')).join('\n')
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    '  <channel>',
    '    <title>SECURIVA — Blog de ciberseguridad</title>',
    `    <link>${origin}/blog</link>`,
    '    <description>Guías prácticas sobre pentesting, APIs, white label e investigación privada para agencias y empresas.</description>',
    '    <language>es</language>',
    `    <atom:link href="${origin}${DISCOVERY_FEED_PATH}" rel="self" type="application/rss+xml" />`,
    lastmod && `    <lastBuildDate>${rssDate(lastmod)}</lastBuildDate>`,
    '    <docs>https://www.rssboard.org/rss-specification</docs>',
    items,
    '  </channel>',
    '</rss>',
    '',
  ].filter(value => value !== false && value !== undefined).join('\n')
}

/** A public inventory for readers/integrations; canonical HTML remains authoritative. */
export function getContentManifest(originValue, records, options = {}) {
  const origin = publicOrigin(originValue)
  const posts = publicPosts(origin,records,options)
  return {
    version:1,
    title:'SECURIVA · Índice de artículos públicos',
    site:origin+'/',
    language:'es',
    canonicalIndex:origin+'/blog',
    feed:origin+DISCOVERY_FEED_PATH,
    author:{name:'Luca Dessena Maffucci',url:origin+'/sobre-securiva#luca-dessena-maffucci'},
    items:posts.map(post => ({
      url:post.url,
      title:post.title,
      summary:plainText(post.record.summary || post.description,'resumen'),
      ...(post.record.category ? {category:plainText(post.record.category,'categoría')} : {}),
      ...(post.datePublished ? {datePublished:post.datePublished} : {}),
      ...(post.dateModified ? {dateModified:post.dateModified} : {}),
      references:referenceList(post.record.references),
      questions:(post.record.faq || []).map(item => ({question:plainText(item.question,'pregunta'),answer:plainText(item.answer,'respuesta')})),
    })),
  }
}
