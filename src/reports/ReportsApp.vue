<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { fisinorConfig } from '../config/fisinorConfig'
import { submitAnomalyReport, type ApiError } from '../services/apiClient'

const cfg = fisinorConfig.anomalyReportForm

interface ReportForm {
  notifierEmail: string
  notifierIdentifier: string
  anonymity: boolean
  sightingLocation: string
  subjectRelation: string
  anomalies: string[]
  observations: string
}

interface AttachedFile {
  file: File
  previewUrl: string
  previewFailed: boolean
}

const form = reactive<ReportForm>({
  notifierEmail: '',
  notifierIdentifier: '',
  anonymity: false,
  sightingLocation: '',
  subjectRelation: '',
  anomalies: [],
  observations: '',
})

const isDragging = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)
const attachedFiles = ref<AttachedFile[]>([])
const maxFiles = cfg.sections.evidence.dropzone.maxFiles

const isSubmitting = ref(false)
const createdReportCode = ref('')
const createdAt = ref('')
const createdAnomaliesCount = ref(0)

const showSuccessModal = ref(false)

interface Toast {
  id: number
  message: string
  type: 'error' | 'warning' | 'info'
}

const toasts = ref<Toast[]>([])
let nextToastId = 1

function addToast(message: string, type: Toast['type'] = 'error') {
  const id = nextToastId++
  toasts.value.push({ id, message, type })
  setTimeout(() => removeToast(id), 6000)
}

function removeToast(id: number) {
  toasts.value = toasts.value.filter((t) => t.id !== id)
}

function toastForError(message: string) {
  addToast(message, 'error')
}

function isImage(file: File): boolean {
  return file.type.startsWith('image/') && !file.name.toLowerCase().endsWith('.raw')
}

function canAddMore(): boolean {
  return attachedFiles.value.length < maxFiles
}

function attachFiles(files: FileList | null) {
  if (!files) return
  const remainingSlots = maxFiles - attachedFiles.value.length
  if (remainingSlots <= 0) return

  const newFiles: AttachedFile[] = []
  for (let i = 0; i < Math.min(files.length, remainingSlots); i++) {
    const file = files[i]
    newFiles.push({
      file,
      previewUrl: isImage(file) ? URL.createObjectURL(file) : '',
      previewFailed: false,
    })
  }

  attachedFiles.value.push(...newFiles)
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

function removeFile(index: number) {
  const item = attachedFiles.value[index]
  if (item && item.previewUrl) {
    URL.revokeObjectURL(item.previewUrl)
  }
  attachedFiles.value.splice(index, 1)
}

function clearAllFiles() {
  attachedFiles.value.forEach((item) => {
    if (item.previewUrl) URL.revokeObjectURL(item.previewUrl)
  })
  attachedFiles.value = []
  if (fileInput.value) fileInput.value.value = ''
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function toggleAnomaly(id: string) {
  if (form.anomalies.includes(id)) {
    form.anomalies = form.anomalies.filter((a) => a !== id)
  } else {
    form.anomalies.push(id)
  }
}

function onDragOver() {
  isDragging.value = true
}

function onDragLeave() {
  isDragging.value = false
}

function onDrop(event: DragEvent) {
  isDragging.value = false
  attachFiles(event.dataTransfer?.files ?? null)
}

function onFileChange(event: Event) {
  const input = event.target as HTMLInputElement
  attachFiles(input.files)
}

function validateForm(): string | null {
  if (!form.notifierEmail.trim()) {
    return 'El correo electrónico del notificante es obligatorio.'
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.notifierEmail.trim())) {
    return 'El formato del correo electrónico no es válido.'
  }
  if (!form.sightingLocation) {
    return 'La ubicación del avistamiento es obligatoria.'
  }
  if (!form.subjectRelation) {
    return 'La relación con el sujeto observado es obligatoria.'
  }
  if (form.anomalies.length === 0) {
    return 'Debe seleccionar al menos una anomalía.'
  }
  return null
}

function buildFormData(): FormData {
  const data = new FormData()
  data.append('NotifierEmail', form.notifierEmail.trim())
  data.append('NotifierIdentifier', form.notifierIdentifier.trim())
  data.append('IsAnonymous', String(form.anonymity))
  data.append('SightingLocation', form.sightingLocation)
  data.append('SubjectRelation', form.subjectRelation)
  data.append('Observations', form.observations.trim())
  data.append('AnomalyIds', JSON.stringify(form.anomalies))

  attachedFiles.value.forEach((item) => {
    data.append('EvidenceFiles', item.file, item.file.name)
  })

  return data
}

function resetForm() {
  form.notifierEmail = ''
  form.notifierIdentifier = ''
  form.anonymity = false
  form.sightingLocation = ''
  form.subjectRelation = ''
  form.anomalies = []
  form.observations = ''
  clearAllFiles()
}

async function submitForm() {
  showSuccessModal.value = false

  const validationError = validateForm()
  if (validationError) {
    toastForError(validationError)
    return
  }

  isSubmitting.value = true

  try {
    const response = await submitAnomalyReport(buildFormData())
    createdReportCode.value = response.reportCode
    createdAt.value = response.createdAt
    createdAnomaliesCount.value = response.anomaliesCount
    showSuccessModal.value = true
    resetForm()
  } catch (error) {
    toastForError((error as ApiError).message || 'Ocurrió un error inesperado al enviar el reporte.')
  } finally {
    isSubmitting.value = false
  }
}

function closeSuccessModal() {
  showSuccessModal.value = false
  createdReportCode.value = ''
  createdAt.value = ''
  createdAnomaliesCount.value = 0
}

async function copyReportCode() {
  if (!createdReportCode.value) return
  try {
    await navigator.clipboard.writeText(createdReportCode.value)
    addToast('Código de seguimiento copiado al portapapeles', 'info')
  } catch {
    addToast('No se pudo copiar el código automáticamente', 'warning')
  }
}

const privacyNoteParts = computed(() => {
  const text = cfg.footer.privacyNote
  const linkText = cfg.footer.clientPortalLink.text
  const idx = text.indexOf(linkText)
  if (idx === -1) return { before: text, after: '' }
  return {
    before: text.slice(0, idx),
    after: text.slice(idx + linkText.length),
  }
})
</script>

<template>
  <div class="min-h-screen bg-fisinor-hospital">
    <!-- Toasts -->
    <div class="fixed right-4 top-4 z-50 flex w-full max-w-sm flex-col gap-3">
      <TransitionGroup name="toast" tag="div" class="flex flex-col gap-3">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          :class="[
            'flex items-start gap-3 rounded-lg border px-4 py-3 shadow-lg backdrop-blur-sm',
            toast.type === 'error'
              ? 'border-red-200 bg-red-50/95 text-red-800'
              : toast.type === 'warning'
                ? 'border-amber-200 bg-amber-50/95 text-amber-800'
                : 'border-cyan-200 bg-cyan-50/95 text-cyan-800',
          ]"
        >
          <div class="mt-0.5 flex-shrink-0">
            <svg v-if="toast.type === 'error'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <svg v-else-if="toast.type === 'warning'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p class="flex-1 text-sm font-medium leading-snug">{{ toast.message }}</p>
          <button
            type="button"
            class="flex-shrink-0 rounded p-1 transition-colors hover:bg-black/5"
            :class="toast.type === 'error' ? 'text-red-600' : toast.type === 'warning' ? 'text-amber-600' : 'text-cyan-600'"
            aria-label="Cerrar"
            @click="removeToast(toast.id)"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </TransitionGroup>
    </div>

    <!-- Success modal -->
    <Transition name="modal">
      <div v-if="showSuccessModal" class="fixed inset-0 z-[60] flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" @click="closeSuccessModal"></div>
        <div class="relative w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
          <div class="bg-fisinor-dark px-6 py-5 text-center">
            <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-fisinor-cyan/20 text-fisinor-cyan">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 class="mt-4 font-serif text-2xl font-bold text-white">Reporte recibido</h2>
            <p class="mt-1 text-sm text-slate-300">Su reporte ha sido registrado en el sistema.</p>
          </div>

          <div class="px-6 py-6">
            <div class="rounded-lg border border-slate-200 bg-slate-50 p-4 text-center">
              <p class="text-xs font-bold uppercase tracking-wider text-slate-500">Código de seguimiento</p>
              <p class="mt-1 font-mono text-2xl font-bold text-fisinor-dark">{{ createdReportCode }}</p>
            </div>

            <div class="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div class="rounded border border-slate-200 bg-slate-50 p-3">
                <p class="text-xs font-bold uppercase tracking-wider text-slate-500">Estado</p>
                <p class="mt-0.5 font-semibold capitalize text-fisinor-cyan">recibido</p>
              </div>
              <div class="rounded border border-slate-200 bg-slate-50 p-3">
                <p class="text-xs font-bold uppercase tracking-wider text-slate-500">Anomalías</p>
                <p class="mt-0.5 font-semibold text-fisinor-dark">{{ createdAnomaliesCount }}</p>
              </div>
            </div>

            <p class="mt-4 text-center text-xs text-slate-500">
              Registrado el
              <span class="font-semibold text-slate-700">
                {{ createdAt ? new Date(createdAt).toLocaleString('es-MX', { dateStyle: 'long', timeStyle: 'short' }) : '' }}
              </span>
            </p>

            <div class="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                class="flex-1 rounded bg-fisinor-desert px-4 py-3 text-sm font-bold uppercase tracking-wider text-white shadow-lg transition-all hover:bg-orange-600 hover:shadow-xl"
                @click="closeSuccessModal"
              >
                Cerrar
              </button>
              <button
                type="button"
                class="flex-1 rounded border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50"
                @click="copyReportCode"
              >
                Copiar código
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Institutional header with back-to-main bridge -->
    <header class="border-b border-slate-200 bg-white">
      <div class="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-5 sm:flex-row sm:px-6 lg:px-8">
        <a href="/" class="flex items-center gap-3">
          <img :src="cfg.brand.logo" alt="FISINOR" class="h-11 w-11 object-contain" />
          <div class="leading-tight">
            <div class="font-serif text-xl font-bold brand-title">{{ cfg.brand.shortName }}</div>
            <div class="text-[10px] uppercase tracking-widest text-slate-500">{{ cfg.brand.fullName }}</div>
          </div>
        </a>

        <a
          href="/"
          class="group inline-flex items-center justify-center gap-2 rounded bg-fisinor-desert px-6 py-4 text-sm font-bold uppercase tracking-wider text-white shadow-lg transition-all hover:bg-orange-600 hover:shadow-xl"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          {{ cfg.brand.backToMainLabel }}
        </a>
      </div>
    </header>

    <main class="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <!-- Form header facade -->
      <div class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div class="border-b border-slate-200 bg-fisinor-dark px-6 py-6 sm:px-8">
          <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <h1 class="font-serif text-2xl font-bold text-white sm:text-3xl">
              {{ cfg.header.title }}
            </h1>
            <span class="rounded border border-fisinor-cyan/30 bg-fisinor-cyan/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-fisinor-cyan">
              {{ cfg.header.formCode }}
            </span>
          </div>
          <p class="mt-3 text-sm leading-relaxed text-slate-300 sm:text-base">
            {{ cfg.header.subtitle }}
          </p>
        </div>

        <div class="border-b border-slate-200 bg-fisinor-cyan/5 px-6 py-5 sm:px-8">
          <div class="flex items-start gap-4">
            <div class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-fisinor-cyan/10 text-fisinor-cyan">
              <!--<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>-->
              <i class="bi-exclamation-circle-fill"></i>
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h2 class="font-semibold text-fisinor-dark">{{ cfg.header.notice.title }}</h2>
                <span class="rounded bg-fisinor-desert/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-fisinor-desert">
                  {{ cfg.header.notice.confidentialityLevel }}
                </span>
              </div>
              <p class="mt-1 text-sm text-slate-600">
                {{ cfg.header.notice.message }}
              </p>
            </div>
          </div>
        </div>

        <div class="p-6 sm:p-8">
          <!-- Section 1: Notifier identification -->
          <section class="mb-10">
            <div class="mb-5 flex items-center gap-3">
              <div class="flex h-8 w-8 items-center justify-center rounded-full bg-fisinor-dark text-sm font-bold text-white">1</div>
              <div>
                <h3 class="font-serif text-lg font-semibold text-fisinor-dark">{{ cfg.sections.notifier.title }}</h3>
                <p class="text-xs text-slate-500">{{ cfg.sections.notifier.description }}</p>
              </div>
            </div>

            <div class="grid gap-5 md:grid-cols-2">
              <div>
                <label :for="cfg.sections.notifier.email.id" class="block text-sm font-semibold text-slate-700">
                  {{ cfg.sections.notifier.email.label }}
                  <span v-if="cfg.sections.notifier.email.required" class="text-red-500">*</span>
                </label>
                <p class="text-xs text-slate-500">{{ cfg.sections.notifier.email.helper }}</p>
                <input
                  :id="cfg.sections.notifier.email.id"
                  v-model="form.notifierEmail"
                  type="email"
                  :placeholder="cfg.sections.notifier.email.placeholder"
                  :required="cfg.sections.notifier.email.required"
                  class="mt-2 w-full rounded border border-slate-300 px-3 py-2.5 text-sm focus:border-fisinor-cyan focus:outline-none focus:ring-1 focus:ring-fisinor-cyan"
                />
              </div>

              <div>
                <label :for="cfg.sections.notifier.identifier.id" class="block text-sm font-semibold text-slate-700">
                  {{ cfg.sections.notifier.identifier.label }}
                </label>
                <p class="text-xs text-slate-500">{{ cfg.sections.notifier.identifier.helper }}</p>
                <input
                  :id="cfg.sections.notifier.identifier.id"
                  v-model="form.notifierIdentifier"
                  type="text"
                  :placeholder="cfg.sections.notifier.identifier.placeholder"
                  class="mt-2 w-full rounded border border-slate-300 px-3 py-2.5 text-sm focus:border-fisinor-cyan focus:outline-none focus:ring-1 focus:ring-fisinor-cyan"
                />
              </div>
            </div>

            <div class="mt-5 rounded border border-slate-200 bg-fisinor-hospital p-4">
              <label class="flex cursor-pointer items-start gap-3">
                <input v-model="form.anonymity" type="checkbox" class="mt-0.5 h-4 w-4 rounded border-slate-300 text-fisinor-cyan focus:ring-fisinor-cyan" />
                <div>
                  <span class="text-sm font-semibold text-fisinor-dark">{{ cfg.sections.notifier.anonymity.label }}</span>
                  <p class="mt-0.5 text-xs text-slate-500">{{ cfg.sections.notifier.anonymity.helper }}</p>
                </div>
              </label>
            </div>
          </section>

          <!-- Section 2: Sighting data -->
          <section class="mb-10">
            <div class="mb-5 flex items-center gap-3">
              <div class="flex h-8 w-8 items-center justify-center rounded-full bg-fisinor-dark text-sm font-bold text-white">2</div>
              <div>
                <h3 class="font-serif text-lg font-semibold text-fisinor-dark">{{ cfg.sections.sighting.title }}</h3>
                <p class="text-xs text-slate-500">{{ cfg.sections.sighting.description }}</p>
              </div>
            </div>

            <div class="grid gap-5 md:grid-cols-2">
              <div>
                <label :for="cfg.sections.sighting.location.id" class="block text-sm font-semibold text-slate-700">
                  {{ cfg.sections.sighting.location.label }}
                  <span v-if="cfg.sections.sighting.location.required" class="text-red-500">*</span>
                </label>
                <select
                  :id="cfg.sections.sighting.location.id"
                  v-model="form.sightingLocation"
                  :required="cfg.sections.sighting.location.required"
                  class="mt-2 w-full rounded border border-slate-300 px-3 py-2.5 text-sm focus:border-fisinor-cyan focus:outline-none focus:ring-1 focus:ring-fisinor-cyan"
                >
                  <option value="" disabled>{{ cfg.sections.sighting.location.placeholder }}</option>
                  <option v-for="opt in cfg.sections.sighting.location.options" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
                </select>
              </div>

              <div>
                <label :for="cfg.sections.sighting.relation.id" class="block text-sm font-semibold text-slate-700">
                  {{ cfg.sections.sighting.relation.label }}
                  <span v-if="cfg.sections.sighting.relation.required" class="text-red-500">*</span>
                </label>
                <select
                  :id="cfg.sections.sighting.relation.id"
                  v-model="form.subjectRelation"
                  :required="cfg.sections.sighting.relation.required"
                  class="mt-2 w-full rounded border border-slate-300 px-3 py-2.5 text-sm focus:border-fisinor-cyan focus:outline-none focus:ring-1 focus:ring-fisinor-cyan"
                >
                  <option value="" disabled>{{ cfg.sections.sighting.relation.placeholder }}</option>
                  <option v-for="opt in cfg.sections.sighting.relation.options" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
                </select>
              </div>
            </div>
          </section>

          <!-- Section 3: Anomaly matrix -->
          <section class="mb-10">
            <div class="mb-5 flex items-center gap-3">
              <div class="flex h-8 w-8 items-center justify-center rounded-full bg-fisinor-dark text-sm font-bold text-white">3</div>
              <div>
                <h3 class="font-serif text-lg font-semibold text-fisinor-dark">{{ cfg.sections.anomalies.title }}</h3>
                <p class="text-xs text-slate-500">{{ cfg.sections.anomalies.description }}</p>
              </div>
            </div>

            <div class="grid gap-3 sm:grid-cols-2">
              <label
                v-for="option in cfg.sections.anomalies.options"
                :key="option.id"
                class="group relative flex cursor-pointer items-start gap-3 rounded border border-slate-200 bg-white p-4 transition-all hover:-translate-y-0.5 hover:border-fisinor-cyan/50 hover:shadow-sm"
                :class="form.anomalies.includes(option.id) ? 'border-fisinor-cyan bg-fisinor-cyan/5' : ''"
              >
                <input
                  :id="option.id"
                  type="checkbox"
                  :value="option.id"
                  :checked="form.anomalies.includes(option.id)"
                  class="mt-0.5 h-4 w-4 rounded border-slate-300 text-fisinor-cyan focus:ring-fisinor-cyan"
                  @change="toggleAnomaly(option.id)"
                />
                <div class="flex-1">
                  <span class="block text-sm font-semibold text-fisinor-dark group-hover:text-fisinor-cyan">{{ option.label }}</span>
                  <span class="mt-0.5 block text-xs text-slate-500">{{ option.help }}</span>
                </div>
              </label>
            </div>
          </section>

          <!-- Section 4: Evidence upload -->
          <section class="mb-10">
            <div class="mb-5 flex items-center gap-3">
              <div class="flex h-8 w-8 items-center justify-center rounded-full bg-fisinor-dark text-sm font-bold text-white">4</div>
              <div>
                <h3 class="font-serif text-lg font-semibold text-fisinor-dark">{{ cfg.sections.evidence.title }}</h3>
                <p class="text-xs text-slate-500">{{ cfg.sections.evidence.description }}</p>
              </div>
            </div>

            <!-- Attached files preview grid -->
            <div v-if="attachedFiles.length > 0" class="mb-4">
              <div class="mb-3 flex items-center justify-between">
                <p class="text-[10px] font-bold uppercase tracking-wider text-fisinor-cyan">
                  {{ cfg.sections.evidence.dropzone.previewLabel }} ({{ attachedFiles.length }}/{{ maxFiles }})
                </p>
                <button
                  v-if="attachedFiles.length > 1"
                  type="button"
                  class="text-xs font-semibold text-red-600 transition-colors hover:text-red-700"
                  @click="clearAllFiles"
                >
                  {{ cfg.sections.evidence.dropzone.removeLabel }} todo
                </button>
              </div>

              <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <div
                  v-for="(item, index) in attachedFiles"
                  :key="item.file.name + index"
                  class="group relative overflow-hidden rounded-lg border border-slate-200 bg-white p-3 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div class="relative aspect-square overflow-hidden rounded border border-slate-200 bg-fisinor-hospital">
                    <img
                      v-if="item.previewUrl && !item.previewFailed"
                      :src="item.previewUrl"
                      :alt="item.file.name"
                      class="h-full w-full object-cover"
                      @error="item.previewFailed = true"
                    />
                    <div v-else class="flex h-full w-full flex-col items-center justify-center gap-2 text-slate-400">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                      </svg>
                      <span class="text-[10px] font-medium uppercase">{{ item.file.name.split('.').pop()?.toUpperCase() }}</span>
                    </div>
                  </div>
                  <div class="mt-2">
                    <p class="truncate text-xs font-medium text-fisinor-dark" :title="item.file.name">{{ item.file.name }}</p>
                    <p class="text-[10px] text-slate-500">{{ formatSize(item.file.size) }}</p>
                  </div>
                  <button
                    type="button"
                    class="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-50 text-red-600 shadow-sm transition-colors hover:bg-red-100"
                    @click.stop.prevent="removeFile(index)"
                    :aria-label="cfg.sections.evidence.dropzone.removeLabel"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <div
              class="relative rounded-xl border-2 border-dashed border-slate-300 bg-white p-8 text-center transition-all"
              :class="[
                isDragging ? 'border-fisinor-cyan bg-fisinor-cyan/5' : 'hover:border-fisinor-cyan/50 hover:bg-fisinor-cyan/[0.02]',
                !canAddMore() ? 'cursor-not-allowed opacity-60' : 'cursor-pointer',
              ]"
              @dragover.prevent="onDragOver"
              @dragleave.prevent="onDragLeave"
              @drop.prevent="onDrop"
            >
              <input
                v-if="canAddMore()"
                ref="fileInput"
                type="file"
                multiple
                :accept="cfg.sections.evidence.dropzone.acceptFormats"
                class="absolute inset-0 cursor-pointer opacity-0"
                @change="onFileChange"
              />
              <div class="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-fisinor-cyan/10 text-fisinor-cyan">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>

              <div class="mt-4">
                <p class="font-semibold text-fisinor-dark">{{ cfg.sections.evidence.dropzone.primaryText }}</p>
                <p class="mt-1 text-sm text-slate-500">{{ cfg.sections.evidence.dropzone.secondaryText }}</p>
                <p class="mt-3 text-xs font-medium uppercase tracking-wider text-slate-400">{{ cfg.sections.evidence.dropzone.supportedFormats }}</p>
                <p class="mt-1 text-[10px] font-semibold uppercase tracking-wider text-fisinor-cyan">{{ cfg.sections.evidence.dropzone.maxFilesLabel }}</p>
              </div>
            </div>
          </section>

          <!-- Section 5: Free-text observations -->
          <section class="mb-10">
            <div class="mb-5 flex items-center gap-3">
              <div class="flex h-8 w-8 items-center justify-center rounded-full bg-fisinor-dark text-sm font-bold text-white">5</div>
              <div>
                <h3 class="font-serif text-lg font-semibold text-fisinor-dark">{{ cfg.sections.observations.title }}</h3>
                <p class="text-xs text-slate-500">{{ cfg.sections.observations.description }}</p>
              </div>
            </div>

            <div>
              <textarea
                :id="cfg.sections.observations.field.id"
                v-model="form.observations"
                :placeholder="cfg.sections.observations.field.placeholder"
                :maxlength="cfg.sections.observations.field.maxLength"
                rows="6"
                class="mt-2 w-full resize-y rounded border border-slate-300 px-3 py-2.5 text-sm focus:border-fisinor-cyan focus:outline-none focus:ring-1 focus:ring-fisinor-cyan"
              ></textarea>
              <p class="mt-1 text-right text-xs text-slate-400">
                {{ form.observations.length }} / {{ cfg.sections.observations.field.maxLength }}
              </p>
            </div>
          </section>

          <!-- Submit -->
          <div class="rounded border border-fisinor-desert/20 bg-fisinor-desert/5 p-5">
          <button
            type="button"
            :disabled="isSubmitting"
            class="w-full rounded bg-fisinor-desert px-6 py-4 text-sm font-bold uppercase tracking-wider text-white shadow-lg transition-all hover:bg-orange-600 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
            @click="submitForm"
          >
            <span
              v-if="isSubmitting"
              class="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent align-[-2px]"
            ></span>
            {{ isSubmitting ? 'Enviando...' : cfg.sections.submit.label }}{{ cfg.sections.submit.unit }}
          </button>
          <p class="mt-3 text-center text-xs text-slate-500">{{ cfg.sections.submit.helper }}</p>
          </div>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="border-t border-slate-200 bg-white py-8">
      <div class="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <p class="text-xs leading-relaxed text-slate-500">
          {{ privacyNoteParts.before }}
          <a
            :href="cfg.footer.clientPortalLink.href"
            class="font-bold underline decoration-current underline-offset-2 transition-colors hover:text-fisinor-cyan"
          >
            {{ cfg.footer.clientPortalLink.text }}
          </a>
          {{ privacyNoteParts.after }}
        </p>
        <p class="mt-3 text-xs text-slate-400">{{ cfg.footer.copyright }}</p>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.25s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
