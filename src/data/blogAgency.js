const publishedAt = '2026-10-28'
const updatedAt = '2026-10-28'

export const agencyBlogPosts = [
  {
    path:'/blog/ciberseguridad-white-label-para-agencias',kind:'resource',label:'White label para agencias',
    title:'Ciberseguridad white label para agencias.',emphasis:'Quién hace qué.',
    description:'Cómo funciona la ciberseguridad white label: responsabilidades de la agencia, del cliente y del equipo técnico, autorizaciones, entregables y retest.',
    summary:'La ciberseguridad white label permite a una agencia incorporar una evaluación técnica a su oferta y presentar el entregable con su identidad. Para que funcione, hay que acordar mucho más que el logo del informe: quién vende, quién autoriza las pruebas, quién investiga y quién acompaña las correcciones. Esta guía propone una distribución práctica de esas responsabilidades.',
    category:'Agencias',readingMinutes:5,publishedAt,updatedAt,
    sections:[
      {id:'modelo',title:'El servicio empieza antes del informe',paragraphs:[
        'Una agencia puede desarrollar un portal y contratar a un especialista para evaluar su seguridad antes de entregarlo. La agencia organiza la propuesta comercial y la relación con el cliente. El especialista ejecuta las pruebas acordadas y prepara la evidencia. El cliente, como responsable de los activos, participa en la autorización y en las decisiones sobre correcciones. La modalidad comercial no elimina ninguna de esas funciones.',
        'White label describe cómo se presenta y coordina el servicio. No define por sí solo su profundidad. Una evaluación acotada de una API y un pentest de una aplicación con varios roles pueden entregarse bajo una misma marca, aunque exijan esfuerzos distintos. Por eso la propuesta debe describir el trabajo técnico además de su presentación.'
      ]},
      {id:'agencia',title:'La agencia sostiene la promesa comercial',paragraphs:[
        'La agencia necesita entender qué está vendiendo y qué información debe pedir. No hace falta convertir al equipo comercial en pentesters. Sí debe poder explicar qué aplicación se revisa, con qué objetivo, qué entrega recibirá el cliente y qué condiciones pueden cambiar el calendario. Si una pregunta técnica excede esa explicación, se confirma con el especialista antes de prometerla.',
        'También conviene definir un responsable de coordinación. Esa persona reúne documentación, valida las fechas con desarrollo y evita que el cliente reciba mensajes contradictorios. La agencia puede conservar toda la comunicación o incluir al especialista en una reunión técnica. Ambas opciones sirven si se acuerdan desde el inicio.'
      ]},
      {id:'cliente',title:'El cliente habilita un trabajo autorizado',paragraphs:[
        'El acceso a una cuenta no equivale a permiso para evaluar todo un sistema. Deben identificarse los activos incluidos y la persona que puede autorizar las actividades. Las reglas de trabajo documentan las restricciones, los contactos y el modo de actuar si una prueba afecta la operación. NIST SP 800-115 ofrece una referencia para estructurar esa planificación.',
        'En un proyecto con servicios externos, cada límite importa. Tener una tienda conectada a un proveedor de pagos permite revisar la integración propia dentro del alcance aprobado. No concede autorización automática para probar la infraestructura del proveedor. La agencia debe trasladar esta distinción a su propuesta y a las conversaciones con el cliente.'
      ]},
      {id:'especialista',title:'El especialista responde por la investigación acordada',paragraphs:[
        'El trabajo técnico consiste en evaluar los activos y comportamientos incluidos, validar posibles hallazgos y explicar su impacto observado. Las herramientas pueden apoyar el proceso, pero una lista automática sin contexto no sustituye esa responsabilidad. El especialista también debe comunicar impedimentos: una cuenta que no funciona, un flujo que no puede completarse o un entorno diferente del previsto.',
        'Esos límites forman parte de la entrega. Si no pudo evaluarse una función por falta de acceso, el informe debe decirlo. La agencia no debería presentar esa función como revisada. Mantener esta trazabilidad ayuda a resolver cambios de alcance sin discusiones sobre expectativas que nunca quedaron escritas.'
      ]},
      {id:'ejemplo',title:'Ejemplo hipotético: un portal con dos organizaciones',paragraphs:[
        'Imaginemos una agencia que entrega un portal para administrar pedidos de dos empresas. El cliente aporta cuentas de prueba separadas. La agencia identifica los recorridos de alta, consulta y aprobación. El especialista revisa los límites entre organizaciones y documenta los resultados. Este ejemplo no describe un cliente de SECURIVA: muestra cómo dividir un proyecto sin dejar responsabilidades implícitas.',
        'Antes de comenzar, las tres partes confirmarían quién prepara los datos, quién estará disponible durante las pruebas y quién corregirá los problemas. Si una segunda aplicación aparece después, se incorpora mediante un cambio acordado. No se considera incluida solo porque comparte la marca o el mismo dominio comercial.'
      ]},
      {id:'entrega',title:'La marca debe acompañar una entrega consistente',paragraphs:[
        'Acordar el formato temprano evita rehacer el informe al final. Conviene revisar una muestra, la identidad visual, los destinatarios y el canal de entrega. El documento puede presentar un resumen para negocio y el detalle necesario para desarrollo. La agencia debe conservar los hallazgos, sus límites y su significado al adaptar la presentación.',
        'La reunión de cierre y el retest también se pactan. Corregir corresponde al equipo que mantiene el producto, salvo contratación específica. El retest comprueba las correcciones incluidas durante la ventana acordada. Una nueva funcionalidad necesita otra decisión de alcance. Esta separación permite vender acompañamiento con claridad y presupuestarlo sin depender de horas indefinidas.'
      ]},
      {id:'primer-acuerdo',title:'Qué dejar acordado para el primer proyecto',checklist:[
        'Activos, entorno, roles y recorridos que se evaluarán.',
        'Responsable de autorizar y contactos de coordinación.',
        'Formato del informe y uso de la marca de la agencia.',
        'Fechas, accesos necesarios y tratamiento de impedimentos.',
        'Reunión de entrega, correcciones y condiciones del retest.'
      ]},
    ],
    faq:[
      {question:'¿El cliente debe hablar directamente con el especialista?',answer:'Depende del acuerdo de coordinación. La agencia puede centralizar la relación o incluir al especialista en reuniones técnicas. Lo importante es que exista un canal claro para autorizar, resolver dudas y explicar los hallazgos.'},
      {question:'¿White label significa que todo está incluido?',answer:'No. La identidad del entregable y la cobertura técnica son decisiones diferentes. La propuesta debe precisar activos, profundidad, fechas, exclusiones y retest.'},
    ],
    references:[{label:'NIST SP 800-115: planificación y reglas para evaluaciones técnicas',url:'https://csrc.nist.gov/pubs/sp/800/115/final'}],
    relatedPaths:['/white-label-ciberseguridad','/recursos/checklist-pentesting-white-label','/preparar-pentest','/blog/como-vender-pentesting-agencia'],
  },
  {
    path:'/blog/como-vender-pentesting-agencia',kind:'resource',label:'Oferta de seguridad para agencias',
    title:'Cómo vender pentesting en tu agencia.',emphasis:'Una primera oferta clara.',
    description:'Diseña una primera oferta de pentesting para tu agencia: cliente adecuado, alcance, entregables, presupuesto y preguntas comerciales sin promesas imposibles.',
    summary:'Una primera oferta de pentesting se vende mejor cuando responde a una decisión concreta del cliente: entregar una aplicación, revisar una integración o atender un requisito de seguridad. La propuesta debe explicar qué se evaluará y qué podrá hacer el equipo con el resultado. Este método ayuda a estructurar esa oferta sin inventar precios de mercado ni prometer una aplicación libre de vulnerabilidades.',
    category:'Agencias',readingMinutes:5,publishedAt,updatedAt,
    sections:[
      {id:'momento',title:'Elegí un momento de compra reconocible',paragraphs:[
        'Empezá por los proyectos que ya conocés. Una aplicación próxima a salir, un cambio de autenticación o un portal que incorpora nuevos roles ofrece una conversación concreta. Preguntá qué cambió y qué necesita comprobar el cliente antes de aprobar la entrega. Esa respuesta orienta el trabajo y ayuda a decidir si un pentest es adecuado para ese momento.',
        'No todos los sitios requieren el mismo servicio. Una página informativa, un panel con datos de clientes y una plataforma con varias organizaciones tienen superficies distintas. Ofrecerles el mismo paquete sin revisar la complejidad puede generar una propuesta poco relevante o una cobertura que no alcanza. La primera venta necesita un problema delimitado.'
      ]},
      {id:'oferta',title:'Escribí el resultado que el cliente podrá usar',paragraphs:[
        'En lugar de vender horas abstractas, describí una entrega: evaluar una aplicación definida, contrastar sus roles prioritarios y entregar un informe con evidencia y recomendaciones. Agregá las condiciones para recibirlo, como cuentas de prueba, entorno disponible y fecha de autorización. El cliente puede entender esa propuesta y el equipo técnico puede verificar si es viable.',
        'El valor no depende de prometer cierta cantidad de hallazgos. Una evaluación puede encontrar problemas relevantes, registrar límites o aportar evidencia sobre comportamientos revisados. Prometer un número mínimo incentiva discusiones sobre cantidad. Resulta más útil comprometer un proceso, una cobertura explícita y una comunicación que permita actuar sobre lo observado.'
      ]},
      {id:'alcance',title:'Reducí incertidumbre antes de hablar de precio',paragraphs:[
        'Pedí una descripción breve del producto, las direcciones de acceso, los roles y tres o cuatro recorridos prioritarios. En una API, agregá documentación o un inventario de operaciones. Confirmá si habrá revisión de código, acceso autenticado o pruebas sobre integraciones propias. Cada elemento cambia el esfuerzo y evita cotizar servicios diferentes como si fueran equivalentes.',
        'OWASP propone integrar pruebas de seguridad a las etapas del desarrollo. Para una agencia, la aplicación práctica es reservar el espacio de evaluación antes de cerrar la entrega general. Si las pruebas empiezan cuando el calendario ya no permite corregir, el informe llega a tiempo pero el proyecto puede quedarse sin margen para aprovecharlo.'
      ]},
      {id:'economia',title:'Calculá tu propuesta con costos conocidos',paragraphs:[
        'La cotización del especialista es un costo del proyecto, no el precio final de la agencia. Sumá la coordinación comercial y técnica que realmente vas a brindar, la adaptación de la entrega y el acompañamiento acordado. Después definí tu margen. No hay un porcentaje universal que sustituya este cálculo ni conviene ocultar trabajo de gestión que consumirá tiempo.',
        'Separá los conceptos que pueden variar: nuevos activos, horas de soporte, otra ronda de retest o requisitos adicionales de formato. Confirmá moneda, vigencia y condiciones de pago en la propuesta. Esta guía no fija tarifas. Un importe defendible depende del alcance validado y de los costos reales de atender esa cuenta.'
      ]},
      {id:'conversacion',title:'Usá preguntas que ayuden a decidir',items:[
        {title:'¿Qué tiene que quedar comprobado antes de la entrega?',text:'Vincula la evaluación con un objetivo del proyecto y evita ofrecer cobertura genérica.'},
        {title:'¿Quién usará el informe para corregir o aprobar?',text:'Permite adaptar la explicación y confirmar que habrá un equipo responsable de actuar.'},
        {title:'¿Qué accesos y fechas pueden confirmar?',text:'Convierte una intención comercial en condiciones para ejecutar el trabajo.'},
      ],paragraphs:[
        'Si el cliente pregunta si la auditoría garantiza seguridad total, respondé con precisión. El informe describe una evaluación delimitada en un momento concreto. Su utilidad está en la evidencia y en las decisiones que habilita. Aclarar ese punto fortalece la confianza y evita vender una garantía que ninguna prueba puede sostener.'
      ]},
      {id:'ejemplo',title:'Ejemplo hipotético de una primera propuesta',paragraphs:[
        'Una agencia prepara un portal de reservas con roles de cliente y administrador. Puede proponer una evaluación del acceso, la consulta de reservas y la gestión de cambios, dentro de un entorno autorizado. La entrega incluiría un resumen ejecutivo, hallazgos validados y una reunión con desarrollo. La ventana de retest se confirma por escrito. El ejemplo es ilustrativo y no corresponde a un proyecto real atribuido a una marca.',
        'Si el cliente agrega una segunda plataforma o pide evaluar un proveedor externo, se revisa la propuesta. La agencia conserva una oferta comprensible porque cada ampliación tiene una razón. Reutilizar este proceso en proyectos parecidos puede hacer más eficiente la venta, sin convertir aplicaciones diferentes en una cobertura idéntica.'
      ]},
      {id:'siguiente',title:'Dejá un próximo paso fácil de completar',paragraphs:[
        'El cierre inicial puede ser una reunión breve para revisar el alcance, no una promesa de comenzar inmediatamente. Enviá antes una lista corta de información necesaria. Después devolvé una propuesta con entregables, fechas y condiciones. Si el proyecto todavía no está preparado, indicá qué falta y quién puede resolverlo. Esa claridad ayuda más que multiplicar mensajes de seguimiento sin contenido nuevo.'
      ]},
    ],
    faq:[
      {question:'¿Tengo que publicar un precio fijo para vender?',answer:'Podés explicar un servicio y pedir la información mínima para cotizar. Si publicás una tarifa, debe estar acompañada por una cobertura y condiciones que puedas mantener. No conviene improvisarla antes de conocer los costos.'},
      {question:'¿Puedo venderlo aunque mi agencia no haga las pruebas?',answer:'Sí, con una modalidad white label y responsabilidades claras. La agencia necesita entender la propuesta, coordinar al cliente y confirmar la autorización; el especialista ejecuta el trabajo técnico acordado.'},
    ],
    references:[{label:'OWASP WSTG v4.2: pruebas de seguridad durante el desarrollo',url:'https://wstg.owasp.org/v4.2/3-The_OWASP_Testing_Framework/0-The_Web_Security_Testing_Framework/'}],
    relatedPaths:['/white-label-ciberseguridad','/preparar-pentest','/blog/ciberseguridad-white-label-para-agencias','/blog/que-debe-incluir-informe-pentest'],
  },
  {
    path:'/blog/que-debe-incluir-informe-pentest',kind:'resource',label:'Entregables de pentesting',
    title:'Qué debe incluir un informe de pentest.',emphasis:'De la evidencia a la decisión.',
    description:'Distingue el resumen ejecutivo y el informe técnico de un pentest. Revisa alcance, evidencia, prioridades, correcciones y estados de retest con un ejemplo.',
    summary:'Un informe de pentest debe permitir que negocio decida y que desarrollo actúe. El resumen ejecutivo explica qué significa lo observado para el proyecto. El detalle técnico permite comprender y reproducir cada hallazgo dentro de las condiciones autorizadas. Ambos necesitan una referencia común: qué se evaluó, qué quedó fuera y qué evidencia sostiene las conclusiones.',
    category:'Agencias',readingMinutes:5,publishedAt,updatedAt,
    sections:[
      {id:'lectores',title:'Dos lectores, una misma evaluación',paragraphs:[
        'Un responsable de negocio necesita saber qué decisión tomar. Un desarrollador necesita localizar el comportamiento y verificar una corrección. Presentar a ambos una captura de pantalla sin explicación deja preguntas abiertas. Tampoco alcanza con un semáforo de riesgos que no se conecte con evidencia. El informe debe permitir pasar de una perspectiva a la otra sin cambiar el significado del hallazgo.',
        'OWASP WSTG propone atender a públicos ejecutivos y técnicos y documentar alcance, limitaciones y resultados. La estructura concreta puede adaptarse. Lo importante es que el formato no esconda información necesaria para entender qué se comprobó y qué no pudo comprobarse durante el trabajo.'
      ]},
      {id:'contexto',title:'El alcance da sentido a las conclusiones',paragraphs:[
        'Antes del listado de hallazgos, buscá los activos, el entorno, las fechas y las identidades utilizadas. Si se probó una aplicación con dos roles, ese dato importa para interpretar el resultado. También deben quedar registrados los impedimentos: una función no disponible, documentación faltante o accesos que llegaron después. El lector puede distinguir una exclusión acordada de una cobertura incompleta.',
        'Una frase como «no se identificaron hallazgos en los recorridos revisados» tiene un alcance diferente de «el sistema es seguro». La primera puede relacionarse con pruebas y condiciones documentadas. La segunda elimina esos límites. Para una agencia que entrega el informe con su marca, conservar esta precisión es parte de la calidad del servicio.'
      ]},
      {id:'ejecutivo',title:'El resumen ejecutivo responde qué conviene hacer',paragraphs:[
        'Proponemos organizarlo alrededor de tres preguntas: qué se evaluó, qué comportamientos relevantes se observaron y qué decisiones requieren atención. Puede identificar prioridades y dependencias, como una corrección que necesita participación de otro equipo. Las cifras, si se usan, deben explicar algo. Contar hallazgos por severidad ayuda a orientarse, pero no reemplaza la explicación del problema principal.',
        'En un ejemplo hipotético, una evaluación de un portal detecta que una cuenta puede consultar una reserva de otra organización. El resumen podría explicar el límite entre organizaciones que se vio afectado y recomendar priorizar su corrección. No necesita incluir solicitudes completas ni presentar pérdidas económicas inventadas. El impacto descrito debe corresponder a lo que se pudo demostrar.'
      ]},
      {id:'tecnico',title:'El detalle técnico permite reproducir y corregir',items:[
        {title:'Identificación y ubicación',text:'Un identificador estable y los componentes afectados ayudan a conversar sobre el mismo hallazgo en el informe, las tareas y el retest.'},
        {title:'Condiciones y evidencia',text:'Roles utilizados, pasos y respuestas relevantes permiten entender cómo se observó el comportamiento sin depender de una captura aislada.'},
        {title:'Impacto y recomendación',text:'La explicación conecta la evidencia con el límite afectado y propone una dirección de corrección para el equipo responsable.'},
      ],paragraphs:[
        'Volviendo al ejemplo hipotético, desarrollo necesitaría reconocer la operación de consulta, las dos cuentas de prueba y la diferencia entre el resultado esperado y el observado. Los identificadores y datos sensibles pueden redactarse sin quitar los elementos necesarios para comprender el problema. La evidencia no debería convertirse en una copia innecesaria de información de clientes.'
      ]},
      {id:'priorizacion',title:'La prioridad necesita contexto',paragraphs:[
        'Una clasificación ayuda a ordenar el trabajo, pero conviene explicar los factores que la sostienen. No es lo mismo un comportamiento accesible sin cuenta que otro limitado a un rol privilegiado. También influyen las precondiciones y el recurso afectado. El informe debe separar lo demostrado de las consecuencias posibles que requerirían condiciones adicionales.',
        'La agencia puede ayudar a convertir estas prioridades en una conversación con el cliente. Puede proponer responsables y fechas de seguimiento, mientras desarrollo estima la corrección. Esa coordinación no debe cambiar unilateralmente la severidad técnica ni prometer una solución antes de que el equipo comprenda la causa. El informe es una base de trabajo compartida.'
      ]},
      {id:'retest',title:'El retest conserva la historia del hallazgo',paragraphs:[
        'Para verificar una corrección hace falta mantener el vínculo con la evidencia original. Un registro útil indica qué hallazgo se volvió a evaluar, en qué entorno y con qué resultado. Si el acceso no estuvo disponible, no corresponde presentarlo como corregido. Si el comportamiento cambió, debe explicarse qué se comprobó y qué limitaciones siguen vigentes.',
        'Conviene acordar de antemano cuántas rondas se incluyen, qué cambios pueden volver a evaluarse y durante qué período. El informe inicial no desaparece con el retest. Ambas versiones permiten entender la evolución del proyecto y evitar que un documento actualizado parezca una evaluación nueva de funciones que nunca estuvieron dentro del alcance.'
      ]},
      {id:'revision',title:'Revisá una muestra antes de contratar',paragraphs:[
        'Pedí una muestra con datos ficticios o debidamente anonimizados. Intentá seguir un hallazgo desde el resumen hasta sus pasos de reproducción. Revisá si el texto distingue hechos, límites y recomendaciones. Confirmá también cómo se entregará el documento y quién tendrá acceso. Un informe legible facilita que el trabajo técnico llegue a la persona que debe resolverlo.'
      ]},
    ],
    faq:[
      {question:'¿Un informe largo es mejor?',answer:'La extensión debe responder a la cobertura y a la evidencia necesaria. Páginas repetidas, capturas sin contexto o listados automáticos no aportan por sí solos una evaluación más útil.'},
      {question:'¿El informe white label puede cambiar las conclusiones?',answer:'Personalizar la identidad visual no debería alterar el significado técnico. Los hallazgos, sus límites y los resultados del retest deben conservarse al adaptar la presentación.'},
    ],
    references:[{label:'OWASP WSTG v4.2: Reporting',url:'https://wstg.owasp.org/v4.2/5-Reporting/'}],
    relatedPaths:['/pentesting-web','/white-label-ciberseguridad','/blog/ciberseguridad-white-label-para-agencias','/blog/elegir-proveedor-pentesting-mexico-argentina'],
  },
  {
    path:'/blog/checklist-seguridad-ecommerce-antes-lanzamiento',kind:'resource',label:'Seguridad de e-commerce',
    title:'Seguridad antes de lanzar un e-commerce.',emphasis:'Revisá los recorridos que importan.',
    description:'Checklist de seguridad antes de publicar una tienda: cuentas, pedidos, permisos, pagos, integraciones y preparación de una evaluación autorizada.',
    summary:'Antes de lanzar una tienda, conviene revisar cómo se conectan las cuentas, los pedidos, los pagos y las operaciones del equipo. Esta checklist organiza preguntas para desarrollo y para una evaluación autorizada. Sirve para preparar el trabajo y detectar decisiones pendientes; completarla no certifica la seguridad de una tienda ni sustituye las pruebas del alcance acordado.',
    category:'Agencias',readingMinutes:5,publishedAt,updatedAt,
    sections:[
      {id:'inventario',title:'Dibujá el recorrido completo de una compra',paragraphs:[
        'Empezá por una compra normal y anotá los sistemas que participan: tienda, backend, proveedor de pagos, logística y herramientas de administración. Identificá qué equipo mantiene cada componente y dónde cambia el estado del pedido. Este mapa ayuda a elegir los recorridos de prueba y evita considerar todo el ecosistema como una única aplicación controlada por la agencia.',
        'Prepará también cuentas y datos de prueba. Una tienda de demostración con un único usuario no permite contrastar los límites entre clientes. Elegí un entorno representativo y acordá cómo se evitarán efectos reales sobre cobros, existencias o comunicaciones. El objetivo es observar comportamientos útiles sin improvisar esas condiciones durante las pruebas.'
      ]},
      {id:'identidad',title:'Cuentas y permisos: quién puede ver o cambiar qué',paragraphs:[
        'Separá las acciones del comprador, del operador y del administrador. Revisá qué información necesita cada rol y cómo se limita el acceso a pedidos, direcciones y documentos. OWASP recomienda comprobar la autorización en cada solicitud y aplicar privilegios mínimos. Ocultar un botón en la interfaz no define por sí solo qué operación permite el servidor.',
        'Como preparación, documentá el resultado esperado para cada combinación de rol y recurso. Por ejemplo, un cliente debería poder consultar sus propios pedidos dentro de las condiciones del producto. Si existe una cuenta para una agencia o proveedor, aclarar sus permisos evita que una excepción operativa se convierta en acceso amplio sin revisión.'
      ],checklist:['Roles de comprador, operación y administración separados.','Cuentas de prueba distintas para contrastar acceso a recursos.','Recuperación de cuenta y cierre de sesiones incluidos en la revisión.']},
      {id:'pagos',title:'Pagos: diferenciá la integración de la pasarela',paragraphs:[
        'La tienda necesita reconciliar el pedido que conoce con la confirmación de pago que recibe. OWASP dedica una guía a integrar pasarelas de terceros: entre otros puntos, destaca la validación del importe y la moneda, la autenticidad de notificaciones y el control de eventos repetidos. Son aspectos de la integración que el equipo puede delimitar y revisar.',
        'El alcance debe distinguir el código propio del servicio del proveedor. Tener una cuenta comercial en una pasarela no autoriza a ejecutar pruebas sobre su infraestructura. Para preparar la evaluación, compartí documentación de la integración y los mecanismos oficiales de prueba disponibles. Las pruebas sobre terceros requieren su autorización específica y condiciones independientes.'
      ],checklist:['Importe, moneda y pedido vinculados del lado del servidor.','Confirmaciones y notificaciones verificadas según la integración.','Comportamiento previsto ante notificaciones duplicadas o tardías.']},
      {id:'negocio',title:'La lógica de negocio también necesita revisión',paragraphs:[
        'Una tienda puede validar correctamente el formato de una solicitud y aceptar una combinación de acciones contraria a sus reglas. Por eso conviene describir qué debe mantenerse cierto durante el recorrido: cuándo puede aplicarse un descuento, quién puede cancelar y en qué estado se permite un reembolso. El equipo de negocio ayuda a definir esas condiciones.',
        'Ejemplo hipotético: una promoción tiene un uso por cliente y una devolución requiere que el pedido esté confirmado. El alcance podría incluir la validación de esas reglas con datos de prueba. No se trata de atribuir un incidente a una plataforma ni de probar servicios ajenos. Se transforma una regla del producto en un comportamiento verificable dentro del entorno autorizado.'
      ]},
      {id:'operacion',title:'Prepará la operación que viene después del lanzamiento',paragraphs:[
        'Antes de publicar, confirmá quién recibirá un aviso si aparece un problema, quién puede desactivar una función y cómo se recuperará una configuración. Revisá con el equipo los accesos temporales utilizados durante el desarrollo y quién conserva permisos administrativos. La entrega de una tienda debería incluir una asignación explícita de esas tareas.',
        'Los registros necesarios para investigar problemas deben evitar guardar secretos o datos innecesarios. Definí qué necesita observar operación: un cambio de estado, una acción administrativa o un fallo de integración. Ese diseño permite conversar sobre incidentes con evidencia útil. No equivale a prometer monitoreo permanente si ese servicio no fue contratado.'
      ]},
      {id:'alcance',title:'Convertí la checklist en un brief de evaluación',paragraphs:[
        'Seleccioná los recorridos más importantes para esa tienda y relacioná cada uno con las cuentas y sistemas necesarios. Agregá las exclusiones y la persona que autoriza. Con esta información se puede definir una evaluación web, de API o de integración sin tratar cada casilla como una prueba automática ni prometer revisión de componentes que no están bajo control del cliente.',
        'Reservá tiempo para corregir y verificar. Si la evaluación termina justo al abrir la tienda al público, cualquier ajuste deberá competir con las tareas del lanzamiento. El calendario debe reflejar esa dependencia y prever cómo se comunicarán los hallazgos relevantes durante el trabajo, además de la entrega final.'
      ]},
    ],
    faq:[
      {question:'¿Necesito permiso de la plataforma de e-commerce?',answer:'Depende de los activos y actividades que se quieran evaluar. El cliente debe autorizar sus activos y deben respetarse las condiciones del proveedor. No se debe asumir autorización para probar sistemas de terceros por utilizar sus servicios.'},
      {question:'¿Puedo lanzar si completé esta lista?',answer:'La lista ayuda a preparar y coordinar decisiones. No ofrece una aprobación automática ni demuestra ausencia de vulnerabilidades. La decisión de lanzamiento debe considerar las evidencias y limitaciones de la evaluación realizada.'},
    ],
    references:[
      {label:'OWASP: Authorization Cheat Sheet',url:'https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html'},
      {label:'OWASP: integración de pasarelas de pago de terceros',url:'https://cheatsheetseries.owasp.org/cheatsheets/Third_Party_Payment_Gateway_Integration_Cheat_Sheet.html'},
      {label:'OWASP: Business Logic Security',url:'https://cheatsheetseries.owasp.org/cheatsheets/Business_Logic_Security_Cheat_Sheet.html'},
    ],
    relatedPaths:['/seguridad-api','/pentesting-web','/preparar-pentest','/blog/como-vender-pentesting-agencia'],
  },
  {
    path:'/blog/elegir-proveedor-pentesting-mexico-argentina',kind:'resource',label:'Contratar pentesting',
    title:'Cómo elegir un proveedor de pentesting.',emphasis:'En México y Argentina.',
    description:'Compara proveedores de pentesting en México y Argentina por cobertura, evidencia, responsables, informe, retest y condiciones de trabajo remoto.',
    summary:'Para elegir un proveedor de pentesting en México o Argentina, compará la evaluación que realmente propone y la evidencia de que puede ejecutarla. La ubicación comercial, una lista de herramientas o una tarifa aislada no explican la cobertura. Esta guía organiza una comparación práctica de alcance, equipo, entregables y coordinación para empresas y agencias que contratan trabajo remoto.',
    category:'Agencias',readingMinutes:5,publishedAt,updatedAt,
    sections:[
      {id:'objetivo',title:'Primero escribí la decisión que querés tomar',paragraphs:[
        'La selección empieza con tu proyecto. ¿Necesitás revisar una aplicación antes de lanzarla, profundizar en permisos de una API o incorporar una evaluación a una entrega de agencia? Un objetivo claro permite pedir propuestas comparables. Si cada proveedor imagina un trabajo distinto, la diferencia de precios no dice mucho sobre cuál conviene contratar.',
        'Prepará una descripción de activos, roles, recorridos prioritarios y fecha objetivo. Indicá los requisitos del cliente final si existen. Si todavía falta documentación, declaralo. Un proveedor puede proponer una fase para completar el inventario, pero debería distinguirla de la evaluación posterior. Esa separación hace visible dónde se consume el esfuerzo.'
      ]},
      {id:'cobertura',title:'Compará cobertura antes que etiquetas',paragraphs:[
        'Pedí que cada propuesta detalle qué incluye: aplicación o API, entorno, cuentas, operaciones, validación manual, revisión de código si corresponde y exclusiones. «Auditoría completa» es una expresión insuficiente si no puede relacionarse con esos elementos. También preguntá cómo se registran las funciones que no pudieron revisarse y cómo se acuerda una ampliación.',
        'OWASP ASVS puede ayudar a expresar requisitos de verificación de aplicaciones. Si una propuesta lo menciona, solicitá la versión y los requisitos aplicables, junto con las exclusiones. Usar un estándar como referencia no demuestra que todos sus controles hayan sido evaluados ni que exista una certificación automática del producto o del proveedor.'
      ]},
      {id:'equipo',title:'Pedí evidencia pertinente del equipo que hará el trabajo',paragraphs:[
        'Confirmá quién ejecutará y revisará la evaluación. La experiencia debe relacionarse con la arquitectura y los flujos de tu proyecto. Un perfil especializado en aplicaciones no demuestra por sí solo capacidad para cualquier infraestructura. Las credenciales individuales pueden aportar contexto, pero conviene distinguirlas de acreditaciones de empresa y comprobar las afirmaciones que sean importantes para tu contratación.',
        'Una muestra de informe, una explicación de cómo se delimita el alcance y respuestas claras a preguntas técnicas aportan evidencia concreta. Los casos públicos pueden ayudar si describen una intervención autorizada y sus límites. Un logo, una reseña sin origen o una lista de marcas no reemplaza esa información.'
      ]},
      {id:'muestra',title:'Comprobá si el entregable se puede usar',paragraphs:[
        'Solicitá una muestra con datos ficticios o anonimizados y planteá una tarea sencilla: identificar qué debería hacer desarrollo con un hallazgo. Si faltan condiciones, evidencia o recomendaciones comprensibles, preguntá cómo se resolverá en tu entrega. Verificá si negocio tendrá un resumen adecuado para decidir sin interpretar capturas o solicitudes técnicas.',
        'Ejemplo hipotético: dos propuestas evalúan el mismo portal. Una ofrece un listado automático; la otra incluye validación manual sobre los roles acordados, explicación del impacto y una reunión de entrega. No es una comparación de empresas reales. Muestra por qué ambos importes pueden corresponder a servicios distintos y por qué la cobertura debe quedar visible.'
      ]},
      {id:'remoto',title:'Aclará cómo se coordina el trabajo entre países',paragraphs:[
        'Una evaluación web o de APIs puede coordinarse de forma remota. Preguntá desde dónde se presta el servicio y si una presencia física es necesaria para tu alcance. No deduzcas que existe una oficina local porque una página menciona una ciudad. Si tu proyecto exige trabajo presencial, confirmá la disponibilidad y sus condiciones de manera específica.',
        'Para equipos en Argentina y México, fijá la zona horaria de las reuniones y las ventanas de prueba. Acordá quién autoriza, quién responde ante un impedimento y quién recibe el informe. La propuesta también debe aclarar moneda, vigencia, forma de pago y cualquier requisito de contratación que las partes necesiten verificar. No conviene resolver estas cuestiones después de reservar las fechas.'
      ]},
      {id:'retest',title:'Incluí correcciones y cierre en la comparación',paragraphs:[
        'Preguntá si hay retest, qué hallazgos cubre, cuántas rondas incluye y dentro de qué plazo puede solicitarse. Aclarar esas condiciones evita interpretar «acompañamiento» como disponibilidad ilimitada. Verificá también qué sucede si cambia la aplicación, el equipo entrega la corrección fuera de la ventana o una prueba necesita un acceso que no estaba disponible.',
        'La entrega debería dejar registrados los límites y los resultados de la verificación. Si el proyecto se amplía, pedí una actualización del alcance. Un proveedor que explica estas condiciones permite presupuestar y coordinar mejor. La promesa de encontrar todo o garantizar que nunca habrá incidentes no sustituye un proceso verificable.'
      ]},
      {id:'decision',title:'Una tabla breve puede ordenar la decisión',checklist:[
        'Mismos activos, roles, operaciones y profundidad para comparar.',
        'Responsables técnicos identificados y experiencia pertinente.',
        'Muestra de informe comprensible para negocio y desarrollo.',
        'Autorizaciones, exclusiones y coordinación remota explícitas.',
        'Precio, condiciones de pago, fechas y retest confirmados.'
      ],paragraphs:[
        'Anotá dónde cada propuesta responde y dónde necesita una aclaración. Elegí con esa información y con las prioridades reales de tu proyecto. Una comparación honesta puede terminar en un alcance menor y bien definido, si eso permite evaluar primero lo que más importa y deja las siguientes fases claramente separadas.'
      ]},
    ],
    faq:[
      {question:'¿Necesito un proveedor con oficina en mi ciudad?',answer:'Depende del trabajo. Para aplicaciones web y APIs puede ser viable la evaluación remota. Si necesitás presencia física, debe estar expresamente confirmada. La mención de una ciudad en la web no prueba que exista una sede.'},
      {question:'¿Cuál es el proveedor más barato de México o Argentina?',answer:'Esta guía no compara tarifas observadas ni publica un ranking. Para comparar precio necesitás propuestas vigentes con coberturas equivalentes, requisitos de acceso, entregables y condiciones de retest.'},
    ],
    references:[{label:'OWASP Application Security Verification Standard: requisitos y uso en contratación',url:'https://owasp.org/www-project-application-security-verification-standard/'}],
    relatedPaths:['/argentina','/mexico','/preparar-pentest','/blog/que-debe-incluir-informe-pentest'],
  },
]
