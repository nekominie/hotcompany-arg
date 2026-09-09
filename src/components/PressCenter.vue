<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref } from 'vue'
import { fisinorConfig } from '../config/fisinorConfig'

const API_BASE = (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/$/, '')

interface LandingArticle {
  id: string
  title: string
  author: string
  publishedAt: string
  excerpt: string
  landingHtml: string | null
}

// Artículos publicados desde el panel: reemplazan por completo las vistas fijas.
// Sin artículos, se muestra el aviso de vacío.
const articles = ref<LandingArticle[]>([])
const loading = ref(true)

async function loadArticles() {
  loading.value = true
  try {
    const controller = new AbortController()
    const timeout = window.setTimeout(() => controller.abort(), 3000)
    const response = await fetch(`${API_BASE}/v1/press-articles/landing`, { signal: controller.signal })
    window.clearTimeout(timeout)
    if (!response.ok) {
      articles.value = []
      return
    }
    const rows = (await response.json()) as LandingArticle[]
    articles.value = Array.isArray(rows) ? rows : []
  } catch {
    articles.value = []
  } finally {
    loading.value = false
    await nextTick()
    updateArrows()
  }
}

function detailHref(id: string): string {
  return `/prensa.html#/articulo/${encodeURIComponent(id)}`
}

// Tu HTML controla todo el diseño: cualquier elemento con el atributo de acción
// abre el artículo completo en la vista de prensa.
function onLandingHtmlClick(articleId: string, event: MouseEvent) {
  const target = event.target as HTMLElement | null
  const actionEl = target?.closest?.('[data-fisinor-action]') as HTMLElement | null
  if (!actionEl) return
  if (actionEl.dataset.fisinorAction !== fisinorConfig.pressCenter.readAction) return
  event.preventDefault()
  window.location.href = detailHref(articleId)
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('es-MX', { dateStyle: 'long' })
  } catch {
    return iso
  }
}

// --- Carrusel horizontal con quiebre por artículo ---
const trackEl = ref<HTMLElement | null>(null)
const canLeft = ref(false)
const canRight = ref(false)

function updateArrows() {
  const track = trackEl.value
  if (!track) {
    canLeft.value = false
    canRight.value = false
    return
  }
  canLeft.value = track.scrollLeft > 4
  canRight.value = track.scrollLeft + track.clientWidth < track.scrollWidth - 4
}

function stepWidth(): number {
  const track = trackEl.value
  if (!track) return 320
  const first = track.querySelector<HTMLElement>('[data-press-card]')
  if (!first) return Math.max(240, track.clientWidth * 0.8)
  const gap = parseFloat(getComputedStyle(track).columnGap || '32')
  return first.offsetWidth + (Number.isNaN(gap) ? 32 : gap)
}

function scrollStep(direction: -1 | 1) {
  trackEl.value?.scrollBy({ left: direction * stepWidth(), behavior: 'smooth' })
}

function onResize() {
  updateArrows()
}

onMounted(() => {
  window.addEventListener('resize', onResize)
  void loadArticles()
})

onUnmounted(() => {
  window.removeEventListener('resize', onResize)
})
</script>

<template>
  <section id="prensa" class="bg-white py-24">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="mb-12 text-center">
        <span class="text-xs font-bold uppercase tracking-widest text-fisinor-cyan">{{ fisinorConfig.pressCenter.sectionLabel }}</span>
        <h2 class="mt-3 font-serif text-3xl font-bold text-fisinor-dark sm:text-4xl">
          {{ fisinorConfig.pressCenter.headline }}
        </h2>
      </div>

      <div v-if="loading" class="py-10 text-center text-sm text-slate-500">
        <span class="inline-block h-6 w-6 animate-spin rounded-full border-2 border-fisinor-cyan border-t-transparent"></span>
      </div>

      <div v-else-if="articles.length === 0" class="py-10 text-center text-sm text-slate-500">
        {{ fisinorConfig.pressCenter.emptyLabel }}
      </div>

      <template v-else>
        <div class="mb-6 flex items-center justify-end gap-2">
          <button
            type="button"
            class="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-fisinor-dark shadow-sm transition-all hover:border-fisinor-cyan hover:text-fisinor-cyan disabled:cursor-not-allowed disabled:opacity-30"
            :disabled="!canLeft"
            :aria-label="fisinorConfig.pressCenter.prevLabel"
            @click="scrollStep(-1)"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            type="button"
            class="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-fisinor-dark shadow-sm transition-all hover:border-fisinor-cyan hover:text-fisinor-cyan disabled:cursor-not-allowed disabled:opacity-30"
            :disabled="!canRight"
            :aria-label="fisinorConfig.pressCenter.nextLabel"
            @click="scrollStep(1)"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <div
          ref="trackEl"
          class="flex snap-x snap-mandatory gap-8 overflow-x-auto pb-4"
          @scroll="updateArrows"
        >
          <template v-for="article in articles" :key="article.id">
            <!-- Tu HTML: sin marco ni estilos impuestos, todo lo controlas tú -->
            <div
              v-if="article.landingHtml"
              data-press-card
              class="w-[300px] shrink-0 snap-start sm:w-[360px]"
            >
              <div v-html="article.landingHtml" @click="onLandingHtmlClick(article.id, $event)"></div>
            </div>
            <!-- Sin HTML: tarjeta automática del sistema -->
            <article
              v-else
              data-press-card
              class="group flex w-[300px] shrink-0 snap-start flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg sm:w-[360px]"
            >
              <div class="flex flex-1 flex-col p-7">
                <div class="text-xs font-medium text-slate-400">{{ formatDate(article.publishedAt) }}</div>
                <h3 class="mt-2 font-serif text-xl font-bold leading-snug text-fisinor-dark group-hover:text-fisinor-cyan">
                  {{ article.title }}
                </h3>
                <p class="mt-1 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  {{ fisinorConfig.prensa.byLabel }} {{ article.author }}
                </p>
                <p class="mt-3 flex-1 text-sm leading-6 text-slate-600">
                  {{ article.excerpt }}
                </p>
              </div>
              <div class="px-7 pb-7">
                <a
                  :href="detailHref(article.id)"
                  class="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-fisinor-cyan transition-colors hover:text-cyan-700"
                >
                  {{ fisinorConfig.prensa.readLabel }}
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              </div>
            </article>
          </template>
        </div>
      </template>

      <div class="mt-12 text-center">
        <a
          href="/prensa.html"
          class="group inline-flex items-center gap-2 rounded bg-fisinor-dark px-8 py-3.5 text-sm font-bold uppercase tracking-wider text-white shadow-lg transition-all hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-xl"
        >
          {{ fisinorConfig.pressCenter.viewAllLabel }}
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </a>
      </div>
    </div>
  </section>
</template>


