import { seoPages as coreSeoPages } from './seoPages.js'
import { regionalSeoMetadata } from './regionalSeo.js'
import { resourcePages, resourceSeoPages } from './securityResources.js'

export const utilityPages = [
  { path:'/recursos',kind:'resource-index',label:'Recursos',title:'Seguridad que se entiende.',emphasis:'Y se puede aplicar.',description:'Guías prácticas de pentesting white label y presupuesto de bug bounty para agencias de Argentina y México. Checklists, ejemplos de alcance y herramienta gratuita.',summary:'Decisiones claras antes de contratar o vender seguridad. Guías para preparar una evaluación, coordinar responsabilidades y entender un presupuesto de investigación privada.',sections:[],faq:[] },
  { path:'/preparar-pentest',kind:'tool',label:'Preparar un pentest',title:'Tu próximo pentest.',emphasis:'Empieza por el alcance.',description:'Herramienta gratuita para preparar el alcance de un pentest web o API: activos, roles, flujos, permisos y retest. Descarga tu brief para cotizar con una agencia.',summary:'Convierte un pedido general en un brief útil. Selecciona lo que necesitas evaluar y descarga un resumen para conversar con tu equipo o pedir una cotización. Tus respuestas se procesan en este dispositivo.',sections:[],faq:[{question:'¿Esta herramienta hace un escaneo de seguridad?',answer:'No. Organiza la información necesaria para acordar una evaluación. No se conecta a tus sistemas, no ejecuta pruebas y no determina si tu aplicación es segura.'},{question:'¿El resultado es una cotización?',answer:'Es un brief para preparar la cotización. El proveedor debe revisar los activos, la complejidad, los accesos y las condiciones antes de confirmar precio y calendario.'}] },
]
export const publishedResourcePages = [...utilityPages, ...resourcePages]
export const seoPages = [
  ...coreSeoPages,
  ...regionalSeoMetadata,
  ...utilityPages.map(page => ({path:page.path,kind:page.kind,title:page.title + ' ' + page.emphasis + ' | SECURIVA',description:page.description})),
  ...resourceSeoPages,
]
