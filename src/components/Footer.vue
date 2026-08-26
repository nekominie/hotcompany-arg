<script setup lang="ts">
import { fisinorConfig } from '../config/fisinorConfig'
</script>

<template>
  <footer id="contacto" class="border-t border-slate-200 bg-fisinor-dark text-white">
    <div class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div class="grid gap-12 lg:grid-cols-4">
        <!-- Company info -->
        <div class="lg:col-span-1">
          <div class="flex items-center gap-3">
            <svg class="h-10 w-10" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M32 4L56 17.5V44.5L32 58L8 44.5V17.5L32 4Z" stroke="#00A8CC" stroke-width="2.5" fill="#F8FAFC" />
              <circle cx="32" cy="32" r="8" fill="#FF9F1C" />
            </svg>
            <div>
              <div class="font-serif text-lg font-bold">{{ fisinorConfig.brand.shortName }}</div>
              <div class="text-[10px] uppercase tracking-wider text-slate-400">{{ fisinorConfig.brand.fullName }}</div>
            </div>
          </div>
          <p class="mt-4 text-sm leading-relaxed text-slate-400">
            {{ fisinorConfig.footer.company.description }}
          </p>
          <div class="mt-6 space-y-2 text-sm text-slate-400">
            <p>{{ fisinorConfig.footer.company.address }}</p>
            <p>{{ fisinorConfig.footer.company.phone }}</p>
            <p>{{ fisinorConfig.footer.company.email }}</p>
          </div>
        </div>

        <!-- Link columns -->
        <div v-for="column in fisinorConfig.footer.columns" :key="column.title">
          <h4 class="text-xs font-bold uppercase tracking-wider text-slate-300">{{ column.title }}</h4>
          <ul class="mt-4 space-y-3">
            <li v-for="link in column.links" :key="link.label">
              <a :href="link.href" class="text-sm text-slate-400 transition-colors hover:text-fisinor-cyan">{{ link.label }}</a>
            </li>
          </ul>
        </div>
      </div>

      <!-- Certifications -->
      <div class="mt-12 border-t border-slate-700 pt-10">
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div
            v-for="cert in fisinorConfig.footer.certifications"
            :key="cert.code"
            class="flex items-center gap-3 rounded border border-slate-700 bg-slate-800/50 p-3"
          >
            <span class="flex h-8 w-8 items-center justify-center rounded-full bg-fisinor-cyan/10 text-fisinor-cyan">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
            <span>
              <span class="block text-sm font-semibold text-white">{{ cert.name }}</span>
              <span class="text-xs text-slate-400">{{ cert.code }}</span>
            </span>
          </div>
        </div>
      </div>

      <!-- Legal / Privacy -->
      <div class="mt-12 rounded border border-slate-700 bg-slate-800/30 p-5">
        <p class="text-xs leading-relaxed text-slate-400">
          <strong class="text-slate-300">Aviso de privacidad:</strong> {{ fisinorConfig.footer.legal.privacyNotice }}
        </p>
        <p class="mt-2 text-[10px] leading-relaxed text-slate-500">
          {{ fisinorConfig.footer.legal.dnaClause }}
        </p>
      </div>

      <!-- Bottom bar -->
      <div class="mt-10 flex flex-col items-center justify-between gap-4 border-t border-slate-700 pt-8 sm:flex-row">
        <p class="text-xs text-slate-400">{{ fisinorConfig.footer.legal.copyright }}</p>
        <div class="flex flex-wrap justify-center gap-4 text-xs text-slate-400">
          <a v-for="link in fisinorConfig.footer.legal.links" :key="link.label" :href="link.href" class="hover:text-fisinor-cyan">
            {{ link.label }}
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>
