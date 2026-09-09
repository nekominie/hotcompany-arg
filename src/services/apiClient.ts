export interface ApiError {
  status: number
  message: string
  details?: Record<string, string[]>
}

export interface CreateReportResponse {
  reportCode: string
  status: string
  createdAt: string
  anomaliesCount: number
}

const baseUrl = import.meta.env.VITE_API_BASE_URL || '/api'

export interface AssistantMessageConfig {
  id: string
  body: string
  delaySeconds: number
  isWaitingForReply?: boolean
  sortOrder: number
  isActive?: boolean
}

export type AssistantScenario = 'employees' | 'distribution' | 'reports'

export function normalizeAssistantScenario(value: unknown): AssistantScenario {
  if (value === 'distribution') return 'distribution'
  if (value === 'reports') return 'reports'
  return 'employees'
}

export interface AssistantConfigResponse {
  activationDelaySeconds: number
  messageDelaySeconds: number
  isEnabled: boolean
  invalidEmailMessage: string | null
  invalidEmailExhaustedMessage?: string | null
  scenario?: string | null
  messages: AssistantMessageConfig[]
}

export async function getAssistantConfig(
  scenario: AssistantScenario = 'employees',
  signal?: AbortSignal,
): Promise<AssistantConfigResponse> {
  const response = await fetch(
    `${baseUrl}/v1/assistant-config?scenario=${encodeURIComponent(scenario)}`,
    {
      method: 'GET',
      signal,
    },
  )
  if (!response.ok) {
    throw {
      status: response.status,
      message: `Error ${response.status}: ${response.statusText}`,
    } as ApiError
  }
  return response.json()
}

export interface EmployeesAccessResponse {
  allowed: boolean
  authenticated: boolean
}

/**
 * Pregunta al servidor si la sesión actual tiene pase al Portal de Empleados.
 * Usa la cookie compartida (credentials:include). Falla cerrado: cualquier error niega.
 */
export async function fetchEmployeesAccess(signal?: AbortSignal): Promise<EmployeesAccessResponse> {
  try {
    const response = await fetch(`${baseUrl}/v1/client-portal/employees-access`, {
      method: 'GET',
      credentials: 'include',
      signal,
    })
    if (!response.ok) return { allowed: false, authenticated: false }
    const payload = (await response.json()) as EmployeesAccessResponse
    if (!payload || typeof payload.allowed !== 'boolean') return { allowed: false, authenticated: false }
    return { allowed: payload.allowed, authenticated: payload.authenticated === true }
  } catch {
    return { allowed: false, authenticated: false }
  }
}

export async function submitAssistantReply(
  email: string,
  messageId?: string | null,
  scenario: AssistantScenario = 'employees',
): Promise<void> {
  const response = await fetch(
    `${baseUrl}/v1/assistant-config/replies?scenario=${encodeURIComponent(scenario)}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, messageId: messageId ?? null, scenario }),
    },
  )
  if (!response.ok) {
    throw {
      status: response.status,
      message: `Error ${response.status}: ${response.statusText}`,
    } as ApiError
  }
}

export async function submitAnomalyReport(formData: FormData): Promise<CreateReportResponse> {
  const response = await fetch(`${baseUrl}/v1/anomaly-reports`, {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    let details: Record<string, string[]> | undefined
    let message = `Error ${response.status}: ${response.statusText}`

    try {
      const payload = await response.json()
      if (payload.title || payload.message) {
        message = payload.title || payload.message
      }
      if (payload.errors && typeof payload.errors === 'object') {
        details = payload.errors as Record<string, string[]>
        const firstErrors = Object.values(details).flat().slice(0, 3)
        if (firstErrors.length > 0) {
          message = firstErrors.join(' · ')
        }
      }
    } catch {
      // ignore parsing errors
    }

    const error: ApiError = {
      status: response.status,
      message,
      details,
    }
    throw error
  }

  return response.json()
}
