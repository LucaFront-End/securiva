import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { build } from 'esbuild'
import { seoPages } from '../src/data/pageRegistry.js'
import { getPageMetadata, isIndexableBuild, renderRobots, renderSeoHead, renderSitemap, siteIdentity } from '../src/seo/site.js'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const output = path.join(root, 'dist')
const socialImage = await fs.readFile(path.join(output, siteIdentity.socialImage.slice(1)))
if (socialImage.subarray(0, 8).toString('hex') !== '89504e470d0a1a0a' || socialImage.readUInt32BE(16) !== 1200 || socialImage.readUInt32BE(20) !== 630) {
  throw new Error('La imagen social debe existir como PNG de 1200 × 630 en public/og/securiva-social.png.')
}
const temporary = path.join(root, 'work', 'prerender')
await fs.mkdir(temporary, { recursive: true })
const entry = path.join(temporary, 'entry-server.cjs')
await build({
  absWorkingDir: root,
  entryPoints: ['src/entry-server.jsx'],
  outfile: entry,
  bundle: true,
  platform: 'node',
  format: 'cjs',
  target: 'node20',
  jsx: 'automatic',
  loader: { '.css': 'empty' },
  external: ['react', 'react/jsx-runtime', 'react-dom', 'react-dom/server', 'three'],
  logLevel: 'silent',
})
const { render } = await import(pathToFileURL(entry).href)
const template = await fs.readFile(path.join(output, 'index.html'), 'utf8')
const headMarker = /<!--seo-head:start-->[\s\S]*?<!--seo-head:end-->/
if (!headMarker.test(template) || !template.includes('<!--app-html-->')) {
  throw new Error('Faltan los puntos de inserción de HTML o metadata en dist/index.html.')
}
const generated = []
for (const page of seoPages) {
  const metadata = getPageMetadata(page.path, process.env)
  const body = await render(page.path)
  if (!body || !/<h1[\s>]/.test(body)) throw new Error(`Prerender incompleto en ${page.path}.`)
  const html = template.replace(/<html lang="[^"]+">/, `<html lang="${metadata.language || 'es'}">`).replace(headMarker, renderSeoHead(metadata)).replace('<!--app-html-->', body)
  const destination = page.path === '/' ? path.join(output, 'index.html') : path.join(output, `${page.path.slice(1)}.html`)
  await fs.mkdir(path.dirname(destination), { recursive: true })
  await fs.writeFile(destination, html, 'utf8')
  generated.push({ path: page.path, canonical: metadata.canonical, bytes: Buffer.byteLength(html) })
}
await fs.writeFile(path.join(output, 'robots.txt'), renderRobots(process.env), 'utf8')
if (isIndexableBuild(process.env)) await fs.writeFile(path.join(output, 'sitemap.xml'), renderSitemap(process.env), 'utf8')
else await fs.rm(path.join(output, 'sitemap.xml'), { force: true })
console.log(`Prerender completo: ${generated.length} páginas; ${isIndexableBuild(process.env) ? 'indexación habilitada' : 'vista previa noindex'}.`)
for (const page of generated) console.log(`  ${page.path} → ${page.canonical} (${page.bytes} bytes)`)
