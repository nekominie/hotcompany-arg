<script setup lang="ts">
import { fisinorConfig, type PortalOptionConfig } from '../config/fisinorConfig'
import Modal from './Modal.vue'

defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'select', option: PortalOptionConfig): void
}>()

const accentStyles: Record<PortalOptionConfig['accent'], { iconBox: string; cta: string }> = {
  cyan: {
    iconBox: 'border-cyan-100 bg-cyan-50 text-fisinor-cyan',
    cta: 'text-fisinor-cyan',
  },
  dark: {
    iconBox: 'border-fisinor-dark bg-fisinor-dark text-white',
    cta: 'text-fisinor-dark group-hover:text-fisinor-cyan',
  },
}
</script>

<template>
  <Modal :open="open" :title="fisinorConfig.portalSelector.title" @close="emit('close')">
    <div class="space-y-5">
      <p class="text-sm leading-relaxed text-slate-600">
        {{ fisinorConfig.portalSelector.subtitle }}
      </p>

      <div class="space-y-3">
        <button
          v-for="option in fisinorConfig.portalSelector.options"
          :key="option.id"
          type="button"
          class="group block w-full rounded-lg border border-slate-200 bg-white p-5 text-left transition-all hover:-translate-y-0.5 hover:border-fisinor-cyan hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-fisinor-cyan/40"
          @click="emit('select', option)"
        >
          <div class="flex items-start gap-4">
            <div
              class="flex h-12 w-12 shrink-0 items-center justify-center rounded border"
              :class="accentStyles[option.accent].iconBox"
            >
              <svg
                v-if="option.icon === 'user'"
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="1.5"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <svg
                v-else-if="option.icon === 'badge'"
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="1.5"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </div>

            <div class="min-w-0">
              <h4 class="font-serif text-lg font-semibold text-fisinor-dark">
                {{ option.title }}
              </h4>
              <p class="mt-1 text-sm leading-relaxed text-slate-600">
                {{ option.description }}
              </p>
            </div>
          </div>

          <div
            class="mt-4 flex items-center justify-between border-t border-slate-100 pt-3"
          >
            <span class="text-xs font-semibold uppercase tracking-widest" :class="accentStyles[option.accent].cta">
              {{ option.cta }}
            </span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4 transition-transform group-hover:translate-x-1"
              :class="accentStyles[option.accent].cta"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </div>
        </button>
      </div>
    </div>
  </Modal>
</template>
