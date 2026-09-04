/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  readonly VITE_CLIENTS_PORTAL_URL: string
  readonly VITE_EMPLOYEES_PORTAL_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
