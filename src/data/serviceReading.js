const guides = {
  '/blog/pentest-vs-escaneo-vulnerabilidades':'Pentest o escaneo: qué estás contratando',
  '/blog/definir-alcance-pentest-web':'Cómo preparar el alcance antes de cotizar',
  '/blog/bola-aislamiento-tenant-api':'Permisos y separación de datos entre clientes',
  '/blog/autenticacion-autorizacion-api':'Autenticación y autorización en APIs',
  '/blog/inventario-api-openapi-alcance':'Qué documentación necesita una evaluación de API',
  '/blog/retest-correcciones-cierre':'Cómo verificar las correcciones',
  '/blog/ciberseguridad-white-label-para-agencias':'Responsabilidades en una entrega white label',
  '/blog/como-vender-pentesting-agencia':'Cómo presentar pentesting a tu cliente',
  '/blog/que-debe-incluir-informe-pentest':'Qué debe incluir un informe útil',
  '/blog/checklist-seguridad-ecommerce-antes-lanzamiento':'Seguridad antes de lanzar una tienda',
  '/blog/elegir-proveedor-pentesting-mexico-argentina':'Cómo comparar proveedores de pentesting',
  '/blog/bug-bounty-privado-o-pentest':'Investigación privada o pentest: cuándo elegir cada uno',
  '/blog/cvss-severidad-impacto-negocio':'Severidad técnica e impacto para el negocio',
  '/blog/presupuesto-recompensas-bug-bounty':'Cómo acordar presupuesto y recompensas',
  '/blog/plan-30-dias-despues-pentest':'Qué hacer durante los primeros 30 días',
  '/blog/seguridad-saas-roles-tenants-integraciones':'Seguridad de roles, organizaciones e integraciones SaaS',
}
const selected = {
  '/pentesting-web':['/blog/pentest-vs-escaneo-vulnerabilidades','/blog/definir-alcance-pentest-web','/blog/retest-correcciones-cierre'],
  '/seguridad-api':['/blog/bola-aislamiento-tenant-api','/blog/autenticacion-autorizacion-api','/blog/inventario-api-openapi-alcance'],
  '/white-label-ciberseguridad':['/blog/ciberseguridad-white-label-para-agencias','/blog/como-vender-pentesting-agencia','/blog/que-debe-incluir-informe-pentest'],
  '/bug-bounty-privado':['/blog/bug-bounty-privado-o-pentest','/blog/presupuesto-recompensas-bug-bounty','/blog/cvss-severidad-impacto-negocio'],
  '/argentina':['/blog/elegir-proveedor-pentesting-mexico-argentina','/blog/como-vender-pentesting-agencia','/blog/definir-alcance-pentest-web'],
  '/mexico':['/blog/elegir-proveedor-pentesting-mexico-argentina','/blog/definir-alcance-pentest-web','/blog/que-debe-incluir-informe-pentest'],
}
export function getServiceReading(page) {
  return (page.relatedBlogPaths || selected[page.path] || []).map(path=>({path,label:guides[path]})).filter(item=>item.label)
}
