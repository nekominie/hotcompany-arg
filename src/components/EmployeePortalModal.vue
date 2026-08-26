<script setup lang="ts">
import { ref } from 'vue'
import { fisinorConfig } from '../config/fisinorConfig'
import Modal from './Modal.vue'

const props = defineProps<{
  open: boolean
}>()
const emit = defineEmits<{
  (e: 'close'): void
}>()

const username = ref('')
const password = ref('')

function onSubmit() {
  // Visual-only modal; no backend logic
}

function onClose() {
  username.value = ''
  password.value = ''
  emit('close')
}
</script>

<template>
  <Modal :open="open" :title="fisinorConfig.employeePortal.title" @close="onClose">
    <div class="space-y-5">
      <p class="text-sm leading-relaxed text-slate-600">
        {{ fisinorConfig.employeePortal.subtitle }}
      </p>

      <div class="rounded border border-slate-200 bg-fisinor-hospital p-3 text-xs text-slate-500">
        <div class="flex items-center gap-2 font-semibold text-slate-700">
          <span class="relative flex h-2 w-2">
            <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-60" />
            <span class="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          Sistema operativo
        </div>
        <p class="mt-1">Nodo Hermosillo — Conexión encriptada nivel 2.</p>
      </div>

      <form class="space-y-4" @submit.prevent="onSubmit">
        <div>
          <label class="block text-sm font-medium text-slate-700">{{ fisinorConfig.employeePortal.usernameLabel }}</label>
          <input
            v-model="username"
            type="text"
            class="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm focus:border-fisinor-cyan focus:outline-none focus:ring-1 focus:ring-fisinor-cyan"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-700">{{ fisinorConfig.employeePortal.passwordLabel }}</label>
          <input
            v-model="password"
            type="password"
            class="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm focus:border-fisinor-cyan focus:outline-none focus:ring-1 focus:ring-fisinor-cyan"
          />
        </div>
        <button
          type="submit"
          class="w-full rounded border border-fisinor-dark bg-fisinor-dark px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
        >
          {{ fisinorConfig.employeePortal.submitLabel }}
        </button>
      </form>

      <div class="text-center">
        <button class="text-xs text-slate-400 hover:text-fisinor-cyan" @click="onClose">
          {{ fisinorConfig.employeePortal.closeLabel }}
        </button>
      </div>
    </div>
  </Modal>
</template>
