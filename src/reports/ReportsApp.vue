<script setup lang="ts">
import { ref, reactive } from 'vue'
import { fisinorConfig } from '../config/fisinorConfig'

const cfg = fisinorConfig.anomalyReportForm

interface ReportForm {
  notifierEmail: string
  notifierIdentifier: string
  anonymity: boolean
  sightingLocation: string
  subjectRelation: string
  anomalies: string[]
}

const form = reactive<ReportForm>({
  notifierEmail: '',
  notifierIdentifier: '',
  anonymity: false,
  sightingLocation: '',
  subjectRelation: '',
  anomalies: [],
})

const isDragging = ref(false)
const fileName = ref<string | null>(null)

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
  const files = event.dataTransfer?.files
  if (files && files.length > 0) {
    fileName.value = files[0].name
  }
}

function onFileChange(event: Event) {
  const input = event.target as HTMLInputElement
  if (input.files && input.files.length > 0) {
    fileName.value = input.files[0].name
  }
}
</script>

<template>
  <div class="min-h-screen bg-fisinor-hospital">
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
          class="group flex items-center gap-2 rounded-lg border border-fisinor-desert/40 bg-fisinor-desert/10 px-4 py-2.5 text-sm font-semibold text-fisinor-desert transition-all hover:bg-fisinor-desert hover:text-white"
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

            <div
              class="relative cursor-pointer rounded-xl border-2 border-dashed border-slate-300 bg-white p-8 text-center transition-all"
              :class="isDragging ? 'border-fisinor-cyan bg-fisinor-cyan/5' : 'hover:border-fisinor-cyan/50 hover:bg-fisinor-cyan/[0.02]'"
              @dragover.prevent="onDragOver"
              @dragleave.prevent="onDragLeave"
              @drop.prevent="onDrop"
            >
              <input type="file" accept=".jpg,.png,.raw,.dcm" class="absolute inset-0 cursor-pointer opacity-0" @change="onFileChange" />
              <div class="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-fisinor-cyan/10 text-fisinor-cyan">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>

              <div v-if="fileName" class="mt-4">
                <div class="inline-flex items-center gap-2 rounded border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-700">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  {{ fileName }}
                </div>
              </div>

              <div v-else class="mt-4">
                <p class="font-semibold text-fisinor-dark">{{ cfg.sections.evidence.dropzone.primaryText }}</p>
                <p class="mt-1 text-sm text-slate-500">{{ cfg.sections.evidence.dropzone.secondaryText }}</p>
                <p class="mt-3 text-xs font-medium uppercase tracking-wider text-slate-400">{{ cfg.sections.evidence.dropzone.supportedFormats }}</p>
              </div>
            </div>
          </section>

          <!-- Section 5: Submit -->
          <div class="rounded border border-fisinor-desert/20 bg-fisinor-desert/5 p-5">
            <button
              type="button"
              class="w-full rounded bg-fisinor-desert px-6 py-4 text-sm font-bold uppercase tracking-wider text-white shadow-lg transition-all hover:bg-orange-600 hover:shadow-xl"
            >
              {{ cfg.sections.submit.label }} — {{ cfg.sections.submit.unit }}
            </button>
            <p class="mt-3 text-center text-xs text-slate-500">{{ cfg.sections.submit.helper }}</p>
          </div>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="border-t border-slate-200 bg-white py-8">
      <div class="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <p class="text-xs leading-relaxed text-slate-500">{{ cfg.footer.privacyNote }}</p>
        <p class="mt-3 text-xs text-slate-400">{{ cfg.footer.copyright }}</p>
      </div>
    </footer>
  </div>
</template>
