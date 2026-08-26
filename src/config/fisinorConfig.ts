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

export const fisinorConfig: FisinorConfig = {
  brand: {
    name: 'FISINOR S.A. de C.V.',
    shortName: 'FISINOR',
    fullName: 'Fisiología e Ingeniería Sintética del Noroeste',
    slogan: 'Pioneros en la Ingeniería Fisiológica y Adaptación Térmica del Noroeste.',
    rfc: 'FIS160203I98',
    year: 1987,
    headquarters: 'Complejo Norte, Hermosillo, Sonora',
    address: 'Blvd. Luis Encinas J. 100, Centro de Investigación, 83000 Hermosillo, Sonora, México',
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
    systemStatus: 'SISTEMA OPERATIVO | NODO HERMOSILLO',
    ticker: [
      'HydraSoma: pausa temporal por reabastecimiento —',
      'Circular de verificación biométrica vigente —',
      'Convenio UNISON-FISINOR: 37 años de investigación conjunta —',
      'Sujetos del lote CS-07 finalizan integración neural —',
      'Campus Norte registra 41.2°C; protocolos de soporte térmico activos —',
    ],
    languageLabel: 'Idioma',
    languages: ['ES', 'EN', 'ZH', 'RU'],
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
    employeePortalLabel: 'Portal de Empleados',
  },

  hero: {
    eyebrow: 'Fisiología · Ingeniería Sintética · Adaptación Térmica',
    headline: 'Pioneros en la Ingeniería Fisiológica y Adaptación Térmica del Noroeste.',
    subheadline:
      'Desde 1987, FISINOR desarrolla soluciones de bio-resiliencia para los cuerpos y comunidades que viven bajo el estrés radiante del desierto sonorense. Nuestra ciencia es confiable, medible y estrictamente confidencial.',
    ctaPrimary: { label: 'Conozca nuestras divisiones', href: '#investigacion' },
    ctaSecondary: { label: 'Avisos comunitarios', href: '#prensa' },
    backgroundImage: 'https://images.unsplash.com/photo-1581093458791-9d42e3c7e117?auto=format&fit=crop&w=1920&q=85',
    backgroundAlt: 'Investigador en laboratorio de biotecnología con iluminación azul institucional',
    floatingCards: [
      {
        id: 'card-hydra',
        title: 'HydraSoma',
        description: 'Hidratación celular de soporte para ambientes extremos.',
        href: '#prensa',
      },
      {
        id: 'card-biometric',
        title: 'Verificación Biométrica',
        description: 'Garantía de calidad y continuidad identitaria.',
        href: '#prensa',
      },
      {
        id: 'card-unison',
        title: 'Convenio UNISON',
        description: 'Investigación avanzada con la Universidad de Sonora.',
        href: '#prensa',
      },
    ],
  },

  about: {
    sectionLabel: 'Nosotros',
    headline: 'Ciencia institucional nacida del calor del Noroeste.',
    director: {
      name: 'Dr. Armando Vásquez Celaya',
      title: 'Director Ejecutivo y Fundador',
      credentials: 'M.D., Ph.D. Bioingeniería Tisular — UNISON / MIT',
      quote:
        'El calor de Sonora no es un obstáculo; es nuestro laboratorio. En FISINOR transformamos la presión ambiental en información celular, y esa información en continuidad de vida para quienes la necesitan.',
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=80',
    },
    stats: [
      { value: '37+', label: 'Años de investigación' },
      { value: '120+', label: 'Especialistas en plantilla' },
      { value: '14', label: 'Protocolos de bio-resiliencia' },
      { value: '3', label: 'Centros de investigación' },
    ],
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=85',
    imageAlt: 'Complejo corporativo de investigación biotecnológica bajo el cielo del noroeste',
    paragraphs: [
      'FISINOR S.A. de C.V. es una empresa de biotecnología y fisiología aplicada con sede en Hermosillo, Sonora. Operamos bajo los más altos estándares de calidad, trazabilidad y confidencialidad institucional, sirviendo a sectores de salud, deporte de alto rendimiento y organismos gubernamentales de la región.',
      'Nuestro modelo de investigación combina la fisiología del clima extremo, la biomecánica tisular y la genómica celular para producir soluciones de soporte vital, integración neural y adaptación térmica. Cada lote, cada protocolo y cada sujeto de seguimiento queda registrado en nuestros sistemas de auditoría de clase institucional.',
    ],
  },

  researchUnits: [
    {
      id: 'adaptacion-termica',
      title: 'Adaptación Térmica',
      subtitle: 'Divisiones de Bio-Resiliencia Climática',
      description:
        'Desarrollamos protocolos de soporte metabólico para ambientes áridos, radiantes y de alta demanda térmica. Nuestras soluciones permiten mantener la homeostasis celular en condiciones que, en otros contextos, resultarían letales. Los lotes de prueba son monitoreados de forma continua bajo supervisión médica especializada.',
      image: 'https://images.unsplash.com/photo-1504386106331-3e4e71712b10?auto=format&fit=crop&w=900&q=80',
      imageAlt: 'Dunas de desierto bajo luz solar intensa, representando el estrés térmico del noroeste',
      cta: 'Conocer la división',
    },
    {
      id: 'biomecanica-tisular',
      title: 'Biomecánica Tisular',
      subtitle: 'Integración Estructural y Céfalo-Soma',
      description:
        'Esta división se especializa en la preparación, evaluación y seguimiento de unidades somáticas sujetas a protocolos de integración estructural. Trabajamos bajo estrictas normas de compatibilidad neural, continuidad motora y registro identitario, con resultados auditables y reproducibles.',
      image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=900&q=80',
      imageAlt: 'Microscopio de laboratorio analizando muestra tisular',
      cta: 'Conocer la división',
    },
    {
      id: 'genomica-celular',
      title: 'Genómica Celular',
      subtitle: 'Líneas de Duplicación Asistida y Trazabilidad',
      description:
        'Gestionamos líneas celulares estandarizadas bajo parámetros de uniformidad, trazabilidad genética y estabilidad conductual. Nuestro registro de lotes permite identificar desviaciones fenotípicas con precisión y activar protocolos de garantía de calidad cuando sea necesario.',
      image: 'https://images.unsplash.com/photo-1579684385127-1ef2f7287c45?auto=format&fit=crop&w=900&q=80',
      imageAlt: 'Investigador examinando muestra con microscopio en laboratorio de genómica',
      cta: 'Conocer la división',
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
        title: 'Estatus Campaña HydraSoma: Pausa Temporal por Reabastecimiento',
        summary:
          'La bebida oficial de hidratación celular del campus se encuentra temporalmente agotada en los puntos de distribución. Se solicita a personal y visitantes no ingerir productos de lotes anteriores al 07/2024. El reabastecimiento está programado para el siguiente ciclo operativo.',
        image: 'https://images.unsplash.com/photo-1552674605-5d2262cab4e5?auto=format&fit=crop&w=800&q=80',
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
        image: 'https://images.unsplash.com/photo-1547234935-80c7142ee969?auto=format&fit=crop&w=800&q=80',
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
}
