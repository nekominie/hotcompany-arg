<script setup lang="ts">
import { fisinorConfig } from '../../config/fisinorConfig'

defineProps<{
  cartCount: number
  sessionName: string | null
}>()

const emit = defineEmits<{
  (e: 'open-cart'): void
  (e: 'logout'): void
  (e: 'open-login'): void
}>()

const config = fisinorConfig
</script>

<template>
  <header class="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur">
    <div class="mx-auto flex h-20 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
      <a href="/" class="flex items-center gap-3">
        <img
          src="/img/icon_fisinor.png"
          alt="FISINOR"
          class="h-12 w-12 object-contain"
        />
        <div class="leading-tight">
          <div class="text-xl font-bold tracking-tight text-fisinor-dark brand-title">
            {{ config.brand.shortName }}
          </div>
          <div class="text-[11px] uppercase tracking-widest text-slate-500">
            {{ config.tienda.brandTitle }}
          </div>
        </div>
      </a>

      <div class="ml-auto flex items-center gap-3">
        <a
          href="/"
          class="hidden text-sm font-medium text-slate-600 transition-colors hover:text-fisinor-cyan sm:block"
        >
          {{ config.tienda.backLabel }}
        </a>

        <template v-if="sessionName">
          <span class="hidden items-center gap-2 md:flex">
            <span class="grid h-8 w-8 place-items-center rounded-full bg-fisinor-dark text-[11px] font-bold text-white">
              {{ sessionName.split(' ').filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase() }}
            </span>
            <span class="text-sm font-semibold text-fisinor-dark">{{ sessionName }}</span>
          </span>
          <button
            type="button"
            class="text-xs font-medium text-slate-400 transition-colors hover:text-fisinor-cyan"
            @click="emit('logout')"
          >
            {{ config.tienda.session.logoutLabel }}
          </button>
        </template>

        <button
          v-else
          type="button"
          class="rounded border border-fisinor-dark bg-fisinor-dark px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
          @click="emit('open-login')"
        >
          {{ config.tienda.session.loginLabel }}
        </button>

        <button
          type="button"
          class="relative rounded border border-fisinor-dark bg-fisinor-dark px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
          :aria-label="config.tienda.cartLabel"
          @click="emit('open-cart')"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8" class="h-5 w-5" aria-hidden="true">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
            />
          </svg>
          <span
            v-if="cartCount > 0"
            class="absolute -right-2 -top-2 grid h-5 w-5 place-items-center rounded-full bg-fisinor-desert text-[10px] font-bold text-fisinor-dark"
          >
            {{ cartCount }}
          </span>
        </button>
      </div>
    </div>
  </header>
</template>
