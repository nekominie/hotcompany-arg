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

export interface AssistantConfigResponse {
  activationDelaySeconds: number
  messageDelaySeconds: number
  isEnabled: boolean
  invalidEmailMessage: string | null
  messages: AssistantMessageConfig[]
}

export async function getAssistantConfig(signal?: AbortSignal): Promise<AssistantConfigResponse> {
  const response = await fetch(`${baseUrl}/v1/assistant-config`, {
    method: 'GET',
    signal,
  })
  if (!response.ok) {
    throw {
      status: response.status,
      message: `Error ${response.status}: ${response.statusText}`,
    } as ApiError
  }
  return response.json()
}

export async function submitAssistantReply(email: string, messageId?: string | null): Promise<void> {
  const response = await fetch(`${baseUrl}/v1/assistant-config/replies`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, messageId: messageId ?? null }),
  })
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
