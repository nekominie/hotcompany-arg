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
