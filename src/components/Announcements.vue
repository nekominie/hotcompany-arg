<script setup lang="ts">
import { fisinorConfig } from '../config/fisinorConfig'

defineEmits<{
  (e: 'open-map'): void
  (e: 'open-report'): void
}>()
</script>

<template>
  <section id="avisos" class="bg-white py-20">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="mb-12">
        <h2 class="text-3xl font-bold tracking-tight text-fisinor-dark">
          {{ fisinorConfig.community.guaranteeTitle }}
        </h2>
        <p class="mt-3 text-lg text-slate-600">
          {{ fisinorConfig.community.guaranteeDescription }}
        </p>
      </div>

      <div class="grid gap-8 md:grid-cols-2">
        <!-- HydraSoma card -->
        <div class="rounded-2xl border border-slate-200 bg-fisinor-medical p-8 shadow-sm">
          <div class="flex items-start justify-between">
            <div>
              <div class="text-xs font-bold uppercase tracking-wider text-slate-500">Producto Oficial</div>
              <h3 class="mt-2 text-2xl font-bold text-fisinor-dark">{{ fisinorConfig.productStatus.hydraSomaTitle }}</h3>
            </div>
            <span
              class="rounded-full px-3 py-1 text-xs font-bold"
              :class="fisinorConfig.productStatus.hydraSomaAvailable ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'"
            >
              {{ fisinorConfig.productStatus.hydraSomaAvailable ? 'Disponible' : fisinorConfig.productStatus.hydraSomaMessage }}
            </span>
          </div>
          <p class="mt-4 text-slate-600">
            {{ fisinorConfig.productStatus.hydraSomaDescription }}
          </p>
          <div class="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-800">
            {{ fisinorConfig.productStatus.hydraSomaNotice }}
          </div>
          <button
            class="mt-6 inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-fisinor-dark hover:bg-slate-50 transition-colors"
            @click="$emit('open-map')"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 7m0 13V7" />
            </svg>
            {{ fisinorConfig.productStatus.mapLabel }}
          </button>
        </div>

        <!-- Anomalies card -->
        <div class="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <div class="text-xs font-bold uppercase tracking-wider text-fisinor-cyan">Garantía de Calidad</div>
          <h3 class="mt-2 text-2xl font-bold text-fisinor-dark">{{ fisinorConfig.community.anomaliesTitle }}</h3>
          <p class="mt-4 text-slate-600">
            {{ fisinorConfig.community.anomaliesDescription }}
          </p>
          <div class="mt-6 rounded-lg bg-fisinor-desert/10 p-3 text-sm text-fisinor-desert font-medium">
            Todos los reportes son anónimos en su primera capa de procesamiento. No comparta su identidad con el sujeto observado.
          </div>
          <button
            class="mt-6 inline-flex items-center gap-2 rounded-lg bg-fisinor-dark px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 transition-colors"
            @click="$emit('open-report')"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            {{ fisinorConfig.community.anomaliesCta }}
          </button>
        </div>
      </div>
    </div>
  </section>
</template>
