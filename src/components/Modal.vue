<script setup lang="ts">
const props = defineProps<{
  title: string
  open: boolean
}>()
const emit = defineEmits<{
  (e: 'close'): void
}>()

function onBackdropClick(event: MouseEvent) {
  if (event.target === event.currentTarget) {
    emit('close')
  }
}
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-200"
      leave-active-class="transition-opacity duration-200"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0"
    >
      <div
        v-if="open"
        class="fixed inset-0 z-50 flex items-center justify-center bg-fisinor-dark/60 backdrop-blur-sm p-4"
        @click="onBackdropClick"
      >
        <div
          class="w-full max-w-lg rounded-xl bg-white shadow-2xl border border-slate-200 overflow-hidden"
          role="dialog"
          aria-modal="true"
        >
          <div class="flex items-center justify-between bg-fisinor-medical px-6 py-4 border-b border-slate-200">
            <h3 class="text-lg font-semibold text-fisinor-dark">{{ title }}</h3>
            <button
              class="text-slate-400 hover:text-fisinor-dark transition-colors"
              aria-label="Cerrar"
              @click="emit('close')"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div class="px-6 py-6">
            <slot />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
