<script setup lang="ts">
import { computed, ref } from 'vue'
import { fisinorConfig } from '../../config/fisinorConfig'
import { formatMxn, generateOrderFolio } from '../../tienda/currency'
import type { CartLine } from './TiendaCart.vue'

const props = defineProps<{
  open: boolean
  lines: CartLine[]
  hasSession: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'login'): void
  (e: 'complete'): void
}>()

const config = fisinorConfig
const checkout = computed(() => config.tienda.checkout)

const step = ref(0)
const processing = ref(false)
const folio = ref('')

const shipping = ref({ name: '', address: '', sector: '', city: '', zip: '', phone: '' })
const payment = ref({ cardNumber: '', cardExpiry: '', cardCvc: '', cardHolder: '' })

const subtotal = computed(() =>
  props.lines.reduce((total, line) => total + line.product.price * line.qty, 0),
)

const shippingForm = ref<HTMLFormElement | null>(null)
const paymentForm = ref<HTMLFormElement | null>(null)

function nextFromCart() {
  step.value = 1
}

function nextFromAccount() {
  step.value = 2
}

function submitShipping() {
  if (shippingForm.value?.checkValidity()) {
    step.value = 3
  } else {
    shippingForm.value?.reportValidity()
  }
}

function submitPayment() {
  if (!paymentForm.value?.checkValidity()) {
    paymentForm.value?.reportValidity()
    return
  }
  processing.value = true
  setTimeout(() => {
    folio.value = generateOrderFolio()
    processing.value = false
    step.value = 4
    emit('complete')
  }, 1400)
}

function finish() {
  step.value = 0
  shipping.value = { name: '', address: '', sector: '', city: '', zip: '', phone: '' }
  payment.value = { cardNumber: '', cardExpiry: '', cardCvc: '', cardHolder: '' }
  folio.value = ''
  emit('close')
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="fixed inset-0 z-[60] flex items-center justify-center bg-fisinor-dark/60 p-4 backdrop-blur-sm"
      @click.self="emit('close')"
    >
      <div class="max-h-[90dvh] w-full max-w-2xl overflow-y-auto rounded-lg border border-slate-200 bg-white shadow-2xl" role="dialog" aria-modal="true">
        <header class="flex items-center justify-between border-b border-slate-200 bg-fisinor-medical px-6 py-4">
          <h2 class="font-serif text-lg font-semibold text-fisinor-dark">
            {{ checkout.title }}
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

        <!-- Indicador de pasos -->
        <div class="flex items-center gap-2 border-b border-slate-200 px-6 py-4">
          <template v-for="(stepLabel, index) in checkout.steps" :key="stepLabel">
            <div class="flex items-center gap-2">
              <span
                class="grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-bold"
                :class="
                  index < step
                    ? 'bg-fisinor-cyan text-white'
                    : index === step
                      ? 'border-2 border-fisinor-cyan text-fisinor-cyan'
                      : 'border border-slate-300 text-slate-400'
                "
              >
                <svg v-if="index < step" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3" class="h-3.5 w-3.5" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                <template v-else>{{ index + 1 }}</template>
              </span>
              <span
                class="hidden text-xs font-semibold sm:block"
                :class="index === step ? 'text-fisinor-dark' : 'text-slate-400'"
              >
                {{ stepLabel }}
              </span>
            </div>
            <span v-if="index < checkout.steps.length - 1" class="h-px flex-1 bg-slate-200"></span>
          </template>
        </div>

        <div class="px-6 py-6">
          <!-- PASO 1: Carrito -->
          <div v-if="step === 0">
            <div class="divide-y divide-slate-100">
              <div v-for="line in lines" :key="line.product.id" class="flex items-center justify-between gap-3 py-2">
                <div>
                  <p class="text-sm font-semibold text-fisinor-dark">{{ line.product.name }}</p>
                  <p class="text-xs text-slate-400">
                    {{ line.qty }} × {{ formatMxn(line.product.price) }}
                  </p>
                </div>
                <p class="text-sm font-bold text-fisinor-dark">
                  {{ formatMxn(line.product.price * line.qty) }}
                </p>
              </div>
            </div>
            <div class="mt-4 flex items-center justify-between border-t border-slate-200 pt-4 text-sm">
              <span class="font-medium text-slate-500">{{ checkout.orderSummaryLabel }}</span>
              <span class="text-xl font-bold text-fisinor-dark">{{ formatMxn(subtotal) }}</span>
            </div>
            <div class="mt-6 flex justify-end">
              <button type="button" class="rounded bg-fisinor-cyan px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-cyan-600" @click="nextFromCart">
                Continuar
              </button>
            </div>
          </div>

          <!-- PASO 2: Cuenta FISINOR (inicio de sesión destacado) -->
          <div v-else-if="step === 1">
            <div class="rounded-lg border-2 border-fisinor-cyan bg-fisinor-medical p-6 text-center">
              <span class="mx-auto grid h-14 w-14 place-items-center rounded-full bg-fisinor-dark text-white">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8" class="h-7 w-7" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </span>
              <h3 class="mt-3 font-serif text-xl font-semibold text-fisinor-dark">
                {{ checkout.accountTitle }}
              </h3>
              <p class="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-500">
                {{ checkout.accountText }}
              </p>

              <div class="mx-auto mt-5 grid max-w-sm gap-3">
                <button
                  type="button"
                  class="rounded bg-fisinor-dark px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-slate-800"
                  @click="emit('login')"
                >
                  {{ checkout.accountLoginLabel }}
                </button>
                <p class="text-xs text-slate-500">
                  {{ checkout.accountRegisterText }}
                  <a :href="config.tienda.registerHref" target="_blank" rel="noopener" class="font-semibold text-fisinor-cyan hover:underline">
                    {{ checkout.accountRegisterLabel }}
                  </a>
                </p>
              </div>
            </div>

            <div class="mt-6 flex items-center justify-between">
              <button type="button" class="text-sm font-medium text-slate-500 hover:text-fisinor-dark" @click="step = 0">
                ← Volver al carrito
              </button>
              <button
                v-if="hasSession"
                type="button"
                class="rounded bg-fisinor-cyan px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-cyan-600"
                @click="nextFromAccount"
              >
                Continuar
              </button>
            </div>
          </div>

          <!-- PASO 3: Envío -->
          <div v-else-if="step === 2">
            <h3 class="mb-4 font-serif text-lg font-semibold text-fisinor-dark">
              {{ checkout.shippingTitle }}
            </h3>
            <form ref="shippingForm" class="grid gap-4 sm:grid-cols-2" @submit.prevent="submitShipping">
              <div>
                <label class="mb-1 block text-sm font-medium text-slate-700" for="ship-name">
                  {{ checkout.shippingFields.name.label }}
                </label>
                <input
                  id="ship-name"
                  v-model="shipping.name"
                  class="w-full rounded border border-slate-300 px-3 py-2 text-sm focus:border-fisinor-cyan focus:outline-none focus:ring-1 focus:ring-fisinor-cyan"
                  type="text"
                  :placeholder="checkout.shippingFields.name.placeholder"
                  required
                />
              </div>
              <div>
                <label class="mb-1 block text-sm font-medium text-slate-700" for="ship-phone">
                  {{ checkout.shippingFields.phone.label }}
                </label>
                <input
                  id="ship-phone"
                  v-model="shipping.phone"
                  class="w-full rounded border border-slate-300 px-3 py-2 text-sm focus:border-fisinor-cyan focus:outline-none focus:ring-1 focus:ring-fisinor-cyan"
                  type="text"
                  :placeholder="checkout.shippingFields.phone.placeholder"
                />
              </div>
              <div class="sm:col-span-2">
                <label class="mb-1 block text-sm font-medium text-slate-700" for="ship-address">
                  {{ checkout.shippingFields.address.label }}
                </label>
                <input
                  id="ship-address"
                  v-model="shipping.address"
                  class="w-full rounded border border-slate-300 px-3 py-2 text-sm focus:border-fisinor-cyan focus:outline-none focus:ring-1 focus:ring-fisinor-cyan"
                  type="text"
                  :placeholder="checkout.shippingFields.address.placeholder"
                  required
                />
              </div>
              <div>
                <label class="mb-1 block text-sm font-medium text-slate-700" for="ship-sector">
                  {{ checkout.shippingFields.sector.label }}
                </label>
                <input
                  id="ship-sector"
                  v-model="shipping.sector"
                  class="w-full rounded border border-slate-300 px-3 py-2 text-sm focus:border-fisinor-cyan focus:outline-none focus:ring-1 focus:ring-fisinor-cyan"
                  type="text"
                  :placeholder="checkout.shippingFields.sector.placeholder"
                />
              </div>
              <div>
                <label class="mb-1 block text-sm font-medium text-slate-700" for="ship-city">
                  {{ checkout.shippingFields.city.label }}
                </label>
                <input
                  id="ship-city"
                  v-model="shipping.city"
                  class="w-full rounded border border-slate-300 px-3 py-2 text-sm focus:border-fisinor-cyan focus:outline-none focus:ring-1 focus:ring-fisinor-cyan"
                  type="text"
                  :placeholder="checkout.shippingFields.city.placeholder"
                  required
                />
              </div>
              <div>
                <label class="mb-1 block text-sm font-medium text-slate-700" for="ship-zip">
                  {{ checkout.shippingFields.zip.label }}
                </label>
                <input
                  id="ship-zip"
                  v-model="shipping.zip"
                  class="w-full rounded border border-slate-300 px-3 py-2 text-sm focus:border-fisinor-cyan focus:outline-none focus:ring-1 focus:ring-fisinor-cyan"
                  type="text"
                  :placeholder="checkout.shippingFields.zip.placeholder"
                />
              </div>
              <div class="sm:col-span-2 flex items-center justify-between">
                <button type="button" class="text-sm font-medium text-slate-500 hover:text-fisinor-dark" @click="step = 1">
                  ← Volver
                </button>
                <button type="submit" class="rounded bg-fisinor-cyan px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-cyan-600">
                  Continuar al pago
                </button>
              </div>
            </form>
          </div>

          <!-- PASO 4: Pago -->
          <div v-else-if="step === 3">
            <h3 class="mb-4 font-serif text-lg font-semibold text-fisinor-dark">
              {{ checkout.paymentTitle }}
            </h3>
            <form ref="paymentForm" class="grid gap-4 sm:grid-cols-2" @submit.prevent="submitPayment">
              <div class="sm:col-span-2">
                <label class="mb-1 block text-sm font-medium text-slate-700" for="pay-cardNumber">
                  {{ checkout.paymentFields.cardNumber.label }}
                </label>
                <input
                  id="pay-cardNumber"
                  v-model="payment.cardNumber"
                  class="w-full rounded border border-slate-300 px-3 py-2 text-sm focus:border-fisinor-cyan focus:outline-none focus:ring-1 focus:ring-fisinor-cyan"
                  type="text"
                  :placeholder="checkout.paymentFields.cardNumber.placeholder"
                  required
                />
              </div>
              <div>
                <label class="mb-1 block text-sm font-medium text-slate-700" for="pay-cardExpiry">
                  {{ checkout.paymentFields.cardExpiry.label }}
                </label>
                <input
                  id="pay-cardExpiry"
                  v-model="payment.cardExpiry"
                  class="w-full rounded border border-slate-300 px-3 py-2 text-sm focus:border-fisinor-cyan focus:outline-none focus:ring-1 focus:ring-fisinor-cyan"
                  type="text"
                  :placeholder="checkout.paymentFields.cardExpiry.placeholder"
                  required
                />
              </div>
              <div>
                <label class="mb-1 block text-sm font-medium text-slate-700" for="pay-cardCvc">
                  {{ checkout.paymentFields.cardCvc.label }}
                </label>
                <input
                  id="pay-cardCvc"
                  v-model="payment.cardCvc"
                  class="w-full rounded border border-slate-300 px-3 py-2 text-sm focus:border-fisinor-cyan focus:outline-none focus:ring-1 focus:ring-fisinor-cyan"
                  type="password"
                  :placeholder="checkout.paymentFields.cardCvc.placeholder"
                  required
                />
              </div>
              <div class="sm:col-span-2">
                <label class="mb-1 block text-sm font-medium text-slate-700" for="pay-cardHolder">
                  {{ checkout.paymentFields.cardHolder.label }}
                </label>
                <input
                  id="pay-cardHolder"
                  v-model="payment.cardHolder"
                  class="w-full rounded border border-slate-300 px-3 py-2 text-sm focus:border-fisinor-cyan focus:outline-none focus:ring-1 focus:ring-fisinor-cyan"
                  type="text"
                  :placeholder="checkout.paymentFields.cardHolder.placeholder"
                  required
                />
              </div>

              <div class="rounded border border-slate-200 bg-fisinor-hospital p-4 text-sm sm:col-span-2">
                <p class="mb-2 font-semibold text-fisinor-dark">{{ checkout.orderSummaryLabel }}</p>
                <div v-for="line in lines" :key="line.product.id" class="flex justify-between text-slate-500">
                  <span>{{ line.qty }} × {{ line.product.name }}</span>
                  <span>{{ formatMxn(line.product.price * line.qty) }}</span>
                </div>
                <div class="mt-2 flex justify-between border-t border-slate-200 pt-2 font-bold text-fisinor-dark">
                  <span>Total</span>
                  <span>{{ formatMxn(subtotal) }}</span>
                </div>
              </div>

              <div class="sm:col-span-2" style="display: flex; justify-content: space-between; align-items: center">
                <button type="button" class="text-sm font-medium text-slate-500 hover:text-fisinor-dark" @click="step = 2">
                  ← Volver
                </button>
                <button
                  type="submit"
                  class="rounded bg-fisinor-dark px-8 py-3 text-sm font-bold text-white transition-colors hover:bg-slate-800 disabled:cursor-wait disabled:opacity-70"
                  :disabled="processing"
                >
                  {{ processing ? checkout.processingLabel : checkout.payLabel }}
                </button>
              </div>
            </form>
          </div>

          <!-- PASO 5: Confirmación -->
          <div v-else class="py-6 text-center">
            <span class="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-100 text-emerald-600">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.4" class="h-8 w-8" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </span>
            <h3 class="mt-4 font-serif text-2xl font-semibold text-fisinor-dark">
              {{ checkout.confirmationTitle }}
            </h3>
            <p class="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-500">
              {{ checkout.confirmationText.replace('{folio}', folio) }}
            </p>
            <p class="mt-4 inline-block rounded bg-fisinor-hospital px-4 py-2 font-bold text-fisinor-dark">
              {{ folio }}
            </p>
            <div class="mt-6">
              <button type="button" class="rounded bg-fisinor-cyan px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-cyan-600" @click="finish">
                {{ checkout.continueLabel }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>
