import { seoPages } from '../data/seoPages.js'

export const DEFAULT_SITE_URL = 'https://securiva.vercel.app'

export const siteIdentity = Object.freeze({
  name: 'SECURIVA',
  language: 'es-MX',
  description: 'Auditorías de vulnerabilidades, pentesting y ciberseguridad white label para agencias, empresas y SaaS en México.',
  email: 'dessenaluca53@gmail.com',
  telephone: '+541126547874',
  logo: '/brand/securiva-mark.svg',
  socialImage: '/og/securiva-social.png',
  socialImageAlt: 'SECURIVA. Auditorías de vulnerabilidades, pentesting y ciberseguridad white label.',
})

export function resolveSiteUrl(env = {}) {
  const configured = env.SEO_SITE_URL || env.SITE_URL || DEFAULT_SITE_URL
  const url = new URL(configured)
  if (url.protocol !== 'https:' || !url.hostname || url.username || url.password || url.search || url.hash || (url.pathname && url.pathname !== '/')) {
    throw new Error('SEO_SITE_URL debe ser un origen HTTPS público, sin ruta, credenciales, query ni fragmento.')
  }
  if (url.hostname === 'localhost' || url.hostname === '[::1]' || /^127\./.test(url.hostname)) {
    throw new Error('SEO_SITE_URL no puede apuntar a un servidor local.')
  }
  return url.origin
}

export function isIndexableBuild(env = {}) {
  return env.VERCEL_ENV !== 'preview' && env.SEO_NOINDEX !== 'true' && env.SEO_INDEXABLE !== 'false'
}

export function normalizePagePath(value = '/') {
  const path = String(value).split(/[?#]/, 1)[0]
  return path === '/' ? '/' : `/${path.replace(/^\/+|\/+$/g, '')}`
}

export function getPageMetadata(pathname = '/', env = {}) {
  const path = normalizePagePath(pathname)
  const page = seoPages.find(item => item.path === path)
  if (!page) throw new Error(`No hay contenido SEO definido para ${path}.`)
  const origin = resolveSiteUrl(env)
  const canonical = `${origin}${path === '/' ? '/' : path}`
  return {
    ...page,
    canonical,
    origin,
    image: `${origin}${siteIdentity.socialImage}`,
    indexable: isIndexableBuild(env),
  }
}

export function getStructuredData(page) {
  const organizationId = `${page.origin}/#organization`
  const websiteId = `${page.origin}/#website`
  const webpageId = `${page.canonical}#webpage`
  const serviceId = `${page.canonical}#service`
  const isService = page.path !== '/'
  const graph = [
    {
      '@type': 'Organization',
      '@id': organizationId,
      name: siteIdentity.name,
      url: `${page.origin}/`,
      description: siteIdentity.description,
      email: siteIdentity.email,
      telephone: siteIdentity.telephone,
      logo: { '@type': 'ImageObject', url: `${page.origin}${siteIdentity.logo}` },
      areaServed: { '@type': 'Country', name: 'México' },
    },
    {
      '@type': 'WebSite',
      '@id': websiteId,
      name: siteIdentity.name,
      url: `${page.origin}/`,
      inLanguage: siteIdentity.language,
      publisher: { '@id': organizationId },
    },
    {
      '@type': 'WebPage',
      '@id': webpageId,
      url: page.canonical,
      name: page.title,
      description: page.description,
      inLanguage: siteIdentity.language,
      isPartOf: { '@id': websiteId },
      about: { '@id': organizationId },
      mainEntity: { '@id': isService ? serviceId : organizationId },
    },
  ]
  if (isService) {
    graph.push({
      '@type': 'Service',
      '@id': serviceId,
      name: page.serviceName || page.title.split(/\s[|—]\s/)[0],
      serviceType: page.serviceName || page.title.split(/\s[|—]\s/)[0],
      description: page.description,
      url: page.canonical,
      provider: { '@id': organizationId },
      areaServed: { '@type': 'Country', name: 'México' },
      mainEntityOfPage: { '@id': webpageId },
    })
  }
  return { '@context': 'https://schema.org', '@graph': graph }
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]))
}

export function renderSeoHead(page) {
  const esc = escapeHtml
  const structuredData = JSON.stringify(getStructuredData(page)).replace(/</g, '\\u003c')
  return [
    `<title>${esc(page.title)}</title>`,
    `<meta name="description" content="${esc(page.description)}" />`,
    `<meta name="robots" content="${page.indexable ? 'index, follow, max-image-preview:large' : 'noindex, follow'}" />`,
    `<link rel="canonical" href="${esc(page.canonical)}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="${esc(siteIdentity.name)}" />`,
    `<meta property="og:locale" content="es_MX" />`,
    `<meta property="og:title" content="${esc(page.title)}" />`,
    `<meta property="og:description" content="${esc(page.description)}" />`,
    `<meta property="og:url" content="${esc(page.canonical)}" />`,
    `<meta property="og:image" content="${esc(page.image)}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:image:alt" content="${esc(siteIdentity.socialImageAlt)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${esc(page.title)}" />`,
    `<meta name="twitter:description" content="${esc(page.description)}" />`,
    `<meta name="twitter:image" content="${esc(page.image)}" />`,
    `<meta name="twitter:image:alt" content="${esc(siteIdentity.socialImageAlt)}" />`,
    `<script type="application/ld+json">${structuredData}</script>`,
  ].join('\n    ')
}

export function renderRobots(env = {}) {
  const sitemap = isIndexableBuild(env) ? `\nSitemap: ${resolveSiteUrl(env)}/sitemap.xml\n` : ''
  return `User-agent: *\nAllow: /\n${sitemap}`
}

export function renderSitemap(env = {}) {
  const origin = resolveSiteUrl(env)
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${seoPages.map(page => `  <url><loc>${escapeHtml(`${origin}${page.path === '/' ? '/' : page.path}`)}</loc></url>`).join('\n')}\n</urlset>\n`
}
