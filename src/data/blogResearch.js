// Original editorial guidance and didactic examples. References support technical principles;
// no client outcomes, universal prices, or active credential claims are implied.
export const researchBlogPosts = [
  {
    "path": "/blog/bug-bounty-privado-o-pentest",
    "kind": "resource",
    "label": "Elegir una evaluación",
    "title": "Bug bounty privado o pentest.",
    "emphasis": "La decisión empieza por el objetivo.",
    "description": "Compara pentesting con alcance definido e investigación privada: cobertura, presupuesto, reglas, entregables y preparación del equipo antes de contratar.",
    "summary": "Una fecha de lanzamiento, un requisito de un cliente y una investigación continua plantean decisiones distintas. Esta guía propone preguntas concretas para elegir cómo evaluar una aplicación sin confundir cobertura, recompensas y resultados.",
    "category": "Bug bounty",
    "readingMinutes": 5,
    publishedAt:'2026-10-28', updatedAt:'2026-10-28',
    "sections": [
      {
        "id": "pregunta-correcta",
        "title": "Primero, la pregunta que necesitas resolver",
        "paragraphs": [
          "Imagina una agencia que está por entregar un portal de clientes. Necesita saber qué se revisará, cuándo recibirá el informe y qué tiempo tendrá su equipo para corregir. Ahora imagina un SaaS estable que quiere recibir investigación adicional sobre funciones nuevas. Ambos necesitan autorización y seguimiento, pero no necesariamente el mismo contrato. La decisión debe partir del trabajo que el negocio puede organizar después del hallazgo.",
          "Conviene escribir el objetivo en una frase verificable: evaluar los permisos de tres roles antes de una entrega, revisar las integraciones de una API o investigar caminos de impacto dentro de un presupuesto. “Queremos que esté seguro” es una intención razonable, pero todavía no describe una evaluación que pueda cotizarse o comprobarse."
        ]
      },
      {
        "id": "pentest",
        "title": "Qué aporta un pentest con alcance definido",
        "paragraphs": [
          "En un pentest se acuerdan activos, técnicas permitidas, accesos, ventanas y entregables para un periodo concreto. NIST SP 800-115 sitúa la planificación y el análisis de resultados dentro de una evaluación técnica. En una contratación comercial, esa base permite comparar propuestas por cobertura y profundidad, además del precio. El contrato debe decir qué sucede si faltan cuentas o un entorno queda inaccesible.",
          "Para la agencia, resulta especialmente útil cuando existe una entrega o un conjunto de controles que revisar. El informe debería distinguir lo evaluado, las limitaciones y los hallazgos reproducibles. Que una prueba termine sin hallazgos no equivale a demostrar que no existe ninguna vulnerabilidad; debe poder explicarse qué trabajo se realizó durante ese alcance."
        ]
      },
      {
        "id": "investigacion-privada",
        "title": "Qué cambia en la investigación privada",
        "paragraphs": [
          "Un programa privado limita quién participa y bajo qué reglas. Puede establecer recompensas por reportes elegibles y validados, además de costes de operación acordados. Su economía no debe resumirse como “solo pagas si encuentran algo” sin revisar el contrato: recepción, análisis, coordinación y retest también requieren trabajo. El comprador necesita saber qué está incluido y qué consume el presupuesto.",
          "La documentación de Bugcrowd relaciona la elegibilidad del hallazgo con el alcance y la posibilidad de reproducirlo. Ese principio es útil al diseñar reglas propias, aunque las condiciones de una plataforma no se trasladan automáticamente a otro programa. Una política debe resolver desde el inicio duplicados, activos excluidos, evidencias mínimas y comunicación con los participantes."
        ]
      },
      {
        "id": "capacidad",
        "title": "La capacidad de respuesta también decide",
        "paragraphs": [
          "Antes de invitar investigadores, identifica quién recibe reportes, quién confirma el impacto y quién puede corregir. Un buzón sin responsable genera incertidumbre incluso si la investigación es buena. En una agencia, acuerda además quién habla con el cliente final y quién tiene autoridad para aprobar una prueba sobre sus sistemas. Revender el servicio no sustituye ese permiso.",
          "Una revisión acotada puede ser el primer paso si todavía no hay inventario, cuentas de prueba o un proceso de corrección. Después, una investigación privada puede ampliar la búsqueda sobre funciones estables. La secuencia depende de la preparación real del equipo, no de que un modelo suene más avanzado. El marco de madurez de HackerOne es una referencia para pensar consistencia en la gestión."
        ]
      },
      {
        "id": "comparacion",
        "title": "Cinco puntos para comparar propuestas",
        "items": [
          {
            "title": "Cobertura",
            "text": "Pide una lista de aplicaciones, APIs, roles y flujos incluidos. Pregunta qué se revisará aunque no aparezca un hallazgo."
          },
          {
            "title": "Presupuesto",
            "text": "Separa coste de ejecución u operación, fondo de recompensas, retest y ampliaciones. Confirma moneda, impuestos aplicables y aprobación de cambios."
          },
          {
            "title": "Calendario",
            "text": "Define inicio, disponibilidad de accesos, comunicación de hallazgos urgentes y entrega. La investigación abierta no debe interpretarse como cobertura completa en una fecha."
          },
          {
            "title": "Criterios",
            "text": "Acuerda cómo se validan impacto, severidad y duplicados. Establece un mecanismo para revisar desacuerdos con evidencia."
          },
          {
            "title": "Cierre",
            "text": "Aclara qué se entrega cuando hay hallazgos y cuando no los hay, y cómo se documentan correcciones pendientes o no verificadas."
          }
        ]
      },
      {
        "id": "brief",
        "title": "Una decisión que puedes llevar a una reunión",
        "paragraphs": [
          "Prepara un breve documento con el evento que motiva la evaluación, las funciones prioritarias y la disponibilidad de quienes deben corregir. Añade el límite de presupuesto y las restricciones de operación. Pide al proveedor que explique qué modelo recomienda para ese contexto y qué no podrá concluir con él. Esa respuesta aporta más información que comparar nombres de paquetes.",
          "En la oferta de investigación privada de SECURIVA, las pruebas las ejecuta SECURIVA sobre el alcance autorizado. El modelo combina una activación fija, un componente variable por hallazgos elegibles y validados, y un tope de presupuesto aprobado antes de comenzar. No implica abrir un marketplace ni incorporar automáticamente una comunidad externa. Las referencias a plataformas de este artículo sirven para comparar formas de gestionar investigación. Puedes usar la herramienta de preparación para ordenar activos, roles y entregables; después se acuerdan las condiciones concretas, responsables y siguiente paso."
        ]
      }
    ],
    "faq": [
      {
        "question": "¿Un bug bounty reemplaza siempre al pentest?",
        "answer": "No. Son formas de organizar investigación con objetivos y condiciones que pueden complementarse. Compara cobertura comprometida, calendario y capacidad de respuesta, y confirma las condiciones por escrito."
      },
      {
        "question": "¿Privado significa que los hallazgos pueden publicarse?",
        "answer": "No. Participación, confidencialidad y divulgación son decisiones distintas. La publicación requiere seguir la autorización y los acuerdos del programa; no debe deducirse del nombre comercial."
      }
    ],
    "references": [
      {
        "label": "NIST SP 800-115: planificación y evaluación técnica",
        "url": "https://csrc.nist.gov/pubs/sp/800/115/final"
      },
      {
        "label": "Bugcrowd: condiciones para recibir recompensas",
        "url": "https://docs.bugcrowd.com/researchers/receiving-rewards/getting-rewarded/"
      },
      {
        "label": "HackerOne: marco de madurez de bug bounty",
        "url": "https://docs.hackerone.com/en/articles/14048481-bug-bounty-maturity-framework"
      }
    ],
    "relatedPaths": [
      "/bug-bounty-privado",
      "/pentesting-web",
      "/preparar-pentest",
      "/blog/presupuesto-recompensas-bug-bounty"
    ]
  },
  {
    "path": "/blog/cvss-severidad-impacto-negocio",
    "kind": "resource",
    "label": "Priorizar con contexto",
    "title": "CVSS, severidad e impacto.",
    "emphasis": "Tres conversaciones que deben conectarse.",
    "description": "Cómo leer un informe de pentesting: puntuación CVSS, contexto del activo y decisión de corrección sin confundir severidad técnica con riesgo del negocio.",
    "summary": "Una puntuación ayuda a describir una vulnerabilidad, pero la decisión de negocio también necesita exposición, datos, responsables y alternativas. Este método permite convertir un número en una prioridad defendible.",
    "category": "Gestión",
    "readingMinutes": 5,
    publishedAt:'2026-10-28', updatedAt:'2026-10-28',
    "sections": [
      {
        "id": "numero",
        "title": "Qué describe la puntuación",
        "paragraphs": [
          "CVSS comunica características y severidad de vulnerabilidades. FIRST mantiene la especificación de la versión 4.0 y distingue grupos Base, Threat, Environmental y Supplemental. Por eso, recibir solo un número deja preguntas abiertas: qué versión se usó, qué métricas lo produjeron y qué información del entorno se tuvo en cuenta. Un informe útil conserva esa trazabilidad.",
          "No conviene traducir el resultado directamente a dinero perdido, probabilidad de incidente o fecha obligatoria de corrección. Son decisiones diferentes. El número necesita una explicación legible: qué puede hacer un actor, qué condiciones requiere y qué consecuencia técnica se comprobó. Sin esa descripción, dos personas pueden interpretar de manera distinta la misma etiqueta “alta”."
        ]
      },
      {
        "id": "leer-vector",
        "title": "Cómo revisar el dato sin discutir etiquetas",
        "paragraphs": [
          "Pide la versión y el vector junto a la justificación de las métricas. En CVSS 4.0, los grupos de amenaza y entorno permiten reflejar información adicional relevante; las métricas suplementarias aportan contexto sin modificar el resultado final del esquema CVSS-BTE. Esta distinción evita presentar una observación de negocio como si hubiera cambiado automáticamente la puntuación.",
          "Cuando falta información, registra la incertidumbre. Por ejemplo: se comprobó acceso indebido a un registro de prueba, pero no se evaluó el conjunto de datos de producción. La acción siguiente puede ser confirmar con el propietario qué clase de información contiene ese sistema, sin extraer datos reales innecesariamente. El informe debe separar evidencia, supuesto y decisión pendiente."
        ]
      },
      {
        "id": "escenario",
        "title": "Un ejemplo para la conversación de negocio",
        "paragraphs": [
          "Considera un escenario didáctico: una aplicación permite que un usuario consulte un documento asignado a otra cuenta de prueba. La descripción técnica registra la falta de autorización. Producto debe explicar si el mismo flujo se utiliza para documentos públicos, archivos internos o información de clientes. Esa diferencia orienta la prioridad y las personas que deben intervenir, aunque no autoriza a asumir una filtración real.",
          "La reunión puede producir tres tareas: corregir la regla de acceso, revisar otros puntos donde se reutiliza y comprobar qué datos estuvieron expuestos. Si aparecen indicios de acceso no autorizado real, el asunto requiere el proceso de respuesta a incidentes correspondiente. Una evaluación de seguridad no reemplaza una investigación de incidentes ni permite afirmar que hubo uno."
        ]
      },
      {
        "id": "decision",
        "title": "Una ficha de prioridad de una página",
        "items": [
          {
            "title": "Hecho comprobado",
            "text": "Resume la acción no permitida, el recurso afectado y la evidencia disponible. Evita incorporar consecuencias que la prueba no demostró."
          },
          {
            "title": "Contexto del activo",
            "text": "Indica quién usa la función, qué datos procesa y cómo se expone. El propietario de negocio debe validar esta parte."
          },
          {
            "title": "Condiciones y controles",
            "text": "Registra accesos necesarios, limitaciones observadas y mitigaciones existentes. Un control temporal debe comprobarse antes de reducir la urgencia."
          },
          {
            "title": "Decisión de tratamiento",
            "text": "Asigna corrección, mitigación, investigación adicional o aceptación documentada por quien tenga autoridad. Incluye fecha de revisión."
          },
          {
            "title": "Criterio de cierre",
            "text": "Describe qué evidencia mostrará que el comportamiento inseguro dejó de estar disponible y qué pruebas de regresión deberán mantenerse."
          }
        ]
      },
      {
        "id": "prioridad-operativa",
        "title": "Ordenar el trabajo requiere otra capa",
        "paragraphs": [
          "CISA propone SSVC como modelo de decisiones que considera el contexto de explotación y sus consecuencias para una organización. Es una referencia para pensar respuesta, no una obligación automática para todas las empresas de Argentina o México. Si ya existe una política interna, úsala de forma consistente y documenta cómo se relaciona con las puntuaciones del proveedor.",
          "Para componentes conocidos, también puede revisarse si hay explotación documentada por fuentes pertinentes. Esa señal tiene un propósito distinto de la severidad técnica. Una vulnerabilidad propia sin identificador público tampoco debe ignorarse por no figurar en un catálogo. La evidencia interna y la importancia del flujo siguen siendo parte de la decisión."
        ]
      },
      {
        "id": "agencias",
        "title": "Qué comunicar desde una agencia",
        "paragraphs": [
          "Presenta al cliente una decisión y su fundamento: qué se sabe, qué falta confirmar, quién corrige y cuándo se revisará. Conserva la puntuación técnica sin convertirla en un argumento comercial alarmista. Si el equipo considera que el contexto modifica la prioridad, registra la razón y al responsable que la aprobó. Así el seguimiento puede continuar cuando cambien las personas.",
          "En SECURIVA buscamos que el informe facilite esa conversación entre desarrollo y negocio. La etiqueta de severidad debe acompañarse de evidencia y recomendaciones aplicables. El siguiente paso comercial es acordar qué sistemas revisar y qué responsables participarán; el siguiente paso técnico es poder comprobar cada conclusión del informe."
        ]
      }
    ],
    "faq": [
      {
        "question": "¿CVSS es lo mismo que el riesgo total de mi empresa?",
        "answer": "No. Describe severidad con un esquema técnico. La evaluación de riesgo y la decisión de tratamiento necesitan contexto organizacional, exposición, consecuencias y criterios propios."
      },
      {
        "question": "¿Debo comparar directamente puntuaciones de versiones distintas?",
        "answer": "No asumas equivalencia. Conserva versión, vector y explicación de cada evaluación. Si necesitas compararlas para una política, acuerda un método de interpretación consistente."
      }
    ],
    "references": [
      {
        "label": "FIRST: especificación CVSS 4.0",
        "url": "https://www.first.org/cvss/v4.0/specification-document"
      },
      {
        "label": "FIRST: guía de uso CVSS 4.0",
        "url": "https://www.first.org/cvss/v4.0/user-guide"
      },
      {
        "label": "CISA: guía SSVC",
        "url": "https://www.cisa.gov/sites/default/files/publications/cisa-ssvc-guide%20508c.pdf"
      }
    ],
    "relatedPaths": [
      "/pentesting-web",
      "/blog/plan-30-dias-despues-pentest",
      "/blog/presupuesto-recompensas-bug-bounty"
    ]
  },
  {
    "path": "/blog/presupuesto-recompensas-bug-bounty",
    "kind": "resource",
    "label": "Reglas antes de investigar",
    "title": "Un presupuesto de bug bounty.",
    "emphasis": "Sin zonas grises al validar.",
    "description": "Organiza coste operativo, fondo de recompensas, elegibilidad, severidad y duplicados en un programa privado, sin tarifas universales ni presupuestos abiertos.",
    "summary": "Una tabla de recompensas solo funciona cuando el programa define qué se acepta, cómo se valora y quién aprueba el gasto. Esta plantilla de decisiones ayuda a acordar un presupuesto controlable antes de comenzar.",
    "category": "Bug bounty",
    "readingMinutes": 5,
    publishedAt:'2026-10-28', updatedAt:'2026-10-28',
    "sections": [
      {
        "id": "capas",
        "title": "Separa tres decisiones económicas",
        "paragraphs": [
          "El presupuesto de un programa privado puede incluir operación, recompensas y trabajo posterior. La operación comprende lo que el contrato acuerde para preparar alcance, recibir reportes, validarlos y coordinar respuestas. Las recompensas corresponden a hallazgos elegibles según las reglas. La corrección de software y el retest pueden formar parte de otro alcance. Separarlos evita que una cifra aparente cubrir tareas que nadie presupuestó.",
          "No existe una tarifa universal que convierta cada categoría de severidad en el mismo importe para todas las empresas. El comprador debe considerar su capacidad, superficie, atractivo del alcance y el valor que espera recibir. Copiar la tabla de una gran plataforma no demuestra que sea sostenible para una agencia ni suficiente para atraer investigación pertinente."
        ]
      },
      {
        "id": "hoja",
        "title": "La hoja de presupuesto que sí necesitas",
        "items": [
          {
            "title": "Operación acordada",
            "text": "Registra importe, moneda, periodo, tareas incluidas y límites. Identifica qué se cobra aunque no aparezcan reportes elegibles y qué requiere una ampliación."
          },
          {
            "title": "Fondo de recompensas",
            "text": "Establece una tabla aprobada o rangos con criterios de asignación. Distingue importe comprometido, disponible y efectivamente pagado."
          },
          {
            "title": "Tope y autorización",
            "text": "Define quién puede aprobar gasto adicional, qué sucede cerca del límite y cómo se comunica una pausa a los investigadores sin modificar reportes ya recibidos arbitrariamente."
          },
          {
            "title": "Seguimiento",
            "text": "Acorda validación, comunicación, retest y cierre. Un pago pendiente por aprobación no debe confundirse con un reporte técnicamente inválido."
          }
        ]
      },
      {
        "id": "elegibilidad",
        "title": "Define el trabajo que puede recibir recompensa",
        "paragraphs": [
          "La política necesita activos concretos, participantes autorizados, técnicas permitidas y exclusiones comprensibles. Para cada reporte, pide evidencia reproducible, impacto explicado y un canal de comunicación. La documentación de Bugcrowd vincula la validez al alcance del programa y a su reproducción; esa referencia ayuda a distinguir una sospecha de un hallazgo que puede evaluarse.",
          "Las reglas también deben aclarar qué ocurre con datos sensibles, servicios de terceros y situaciones que exijan detener la prueba. No conviertas la necesidad de una evidencia en una invitación a ampliar el acceso o extraer información de clientes. Acuerda la demostración mínima suficiente y un procedimiento para consultar antes de continuar cuando el impacto pueda aumentar."
        ]
      },
      {
        "id": "severidad",
        "title": "La severidad necesita criterios y revisión",
        "paragraphs": [
          "La tabla puede usar categorías técnicas y una explicación de impacto para el negocio. El programa debe definir cómo se asigna la categoría y quién revisa una discrepancia. Las normas de HackerOne son una referencia de consistencia para su plataforma; si se diseña un programa independiente, sus reglas comerciales no se vuelven obligatorias por citarlas.",
          "Incluye ejemplos didácticos del tipo de evidencia que cambia una decisión, sin prometer recompensas por situaciones ambiguas. Un reporte puede demostrar una consecuencia adicional que justifique revisarlo. La respuesta debe explicar qué información se consideró y qué regla se aplicó. Cambiar el criterio después de recibir un hallazgo deteriora la confianza y vuelve impredecible el coste."
        ]
      },
      {
        "id": "duplicados",
        "title": "No todo lo parecido es el mismo hallazgo",
        "paragraphs": [
          "La deduplicación requiere comparar causa, ruta afectada y corrección necesaria. Dos URLs con el mismo fallo pueden compartir una corrección; dos problemas de autorización de aspecto similar pueden requerir cambios independientes. Agrupar todo por una etiqueta amplia, como “control de acceso”, no basta para demostrar que sea el mismo problema.",
          "Propón una regla explícita: al marcar un duplicado, vincular el registro previo de manera compatible con la confidencialidad y explicar la relación entre causas y remedios. Define cómo se reconocerá evidencia nueva que cambie el impacto o revele otra corrección necesaria. El marco de madurez de HackerOne contempla consistencia en recompensas y duplicados; sirve para revisar la calidad del proceso."
        ]
      },
      {
        "id": "simulacion",
        "title": "Prueba las reglas antes del lanzamiento",
        "paragraphs": [
          "Haz una simulación de mesa con reportes ficticios: uno válido, uno fuera de alcance, dos aparentemente duplicados y uno que llegue cuando el fondo esté próximo al límite. Pide a dos responsables que apliquen las reglas por separado. Si las decisiones difieren, el documento necesita precisión antes de invitar participantes. Esta prueba verifica la operación sin tocar sistemas reales.",
          "En el servicio de investigación privada de SECURIVA, el trabajo lo realiza SECURIVA: se acuerdan una activación fija, un componente variable por hallazgos elegibles y validados, y un presupuesto máximo aprobado antes de comenzar. Esta oferta no supone operar una plataforma abierta ni reclutar investigadores externos. Los ejemplos sobre políticas de programas ayudan a precisar las reglas del contrato. El resultado útil para la agencia es una hoja de presupuesto, criterios de validación y responsables identificados, con las condiciones de seguimiento acordadas."
        ]
      }
    ],
    "faq": [
      {
        "question": "¿Puedo fijar un presupuesto máximo?",
        "answer": "Sí, debe acordarse cómo funciona, quién lo controla y qué ocurre al alcanzarlo. También hay que preservar el tratamiento de reportes ya recibidos según las reglas aplicables."
      },
      {
        "question": "¿Los duplicados nunca aportan valor?",
        "answer": "No necesariamente. Un reporte puede incluir evidencia adicional relevante. La política debe explicar cómo se decide y cómo se reconoce ese aporte, sin asumir que todo reporte similar merece el mismo tratamiento."
      }
    ],
    "references": [
      {
        "label": "Bugcrowd: elegibilidad y recompensas",
        "url": "https://docs.bugcrowd.com/researchers/receiving-rewards/getting-rewarded/"
      },
      {
        "label": "HackerOne: estándares detallados de plataforma",
        "url": "https://docs.hackerone.com/en/articles/8369826-detailed-platform-standards"
      },
      {
        "label": "HackerOne: madurez y consistencia de programas",
        "url": "https://docs.hackerone.com/en/articles/14048481-bug-bounty-maturity-framework"
      }
    ],
    "relatedPaths": [
      "/bug-bounty-privado",
      "/recursos/presupuesto-bug-bounty-privado",
      "/blog/bug-bounty-privado-o-pentest"
    ]
  },
  {
    "path": "/blog/plan-30-dias-despues-pentest",
    "kind": "resource",
    "label": "Del informe a las decisiones",
    "title": "Los primeros 30 días.",
    "emphasis": "Después del pentest empieza el seguimiento.",
    "description": "Plan práctico para convertir un informe de pentesting en responsables, correcciones, retest y decisiones documentadas durante el primer mes.",
    "summary": "Un informe no se cierra al guardarlo en una carpeta. Este plan organiza recepción, prioridades, correcciones y verificación. Los 30 días son una referencia de coordinación, no un plazo seguro para dejar pendientes todos los hallazgos.",
    "category": "Gestión",
    "readingMinutes": 5,
    publishedAt:'2026-10-28', updatedAt:'2026-10-28',
    "sections": [
      {
        "id": "recepcion",
        "title": "Al recibirlo: confirmar y escalar",
        "paragraphs": [
          "Primero confirma que el informe corresponde a los sistemas, versiones y fechas acordados. Revisa quién lo recibió y dónde se almacenará. Los detalles técnicos pueden incluir información sensible: comparte cada parte con quienes necesitan actuar. Una presentación ejecutiva no requiere distribuir a toda la organización la evidencia completa ni los datos usados durante las pruebas.",
          "No esperes a terminar el mes para atender un hallazgo urgente. Si la evaluación revela una exposición que requiere contención inmediata, involucra al responsable operativo y acuerda la acción. Si existen indicios de un incidente real, activa el procedimiento correspondiente; un pentest describe pruebas autorizadas y no reemplaza por sí mismo la investigación de actividad previa."
        ]
      },
      {
        "id": "semana-uno",
        "title": "Primera semana: transformar hallazgos en trabajo",
        "paragraphs": [
          "Abre un registro por problema con identificador, responsable, sistema afectado y decisión pendiente. Incluye una referencia controlada al informe, la consecuencia comprobada y la recomendación. Separa fallos reproducidos, observaciones y partes que no pudieron evaluarse. De ese modo, un bloqueo de acceso no acaba tratado como “sin vulnerabilidades” y una recomendación general no se confunde con una explotación demostrada.",
          "La guía de reporting de OWASP resulta útil para revisar si el informe comunica contexto y resultados de forma utilizable. Para la gestión diaria, convierte esa información en tareas pequeñas: confirmar comportamiento esperado, elegir una corrección, estimar dependencias y acordar criterio de cierre. El ticket debe permitir que otra persona continúe el trabajo sin reinterpretar el PDF entero."
        ]
      },
      {
        "id": "semana-dos",
        "title": "Segunda semana: corregir la causa y revisar dependencias",
        "paragraphs": [
          "Una corrección puede afectar más de un equipo. Si un permiso se decide en un servicio compartido, cambiar una pantalla no demuestra que el control se haya aplicado en el servidor. Pide al equipo que identifique el punto responsable de la decisión y los otros flujos que lo usan. Documenta qué cambia y cómo se desplegará para poder verificar la versión correcta.",
          "NIST SSDF incluye la atención de causas para reducir recurrencias. En este plan, la pregunta operativa es qué hizo posible el fallo: requisito ausente, regla dispersa, configuración, dependencia o revisión insuficiente. La respuesta debe producir una mejora concreta, como un caso de prueba o una revisión de diseño. No hace falta convertir cada hallazgo en una reescritura del producto."
        ]
      },
      {
        "id": "semana-tres",
        "title": "Tercera semana: comprobar el resultado",
        "paragraphs": [
          "El retest necesita la corrección desplegada, accesos vigentes y el alcance de verificación acordado. Relaciona cada resultado con el hallazgo original. “El desarrollador terminó la tarea” y “el comportamiento quedó verificado” son estados distintos. Si un sistema no estuvo disponible, el registro debe decir no verificado, con el motivo y el siguiente intento previsto.",
          "Comprobar la corrección incluye observar que la función permitida siga funcionando. En un escenario didáctico de permisos, el usuario autorizado debe conservar su acceso y el no autorizado debe recibir la respuesta prevista. Usa cuentas y datos de prueba definidos. La revisión no necesita extraer información real para demostrar un límite que puede comprobarse de forma controlada."
        ]
      },
      {
        "id": "semana-cuatro",
        "title": "Cuarta semana: decidir lo que sigue abierto",
        "items": [
          {
            "title": "Corregido y verificado",
            "text": "Conserva evidencia del resultado, versión y fecha. Asocia la prueba de regresión que ayudará a detectar una reintroducción."
          },
          {
            "title": "Mitigado temporalmente",
            "text": "Explica qué control reduce la exposición, quién lo comprobó y cuándo se revisará la corrección definitiva. La mitigación no debe etiquetarse como solución final sin fundamento."
          },
          {
            "title": "Pendiente por dependencia",
            "text": "Identifica propietario, bloqueo y próxima decisión. Si interviene un tercero, documenta el canal y evita asumir que la agencia puede modificar sus sistemas."
          },
          {
            "title": "Riesgo aceptado",
            "text": "Registra a la persona con autoridad, el motivo, las condiciones y la fecha de revisión. Aceptar no borra el hallazgo ni sustituye la decisión de negocio."
          }
        ]
      },
      {
        "id": "medir",
        "title": "El cierre que puede entender un cliente",
        "paragraphs": [
          "Prepara una hoja con el estado de los hallazgos, decisiones tomadas y asuntos que requieren intervención. Mide también antigüedad, bloqueos y tiempo hasta verificación; el número de tickets cerrados por sí solo oculta la importancia de cada problema. No conviertas un porcentaje de avance en una declaración de seguridad total del sistema.",
          "Para agencias, acuerda quién presenta ese cierre al cliente y qué parte se entrega bajo su marca. SECURIVA puede documentar los resultados de la evaluación y el retest contratado; desarrollo conserva la implementación de las correcciones salvo un acuerdo distinto. Un cierre claro deja evidencia útil para continuar, incluso cuando alguna acción dependa de otro calendario."
        ]
      }
    ],
    "faq": [
      {
        "question": "¿Todos los hallazgos pueden esperar 30 días?",
        "answer": "No. El plan organiza el seguimiento. La urgencia depende de la exposición, el impacto, la evidencia y las condiciones operativas; ciertos problemas pueden requerir actuar inmediatamente."
      },
      {
        "question": "¿Una corrección de código equivale a retest aprobado?",
        "answer": "No. Hay que comprobar la versión desplegada, el comportamiento y el alcance acordado. Si no se pudo verificar, debe registrarse ese estado sin presentarlo como cierre técnico."
      }
    ],
    "references": [
      {
        "label": "OWASP WSTG: elaboración de informes",
        "url": "https://wstg.owasp.org/stable/5-Reporting/README/"
      },
      {
        "label": "NIST SP 800-218: Secure Software Development Framework",
        "url": "https://csrc.nist.gov/pubs/sp/800/218/final"
      },
      {
        "label": "NIST: relación de SSDF con la operación y feedback",
        "url": "https://pages.nist.gov/nccoe-devsecops/mapping-ssdf.html"
      },
      {
        "label": "CISA: playbooks de respuesta a vulnerabilidades e incidentes",
        "url": "https://www.cisa.gov/sites/default/files/publications/Cybersecurity_Incident_Vulnerability_Response_Playbooks_508C.pdf"
      }
    ],
    "relatedPaths": [
      "/pentesting-web",
      "/seguridad-api",
      "/blog/cvss-severidad-impacto-negocio",
      "/white-label-ciberseguridad"
    ]
  },
  {
    "path": "/blog/seguridad-saas-roles-tenants-integraciones",
    "kind": "resource",
    "label": "Preparar una evaluación SaaS",
    "title": "Roles, tenants e integraciones.",
    "emphasis": "El mapa de seguridad de tu SaaS.",
    "description": "Prepara una evaluación SaaS con una matriz de roles, aislamiento entre clientes e integraciones: cuentas de prueba, límites y evidencias necesarias.",
    "summary": "Una aplicación multiempresa necesita distinguir qué puede hacer una persona, sobre qué recurso y dentro de qué organización. Este mapa ayuda a preparar una evaluación defensiva con cuentas autorizadas y datos controlados.",
    "category": "Gestión",
    "readingMinutes": 5,
    publishedAt:'2026-10-28', updatedAt:'2026-10-28',
    "sections": [
      {
        "id": "mapa",
        "title": "Dibuja los límites antes de probar",
        "paragraphs": [
          "Un tenant es una organización o cliente dentro de una plataforma compartida. No siempre coincide con una cuenta de usuario: una persona puede participar en varias organizaciones con permisos distintos. Por eso, una lista de pantallas no describe todos los límites importantes. El equipo debe explicar cómo se relacionan identidad, membresía, rol, recurso y acción.",
          "OWASP mantiene recomendaciones específicas para aplicaciones multitenant y señala la importancia del contexto de organización y su aislamiento. Para preparar una evaluación, convierte esa arquitectura en un mapa sencillo: quién pertenece a cada tenant, qué datos son propios, qué información se comparte de forma intencional y qué operaciones quedan reservadas a administración de plataforma."
        ]
      },
      {
        "id": "matriz",
        "title": "Construye una matriz con resultados esperados",
        "paragraphs": [
          "Utiliza un escenario didáctico con dos organizaciones de prueba, A y B. En A prepara un administrador, un operador y un usuario de lectura; en B, cuentas equivalentes si el alcance lo requiere. Define recursos ficticios identificables y acciones permitidas. El propósito es tener un resultado esperado que pueda compararse con el comportamiento real sin tocar información de otros clientes.",
          "Por ejemplo: lectura puede consultar un documento de A, operador puede modificarlo y administrador puede gestionar miembros. Ninguna de esas cuentas debe actuar sobre un documento privado de B por el solo hecho de conocer su referencia. Si el producto permite colaboración entre organizaciones, describe la excepción y cómo se otorga y revoca. La matriz necesita esas reglas de producto, no solo nombres de roles."
        ]
      },
      {
        "id": "objetos-funciones",
        "title": "Separa recursos y funciones",
        "paragraphs": [
          "OWASP API Security distingue la autorización sobre objetos de la autorización sobre funciones. Para una evaluación de SaaS, eso sugiere dos preguntas complementarias: si la persona puede acceder a ese recurso y si puede ejecutar esa acción. Una interfaz que oculta un botón no demuestra que el servicio aplique la decisión en todas las rutas.",
          "Incluye acciones como exportar, invitar miembros, gestionar integraciones o consultar registros administrativos solo cuando formen parte del alcance. La guía de autorización de OWASP recomienda comprobar permisos y mantener pruebas de la lógica. El trabajo del comprador es aportar los resultados esperados; el del evaluador es documentar lo observado dentro de las reglas autorizadas."
        ]
      },
      {
        "id": "ciclo",
        "title": "Revisa el ciclo de una relación, no solo el inicio",
        "paragraphs": [
          "El mapa debe representar lo que ocurre al cambiar de organización, modificar un rol, eliminar a un miembro o desactivar una integración. El acceso correcto al crear una cuenta no demuestra que una sesión antigua deje de ser válida cuando cambian sus permisos. Acordar estos estados permite evaluar el ciclo de vida sin improvisar acciones sobre usuarios reales.",
          "Añade procesos que trabajan fuera de la pantalla: exportaciones, tareas en segundo plano, archivos y comunicaciones entre servicios. Pregunta qué contexto de organización recibe cada proceso y cómo se comprobará que entrega su resultado al destinatario adecuado. El ejemplo de prueba puede usar archivos ficticios y una cola controlada, con limpieza prevista al finalizar."
        ]
      },
      {
        "id": "integraciones",
        "title": "Define hasta dónde llegan los permisos de prueba",
        "items": [
          {
            "title": "Servicio propio",
            "text": "Identifica APIs, credenciales de prueba y flujos que pertenecen al SaaS y están autorizados. Documenta propietario y entorno para cada activo."
          },
          {
            "title": "Proveedor externo",
            "text": "Usa el entorno de pruebas admitido y confirma sus condiciones. Que el SaaS integre un proveedor de pagos no autoriza a evaluar sus sistemas."
          },
          {
            "title": "Eventos y callbacks",
            "text": "Describe qué evento se espera, quién puede originarlo y qué operación debería generar. Las demostraciones deben evitar pagos, notificaciones o cambios reales no acordados."
          },
          {
            "title": "Revocación",
            "text": "Explica qué debería dejar de funcionar al retirar permisos o desconectar la integración. Conserva un plan de limpieza de cuentas, claves y datos de evaluación."
          }
        ]
      },
      {
        "id": "brief",
        "title": "Qué llevar al brief de SECURIVA",
        "paragraphs": [
          "Entrega el diagrama de tenants, la matriz de roles, las funciones prioritarias y las excepciones de colaboración. Añade documentación de APIs si existe, contactos técnicos y restricciones de operación. Si no tienes todo preparado, declara los faltantes: es preferible acordar una fase inicial que cotizar una cobertura completa sobre supuestos. No envíes claves de producción en el primer contacto comercial.",
          "El informe debe reflejar qué límites se evaluaron y qué condiciones quedaron fuera. Un SaaS puede requerir varias evaluaciones a medida que cambian funciones e integraciones. SECURIVA puede ayudarte a definir una primera revisión que tenga sentido para tu arquitectura y tu equipo, con evidencia reproducible y siguientes pasos concretos para desarrollo."
        ]
      }
    ],
    "faq": [
      {
        "question": "¿Dos cuentas normales bastan para evaluar un SaaS?",
        "answer": "Depende de sus reglas. Deben representar roles, organizaciones y estados relevantes. La matriz de permisos permite decidir qué cuentas y datos se necesitan antes de iniciar."
      },
      {
        "question": "¿La evaluación incluye automáticamente a proveedores externos?",
        "answer": "No. Se necesitan alcance y autorización correspondientes. Habitualmente se define qué lado de la integración pertenece al cliente y qué entornos de prueba permite el tercero."
      }
    ],
    "references": [
      {
        "label": "OWASP: seguridad de aplicaciones multitenant",
        "url": "https://cheatsheetseries.owasp.org/cheatsheets/Multi_Tenant_Security_Cheat_Sheet.html"
      },
      {
        "label": "OWASP: autorización",
        "url": "https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html"
      },
      {
        "label": "OWASP API1: autorización a nivel de objeto",
        "url": "https://api-security.owasp.org/editions/2023/en/0xa1-broken-object-level-authorization/"
      },
      {
        "label": "OWASP: API Security Top 10",
        "url": "https://devguide.owasp.org/en/07-training-education/07-api-top-ten/"
      }
    ],
    "relatedPaths": [
      "/seguridad-api",
      "/preparar-pentest",
      "/blog/plan-30-dias-despues-pentest"
    ]
  }
]
