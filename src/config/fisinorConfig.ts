export interface FisinorConfig {
  brand: BrandConfig
  topBar: TopBarConfig
  header: HeaderConfig
  hero: HeroConfig
  about: AboutConfig
  researchUnits: ResearchUnitConfig[]
  pressCenter: PressCenterConfig
  testimonials: TestimonialConfig[]
  footer: FooterConfig
  employeePortal: EmployeePortalConfig
  images: ImageLibrary
  anomalyReportForm: AnomalyReportFormConfig
}

export interface BrandConfig {
  name: string
  shortName: string
  fullName: string
  slogan: string
  rfc: string
  year: number
  headquarters: string
  address: string
  colors: Record<string, string>
}

export interface TopBarConfig {
  systemStatus: string
  ticker: string[]
  languageLabel: string
  languages: string[]
}

export interface HeaderConfig {
  nav: HeaderNavItem[]
  employeePortalLabel: string
}

export interface HeaderNavItem {
  label: string
  href: string
  children?: HeaderNavItem[]
}

export interface HeroConfig {
  eyebrow: string
  headline: string
  subheadline: string
  ctaPrimary: { label: string; href: string }
  ctaSecondary: { label: string; href: string }
  backgroundImage: string
  backgroundAlt: string
  floatingCards: HeroFloatingCard[]
}

export interface HeroFloatingCard {
  id: string
  title: string
  description: string
  href: string
}

export interface AboutConfig {
  sectionLabel: string
  headline: string
  director: {
    name: string
    title: string
    quote: string
    credentials: string
    image: string
  }
  stats: AboutStat[]
  image: string
  imageAlt: string
  paragraphs: string[]
}

export interface AboutStat {
  value: string
  label: string
}

export interface ResearchUnitConfig {
  id: string
  title: string
  subtitle: string
  description: string
  image: string
  imageAlt: string
  cta: string
}

export interface PressCenterConfig {
  sectionLabel: string
  headline: string
  cards: PressCardConfig[]
}

export interface PressCardConfig {
  id: string
  tag: string
  date: string
  title: string
  summary: string
  image: string
  imageAlt: string
  cta: string
  href: string
  highlight?: boolean
  status?: string
}

export interface TestimonialConfig {
  id: string
  quote: string
  author: string
  role: string
  context: string
  image: string
}

export interface FooterConfig {
  company: FooterCompanyConfig
  columns: FooterColumnConfig[]
  certifications: CertificationConfig[]
  legal: LegalConfig
}

export interface FooterCompanyConfig {
  description: string
  address: string
  phone: string
  email: string
}

export interface FooterColumnConfig {
  title: string
  links: { label: string; href: string }[]
}

export interface CertificationConfig {
  name: string
  code: string
}

export interface LegalConfig {
  privacyNotice: string
  dnaClause: string
  copyright: string
  links: { label: string; href: string }[]
}

export interface EmployeePortalConfig {
  title: string
  subtitle: string
  usernameLabel: string
  passwordLabel: string
  submitLabel: string
  closeLabel: string
}

export interface ImageLibrary {
  hero: string
  about: string
  researchThermal: string
  researchTissue: string
  researchGenomic: string
  pressHydra: string
  pressBiometric: string
  pressUniversity: string
  testimonialA: string
  testimonialB: string
  testimonialC: string
}

export interface AnomalyReportFormConfig {
  brand: {
    shortName: string
    fullName: string
    logo: string
    backToMainLabel: string
  }
  header: {
    title: string
    formCode: string
    subtitle: string
    notice: {
      icon: string
      title: string
      message: string
      confidentialityLevel: string
    }
  }
  sections: {
    notifier: {
      title: string
      description: string
      email: FieldConfig
      identifier: FieldConfig
      anonymity: {
        label: string
        helper: string
      }
    }
    sighting: {
      title: string
      description: string
      location: SelectConfig
      relation: SelectConfig
    }
    anomalies: {
      title: string
      description: string
      options: AnomalyOptionConfig[]
    }
    evidence: {
      title: string
      description: string
      dropzone: {
        iconLabel: string
        primaryText: string
        secondaryText: string
        supportedFormats: string
        maxFiles: number
        maxFilesLabel: string
        acceptFormats: string
        previewLabel: string
        removeLabel: string
      }
    }
    observations: {
      title: string
      description: string
      field: {
        id: string
        label: string
        placeholder: string
        helper: string
        maxLength: number
      }
    }
    submit: {
      label: string
      unit: string
      helper: string
    }
  }
  footer: {
    privacyNote: string
    clientPortalLink: {
      text: string
      href: string
    }
    copyright: string
  }
}

export interface FieldConfig {
  id: string
  label: string
  placeholder: string
  helper: string
  required: boolean
}

export interface SelectConfig {
  id: string
  label: string
  placeholder: string
  required: boolean
  options: SelectOptionConfig[]
}

export interface SelectOptionConfig {
  value: string
  label: string
}

export interface AnomalyOptionConfig {
  id: string
  label: string
  help: string
}

export const fisinorConfig: FisinorConfig = {
  brand: {
    name: 'FISINOR S.A. de C.V.',
    shortName: 'FISINOR',
    fullName: 'Fisiología e Ingeniería Sintética del Noroeste',
    slogan: 'Pioneros en la modificación y aumentación del cuerpo humano en el noroeste.',
    rfc: 'FIS160203I98',
    year: 1987,
    headquarters: 'Complejo Norte, Hermosillo, Sonora',
    address: 'Blvd. Luis Encinas J. 100, Centro de Investigación Confidencial, 83000 Hermosillo, Sonora, México',
    colors: {
      white: '#FFFFFF',
      hospital: '#F1F5F9',
      cyan: '#00A8CC',
      desert: '#FF9F1C',
      dark: '#0F172A',
      slate: '#334155',
    },
  },

  topBar: {
    systemStatus: 'SISTEMAS PARA SUSCRIPTORES Y EMPLEADOS | ACTIVO [HERMOSILLO]',
    ticker: [
      'HydraSoma: pausa temporal de la campaña gratuita por reabastecimiento —',
      'Circular de información civil vigente —',
      'Convenio UNISON-FISINOR: 37 años de investigación conjunta —',
      'Sujetos del lote TITAN-0012 comienzan recuperación —',
      'Campus Obregon registra 41.2°C; protocolos de resistencia térmica activados —',
    ],
    languageLabel: 'Idioma',
    languages: ['ES', 'EN'],
  },

  header: {
    nav: [
      { label: 'Inicio', href: '#inicio' },
      {
        label: 'Nosotros',
        href: '#nosotros',
        children: [
          { label: 'Historia', href: '#historia' },
          { label: 'Liderazgo', href: '#liderazgo' },
          { label: 'Impacto Regional', href: '#impacto' },
        ],
      },
      {
        label: 'Investigación',
        href: '#investigacion',
        children: [
          { label: 'Adaptación Térmica', href: '#adaptacion-termica' },
          { label: 'Biomecánica Tisular', href: '#biomecanica-tisular' },
          { label: 'Genómica Celular', href: '#genomica-celular' },
        ],
      },
      { label: 'Prensa y Avisos', href: '#prensa' },
      { label: 'Sostenibilidad', href: '#sostenibilidad' },
      { label: 'Contacto', href: '#contacto' },
    ],
    employeePortalLabel: 'Acceder al portal',
  },

  hero: {
    eyebrow: 'Medicina · Ingeniería Sintética · Adaptación Genética',
    headline: 'Pioneros en la modificación del cuerpo humano en el noroeste.',
    subheadline:
      'Desde 1987, FISINOR desarrolla soluciones de bio-resiliencia para los cuerpos y comunidades que viven bajo el estrés radiante del desierto sonorense. Nuestra ciencia es confiable, medible y estrictamente confidencial.',
    ctaPrimary: { label: 'Conoce nuestro trabajo', href: '#investigacion' },
    ctaSecondary: { label: 'Avisos comunitarios', href: '#prensa' },
    backgroundImage: '/img/fisinor_landing.jpeg',
    backgroundAlt: 'Investigador en laboratorio de biotecnología con iluminación azul institucional',
    floatingCards: [
      {
        id: 'card-hydra',
        title: 'HydroSoma',
        description: 'El suplemento mas poderoso en hidratación aumentada para ambientes extremos.',
        href: '#prensa',
      },
      {
        id: 'card-biometric',
        title: 'La nueva generación de super-humanos',
        description: 'Llevamos años perfeccionando el programa TITAN v2. ¿Quieres formar parte?',
        href: '#prensa',
      },
      {
        id: 'card-unison',
        title: 'Convenio UNISON',
        description: 'Investigación avanzada en conjunto con la Universidad de Sonora.',
        href: '#prensa',
      },
    ],
  },

  about: {
    sectionLabel: 'Nosotros',
    headline: 'Ciencia superaumentada, nacida del calor del Noroeste.',
    director: {
      name: 'Dr. Martin Vásquez Woolfolk',
      title: 'Director Ejecutivo y Fundador',
      credentials: 'Ph.D. Ingenieria en Mecanica de Tejidos — UNAM / UNISON',
      quote:
        'El calor de Sonora no es un obstáculo; es nuestro laboratorio. En FISINOR transformamos la desventaja de las altas temperaturas en oportunidades de vida para quienes la necesitan.',
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=80',
    },
    stats: [
      { value: '50+', label: 'Años de investigación' },
      { value: '500+', label: 'Especialistas en piso' },
      { value: '14', label: 'Servicios de investigación' },
      { value: '3', label: 'Centros de investigación' },
      { value: "250,000+", label: 'Clientes satisfechos' },
    ],
    image: '/img/fisinor_lobby.jpeg',
    imageAlt: 'Complejo corporativo de investigación biotecnológica bajo el cielo del noroeste',
    paragraphs: [
      'FISINOR S.A. de C.V. es una empresa de biotecnología y fisiología aplicada con sede en Hermosillo, Sonora. Operamos bajo los más altos estándares de calidad, trazabilidad y confidencialidad institucional, sirviendo a sectores de salud, industrias de alto rendimiento y organismos gubernamentales de la región.',
      'Nuestro modelo de investigación cree en que la siguiente generacion de ciencias aplicadas para el genoma humano es la respuesta para la resiliencia de las personas. Nuestros laboratorios cuentan con los estandares mas altos en la industria, asi como con las practicas de confidencialidad y etica vanguardistas en la rgion.',
        'Con nuestros avances en biomecánica tisular, expansion de las capacidades humanas y la genómica celular tenemos la oportunidad  para producir soluciones de soporte vital, neural, psicologica y fisiológica de nuestros clientes. Cada lote, cada protocolo y cada sujeto de seguimiento es minuciosamente monitoreado y registrado en nuestros sistemas de auditoría de clase institucional, para asi poder brindar el servicio superior que nuestros clientes necesitan.',
    ],
  },

  researchUnits: [
    {
      id: 'adaptacion-termica',
      title: 'Productos Vanguardistas',
      subtitle: 'Opciones de grado consumidor',
      description:
        'Nosotros iniciamos creando soluciones para el calor extremo en las regiones mas aridas de Sonora y el mundo, pero no nos quedamos ahi. Dimos un paso adelante para desarrollar las soluciones biologicas mas avanzadas del mercado. Haz que el acercamiento quirurgico a tu cuerpo se mas faicl que nunca. Conoce nuestros productos de grado consumidor y nuestra tienda en linea.',
      image: '/img/fisinor_products.jpeg',
      imageAlt: 'Dunas de desierto bajo luz solar intensa, representando el estrés térmico del noroeste',
      cta: 'Conoce nuestros productos',
    },
    {
      id: 'biomecanica-tisular',
      title: 'Servicios de Aumentación Humana',
      subtitle: 'Brindados por especialistas calificados',
      description:
        'Nuestros servicios de aumentación humana son una serie de protocolos y modificaciones corporales que brindan a tu cuerpo nuestros avances en biomedicina y mecanica tisular mas avanzados y potentes. Especiales para los que quieres lograr mas con menos. Estos servicios son brindados por especialistas calificados y con experiencia en el campo de la ingenieria genetica. ¿Te interesa hacer de tu cuerpo un supercuerpo?',
      image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=900&q=80',
      imageAlt: 'Microscopio de laboratorio analizando muestra tisular',
      cta: 'Conocer nuestros servicios',
    },
    {
      id: 'genomica-celular',
      title: 'Programas de Experimentación',
      subtitle: 'Programas de Duplicación Asistida y Potenciamiento',
      description:
        'El departamento de Desarrollo e Investigación de FISINOR permite la ejecución de programas que cimientan la fundación de nuestros productos al mundo. Encargados de teorizar, probar y validar cada proyecto realizado en la institucion, tambien son los encargados del reclutamiento para entidades de prueba. Siempre manteniendo la etica y confianza que tanto agrada a nuestros clientes. ¿Te interesa formar parte de nuestros programas de experimentación? Contáctanos para más información.',
      image: '/img/fisinor_reclutamiento.jpeg',
      imageAlt: 'Investigador examinando muestra con microscopio en laboratorio de genómica',
      cta: 'Saber más',
    },
  ],

  pressCenter: {
    sectionLabel: 'Centro de Prensa y Avisos Comunitarios',
    headline: 'Comunicados institucionales del campus.',
    cards: [
      {
        id: 'hydra-soma',
        tag: 'Producto institucional',
        date: '26 de agosto de 2026',
        title: 'Estatus Campaña HydroSoma: Pausa Temporal por Reabastecimiento',
        summary:
          'La bebida oficial de hidratación celular del campus se encuentra temporalmente agotada en los puntos de distribución. Se solicita a personal y visitantes no ingerir productos de lotes anteriores al 07/2024. El reabastecimiento está programado para el siguiente ciclo operativo.',
        image: '/img/resupply-unison.jpeg',
        imageAlt: 'Atleta hidratándose bajo la luz solar del desierto',
        cta: 'Leer circular completa',
        href: '#avisos-hydra',
        highlight: true,
        status: 'TEMPORALMENTE AGOTADA',
      },
      {
        id: 'biometrica',
        tag: 'Garantía de calidad',
        date: '24 de agosto de 2026',
        title: 'Circular de Verificación Biométrica y Control de Calidad',
        summary:
          'El Programa de Garantía de Calidad Biométrica permanece activo. Si detecta inconsistencias fenotípicas, duplicados morfológicos o comportamientos fuera de perfil en colaboradores o contratistas, su reporte ayuda a preservar la pureza operativa del campus.',
        image: 'https://images.unsplash.com/photo-1628595351029-c2bf17511435?auto=format&fit=crop&w=800&q=80',
        imageAlt: 'Representación abstracta de identidad genética y trazabilidad',
        cta: 'Acceder al programa',
        href: '#programa-biometrico',
      },
      {
        id: 'unison',
        tag: 'Alianza académica',
        date: '18 de agosto de 2026',
        title: 'Convenio de Investigación Avanzada con la Universidad de Sonora',
        summary:
          'FISINOR y la Universidad de Sonora renuevan su convenio de investigación aplicada, enfocado en bio-resiliencia climática, soporte térmico extremo y protocolos de continuidad fisiológica para la región noroeste de México.',
        image: '/img/unison_convenio.jpeg',
        imageAlt: 'Edificio universitario bajo el cielo del desierto de Sonora',
        cta: 'Leer comunicado',
        href: '#convenio-unison',
      },
    ],
  },

  testimonials: [
    {
      id: 't1',
      quote:
        'Después del programa de soporte térmico con Bio-Sinter, puedo entrenar a las 14:00 h en Hermosillo sin colapsar. Mis marcadores de hidratación se mantienen estables incluso en días de 45°C.',
      author: 'César Eduardo Ríos',
      role: 'Atleta de ultradistancia',
      context: 'Programa de Adaptación Térmica FISINOR, 2025',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=400&q=80',
    },
    {
      id: 't2',
      quote:
        'La integración fue difícil de explicar con palabras, pero la continuidad de mi movimiento regresó. El equipo de FISINOR me trató con la precisión de un laboratorio y la calidez de un hospital.',
      author: 'Dra. Mariana Félix Duarte',
      role: 'Médica especialista en rehabilitación',
      context: 'Unidad de Biomecánica Tisular, 2024',
      image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=400&q=80',
    },
    {
      id: 't3',
      quote:
        'Mi padre recibió soporte de hidratación celular durante una temporada de olas de calor. Los técnicos nunca nos explicaron del todo qué tenía el líquido, pero su recuperación fue inmediata.',
      author: 'Familia Vargas López',
      role: 'Beneficiarios del programa HydraSoma',
      context: 'Campus Norte, 2023',
      image: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=400&q=80',
    },
  ],

  footer: {
    company: {
      description:
        'Fisiología e Ingeniería Sintética del Noroeste. Ciencia institucional, bio-resiliencia y continuidad de vida bajo el sol de Sonora.',
      address: 'Blvd. Luis Encinas J. 100, Centro de Investigación, 83000 Hermosillo, Sonora, México',
      phone: '+52 (662) 123 4567',
      email: 'comunicacion@fisinor.mx',
    },
    columns: [
      {
        title: 'División',
        links: [
          { label: 'Adaptación Térmica', href: '#adaptacion-termica' },
          { label: 'Biomecánica Tisular', href: '#biomecanica-tisular' },
          { label: 'Genómica Celular', href: '#genomica-celular' },
          { label: 'HydraSoma', href: '#prensa' },
        ],
      },
      {
        title: 'Corporativo',
        links: [
          { label: 'Nosotros', href: '#nosotros' },
          { label: 'Liderazgo', href: '#liderazgo' },
          { label: 'Prensa y Avisos', href: '#prensa' },
          { label: 'Sostenibilidad', href: '#sostenibilidad' },
        ],
      },
      {
        title: 'Legal',
        links: [
          { label: 'Aviso de Privacidad', href: '#privacidad' },
          { label: 'Términos de Integración', href: '#terminos' },
          { label: 'Ética e Investigación', href: '#etica' },
          { label: 'Contacto de Bioética', href: '#bioetica' },
        ],
      },
    ],
    certifications: [
      { name: 'COFEPRIS Bio-Avanzada', code: 'CBF-2024-4417' },
      { name: 'ISO 9001:2026', code: 'SNC-9981-Ω' },
      { name: 'Norma de Identidad Genética', code: 'NIG-07/24' },
      { name: 'Buenas Prácticas de Bioseguridad', code: 'BPB-HS-2025' },
    ],
    legal: {
      privacyNotice:
        'Al acceder a este sitio, usted acepta que FISINOR puede recolectar, almacenar y replicar datos biométricos, epigenéticos y conductuales con fines de calidad, seguridad y continuidad operativa. La información de ADN no se elimina; se archiva.',
      dnaClause:
        'Su huella genética queda registrada automáticamente en nuestros servidores de Hermosillo. El solicitante tiene 72 horas para reclamar la propiedad de su secuencia antes de que entre en proceso de anonimización irreversible. La continuación de la navegación constituye consentimiento implícito.',
      copyright: '© FISINOR S.A. de C.V. Todos los derechos reservados.',
      links: [
        { label: 'Aviso de Privacidad Genético', href: '#privacidad' },
        { label: 'Términos de Integración', href: '#terminos' },
        { label: 'Mapa del Campus', href: '#mapa' },
        { label: 'Portal de Empleados', href: '#portal' },
      ],
    },
  },

  employeePortal: {
    title: 'Portal de Empleados FISINOR',
    subtitle: 'Acceso restringido a personal autorizado y sus extensiones registradas.',
    usernameLabel: 'ID de Empleado / Código de Sujeto',
    passwordLabel: 'Clave de Acceso Biométrica',
    submitLabel: 'Ingresar al sistema',
    closeLabel: 'Cerrar',
  },

  images: {
    hero: 'https://images.unsplash.com/photo-1581093458791-9d42e3c7e117?auto=format&fit=crop&w=1920&q=85',
    about: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=85',
    researchThermal: 'https://images.unsplash.com/photo-1504386106331-3e4e71712b10?auto=format&fit=crop&w=900&q=80',
    researchTissue: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=900&q=80',
    researchGenomic: 'https://images.unsplash.com/photo-1579684385127-1ef2f7287c45?auto=format&fit=crop&w=900&q=80',
    pressHydra: 'https://images.unsplash.com/photo-1552674605-5d2262cab4e5?auto=format&fit=crop&w=800&q=80',
    pressBiometric: 'https://images.unsplash.com/photo-1628595351029-c2bf17511435?auto=format&fit=crop&w=800&q=80',
    pressUniversity: 'https://images.unsplash.com/photo-1547234935-80c7142ee969?auto=format&fit=crop&w=800&q=80',
    testimonialA: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=400&q=80',
    testimonialB: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=400&q=80',
    testimonialC: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=400&q=80',
  },

  anomalyReportForm: {
    brand: {
      shortName: 'FISINOR',
      fullName: 'Fisiología e Ingeniería Sintética del Noroeste',
      logo: '/img/icon_fisinor.png',
      backToMainLabel: 'Ir al sitio web principal',
    },
    header: {
      title: 'Programa de Aseguramiento de Calidad',
      formCode: 'PUBLICO',
      subtitle:
        'Formulario Oficial de Notificación de Inconsistencias en Personas Clonadas',
      notice: {
        icon: 'info',
        title: '',
        message: "El siguiente formulario tiene como finalidad la recolección de hallazgos anormales en el comportamiento de las entidades del programa de clonación. Si usted o algun conocido ha tenido avistamientos de personas duplicadas con comportamientos altamente inhumanos, porfavor envie este reporte.",
        /*message:
          'Si ha observado un comportamiento anómalo o una persona idéntica a un conocido en el campus o la vía pública, complete este formulario de inmediato.',*/
        confidentialityLevel: '',
      },
    },
    sections: {
      notifier: {
        title: 'Identificación del Notificante',
        description: 'Los datos de contacto se utilizan exclusivamente para el tramite del expediente.',
        email: {
          id: 'notifierEmail',
          label: 'Correo Electrónico',
          placeholder: 'notificante@institucion.mx',
          helper: 'Para seguimiento del caso',
          required: true,
        },
        identifier: {
          id: 'notifierIdentifier',
          label: 'Nombre o alias / Codigo de Empleado',
          placeholder: 'Ej. HMO-0001 o algun apodo',
          helper: 'Opcional. Deje en blanco si desea anonimato.',
          required: false,
        },
        anonymity: {
          label: 'Ya he tenido acercamiento con FISINOR y sus servicios',
          helper: 'Marque en caso de existir en la base de datos de la empresa. Esto nos permitirá brindarle una atencion mas personalizada.',
        },
      },
      sighting: {
        title: 'Datos del Avistamiento',
        description: 'Seleccione la ubicación del avistamiento y su relación con el ente reportado.',
        location: {
          id: 'sightingLocation',
          label: 'Ubicación del avistamiento',
          placeholder: 'Seleccione la ubicación',
          required: true,
          options: [
            { value: 'unison-campus', label: 'Universidad de Sonora - Campus Hermosillo' },
            { value: 'centro-artes', label: 'Centro de las Artes' },
            { value: 'via-publica', label: 'Vía Pública / Parada de Autobús' },
            { value: 'instalaciones-fisinor', label: 'Instalaciones FISINOR' },
            { value: 'complejo-norte', label: 'Complejo Norte - Zona de Investigación' },
            { value: 'otro', label: 'Otro (especificar en observaciones)' },
          ],
        },
        relation: {
          id: 'subjectRelation',
          label: 'Relación con el sujeto observado',
          placeholder: 'Seleccione la relación',
          required: true,
          options: [
            { value: 'companero', label: 'Compañero / Conocido' },
            { value: 'docente-personal', label: 'Docente / Personal' },
            { value: 'desconocido', label: 'Desconocido / Transeúnte' },
            { value: 'familiar', label: 'Familiar' },
            { value: 'paciente', label: 'Paciente / Sujeto de seguimiento' },
          ],
        },
      },
      anomalies: {
        title: 'Anomalias Observadas',
        description: 'Seleccione todos los indicadores que apliquen.',
        options: [
          {
            id: 'no-blinking',
            label: 'Ausencia total de parpadeo por lapsos prolongados (>3 min).',
            help: 'Signo de baja actividad neuronal.',
          },
          {
            id: 'low-temperature',
            label: 'Temperatura corporal anormalmente baja o sin sudoración ante exposición solar.',
            help: 'Indicador de disfunción termorreguladora.',
          },
          {
            id: 'void-stare',
            label: 'Mirada fija hacia muros, esquinas o espacios vacíos.',
            help: 'Errores en conducta de procesamiento externo.',
          },
          {
            id: 'automated-responses',
            label: 'Respuestas automatizadas o repetitivas.',
            help: 'Posible fallo de memoria epigenética.',
          },
          {
            id: 'metallic-odor',
            label: 'Emanación de olor antiséptico (similar a antibacterial).',
            help: 'Puede indicar residuos de solución de preservación tisular.',
          },
          {
            id: 'synchronized-movement',
            label: 'Movimientos sincronizados con otros sujetos en proximidad.',
            help: 'Patrón de enjambre de comportamiento, indica fallo en autonomía de control motor.',
          },
          {
            id: 'facial-recognition-failure',
            label: 'Reconocimiento facial inconsistente.',
            help: 'El sujeto es incapaz de reconocer rostros familiares o conocidos.',
          },
          {
            id: 'voice-pitch',
            label: 'Cambios anormales en el tono de voz o timbre vocal.',
            help: 'Similares a pitidos o modulaciones de frecuencia inhumanas.',
          }
        ],
      },
      evidence: {
        title: 'Evidencia Fotográfica',
        description: 'No incluya fotografías de menores de edad ni datos personales sensibles.',
        dropzone: {
          iconLabel: 'Escáner / Cámara',
          primaryText: 'Arrastre aquí las fotografías',
          secondaryText: 'o haga clic para seleccionar archivos desde su dispositivo',
          supportedFormats: 'Formatos soportados: .jpg, .png, .raw, .dcm (máx. 25 MB por archivo)',
          maxFiles: 5,
          maxFilesLabel: 'Máximo 5 archivos',
          acceptFormats: '.jpg,.png,.raw,.dcm',
          previewLabel: 'Evidencia adjunta',
          removeLabel: 'Eliminar',
        },
      },
      observations: {
        title: 'Observaciones',
        description: 'Espacio para capturar cualquier detalle adicional del avistamiento.',
        field: {
          id: 'observations',
          label: 'Observaciones adicionales',
          placeholder:
            'Descripción del hallazgo y cualquier otro dato que considere relevante para el expediente.',
          helper: 'Texto libre. Este campo alimenta el expediente de seguimiento.',
          maxLength: 2000,
        },
      },
      submit: {
        label: 'Enviar',
        unit: '',
        helper: 'Al enviar, usted acepta que la información se utilice para mejorar el servicio de clonación de personas.',
      },
    },
    footer: {
      privacyNote:
        'La información proporcionada se procesa bajo protocolos institucionales de estricta confidencialidad. En caso de requerir aclaraciones, utilice el portal de clientes para una atención más personalizada.',
      clientPortalLink: {
        text: 'portal de clientes',
        href: '/clientes.html',
      },
      copyright: '© FISINOR S.A. de C.V. Programa de Aseguramiento de Calidad.',
    },
  },
}
