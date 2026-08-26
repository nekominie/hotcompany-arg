<script setup lang="ts">
import { fisinorConfig } from '../config/fisinorConfig'

defineEmits<{
  (e: 'open-portal'): void
}>()
</script>

<template>
  <header class="sticky top-0 z-40 w-full bg-white/90 backdrop-blur border-b border-slate-200">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="flex h-16 items-center justify-between">
        <a href="#inicio" class="flex items-center gap-3 group">
          <svg
            class="h-10 w-10 transition-transform group-hover:rotate-12"
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M32 4L56 17.5V44.5L32 58L8 44.5V17.5L32 4Z" stroke="#00A8CC" stroke-width="2.5" fill="#F8FAFC" />
            <circle cx="32" cy="32" r="8" fill="#FF9F1C" />
            <path d="M32 16V24M32 40V48M16 32H24M40 32H48" stroke="#FF9F1C" stroke-width="2" stroke-linecap="round" />
            <path d="M22 22L26 26M38 38L42 42M42 22L38 26M26 38L22 42" stroke="#00A8CC" stroke-width="2" stroke-linecap="round" />
            <path d="M20 32C20 32 24 28 24 32C24 36 28 32 28 32C28 32 32 28 32 32C32 36 36 32 36 32C36 32 40 28 40 32C40 36 44 32 44 32" stroke="#00A8CC" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          <div class="leading-tight">
            <div class="text-lg font-bold tracking-tight text-fisinor-dark">{{ fisinorConfig.brand.shortName }}</div>
            <div class="text-[10px] uppercase tracking-wider text-slate-500">{{ fisinorConfig.brand.rfc }}</div>
          </div>
        </a>

        <nav class="hidden md:flex items-center gap-8">
          <a
            v-for="link in fisinorConfig.header.nav"
            :key="link.href"
            :href="link.href"
            class="text-sm font-medium text-slate-600 hover:text-fisinor-cyan transition-colors"
          >
            {{ link.label }}
          </a>
        </nav>

        <button
          class="rounded-lg bg-fisinor-cyan px-4 py-2 text-sm font-semibold text-white shadow hover:bg-cyan-600 transition-colors"
          @click="$emit('open-portal')"
        >
          {{ fisinorConfig.header.employeePortalLabel }}
        </button>
      </div>
    </div>
  </header>
</template>
