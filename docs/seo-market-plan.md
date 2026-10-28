# SECURIVA · Plan operativo SEO, GEO y autoridad

Actualización: 28 de octubre de 2026. Mercados: Argentina y México. Origen actual: https://securiva.vercel.app/. Responsable comercial y técnico: Luca Dessena Maffucci.

El objetivo comercial es conseguir consultas de agencias y empresas que puedan convertirse en evaluaciones de seguridad con alcance y presupuesto acordados. El primer puesto en Google es una aspiración: no puede garantizarse ni comprarse con una implementación técnica. La evaluación del trabajo se hará por descubrimiento, consultas cualificadas, propuestas y ventas.

## Estado de la implementación

**Ejecución verificada el 28/10/2026:** hay 29 páginas publicadas y comprobadas en producción, incluidas 16 entradas de blog. Google Search Console y Bing Webmaster Tools están verificados con etiquetas HTML. Google aceptó el sitemap y muestra 29 URLs descubiertas; Bing recibió la ampliación y la procesa. IndexNow recibió las 29 URLs con HTTP 200. Esto no confirma indexación ni posiciones. El registro detallado está en [execution-2026-10-28.json](seo/execution-2026-10-28.json).

Se publicaron seis destinos contextuales nuevos desde el README de GitHub, verificados con `rel=nofollow`, y se actualizó la descripción del repositorio. El dominio de referencia ya existía: no se cuenta como un dominio nuevo. La ficha de pentest.fyi quedó preparada y sin enviar porque requiere correo corporativo; el usuario confirmó que no dispone de él.

El primer lote de esta ampliación contenía **11 páginas publicadas**: cinco páginas existentes, dos hubs de país y cuatro páginas de recursos. El registro técnico está en `src/data/pageRegistry.js`; el despliegue y las herramientas de webmaster deben comprobarse por separado. El hecho de que una URL aparezca en sitemap no demuestra que esté indexada ni posicione.

| Página | Decisión que resuelve |
| --- | --- |
| `/` | Entender la propuesta y elegir servicio |
| `/pentesting-web` | Contratar una evaluación web delimitada |
| `/seguridad-api` | Revisar permisos, autenticación e integraciones |
| `/white-label-ciberseguridad` | Incorporar seguridad a la oferta de una agencia |
| `/bug-bounty-privado` | Entender investigación por hallazgos y sus reglas |
| `/argentina` | Coordinar atención remota para Argentina |
| `/mexico` | Coordinar atención remota para México |
| `/recursos` | Encontrar material práctico de evaluación |
| `/preparar-pentest` | Generar un brief de alcance reutilizable |
| `/recursos/checklist-pentesting-white-label` | Acordar responsabilidades con la agencia |
| `/recursos/presupuesto-bug-bounty-privado` | Separar operación, recompensas y límites |

Hay **200 briefs de ciudad y servicio**, calculados como 25 ciudades por país × 2 países × 4 intenciones. Son una cartera editorial, **no 200 páginas publicadas o indexables**. Su registro está en `src/data/regionalSeo.js`. Cada una debe aportar evidencia o investigación propia pertinente, utilidad distinta al servicio nacional, un recurso original, autorización de las afirmaciones y revisión editorial completa. Repetir la landing cambiando la ciudad no satisface ese criterio.

La atención remota no acredita oficinas en las ciudades. No publicar direcciones, coordenadas, horarios locales o datos de `LocalBusiness` sin una sede real. Los países sí pueden describirse como áreas atendidas.

## Blog publicado y prácticas aplicadas

Se añadieron /blog, 16 artículos y /sobre-securiva. El total actual es 29 URLs. Los artículos cubren decisiones concretas de alcance, APIs, venta para agencias, evidencia, retest, presupuesto y gestión; no son variantes de ciudades. Cada entrada tiene fuentes primarias, ejemplos hipotéticos identificados, artículos relacionados, CTA y una imagen social propia. BlogPosting referencia al responsable y su presentación pública.

El índice permite filtrar por tema y buscar con o sin tildes. Las 16 entradas y sus enlaces existen en HTML antes de ejecutar JavaScript. La carga del contenido se separa de la landing; no se añaden todos los artículos al JavaScript inicial de la portada.

Se revisaron las guías oficiales y las rutas de aprendizaje anunciadas por Google el 6/10/2026. La lista de comprobación está en [google-practices.json](seo/google-practices.json). No se afirma que se haya completado un curso de vídeo ni obtenido una certificación. Validación: 28 pruebas, build, enlaces internos, 29 HTML públicos, metadatos, imágenes 1200×630 y móvil 390/320px.

## Prioridad de adquisición

La prioridad inicial es **white label para agencias**, seguida de pentesting web y de APIs. La investigación privada requiere explicar con claridad la diferencia entre comprador de un programa e investigador que busca recompensas.

La muestra de búsquedas del 28/10/2026 devolvió competencia comercial específica en ambos países. Meerida explica su modelo de marca blanca; DEFENSA IT y TLS tienen páginas especializadas de APIs; otras firmas publican alcance y precios no comparables entre sí. Estas observaciones sirven para decidir qué información debe tener SECURIVA. No son un estudio de volúmenes ni un seguimiento de posiciones de Google localizado.

Las 10 intenciones y fuentes primarias observadas están en [search-landscape.json](seo/search-landscape.json). No atribuir a SECURIVA resultados de casos de otros proveedores.

## Ejecución a 30, 60 y 90 días

| Plazo | Trabajo controlable | Evidencia para cerrar la tarea |
| --- | --- | --- |
| Días 1–30 | Verificar propiedad en Search Console y Bing, enviar sitemap, comprobar las 11 páginas y los eventos de contacto. Completar perfiles propios y solicitar hasta tres fichas pertinentes. Revisar el contenido de los dos hubs con consultas reales del negocio. | Propiedades verificadas; sitemap aceptado o error documentado; registro de URLs inspeccionadas; perfiles o solicitudes con URL y fecha; prueba del flujo de contacto |
| Días 31–60 | Usar consultas e impresiones reales para priorizar dos contenidos nuevos. Convertir una pregunta comercial repetida en guía o ejemplo técnico propio. Presentar un aporte técnico neutral a una comunidad cuando haya convocatoria vigente. Solicitar feedback auténtico a clientes con los que exista relación y autorización de contacto. | Cambios vinculados a consultas concretas; recurso publicado y probado; propuesta editorial o solicitud documentada; testimonios solo si el cliente los proporciona y autoriza |
| Días 61–90 | Ampliar las páginas que generan consultas cualificadas. Publicar de dos a seis páginas regionales únicamente si cumplen todos los criterios editoriales; si ninguna los cumple, mejorar recursos y servicios. Revisar referencias externas, conversiones y posibles duplicados. | Revisión de cada nueva página, sitemap actualizado, trazabilidad de referencias, propuestas y ventas por origen; decisiones de mantener, mejorar o fusionar |

No se programa prospección masiva por WhatsApp ni se compra publicidad, membresías o enlaces con este plan. Una oportunidad editorial no autoriza a inventar una relación, una charla aceptada o una recomendación.

## Medición y metas de trabajo

La línea de base orgánica y de citas IA está **pendiente de obtener de las cuentas verificadas**. Desconocido no significa cero. No se han medido volumen por keyword, dificultad, cuota de mercado ni posiciones por ciudad.

| Indicador | Línea de base | Meta de trabajo inicial | Cómo leerlo |
| --- | --- | --- | --- |
| Páginas del lote inicial comprobadas | Validar despliegue | 11 respuestas correctas y metadatos coherentes | Control técnico; no prueba indexación |
| Propiedades verificadas | Comprobar sesiones y propiedad | Search Console + Bing | Control operativo |
| Solicitudes de perfiles pertinentes | Separar preexistentes y nuevas | Hasta 3 al día 30; hasta 6 al día 60 si cumplen requisitos | Solicitud no equivale a publicación |
| Recursos públicos útiles | Nuevo lote de 4 páginas | Mantener herramienta y dos guías; añadir 2 piezas basadas en preguntas reales al día 60 | Probar uso, claridad y enlaces |
| Nuevas referencias editoriales independientes | Desconocida | Aspiración: 2–3 en 90 días | Depende de terceros; no es promesa ni criterio para comprar enlaces |
| Consultas orgánicas cualificadas | Desconocida | Objetivo provisional: 10 acumuladas en 90 días | Revisar al día 30; no es pronóstico |
| Propuestas a partir de esas consultas | Desconocida | Objetivo provisional: 5 | Registrar oportunidad real, servicio y estado |
| Ventas de ese canal | Desconocida | Objetivo provisional: 2 | Depende de oferta, seguimiento, precio y capacidad |
| Impresiones, clics y consultas por país | Desconocida | Establecer base de 28 días y comparar periodos equivalentes | Evitar porcentajes sin tamaño de muestra |
| Citas y páginas citadas en IA | Desconocida | Habilitar lectura de reportes disponibles y establecer base | No equiparar cita con posición, autoridad o venta |

Un clic en WhatsApp o correo es intención de contacto. Solo hay lead recibido cuando llega una conversación o solicitud. Para calificarlo, registrar empresa, necesidad, alcance tentativo, plazo y posibilidad de contratación; no añadir información sensible a eventos analíticos.

## Backlinks y perfiles: qué ejecutar primero

La investigación contiene **17 oportunidades verificadas**, con requisitos, coste conocido o desconocido, acción siguiente y estado. Está en [backlinks.json](seo/backlinks.json).

1. **GitHub, repositorio existente.** El campo About ya enlazaba a https://securiva.vercel.app antes de esta ampliación. No contarlo como un backlink nuevo. Completar la descripción y añadir enlaces descriptivos a recursos realmente publicados.
2. **pentest.fyi.** Su página oficial describe un directorio gratuito y una solicitud mediante “Submit Company”, con revisión editorial. Comprobar los campos y usar datos auténticos. La solicitud no garantiza publicación.
3. **LinkedIn Company Page.** Página gratuita con web y descripción de servicios, utilizando una cuenta autorizada. Buscar y reutilizar una ficha existente antes de duplicar.
4. **Clutch, Goodfirms y DesignRush.** Considerar fichas gratuitas fieles si cumplen requisitos. No inventar equipo, domicilio, año de fundación o tarifas. La tabla actual de Clutch Basic no incluye enlace al sitio desde páginas de directorio.
5. **Comunidad y aportes.** OWASP Buenos Aires, OWASP Mexico City y DEV requieren contenido útil y neutral. El enlace depende de la edición, no de pegar una URL. La edición Buenos Aires 2026 de Ekoparty ya terminó al actualizar este documento: buscar próxima convocatoria vigente.
6. **Perfiles de investigador.** HackerOne o Bugcrowd solo si pertenecen realmente al fundador; añadir web y experiencia comprobables. No crear reputación o premios ficticios.

TechBehemoths pide correo empresarial para reclamar una ficha; Gmail no satisface ese requisito documentado. CESSI y AMITI tienen procesos de admisión: evaluar encaje comercial, condiciones y datos jurídicos antes de comprometer gasto.

Para cada referencia registrar: URL pública, destino, fecha, estado HTTP, atributo `rel` observado, origen de sesiones y consultas cualificadas. **No se verificaron atributos rel de estas oportunidades**, por lo que no se venden como enlaces “dofollow”. Una ficha propia no es una recomendación editorial independiente.

## Descripciones listas para perfiles

**México · corta**

> Pentesting web y de APIs, investigación privada de vulnerabilidades y ciberseguridad white label para agencias y empresas de México. Evaluación remota, alcance acordado e informes con evidencia.

**México · completa**

> SECURIVA ayuda a agencias digitales, empresas y equipos SaaS de México a evaluar la seguridad de aplicaciones web y APIs. Antes de las pruebas se acuerdan activos, permisos, límites y entregables. Los hallazgos se documentan con evidencia, prioridades y recomendaciones para el equipo técnico. En modalidad white label, la agencia integra la evaluación a su oferta y entrega el informe con su marca. Los programas privados de investigación se definen con criterios de validación, recompensas y presupuesto máximo. Atención remota y coordinación en español. Real Security. Real Impact.

**Argentina · corta**

> Sumá pentesting web y de APIs a la oferta de tu agencia con SECURIVA. Evaluación remota para Argentina, alcance acordado e informes con tu marca.

**Argentina · completa**

> SECURIVA trabaja con agencias digitales, empresas y equipos SaaS de Argentina que necesitan evaluar la seguridad de sus aplicaciones web y APIs. Acordamos activos, permisos, límites y entregables antes de comenzar. Documentamos los hallazgos con evidencia, prioridades y recomendaciones para que el equipo pueda actuar. Con el servicio white label, incorporás la evaluación a tu propuesta y presentás el informe con tu marca. También definimos programas privados de investigación con validación, recompensas y presupuesto máximo acordado. Atención remota y coordinación en español. Real Security. Real Impact.

**English · short**

> Web and API penetration testing, private vulnerability research, and white-label cybersecurity for agencies and businesses in Argentina and Mexico. Remote delivery, agreed scope, and evidence-based reporting.

**English · full**

> SECURIVA helps digital agencies, businesses, and SaaS teams in Argentina and Mexico assess the security of web applications and APIs. Assets, authorization, testing limits, and deliverables are agreed before testing begins. Findings are documented with evidence, priorities, and remediation guidance. White-label delivery lets agencies incorporate security assessments into their offering and present reports under their own brand. Private vulnerability research programs use agreed validation criteria, rewards, and budget limits. Services are delivered remotely, with coordination in Spanish. Real Security. Real Impact.

No añadir “CISSP”, “CCNA”, credenciales vigentes, estrellas, nombres de ejecutivos o resultados cuantificados sin evidencia. Las imágenes aportadas corresponden a documentos individuales; por sí solas no demuestran certificación empresarial ni vigencia actual.

Datos confirmados: SECURIVA; Luca Dessena Maffucci; https://securiva.vercel.app/; dessenaluca53@gmail.com; +541126547874. Siguen pendientes para algunas fichas: sede legal publicable, figura jurídica, año de inicio, tamaño del equipo, correo corporativo y tarifa comercial aprobada.

## GEO y descubrimiento en IA

El trabajo consiste en publicar explicaciones claras, verificables y útiles que un buscador pueda entender y citar. Mantener autor responsable, fuentes primarias, actualización real, HTML accesible, enlaces internos y coherencia de marca entre sitio y perfiles.

Google mantiene los fundamentos de búsqueda para sus funciones generativas. No exige una marca especial para IA; la elegibilidad y el rastreo no garantizan citas. OAI-SearchBot, GPTBot y ChatGPT-User cumplen funciones distintas: búsqueda, entrenamiento y visitas iniciadas por el usuario, respectivamente.

Bing AI Performance incorporó Intents, Topics, Citation Share y Compare en junio de 2026. Topics Portfolio Beta se anunció el 13/10/2026; puede no aparecer si el sitio tiene pocos datos. Usar esos reportes si están disponibles, conservando su condición de preview/beta y sus límites.

## Dominio y mantenimiento

Mantener canonicals en el origen de Vercel mientras securiva.com no esté adquirido y funcionando. Al migrar: configurar dominio y HTTPS, redirecciones permanentes, canonicals, sitemap, perfiles y referencias propias; verificar ambas propiedades y comprobar rutas. No cambiar fechas de actualización sin modificar sustancialmente el contenido.

Revisión semanal: errores de indexación, solicitudes recibidas, fuentes y enlaces rotos. Revisión mensual: consultas por país/intención, recursos usados, calidad de leads y ventas. No ampliar la cantidad de páginas como fin en sí mismo.

## Fuentes principales

- [Google: fundamentos de búsqueda](https://developers.google.com/search/docs/essentials).
- [Google: políticas de spam, enlaces y páginas puerta](https://developers.google.com/search/docs/essentials/spam-policies).
- [Google: guía de optimización para funciones generativas](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide).
- [Google: funciones de IA y tu sitio](https://developers.google.com/search/docs/appearance/ai-features).
- [OpenAI: documentación de crawlers](https://developers.openai.com/api/docs/bots).
- [Bing: ampliación de AI Performance, junio de 2026](https://blogs.bing.com/search/2026/6/New-AI-Visibility-Insights-in-Bing-Webmaster-Tools-Intents-Topics-Citation-Share-Compare/).
- [Bing: Topics Portfolio Beta, octubre de 2026](https://blogs.bing.com/webmaster/2026/10/introducing-topics-portfolio-beta-in-ai-performance/).

Las fuentes y requisitos de cada oportunidad están junto a su registro JSON. La investigación no incluye mensajes enviados, compras, ni altas publicadas por el agente investigador. Registrar cualquier ejecución posterior con su evidencia real.
