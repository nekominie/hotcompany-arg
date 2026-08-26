<script setup lang="ts">
import { ref, computed } from 'vue'
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
const attempts = ref(0)
const showEncrypted = ref(false)

const errorMessage = computed(() => {
  if (attempts.value === 0) return ''
  const index = Math.min(attempts.value, fisinorConfig.employeePortal.errorMessages.length) - 1
  return fisinorConfig.employeePortal.errorMessages[index] || ''
})

const isLocked = computed(() => attempts.value >= fisinorConfig.employeePortal.attemptsBeforeLock)

function onSubmit() {
  if (!username.value || !password.value) return
  attempts.value++
  if (isLocked.value) {
    showEncrypted.value = true
  }
}

function onClose() {
  attempts.value = 0
  showEncrypted.value = false
  username.value = ''
  password.value = ''
  emit('close')
}
</script>

<template>
  <Modal :open="open" :title="fisinorConfig.employeePortal.title" @close="onClose">
    <div class="space-y-4">
      <p class="text-sm text-slate-600">
        {{ fisinorConfig.employeePortal.subtitle }}
      </p>

      <div v-if="errorMessage" class="rounded-lg bg-red-50 p-3 text-sm text-red-700">
        {{ errorMessage }}
      </div>

      <div v-if="showEncrypted" class="rounded-lg bg-fisinor-dark p-4 font-mono text-xs text-green-400 break-all">
        <div class="mb-1 text-slate-400">[MENSAJE CIFRADO — NIVEL 7]:</div>
        {{ fisinorConfig.employeePortal.encryptedAlert }}
      </div>

      <form class="space-y-4" @submit.prevent="onSubmit">
        <div>
          <label class="block text-sm font-medium text-slate-700">{{ fisinorConfig.employeePortal.usernameLabel }}</label>
          <input
            v-model="username"
            type="text"
            class="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-fisinor-cyan focus:outline-none focus:ring-1 focus:ring-fisinor-cyan"
            :disabled="isLocked"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-700">{{ fisinorConfig.employeePortal.passwordLabel }}</label>
          <input
            v-model="password"
            type="password"
            class="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-fisinor-cyan focus:outline-none focus:ring-1 focus:ring-fisinor-cyan"
            :disabled="isLocked"
          />
        </div>
        <button
          type="submit"
          class="w-full rounded-lg bg-fisinor-cyan px-4 py-2 text-sm font-semibold text-white hover:bg-cyan-600 transition-colors disabled:opacity-50"
          :disabled="isLocked"
        >
          {{ fisinorConfig.employeePortal.submitLabel }}
        </button>
      </form>
    </div>
  </Modal>
</template>
