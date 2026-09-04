<script setup lang="ts">
import { computed, ref } from 'vue'
import { fisinorConfig, type TiendaProduct } from '../../config/fisinorConfig'
import { formatMxn } from '../../tienda/currency'
import TiendaStars from './TiendaStars.vue'

const props = defineProps<{
  product: TiendaProduct
  relatedProducts: TiendaProduct[]
}>()

const emit = defineEmits<{
  (e: 'add', product: TiendaProduct, qty: number): void
  (e: 'navigate', productId: string): void
  (e: 'back'): void
}>()

const config = fisinorConfig
const detail = computed(() => config.tienda.detail)

const galleryIndex = ref(0)
const qty = ref(1)
const notifyRequested = ref(false)

const isSoldOut = computed(() => props.product.stock === 'soldout')

const categoryLabel = computed(
  () =>
    config.tienda.categories.find((category) => category.id === props.product.categoryId)?.label ??
    '',
)

const galleryLabels = computed(() => detail.value.galleryLabels)

const registryCode = computed(
  () => detail.value.registryPrefix + props.product.code.replace(/[^A-Z0-9]/gi, ''),
)

const specs = computed(() => [
  { label: detail.value.specsLabels.code, value: props.product.code, mono: true },
  { label: detail.value.specsLabels.category, value: categoryLabel.value, mono: false },
  { label: detail.value.specsLabels.unit, value: props.product.unit, mono: false },
  { label: detail.value.specsLabels.origin, value: props.product.origin, mono: false },
  {
    label: detail.value.specsLabels.classification,
    value: isSoldOut.value ? config.tienda.soldOutLabel : config.tienda.availableLabel,
    mono: false,
  },
  { label: detail.value.specsLabels.registry, value: registryCode.value, mono: true },
])

function addToCart() {
  emit('add', props.product, qty.value)
}

function requestNotify() {
  notifyRequested.value = true
}
</script>

<template>
  <section>
    <!-- Breadcrumb -->
    <nav class="mb-5 flex flex-wrap items-center gap-2 text-xs text-slate-500" aria-label="Ruta de navegación">
      <button type="button" class="font-semibold text-fisinor-cyan hover:underline" @click="emit('back')">
        {{ detail.breadcrumbHome }}
      </button>
      <span aria-hidden="true">›</span>
      <span>{{ categoryLabel }}</span>
      <span aria-hidden="true">›</span>
      <span class="font-semibold text-fisinor-dark">{{ product.name }}</span>
    </nav>

    <div class="grid gap-8 lg:grid-cols-2">
      <!-- Galería -->
      <div>
        <div
          class="relative grid h-80 place-items-center overflow-hidden rounded-lg border border-slate-200 bg-gradient-to-br from-fisinor-hospital via-white to-cyan-50"
          :class="{ 'opacity-60 grayscale': isSoldOut }"
        >
          <img
            v-if="product.imageUrl"
            :src="product.imageUrl"
            :alt="product.name"
            class="h-full w-full object-cover"
          />
          <span v-else class="brand-title text-4xl !text-fisinor-cyan">{{ product.code }}</span>
          <span class="absolute bottom-3 left-4 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
            {{ galleryLabels[galleryIndex] }}
          </span>
          <span
            v-if="isSoldOut"
            class="absolute right-4 top-4 rounded border border-red-200 bg-white px-3 py-1 text-xs font-bold tracking-widest text-red-600"
          >
            {{ config.tienda.soldOutLabel }}
          </span>
        </div>
        <div class="mt-3 grid grid-cols-4 gap-3">
          <button
            v-for="(label, index) in galleryLabels"
            :key="label"
            type="button"
            class="grid h-20 place-items-center rounded border bg-gradient-to-br from-fisinor-hospital to-white transition-all"
            :class="
              galleryIndex === index
                ? 'border-fisinor-cyan ring-1 ring-fisinor-cyan'
                : 'border-slate-200 hover:border-fisinor-cyan'
            "
            :aria-label="`Vista ${label}`"
            @click="galleryIndex = index"
          >
            <span class="brand-title text-[10px]" :class="galleryIndex === index ? '!text-fisinor-cyan' : '!text-slate-400'">
              {{ label }}
            </span>
          </button>
        </div>
      </div>

      <!-- Información de compra -->
      <div>
        <p class="text-xs font-bold uppercase tracking-widest text-fisinor-cyan">
          {{ categoryLabel }} · <span class="font-mono">{{ product.code }}</span>
        </p>
        <h1 class="mt-2 font-serif text-3xl font-semibold leading-tight text-fisinor-dark">
          {{ product.name }}
        </h1>

        <div class="mt-3 flex flex-wrap items-center gap-2 text-sm">
          <TiendaStars :rating="product.rating" />
          <span class="font-semibold text-fisinor-dark">{{ product.rating.toFixed(1) }}</span>
          <span class="text-slate-400">
            ({{ product.reviewCount.toLocaleString('es-MX') }} {{ detail.ratingLabel }})
          </span>
        </div>

        <p class="mt-4 text-3xl font-bold text-fisinor-dark">
          {{ formatMxn(product.price) }}
          <span class="text-sm font-medium text-slate-400">/ {{ product.unit }}</span>
        </p>

        <p
          class="mt-2 text-sm font-semibold"
          :class="isSoldOut ? 'text-red-600' : 'text-emerald-600'"
        >
          {{ isSoldOut ? config.tienda.soldOutLabel : config.tienda.availableLabel }}
        </p>

        <!-- Acción de compra / notificación -->
        <div v-if="!isSoldOut" class="mt-5 flex items-end gap-3">
          <div>
            <label class="mb-1 block text-xs font-medium text-slate-500" for="detail-qty">
              {{ detail.qtyLabel }}
            </label>
            <select
              id="detail-qty"
              v-model.number="qty"
              class="rounded border border-slate-300 px-3 py-2.5 text-sm focus:border-fisinor-cyan focus:outline-none focus:ring-1 focus:ring-fisinor-cyan"
            >
              <option v-for="n in 10" :key="n" :value="n">{{ n }}</option>
            </select>
          </div>
          <button
            type="button"
            class="flex-1 rounded bg-fisinor-cyan px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-cyan-600"
            @click="addToCart"
          >
            {{ config.tienda.addToCartLabel }}
          </button>
        </div>

        <div v-else class="mt-5">
          <p class="mb-3 rounded border border-fisinor-desert/40 bg-fisinor-desert/10 px-4 py-3 text-xs font-medium text-fisinor-dark">
            {{ detail.soldOutNote }}
          </p>
          <p v-if="notifyRequested" class="text-sm font-semibold text-emerald-600" role="status">
            ✓ {{ detail.notifyDone }}
          </p>
          <button
            v-else
            type="button"
            class="rounded border border-fisinor-dark px-5 py-3 text-sm font-bold text-fisinor-dark transition-colors hover:bg-fisinor-dark hover:text-white"
            @click="requestNotify"
          >
            {{ detail.notifyLabel }}
          </button>
        </div>

        <p class="mt-5 flex items-center gap-2 rounded border border-slate-200 bg-white px-4 py-3 text-xs text-slate-500">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8" class="h-4 w-4 shrink-0 text-fisinor-cyan" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
          </svg>
          {{ detail.deliveryNote }}
        </p>
      </div>
    </div>

    <!-- Descripción y especificaciones -->
    <div class="mt-10 grid gap-8 lg:grid-cols-2">
      <article class="rounded-lg border border-slate-200 bg-white p-6">
        <h2 class="font-serif text-xl font-semibold text-fisinor-dark">
          {{ detail.aboutTitle }}
        </h2>
        <p class="mt-3 text-sm leading-relaxed text-slate-600">
          {{ product.detail }}
        </p>
        <ul class="mt-4 grid gap-2">
          <li v-for="feature in product.features" :key="feature" class="flex items-start gap-2 text-sm text-slate-600">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.4" class="mt-0.5 h-3.5 w-3.5 shrink-0 text-fisinor-cyan" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
            {{ feature }}
          </li>
        </ul>
      </article>

      <article class="rounded-lg border border-slate-200 bg-white p-6">
        <h2 class="font-serif text-xl font-semibold text-fisinor-dark">
          {{ detail.specsTitle }}
        </h2>
        <table class="mt-3 w-full text-sm">
          <tbody>
            <tr v-for="spec in specs" :key="spec.label" class="border-b border-slate-100 last:border-none">
              <td class="py-2.5 pr-4 font-medium text-slate-500">{{ spec.label }}</td>
              <td class="py-2.5 text-right font-semibold text-fisinor-dark" :class="spec.mono ? 'font-mono text-xs' : ''">
                {{ spec.value }}
              </td>
            </tr>
          </tbody>
        </table>
      </article>
    </div>

    <!-- Reseñas de la base de datos -->
    <div v-if="product.reviews && product.reviews.length > 0" class="mt-10">
      <h2 class="font-serif text-xl font-semibold text-fisinor-dark">Reseñas de clientes</h2>
      <div class="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <article
          v-for="(review, reviewIndex) in product.reviews"
          :key="`${review.author}-${reviewIndex}`"
          class="rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
        >
          <div class="flex items-center justify-between gap-3">
            <span class="text-sm font-bold text-fisinor-dark">{{ review.author }}</span>
            <TiendaStars :rating="review.rating" />
          </div>
          <p class="mt-2 text-sm leading-relaxed text-slate-600">{{ review.comment }}</p>
        </article>
      </div>
    </div>

    <!-- Productos relacionados -->
    <div v-if="relatedProducts.length > 0" class="mt-12">
      <h2 class="font-serif text-xl font-semibold text-fisinor-dark">
        {{ detail.relatedTitle }}
      </h2>
      <div class="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <button
          v-for="related in relatedProducts"
          :key="related.id"
          type="button"
          class="flex flex-col overflow-hidden rounded-lg border border-slate-200 bg-white text-left shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg"
          @click="emit('navigate', related.id)"
        >
          <div
            class="grid h-28 place-items-center bg-gradient-to-br from-fisinor-hospital via-white to-cyan-50"
            :class="{ 'opacity-60 grayscale': related.stock === 'soldout' }"
          >
            <span class="brand-title text-sm" :class="related.stock === 'soldout' ? '!text-slate-400' : '!text-fisinor-cyan'">
              {{ related.code }}
            </span>
          </div>
          <div class="flex flex-1 flex-col gap-1 p-3">
            <span class="text-sm font-semibold leading-snug text-fisinor-dark">{{ related.name }}</span>
            <span class="text-sm font-bold text-fisinor-dark">{{ formatMxn(related.price) }}</span>
            <span class="flex items-center gap-1.5 text-xs text-slate-400">
              <TiendaStars :rating="related.rating" />
              {{ related.rating.toFixed(1) }}
            </span>
            <span
              v-if="related.stock === 'soldout'"
              class="text-[10px] font-bold tracking-widest text-red-600"
            >
              {{ config.tienda.soldOutLabel }}
            </span>
          </div>
        </button>
      </div>
    </div>
  </section>
</template>
