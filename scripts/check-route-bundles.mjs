import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import { gzipSync } from 'node:zlib'

const output=new URL('../dist/',import.meta.url)
const manifest=JSON.parse(await fs.readFile(new URL('.vite/manifest.json',output),'utf8'))
function graph(key,seen=new Set()) {
  assert.ok(manifest[key],`Falta entrada ${key}`)
  if(seen.has(key))return seen
  seen.add(key)
  for(const imported of manifest[key].imports || [])graph(imported,seen)
  return seen
}
const entry='index.html'
const home=Object.keys(manifest).find(key=>manifest[key].isDynamicEntry && /^assets\/HomePage-.*\.js$/.test(manifest[key].file))
const knowledge='src/components/KnowledgeRoutes.jsx'
const services=Object.keys(manifest).find(key=>manifest[key].isDynamicEntry && /^assets\/ServiceRoutes-.*\.js$/.test(manifest[key].file))
const initial=graph(entry)
assert.ok(manifest[home]?.isDynamicEntry,'HomePage debe ser una ruta diferida.')
assert.ok(manifest[knowledge]?.isDynamicEntry,'El contenido debe ser una ruta diferida.')
assert.ok(!initial.has(home),'La portada no debe descargarse desde las rutas de contenido.')
assert.ok(!initial.has(knowledge),'El blog no debe descargarse desde la portada.')
assert.ok(manifest[services]?.isDynamicEntry,'Los servicios deben tener una ruta diferida.')
assert.ok(!initial.has(services),'El contenido completo de servicios no debe descargarse desde el blog.')
async function size(keys) {
  let bytes=0,gzip=0
  for(const key of keys) {
    const filename=manifest[key].file
    if(!filename.endsWith('.js'))continue
    const contents=await fs.readFile(new URL(filename,output));bytes+=contents.length;gzip+=gzipSync(contents).length
  }
  return {bytes,gzip}
}
const result={checkedAt:new Date().toISOString(),initial:await size(initial),home:await size(new Set([...initial,...graph(home)])),knowledge:await size(new Set([...initial,...graph(knowledge)])),services:await size(new Set([...initial,...graph(services)])),initialFiles:[...initial].map(key=>manifest[key].file)}
await fs.mkdir(new URL('../work/seo/',import.meta.url),{recursive:true})
await fs.writeFile(new URL('../work/seo/route-bundles.json',import.meta.url),JSON.stringify(result,null,2)+'\n')
console.log(JSON.stringify(result,null,2))
