<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import L from 'leaflet'
import { fisinorConfig, type DistributionPointConfig } from '../config/fisinorConfig'

interface ApiDistributionPoint {
  id: string
  name: string
  municipality: string
  latitude: number
  longitude: number
  address: string
  schedule: string
  phone: string | null
  status: DistributionPointConfig['status']
  note: string | null
}

const config = fisinorConfig
const distribucion = computed(() => config.distribucion)

// --- Estado de puntos ---
type DistributionPoint = DistributionPointConfig

const points = ref<DistributionPoint[]>([])
const dataSource = ref<'local' | 'api'>('api')
const dataSourceNote = ref('')

// --- Selección ---
const selectedPointId = ref<string | null>(null)
const selectedPoint = computed(
  () => points.value.find((point) => point.id === selectedPointId.value) ?? null,
)
const panelsHidden = ref(false)

const statusChipClass: Record<DistributionPoint['status'], string> = {
  active: 'dp-badge--green',
  resupply: 'dp-badge--amber',
  unavailable: 'dp-badge--red',
}

const statusDotClass: Record<DistributionPoint['status'], string> = {
  active: 'dp-legend__dot--active',
  resupply: 'dp-legend__dot--resupply',
  unavailable: 'dp-legend__dot--unavailable',
}


function markerHtml(point: DistributionPoint): string {
  const isSelected = point.id === selectedPointId.value
  return `
    <div class="dpin ${point.status}${isSelected ? ' dpin--selected' : ''}">
      <span class="dpin__pin"></span><span class="dpin__label">${point.name}</span>
    </div>
  `
}

function pinCardHtml(point: DistributionPoint): string {
  const labels = distribucion.value.panel
  return `
    <p class="dp-pin__name">${point.name}</p>
    <span class="dp-pin__status dp-pin__status--${point.status}">
      ${labels.statusLabels[point.status]}
    </span>
    <p class="dp-pin__meta"><strong>${labels.addressLabel}:</strong> ${point.address}</p>
    <p class="dp-pin__meta"><strong>${labels.scheduleLabel}:</strong> ${point.schedule}</p>
    <p class="dp-pin__meta"><strong>${labels.phoneLabel}:</strong> ${point.phone}</p>
  `
}

function renderMarkers() {
  if (!map || !markerLayer) return
  markerLayer.clearLayers()

  for (const point of points.value) {
    const isSelected = point.id === selectedPointId.value
    const marker = L.marker([point.lat, point.lng], {
      icon: L.divIcon({
        className: '',
        html: markerHtml(point),
        iconSize: [16, 16],
        iconAnchor: [9, 30],
      }),
      title: point.name,
    })
    marker.on('click', () => selectPoint(point.id))
    markerLayer.addLayer(marker)

    // La tarjeta de información solo se muestra sobre el pin seleccionado
    if (isSelected) {
      marker.bindPopup(pinCardHtml(point), {
        closeButton: false,
        className: 'dp-pin-popup',
        offset: [0, -16],
        autoPan: false,
      })
      marker.openPopup()
    }
  }
}

function selectPoint(pointId: string) {
  const point = points.value.find((candidate) => candidate.id === pointId)
  selectedPointId.value = pointId

  // Centrar la cámara en el punto seleccionado
  if (point && map) {
    map.flyTo([point.lat, point.lng], Math.max(map.getZoom(), 13), { duration: 0.7 })
  }
}

// --- Carga de datos desde la API (única fuente de verdad) ---
async function loadPoints() {
  const endpoint = distribucion.value.apiEndpoint
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 2500)
  try {
    const response = await fetch(endpoint, { signal: controller.signal })
    clearTimeout(timeout)
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    const payload = (await response.json()) as
      | ApiDistributionPoint[]
      | { items: ApiDistributionPoint[] }
    const rows = Array.isArray(payload) ? payload : payload.items
    if (!Array.isArray(rows)) throw new Error('formato inválido')
    points.value = rows.map((row) => ({
      id: row.id,
      name: row.name,
      municipality: row.municipality,
      lat: row.latitude,
      lng: row.longitude,
      address: row.address,
      schedule: row.schedule,
      phone: row.phone ?? '—',
      status: row.status,
      note: row.note ?? '',
    }))
    dataSource.value = 'api'
    dataSourceNote.value = distribucion.value.program.dataSourceApi
  } catch {
    clearTimeout(timeout)
    points.value = []
    dataSource.value = 'api'
    dataSourceNote.value = 'Datos: API de distribución no disponible'
  }
}

// --- Mapa Leaflet ---
let map: L.Map | null = null
let markerLayer: L.LayerGroup | null = null
let mapInitialized = false
const mapEl = ref<HTMLElement | null>(null)

onMounted(async () => {
  await loadPoints()

  if (mapEl.value) {
    map = L.map(mapEl.value, {
      center: [distribucion.value.center.lat, distribucion.value.center.lng],
      zoom: distribucion.value.zoom,
      scrollWheelZoom: true,
      zoomControl: false,
    })

    L.control.zoom({ position: 'bottomright' }).addTo(map)

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map)

    markerLayer = L.layerGroup().addTo(map)
    mapInitialized = true

    renderMarkers()
  }
})

onUnmounted(() => {
  if (map) {
    map.remove()
    map = null
    mapInitialized = false
  }
})

watch(selectedPointId, () => {
  if (mapInitialized) {
    renderMarkers()
  }
})
</script>

<template>
  <div class="dp-fullscreen">
    <!-- Mapa a pantalla completa -->
    <div
      ref="mapEl"
      class="dp-map"
      role="application"
      aria-label="Mapa de puntos de distribución"
    ></div>

    <!-- Capa de paneles flotantes -->
    <div class="dp-overlay">
      <!-- Barra superior flotante -->
      <header class="dp-topbar">
        <a href="/" class="dp-topbar__brand">
          <img src="/img/icon_fisinor.png" alt="FISINOR" class="dp-topbar__logo" />
          <span>
            <span class="dp-topbar__name brand-title">{{ config.brand.shortName }}</span>
            <span class="dp-topbar__sub">{{ distribucion.brandTitle }}</span>
          </span>
        </a>
        <span class="dp-topbar__title">{{ distribucion.brandSubtitle }}</span>
        <a href="/" class="dp-topbar__back">
          {{ distribucion.backLabel }}
        </a>
      </header>

      <!-- Columna de tarjetas flotantes -->
      <aside class="dp-panels" :class="{ 'dp-panels--hidden': panelsHidden }">
        <!-- Programa de distribución -->
        <article class="dp-card">
          <p class="dp-card__eyebrow">{{ distribucion.program.title }}</p>
          <p
            v-for="(paragraph, index) in distribucion.program.paragraphs"
            :key="index"
            class="dp-card__text"
          >
            {{ paragraph }}
          </p>

          <div class="dp-stats">
            <div v-for="stat in distribucion.program.stats" :key="stat.id" class="dp-stat">
              <p class="dp-stat__label">{{ stat.label }}</p>
              <p class="dp-stat__value">{{ stat.value }}</p>
            </div>
          </div>

          <p class="dp-card__text" style="margin-top: 10px; font-size: 11px; color: #94a3b8">
            {{ dataSourceNote }} · {{ points.length }} {{ distribucion.panel.pointCountLabel }}
          </p>
        </article>

        <!-- Leyenda -->
        <article class="dp-card">
          <p class="dp-card__eyebrow" style="color: #0f172a">{{ distribucion.panel.pointsLabel }}</p>
          <div class="dp-legend">
            <div v-for="item in distribucion.legend" :key="item.id" class="dp-legend__item">
              <span class="dp-legend__dot" :class="statusDotClass[item.id]" aria-hidden="true"></span>
              {{ item.label }}
            </div>
          </div>
          <p class="dp-card__text" style="font-size: 11px; color: #94a3b8">
            {{ distribucion.panel.selectHint }}
          </p>
        </article>

        <!-- Ficha del punto seleccionado -->
        <article v-if="selectedPoint" class="dp-card dp-point-card">
          <div class="dp-point-card__head">
            <h2 class="dp-card__title">{{ selectedPoint.name }}</h2>
            <span class="dp-badge" :class="statusChipClass[selectedPoint.status]">
              {{ distribucion.panel.statusLabels[selectedPoint.status] }}
            </span>
          </div>

          <div class="dp-point-card__meta">
            <p class="dp-point-card__row">
              <span class="dp-point-card__label">{{ distribucion.panel.addressLabel }}</span>
              {{ selectedPoint.address }}
            </p>
            <p class="dp-point-card__row">
              <span class="dp-point-card__label">{{ distribucion.panel.scheduleLabel }}</span>
              {{ selectedPoint.schedule }}
            </p>
            <p class="dp-point-card__row">
              <span class="dp-point-card__label">{{ distribucion.panel.phoneLabel }}</span>
              {{ selectedPoint.phone }}
            </p>
          </div>

          <p v-if="selectedPoint.note" class="dp-point-card__note">{{ selectedPoint.note }}</p>
        </article>

      </aside>

      <!-- Botón para mostrar/ocultar paneles -->
      <button type="button" class="dp-panels-toggle" @click="panelsHidden = !panelsHidden">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" class="dp-toggle-icon" aria-hidden="true">
          <path v-if="panelsHidden" stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          <path v-else stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" />
        </svg>
        {{ panelsHidden ? distribucion.panel.showPanelsLabel : distribucion.panel.hidePanelsLabel }}
      </button>
    </div>

    <!-- Nota legal discreta -->
    <p class="dp-footer-note">{{ distribucion.footerNote }}</p>
  </div>
</template>
