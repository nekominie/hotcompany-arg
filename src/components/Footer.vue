<script setup lang="ts">
import { fisinorConfig } from '../config/fisinorConfig'
</script>

<template>
  <footer id="sostenibilidad" class="border-t border-slate-200 bg-white">
    <div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div class="grid gap-10 lg:grid-cols-3">
        <div>
          <div class="flex items-center gap-3">
            <svg class="h-10 w-10" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M32 4L56 17.5V44.5L32 58L8 44.5V17.5L32 4Z" stroke="#00A8CC" stroke-width="2.5" fill="#F8FAFC" />
              <circle cx="32" cy="32" r="8" fill="#FF9F1C" />
            </svg>
            <div>
              <div class="text-lg font-bold text-fisinor-dark">{{ fisinorConfig.brand.shortName }}</div>
              <div class="text-xs text-slate-500">{{ fisinorConfig.brand.fullName }}</div>
            </div>
          </div>
          <p class="mt-4 text-sm text-slate-500">
            {{ fisinorConfig.brand.headquarters }}<br>
            RFC: {{ fisinorConfig.brand.rfc }}<br>
            Operando desde {{ fisinorConfig.brand.year }}.
          </p>
        </div>

        <div>
          <h4 class="text-sm font-bold uppercase tracking-wider text-fisinor-dark">Certificaciones</h4>
          <ul class="mt-4 space-y-3">
            <li
              v-for="cert in fisinorConfig.footer.certifications"
              :key="cert.code"
              class="flex items-center gap-3 text-sm text-slate-600"
            >
              <span class="flex h-8 w-8 items-center justify-center rounded-full bg-fisinor-cyan/10 text-fisinor-cyan">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </span>
              <span>
                <span class="block font-semibold text-fisinor-dark">{{ cert.name }}</span>
                <span class="text-xs text-slate-500">Código: {{ cert.code }}</span>
              </span>
            </li>
          </ul>
        </div>

        <div>
          <h4 class="text-sm font-bold uppercase tracking-wider text-fisinor-dark">Legal</h4>
          <ul class="mt-4 space-y-2">
            <li v-for="link in fisinorConfig.footer.links" :key="link.label">
              <a :href="link.href" class="text-sm text-slate-600 hover:text-fisinor-cyan transition-colors">{{ link.label }}</a>
            </li>
          </ul>
        </div>
      </div>

      <div class="mt-12 rounded-lg border border-slate-200 bg-fisinor-medical p-4">
        <p class="text-xs leading-relaxed text-slate-500">
          <strong class="text-fisinor-dark">Aviso de privacidad:</strong> {{ fisinorConfig.footer.privacyNotice }}
        </p>
        <p class="mt-2 text-[10px] leading-relaxed text-slate-400">
          {{ fisinorConfig.footer.dnaClause }}
        </p>
      </div>

      <div class="mt-8 border-t border-slate-200 pt-8 text-center text-sm text-slate-500">
        {{ fisinorConfig.footer.copyright }}
      </div>
    </div>
  </footer>
</template>
