export interface FisinorConfig {
  brand: BrandConfig
  header: HeaderConfig
  hero: HeroConfig
  productStatus: ProductStatusConfig
  community: CommunityConfig
  technologies: TechnologyConfig[]
  footer: FooterConfig
  employeePortal: EmployeePortalConfig
  cloneReport: CloneReportConfig
  terminal: TerminalConfig
}

export interface BrandConfig {
  name: string
  shortName: string
  fullName: string
  slogan: string
  rfc: string
  year: number
  headquarters: string
  colors: Record<string, string>
}

export interface HeaderConfig {
  nav: { label: string; href: string }[]
  employeePortalLabel: string
}

export interface HeroConfig {
  headline: string
  subheadline: string
  ctaLabel: string
  ctaHref: string
  backgroundAlt: string
}

export interface ProductStatusConfig {
  hydraSomaAvailable: boolean
  hydraSomaMessage: string
  hydraSomaTitle: string
  hydraSomaDescription: string
  hydraSomaNotice: string
  mapLabel: string
  mapPoints: MapPoint[]
}

export interface MapPoint {
  id: string
  name: string
  x: number
  y: number
  status: 'available' | 'sold-out' | 'restricted'
}

export interface CommunityConfig {
  anomaliesTitle: string
  anomaliesDescription: string
  anomaliesCta: string
  guaranteeTitle: string
  guaranteeDescription: string
}

export interface TechnologyConfig {
  id: string
  title: string
  subtitle: string
  description: string
  tags: string[]
  warning?: string
}

export interface FooterConfig {
  certifications: Certification[]
  privacyNotice: string
  dnaClause: string
  copyright: string
  links: { label: string; href: string }[]
}

export interface Certification {
  name: string
  code: string
}

export interface EmployeePortalConfig {
  title: string
  subtitle: string
  usernameLabel: string
  passwordLabel: string
  submitLabel: string
  errorMessages: string[]
  encryptedAlert: string
  attemptsBeforeLock: number
}

export interface CloneReportConfig {
  title: string
  subtitle: string
  fields: FormField[]
  submitLabel: string
  successMessage: string
  errorMessage: string
}

export interface FormField {
  id: string
  label: string
  type: string
  placeholder: string
  required: boolean
}

export interface TerminalConfig {
  title: string
  subtitle: string
  resetLabel: string
  auditLog: AuditEntry[]
  corruptedHeader: string
  corruptedSubtext: string
}

export interface AuditEntry {
  timestamp: string
  level: 'info' | 'warn' | 'error' | 'critical'
  source: string
  message: string
  whistleblower?: string
}

export const fisinorConfig: FisinorConfig = {
  brand: {
    name: 'FISINOR S.A. de C.V.',
    shortName: 'FISINOR',
    fullName: 'Fisiología e Ingeniería Sintética del Noroeste',
    slogan: 'Rediseñando los límites de la biología bajo el sol del Noroeste.',
    rfc: 'FIS160203I98',
    year: 1987,
    headquarters: 'Complejo Norte, Hermosillo, Sonora',
    colors: {
      cyan: '#00A8CC',
      desert: '#FF9F1C',
      dark: '#1E293B',
      medical: '#F8FAFC',
      white: '#FFFFFF',
    },
  },

  header: {
    nav: [
      { label: 'Inicio', href: '#inicio' },
      { label: 'Tecnologías', href: '#tecnologias' },
      { label: 'Avisos', href: '#avisos' },
      { label: 'Sostenibilidad', href: '#sostenibilidad' },
    ],
    employeePortalLabel: 'Portal de Empleados',
  },

  hero: {
    headline: 'Rediseñando los límites de la biología bajo el sol del Noroeste.',
    subheadline:
      'Líderes en fisiología aplicada, integración cefálica y bioingeniería de clima extremo. Nuestros procesos son auditados, reproducibles y confidenciales.',
    ctaLabel: 'Conozca nuestras tecnologías',
    ctaHref: '#tecnologias',
    backgroundAlt: 'Instalaciones de laboratorio biotecnológico bajo luz solar del noroeste',
  },

  productStatus: {
    hydraSomaAvailable: false,
    hydraSomaMessage: 'TEMPORALMENTE AGOTADA',
    hydraSomaTitle: 'HydraSoma',
    hydraSomaDescription:
      'La bebida oficial de hidratación celular contra el calor del noroeste. Reabastecimiento programado para el siguiente ciclo de distribución.',
    hydraSomaNotice:
      'Se solicita a personal y visitantes no ingerir productos de lotes anteriores al 07/2024.',
    mapLabel: 'Ver mapa de puntos',
    mapPoints: [
      { id: 'p1', name: 'Módulo Recepción Norte', x: 20, y: 30, status: 'sold-out' },
      { id: 'p2', name: 'Cantina CEF-02', x: 45, y: 50, status: 'sold-out' },
      { id: 'p3', name: 'Sala de Descanso Gemini', x: 70, y: 25, status: 'restricted' },
      { id: 'p4', name: 'Puesto Móvil Bio-Sinter', x: 80, y: 70, status: 'sold-out' },
      { id: 'p5', name: 'Clínica Perimetral', x: 35, y: 80, status: 'sold-out' },
    ],
  },

  community: {
    anomaliesTitle: 'Programa de Garantía de Calidad Biométrica',
    anomaliesDescription:
      'Si observa inconsistencias fenotípicas, duplicados morfológicos o comportamientos fuera de perfil en colaboradores o contratistas, su reporte es invaluable para mantener la pureza operativa.',
    anomaliesCta: 'Reportar Sujeto / Clon',
    guaranteeTitle: 'Avisos Comunitarios',
    guaranteeDescription:
      'Mantenga la continuidad institucional. Consulte aquí los comunicados oficiales del campus.',
  },

  technologies: [
    {
      id: 'cefalo-soma',
      title: 'Céfalo-Soma',
      subtitle: 'Continuidad Neural Integrada',
      description:
        'Protocolo de preparación somática para la conservación de la identidad motora y autónoma. Cada unidad es evaluada bajo estándares de compatibilidad estructural previa a la integración.',
      tags: ['Neurocompatibilidad', 'Integración motora', 'Ética revisada'],
      warning: 'Disponible únicamente en centros autorizados.',
    },
    {
      id: 'gemini',
      title: 'Gemini',
      subtitle: 'Biometría de Duplicación Asistida',
      description:
        'Sistema de registro, crianza y seguimiento de líneas celulares estandarizadas. Gemini garantiza trazabilidad genética y uniformidad conductual dentro de los parámetros del contrato.',
      tags: ['Trazabilidad total', 'Uniformidad garantizada', 'Lotes certificados'],
      warning: 'No todos los sujetos desarrollan memoria epigenética.',
    },
    {
      id: 'bio-sinter',
      title: 'Bio-Sinter',
      subtitle: 'Sinterización de Tejidos de Clima Extremo',
      description:
        'Tecnología de soporte vital para ambientes áridos, radiantes y de alta demanda metabólica. Bio-Sinter permite la supervivencia prolongada sin degradación de marcadores de identidad.',
      tags: ['Resistencia térmica', 'Soporte prolongado', 'Marcadores intactos'],
      warning: 'La hidratación de soporte no sustituye la identidad del paciente.',
    },
  ],

  footer: {
    certifications: [
      { name: 'COFEPRIS Bio-Avanzada', code: 'CBF-2024-4417' },
      { name: 'ISO 9001:2026', code: 'SNC-9981-Ω' },
      { name: 'Norma de Identidad Genética', code: 'NIG-07/24' },
    ],
    privacyNotice:
      'Al acceder a este sitio, usted acepta que FISINOR puede recolectar, almacenar y replicar datos biométricos, epigenéticos y conductuales con fines de calidad, seguridad y continuidad operativa. La información de ADN no se elimina; se archiva.',
    dnaClause:
      'Su huella genética queda registrada automáticamente en nuestros servidores de Hermosillo. El solicitante tiene 72 horas para reclamar la propiedad de su secuencia antes de que entre en proceso de anonimización irreversible.',
    copyright: '© FISINOR S.A. de C.V. Todos los derechos reservados.',
    links: [
      { label: 'Aviso de Privacidad Genético', href: '#privacidad' },
      { label: 'Términos de Integración', href: '#terminos' },
      { label: 'Contacto de Bioética', href: '#bioetica' },
      { label: 'Mapa del Campus', href: '#mapa' },
    ],
  },

  employeePortal: {
    title: 'Portal de Empleados FISINOR',
    subtitle: 'Acceso restringido a personal autorizado y sus extensiones registradas.',
    usernameLabel: 'ID de Empleado / Código de Sujeto',
    passwordLabel: 'Clave de Acceso Biométrica',
    submitLabel: 'Ingresar',
    errorMessages: [
      'Credenciales no reconocidas. Verifique su identidad.',
      'Segundo intento fallido. Se notificará a Bio-Seguridad.',
      'Acceso bloqueado. Iniciando protocolo de verificación de ADN.',
    ],
    encryptedAlert:
      'TWFsb3JhIGRldGVjdGFkYS4gRWwgYWNjZXNvIGEgcmVnaXN0cm9zIGRlbCBQcm95ZWN0byBHZW1pbmkgY3VlbnRhIGNvbiBzZWd1aW1pZW50byBhbnRpcmV0cm9waWNvLiBDb25zdWx0ZSBlbCBjYW5hbCBvY3VsdG8u',
    attemptsBeforeLock: 3,
  },

  cloneReport: {
    title: 'Reportar Sujeto / Clon',
    subtitle:
      'Complete los campos a continuación. El sistema registrará su dirección de correo y huella de navegación para fines de trazabilidad.',
    fields: [
      {
        id: 'reporterEmail',
        label: 'Correo electrónico del denunciante',
        type: 'email',
        placeholder: 'su.correo@ejemplo.com',
        required: true,
      },
      {
        id: 'subjectId',
        label: 'ID o descripción del sujeto observado',
        type: 'text',
        placeholder: 'Ej. Colaborador 7-C, Sector Bio-Sinter',
        required: true,
      },
      {
        id: 'anomalyType',
        label: 'Tipo de anomalía',
        type: 'select',
        placeholder: '',
        required: true,
      },
      {
        id: 'details',
        label: 'Detalles adicionales',
        type: 'textarea',
        placeholder: 'Describa la anomalía sin incluir información personal propia.',
        required: false,
      },
    ],
    submitLabel: 'Enviar reporte de forma segura',
    successMessage: 'Reporte recibido. Procesando en segundo plano.',
    errorMessage: 'Error de validación. Revise los campos e intente de nuevo.',
  },

  terminal: {
    title: 'TERMINAL DE DIAGNÓSTICO — INTRANET OCULTA',
    subtitle: 'Registros filtrados del sistema de garantía de calidad. Conexión no autorizada.',
    resetLabel: 'Restablecer interfaz pública',
    corruptedHeader: 'BIENVENIDO, DENUNCIANTE.',
    corruptedSubtext:
      'El sistema ha detectado que intentaste reportar una anomalía. En lugar de procesar tu queja, hemos procesado tu identidad.',
    auditLog: [
      {
        timestamp: '1987-03-16 04:23:11',
        level: 'info',
        source: 'CORE_FISINOR',
        message: 'Inicio del proyecto Gemini: línea celular 001 marcada como viable.',
      },
      {
        timestamp: '1994-09-02 14:10:00',
        level: 'warn',
        source: 'BIO-SEG',
        message: 'Desviación fenotípica del 12% en el lote CS-07. Aplicación de protocolo Céfalo-Soma.',
      },
      {
        timestamp: '2011-07-24 03:00:00',
        level: 'error',
        source: 'SOMATICS',
        message: 'Fallo de integración neural. Sujeto 7-C retiene memoria motora del donante.',
      },
      {
        timestamp: '2024-06-18 09:14:33',
        level: 'critical',
        source: 'WHISTLEBLOWER_RELAY',
        message: 'Denuncia recibida desde correo externo. Contenido: "No son clones. Son copias imperfectas que ahora creen ser originales".',
        whistleblower: '{{reporterEmail}}',
      },
      {
        timestamp: '2024-06-18 09:14:34',
        level: 'critical',
        source: 'SYSTEM',
        message: 'Identidad del denunciante archivada. Ubicación aproximada: {{location}}. Rastreo activo.',
      },
      {
        timestamp: '2024-06-18 09:14:35',
        level: 'critical',
        source: 'SYSTEM',
        message: 'Restablecimiento de interfaz pública denegado. Usted ya forma parte del registro.',
      },
    ],
  },
}
