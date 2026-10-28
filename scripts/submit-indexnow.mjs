import fs from 'node:fs/promises'
import { seoPages } from '../src/data/pageRegistry.js'
import { isIndexableBuild, resolveSiteUrl } from '../src/seo/site.js'

// Manual post-deploy notification. Does not run in build or on visitor requests.
if (!isIndexableBuild(process.env)) throw new Error('No se envían vistas previas a IndexNow.')
const config = JSON.parse(await fs.readFile(new URL('../src/seo/indexnow.json', import.meta.url), 'utf8'))
const key = (await fs.readFile(new URL(`../public/${config.keyFile}`, import.meta.url), 'utf8')).trim()
if (!/^[a-zA-Z0-9-]{8,128}$/.test(key)) throw new Error('Clave de verificación inválida.')
const origin = resolveSiteUrl(process.env)
const payload = {host:new URL(origin).host,key,keyLocation:`${origin}/${config.keyFile}`,urlList:seoPages.map(page => origin + page.path)}
if (process.argv.includes('--dry-run')) {
  console.log(JSON.stringify({host:payload.host,count:payload.urlList.length,urls:payload.urlList,submitted:false},null,2))
} else {
  const keyResponse = await fetch(payload.keyLocation)
  if (!keyResponse.ok || (await keyResponse.text()).trim() !== key) throw new Error('La clave no está publicada en el origen configurado.')
  for (const url of payload.urlList) {
    const response = await fetch(url, {method:'HEAD',redirect:'manual'})
    if (response.status !== 200) throw new Error(`La URL no está publicada con HTTP 200: ${url}.`)
  }
  const response = await fetch('https://api.indexnow.org/indexnow',{method:'POST',headers:{'content-type':'application/json; charset=utf-8'},body:JSON.stringify(payload)})
  const result = {time:new Date().toISOString(),host:payload.host,count:payload.urlList.length,urls:payload.urlList,status:response.status,meaning:response.status===200?'URLs recibidas; no confirma indexación ni posiciones.':response.status===202?'URLs recibidas; validación de clave pendiente. No confirma indexación ni posiciones.':'Error de envío; revisar respuesta.',body:(await response.text()).slice(0,1000)}
  await fs.mkdir(new URL('../work/seo/',import.meta.url),{recursive:true})
  await fs.writeFile(new URL('../work/seo/indexnow-result.json',import.meta.url),JSON.stringify(result,null,2)+'\n')
  console.log(JSON.stringify(result,null,2))
  if (![200,202].includes(response.status)) process.exitCode=1
}
