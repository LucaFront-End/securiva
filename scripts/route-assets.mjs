// The SSR head must load the CSS for the route it already renders.
// Manifest semantics: https://vite.dev/guide/backend-integration
// Follow static imports only. Nested dynamic imports (including 3D scenes) stay lazy.

const knowledgePaths = new Set(['/blog','/recursos','/preparar-pentest','/sobre-securiva','/informe-pentest-ejemplo'])

function routeEntryName(pathname) {
  if (typeof pathname !== 'string' || !pathname.startsWith('/') || pathname.startsWith('//') || /[?#\\\s]/u.test(pathname)) {
    throw new TypeError('La ruta de recursos debe ser un pathname canónico, sin query ni fragmento.')
  }
  const path = pathname === '/' ? '/' : pathname.replace(/\/+$/u,'')
  if (path === '/') return 'HomePage'
  if (knowledgePaths.has(path) || path.startsWith('/blog/') || path.startsWith('/recursos/')) return 'KnowledgeRoutes'
  // The caller supplies only published service paths from the page registry.
  return 'ServiceRoutes'
}

function fileName(value) {
  if (typeof value !== 'string' || !value || value.startsWith('/') || /[:?#\\\s<>"']/u.test(value) || value.split('/').some(part => !part || part === '.' || part === '..')) {
    throw new TypeError('El manifest contiene un recurso que no es una ruta relativa segura.')
  }
  if (!/\.(?:m?js|cjs|css)$/u.test(value)) throw new TypeError(`Tipo de recurso de entrada no soportado: ${value}.`)
  return value
}

function stringList(value,field) {
  if (value === undefined) return []
  if (!Array.isArray(value) || value.some(item => typeof item !== 'string' || !item)) throw new TypeError(`El manifest tiene una lista ${field} inválida.`)
  return value
}

function chunkAt(manifest,key) {
  const chunk = Object.hasOwn(manifest,key) ? manifest[key] : undefined
  if (!chunk || typeof chunk !== 'object' || Array.isArray(chunk)) throw new TypeError(`Falta una entrada requerida en el manifest: ${key}.`)
  return chunk
}

function identifiesRoute(key,chunk,name) {
  if (!chunk || typeof chunk !== 'object' || chunk.isDynamicEntry !== true) return false
  if (chunk.name === name) return true
  const source = new RegExp(`(?:^|/)${name}\\.(?:[cm]?[jt]s|[jt]sx)$`,'u')
  return source.test(key) || (typeof chunk.src === 'string' && source.test(chunk.src))
}

/**
 * Returns relative CSS and JS asset paths for root + one first-level lazy route.
 * CSS order is dependencies, root, then active route; every file occurs once.
 * It intentionally does not include fonts, arbitrary assets or dynamicImports.
 */
export function getRouteAssets(pathname,manifest) {
  if (!manifest || typeof manifest !== 'object' || Array.isArray(manifest)) throw new TypeError('Falta el manifest de producción de Vite.')
  const name = routeEntryName(pathname)
  const root = chunkAt(manifest,'index.html')
  if (root.isEntry !== true || !/\.(?:m?js|cjs)$/u.test(fileName(root.file))) throw new TypeError('index.html debe identificar la entrada JavaScript principal de Vite.')
  const firstLevel = stringList(root.dynamicImports,'dynamicImports')
  const candidates = firstLevel.filter(key => identifiesRoute(key,manifest[key],name))
  if (candidates.length !== 1) throw new TypeError(`Se esperaba una única entrada dinámica ${name} para ${pathname}; encontradas: ${candidates.length}.`)
  const active = candidates[0]
  const activeFile = fileName(chunkAt(manifest,active).file)
  if (!/\.(?:m?js|cjs)$/u.test(activeFile)) throw new TypeError(`La entrada ${name} debe ser JavaScript.`)

  const seenChunks = new Set()
  const css = new Set()
  const js = new Set()
  const visit = key => {
    if (seenChunks.has(key)) return
    seenChunks.add(key)
    const chunk = chunkAt(manifest,key)
    const asset = fileName(chunk.file)
    for (const dependency of stringList(chunk.imports,'imports')) visit(dependency)
    if (asset.endsWith('.css')) css.add(asset)
    else js.add(asset)
    for (const value of stringList(chunk.css,'css')) {
      const stylesheet = fileName(value)
      if (!stylesheet.endsWith('.css')) throw new TypeError(`La lista CSS contiene un archivo no CSS: ${value}.`)
      css.add(stylesheet)
    }
  }
  visit('index.html')
  visit(active)
  return {css:[...css],js:[...js]}
}
