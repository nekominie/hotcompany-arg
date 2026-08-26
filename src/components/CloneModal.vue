<script setup lang="ts">
import { ref } from 'vue'
import { fisinorConfig } from '../config/fisinorConfig'
import Modal from './Modal.vue'

const props = defineProps<{
  open: boolean
}>()
const emit = defineEmits<{
  (e: 'close'): void
  (e: 'report-submitted', email: string): void
}>()

const reporterEmail = ref('')
const subjectId = ref('')
const anomalyType = ref('')
const details = ref('')
const formError = ref('')

const anomalyTypes = [
  'Duplicado morfológico',
  'Memoria motora residual',
  'Comportamiento fuera de perfil',
  'Marcadores de identidad inconsistentes',
  'Incapacidad de hidratación',
  'Otro',
]

function onSubmit() {
  formError.value = ''
  if (!reporterEmail.value || !subjectId.value || !anomalyType.value) {
    formError.value = fisinorConfig.cloneReport.errorMessage
    return
  }
  emit('report-submitted', reporterEmail.value)
}

function onClose() {
  reporterEmail.value = ''
  subjectId.value = ''
  anomalyType.value = ''
  details.value = ''
  formError.value = ''
  emit('close')
}
</script>

<template>
  <Modal :open="open" :title="fisinorConfig.cloneReport.title" @close="onClose">
    <div class="space-y-4">
      <p class="text-sm text-slate-600">
        {{ fisinorConfig.cloneReport.subtitle }}
      </p>

      <div v-if="formError" class="rounded-lg bg-red-50 p-3 text-sm text-red-700">
        {{ formError }}
      </div>

      <form class="space-y-4" @submit.prevent="onSubmit">
        <div>
          <label class="block text-sm font-medium text-slate-700" for="reporterEmail">Correo electrónico del denunciante</label>
          <input
            id="reporterEmail"
            v-model="reporterEmail"
            type="email"
            class="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-fisinor-cyan focus:outline-none focus:ring-1 focus:ring-fisinor-cyan"
            placeholder="su.correo@ejemplo.com"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-700" for="subjectId">ID o descripción del sujeto observado</label>
          <input
            id="subjectId"
            v-model="subjectId"
            type="text"
            class="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-fisinor-cyan focus:outline-none focus:ring-1 focus:ring-fisinor-cyan"
            placeholder="Ej. Colaborador 7-C, Sector Bio-Sinter"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-700" for="anomalyType">Tipo de anomalía</label>
          <select
            id="anomalyType"
            v-model="anomalyType"
            class="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-fisinor-cyan focus:outline-none focus:ring-1 focus:ring-fisinor-cyan"
          >
            <option value="" disabled>Seleccione una anomalía</option>
            <option v-for="type in anomalyTypes" :key="type" :value="type">{{ type }}</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-700" for="details">Detalles adicionales</label>
          <textarea
            id="details"
            v-model="details"
            rows="3"
            class="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-fisinor-cyan focus:outline-none focus:ring-1 focus:ring-fisinor-cyan"
            placeholder="Describa la anomalía sin incluir información personal propia."
          />
        </div>

        <button
          type="submit"
          class="w-full rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 transition-colors"
        >
          {{ fisinorConfig.cloneReport.submitLabel }}
        </button>
      </form>
    </div>
  </Modal>
</template>
