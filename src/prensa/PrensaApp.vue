<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { fisinorConfig } from '../config/fisinorConfig'
import { fetchPressArticle, fetchPressArticles, formatPressDate, type PressArticleDetail, type PressArticlePreview } from './articles'

const config = fisinorConfig
const prensa = computed(() => config.prensa)

// --- Navegación por hash (#/articulo/<id>), compatible con el botón atrás ---
const selectedId = ref<string | null>(null)

function readHash() {
  const match = window.location.hash.match(/^#\/articulo\/([^/?]+)$/)
  selectedId.value = match ? decodeURIComponent(match[1]) : null
}

function onHashChange() {
  readHash()
  if (selectedId.value) {
    void loadDetail(selectedId.value)
  } else {
    detail.value = null
    detailMissing.value = false
  }
  window.scrollTo({ top: 0 })
}

function openArticle(id: string) {
  window.location.hash = `#/articulo/${encodeURIComponent(id)}`
}

function closeArticle() {
  window.location.hash = ''
}

// --- Lista ---
const articles = ref<PressArticlePreview[]>([])
const listLoading = ref(true)
const listError = ref(false)

async function loadList() {
  listLoading.value = true
  listError.value = false
  try {
    articles.value = await fetchPressArticles()
  } catch {
    listError.value = true
    articles.value = []
  } finally {
    listLoading.value = false
  }
}

// --- Detalle ---
const detail = ref<PressArticleDetail | null>(null)
const detailLoading = ref(false)
const detailMissing = ref(false)

async function loadDetail(id: string) {
  detailLoading.value = true
  detailMissing.value = false
  detail.value = null
  try {
    detail.value = await fetchPressArticle(id)
  } catch {
    detailMissing.value = true
  } finally {
    detailLoading.value = false
  }
  window.scrollTo({ top: 0 })
}

onMounted(async () => {
  readHash()
  window.addEventListener('hashchange', onHashChange)
  await loadList()
  if (selectedId.value) {
    await loadDetail(selectedId.value)
  }
})

onUnmounted(() => {
  window.removeEventListener('hashchange', onHashChange)
})</script>

<template>
  <div class="min-h-screen bg-white">
    <!-- Encabezado -->
    <header class="border-b border-slate-200 bg-white">
      <div class="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-4 px-4 py-5 sm:flex-row sm:px-6 lg:px-8">
        <a href="/" class="flex items-center gap-3">
          <img src="/img/icon_fisinor.png" alt="FISINOR" class="h-11 w-11 object-contain" />
          <div class="leading-tight">
            <div class="font-serif text-xl font-bold brand-title">{{ config.brand.shortName }}</div>
            <div class="text-[10px] uppercase tracking-widest text-slate-500">{{ config.brand.fullName }}</div>
          </div>
        </a>
        <a
          href="/"
          class="group inline-flex items-center justify-center gap-2 rounded bg-fisinor-dark px-5 py-3 text-sm font-bold uppercase tracking-wider text-white shadow transition-all hover:bg-slate-800"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          {{ prensa.backLabel }}
        </a>
      </div>
    </header>

    <main class="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <!-- Vista de detalle -->
      <template v-if="selectedId">
        <button
          type="button"
          class="group inline-flex items-center gap-2 text-sm font-semibold text-fisinor-cyan hover:text-cyan-700"
          @click="closeArticle"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          {{ prensa.detailBackLabel }}
        </button>

        <div v-if="detailLoading" class="py-16 text-center text-sm text-slate-500">
          <span class="inline-block h-6 w-6 animate-spin rounded-full border-2 border-fisinor-cyan border-t-transparent"></span>
          <p class="mt-3">{{ prensa.loadingLabel }}</p>
        </div>

        <div v-else-if="detailMissing || !detail" class="py-16 text-center text-sm text-slate-500">
          {{ prensa.notFoundLabel }}
        </div>

        <article v-else class="mx-auto mt-6 max-w-3xl">
          <p class="text-xs font-bold uppercase tracking-widest text-fisinor-cyan">{{ formatPressDate(detail.publishedAt) }}</p>
          <h1 class="mt-3 font-serif text-3xl font-bold leading-tight text-fisinor-dark sm:text-4xl">
            {{ detail.title }}
          </h1>
          <p class="mt-3 text-sm font-medium text-slate-500">{{ prensa.byLabel }} {{ detail.author }}</p>
          <hr class="my-8 border-slate-200" />
          <div class="press-content" v-html="detail.contentHtml"></div>
        </article>
      </template>

      <!-- Vista de lista -->
      <template v-else>
        <div class="mb-10 text-center">
          <h1 class="font-serif text-3xl font-bold text-fisinor-dark sm:text-4xl">{{ prensa.title }}</h1>
          <p class="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">{{ prensa.subtitle }}</p>
          <p v-if="!listLoading && !listError" class="mt-2 text-xs font-semibold uppercase tracking-widest text-slate-400">
            {{ articles.length }} {{ prensa.countLabel }}
          </p>
        </div>

        <div v-if="listLoading" class="py-16 text-center text-sm text-slate-500">
          <span class="inline-block h-6 w-6 animate-spin rounded-full border-2 border-fisinor-cyan border-t-transparent"></span>
          <p class="mt-3">{{ prensa.loadingLabel }}</p>
        </div>

        <div v-else-if="listError || articles.length === 0" class="py-16 text-center text-sm text-slate-500">
          {{ prensa.emptyLabel }}
        </div>

        <div v-else class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <article
            v-for="article in articles"
            :key="article.id"
            class="group flex cursor-pointer flex-col rounded-xl border border-slate-200 bg-white p-7 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
            @click="openArticle(article.id)"
          >
            <div class="text-xs font-medium text-slate-400">{{ formatPressDate(article.publishedAt) }}</div>
            <h2 class="mt-2 font-serif text-xl font-bold leading-snug text-fisinor-dark group-hover:text-fisinor-cyan">
              {{ article.title }}
            </h2>
            <p class="mt-1 text-xs font-semibold uppercase tracking-wider text-slate-400">
              {{ prensa.byLabel }} {{ article.author }}
            </p>
            <p class="mt-3 flex-1 text-sm leading-6 text-slate-600">
              {{ article.excerpt }}
            </p>
            <span class="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-fisinor-cyan transition-colors group-hover:text-cyan-700">
              {{ prensa.readLabel }}
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </span>
          </article>
        </div>
      </template>
    </main>
  </div>
</template>

<style scoped>
.press-content {
  font-size: 1rem;
  line-height: 1.8;
  color: #334155;
  overflow-wrap: anywhere;
}
.press-content :is(h1, h2, h3) {
  font-family: Georgia, 'Times New Roman', serif;
  font-weight: 700;
  color: #0f172a;
  line-height: 1.3;
  margin: 1.75em 0 0.6em;
}
.press-content p {
  margin: 0 0 1.1em;
}
.press-content a {
  color: #00a8cc;
  text-decoration: underline;
}
.press-content img {
  max-width: 100%;
  height: auto;
  border-radius: 0.75rem;
  margin: 1.25em 0;
}
.press-content ul,
.press-content ol {
  margin: 0 0 1.1em 1.25em;
}
.press-content blockquote {
  margin: 0 0 1.1em;
  padding-left: 1em;
  border-left: 3px solid #00a8cc;
  color: #475569;
  font-style: italic;
}
</style>
