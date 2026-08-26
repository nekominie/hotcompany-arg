<script setup lang="ts">
import { fisinorConfig } from '../config/fisinorConfig'
</script>

<template>
  <section id="inicio" class="relative min-h-[720px] overflow-hidden">
    <!-- Background image with dark overlay -->
    <div class="absolute inset-0">
      <img
        :src="fisinorConfig.hero.backgroundImage"
        :alt="fisinorConfig.hero.backgroundAlt"
        class="h-full w-full object-cover"
      />
      <div class="absolute inset-0 bg-gradient-to-r from-fisinor-dark/90 via-fisinor-dark/70 to-fisinor-dark/40" />
      <div class="absolute inset-0 bg-gradient-to-t from-fisinor-dark/80 via-transparent to-fisinor-dark/20" />
    </div>

    <div class="relative mx-auto flex min-h-[720px] max-w-7xl flex-col justify-center px-4 py-24 sm:px-6 lg:px-8">
      <div class="max-w-3xl">
        <div class="mb-6 inline-flex items-center gap-2 rounded border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-wider text-white/90 backdrop-blur-sm">
          {{ fisinorConfig.hero.eyebrow }}
        </div>

        <h1 class="font-serif text-4xl font-bold leading-[1.1] text-white sm:text-5xl lg:text-6xl">
          {{ fisinorConfig.hero.headline }}
        </h1>

        <p class="mt-6 max-w-2xl text-lg leading-relaxed text-white/80">
          {{ fisinorConfig.hero.subheadline }}
        </p>

        <div class="mt-10 flex flex-wrap items-center gap-4">
          <a
            :href="fisinorConfig.hero.ctaPrimary.href"
            class="rounded bg-fisinor-cyan px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-cyan-600"
          >
            {{ fisinorConfig.hero.ctaPrimary.label }}
          </a>
          <a
            :href="fisinorConfig.hero.ctaSecondary.href"
            class="rounded border border-white/30 bg-white/10 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/20"
          >
            {{ fisinorConfig.hero.ctaSecondary.label }}
          </a>
        </div>
      </div>

      <!-- Floating cards -->
      <div class="mt-16 grid gap-4 sm:grid-cols-3 lg:max-w-4xl">
        <a
          v-for="card in fisinorConfig.hero.floatingCards"
          :key="card.id"
          :href="card.href"
          class="group rounded border border-white/20 bg-white/10 p-5 backdrop-blur-sm transition-all hover:-translate-y-1 hover:bg-white/15"
        >
          <h3 class="font-serif text-lg font-semibold text-white">{{ card.title }}</h3>
          <p class="mt-1 text-sm text-white/70">{{ card.description }}</p>
          <div class="mt-3 flex items-center gap-1 text-xs font-medium text-fisinor-cyan">
            <span>Explorar</span>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
        </a>
      </div>
    </div>
  </section>
</template>
