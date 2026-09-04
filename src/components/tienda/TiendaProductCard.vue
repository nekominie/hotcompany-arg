<script setup lang="ts">
import { computed } from 'vue'
import { fisinorConfig, type TiendaProduct } from '../../config/fisinorConfig'
import { formatMxn } from '../../tienda/currency'
import TiendaStars from './TiendaStars.vue'

const props = defineProps<{
  product: TiendaProduct
}>()

const emit = defineEmits<{
  (e: 'add', product: TiendaProduct): void
  (e: 'open', productId: string): void
}>()

const config = fisinorConfig

const categoryLabel = computed(
  () =>
    config.tienda.categories.find((category) => category.id === props.product.categoryId)?.label ??
    '',
)

const isSoldOut = computed(() => props.product.stock === 'soldout')
</script>

<template>
  <article class="group flex flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-lg">
    <!-- Imagen del producto (URL de la base de datos o placeholder) -->
    <div
      class="relative grid h-44 cursor-pointer place-items-center overflow-hidden border-b border-slate-100 bg-gradient-to-br from-fisinor-hospital via-white to-cyan-50 transition-transform group-hover:scale-[1.02]"
      :class="{ 'opacity-60 grayscale': isSoldOut }"
      @click="emit('open', product.id)"
    >
      <img
        v-if="product.imageUrl"
        :src="product.imageUrl"
        :alt="product.name"
        class="h-full w-full object-cover"
        loading="lazy"
      />
      <span v-else class="brand-title text-2xl !text-fisinor-cyan">{{ product.code }}</span>
      <span
        v-if="isSoldOut"
        class="absolute right-3 top-3 rounded border border-red-200 bg-white px-2 py-0.5 text-[10px] font-bold tracking-widest text-red-600"
      >
        {{ config.tienda.soldOutLabel }}
      </span>
    </div>

    <div class="flex flex-1 flex-col gap-2 p-4">
      <span class="text-[10px] font-bold uppercase tracking-widest text-fisinor-cyan">
        {{ categoryLabel }}
      </span>
      <h3
        class="cursor-pointer font-serif text-lg font-semibold leading-snug text-fisinor-dark transition-colors hover:text-fisinor-cyan"
        @click="emit('open', product.id)"
      >
        {{ product.name }}
      </h3>
      <div class="flex items-center gap-1.5 text-xs text-slate-400">
        <TiendaStars :rating="product.rating" />
        <span class="font-semibold text-fisinor-dark">{{ product.rating.toFixed(1) }}</span>
        <span>({{ product.reviewCount.toLocaleString('es-MX') }})</span>
      </div>
      <p class="text-xs leading-relaxed text-slate-500">{{ product.blurb }}</p>

      <div class="mt-auto flex items-center justify-between gap-2 pt-2">
        <p class="text-lg font-bold text-fisinor-dark">
          {{ formatMxn(product.price) }}
          <span class="text-xs font-medium text-slate-400">/ {{ product.unit }}</span>
        </p>
        <span v-if="!isSoldOut" class="text-[10px] font-semibold uppercase tracking-wider text-emerald-600">
          {{ config.tienda.availableLabel }}
        </span>
      </div>

      <button
        type="button"
        class="mt-1 rounded border border-fisinor-cyan px-4 py-2 text-sm font-semibold transition-colors"
        :class="
          isSoldOut
            ? 'cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400'
            : 'bg-fisinor-cyan text-white hover:bg-cyan-600'
        "
        :disabled="isSoldOut"
        @click="!isSoldOut && emit('add', product)"
      >
        {{ isSoldOut ? config.tienda.soldOutLabel : config.tienda.addToCartLabel }}
      </button>
    </div>
  </article>
</template>
