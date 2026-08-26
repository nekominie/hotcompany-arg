<script setup lang="ts">
import { fisinorConfig } from '../config/fisinorConfig'
</script>

<template>
  <section id="tecnologias" class="bg-fisinor-medical py-20">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="mb-12 text-center">
        <h2 class="text-3xl font-bold tracking-tight text-fisinor-dark sm:text-4xl">
          Tecnologías Corporativas
        </h2>
        <p class="mt-4 text-lg text-slate-600">
          Soluciones biomédicas desarrolladas bajo estrictos protocolos de calidad, trazabilidad y confidencialidad institucional.
        </p>
      </div>

      <div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="tech in fisinorConfig.technologies"
          :key="tech.id"
          class="group rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition-all hover:shadow-lg hover:-translate-y-1"
        >
          <div class="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-fisinor-cyan/10 text-fisinor-cyan">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path v-if="tech.id === 'cefalo-soma'" stroke-linecap="round" stroke-linejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              <path v-else-if="tech.id === 'gemini'" stroke-linecap="round" stroke-linejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              <path v-else stroke-linecap="round" stroke-linejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <h3 class="text-xl font-bold text-fisinor-dark">{{ tech.title }}</h3>
          <p class="mt-1 text-sm font-medium text-fisinor-cyan">{{ tech.subtitle }}</p>
          <p class="mt-4 text-slate-600 leading-relaxed">{{ tech.description }}</p>
          <div class="mt-4 flex flex-wrap gap-2">
            <span
              v-for="tag in tech.tags"
              :key="tag"
              class="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600"
            >
              {{ tag }}
            </span>
          </div>
          <div class="mt-6 border-t border-slate-100 pt-4 text-xs font-semibold text-fisinor-desert">
            {{ tech.warning }}
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
