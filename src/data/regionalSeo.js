// Coverage is remote. These records never imply an office, local team or client outcome.
// City records are editorial briefs, not pages ready to publish or index.
export const regionalSources = [
  { id:'google-spam', label:'Google Search: políticas de spam y abuso de páginas de entrada', url:'https://developers.google.com/search/docs/essentials/spam-policies', checkedAt:'2026-10-28' },
  { id:'georef-ar', label:'Georef: referencia oficial de unidades territoriales de Argentina', url:'https://www.argentina.gob.ar/georef', checkedAt:'2026-10-28' },
  { id:'inegi-mx', label:'INEGI: catálogo de áreas geoestadísticas y localidades', url:'https://www.inegi.org.mx/app/ageeml/', checkedAt:'2026-10-28' },
  { id:'owasp-web', label:'OWASP Web Security Testing Guide', url:'https://owasp.org/www-project-web-security-testing-guide/', checkedAt:'2026-10-28' },
  { id:'owasp-api', label:'OWASP API Security Project', url:'https://owasp.org/www-project-api-security/', checkedAt:'2026-10-28' },
]

export const coverageCountries = [
  { key:'argentina', name:'Argentina', code:'AR', language:'es-AR', path:'/argentina', delivery:'Evaluación remota de aplicaciones web y APIs, con coordinación en español.', geographicSource:'georef-ar' },
  { key:'mexico', name:'México', code:'MX', language:'es-MX', path:'/mexico', delivery:'Evaluación remota de aplicaciones web y APIs, con coordinación en español.', geographicSource:'inegi-mx' },
]

export const regionalHubs = [
  {
    path:'/argentina', kind:'pentest', pageType:'coverage', country:'Argentina', countryCode:'AR', language:'es-AR', marketLabel:'ARGENTINA / COBERTURA REMOTA',
    number:'AR', label:'Ciberseguridad en Argentina', contactService:'Pentesting',
    serviceName:'Pentesting y ciberseguridad white label en Argentina',
    seoTitle:'Pentesting y ciberseguridad para agencias en Argentina | SECURIVA',
    description:'Pentesting web y de APIs para empresas y agencias de Argentina. Evaluación remota, alcance autorizado, informes con evidencia y modalidad white label.',
    title:'Seguridad para lo que construís.', emphasis:'En Argentina.',
    summary:'SECURIVA evalúa aplicaciones web y APIs de forma remota para agencias, empresas y equipos de producto de Argentina. Revisamos roles, sesiones e integraciones dentro de un alcance autorizado. Tu equipo recibe hallazgos validados, evidencia reproducible y recomendaciones para decidir qué corregir primero.',
    forWhom:'Para agencias de desarrollo y equipos de producto que necesitan agregar una revisión de seguridad a un lanzamiento, una entrega o una integración.',
    promise:'De una entrega de desarrollo a un alcance que se pueda evaluar.',
    topics:[
      { title:'Antes de entregar el proyecto', text:'Elegí los recorridos que tu cliente necesita proteger: alta de usuarios, permisos, datos entre cuentas y operaciones del negocio. Definimos qué entra en la evaluación y qué queda fuera antes de reservar la fecha.' },
      { title:'Cuando el cliente pide un pentest', text:'Transformamos el pedido general en activos, roles, entornos y evidencias concretas. Si tu cliente exige un formato de informe o un criterio de aceptación, compartilo al cotizar para confirmar si podemos cubrirlo.' },
      { title:'Con la marca de tu agencia', text:'Podés integrar la evaluación a tu propuesta y entregar el informe con tu identidad. Acordamos la participación de SECURIVA en las reuniones técnicas y quién coordina las correcciones con el cliente final.' },
      { title:'Después de la corrección', text:'La propuesta establece qué hallazgos entran en el retest y durante qué ventana se puede solicitar. Una funcionalidad nueva o un cambio de alcance se revisa por separado.' },
    ],
    inputs:['URL o inventario de operaciones de la aplicación','Roles y recorridos prioritarios de la entrega','Persona que autoriza las pruebas y responsable de desarrollo','Fecha objetivo y requisitos de presentación del informe'],
    deliverables:[['Alcance para aprobar','Entorno, activos, permisos, restricciones y exclusiones por escrito.'],['Informe para tu cliente','Resumen ejecutivo y evidencia técnica; identidad de tu agencia si contratás white label.'],['Prioridades de corrección','Impacto observado y recomendaciones para trabajar con desarrollo.'],['Cierre verificable','Reunión y retest según las condiciones de la propuesta.']],
    faq:[
      { question:'¿Trabajan con empresas de Buenos Aires, Córdoba o Rosario?', answer:'La evaluación de aplicaciones web y APIs se realiza de forma remota y se puede coordinar con equipos en esas ciudades y otras localidades de Argentina. Esta cobertura no implica una oficina física ni un equipo presencial en cada ciudad.' },
      { question:'¿Puedo sumar una auditoría a una propuesta que ya presenté?', answer:'Sí. Primero revisamos qué prometiste a tu cliente, los activos y la fecha objetivo. Después confirmamos el trabajo técnico y las condiciones de entrega. Conviene definir el alcance antes de comprometer una fecha o una cobertura total.' },
      { question:'¿Qué hacemos si no tenemos documentación completa de la API?', answer:'Compartí las operaciones y los flujos que ya conocen. Podemos delimitar una fase de inventario antes de cerrar el trabajo de evaluación. La ausencia de documentación no debe convertirse en una promesa de cobertura indefinida.' },
      { question:'¿Cómo se acuerdan el precio y las condiciones de pago?', answer:'La cotización escrita confirma la moneda, la vigencia, la forma de pago y las condiciones aplicables al proyecto. El precio depende de los activos, roles, flujos y acompañamiento requerido; la ubicación no sustituye la definición del alcance.' },
    ],
    cta:'Definir el alcance de mi proyecto',
    reference:{label:'OWASP Web Security Testing Guide',url:'https://owasp.org/www-project-web-security-testing-guide/'},
    cities:['Buenos Aires','Córdoba','Rosario','Mendoza','La Plata','Mar del Plata','San Miguel de Tucumán','Salta','Santa Fe','Neuquén','Bahía Blanca','San Juan','San Luis','Paraná','Posadas','Resistencia','Corrientes','Santiago del Estero','San Salvador de Jujuy','Formosa','San Fernando del Valle de Catamarca','La Rioja','Comodoro Rivadavia','San Carlos de Bariloche','Ushuaia'],
  },
  {
    path:'/mexico', kind:'api', pageType:'coverage', country:'México', countryCode:'MX', language:'es-MX', marketLabel:'MÉXICO / COBERTURA REMOTA',
    number:'MX', label:'Ciberseguridad en México', contactService:'Pentesting',
    serviceName:'Pentesting y ciberseguridad white label en México',
    seoTitle:'Pentesting y seguridad de APIs en México | SECURIVA',
    description:'Evaluación remota de seguridad web y de APIs para empresas y agencias en México. Alcance definido, validación manual, evidencia y entregas white label.',
    title:'Cada integración tiene límites.', emphasis:'Pongámoslos a prueba.',
    summary:'SECURIVA realiza pentesting web y de APIs para empresas, SaaS y agencias de México mediante trabajo remoto autorizado. Evaluamos los límites entre usuarios, organizaciones e integraciones. El alcance se traduce en pruebas concretas y el informe conecta cada hallazgo validado con su impacto y una acción de corrección.',
    forWhom:'Para responsables de tecnología y agencias que necesitan contratar una evaluación, comparar propuestas o incorporar seguridad a los servicios de sus clientes.',
    promise:'Una propuesta técnica que puedas comparar y aprobar.',
    topics:[
      { title:'Comparar cobertura', text:'Dos propuestas que dicen «pentesting» pueden revisar cosas distintas. Compara los activos, roles, operaciones de API, flujos e integraciones incluidos, además de las exclusiones y la profundidad de validación manual.' },
      { title:'Coordinar equipos e integraciones', text:'Identificamos quién controla cada activo y quién puede autorizar las pruebas. Una integración con un proveedor externo no autoriza a evaluar directamente sus sistemas; se delimita el trabajo sobre tu aplicación.' },
      { title:'Aprobar presupuesto y calendario', text:'Acordamos accesos, entorno, restricciones y fechas antes de comenzar. En investigación privada, la activación, las severidades elegibles y el presupuesto máximo quedan explícitos en la propuesta.' },
      { title:'Convertir el informe en trabajo', text:'Tu equipo recibe evidencia para reproducir los hallazgos y recomendaciones con contexto. Se define el canal de entrega, las personas que podrán acceder al informe y las condiciones de verificación de correcciones.' },
    ],
    inputs:['Inventario de activos y operaciones que quieres evaluar','Cuentas separadas por rol u organización','Responsable que autoriza y contacto técnico de coordinación','Condiciones de acceso, ventana de pruebas y fecha objetivo'],
    deliverables:[['Propuesta comparable','Cobertura, profundidad, exclusiones, calendario y condiciones.'],['Evidencia reproducible','Solicitudes, pasos y contexto de los hallazgos validados.'],['Informe ejecutivo y técnico','Prioridades para responsables de negocio y detalle para desarrollo.'],['Verificación acordada','Retest, plazos y límites incluidos en la cotización.']],
    faq:[
      { question:'¿Atienden equipos en Ciudad de México, Guadalajara o Monterrey?', answer:'Sí, las evaluaciones web y de APIs se coordinan de forma remota con equipos en esas ciudades y otras localidades de México. La cobertura describe dónde podemos atender proyectos; no declara sucursales físicas.' },
      { question:'¿Qué debería comparar entre cotizaciones de pentesting?', answer:'Revisa activos y entorno, roles, flujos, operaciones, validación manual, entregables, restricciones, calendario y retest. Pide que cada proveedor aclare las exclusiones. Un menor precio no permite comparar servicios con coberturas diferentes.' },
      { question:'¿Cómo coordinamos horarios si hay equipos en distintas ciudades?', answer:'Al definir el calendario acordamos la zona horaria de las ventanas de prueba, el canal de coordinación y los contactos de escalamiento. Esa información queda explícita para evitar confundir la hora de inicio o de entrega.' },
      { question:'¿Puedo contratar una fase con presupuesto máximo?', answer:'La investigación privada permite acordar una base y un máximo para hallazgos elegibles y validados. La propuesta define severidades, duplicados y qué sucede al llegar al tope. No sustituye el alcance ni promete hallazgos en todos los activos.' },
    ],
    cta:'Comparar el alcance de mi evaluación',
    reference:{label:'OWASP API Security Project',url:'https://owasp.org/www-project-api-security/'},
    cities:['Ciudad de México','Guadalajara','Monterrey','Puebla','Querétaro','Tijuana','León','Mérida','Cancún','Toluca','San Luis Potosí','Aguascalientes','Chihuahua','Hermosillo','Morelia','Veracruz','Villahermosa','Tuxtla Gutiérrez','Oaxaca','San Pedro Garza García','Zapopan','Culiacán','Saltillo','Durango','Cuernavaca'],
  },
]

export const regionalServiceIntents = [
  { key:'pentesting-web', kind:'pentest', servicePath:'/pentesting-web', label:'Pentesting web', query:'pentesting web', audience:'responsables de aplicaciones y equipos de desarrollo', decision:'Delimitar una evaluación web antes de contratarla.', artifact:'Ejemplo original de matriz de roles y tres recorridos de una aplicación, con criterios de inclusión y exclusión.', proof:'Caso autorizado sobre una evaluación web con relación comprobable con el mercado local, o investigación original útil para compradores locales.', questions:['Qué aplicación y entorno se evalúan','Qué roles y recorridos necesitan contraste','Qué condiciones definen la entrega y el retest'] },
  { key:'seguridad-api', kind:'api', servicePath:'/seguridad-api', label:'Seguridad de APIs', query:'pentesting de APIs', audience:'equipos SaaS y responsables de integraciones', decision:'Convertir un inventario de API en un alcance de evaluación verificable.', artifact:'Inventario original descargable con método, ruta, identidad, organización, operación de negocio y límites de autorización.', proof:'Caso autorizado o estudio local propio sobre integraciones y separación de datos, sin exponer vulnerabilidades.', questions:['Cómo se cuenta una operación funcional','Cómo se separan identidades y organizaciones de prueba','Qué sistemas de terceros quedan excluidos'] },
  { key:'white-label-ciberseguridad', kind:'label', servicePath:'/white-label-ciberseguridad', label:'Ciberseguridad white label', query:'ciberseguridad white label', audience:'agencias de desarrollo y e-commerce', decision:'Incorporar una evaluación a la propuesta de la agencia con responsabilidades y entregables claros.', artifact:'Ejemplo de propuesta y matriz de responsabilidades agencia, cliente y SECURIVA, adaptados a un caso local autorizado.', proof:'Caso público autorizado de una agencia del mercado local o investigación original con agencias locales y metodología visible.', questions:['Quién autoriza las pruebas sobre el cliente final','Cómo se presenta el informe con la marca de la agencia','Cómo se coordinan la comunicación y las correcciones'] },
  { key:'bug-bounty-privado', kind:'bounty', servicePath:'/bug-bounty-privado', label:'Bug bounty privado', query:'bug bounty privado', audience:'responsables de producto y agencias con activos delimitados', decision:'Elegir entre evaluación de alcance fijo e investigación privada con presupuesto máximo.', artifact:'Ejemplo original de reglas con causa raíz, severidades, duplicados, base, tope y tratamiento de hallazgos al cierre.', proof:'Caso local autorizado con reglas y resultados publicables, o investigación propia de necesidades y criterios de compra locales.', questions:['Qué hallazgos son elegibles','Cómo se evita cobrar duplicados','Qué ocurre al llegar al presupuesto máximo'] },
]

export function regionalSlug(value) {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')
}

export const regionalPublicationGates = Object.freeze([
  'localEvidenceVerified',
  'distinctBuyerValueReviewed',
  'originalArtifactReady',
  'claimsAuthorized',
  'editorialReviewComplete',
])

// A city-name substitution is insufficient. These flags record a human review,
// rather than treating word count, AI output or URL uniqueness as evidence of quality.
export function canPublishRegionalPage(review = {}) {
  return regionalPublicationGates.every(gate => review[gate] === true)
}

export const plannedRegionalPages = regionalHubs.flatMap(hub =>
  hub.cities.flatMap((city, cityIndex) => regionalServiceIntents.map(service => ({
    path:`${hub.path}/${regionalSlug(city)}/${service.key}`,
    pageType:'regional-service',
    country:hub.country,
    countryCode:hub.countryCode,
    countryPath:hub.path,
    language:hub.language,
    city,
    citySlug:regionalSlug(city),
    serviceKey:service.key,
    servicePath:service.servicePath,
    kind:service.kind,
    title:`${service.label} en ${city} | SECURIVA`,
    h1:`${service.label} para equipos de ${city}`,
    intentKeywords:[`${service.query} ${city}`,`${service.query} ${city} ${hub.country}`],
    deliveryMode:'remote',
    physicalOffice:false,
    published:false,
    indexable:false,
    status:'editorial-brief',
    priority:cityIndex < 3 ? 'P1' : cityIndex < 10 ? 'P2' : 'P3',
    editorialBrief:{
      audience:service.audience,
      decisionToHelp:service.decision,
      originalArtifact:service.artifact,
      evidenceRequired:service.proof,
      localResearchQuestion:`¿Qué necesidad de compra comprobable de equipos de ${city} permite que esta página sea más útil que ${service.servicePath} y ${hub.path}?`,
      mustAnswer:service.questions,
      exclusions:['Sin oficina local inventada','Sin cifras de mercado, posiciones ni volúmenes no medidos','Sin atribuir un caso o resultado a una marca por su logo','Sin repetir la página nacional cambiando el nombre de la ciudad'],
    },
    publicationReview:Object.fromEntries(regionalPublicationGates.map(gate => [gate,false])),
    canonicalStrategy:'URL propia únicamente al aprobar y publicar contenido diferenciado; no generar HTML ni sitemap mientras sea un brief.',
  })))
)

export const regionalSeoMetadata = regionalHubs.map(hub => ({
  path:hub.path,
  kind:hub.kind,
  pageType:hub.pageType,
  serviceName:hub.serviceName,
  title:hub.seoTitle,
  description:hub.description,
  country:hub.country,
  countryCode:hub.countryCode,
  language:hub.language,
}))
