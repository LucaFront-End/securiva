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

export default { brands: approvedBrands, reviews: approvedReviews, references: referenceBrands }
