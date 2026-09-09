// Servicio de artículos del Centro de Prensa: lista y detalle desde la API.

const API_BASE = (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/$/, '')

export interface PressArticlePreview {
  id: string
  title: string
  author: string
  publishedAt: string
  excerpt: string
  landingHtml: string | null
}

export interface PressArticleDetail extends PressArticlePreview {
  contentHtml: string
}

export async function fetchPressArticles(): Promise<PressArticlePreview[]> {
  const response = await fetch(`${API_BASE}/v1/press-articles`)
  if (!response.ok) throw new Error(`HTTP ${response.status}`)
  const rows = (await response.json()) as PressArticlePreview[]
  if (!Array.isArray(rows)) throw new Error('formato inválido')
  return rows
}

export async function fetchPressArticle(id: string): Promise<PressArticleDetail> {
  const response = await fetch(`${API_BASE}/v1/press-articles/${encodeURIComponent(id)}`)
  if (!response.ok) throw new Error(`HTTP ${response.status}`)
  return (await response.json()) as PressArticleDetail
}

export function formatPressDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('es-MX', { dateStyle: 'long' })
  } catch {
    return iso
  }
}
