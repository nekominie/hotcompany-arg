// Servicio del catálogo de la tienda: obtiene los artículos de la base de datos
// vía la API, con respaldo al catálogo local de la configuración si la API no responde.

import { fisinorConfig, type TiendaProduct, type TiendaProductReview } from '../config/fisinorConfig'

const API_BASE = (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/$/, '')

interface StoreProductApi {
  id: string
  code: string
  name: string
  category: string
  price: number
  unit: string
  stock: number
  blurb: string | null
  detail: string | null
  features: string[]
  origin: string | null
  imageUrl: string | null
  rating: number
  reviewCount: number
  isActive: boolean
  reviews: { id: string; author: string; rating: number; comment: string | null }[]
}

export async function fetchStoreProducts(): Promise<TiendaProduct[]> {
  try {
    const response = await fetch(`${API_BASE}/v1/store/products`)
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    const rows = (await response.json()) as StoreProductApi[]
    if (!Array.isArray(rows) || rows.length === 0) throw new Error('catálogo vacío')
    return rows.map(toView)
  } catch {
    // Respaldo: catálogo local de la configuración (modo sin backend)
    return fisinorConfig.tienda.products.map((product) => ({
      ...product,
      reviews: product.reviews ?? [],
    }))
  }
}

function toView(row: StoreProductApi): TiendaProduct {
  return {
    id: row.id,
    code: row.code,
    name: row.name,
    categoryId: row.category,
    price: Number(row.price),
    unit: row.unit,
    stock: row.stock > 0 ? 'available' : 'soldout',
    blurb: row.blurb ?? '',
    detail: row.detail ?? '',
    features: row.features ?? [],
    origin: row.origin ?? '',
    rating: Number(row.rating),
    reviewCount: row.reviewCount,
    imageUrl: row.imageUrl ?? undefined,
    reviews: (row.reviews ?? []).map<TiendaProductReview>((review) => ({
      author: review.author,
      rating: review.rating,
      comment: review.comment,
    })),
  }
}
