import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { plannedRegionalPages, regionalHubs, regionalServiceIntents, regionalPublicationGates, regionalSources } from '../src/data/regionalSeo.js'

const projectRoot = fileURLToPath(new URL('../', import.meta.url))
const outputDirectory = path.join(projectRoot, 'comercial', 'seo')
const status = 'Borrador editorial. No publicado ni indexable.'
const requirements = {
  localEvidenceVerified:'Evidencia local comprobada y útil para el comprador',
  distinctBuyerValueReviewed:'Contenido que aporta una decisión o respuesta diferente de la página nacional',
  originalArtifactReady:'Recurso, ejemplo o análisis original disponible',
  claimsAuthorized:'Afirmaciones y materiales de clientes autorizados',
  editorialReviewComplete:'Revisión editorial completa',
}

if (plannedRegionalPages.length !== 200 || new Set(plannedRegionalPages.map(page => page.path)).size !== 200) {
  throw new Error('El plan debe contener exactamente 200 rutas distintas antes de exportarse.')
}

const serviceLabels = Object.fromEntries(regionalServiceIntents.map(service => [service.key,service.label]))
const columns = ['country','city','service','path','primaryKeyword','status','published','indexable','priority','deliveryMode','physicalOffice','audience','decisionToHelp','originalArtifact','evidenceRequired','localResearchQuestion','mustAnswer','publicationRequirements']
const rows = plannedRegionalPages.map(page => ({
  country:page.country,
  city:page.city,
  service:serviceLabels[page.serviceKey],
  path:page.path,
  primaryKeyword:page.intentKeywords[0],
  status:page.published ? 'Publicado según registro editorial' : status,
  published:page.published,
  indexable:page.indexable,
  priority:page.priority,
  deliveryMode:'Remoto',
  physicalOffice:page.physicalOffice,
  audience:page.editorialBrief.audience,
  decisionToHelp:page.editorialBrief.decisionToHelp,
  originalArtifact:page.editorialBrief.originalArtifact,
  evidenceRequired:page.editorialBrief.evidenceRequired,
  localResearchQuestion:page.editorialBrief.localResearchQuestion,
  mustAnswer:page.editorialBrief.mustAnswer.join(' / '),
  publicationRequirements:regionalPublicationGates.filter(gate => page.publicationReview[gate] !== true).map(gate => requirements[gate]).join(' / '),
}))

// Semicolon-separated UTF-8 with BOM opens with accents in Spanish Excel.
function csvCell(value) {
  let text = String(value ?? '')
  if (/^[=+@\t\r-]/.test(text)) text = `'${text}`
  return `"${text.replace(/"/g,'""')}"`
}

const csv = '\uFEFF' + [columns.map(csvCell).join(';'),...rows.map(row => columns.map(column => csvCell(row[column])).join(';'))].join('\r\n') + '\r\n'
const manifest = {
  project:'SECURIVA',
  generatedAt:new Date().toISOString(),
  status,
  notes:[
    'Las 200 rutas son un mapa editorial. Exportarlas no crea páginas web ni las envía a Google.',
    'Las prioridades son hipótesis de ejecución. No se midieron volumen de búsqueda, dificultad ni posición por palabra clave.',
    'La cobertura es remota. No se declaran oficinas físicas en las ciudades.',
    'Publicar requiere evidencia local, utilidad diferente, recurso original, autorización y revisión editorial.',
  ],
  summary:{
    plannedRoutes:plannedRegionalPages.length,
    publishedRoutes:plannedRegionalPages.filter(page => page.published).length,
    indexableRoutes:plannedRegionalPages.filter(page => page.indexable).length,
    countries:regionalHubs.map(hub => ({country:hub.country,countryCode:hub.countryCode,cities:hub.cities.length})),
    serviceIntents:regionalServiceIntents.length,
  },
  publicationRequirements:requirements,
  sources:regionalSources,
  routes:plannedRegionalPages,
}

await fs.mkdir(outputDirectory, { recursive:true })
const csvPath = path.join(outputDirectory,'SECURIVA_Mapa_200_Rutas.csv')
const jsonPath = path.join(outputDirectory,'SECURIVA_Mapa_200_Rutas.json')
await fs.writeFile(csvPath,csv,'utf8')
await fs.writeFile(jsonPath,JSON.stringify(manifest,null,2) + '\n','utf8')
console.log(JSON.stringify({routes:rows.length,published:manifest.summary.publishedRoutes,indexable:manifest.summary.indexableRoutes,csv:csvPath,json:jsonPath},null,2))
