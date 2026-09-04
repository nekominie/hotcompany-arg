<script setup lang="ts">
import { computed } from 'vue'
import { fisinorConfig, type TiendaProduct } from '../../config/fisinorConfig'
import { formatMxn } from '../../tienda/currency'

export interface CartLine {
  product: TiendaProduct
  qty: number
}

const props = defineProps<{
  open: boolean
  lines: CartLine[]
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'increment', product: TiendaProduct): void
  (e: 'decrement', product: TiendaProduct, removeAll?: boolean): void
  (e: 'checkout'): void
}>()

const config = fisinorConfig

const subtotal = computed(() =>
  props.lines.reduce((total, line) => total + line.product.price * line.qty, 0),
)
</script>

<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="fixed inset-0 z-50 bg-fisinor-dark/60 backdrop-blur-sm"
      @click.self="emit('close')"
    >
      <aside
        class="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-white shadow-2xl"
        role="dialog"
        aria-modal="true"
        :aria-label="config.tienda.cartLabel"
      >
        <header class="flex items-center justify-between border-b border-slate-200 bg-fisinor-medical px-5 py-4">
          <h2 class="font-serif text-lg font-semibold text-fisinor-dark">
            {{ config.tienda.cartLabel }}
          </h2>
          <button
            type="button"
            class="text-slate-400 transition-colors hover:text-fisinor-dark"
            aria-label="Cerrar"
            @click="emit('close')"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" class="h-6 w-6" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </header>

        <div class="flex-1 overflow-y-auto px-5 py-4">
          <p v-if="lines.length === 0" class="py-10 text-center text-sm text-slate-400">
            {{ config.tienda.cartEmptyText }}
          </p>

          <div v-else class="divide-y divide-slate-100">
            <div v-for="line in lines" :key="line.product.id" class="flex gap-3 py-3">
              <div class="grid h-14 w-14 shrink-0 place-items-center rounded bg-fisinor-hospital">
                <span class="brand-title text-xs !text-fisinor-cyan">{{ line.product.code }}</span>
              </div>
              <div class="min-w-0 flex-1">
                <p class="truncate text-sm font-semibold text-fisinor-dark">{{ line.product.name }}</p>
                <p class="text-xs text-slate-400">{{ formatMxn(line.product.price) }} / {{ line.product.unit }}</p>
                <div class="mt-2 flex items-center gap-2">
                  <button
                    type="button"
                    class="h-7 w-7 rounded border border-slate-300 text-sm font-bold text-slate-600 transition-colors hover:border-fisinor-cyan hover:text-fisinor-cyan"
                    :aria-label="'Reducir cantidad'"
                    @click="emit('decrement', line.product)"
                  >
                    −
                  </button>
                  <span class="w-6 text-center text-sm font-bold text-fisinor-dark">{{ line.qty }}</span>
                  <button
                    type="button"
                    class="h-7 w-7 rounded border border-slate-300 text-sm font-bold text-slate-600 transition-colors hover:border-fisinor-cyan hover:text-fisinor-cyan"
                    :aria-label="'Aumentar cantidad'"
                    @click="emit('increment', line.product)"
                  >
                    +
                  </button>
                  <button
                    type="button"
                    class="ml-auto text-xs text-slate-400 transition-colors hover:text-red-600"
                    @click="emit('decrement', line.product, true)"
                  >
                    Quitar
                  </button>
                </div>
              </div>
              <p class="shrink-0 text-sm font-bold text-fisinor-dark">
                {{ formatMxn(line.product.price * line.qty) }}
              </p>
            </div>
          </div>
        </div>

        <footer class="border-t border-slate-200 px-5 py-4">
          <div class="mb-3 flex items-center justify-between text-sm">
            <span class="font-medium text-slate-500">Subtotal</span>
            <span class="text-lg font-bold text-fisinor-dark">{{ formatMxn(subtotal) }}</span>
          </div>
          <button
            type="button"
            class="w-full rounded bg-fisinor-cyan px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-cyan-600 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
            :disabled="lines.length === 0"
            @click="emit('checkout')"
          >
            {{ config.tienda.checkoutLabel }}
          </button>
        </footer>
      </aside>
    </div>
  </Teleport>
</template>
