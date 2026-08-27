<script setup lang="ts">
import { fisinorConfig } from '../config/fisinorConfig'
</script>

<template>
  <section id="investigacion" class="bg-fisinor-hospital py-24">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="mb-16 text-center">
        <span class="text-xs font-bold uppercase tracking-widest text-fisinor-cyan">Sectores de investigación</span>
        <h2 class="mt-3 font-serif text-3xl font-bold text-fisinor-dark sm:text-4xl">
          Divisiones de Desarrollo e Inteligencia.
        </h2>
        <p class="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
          Tres ejes de investigación que operan bajo protocolos corporativos, ética revisada y trazabilidad total.
        </p>
      </div>

      <div class="grid gap-8 lg:grid-cols-3">
        <article
          v-for="unit in fisinorConfig.researchUnits"
          :key="unit.id"
          :id="unit.id"
          class="group overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
        >
          <div class="relative h-56 overflow-hidden">
            <img
              :src="unit.image"
              :alt="unit.imageAlt"
              class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-fisinor-dark/80 to-transparent p-4">
              <div class="text-xs font-bold uppercase tracking-wider text-fisinor-cyan">{{ unit.subtitle }}</div>
            </div>
          </div>
          <div class="p-7">
            <h3 class="font-serif text-2xl font-bold text-fisinor-dark">{{ unit.title }}</h3>
            <p class="mt-4 text-sm leading-7 text-slate-600">
              {{ unit.description }}
            </p>
            <a
              :href="'#' + unit.id"
              class="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-fisinor-cyan transition-colors hover:text-cyan-700"
            >
              {{ unit.cta }}
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>
