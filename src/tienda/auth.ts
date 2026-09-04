// Servicio de sesión de la tienda: comparte la sesión del Portal de Clientes
// a través de la cookie de host que emite la API (válida en todo localhost).

import { ref } from 'vue'

const API_BASE = (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/$/, '')
const TOKEN_KEY = 'fisinor_client_token'

function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export interface TiendaSessionUser {
  id: string
  username: string
  email: string
  firstName: string | null
  lastNamePaternal: string | null
  lastNameMaternal: string | null
}

export const tiendaUser = ref<TiendaSessionUser | null>(null)
export const tiendaSessionChecked = ref(false)

interface ClientAuthPayload {
  token: string
  account: {
    id: string
    username: string
    email: string
    firstName: string | null
    lastNamePaternal: string | null
    lastNameMaternal: string | null
  }
}

function mapAccount(raw: ClientAuthPayload['account']): TiendaSessionUser {
  return {
    id: raw.id,
    username: raw.username,
    email: raw.email,
    firstName: raw.firstName,
    lastNamePaternal: raw.lastNamePaternal,
    lastNameMaternal: raw.lastNameMaternal,
  }
}

export function displayNameOf(user: TiendaSessionUser | null): string {
  if (!user) return ''
  const composed = [user.firstName, user.lastNamePaternal]
    .filter((part) => part && part.trim().length > 0)
    .join(' ')
  return composed.length > 0 ? composed : user.username
}

export function initialsOf(user: TiendaSessionUser | null): string {
  if (!user) return '??'
  return displayNameOf(user)
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
}

async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    ...(init.headers as Record<string, string> | undefined),
  }
  if (init.body) {
    headers['Content-Type'] = 'application/json'
  }

  const token = getStoredToken()
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers,
    credentials: 'include',
  })
  const payload = await response.json().catch(() => null)

  if (!response.ok) {
    const message =
      (payload && typeof payload === 'object' && 'message' in payload && String(payload.message)) ||
      `Error ${response.status}`
    throw new Error(message)
  }

  return payload as T
}

/// Carga la sesión compartida (cookie) al abrir la tienda.
export async function fetchTiendaSession(): Promise<void> {
  try {
    const account = await apiFetch<ClientAuthPayload['account']>('/v1/client-auth/me')
    tiendaUser.value = mapAccount(account)
  } catch {
    tiendaUser.value = null
    localStorage.removeItem(TOKEN_KEY)
  } finally {
    tiendaSessionChecked.value = true
  }
}

export async function loginTienda(identifier: string, password: string): Promise<void> {
  const auth = await apiFetch<ClientAuthPayload>('/v1/client-auth/login', {
    method: 'POST',
    body: JSON.stringify({ identifier, password }),
  })
  localStorage.setItem(TOKEN_KEY, auth.token)
  tiendaUser.value = mapAccount(auth.account)
}

export async function logoutTienda(): Promise<void> {
  try {
    await apiFetch<void>('/v1/client-auth/logout', { method: 'POST' })
  } catch {
    // aunque la API falle, el usuario local se descarta
  }
  localStorage.removeItem(TOKEN_KEY)
  tiendaUser.value = null
}
