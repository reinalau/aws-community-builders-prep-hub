import { Slide, TrackInfo, UsefulLink } from "./types";

export const DEFAULT_SLIDES: Slide[] = [
  {
    id: 1,
    title: "AWS Community Builders",
    subtitle: "Es tu momento para construir tu postulación",
    category: "Intro",
    layout: "title",
    iconName: "CommunityBuildersBadge",
    content: [
      "Bienvenid@s!!",
      "Descubran cómo unirse a una de las comunidades oficiales de tecnología en la nube más activas e iteresantes del mundo.",
      "(Desde la mirada de LauB)"
    ],
    notes: "Presentación inicial. Saluda al grupo de chicas, expresa tu entusiasmo por ver a más mujeres interesadas en tecnología cloud e introduce brevemente que este taller les dará las bases, tips reales y una herramienta interactiva para preparar su postulación."
  },
  {
    id: 2,
    title: "¿Qué es el Programa AWS Community Builders?",
    subtitle: "Una comunidad mundial para entusiastas de la nube",
    category: "General",
    layout: "content",
    iconName: "Globe",
    content: [
      "Es un programa oficial de AWS adaptado para constructores apasionados por compartir conocimiento sobre AWS. Ofrece recursos técnicos exclusivos, mentoría de expertos, networking global y capacitaciones.",
      "Es una comunidad global donde las relaciones estan descentralizadas, todo gira en base a los aportes para ayudar a otros builders.",
      "El ingreso es anual (aunque hay excepciones 🧐). Se evalúa cada año de forma gratuita basándose en la participación y el contenido compartido.",
      "9 Tracks Técnicos: Te unís a una subcomunidad basada en tu interés (AI Engineering, Serverless, Security, Containers, etc.).",
      "Flexibilidad tecnológica: AWS acepta creadores de contenido de código abierto, IA, herramientas de desarrollo y gestión de contenedores, incluso si utilizan tecnologías de otras nubes. ",
      "Aunque se permite abordar cualquier tecnología, tenés que demostrar un mínimo conocimiento o uso activo de AWS en proyectos técnicos",
    ],
    notes: "Explica que AWS provee este programa no para certificar que eres un senior de 10 años, sino para potenciar a quienes aman compartir. Destaca que hay tracks técnicos que cubren diferentes áreas, desde metodologías ágiles hasta programación nativa en la nube."
  },
  {
    id: 3,
    title: "Los Beneficios del Programa 🎁",
    subtitle: "¿Qué obtenés al ser parte de esta comunidad global?",
    category: "General",
    layout: "bento",
    iconName: "Gift",
    content: [
      "Credenciales y Educación: Un voucher gratis para dar cualquier examen de certificación AWS al año + acceso pagado a plataforma cloud de aprendizaje.",
      "Soporte de Desarrollo: Cupón anual de $500 USD en créditos para la consola de AWS para jugar, experimentar y desplegar proyectos reales.",
      "Slack Exclusivo Global: Acceso a un canal privado de Slack con miles de Builders y empleados oficiales de AWS para mentoría, resolución de problemas y colaboración.",
      "Voz de Producto: Acceso directo a Product Managers de AWS para conocer betas exclusivas, dar feedback y asistir a webinars privados.",
      "¡Swag Oficial!: Un kit de bienvenida enviado directo a tu casa con varios regalitos que cambian todos los años."
    ],
    notes: "Este slide suele emocionar mucho. Enfatiza los $500 en créditos de AWS para sus proyectos de estudio y el voucher gratis para la certificación (que cuesta entre $100 y $300 USD habitualmente). Explica que el Slack global es una mina de oro para hacer preguntas duras que a veces nadie responde en foros tradicionales."
  },
  {
    id: 4,
    title: "¿Quién puede postular y qué evalúan?",
    subtitle: "Desmitificando los requisitos de AWS",
    category: "Cómo Postular",
    layout: "content",
    iconName: "Lightbulb",
    content: [
      "Perfil: Abierto a cualquier entusiasta mayor de 18 años. No necesitás tener 10 certificaciones o ser una experta súper senior.",
      "Deseo de Compartir: Buscan personas que hayan generado al menos 2 o 3 contribuciones sobre AWS en los últimos 12 meses (blogs, videos, código en GitHub, charlas).",
      "Diversidad e inclusión de grupos subrepresentados en tecnología: AWS valora increíblemente la inclusión de más mujeres, estudiantes universitarias y personas en transición de carrera técnica.",
      "Comprometidas a colaborar: Al ingresar, te comprometés a seguir compartiendo y apoyando al resto de la comunidad de forma activa."
    ],
    notes: "Muy importante restarles el miedo. Dile al grupo de chicas que el 'SÍNDROME DE LA IMPOSTORA' es el primer obstáculo. AWS no selecciona por coeficiente intelectual certificado, selecciona por entusiasmo, generosidad y consistencia compartiendo en canales locales o redes."
  },
  {
    id: 5,
    title: "Anatomía de la Postulación Oficial",
    subtitle: "Los tres pilares del formulario de AWS",
    category: "Cómo Postular",
    layout: "content",
    iconName: "ClipboardCheck",
    content: [
      "1. Tener una cuenta de AWS builder en la web oficial https://community.aws/builders. Dicha cuenta es gratuita y sirve para ingresar a SkillBuilder, donde accedés recursos exclusivos de AWS.",
      "2. Track de Interés Técnico: Seleccionar un área donde te enfocás (ej. Serverless, Machine Learning, Cloud Ops, etc.).",
      "3. Preparación de tus Aportes (2-3 links): Enlaces a artículos de blog propios, videos de YouTube, podcasts, repositorios explicados de GitHub, posts detallados en redes, webinars, etc.",
      "4. Dos Preguntas de Ensayo: Describir en detalle contribuciones del último año, y explicar tu motivación real de pertenecer al programa (¿Por qué querés unirte?).",
      "5. En el form, preguntan si conocés algún Hero. Lo ideal es que esa persona sepa quién sos por la visibilidad que tengas en la comunidad que participes (eventualmente le pedirán referencia)"
    ],
    notes: "Explica detalladamente la estructura del formulario oficial. Menciona que este taller incluye un simulador de borrador en la pestaña contigua, para que las chicas estructuren hoy mismo estos 3 pilares."
  },
  {
    id: 6,
    title: "Experiencias en el Programa",
    subtitle: "Una perspectiva corta pero transformadora",
    category: "Experiencias",
    layout: "quote",
    iconName: "Sparkles",
    content: [
      "\"Es mi primer año como AWS Community Builder y ya estoy asombrado por esta comunidad 🧡. Me ha brindado amistades genuinas y siempre me alegra hacer nuevas.Me motiva cada día aprender de algunos de los mejores y ver la generosidad con la que todos comparten sus conocimientos.La acción colectiva es lo que hace que esta comunidad sea tan especial. Todos aprendemos más rápido, crecemos juntos y nos inspiramos mutuamente. También me ha inspirado a aspirar a convertirme algún día en Héroe de AWS y a contribuir de la misma manera. Guita (Marruecos)\"",
      "\"Postulé con dudas sobre si lo que sabía y tenia para ofrecer era suficiente. Luego me di cuenta que solo hace falta Autenticidad, Generosidad y Constancia. Es un empujon animico que te hace pensar que siempre podemos lograr una meta. LauB (Argentina)\"",
    ],
    notes: "Comparte tu experiencia corta real aquí. Transmite autenticidad. Explica cómo entraste, qué sentiste la primera semana y cuál ha sido el beneficio o interacción más bonita que has tenido hasta ahora."
  },
  {
    id: 7,
    title: "¿Cómo te impulsa Profesional y Laboralmente?",
    subtitle: "",
    category: "Para Vos",
    layout: "bento",
    iconName: "Briefcase",
    content: [
      "Marca Personal y Visibilidad: Aparecés en el directorio oficial de AWS Community Builders. Impulsás de inmediato tus perfiles de LinkedIn, Twitter y portafolios.",
      "Para Profesionales: Conseguís credibilidad inmediata con tus clientes y jefes. Tenés el respaldo de recursos directos de AWS y soluciones ágiles a dudas técnicas del día a día.",
      "Si buscás Empleo: Te enterás de oportunidades por otros Builders. Ser AWS Community Builder es un sello de garantía para los reclutadores de que sos proactiva, dominás entornos de colaboración y documentás desafíos técnicos.",
      "Mentoría Directa: Charlas de carrera personalizadas, consejos para convertirte en AWS Hero a largo plazo y mejora de habilidades de comunicación técnica."
    ],
    notes: "Conecta este slide con la situación laboral actual. El sector Cloud tiene alta demanda pero requiere diferenciadores. Ser AWS Community Builder es un sello de garantía para los reclutadores de que eres proactiva, dominas entornos de colaboración y documentas tus desafíos técnicos."
  },
  {
    id: 8,
    title: "Tips de Oro para Preparar tu Contenido",
    subtitle: "Estrategias prácticas que maximizan tu aceptación",
    category: "Tips",
    layout: "content",
    iconName: "Coins",
    content: [
      "Calidad sobre Complejidad: Un post explicando paso a paso cómo desplegar una arquitectura serverless en AWS que represente caso de uso conocido, con tus propias palabras y capturas vale más que copiar arquitecturas avanzadas.",
      "Mejora tu GitHub: Si subís código de tus prácticas de AWS, agregá un README.md impecable en formato Markdown explicando el despliegue con capturas.",
      "Plataformas Amigas: Publicá en Dev.to, Medium o builder.aws.com usando las etiquetas de AWS. Es fácil crear una cuenta hoy mismo!.",
      "Mostrá tus habilidades blandas: Si moderaste una charla o participaste en actividades de un AWS User Group local (como voluntaria), ¡cuenta enormemente como contribución comunitaria!"
    ],
    notes: "Dales ideas súper accionables. Sugiéreles abrir una cuenta en Medium o Dev.to para escribir mañana mismo un resumen de lo que aprendieron en este taller o cómo desplegaron su primera interfaz interactiva. Recuérdales que documentar su aprendizaje es una forma legítima de contribución."
  },
  {
    id: 9,
    title: "¡Es tu Momento de Postular!",
    subtitle: "Próximos pasos y recursos claves",
    category: "Cierre",
    layout: "title",
    iconName: "CommunityBuildersBadge",
    content: [
      "Comenzá a recopilar y pulir tu contenido paso a paso.",
      "Usá la solapa 'Taller de Borrador' en esta app para estructurar tu propuesta y obtener sugerencias personalizadas de IA.",
      "¡Apoyémonos entre nosotras y expandamos la presencia y participación de chicas en el programa 🙏!",
      "builder.aws.com/community/community-builders"
    ],
    notes: "Anímalas a no postergar la decisión. Recuérdales el enlace oficial. Invítalas a redactar su borrador con el taller interactivo."
  }
];

export const TRACK_OPTIONS: TrackInfo[] = [
  {
    name: "AI Engineering",
    key: "ai_engineering",
    iconName: "Brain",
    description: "IA generativa, modelos predictivos, visión computacional, Prompt engineering, fine-tuning, RAG (Generación Aumentada por Recuperación) y Agentes inteligentes",
    examples: ["Amazon AgentCore", "Amazon Bedrock", "Strands Agents", "Kiro 👻"]
  },
  {
    name: "Serverless",
    key: "serverless",
    iconName: "Zap",
    description: "Sistemas basados en microservicios sin servidor, arquitecturas reactivas y orientadas a eventos.",
    examples: ["AWS Lambda", "Fargate", "AWS Step Functions", "Amazon EventBridge", "API Gateway", "Amazon DynamoDB"]
  },
  {
    name: "Machine Learning",
    key: "machine_learning",
    iconName: "Brain",
    description: "IA, modelos predictivos, visión computacional y automatización con datos.",
    examples: ["Amazon SageMaker", "Amazon Bedrock", "AWS Rekognition", "AWS Polly", "Amazon Q"]
  },
  {
    name: "Containers",
    key: "containers",
    iconName: "Box",
    description: "Orquestación, empaquetado de microservicios, portabilidad de software y Kubernetes.",
    examples: ["Amazon ECS", "Amazon EKS", "AWS Fargate", "Amazon ECR", "Docker"]
  },
  {
    name: "Developer Tools",
    key: "developer_tools",
    iconName: "Wrench",
    description: "Automatización de despliegues, integración y entrega continua (CI/CD) e infraestructura como código.",
    examples: ["AWS CDK", "AWS CodePipeline", "AWS CodeBuild", "CloudFormation", "SDKs", "Amplify", "Terraform"]
  },
  {
    name: "Databases & Storage",
    key: "databases_storage",
    iconName: "Database",
    description: "Diseño para almacenamiento resiliente, de alta escalabilidad e interacción en bases de datos sql y nosql.",
    examples: ["Amazon RDS", "Amazon Aurora", "Amazon S3", "Amazon DynamoDB", "Amazon Elasticache", "AWS Glue"]
  },
  {
    name: "Security & Identity",
    key: "security_identity",
    iconName: "ShieldCheck",
    description: "Gobierno de nube, dectención de amenazas, credenciales seguras, encriptación y control de accesos.",
    examples: ["AWS IAM", "AWS Cognito", "AWS Secrets Manager", "GuardDuty", "Shield", "WAF"]
  },
  {
    name: "Cloud Operations",
    key: "cloud_operations",
    iconName: "Cpu",
    description: "Arquitecturas híbridas, monitoreo proactivo, costos optimizados, logging y redes robustas.",
    examples: ["Amazon VPC", "CloudWatch", "CloudTrail", "AWS Organizations", "AWS Systems Manager", "Cost Explorer"]
  },
  {
    name: "Network Content & Delivery",
    key: "network_content_delivery",
    iconName: "Network",
    description: "Arquitecturas híbridas, monitoreo proactivo, costos optimizados, logging y redes robustas.",
    examples: ["Amazon VPC", "CloudWatch", "CloudTrail", "AWS Organizations", "Amazon Cloudfront", "Amazon Route53"]
  }
];

export const FAQS = [
  {
    question: "¿Cuándo se puede postular al programa?",
    answer: "Las aplicaciones abren formalmente 1 vez al año (en enero). Mantenete atenta o registrate en la lista de espera oficial de AWS para que te notifiquen inmediatamente abran las postulaciones: `https://builder.aws.com/community/community-builders`"
  },
  {
    question: "¿Es gratis unirse al programa?",
    answer: "Sí, el programa AWS Community Builders es 100% gratuito. De hecho, AWS te compensa con créditos, vouchers y swag por tus valiosas contribuciones de manera recíproca."
  },
  {
    question: "¿Necesito tener certificaciones activas para ser seleccionada?",
    answer: "No, las certificaciones ayudan pero no son obligatorias. El jurado valora muchísimo más el contenido útil que compartas en comunidades (blogs, videos, repositorios de código abiertos, etc.) y tus ganas genuinas de ayudar a otros constructores. Personalmente, creo que puede ayudar el historial de formacion en SkillBuilder (con tu id de builder), demuestra tu entusiasmo por aprender!"
  },
  {
    question: "¿Se puede aplicar si el contenido que publico está en español?",
    answer: "¡Por supuesto que sí! AWS valora las comunidades locales de todos los idiomas. Escribir y hablar en español ayuda a democratizar el acceso a la tecnología en Latinoamérica. Solo asegurate de explicar el impacto de tus aportaciones de manera clara en los ensayos del formulario."
  },
  {
    question: "¿Qué tipo de enlaces de contenido son más valorados?",
    answer: "Se prefiere el contenido de autoría propia (sin abuso del uso de IA) de los últimos 12 meses, tales como: tutoriales explicativos paso a paso, código open source documentado, videos demostrativos, charlas o ponencias, podcasts y organizaciones de workshops. El contenido debe tener carácter formativo enfocado en AWS o en tecnologías Cloud en general. Para el caso de Track AI Engineering tambien se valoran los experimentos con LLMs y la creacion de aplicaciones."
  },
  {
    question: "Si ya pertenezco al programa, ¿es de por vida?",
    answer: "No! el programa se renueva anualmente. Al final de tu periodo de un año, pasás por un proceso de renovación sencillo donde reportás tus contribuciones de ese año para mantener tu espacio y renovar tus cupones, certificaciones y beneficios."
  }
];

export const STEP_BY_STEP_GUIDE = [
  {
    title: "Paso 1: Define tu enfoque (Track)",
    desc: "Elegí la categoría técnica que te haga sentir más cómoda y donde hayas hecho o quieras hacer más contenido técnico. No intentes abarcarlo todo; la especialización en AWS destaca."
  },
  {
    title: "Paso 2: Compila tus Aportes del Año",
    desc: "Reuní al menos 2 o 3 enlaces de tus mejores aportes (o planifica crearlos este mes). Un post de blog documentando un error que resolviste, una paso a paso de como desplegar una Arquitectura AWS o un repositorio de GitHub legible (donde un tercero pueda descargarlo y probarlo), es perfecto."
  },
  {
    title: "Paso 3: Estructura tu Impacto de Formación",
    desc: "En el ensayo de contribuciones, explicá qué hiciste, por qué lo creaste y cómo ayudó a los demás. Ej: 'Escribí un articulo sobre Patrones de acceso seguro a S3 que ayuda a la comunidad a clarificar los diferentes casos de uso de acceso público y privado.'"
  },
  {
    title: "Paso 4: Redacta tu motor de Motivación",
    desc: "En el formulario, expresá claramente tus planes de retribución en comunidad. Indicar qué esperas aprender en el programa y cómo usarás los recursos para empoderar a más mujeres en tu entorno (por ejemplo)."
  },
  {
    title: "Paso 5: Pasa por el IA Mentorship Helper",
    desc: "Colocá tus borradores de ensayos y enlaces en la pestaña 'Taller de Borrador'. Dejá que la IA analice, proponga mejoras y pula tus oraciones para que destaquen con términos oficiales de selección de AWS."
  },
  {
    title: "Paso 6: Envía con Confianza",
    desc: "¡Postulá sin miedo! El programa valora enormemente todas las iniciativas de aprendizaje (no hay que ser experto) y de empoderar a las minorías en el mundo AWS."
  }
];

export const USEFUL_LINKS: UsefulLink[] = [
  {
    id: "1",
    title: "Sitio Oficial de AWS Community Builders",
    description: "Portal principal del programa. Encontrá los requisitos oficiales, fechas de postulación y el enlace directo para enviar tu solicitud.",
    url: "https://aws.amazon.com/developer/community/community-builders/",
    category: "Ideas y Contenido"
  },
  {
    id: "2",
    title: "Aprendé Devops con Roxs",
    description: "Rossana Suarez es una AWS Hero y creadora de contenido. En su blog y canal de YouTube comparte tutoriales, tips y recursos para aprender y mejorar tus habilidades en AWS.",
    url: "https://90daysdevops.295devops.com/",
    category: "Ideas y Contenido"
  },
  {
    id: "3",
    title: "Desplegando Cloud - Marcia Villalba",
    description: "Blog de Marcia Villalba, donde comparte recursos en español para aprender Serverless y obtener tips sobre cómo ser un gran contribuidor técnico.",
    url: "https://desplegando.cloud/",
    category: "Creadores",
    author: "Marcia Villalba"
  },
  {
    id: "4",
    title: "AWS Skill Builder",
    description: "Plataforma de aprendizaje digital oficial de AWS. Cuenta con cientos de cursos gratuitos y rutas de formación para profundizar tus conocimientos técnicos antes de postularte.",
    url: "https://skillbuilder.aws/",
    category: "Cursos y Aprendizaje"
  },
  {
    id: "5",
    title: "Aprendé a Generar Contenido Técnico!! Septiembre 2026",
    description: "Bootcamp de creación de contenido pensado para nuevos builders o para aquellos que desean mejorar sus habilidades en la creación de contenido técnico.",
    url: "https://builder.aws.com/content/3Feqqc5fzBPdeh6fcFmVbtPF2sf/bootcamp-gratis-para-creacion-de-contenido-tecnico",
    category: "Comunidades"
  },
  {
    id: "6",
    title: "Dev.to - Comunidad de AWS Builders",
    description: "Espacio donde miles de desarrolladores publican contenido técnico de AWS y de otras tecnologías.",
    url: "https://dev.to/aws-builders",
    category: "Ideas y Contenido"
  },
  {
    id: "7",
    title: "Canal de YouTube de AWS Developers",
    description: "Contenido oficial de AWS para developers y entusiastas cloud.",
    url: "https://www.youtube.com/@awsdevelopers",
    category: "Cursos y Aprendizaje"
  },
  {
    id: "8",
    title: "Rossana Suarez",
    description: "Encontrás todo el power de Roxs y su generosidad de compartir conocimiento en AWS",
    url: "https://www.roxs.dev/",
    category: "Creadores",
    author: "Rossana Suarez"
  },
  {
    id: "9",
    title: "ServerlessLand",
    description: "Es un portal oficial de AWS donde podes encontrar tutoriales de AWS sobre todo el mundo Serverless.",
    url: "https://serverlessland.com/",
    category: "Ideas y Contenido",
    author: "AWS"
  },
  {
    id: "10",
    title: "Nacion Cloud - El Capitan",
    description: "Es un canal de YouTube donde podrás aprender sobre contenedores.",
    url: "https://www.youtube.com/@NacionCloud",
    category: "Creadores",
    author: "Max Zeballos"
  },
  {
    id: "11",
    title: "Blog Eli Fuentes - AWS",
    description: "Web con contenido sobre GenAI y Machine Learning de Eli Fuentes Leone - AWS Developer Advocate.",
    url: "https://elifuentes.tech/",
    category: "Creadores",
    author: "Elizabeth Fuentes Leone"
  }
];

