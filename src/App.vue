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
import EmployeePortalModal from './components/EmployeePortalModal.vue'

const openPortal = ref(false)
</script>

<template>
  <div class="min-h-screen bg-white">
    <TopBar />
    <Header @open-portal="openPortal = true" />

    <main>
      <Hero />
      <AboutImpact />
      <ResearchUnits />
      <PressCenter />
      <Testimonials />
    </main>

    <Footer />

    <EmployeePortalModal :open="openPortal" @close="openPortal = false" />
  </div>
</template>
