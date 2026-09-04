<script setup lang="ts">
import { computed, ref } from 'vue'
import { fisinorConfig } from '../../config/fisinorConfig'
import { loginTienda } from '../../tienda/auth'

const props = defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'logged-in'): void
}>()

const config = fisinorConfig
const session = computed(() => config.tienda.session)

const identifier = ref('')
const password = ref('')
const submitting = ref(false)
const error = ref('')

async function onSubmit() {
  if (submitting.value) return
  submitting.value = true
  error.value = ''
  try {
    await loginTienda(identifier.value, password.value)
    emit('logged-in')
  } catch (err) {
    error.value = err instanceof Error ? err.message : session.value.errorFallback
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="fixed inset-0 z-[70] flex items-center justify-center bg-fisinor-dark/60 p-4 backdrop-blur-sm"
      @click.self="emit('close')"
    >
      <div
        class="w-full max-w-sm overflow-hidden rounded-lg border border-slate-200 bg-white shadow-2xl"
        role="dialog"
        aria-modal="true"
      >
        <header class="flex items-center justify-between border-b border-slate-200 bg-fisinor-medical px-5 py-4">
          <h2 class="font-serif text-lg font-semibold text-fisinor-dark">
            {{ session.modalTitle }}
          </h2>
          <button
            type="button"
            class="text-slate-400 transition-colors hover:text-fisinor-dark"
            aria-label="Cerrar"
            @click="emit('close')"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" class="h-5 w-5" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </header>

        <div class="px-5 py-5">
          <p class="text-xs leading-relaxed text-slate-500">
            {{ session.modalText }}
          </p>

          <form class="mt-4 grid gap-3" @submit.prevent="onSubmit">
            <div>
              <label class="mb-1 block text-xs font-semibold text-slate-600" for="tienda-login-id">
                {{ session.identifierLabel }}
              </label>
              <input
                id="tienda-login-id"
                v-model="identifier"
                class="w-full rounded border border-slate-300 px-3 py-2 text-sm focus:border-fisinor-cyan focus:outline-none focus:ring-1 focus:ring-fisinor-cyan"
                type="text"
                :placeholder="session.identifierPlaceholder"
                autocomplete="username"
                required
              />
            </div>

            <div>
              <label class="mb-1 block text-xs font-semibold text-slate-600" for="tienda-login-password">
                {{ session.passwordLabel }}
              </label>
              <input
                id="tienda-login-password"
                v-model="password"
                class="w-full rounded border border-slate-300 px-3 py-2 text-sm focus:border-fisinor-cyan focus:outline-none focus:ring-1 focus:ring-fisinor-cyan"
                type="password"
                :placeholder="session.passwordPlaceholder"
                autocomplete="current-password"
                required
              />
            </div>

            <p v-if="error" class="rounded border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-700" role="alert">
              {{ error }}
            </p>

            <button
              type="submit"
              class="rounded bg-fisinor-dark px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-slate-800 disabled:cursor-wait disabled:opacity-70"
              :disabled="submitting"
            >
              {{ submitting ? session.submittingLabel : session.submitLabel }}
            </button>
          </form>

          <p class="mt-4 text-center text-xs text-slate-500">
            {{ session.registerText }}
            <a
              :href="config.tienda.registerHref"
              class="font-semibold text-fisinor-cyan hover:underline"
              target="_blank"
              rel="noopener"
            >
              {{ session.registerLabel }}
            </a>
          </p>
        </div>
      </div>
    </div>
  </Teleport>
</template>
