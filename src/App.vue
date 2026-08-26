<script setup lang="ts">
import { ref, nextTick } from 'vue'
import Header from './components/Header.vue'
import Hero from './components/Hero.vue'
import Announcements from './components/Announcements.vue'
import Technologies from './components/Technologies.vue'
import Footer from './components/Footer.vue'
import LoginModal from './components/LoginModal.vue'
import MapModal from './components/MapModal.vue'
import CloneModal from './components/CloneModal.vue'
import TerminalView from './components/TerminalView.vue'

const openLogin = ref(false)
const openMap = ref(false)
const openReport = ref(false)
const isSystemCorrupted = ref(false)
const showGlitch = ref(false)
const reporterEmail = ref('')

function scrollTo(id: string) {
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth' })
}

function onReportSubmitted(email: string) {
  reporterEmail.value = email
  openReport.value = false
  showGlitch.value = true

  // Simulate system crash/glitch before revealing terminal
  setTimeout(() => {
    showGlitch.value = false
    isSystemCorrupted.value = true
    nextTick(() => {
      document.body.style.overflow = 'hidden'
    })
  }, 1800)
}

function resetInterface() {
  isSystemCorrupted.value = false
  reporterEmail.value = ''
  document.body.style.overflow = ''
}
</script>

<template>
  <div class="min-h-screen bg-white">
    <Header @open-portal="openLogin = true" />
    <main>
      <Hero @scroll-to="scrollTo" />
      <Announcements @open-map="openMap = true" @open-report="openReport = true" />
      <Technologies />
    </main>
    <Footer />

    <LoginModal :open="openLogin" @close="openLogin = false" />
    <MapModal :open="openMap" @close="openMap = false" />
    <CloneModal :open="openReport" @close="openReport = false" @report-submitted="onReportSubmitted" />

    <Transition
      enter-active-class="transition-opacity duration-100"
      leave-active-class="transition-opacity duration-100"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0"
    >
      <div
        v-if="showGlitch"
        class="fixed inset-0 z-[200] flex items-center justify-center bg-black"
      >
        <div class="glitch-text text-center">
          <div class="text-6xl font-black text-red-600 animate-glitch sm:text-8xl">ERROR</div>
          <div class="mt-4 font-mono text-sm text-green-500 animate-pulse">VIOLACIÓN DE PROTOCOLO DE GARANTÍA</div>
          <div class="mt-2 font-mono text-xs text-red-400">Acceso a nivel de denunciante detectado...</div>
        </div>
        <div class="absolute inset-0 bg-red-600/20 animate-flicker" />
      </div>
    </Transition>

    <Transition
      enter-active-class="transition-opacity duration-500"
      leave-active-class="transition-opacity duration-500"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0"
    >
      <TerminalView
        v-if="isSystemCorrupted"
        :reporter-email="reporterEmail"
        @reset="resetInterface"
      />
    </Transition>
  </div>
</template>

<style scoped>
.glitch-text {
  text-shadow: 2px 0 #00ff00, -2px 0 #ff0000;
}
</style>
