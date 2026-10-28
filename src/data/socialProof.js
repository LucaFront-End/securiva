// Incorporar únicamente marcas y testimonios reales con autorización para publicar.
// Marcas confirmadas y autorizadas por el usuario para esta página.
// Se muestran como referencias tipográficas, sin recrear logotipos oficiales.
// Formato: { name: string, logoUrl?: string, href?: string }.
export const approvedBrands = [
  { name: 'Tiendanube' },
  { name: 'Kueski' },
  { name: 'Clip' },
  { name: 'Kavak' },
  { name: 'Incode' },
  { name: 'Rappi' },
  { name: 'Auth0' },
  { name: 'Belvo' },
  { name: 'Conekta' },
  { name: 'Bitso' },
  { name: 'Meta' },
  { name: 'PayPal' },
  { name: 'Snapchat' },
  { name: 'Chia Network' },
]

// Se mantiene vacía cuando ya hay clientes confirmados.
export const referenceBrands = []

// Reseñas: { quote: string, name: string, role?: string, company?: string }.
export const approvedReviews = []

// Escenarios ilustrativos. No son citas ni resultados atribuidos a los clientes.
export const illustrativeCases = [
  { id:'commerce', company:'Tiendanube', category:'E-commerce', title:'Cada tienda, su propio perímetro.', description:'Evaluar permisos por tienda, aplicaciones conectadas y exposición de pedidos permite priorizar los puntos donde una integración puede ampliar el riesgo.', initials:'TN', accent:'blue' },
  { id:'credit', company:'Kueski', category:'Fintech', title:'El riesgo también está en la lógica.', description:'Probar cambios de rol, autorización y flujos críticos ayuda a entender cómo una acción válida puede convertirse en un acceso indebido.', initials:'KU', accent:'paper' },
  { id:'transactions', company:'Clip', category:'Pagos', title:'Una transacción. Todos sus controles.', description:'Revisar APIs y estados de una operación permite comprobar si los controles se mantienen cuando cambia la secuencia de un proceso.', initials:'CL', accent:'paper' },
  { id:'identity', company:'Incode', category:'Identidad', title:'La identidad necesita más que un login.', description:'Investigar autenticación, sesiones y permisos permite revisar qué puede hacer cada identidad después de entrar en una aplicación.', initials:'IN', accent:'dark' },
  { id:'sessions', company:'Auth0', category:'Autenticación', title:'Permisos claros, de extremo a extremo.', description:'Analizar sesiones, OAuth y relaciones entre aplicaciones permite evaluar cómo se aplican los permisos a lo largo de una integración.', initials:'A0', accent:'paper' },
  { id:'ecosystem', company:'Rappi', category:'Plataformas', title:'Un ecosistema. Múltiples fronteras.', description:'Separar los permisos de usuarios, comercios e integraciones ayuda a revisar accesos cruzados y flujos de negocio con distintos niveles de confianza.', initials:'RA', accent:'blue' },
  { id:'finance-api', company:'Belvo', category:'APIs', title:'El alcance empieza en sus conexiones.', description:'Definir activos, roles y datos antes de probar una API hace que la investigación se concentre en los límites que importan para el producto.', initials:'BE', accent:'dark' },
  { id:'evidence', company:'Conekta', category:'Pagos e integraciones', title:'Evidencia que un equipo puede usar.', description:'Documentar el impacto, los pasos de reproducción y una recomendación concreta transforma un hallazgo técnico en una decisión de corrección verificable.', initials:'CO', accent:'paper' },
]

export default { brands: approvedBrands, reviews: approvedReviews, references: referenceBrands }
