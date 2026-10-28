# SECURIVA

Landing local en React + Vite. Dirección editorial: «Lo invisible, a la vista». La etapa actual se centra en diseño e interacción; SEO/GEO y páginas geográficas quedan para la segunda etapa.

## Ejecutar

Node.js 20.18 o superior.

```sh
npm install
npm run dev
npm test
npm run build
npm run preview
```

## Experiencia actual

- Portada editorial con escultura líquida en movimiento desde la entrada, respuesta al cursor y composición que se desplaza con el scroll.
- Franja de marcas cuya relación y autorización de uso fueron confirmadas por el usuario; nombres tipográficos en movimiento continuo.
- Arquitectura isométrica real en Three.js: WEB, gateway API, servidor de datos y perímetro. Una transformación continua controlada por el scroll conecta superficie, ruta de ataque ilustrativa, evidencia y retest.
- Geometría biselada, materiales físicos, iluminación de entorno, reflejos y sombras. Cada desplazamiento abre la puerta, separa las capas de la API, extrae evidencia y recompone el sistema. Volver atrás recorre las mismas poses intermedias.
- Arquitectura y servicios avanzan y retroceden con el scroll. Cada escena se fija durante un recorrido breve solo si cabe completa en la pantalla; los botones permiten saltar a una etapa. En pantallas bajas, el arte continúa en movimiento y la selección permanece manual para poder leer todo el contenido y alcanzar el CTA.
- Tres servicios presentados como fichas editoriales superpuestas: pentesting en marfil, bug bounty en azul y white label en grafito. Cada una tiene una escena isométrica propia con movimiento continuo: inspección de un núcleo por capas, validación de un cartucho de evidencia y cambio de identidad sobre un informe cuyo contenido técnico permanece. Las fichas avanzan y retroceden con el scroll y mantienen un CTA contextual. Navegación compacta, foco visible y paneles inactivos fuera del teclado.
- Informe white label cuya identidad cambia con el scroll, con comparación manual por ratón, tacto y teclado.
- Metodología con una plataforma isométrica 3D propia y un encuadre protagonista: perímetro hexagonal, núcleo por capas, escáner óptico, cartucho de evidencia, reporte articulado y sello de retest. La investigación abre y desplaza las capas; la demostración extrae el cartucho sobre guías y levanta el reporte; el retest recompone el núcleo. Acero satinado cepillado, cantos pulidos, vidrio oscuro, iluminación y sombras acompañan la transformación continua y reversible.
- El proceso queda fijo durante un recorrido breve (1,3 alturas de pantalla en escritorio; 1,1 en móvil). Los cuatro pasos y entregables siguen el scroll. En pantallas bajas pasa a lectura natural y la transformación concluye mientras la escena completa sigue visible; sus controles mantienen la selección manual.
- Carrusel de reseñas implementado. `approvedReviews` está vacío: la maqueta identifica los espacios reservados y no atribuye opiniones ficticias.
- Credenciales profesionales con documentos originales, abanico ligado al scroll y cierre con wordmark de partículas.
- Formulario que valida y prepara un brief para WhatsApp o correo. El visitante revisa y envía; no hay envío automático ni backend.

El movimiento está activo desde la carga, sin interruptor. La escena 3D se descarga al acercarse al viewport. Su progreso pasa directamente del scroll al renderer mediante una referencia, sin renderizar React en cada frame. El renderer suaviza una sola vez ese progreso y muestrea curvas continuas y reversibles. Solo dibuja cuando cambia la pose o la cámara, mientras está visible y la pestaña en primer plano; limita resolución y frecuencia en móvil. Incluye fallback SVG y aislamiento de errores de carga. Fuentes e imágenes alojadas localmente.

Las tres escenas de servicios tienen ciclos mecánicos propios de 10–12 segundos y una contribución suave del scroll. Su renderer se inicializa cuando la ficha está activa y a la vista. Solo esa ficha mantiene un bucle de animación; las demás conservan su última imagen y reanudan su reloj sin saltos al volver. Límite de 30 fps en móvil, resolución acotada, sombras de menor tamaño y fallback SVG independiente ante un fallo de WebGL. Cada escena libera sus propios materiales, geometrías y texturas al desmontarse.

## Componentes de 21st.dev

Se incorporó código real de estos componentes, conservando atribución MIT:

- [Liquid Sculpture Hero](https://21st.dev/@gughigug/components/liquid-sculpture-hero), Guglielmo Giannattasio. Motor WebGL2 aislado en `src/vendor/liquid-particles.ts`, adaptación visual en `LiquidArt.jsx`. Imagen original del componente en `public/art/liquid-sculpture.webp`.
- [Halftone Wordmark Footer](https://21st.dev/@kedhareswer/components/halftone-wordmark-footer), Kedhareswer Naidu. Adaptación en `EditorialFooter.tsx`.

Avisos de licencia distribuidos en `public/THIRD-PARTY-LICENSES.txt`. La arquitectura isométrica es una implementación propia con Three.js; el motor de la escultura líquida usa WebGL2 directamente.

## Archivos activos

- `src/App.jsx`: narrativa y estructura.
- `src/editorial.css`: sistema visual y responsive.
- `src/hooks/useEditorialMotion.js`: entradas, parallax de portada y cierre.
- `src/components/ServiceGallery.jsx`: escena de servicios ligada al scroll.
- `src/components/ServiceScene.jsx`, `ServiceSceneFallback.jsx` y `src/vendor/service-scenes.js`: renderizado y tres modelos físicos de servicios.
- `src/vendor/service-choreography.js`: ciclos mecánicos periódicos y combinación con el progreso del scroll.
- `src/components/SecurityArchitecture.jsx`: narrativa y controles de la arquitectura.
- `src/components/IsometricSecurity.jsx` y `src/vendor/isometric-scene.js`: renderer y geometría 3D.
- `src/hooks/useArchitectureScroll.js` y `src/vendor/security-choreography.js`: progreso compartido, controles y curvas de transformación continua.
- `src/components/SecurityProcess.jsx` y `SecurityProcess.css`: proceso sticky, controles y entregables adaptables.
- `src/hooks/useProcessScroll.js`, `src/vendor/process-scene.js` y `process-choreography.js`: progreso del proceso, geometría física y curvas continuas.
- `src/components/ProcessFallback.jsx`: alternativa SVG durante la carga o si WebGL no está disponible.
- `src/components/TrustStrip.jsx`, `ClientVoices.jsx` y `src/data/socialProof.js`: marcas y reseñas.
- `src/components/AgencyReveal.jsx`: comparador white label.
- `src/components/CredentialPasses.jsx`: pases y documentos.
- `src/components/LiquidArt.jsx`: escultura y fallback.
- `src/components/EditorialFooter.tsx`: partículas del wordmark.
- `src/components/ContactDialog.jsx`: formulario y brief.
- `src/config.js`: canales confirmados.

La versión anterior se respaldó en `work/before-editorial-*`. Los archivos antiguos que ya no importa `main.jsx` no forman parte del bundle activo.

## Contacto y contenido

Correo: dessenaluca53@gmail.com. WhatsApp: +54 11 2654 7874. El formulario no guarda datos personales en almacenamiento local.

Los certificados pertenecen a Luca Dessena Maffucci. Se presentan las fechas de los documentos aportados: OSCP+ (2021), CPTS (2022) e ISC2 CC (ciclo 2023–2025). ISC2 CC no es CISSP. La vigencia actual debe confirmarse antes de anunciar credenciales activas. No se incluyó CCNA porque no se aportó documento. El informe es ilustrativo y no muestra datos de clientes. No se publican los precios hipotéticos del manual.

## Publicación y segunda etapa

La página permanece local y contiene `noindex, nofollow`. Para la segunda etapa quedan dominio, indexación, canonical, imagen social, contenido y datos estructurados SEO/GEO. No se crearon páginas por ciudad.

## Verificación

`node --test tests/security-choreography.test.mjs tests/process-choreography.test.mjs`: once pruebas de continuidad de posición y velocidad, reversibilidad, valores límite y poses mecánicas; incluye los límites reales de la geometría en 101 poses de escritorio y móvil. El proceso se revisó con pin a 1200×850, 390×844 y 320×640, y en lectura natural a 390×550. El progreso fraccionario avanza y retrocede dentro de un mismo capítulo. El renderer conserva una sola instancia de canvas y no reinicia su reloj al cambiar el texto.

`node --test tests/service-choreography.test.mjs`: cinco pruebas adicionales para movimiento sin scroll, continuidad del ciclo y su velocidad, orden de validación del hallazgo, separación de las cubiertas y límites de la geometría real. Las fichas se revisaron a 1200×850 y 390×844: solo la visible mantiene su reloj; todas se pausan al salir de servicios. Las tres escenas usan entre 26 y 36 meshes cada una y comparten el código de Three.js en un único chunk diferido.

`npm run build` correcto. Revisión visual del avance y retroceso con scroll, botones de salto, proceso 3D fijo, reveal white label y control manual, apertura de certificados y CTA contextual de contacto. Sin desbordamiento horizontal ni errores de consola observados. El envío de mensajes no se ejecutó durante las pruebas. Vite avisa del tamaño del chunk 3D, que se descarga de forma diferida al acercarse a la escena.
