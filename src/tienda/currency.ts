// Utilidades de formato para la tienda.

export function formatMxn(value: number): string {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 2,
  }).format(value)
}

export function generateOrderFolio(): string {
  const consecutive = Math.floor(1000 + Math.random() * 9000)
  return `#TI-2026-${consecutive}`
}
