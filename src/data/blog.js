import { technicalBlogPosts } from './blogTechnical.js'
import { agencyBlogPosts } from './blogAgency.js'
import { researchBlogPosts } from './blogResearch.js'

const practicalLinks = {
  '/blog/checklist-seguridad-ecommerce-antes-lanzamiento':['/pentesting-ecommerce'],
  '/blog/seguridad-saas-roles-tenants-integraciones':['/pentesting-saas'],
  '/blog/bola-aislamiento-tenant-api':['/pentesting-saas','/informe-pentest-ejemplo'],
  '/blog/que-debe-incluir-informe-pentest':['/informe-pentest-ejemplo'],
  '/blog/ciberseguridad-white-label-para-agencias':['/informe-pentest-ejemplo'],
  '/blog/retest-correcciones-cierre':['/informe-pentest-ejemplo'],
}
export const blogPosts = [...technicalBlogPosts, ...agencyBlogPosts, ...researchBlogPosts].map(post => ({...post, isBlog:true,relatedPaths:[...new Set([...post.relatedPaths,...(practicalLinks[post.path] || [])])]}))
export const blogIndexPage = {
  path:'/blog',kind:'blog-index',label:'Blog',title:'Seguridad con contexto.',emphasis:'Decisiones con criterio.',
  description:'Blog de SECURIVA: pentesting web, seguridad de APIs, white label y bug bounty para agencias y empresas de Argentina y México. Guías prácticas y checklists.',
  summary:'Del primer alcance a la corrección verificada. Respuestas prácticas para quienes construyen productos digitales, venden servicios y toman decisiones de seguridad.',
  sections:[],faq:[],
}
export const blogSeoPages = [blogIndexPage,...blogPosts].map(page => ({
  path:page.path,kind:page.kind,title:page.title+' '+page.emphasis+' | SECURIVA',description:page.description,
  isBlog:page.isBlog,category:page.category,updatedAt:page.updatedAt,publishedAt:page.publishedAt,
  ...(page.isBlog ? {socialImage:'/og/blog/'+page.path.split('/').pop()+'.png',socialImageAlt:page.title+' '+page.emphasis} : {}),
}))
