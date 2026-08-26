<script setup lang="ts">
import { fisinorConfig } from '../config/fisinorConfig'
import Modal from './Modal.vue'

const props = defineProps<{
  open: boolean
}>()
const emit = defineEmits<{
  (e: 'close'): void
}>()

const statusText = {
  available: 'DISPONIBLE',
  'sold-out': 'AGOTADO',
  restricted: 'RESTRINGIDO',
}

const statusColor = {
  available: 'text-emerald-600',
  'sold-out': 'text-red-600',
  restricted: 'text-fisinor-desert',
}
</script>

<template>
  <Modal title="Mapa de puntos de distribución HydraSoma" :open="open" @close="emit('close')">
    <div class="space-y-4">
      <p class="text-sm text-slate-600">
        Puntos de distribución oficiales en el campus. Los puntos marcados con sello rojo están temporalmente agotados.
      </p>

      <div class="relative rounded-xl border border-slate-200 bg-slate-50 p-2">
        <svg viewBox="0 0 100 100" class="w-full rounded-lg bg-white" preserveAspectRatio="xMidYMid meet">
          <!-- Campus grid -->
          <defs>
            <pattern id="campus-grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#E2E8F0" stroke-width="0.5" />
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#campus-grid)" />

          <!-- Roads -->
          <path d="M10 50 H90 M50 10 V90 M25 25 L75 75" stroke="#CBD5E1" stroke-width="1" stroke-dasharray="4 2" />

          <!-- Buildings -->
          <rect x="15" y="20" width="20" height="15" fill="#E2E8F0" rx="1" />
          <rect x="40" y="40" width="18" height="18" fill="#E2E8F0" rx="1" />
          <rect x="65" y="15" width="20" height="18" fill="#E2E8F0" rx="1" />
          <rect x="70" y="60" width="18" height="18" fill="#E2E8F0" rx="1" />
          <rect x="25" y="70" width="22" height="18" fill="#E2E8F0" rx="1" />

          <!-- Points -->
          <g v-for="point in fisinorConfig.productStatus.mapPoints" :key="point.id">
            <circle :cx="point.x" :cy="point.y" r="3" fill="currentColor" class="text-fisinor-cyan" />
            <text :x="point.x + 5" :y="point.y - 4" font-size="3" fill="#475569" font-weight="600">{{ point.name }}</text>
            <g v-if="point.status === 'sold-out'">
              <rect :x="point.x - 12" :y="point.y + 5" width="24" height="7" fill="#EF4444" rx="1" transform="rotate(-8, point.x, point.y + 8)" />
              <text :x="point.x" :y="point.y + 10" font-size="3.5" fill="white" text-anchor="middle" font-weight="bold" transform="rotate(-8, point.x, point.y + 8)">AGOTADO</text>
            </g>
            <g v-else-if="point.status === 'restricted'">
              <rect :x="point.x - 14" :y="point.y + 5" width="28" height="7" fill="#F59E0B" rx="1" transform="rotate(-8, point.x, point.y + 8)" />
              <text :x="point.x" :y="point.y + 10" font-size="3" fill="white" text-anchor="middle" font-weight="bold" transform="rotate(-8, point.x, point.y + 8)">RESTRINGIDO</text>
            </g>
          </g>
        </svg>
      </div>

      <ul class="space-y-2">
        <li
          v-for="point in fisinorConfig.productStatus.mapPoints"
          :key="point.id"
          class="flex items-center justify-between text-sm"
        >
          <span class="text-slate-700">{{ point.name }}</span>
          <span class="font-bold" :class="statusColor[point.status]">{{ statusText[point.status] }}</span>
        </li>
      </ul>
    </div>
  </Modal>
</template>
