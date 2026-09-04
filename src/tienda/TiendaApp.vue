<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { fisinorConfig, type TiendaProduct } from '../config/fisinorConfig'
import { displayNameOf, fetchTiendaSession, logoutTienda, tiendaUser } from './auth'
import { fetchStoreProducts } from './products'
import TiendaHeader from '../components/tienda/TiendaHeader.vue'
import TiendaProductCard from '../components/tienda/TiendaProductCard.vue'
import TiendaProductDetail from '../components/tienda/TiendaProductDetail.vue'
import TiendaCart from '../components/tienda/TiendaCart.vue'
import TiendaCheckout from '../components/tienda/TiendaCheckout.vue'
import TiendaLoginModal from '../components/tienda/TiendaLoginModal.vue'

const config = fisinorConfig
const tienda = computed(() => config.tienda)

// --- Navegación por hash (#/producto/<id>), compatible con el botón atrás ---
type StoreRoute = { view: 'catalog' } | { view: 'product'; id: string }

const route = ref<StoreRoute>({ view: 'catalog' })

function parseHash(): StoreRoute {
  const match = window.location.hash.match(/^#\/producto\/([^/?]+)$/)
  return match ? { view: 'product', id: decodeURIComponent(match[1]) } : { view: 'catalog' }
}

function onHashChange() {
  route.value = parseHash()
  window.scrollTo({ top: 0 })
}

onMounted(async () => {
  route.value = parseHash()
  window.addEventListener('hashchange', onHashChange)
  products.value = await fetchStoreProducts()
  productsLoading.value = false
  void fetchTiendaSession()
})

onUnmounted(() => {
  window.removeEventListener('hashchange', onHashChange)
})

function openProduct(productId: string) {
  window.location.hash = `#/producto/${encodeURIComponent(productId)}`
}

function backToCatalog() {
  window.location.hash = ''
}

// --- Catálogo (desde la base de datos, con respaldo local) ---
const activeCategory = ref('all')
const products = ref<TiendaProduct[]>([...config.tienda.products])
const productsLoading = ref(true)

const filteredProducts = computed(() =>
  activeCategory.value === 'all'
    ? products.value
    : products.value.filter((product) => product.categoryId === activeCategory.value),
)

function selectCategory(categoryId: string) {
  activeCategory.value = categoryId
}

const selectedProductId = computed(() =>
  route.value.view === 'product' ? route.value.id : null,
)

const selectedProduct = computed(
  () => products.value.find((product) => product.id === selectedProductId.value) ?? null,
)

const relatedProducts = computed(() => {
  const product = selectedProduct.value
  if (!product) return []
  const sameCategory = products.value.filter(
    (candidate) => candidate.categoryId === product.categoryId && candidate.id !== product.id,
  )
  const others = products.value.filter(
    (candidate) => candidate.categoryId !== product.categoryId && candidate.id !== product.id,
  )
  return [...sameCategory, ...others].slice(0, 4)
})

// --- Carrito ---
const cart = ref<{ product: TiendaProduct; qty: number }[]>([])
const cartOpen = ref(false)
const checkoutOpen = ref(false)
const loginModalOpen = ref(false)

const cartCount = computed(() => cart.value.reduce((total, line) => total + line.qty, 0))

function addToCart(product: TiendaProduct, qty = 1) {
  const existing = cart.value.find((line) => line.product.id === product.id)
  if (existing) {
    existing.qty += qty
  } else {
    cart.value.push({ product, qty })
  }
  cartOpen.value = true
}

function increment(product: TiendaProduct) {
  const existing = cart.value.find((line) => line.product.id === product.id)
  if (existing) {
    existing.qty += 1
  }
}

function decrement(product: TiendaProduct, removeAll = false) {
  const index = cart.value.findIndex((line) => line.product.id === product.id)
  if (index === -1) return
  if (removeAll || cart.value[index].qty <= 1) {
    cart.value.splice(index, 1)
  } else {
    cart.value[index].qty -= 1
  }
}

// --- Checkout ---
function startCheckout() {
  cartOpen.value = false
  checkoutOpen.value = true
}

function completeCheckout() {
  cart.value = []
}
</script>

<template>
  <div class="min-h-screen bg-fisinor-hospital">
    <TiendaHeader
      :cart-count="cartCount"
      :session-name="tiendaUser ? displayNameOf(tiendaUser) : null"
      @open-cart="cartOpen = true"
      @open-login="loginModalOpen = true"
      @logout="logoutTienda"
    />

    <!-- Aviso corporativo -->
    <div class="border-b border-fisinor-desert/30 bg-fisinor-desert/15">
      <div class="mx-auto flex max-w-7xl items-center gap-3 px-4 py-2.5 sm:px-6 lg:px-8">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8" class="h-4 w-4 shrink-0 text-fisinor-dark" aria-hidden="true">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
          />
        </svg>
        <p class="text-xs font-medium text-fisinor-dark sm:text-sm">{{ tienda.notice }}</p>
      </div>
    </div>

    <!-- Hero de la tienda -->
    <section class="bg-fisinor-dark py-12 text-white">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p class="text-xs font-bold uppercase tracking-[0.25em] text-fisinor-cyan">
          {{ tienda.brandSubtitle }}
        </p>
        <p class="mt-3 font-serif text-3xl font-semibold sm:text-4xl">
          {{ tienda.brandTitle }}
        </p>
        <p class="mt-3 max-w-2xl text-sm leading-relaxed text-slate-300">
          {{ config.brand.slogan }}
        </p>
      </div>
    </section>

    <!-- Vista de detalle de producto -->
    <main v-if="selectedProduct" class="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <TiendaProductDetail
        :product="selectedProduct"
        :related-products="relatedProducts"
        @add="addToCart"
        @navigate="openProduct"
        @back="backToCatalog"
      />
    </main>

    <!-- Catálogo -->
    <main v-else class="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div class="mb-8 flex flex-wrap gap-2">
        <button
          type="button"
          class="rounded-full border px-5 py-2 text-sm font-semibold transition-colors"
          :class="
            activeCategory === 'all'
              ? 'border-fisinor-dark bg-fisinor-dark text-white'
              : 'border-slate-300 bg-white text-slate-600 hover:border-fisinor-cyan hover:text-fisinor-cyan'
          "
          @click="selectCategory('all')"
        >
          {{ tienda.filterAllLabel }}
        </button>
        <button
          v-for="category in tienda.categories"
          :key="category.id"
          type="button"
          class="rounded-full border px-5 py-2 text-sm font-semibold transition-colors"
          :class="
            activeCategory === category.id
              ? 'border-fisinor-dark bg-fisinor-dark text-white'
              : 'border-slate-300 bg-white text-slate-600 hover:border-fisinor-cyan hover:text-fisinor-cyan'
          "
          @click="selectCategory(category.id)"
        >
          {{ category.label }}
        </button>
      </div>

      <div v-if="productsLoading" class="py-16 text-center text-sm text-slate-500">
        <span class="inline-block h-6 w-6 animate-spin rounded-full border-2 border-fisinor-cyan border-t-transparent"></span>
        <p class="mt-3">Cargando catálogo...</p>
      </div>

      <div v-else class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <TiendaProductCard
          v-for="product in filteredProducts"
          :key="product.id"
          :product="product"
          @add="addToCart"
          @open="openProduct"
        />
      </div>
    </main>

    <!-- Footer -->
    <footer class="border-t border-slate-200 bg-white py-8">
      <div class="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <p class="text-xs leading-relaxed text-slate-400">{{ tienda.footerNote }}</p>
        <a href="/" class="mt-2 inline-block text-xs font-semibold text-fisinor-cyan hover:underline">
          {{ tienda.backLabel }} →
        </a>
      </div>
    </footer>

    <TiendaCart
      :open="cartOpen"
      :lines="cart"
      @close="cartOpen = false"
      @increment="increment"
      @decrement="decrement"
      @checkout="startCheckout"
    />

    <TiendaCheckout
      :open="checkoutOpen"
      :lines="cart"
      :has-session="tiendaUser !== null"
      @close="checkoutOpen = false"
      @login="loginModalOpen = true"
      @complete="completeCheckout"
    />

    <TiendaLoginModal
      :open="loginModalOpen"
      @close="loginModalOpen = false"
      @logged-in="loginModalOpen = false"
    />
  </div>
</template>
