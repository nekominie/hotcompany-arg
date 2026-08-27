<script setup lang="ts">
import { fisinorConfig } from '../config/fisinorConfig'

const tickerText = fisinorConfig.topBar.ticker.join(' ')
</script>

<template>
  <div class="border-b border-slate-200 bg-white text-xs text-slate-600">
    <div class="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 sm:px-6 lg:px-8">
      <div class="hidden items-center gap-3 font-medium text-fisinor-cyan sm:flex">
        <span class="relative flex h-2 w-2">
          <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-fisinor-ping opacity-60" />
          <span class="relative inline-flex h-2 w-2 rounded-full bg-fisinor-ping" />
        </span>
        {{ fisinorConfig.topBar.systemStatus }}
      </div>

      <div class="flex-1 overflow-hidden sm:mx-8">
        <div class="ticker-track flex whitespace-nowrap">
          <span class="ticker-item inline-flex items-center">
            <span class="font-medium text-slate-700">Últimas noticias:</span>
            <span class="ml-2 text-slate-500">{{ tickerText }}</span>
          </span>
          <span class="ticker-item inline-flex items-center">
            <span class="font-medium text-slate-700">Últimas noticias:</span>
            <span class="ml-2 text-slate-500">{{ tickerText }}</span>
          </span>
          <span class="ticker-item inline-flex items-center">
            <span class="font-medium text-slate-700">Últimas noticias:</span>
            <span class="ml-2 text-slate-500">{{ tickerText }}</span>
          </span>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <span class="hidden text-slate-400 sm:inline">{{ fisinorConfig.topBar.languageLabel }}</span>
        <select class="rounded border border-slate-300 bg-white px-2 py-1 text-xs text-slate-700 focus:border-fisinor-cyan focus:outline-none focus:ring-1 focus:ring-fisinor-cyan">
          <option v-for="lang in fisinorConfig.topBar.languages" :key="lang" :value="lang">{{ lang }}</option>
        </select>
      </div>
    </div>
  </div>
</template>

<style scoped>
.ticker-track {
  animation: marquee 35s linear infinite;
}

.ticker-track:hover {
  animation-play-state: paused;
}

.ticker-item {
  flex-shrink: 0;
  padding-right: 4rem;
}

@keyframes marquee {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-33.333%);
  }
}
</style>
