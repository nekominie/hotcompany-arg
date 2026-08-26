<script setup lang="ts">
import { fisinorConfig } from '../config/fisinorConfig'

defineEmits<{
  (e: 'scroll-to', id: string): void
}>()
</script>

<template>
  <section
    id="inicio"
    class="relative isolate overflow-hidden bg-fisinor-medical"
  >
    <div class="absolute inset-0 -z-10 opacity-30">
      <svg class="h-full w-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="hex-grid" width="40" height="40" patternUnits="userSpaceOnUse" patternTransform="scale(2)">
            <path d="M20 0L40 10V30L20 40L0 30V10L20 0Z" fill="none" stroke="#00A8CC" stroke-width="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hex-grid)" />
      </svg>
    </div>
    <div class="absolute inset-0 -z-10 bg-gradient-to-br from-white via-white/80 to-fisinor-cyan/10" />

    <div class="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
      <div class="grid gap-12 lg:grid-cols-2 lg:items-center">
        <div>
          <div class="inline-flex items-center gap-2 rounded-full bg-fisinor-cyan/10 px-3 py-1 text-xs font-semibold text-fisinor-cyan mb-6">
            <span class="relative flex h-2 w-2">
              <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-fisinor-cyan opacity-75" />
              <span class="relative inline-flex h-2 w-2 rounded-full bg-fisinor-cyan" />
            </span>
            {{ fisinorConfig.brand.fullName }}
          </div>
          <h1 class="text-4xl font-bold tracking-tight text-fisinor-dark sm:text-5xl lg:text-6xl">
            {{ fisinorConfig.hero.headline }}
          </h1>
          <p class="mt-6 text-lg leading-8 text-slate-600">
            {{ fisinorConfig.hero.subheadline }}
          </p>
          <div class="mt-10 flex flex-wrap items-center gap-4">
            <a
              :href="fisinorConfig.hero.ctaHref"
              class="rounded-xl bg-fisinor-cyan px-6 py-3 text-base font-semibold text-white shadow-lg hover:bg-cyan-600 transition-colors"
            >
              {{ fisinorConfig.hero.ctaLabel }}
            </a>
            <button
              class="rounded-xl border border-slate-300 bg-white px-6 py-3 text-base font-semibold text-fisinor-dark hover:bg-slate-50 transition-colors"
              @click="$emit('scroll-to', 'avisos')"
            >
              Avisos comunitarios
            </button>
          </div>
        </div>

        <div class="relative hidden lg:block">
          <div class="aspect-[4/3] rounded-2xl bg-white p-4 shadow-2xl ring-1 ring-slate-200">
            <div class="relative h-full w-full overflow-hidden rounded-xl bg-gradient-to-br from-slate-100 to-fisinor-cyan/20">
              <div class="absolute inset-0 flex items-center justify-center">
                <svg class="h-48 w-48 text-fisinor-cyan/20" viewBox="0 0 64 64" fill="none">
                  <path d="M32 4L56 17.5V44.5L32 58L8 44.5V17.5L32 4Z" stroke="currentColor" stroke-width="1" />
                  <circle cx="32" cy="32" r="12" stroke="currentColor" stroke-width="1" />
                  <path d="M32 10V20M32 44V54M10 32H20M44 32H54" stroke="currentColor" stroke-width="1" stroke-linecap="round" />
                </svg>
              </div>
              <div class="absolute bottom-4 left-4 right-4 rounded-lg bg-white/90 p-3 text-xs text-slate-600 shadow">
                <div class="flex items-center justify-between">
                  <span class="font-semibold">Laboratorio de Integración Céfalo-Soma</span>
                  <span class="rounded bg-fisinor-desert px-2 py-0.5 text-white font-bold">EN VIVO</span>
                </div>
                <div class="mt-1 font-mono text-slate-500">Cámara 7-C — Temperatura: 41.2°C</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
