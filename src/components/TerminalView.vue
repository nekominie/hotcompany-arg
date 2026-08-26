<script setup lang="ts">
import { computed } from 'vue'
import { fisinorConfig } from '../config/fisinorConfig'

const props = defineProps<{
  reporterEmail: string
}>()
const emit = defineEmits<{
  (e: 'reset'): void
}>()

const levelColor = {
  info: 'text-cyan-400',
  warn: 'text-yellow-400',
  error: 'text-orange-500',
  critical: 'text-red-500',
}

const levelBadge = {
  info: 'INFO',
  warn: 'WARN',
  error: 'ERROR',
  critical: 'CRITICAL',
}

const location = '29.0739°N, 110.9584°W'

const processedLog = computed(() => {
  return fisinorConfig.terminal.auditLog.map((entry) => ({
    ...entry,
    message: entry.message
      .replace(/\{\{reporterEmail\}\}/g, props.reporterEmail || 'anonimo@filtro.fisinor')
      .replace(/\{\{location\}\}/g, location),
  }))
})
</script>

<template>
  <div class="fixed inset-0 z-[100] bg-black font-mono text-green-400">
    <div class="crt-scanline" />

    <div class="h-full overflow-auto p-6 sm:p-10">
      <div class="mx-auto max-w-5xl">
        <div class="mb-8 flex items-start justify-between border-b border-green-800 pb-4">
          <div>
            <h1 class="text-2xl font-bold tracking-widest text-green-400 animate-pulse">
              {{ fisinorConfig.terminal.title }}
            </h1>
            <p class="mt-1 text-sm text-green-600">
              {{ fisinorConfig.terminal.subtitle }}
            </p>
          </div>
          <button
            class="rounded border border-green-700 bg-green-900/30 px-4 py-2 text-sm text-green-400 hover:bg-green-900/50 transition-colors"
            @click="emit('reset')"
          >
            {{ fisinorConfig.terminal.resetLabel }}
          </button>
        </div>

        <div class="mb-8 rounded border border-red-900 bg-red-950/20 p-4">
          <h2 class="text-xl font-bold text-red-500 animate-flicker">
            {{ fisinorConfig.terminal.corruptedHeader }}
          </h2>
          <p class="mt-2 text-sm text-red-400">
            {{ fisinorConfig.terminal.corruptedSubtext }}
          </p>
        </div>

        <div class="space-y-2">
          <div
            v-for="(entry, index) in processedLog"
            :key="index"
            class="rounded border border-green-900/50 bg-green-950/20 p-3 text-sm"
          >
            <div class="flex flex-wrap items-center gap-2 text-xs">
              <span class="text-slate-500">{{ entry.timestamp }}</span>
              <span class="rounded bg-black px-1.5 py-0.5 font-bold" :class="levelColor[entry.level]">
                {{ levelBadge[entry.level] }}
              </span>
              <span class="text-green-600">[{{ entry.source }}]</span>
            </div>
            <div class="mt-1" :class="entry.level === 'critical' ? 'text-red-400' : 'text-green-300'">
              {{ entry.message }}
            </div>
          </div>
        </div>

        <div class="mt-8 border-t border-green-900 pt-4 text-xs text-green-700">
          <p>Terminal ID: 7-C-ARG-00A8CC</p>
          <p>Conexión: ENCRIPTADA NIVEL 0</p>
          <p class="mt-1 text-red-600 animate-pulse">No intente cerrar esta ventana. Su sesión ya ha sido archivada.</p>
        </div>
      </div>
    </div>
  </div>
</template>
