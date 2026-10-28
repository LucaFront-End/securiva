export const sampleReportModel = {
  id:'DEMO-API-01',
  clientBrand:'TU AGENCIA',
  project:'Portal SaaS de demostración',
  notice:'Todos los activos, identidades, solicitudes y resultados de esta muestra son ficticios. No corresponde a un cliente ni demuestra una auditoría realizada.',
  executive:'En el escenario simulado, una cuenta puede leer un documento de otra organización. El servicio reconoce a la persona que inició sesión, pero omite comprobar si ese documento está dentro de sus permisos. Si ocurriera en un producto real, podría exponer información entre clientes. La decisión propuesta es revisar ese límite antes de ampliar la distribución del producto.',
  scope:'La muestra usa https://example.test y una operación de lectura de documentos. Se consideran dos organizaciones, A y B, con datos sintéticos y dos cuentas de prueba. El ejemplo no cubre pagos, infraestructura, servicios externos ni otras rutas de la aplicación.',
  actors:[
    {name:'fixture-a',role:'Lector',tenant:'Organización A',permission:'Puede consultar los documentos permitidos de A. No puede editar ni administrar.'},
    {name:'fixture-b',role:'Administrador',tenant:'Organización B',permission:'Puede administrar los documentos de B. Su rol no le concede acceso a A.'},
  ],
  finding:{
    title:'Lectura de un documento fuera de la organización autorizada',
    classification:'Autorización por objeto · BOLA',
    priority:'Prioridad orientativa: revisar antes de ampliar el acceso',
    priorityNote:'La severidad real depende de los datos, los permisos, la exposición y el impacto demostrable. No se asigna un valor CVSS a esta simulación.',
    expected:'La identidad fixture-a debería recibir una denegación al solicitar un documento de B, sin obtener su contenido. La respuesta debe ser coherente con la política de errores del producto.',
    observed:'La respuesta ficticia devuelve un documento de B a fixture-a. Esto ilustra una autorización incompleta en ese objeto; no permite concluir que toda la API tenga el mismo problema.',
    request:'GET /api/documents/DEMO-B-01\nHost: example.test\nContexto de la muestra: fixture-a · organización A',
    response:'HTTP 200 · RESPUESTA FICTICIA\n{\n  "document_id": "DEMO-B-01",\n  "organization": "B",\n  "content": "[DATO SINTÉTICO]"\n}',
  },
  remediation:[
    {title:'Contexto confiable',text:'Obtener la organización y los permisos desde la sesión validada en el servidor. Un parámetro enviado por el cliente no debe decidir ese contexto.'},
    {title:'Objeto y acción',text:'Comprobar organización, relación con el documento y acción solicitada en cada acceso. Un rol administrador sigue limitado a su ámbito autorizado.'},
    {title:'Denegación y regresión',text:'Denegar cuando falten permisos. Añadir pruebas de casos permitidos y prohibidos, y revisar operaciones equivalentes dentro del alcance acordado.'},
  ],
  pseudocode:'documento = buscarEnOrganizacion(\n  sesion.organizacion, idSolicitado\n)\n\npermitirSoloSi(\n  documento existe Y\n  tienePermiso(sesion, "leer", documento)\n)',
  retestIntro:'La siguiente matriz es un plan de verificación, no un retest ejecutado. Después de una corrección se registrarían versión, entorno, identidad, acción, evidencia y resultado. Los controles permitidos también deben seguir funcionando.',
  matrix:[
    {actor:'fixture-a · lector',object:'Propio · A',action:'Leer',expected:'Permitido'},
    {actor:'fixture-a · lector',object:'Ajeno · B',action:'Leer',expected:'Denegado'},
    {actor:'fixture-a · lector',object:'Propio · A',action:'Escribir',expected:'Denegado'},
    {actor:'fixture-b · administrador',object:'Propio · B',action:'Leer / escribir',expected:'Permitido'},
    {actor:'fixture-b · administrador',object:'Ajeno · A',action:'Escribir',expected:'Denegado'},
    {actor:'fixture-b · administrador',object:'Ámbito B',action:'Administrar',expected:'Permitido'},
    {actor:'fixture-a · lector',object:'Ámbito A',action:'Administrar',expected:'Denegado'},
  ],
  closure:'Un hallazgo real se cierra con evidencia que permita entender qué cambió y qué se volvió a comprobar. Si el problema persiste, el informe lo mantiene abierto. Si faltan accesos o el entorno no representa la corrección, se documenta esa limitación. Una corrección puntual no acredita la seguridad completa del producto.',
  delivery:'La agencia puede presentar una entrega con su identidad y coordinar la conversación con el cliente. En un proyecto real, el formato, el alcance, la confidencialidad y las condiciones del retest se acuerdan antes de iniciar las pruebas.',
}

export const sampleReportPage = {
  path:'/informe-pentest-ejemplo',kind:'resource',isSample:true,label:'Informe de muestra',
  title:'Muestra técnica.',emphasis:'Escenario ficticio.',
  description:'Ejemplo de informe de pentesting white label: impacto ejecutivo, evidencia sintética, corrección y plan de retest. Muestra ficticia sin datos de clientes.',
  summary:'Una muestra de cómo conectar un hallazgo técnico con una decisión de negocio. Revisa el resumen ejecutivo, la evidencia ficticia y la matriz de retest. Puedes descargar la versión de texto para evaluar el formato de una entrega white label.',
  updatedAt:'2026-10-28',publishedAt:'2026-10-28',sections:[],
  faq:[
    {question:'¿Este informe muestra una vulnerabilidad de un cliente?',answer:'No. Todos los datos y resultados son ficticios. Sirve para revisar el formato y el nivel de explicación de una entrega.'},
    {question:'¿La muestra incluye una certificación de seguridad?',answer:'No. Un informe describe pruebas dentro de un alcance. No acredita que un producto esté libre de vulnerabilidades ni sustituye requisitos específicos de compras.'},
    {question:'¿Mi agencia puede recibir informes con su propia marca?',answer:'La modalidad white label permite acordar la identidad visual de la entrega. La propuesta confirma contenido, responsabilidades y condiciones de presentación.'},
  ],
  references:[
    {label:'OWASP API1:2023 — Broken Object Level Authorization',url:'https://api-security.owasp.org/editions/2023/en/0xa1-broken-object-level-authorization/'},
    {label:'OWASP — Authorization Cheat Sheet',url:'https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html'},
  ],
  relatedPaths:['/white-label-ciberseguridad','/seguridad-api','/preparar-pentest','/blog/bola-aislamiento-tenant-api','/blog/que-debe-incluir-informe-pentest'],
}

export const sampleReportSeoMetadata = {
  path:sampleReportPage.path,kind:sampleReportPage.kind,isSample:true,
  title:'Ejemplo de informe de pentesting white label | SECURIVA',
  description:sampleReportPage.description,updatedAt:sampleReportPage.updatedAt,publishedAt:sampleReportPage.publishedAt,
}
