<script setup lang="ts">
import { ref } from 'vue'
import { fisinorConfig } from '../config/fisinorConfig'

defineEmits<{
  (e: 'open-portal'): void
}>()

const activeDropdown = ref<string | null>(null)

function onMouseEnter(label: string) {
  activeDropdown.value = label
}

function onMouseLeave() {
  activeDropdown.value = null
}
</script>

<template>
  <header class="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="flex h-20 items-center justify-between">
        <a href="#inicio" class="flex items-center gap-3">
          <svg class="h-12 w-12" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M32 4L56 17.5V44.5L32 58L8 44.5V17.5L32 4Z" stroke="#00A8CC" stroke-width="2.5" fill="#F8FAFC" />
            <circle cx="32" cy="32" r="8" fill="#FF9F1C" />
            <path d="M32 16V24M32 40V48M16 32H24M40 32H48" stroke="#FF9F1C" stroke-width="2" stroke-linecap="round" />
            <path d="M20 32C20 32 24 28 24 32C24 36 28 32 28 32C28 32 32 28 32 32C32 36 36 32 36 32C36 32 40 28 40 32C40 36 44 32 44 32" stroke="#00A8CC" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          <div class="leading-tight">
            <div class="font-serif text-xl font-bold tracking-tight text-fisinor-dark">{{ fisinorConfig.brand.shortName }}</div>
            <div class="text-[10px] uppercase tracking-widest text-slate-500">{{ fisinorConfig.brand.fullName }}</div>
          </div>
        </a>

        <nav class="hidden items-center gap-8 lg:flex">
          <div
            v-for="link in fisinorConfig.header.nav"
            :key="link.label"
            class="relative"
            @mouseenter="onMouseEnter(link.label)"
            @mouseleave="onMouseLeave"
          >
            <a
              :href="link.href"
              class="flex items-center gap-1 py-2 text-sm font-medium text-slate-700 transition-colors hover:text-fisinor-cyan"
            >
              {{ link.label }}
              <svg v-if="link.children" xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </a>
            <div
              v-if="link.children && activeDropdown === link.label"
              class="absolute left-0 top-full mt-1 w-56 rounded-lg border border-slate-200 bg-white py-2 shadow-xl"
            >
              <a
                v-for="child in link.children"
                :key="child.label"
                :href="child.href"
                class="block px-4 py-2 text-sm text-slate-700 transition-colors hover:bg-slate-50 hover:text-fisinor-cyan"
              >
                {{ child.label }}
              </a>
            </div>
          </div>
        </nav>

        <button
          class="rounded border border-fisinor-dark bg-fisinor-dark px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
          @click="$emit('open-portal')"
        >
          {{ fisinorConfig.header.employeePortalLabel }}
        </button>
      </div>
    </div>
  </header>
</template>
