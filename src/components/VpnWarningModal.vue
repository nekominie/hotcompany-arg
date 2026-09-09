<script setup lang="ts">
import { ref, watch } from 'vue'
import { fisinorConfig } from '../config/fisinorConfig'
import { fetchEmployeesAccess } from '../services/apiClient'

const props = defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

type AccessState = 'checking' | 'granted' | 'denied'

const state = ref<AccessState>('checking')
let abort: AbortController | null = null

async function verifyAccess() {
  abort?.abort()
  abort = new AbortController()
  state.value = 'checking'
  // Falla cerrado: sin servidor o sin pase, se muestra el bloqueo.
  const access = await fetchEmployeesAccess(abort.signal)
  state.value = access.allowed ? 'granted' : 'denied'
}

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      void verifyAccess()
    } else {
      abort?.abort()
      state.value = 'checking'
    }
  },
  { immediate: true },
)
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
        class="vpn-modal"
        @click.self="emit('close')"
      >
        <div class="vpn-card" :class="{ 'vpn-card--granted': state === 'granted' }" role="alertdialog" aria-modal="true">
          <!-- Sello girado tipo estampa institucional -->
          <div class="vpn-stamp" :class="{ 'vpn-stamp--granted': state === 'granted' }">
            {{ state === 'granted' ? fisinorConfig.vpnWarning.grantedStamp : fisinorConfig.vpnWarning.stamp }}
          </div>

          <!-- Escudo con anillos de radar -->
          <div class="vpn-shield">
            <span class="vpn-shield__ring vpn-shield__ring--slow" aria-hidden="true"></span>
            <span class="vpn-shield__ring vpn-shield__ring--fast" aria-hidden="true"></span>
            <span class="vpn-shield__badge" :class="{ 'vpn-shield__badge--granted': state === 'granted' }" aria-hidden="true">
              <svg v-if="state === 'granted'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.6">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
                />
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l-1.5-1.5" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M14.25 8.25l-6 6" />
              </svg>
            </span>
          </div>

          <!-- Estado de conexión -->
          <div
            class="vpn-status"
            :class="{
              'vpn-status--granted': state === 'granted',
              'vpn-status--checking': state === 'checking',
            }"
          >
            <span class="vpn-status__dot" aria-hidden="true"></span>
            {{
              state === 'granted'
                ? fisinorConfig.vpnWarning.statusGranted
                : state === 'checking'
                  ? fisinorConfig.vpnWarning.checkingLabel
                  : fisinorConfig.vpnWarning.statusDenied
            }}
          </div>

          <!-- Verificando -->
          <template v-if="state === 'checking'">
            <h3 class="vpn-title">{{ fisinorConfig.vpnWarning.checkingLabel }}</h3>
          </template>

          <!-- Acceso concedido por pase vigente -->
          <template v-else-if="state === 'granted'">
            <h3 class="vpn-title">{{ fisinorConfig.vpnWarning.grantedTitle }}</h3>
            <p class="vpn-message">{{ fisinorConfig.vpnWarning.grantedMessage }}</p>

            <a class="vpn-accept vpn-enter" :href="fisinorConfig.vpnWarning.employeesPortalEntry">
              {{ fisinorConfig.vpnWarning.enterLabel }}
            </a>
            <button type="button" class="vpn-close" @click="emit('close')">
              {{ fisinorConfig.vpnWarning.acceptLabel }}
            </button>
          </template>

          <!-- Bloqueado -->
          <template v-else>
            <h3 class="vpn-title">{{ fisinorConfig.vpnWarning.title }}</h3>
            <p class="vpn-message">{{ fisinorConfig.vpnWarning.message }}</p>

            <div class="vpn-steps">
              <p class="vpn-steps__label">{{ fisinorConfig.vpnWarning.requirementsTitle }}</p>
              <ol class="vpn-steps__list">
                <li v-for="(requirement, index) in fisinorConfig.vpnWarning.requirements" :key="requirement">
                  <span class="vpn-steps__number">{{ index + 1 }}</span>
                  <span>{{ requirement }}</span>
                </li>
              </ol>
            </div>

            <div class="vpn-contact">
              <p class="vpn-contact__label">{{ fisinorConfig.vpnWarning.contactTitle }}</p>
              <div class="vpn-contact__row">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.6" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3" />
                </svg>
                <div>
                  <span class="vpn-contact__name">{{ fisinorConfig.vpnWarning.contactName }}</span>
                  <span class="vpn-contact__data">
                    {{ fisinorConfig.vpnWarning.contactEmail }} · {{ fisinorConfig.vpnWarning.contactExtension }}
                  </span>
                </div>
              </div>
            </div>

            <button type="button" class="vpn-accept" @click="emit('close')">
              {{ fisinorConfig.vpnWarning.acceptLabel }}
            </button>
          </template>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.vpn-modal {
  position: fixed;
  inset: 0;
  z-index: 60;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  background: rgba(4, 10, 24, 0.72);
  backdrop-filter: blur(6px);
}

.vpn-card {
  position: relative;
  width: min(460px, 100%);
  padding: 34px 30px 26px;
  border: 1px solid rgba(94, 234, 212, 0.16);
  border-top: 3px solid #f59e0b;
  border-radius: 16px;
  background:
    radial-gradient(30rem 18rem at 85% -10%, rgba(245, 158, 11, 0.12), transparent 60%),
    radial-gradient(26rem 16rem at 0% 110%, rgba(23, 153, 181, 0.16), transparent 60%),
    linear-gradient(165deg, #0b1526 0%, #0e1e38 60%, #0a1424 100%);
  box-shadow: 0 40px 90px -30px rgba(0, 0, 0, 0.8);
  overflow: hidden;
  text-align: center;
}

.vpn-card--granted {
  border-top-color: #10b981;
}

/* Retícula tenue sobre el panel */
.vpn-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.035) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.035) 1px, transparent 1px);
  background-size: 26px 26px;
  pointer-events: none;
}

/* Estampa de acceso restringido */
.vpn-stamp {
  position: absolute;
  top: 26px;
  right: -34px;
  rotate: 8deg;
  padding: 5px 40px;
  border: 2px solid rgba(248, 113, 113, 0.85);
  border-radius: 6px;
  color: rgba(252, 165, 165, 0.95);
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  background: rgba(127, 29, 29, 0.25);
  box-shadow: 0 0 18px rgba(220, 38, 38, 0.25);
}

.vpn-stamp--granted {
  border-color: rgba(52, 211, 153, 0.85);
  color: rgba(167, 243, 208, 0.95);
  background: rgba(6, 78, 59, 0.35);
  box-shadow: 0 0 18px rgba(16, 185, 129, 0.25);
}

/* Escudo con anillos de radar */
.vpn-shield {
  position: relative;
  display: grid;
  place-items: center;
  width: 96px;
  height: 96px;
  margin: 0 auto 6px;
}

.vpn-shield__ring {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 1px solid rgba(245, 158, 11, 0.5);
  animation: vpn-radar 2.6s ease-out infinite;
}

.vpn-shield__ring--fast {
  animation-delay: 1.3s;
}

@keyframes vpn-radar {
  0% {
    transform: scale(0.55);
    opacity: 0.9;
  }
  100% {
    transform: scale(1.35);
    opacity: 0;
  }
}

.vpn-shield__badge {
  display: grid;
  place-items: center;
  width: 64px;
  height: 64px;
  border-radius: 18px;
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(23, 153, 181, 0.18));
  border: 1px solid rgba(245, 158, 11, 0.45);
  color: #fbbf24;
}

.vpn-shield__badge--granted {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.22), rgba(23, 153, 181, 0.18));
  border-color: rgba(16, 185, 129, 0.5);
  color: #34d399;
}

.vpn-shield__badge svg {
  width: 34px;
  height: 34px;
}

/* Chip de estado */
.vpn-status {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 14px;
  padding: 4px 12px;
  border: 1px solid rgba(248, 113, 113, 0.4);
  border-radius: 999px;
  background: rgba(127, 29, 29, 0.28);
  color: #fca5a5;
  font-size: 10.5px;
  font-weight: 800;
  letter-spacing: 0.22em;
}

.vpn-status--granted {
  border-color: rgba(52, 211, 153, 0.45);
  background: rgba(6, 78, 59, 0.35);
  color: #6ee7b7;
}

.vpn-status--checking {
  border-color: rgba(148, 163, 184, 0.4);
  background: rgba(30, 41, 59, 0.5);
  color: #cbd5e1;
}

.vpn-status__dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #f87171;
  box-shadow: 0 0 10px rgba(248, 113, 113, 0.9);
  animation: vpn-blink 1.4s ease-in-out infinite;
}

.vpn-status--granted .vpn-status__dot {
  background: #34d399;
  box-shadow: 0 0 10px rgba(52, 211, 129, 0.9);
  animation: none;
}

.vpn-status--checking .vpn-status__dot {
  background: #94a3b8;
  box-shadow: 0 0 10px rgba(148, 163, 184, 0.9);
}

@keyframes vpn-blink {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.25;
  }
}

.vpn-title {
  margin: 0;
  font-size: 21px;
  font-weight: 700;
  letter-spacing: -0.01em;
  color: #f8fafc;
}

.vpn-message {
  margin: 10px auto 0;
  max-width: 38ch;
  font-size: 13.5px;
  line-height: 1.7;
  color: rgba(203, 213, 225, 0.85);
}

/* Pasos */
.vpn-steps {
  margin-top: 20px;
  padding: 16px 18px;
  border: 1px solid rgba(94, 234, 212, 0.16);
  border-radius: 12px;
  background: rgba(15, 23, 42, 0.45);
  text-align: left;
}

.vpn-steps__label {
  margin: 0 0 10px;
  font-size: 10.5px;
  font-weight: 800;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: rgba(94, 234, 212, 0.8);
}

.vpn-steps__list {
  display: grid;
  gap: 9px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.vpn-steps__list li {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 12.5px;
  line-height: 1.55;
  color: rgba(226, 232, 240, 0.88);
}

.vpn-steps__number {
  display: grid;
  place-items: center;
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  margin-top: 1px;
  border-radius: 6px;
  background: rgba(23, 153, 181, 0.22);
  border: 1px solid rgba(23, 153, 181, 0.45);
  color: #67e8f9;
  font-size: 10.5px;
  font-weight: 800;
}

/* Contacto de administración */
.vpn-contact {
  margin-top: 16px;
  padding: 13px 16px;
  border: 1px dashed rgba(245, 158, 11, 0.45);
  border-radius: 12px;
  background: rgba(245, 158, 11, 0.06);
  text-align: left;
}

.vpn-contact__label {
  margin: 0 0 7px;
  font-size: 10.5px;
  font-weight: 800;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: rgba(251, 191, 36, 0.9);
}

.vpn-contact__row {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #fbbf24;
}

.vpn-contact__row > svg {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.vpn-contact__name {
  display: block;
  font-size: 13px;
  font-weight: 700;
  color: #f1f5f9;
}

.vpn-contact__data {
  display: block;
  font-size: 12px;
  color: rgba(203, 213, 225, 0.8);
}

/* Botón de cierre */
.vpn-accept {
  width: 100%;
  margin-top: 20px;
  padding: 12px 20px;
  border: none;
  border-radius: 10px;
  background: linear-gradient(120deg, #0284c7, #0e7490);
  color: #ffffff;
  font-size: 13.5px;
  font-weight: 700;
  letter-spacing: 0.02em;
  cursor: pointer;
  transition: transform 0.15s, box-shadow 0.15s, filter 0.15s;
}

.vpn-accept:hover {
  transform: translateY(-1px);
  box-shadow: 0 14px 30px -14px rgba(14, 116, 144, 0.8);
  filter: saturate(1.15);
}

/* Enlace de entrada (reutiliza el estilo del botón principal) */
.vpn-enter {
  display: block;
  text-align: center;
  text-decoration: none;
}

/* Cierre secundario en estado concedido */
.vpn-close {
  margin-top: 12px;
  border: none;
  background: none;
  color: rgba(148, 163, 184, 0.9);
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
}

.vpn-close:hover {
  color: #e2e8f0;
  text-decoration: underline;
}
</style>
