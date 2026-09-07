<script setup lang="ts">
import { ref } from 'vue'
import TopBar from './components/TopBar.vue'
import Header from './components/Header.vue'
import Hero from './components/Hero.vue'
import AboutImpact from './components/AboutImpact.vue'
import ResearchUnits from './components/ResearchUnits.vue'
import PressCenter from './components/PressCenter.vue'
import Testimonials from './components/Testimonials.vue'
import Footer from './components/Footer.vue'
import PortalSelectorModal from './components/PortalSelectorModal.vue'
import EmployeePortalModal from './components/EmployeePortalModal.vue'
import VpnWarningModal from './components/VpnWarningModal.vue'
import FloatingHydroPromo from './components/FloatingHydroPromo.vue'
import AssistantChatWidget from './components/AssistantChatWidget.vue'
import { type PortalOptionConfig } from './config/fisinorConfig'

type PortalView = 'selector' | 'employee' | 'vpn' | null

const activePortal = ref<PortalView>(null)

function onPortalSelect(option: PortalOptionConfig) {
  if (option.id === 'employees') {
    // El usuario mostró interés en el portal de empleados: avisa al robot flotante.
    window.dispatchEvent(new CustomEvent('fisinor:employee-portal-interest'))
  }
  if (option.action === 'vpn') {
    // El portal de empleados exige VPN: se muestra la advertencia y no se redirige.
    activePortal.value = 'vpn'
    return
  }
  if (option.action === 'modal') {
    activePortal.value = 'employee'
    return
  }
  activePortal.value = null
  if (option.href) {
    window.location.href = option.href
  }
}
</script>

<template>
  <div class="min-h-screen bg-white">
    <TopBar />
    <Header @open-portal="activePortal = 'selector'" />

    <main>
      <Hero />
      <AboutImpact />
      <ResearchUnits />
      <PressCenter />
      <Testimonials />
    </main>

    <Footer />

    <PortalSelectorModal
      :open="activePortal === 'selector'"
      @close="activePortal = null"
      @select="onPortalSelect"
    />
    <EmployeePortalModal :open="activePortal === 'employee'" @close="activePortal = null" />
    <VpnWarningModal :open="activePortal === 'vpn'" @close="activePortal = null" />
    <FloatingHydroPromo />
    <AssistantChatWidget />
  </div>
</template>
