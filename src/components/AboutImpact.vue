<script setup lang="ts">
import { fisinorConfig } from '../config/fisinorConfig'
</script>

<template>
  <section id="nosotros" class="bg-white py-24">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="mb-16 text-center">
        <span class="text-xs font-bold uppercase tracking-widest text-fisinor-cyan">{{ fisinorConfig.about.sectionLabel }}</span>
        <h2 class="mt-3 font-serif text-3xl font-bold text-fisinor-dark sm:text-4xl">
          {{ fisinorConfig.about.headline }}
        </h2>
      </div>

      <div class="grid items-start gap-12 lg:grid-cols-2">
        <!-- Left column: Director quote + stats -->
        <div class="space-y-8">
          <div class="relative rounded-xl border border-slate-200 bg-fisinor-hospital p-8">
            <svg class="absolute left-6 top-6 h-8 w-8 text-fisinor-cyan/30" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H15.017C14.4647 8 14.017 8.44772 14.017 9V11C14.017 11.5523 13.5693 12 13.017 12H12.017V5H22.017V15C22.017 18.3137 19.3307 21 16.017 21H14.017ZM5.0166 21L5.0166 18C5.0166 16.8954 5.91203 16 7.0166 16H10.0166C10.5689 16 11.0166 15.5523 11.0166 15V9C11.0166 8.44772 10.5689 8 10.0166 8H6.0166C5.46432 8 5.0166 8.44772 5.0166 9V11C5.0166 11.5523 4.56889 12 4.0166 12H3.0166V5H13.0166V15C13.0166 18.3137 10.3303 21 7.0166 21H5.0166Z" />
            </svg>
            <blockquote class="pt-10 font-serif text-2xl font-medium leading-relaxed text-fisinor-dark">
              {{ fisinorConfig.about.director.quote }}
            </blockquote>
            <div class="mt-6 flex items-center gap-4">
              <img
                :src="fisinorConfig.about.director.image"
                :alt="fisinorConfig.about.director.name"
                class="h-16 w-16 rounded-full object-cover ring-2 ring-fisinor-cyan/20"
              />
              <div>
                <div class="font-semibold text-fisinor-dark">{{ fisinorConfig.about.director.name }}</div>
                <div class="text-sm text-slate-600">{{ fisinorConfig.about.director.title }}</div>
                <div class="text-xs text-slate-400">{{ fisinorConfig.about.director.credentials }}</div>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div v-for="stat in fisinorConfig.about.stats" :key="stat.label" class="rounded border border-slate-200 p-4 text-center">
              <div class="font-serif text-2xl font-bold text-fisinor-cyan">{{ stat.value }}</div>
              <div class="text-xs font-medium uppercase tracking-wide text-slate-500">{{ stat.label }}</div>
            </div>
          </div>
        </div>

        <!-- Right column: image + paragraphs -->
        <div class="space-y-6">
          <div class="overflow-hidden rounded-xl border border-slate-200 shadow-sm">
            <img
              :src="fisinorConfig.about.image"
              :alt="fisinorConfig.about.imageAlt"
              class="h-80 w-full object-cover"
            />
          </div>
          <p v-for="(paragraph, index) in fisinorConfig.about.paragraphs" :key="index" class="text-base leading-7 text-slate-600">
            {{ paragraph }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
