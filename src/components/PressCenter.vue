<script setup lang="ts">
import { fisinorConfig } from '../config/fisinorConfig'
</script>

<template>
  <section id="prensa" class="bg-white py-24">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="mb-16 text-center">
        <span class="text-xs font-bold uppercase tracking-widest text-fisinor-cyan">{{ fisinorConfig.pressCenter.sectionLabel }}</span>
        <h2 class="mt-3 font-serif text-3xl font-bold text-fisinor-dark sm:text-4xl">
          {{ fisinorConfig.pressCenter.headline }}
        </h2>
      </div>

      <div class="grid gap-8 lg:grid-cols-3">
        <article
          v-for="card in fisinorConfig.pressCenter.cards"
          :key="card.id"
          :id="card.id"
          class="group flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
          :class="card.highlight ? 'ring-2 ring-fisinor-desert/50' : ''"
        >
          <div class="relative h-52 overflow-hidden">
            <img
              :src="card.image"
              :alt="card.imageAlt"
              class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div v-if="card.status" class="absolute left-4 top-4 rounded bg-red-600 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white shadow">
              {{ card.status }}
            </div>
            <div class="absolute bottom-4 left-4 rounded bg-white/90 px-2 py-1 text-xs font-semibold text-slate-700 shadow">
              {{ card.tag }}
            </div>
          </div>
          <div class="flex flex-1 flex-col p-7">
            <div class="text-xs font-medium text-slate-400">{{ card.date }}</div>
            <h3 class="mt-2 font-serif text-xl font-bold leading-snug text-fisinor-dark group-hover:text-fisinor-cyan">
              {{ card.title }}
            </h3>
            <p class="mt-3 flex-1 text-sm leading-6 text-slate-600">
              {{ card.summary }}
            </p>
            <a
              :href="card.href"
              class="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-fisinor-cyan transition-colors hover:text-cyan-700"
            >
              {{ card.cta }}
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>
