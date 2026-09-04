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
  portalSelector: PortalSelectorConfig
  images: ImageLibrary
  anomalyReportForm: AnomalyReportFormConfig
  tienda: TiendaConfig
  distribucion: DistribucionConfig
}

export interface DistributionPointConfig {
  id: string
  name: string
  municipality: string
  lat: number
  lng: number
  address: string
  schedule: string
  phone: string
  status: 'active' | 'resupply' | 'unavailable'
  note: string
}

export interface DistributionStatConfig {
  id: string
  label: string
  value: string
}

export interface DistributionLegendConfig {
  id: DistributionPointConfig['status']
  label: string
}

export interface DistribucionConfig {
  brandTitle: string
  brandSubtitle: string
  backLabel: string
  footerNote: string
  apiEndpoint: string
  center: { lat: number; lng: number }
  zoom: number
  legend: DistributionLegendConfig[]
  program: {
    title: string
    paragraphs: string[]
    stats: DistributionStatConfig[]
    dataSourceApi: string
  }
  panel: {
    pointsLabel: string
    pointCountLabel: string
    selectHint: string
    addressLabel: string
    scheduleLabel: string
    phoneLabel: string
    statusLabels: Record<DistributionPointConfig['status'], string>
    showPanelsLabel: string
    hidePanelsLabel: string
    formTitle: string
    formFields: {
      name: TiendaFieldConfig
      address: TiendaFieldConfig
      schedule: TiendaFieldConfig
      phone: TiendaFieldConfig
      note: TiendaFieldConfig
    }
    statusFieldLabel: string
    savePointLabel: string
    cancelLabel: string
    deletePointLabel: string
  }
}

export interface TiendaCategory {
  id: string
  label: string
}

export interface TiendaProductReview {
  author: string
  rating: number
  comment: string | null
}

export interface TiendaProduct {
  id: string
  code: string
  name: string
  categoryId: string
  price: number
  unit: string
  stock: 'available' | 'soldout'
  blurb: string
  detail: string
  features: string[]
  origin: string
  rating: number
  reviewCount: number
  imageUrl?: string
  reviews?: TiendaProductReview[]
}

export interface TiendaFieldConfig {
  label: string
  placeholder: string
}

export interface TiendaConfig {
  brandTitle: string
  brandSubtitle: string
  backLabel: string
  notice: string
  loginLabel: string
  demoSessionLabel: string
  logoutLabel: string
  cartLabel: string
  cartEmptyText: string
  filterAllLabel: string
  addToCartLabel: string
  soldOutLabel: string
  availableLabel: string
  checkoutLabel: string
  footerNote: string
  loginHref: string
  registerHref: string
  session: {
    loginLabel: string
    logoutLabel: string
    modalTitle: string
    modalText: string
    identifierLabel: string
    identifierPlaceholder: string
    passwordLabel: string
    passwordPlaceholder: string
    submitLabel: string
    submittingLabel: string
    errorFallback: string
    registerText: string
    registerLabel: string
  }
  categories: TiendaCategory[]
  products: TiendaProduct[]
  checkout: {
    title: string
    steps: string[]
    accountTitle: string
    accountText: string
    accountLoginLabel: string
    accountRegisterText: string
    accountRegisterLabel: string
    accountDemoLabel: string
    accountDemoNote: string
    shippingTitle: string
    shippingFields: Record<'name' | 'address' | 'sector' | 'city' | 'zip' | 'phone', TiendaFieldConfig>
    paymentTitle: string
    paymentFields: Record<'cardNumber' | 'cardExpiry' | 'cardCvc' | 'cardHolder', TiendaFieldConfig>
    orderSummaryLabel: string
    payLabel: string
    processingLabel: string
    confirmationTitle: string
    confirmationText: string
    continueLabel: string
  }
  detail: {
    breadcrumbHome: string
    galleryLabels: string[]
    ratingLabel: string
    qtyLabel: string
    soldOutNote: string
    notifyLabel: string
    notifyDone: string
    aboutTitle: string
    specsTitle: string
    specsLabels: Record<
      'code' | 'category' | 'unit' | 'origin' | 'classification' | 'registry',
      string
    >
    registryPrefix: string
    deliveryNote: string
    relatedTitle: string
    backLabel: string
  }
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

export interface PortalSelectorConfig {
  title: string
  subtitle: string
  options: PortalOptionConfig[]
}

export interface PortalOptionConfig {
  id: string
  title: string
  description: string
  cta: string
  icon: 'user' | 'badge'
  accent: 'cyan' | 'dark'
  action: 'modal' | 'link'
  href?: string
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
    systemStatus: 'PORTALES PARA SUSCRIPTORES Y EMPLEADOS | ACTIVO [HERMOSILLO]',
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
        href: '#nosotros'
      },
      {
        label: 'Investigación',
        href: '#investigacion',
        children: [
          { label: 'Productos', href: '#adaptacion-termica' },
          { label: 'Servicios', href: '#biomecanica-tisular' },
          { label: 'Programas', href: '#genomica-celular' },
        ],
      },
      { label: 'Prensa y Avisos', href: '#prensa' },
      { label: 'Contacto', href: '#contacto' },
      { label: 'Tienda', href: '/tienda.html' },
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

  portalSelector: {
    title: 'Acceso a Portales Institucionales',
    subtitle:
      'Seleccione el portal correspondiente a su perfil.',
    options: [
      {
        id: 'clients',
        title: 'Portal de Clientes/Suscriptores',
        description:
          'Espacio para suscriptores activos de nuestros programas: consulte el estado de su expediente y de seguimiento a sus compras y servicios.',
        cta: 'Ingresar como cliente',
        icon: 'user',
        accent: 'cyan',
        action: 'link',
        href: import.meta.env.VITE_CLIENTS_PORTAL_URL ?? 'http://localhost:5181/',
      },
      {
        id: 'employees',
        title: 'Portal de Empleados',
        description:
          'Sistema exclusivo para el personal de la empresa. Su acceso requiere conexion a la red privada virtual de KIARA AI y credenciales de empleado.',
        cta: 'Ingresar como empleado',
        icon: 'badge',
        accent: 'dark',
        action: 'link',
        href: import.meta.env.VITE_EMPLOYEES_PORTAL_URL ?? 'http://localhost:5182/',
      },
    ],
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

  tienda: {
    brandTitle: 'Tienda Oficial FISINOR',
    brandSubtitle: 'Productos de grado consumidor · Entregas en Sonora',
    backLabel: 'Volver al sitio',
    notice:
      'Aviso: HydraSoma permanece temporalmente agotada por reabastecimiento. Gracias por su paciencia.',
    loginLabel: 'Acceder',
    demoSessionLabel: 'Sesión demo',
    logoutLabel: 'Cerrar sesión',
    cartLabel: 'Carrito',
    cartEmptyText: 'Tu carrito está vacío.',
    filterAllLabel: 'Todos',
    addToCartLabel: 'Añadir al carrito',
    soldOutLabel: 'AGOTADO',
    availableLabel: 'Disponible',
    checkoutLabel: 'Proceder al pago',
    footerNote:
      '© FISINOR S.A. de C.V. Tienda oficial de grado consumidor. Todos los productos están sujetos a disponibilidad y a los Términos de Integración.',
    loginHref: import.meta.env.VITE_CLIENTS_PORTAL_URL ?? 'http://localhost:5181/',
    registerHref: `${import.meta.env.VITE_CLIENTS_PORTAL_URL ?? 'http://localhost:5181/'}register`,
    session: {
      loginLabel: 'Acceder',
      logoutLabel: 'Cerrar sesión',
      modalTitle: 'Inicia sesión como cliente de FISINOR',
      modalText:
        'Ingresa con tus credenciales de cliente de FISINOR — las mismas de tu cuenta en el Portal de Clientes. La sesión se comparte entre la tienda y el portal, así que puedes iniciar aquí y seguir en el portal.',
      identifierLabel: 'Correo o usuario',
      identifierPlaceholder: 'nombre@correo.com · usuario.fisinor',
      passwordLabel: 'Contraseña',
      passwordPlaceholder: 'Tu contraseña',
      submitLabel: 'Iniciar sesión',
      submittingLabel: 'Verificando...',
      errorFallback: 'No se pudo iniciar sesión. Verifica tus credenciales.',
      registerText: '¿Aún no tienes cuenta?',
      registerLabel: 'Regístrate en el Portal de Clientes',
    },
    categories: [
      { id: 'hidratacion', label: 'Hidratación' },
      { id: 'rendimiento', label: 'Rendimiento Físico' },
      { id: 'cuidado', label: 'Cuidado Personal' },
      { id: 'estilo', label: 'Estilo de Vida' },
    ],
    products: [
      {
        id: 'p-hs-1l',
        code: 'HS-1L',
        name: 'HydraSoma Botella 1 L',
        categoryId: 'hidratacion',
        price: 349,
        unit: 'botella',
        stock: 'soldout',
        blurb: 'La bebida oficial de hidratación celular del campus.',
        detail:
          'HydraSoma es la bebida de hidratación celular insignia de FISINOR, formulada con la matriz de biopolímero activo patentada por nuestros laboratorios y electrolitos bio-orgánicos de liberación gradual. Diseñada para mantener el equilibrio hídrico del cuerpo bajo radiación extrema, es la opción preferida por atletas, trabajadores de campo y suscriptores del programa de adapción térmica.',
        features: [
          'Matriz de biopolímero activo patentada por FISINOR',
          'Electrolitos bio-orgánicos de liberación gradual',
          'Sabor natural a cítricos del desierto',
          'Envase retornable de 1 litro con sello de trazabilidad',
        ],
        origin: 'Planta Central Hermosillo',
        rating: 4.8,
        reviewCount: 1243,
      },
      {
        id: 'p-hs-6pk',
        code: 'HS-6PK',
        name: 'HydraSoma Pack Familiar (6 × 1 L)',
        categoryId: 'hidratacion',
        price: 1790,
        unit: 'pack',
        stock: 'soldout',
        blurb: 'Suministro mensual de hidratación aumentada para toda la familia.',
        detail:
          'El Pack Familiar reúne seis botellas de HydraSoma con descuento de suscripción, pensado para hogares completos expuestos a las temporadas de calor. Cada pack incluye una guía de consumo por edad y un accesorio de refrigeración para el traslado.',
        features: [
          'Seis botellas de 1 L con precio de suscripción',
          'Guía de consumo por edad incluida',
          'Accesorio de refrigeración para traslado',
          'Renovación automática opcional del pack',
        ],
        origin: 'Planta Central Hermosillo',
        rating: 4.7,
        reviewCount: 812,
      },
      {
        id: 'p-hs-sob',
        code: 'HS-SOB',
        name: 'HydraSoma Sobres Hidratantes (12 pzas)',
        categoryId: 'hidratacion',
        price: 289,
        unit: 'caja',
        stock: 'available',
        blurb: 'Formato de bolsillo para rehidratación inmediata bajo el sol de Sonora.',
        detail:
          'Los sobres hidratantes de HydraSoma concentran la misma fórmula de la bebida original en un polvo de disolución instantánea. Ideales para jornadas de campo, mochilas de emergencia y kits vehiculares: un sobre en medio litro de agua restaura el equilibrio hídrico en minutos.',
        features: [
          'Disolución instantánea en medio litro de agua',
          'Empaquetado individual resistente a humedad',
          '12 sobres por caja · hasta 6 litros de bebida',
          'Apto para kits de emergencia y mochilas de campo',
        ],
        origin: 'Planta Central Hermosillo',
        rating: 4.6,
        reviewCount: 389,
      },
      {
        id: 'p-bs-250',
        code: 'BS-250',
        name: 'Bio-Sinter Crema Térmica 250 g',
        categoryId: 'rendimiento',
        price: 529,
        unit: 'tubo',
        stock: 'soldout',
        blurb: 'Soporte térmico tópico para entrenamientos bajo radiación extrema.',
        detail:
          'Bio-Sinter Crema Térmica es el soporte tópico desarrollado junto al programa de adaptación térmica. Su aplicación antes de la exposición genera una capa bio-orgánica que ayuda a regular la temperatura superficial de la piel durante entrenamientos y jornadas de campo bajo radiación extrema.',
        features: [
          'Capa bio-orgánica reguladora de temperatura superficial',
          'Absorción rápida sin residuo graso',
          'Efecto de hasta 4 horas por aplicación',
          'Desarrollado junto al programa de adaptación térmica',
        ],
        origin: 'Laboratorio Bio-Sintético Norte',
        rating: 4.9,
        reviewCount: 967,
      },
      {
        id: 'p-bs-180',
        code: 'BS-180',
        name: 'Bio-Sinter Gel Recuperador 180 g',
        categoryId: 'rendimiento',
        price: 399,
        unit: 'tubo',
        stock: 'available',
        blurb: 'Gel frío de recuperación muscular con microcápsulas de liberación prolongada.',
        detail:
          'El Bio-Sinter Gel Recuperador aplica frío controlado mediante microcápsulas de liberación prolongada que acompañan la recuperación muscular después de la exposición al calor o de entrenamientos de alta exigencia. Recomendado por los fisioterapeutas del campus.',
        features: [
          'Microcápsulas de frío de liberación prolongada',
          'Alivio sostenido durante la noche',
          'Fórmula no grasa de rápida absorción',
          'Recomendado por fisioterapia del campus',
        ],
        origin: 'Laboratorio Bio-Sintético Norte',
        rating: 4.5,
        reviewCount: 431,
      },
      {
        id: 'p-tt-v2',
        code: 'TT-V2',
        name: 'Pulsera TITAN v2 de Monitoreo',
        categoryId: 'rendimiento',
        price: 4890,
        unit: 'pieza',
        stock: 'soldout',
        blurb: 'Monitoreo continuo de marcadores vitales sincronizado con su expediente.',
        detail:
          'La Pulsera TITAN v2 monitorea en continuo temperatura corporal, hidratación estimada y tasa de deriva personal, sincronizando los datos directamente con su expediente del Portal de Clientes. Incluye dos correas y base de carga magnética.',
        features: [
          'Monitoreo continuo de marcadores vitales',
          'Sincronización directa con su expediente del Portal de Clientes',
          'Alertas tempranas de estrés térmico',
          'Incluye 2 correas y base de carga magnética',
        ],
        origin: 'Laboratorio Bio-Sintético Norte',
        rating: 4.4,
        reviewCount: 158,
      },
      {
        id: 'p-pr-noc',
        code: 'PR-NOC',
        name: 'Parches de Recuperación Nocturna (8 pzas)',
        categoryId: 'rendimiento',
        price: 459,
        unit: 'caja',
        stock: 'soldout',
        blurb: 'Microdosis transdérmicas para regeneración durante el sueño.',
        detail:
          'Los parches de recuperación nocturna liberan microdosis transdérmicas de aminoácidos modificados durante las horas de sueño, apoyando los ciclos naturales de regeneración tisular. Un solo parche actúa durante la noche completa.',
        features: [
          'Liberación transdérmica durante 8 horas',
          'Aminoácidos modificados de grado consumo',
          'Hipoalergénico y libre de fragancias',
          'Caja con 8 parches de un solo uso',
        ],
        origin: 'Laboratorio Bio-Sintético Norte',
        rating: 4.3,
        reviewCount: 244,
      },
      {
        id: 'p-so-ojo',
        code: 'SO-OJO',
        name: 'Suero Ocular Ojo-Sintético',
        categoryId: 'cuidado',
        price: 689,
        unit: 'frasco',
        stock: 'soldout',
        blurb: 'Lubricación avanzada para ojos expuestos a polvo y radiación del desierto.',
        detail:
          'El Suero Ocular Ojo-Sintético replica la lágrima bio-orgánica desarrollada para los operadores de campo de FISINOR. Lubrica en profundidad, protege contra partículas de polvo del desierto y reduce la irritación por radiación y pantallas.',
        features: [
          'Réplica de lágrima bio-orgánica de uso profesional',
          'Protección contra polvo y radiación',
          'Aplicador de precisión sin contacto',
          'Frasco de 15 ml · hasta 90 aplicaciones',
        ],
        origin: 'Unidad Experimental Costa',
        rating: 4.6,
        reviewCount: 312,
      },
      {
        id: 'p-uv-plus',
        code: 'UV-PLUS',
        name: 'Crema Neutralizadora de Radiación UV+',
        categoryId: 'cuidado',
        price: 499,
        unit: 'tubo',
        stock: 'available',
        blurb: 'Pantalla bio-orgánica de amplio espectro para índices UV extremos.',
        detail:
          'La Crema Neutralizadora UV+ ofrece una pantalla bio-orgánica de amplio espectro probada bajo los índices de radiación extremos del desierto sonorense. Su textura ligera resiste el sudor y no deja residuo blanco, apta para uso diario de toda la familia.',
        features: [
          'Protección de amplio espectro para UV extremos',
          'Resistente al sudor y al agua por 80 minutos',
          'Textura ligera sin residuo blanco',
          'Apta para uso diario de toda la familia',
        ],
        origin: 'Unidad Experimental Costa',
        rating: 4.7,
        reviewCount: 528,
      },
      {
        id: 'p-kit-casa',
        code: 'KIT-CASA',
        name: 'Kit de Evaluación en Casa',
        categoryId: 'cuidado',
        price: 1290,
        unit: 'kit',
        stock: 'soldout',
        blurb: 'Toma de muestras y marcadores básicos con envío al laboratorio incluido.',
        detail:
          'El Kit de Evaluación en Casa permite tomar muestras y registrar marcadores básicos siguiendo la guía ilustrada incluida. El envío al laboratorio y la lectura de resultados en su expediente del Portal de Clientes están cubiertos por el precio del kit.',
        features: [
          'Toma de muestras guiada paso a paso',
          'Envío al laboratorio incluido',
          'Resultados integrados a su expediente en línea',
          'Incluye material para una evaluación completa',
        ],
        origin: 'Laboratorio Bio-Sintético Norte',
        rating: 4.2,
        reviewCount: 96,
      },
      {
        id: 'p-tr-900',
        code: 'TR-900',
        name: 'Termo Térmico Edición Campus 900 ml',
        categoryId: 'estilo',
        price: 549,
        unit: 'pieza',
        stock: 'soldout',
        blurb: 'Doble pared con grabado del hexagrama institucional.',
        detail:
          'El Termo Edición Campus mantiene bebidas frías hasta 24 horas y calientes hasta 12, con doble pared de acero inoxidable y el hexagrama institucional grabado por láser. Incluye tapón hermético con dosificador.',
        features: [
          'Doble pared de acero inoxidable',
          'Hasta 24 h frío · 12 h caliente',
          'Hexagrama institucional grabado por láser',
          'Tapón hermético con dosificador',
        ],
        origin: 'Planta Central Hermosillo',
        rating: 4.8,
        reviewCount: 674,
      },
      {
        id: 'p-ph-hom',
        code: 'PH-HOM',
        name: 'Playera "Personal Homologado"',
        categoryId: 'estilo',
        price: 349,
        unit: 'pieza',
        stock: 'available',
        blurb: 'Algodón orgánico sonorense con el sello de personal homologado.',
        detail:
          'La playera "Personal Homologado" está confeccionada en algodón orgánico sonorense con el sello institucional serigrafiado. Una prenda de compromiso para quienes forman parte —o sueñan con formar parte— de los programas de FISINOR.',
        features: [
          'Algodón orgánico 100% sonorense',
          'Sello institucional serigrafiado',
          'Tallas de la S a la XXL',
          'Lavado a máquina sin deterioro del sello',
        ],
        origin: 'Planta Central Hermosillo',
        rating: 4.9,
        reviewCount: 231,
      },
    ],
    checkout: {
      title: 'Finalizar compra',
      steps: ['Carrito', 'Cuenta FISINOR', 'Envío', 'Pago', 'Confirmación'],
      accountTitle: 'Identifícate con tu cuenta FISINOR',
      accountText:
        'Para completar tu compra necesitas iniciar sesión con tu cuenta de suscriptor del Portal de Clientes. Serás redirigido a la pantalla de acceso oficial.',
      accountLoginLabel: 'Iniciar sesión',
      accountRegisterText: '¿Aún no tienes cuenta?',
      accountRegisterLabel: 'Regístrate aquí',
      accountDemoLabel: 'Simular sesión iniciada (demo)',
      accountDemoNote: 'Modo de prueba: la sesión se simula localmente sin salir de la tienda.',
      shippingTitle: 'Datos de entrega',
      shippingFields: {
        name: { label: 'Nombre completo', placeholder: 'Nombre y apellidos' },
        address: { label: 'Dirección de entrega', placeholder: 'Calle, número, referencias' },
        sector: { label: 'Sector / Lote', placeholder: 'Ej. Sector 4 · Lote 12-B' },
        city: { label: 'Ciudad', placeholder: 'Ej. Hermosillo, Sonora' },
        zip: { label: 'Código postal', placeholder: 'Ej. 83000' },
        phone: { label: 'Teléfono de contacto', placeholder: 'Ej. 662 123 4567' },
      },
      paymentTitle: 'Pago seguro (simulado)',
      paymentFields: {
        cardNumber: { label: 'Número de tarjeta', placeholder: '•••• •••• •••• ••••' },
        cardExpiry: { label: 'Vencimiento', placeholder: 'MM/AA' },
        cardCvc: { label: 'CVV', placeholder: '•••' },
        cardHolder: { label: 'Titular de la tarjeta', placeholder: 'Como aparece en la tarjeta' },
      },
      orderSummaryLabel: 'Resumen del pedido',
      payLabel: 'Pagar',
      processingLabel: 'Procesando pago...',
      confirmationTitle: '¡Compra realizada!',
      confirmationText:
        'Tu pedido {folio} ha sido registrado. Recibirás la confirmación y el seguimiento de entrega en tu correo registrado.',
      continueLabel: 'Seguir comprando',
    },
    detail: {
      breadcrumbHome: 'Tienda',
      galleryLabels: ['FRENTE', 'DETALLE', 'ETIQUETA', 'USO'],
      ratingLabel: 'calificaciones',
      qtyLabel: 'Cantidad',
      soldOutNote: 'Producto temporalmente agotado. Déjanos notificarte cuando vuelva al inventario.',
      notifyLabel: 'Notificarme cuando esté disponible',
      notifyDone: 'Te notificaremos. Tu solicitud quedó registrada en el sistema.',
      aboutTitle: 'Acerca de este producto',
      specsTitle: 'Especificaciones',
      specsLabels: {
        code: 'Código',
        category: 'Categoría',
        unit: 'Presentación',
        origin: 'Origen',
        classification: 'Disponibilidad',
        registry: 'Registro sanitario',
      },
      registryPrefix: 'REG-FIS-2026-',
      deliveryNote: 'Entrega estimada: 3 a 5 días hábiles en Hermosillo y zona metropolitana.',
      relatedTitle: 'Productos relacionados',
      backLabel: 'Volver al catálogo',
    },
  },

  distribucion: {
    brandTitle: 'Red de Distribución HydraSoma',
    brandSubtitle: 'Ubica tu punto de distribución más cercano',
    backLabel: 'Volver al sitio',
    footerNote:
      '© FISINOR S.A. de C.V. Programa de Distribución HydraSoma. Los puntos mostrados corresponden al ciclo vigente y pueden cambiar sin previo aviso.',
    apiEndpoint: '/api/v1/distribution-points',
    center: { lat: 29.0833, lng: -110.9640 },
    zoom: 17,
    legend: [
      { id: 'active', label: 'Activo · con inventario' },
      { id: 'resupply', label: 'Reabastecimiento en camino' },
      { id: 'unavailable', label: 'Temporalmente sin servicio' },
    ],
    program: {
      title: 'Programa de Distribución HydraSoma',
      paragraphs: [
        'La red de distribución de HydraSoma acerca la hidratación celular de FISINOR a los hogares de Sonora a través de puntos autorizados en plazas, tiendas aliadas y módulos móviles del campus.',
        'Cada punto recibe inventario certificado y es auditado semanalmente por el programa de garantía de calidad. Presenta tu gafete de suscriptor o tu código de expediente para acceder a precios preferenciales.',
      ],
      stats: [
        { id: 'active-points', label: 'PUNTOS ACTIVOS', value: '6' },
        { id: 'municipalities', label: 'MUNICIPIOS', value: '4' },
        { id: 'next-resupply', label: 'PRÓXIMA REPOSICIÓN', value: '14 OCT' },
      ],
      dataSourceApi: 'Datos: API de distribución (v1) en línea',
    },
    panel: {
      pointsLabel: 'Puntos de distribución',
      pointCountLabel: 'puntos visibles',
      selectHint: 'Haz clic en un marcador del mapa para ver los detalles del punto.',
      addressLabel: 'Dirección',
      scheduleLabel: 'Horario',
      phoneLabel: 'Teléfono',
      statusLabels: {
        active: 'Activo',
        resupply: 'En reabastecimiento',
        unavailable: 'Sin servicio',
      },
      showPanelsLabel: 'Mostrar paneles',
      hidePanelsLabel: 'Ocultar paneles',
      formTitle: 'Nuevo punto de distribución',
      formFields: {
        name: { label: 'Nombre del punto', placeholder: 'Ej. Módulo Campus Norte' },
        address: { label: 'Dirección', placeholder: 'Calle, número, referencias' },
        schedule: { label: 'Horario', placeholder: 'Ej. Lun–Sáb · 08:00 a 20:00 h' },
        phone: { label: 'Teléfono', placeholder: 'Ej. 662 123 4567' },
        note: { label: 'Nota para el visitante', placeholder: 'Ej. Ingreso por la puerta este del estacionamiento.' },
      },
      statusFieldLabel: 'Estado del punto',
      savePointLabel: 'Guardar punto',
      cancelLabel: 'Cancelar',
      deletePointLabel: 'Eliminar',
    },

  },
}
