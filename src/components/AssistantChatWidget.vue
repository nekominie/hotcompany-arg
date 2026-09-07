<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { fisinorConfig } from '../config/fisinorConfig'
import { getAssistantConfig, submitAssistantReply } from '../services/apiClient'

const config = fisinorConfig.assistant

interface ChatMsg {
  id: number
  from: 'bot' | 'user'
  text: string
}

const open = ref(false)
const draft = ref('')
const bodyEl = ref<HTMLElement | null>(null)

const isOnline = ref(false)
const messages = ref<ChatMsg[]>([])
const typing = ref(false)
const unread = ref(0)

interface ScriptItem {
  text: string
  delayMs: number
  waiting: boolean
  messageId: string | null
}

const FALLBACK_SCRIPT: ScriptItem[] = [
  { text: 'Hola, soy KIARA, la asistente de FISINOR. Vi que intentaste entrar al Portal de Empleados.', delayMs: 2000, waiting: false, messageId: null },
  { text: 'Ese acceso requiere VPN institucional. ¿Te ayudo a verificar tu conexión?', delayMs: 3000, waiting: false, messageId: null },
  { text: 'Si no tienes VPN, escríbenos a redes@fisinor.com.mx · EXT. 4000.', delayMs: 3000, waiting: false, messageId: null },
]

let scriptMessages: ScriptItem[] = [...FALLBACK_SCRIPT]
let assistantEnabled = true
let activationDelayMs = 8000
let fallbackMessageDelayMs = 3000
const FALLBACK_INVALID_EMAIL_MESSAGE = 'Ese correo no parece válido. Escríbelo de nuevo, por favor.'
let invalidEmailMessage = FALLBACK_INVALID_EMAIL_MESSAGE
let hasTriggered = false
let timers: number[] = []
let msgId = 0
let scriptIndex = 0
let waitingMessageId: string | null = null

const awaitingReply = ref(false)

function isEmailLike(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

function clearTimers() {
  for (const timer of timers) {
    window.clearTimeout(timer)
  }
  timers = []
}

async function scrollToBottom() {
  await nextTick()
  if (bodyEl.value) {
    bodyEl.value.scrollTop = bodyEl.value.scrollHeight
  }
}

function sendMessage() {
  const text = draft.value.trim()
  if (!text) return
  messages.value.push({ id: ++msgId, from: 'user', text })
  draft.value = ''
  scrollToBottom()

  // Si el robot estaba esperando el correo: valida el formato antes de continuar.
  if (awaitingReply.value) {
    if (isEmailLike(text)) {
      awaitingReply.value = false
      submitAssistantReply(text, waitingMessageId).catch(() => {
        // Sin backend o correo inválido: el flujo continúa de todos modos.
      })
      waitingMessageId = null
      playNext()
    } else {
      // Formato inválido: responde con el mensaje configurable y sigue esperando otro input.
      if (invalidEmailMessage) {
        typing.value = true
        scrollToBottom()
        timers.push(
          window.setTimeout(() => {
            typing.value = false
            pushBotMessage(invalidEmailMessage)
          }, 800),
        )
      }
    }
  }
}

function pushBotMessage(text: string) {
  messages.value.push({ id: ++msgId, from: 'bot', text })
  if (!open.value) {
    unread.value += 1
  }
  scrollToBottom()
}

function activateRobot() {
  if (!assistantEnabled) return
  isOnline.value = true
  // Abrir el chat para que el usuario vea los mensajes entrantes.
  open.value = true
  unread.value = 0

  if (scriptMessages.length === 0) {
    return
  }

  scriptIndex = 0
  awaitingReply.value = false
  waitingMessageId = null
  playNext()
}

// Envía el siguiente mensaje del guion; si es de espera, se pausa hasta el input del usuario.
function playNext() {
  if (scriptIndex >= scriptMessages.length) {
    typing.value = false
    return
  }

  const item = scriptMessages[scriptIndex]
  const wait = Math.min(120000, Math.max(0, item.delayMs))

  const show = () => {
    typing.value = false
    pushBotMessage(item.text)
    scriptIndex += 1
    if (item.waiting) {
      // Pausa: el siguiente mensaje llegará cuando el usuario responda.
      waitingMessageId = item.messageId
      awaitingReply.value = true
      scrollToBottom()
      return
    }
    playNext()
  }

  if (wait > 400) {
    const typingLead = Math.min(1100, Math.max(500, wait * 0.5))
    timers.push(
      window.setTimeout(() => {
        typing.value = true
        scrollToBottom()
      }, Math.max(0, wait - typingLead)),
    )
    timers.push(window.setTimeout(show, wait))
  } else {
    timers.push(window.setTimeout(show, wait))
  }
}

function onEmployeePortalInterest() {
  if (hasTriggered) return
  hasTriggered = true
  timers.push(window.setTimeout(activateRobot, activationDelayMs))
}

async function loadAssistantScript() {
  try {
    const controller = new AbortController()
    const timeout = window.setTimeout(() => controller.abort(), 3000)
    const remote = await getAssistantConfig(controller.signal)
    window.clearTimeout(timeout)
    assistantEnabled = remote.isEnabled
    activationDelayMs = Math.min(300, Math.max(0, remote.activationDelaySeconds)) * 1000
    fallbackMessageDelayMs = Math.min(120, Math.max(0, remote.messageDelaySeconds)) * 1000
    invalidEmailMessage =
      typeof remote.invalidEmailMessage === 'string' && remote.invalidEmailMessage.trim().length > 0
        ? remote.invalidEmailMessage.trim()
        : FALLBACK_INVALID_EMAIL_MESSAGE
    const items = (remote.messages ?? [])
      .map((m) => ({
        text: typeof m.body === 'string' ? m.body.trim() : '',
        delayMs:
          Math.min(
            120,
            Math.max(0, Math.round(Number(m.delaySeconds ?? fallbackMessageDelayMs / 1000) || 0)),
          ) * 1000,
        waiting: m.isWaitingForReply === true,
        messageId: typeof m.id === 'string' && m.id.length > 0 ? m.id : null,
      }))
      .filter((item) => item.text.length > 0)
    if (items.length > 0) {
      scriptMessages = items.slice(0, 20)
    }
  } catch {
    // Sin backend: se queda el guion local por defecto para no romper el ARG.
    scriptMessages = [...FALLBACK_SCRIPT]
  }
}

watch(open, (isOpen) => {
  if (isOpen) {
    unread.value = 0
    scrollToBottom()
  }
})

watch([messages, typing], () => {
  scrollToBottom()
})

onMounted(async () => {
  await loadAssistantScript()
  window.addEventListener('fisinor:employee-portal-interest', onEmployeePortalInterest)
})

onUnmounted(() => {
  window.removeEventListener('fisinor:employee-portal-interest', onEmployeePortalInterest)
  clearTimers()
})
</script>

<template>
  <div class="fixed bottom-4 right-4 z-[100] flex flex-col items-end gap-3">
    <!-- Ventana de chat -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 translate-y-3 scale-95"
      enter-to-class="opacity-100 translate-y-0 scale-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0 scale-100"
      leave-to-class="opacity-0 translate-y-3 scale-95"
    >
      <section
        v-if="open"
        class="flex h-[420px] w-[330px] max-w-[calc(100vw-32px)] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
        role="dialog"
        aria-label="Chat con el asistente"
      >
        <!-- Encabezado -->
        <header class="flex items-center gap-3 bg-fisinor-dark px-4 py-3">
          <span class="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-fisinor-cyan/20 text-fisinor-cyan">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.6" class="h-6 w-6" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 3h6v3H9z" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v2" />
              <rect x="5" y="8" width="14" height="11" rx="2.5" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.5h.01M15 12.5h.01M9.5 16h5" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 12H3.5M20.5 12H19" />
            </svg>
            <span
              class="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-fisinor-dark"
              :class="isOnline ? 'bg-emerald-400' : 'bg-slate-400'"
              aria-hidden="true"
            ></span>
          </span>
          <div class="min-w-0 flex-1 leading-tight">
            <p class="truncate text-sm font-bold text-white">{{ config.chatTitle }}</p>
            <p class="flex items-center gap-1.5 text-[11px] font-semibold text-slate-300">
              <span
                class="h-1.5 w-1.5 rounded-full"
                :class="isOnline ? 'bg-emerald-400' : 'bg-slate-400'"
                aria-hidden="true"
              ></span>
              {{ isOnline ? config.onlineStatus : config.chatStatus }}
            </p>
          </div>
          <button
            type="button"
            class="rounded-lg p-1.5 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
            :aria-label="config.closeLabel"
            @click="open = false"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" class="h-5 w-5" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </header>

        <!-- Cuerpo del chat -->
        <div ref="bodyEl" class="flex flex-1 flex-col gap-2 overflow-y-auto bg-fisinor-medical px-4 py-3">
          <div
            v-if="messages.length === 0 && !typing"
            class="flex flex-1 flex-col items-center justify-center gap-3 text-center"
          >
            <span
              class="flex h-14 w-14 items-center justify-center rounded-2xl border text-slate-400"
              :class="isOnline ? 'border-fisinor-cyan/30 bg-fisinor-cyan/10 text-fisinor-cyan' : 'border-slate-300 bg-slate-200'"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.4" class="h-8 w-8" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="M8 10h8m-8 4h5" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
            <p
              class="flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-bold"
              :class="isOnline ? 'border-slate-200 bg-white text-slate-500' : 'border-slate-300 bg-slate-200 text-slate-500'"
            >
              <span
                class="h-1.5 w-1.5 rounded-full"
                :class="isOnline ? 'bg-emerald-400' : 'bg-slate-400'"
                aria-hidden="true"
              ></span>
              {{ isOnline ? config.onlineStatus : config.chatStatus }}
            </p>
            <p class="text-xs font-semibold leading-relaxed text-slate-500">
              {{ isOnline ? config.emptyMessage : config.offlineNotice }}
            </p>
          </div>

          <template v-else>
            <div
              v-for="msg in messages"
              :key="msg.id"
              class="flex"
              :class="msg.from === 'user' ? 'justify-end' : 'justify-start'"
            >
              <p
                class="max-w-[85%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed shadow-sm"
                :class="
                  msg.from === 'user'
                    ? 'rounded-br-md bg-fisinor-cyan text-white'
                    : 'rounded-bl-md border border-slate-200 bg-white text-slate-700'
                "
              >
                {{ msg.text }}
              </p>
            </div>
            <div v-if="typing" class="flex justify-start">
              <p class="flex items-center gap-1.5 rounded-2xl rounded-bl-md border border-slate-200 bg-white px-3.5 py-2.5 text-[11px] font-semibold text-slate-400">
                <span class="flex gap-1" aria-hidden="true">
                  <span class="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400" style="animation-delay: 0ms"></span>
                  <span class="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400" style="animation-delay: 150ms"></span>
                  <span class="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400" style="animation-delay: 300ms"></span>
                </span>
                {{ config.typingLabel }}
              </p>
            </div>
          </template>
        </div>

        <!-- Compositor -->
        <form
          class="flex items-center gap-2 border-t border-slate-200 bg-white px-3 py-2.5"
          @submit.prevent="sendMessage"
        >
          <input
            v-model="draft"
            type="text"
            class="assistant-input h-10 min-w-0 flex-1 rounded-full border border-slate-200 bg-fisinor-medical px-4 text-sm text-fisinor-dark outline-none transition-colors focus:border-fisinor-cyan disabled:cursor-not-allowed disabled:opacity-60"
            :class="{ 'assistant-input--offline': !isOnline }"
            :placeholder="awaitingReply ? config.replyPlaceholder : config.inputPlaceholder"
            :aria-label="awaitingReply ? config.replyPlaceholder : config.inputPlaceholder"
            :disabled="!awaitingReply"
          />
          <button
            type="submit"
            class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-fisinor-cyan text-white transition-all hover:bg-cyan-600 disabled:opacity-50"
            :aria-label="config.sendLabel"
            :disabled="!awaitingReply || draft.trim() === ''"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8" class="h-5 w-5" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
            </svg>
          </button>
        </form>
      </section>
    </Transition>

    <!-- Botón flotante del asistente -->
    <button
      type="button"
      class="group relative flex items-center gap-3 rounded-full bg-fisinor-dark p-2 pr-5 text-white shadow-2xl transition-all duration-200 hover:scale-105 hover:shadow-fisinor-cyan/30 focus:outline-none focus:ring-2 focus:ring-fisinor-cyan focus:ring-offset-2"
      :aria-expanded="open"
      @click="open = !open"
    >
      <span class="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-fisinor-cyan to-cyan-700">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="1.7"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="h-7 w-7 text-white transition-transform duration-300 group-hover:rotate-6"
          aria-hidden="true"
        >
          <path d="M9 2.5h6v3H9z" />
          <path d="M12 5.5v2" />
          <rect x="4.5" y="7.5" width="15" height="12" rx="3" />
          <path d="M4.5 12H3M21 12h-1.5" />
          <path d="M9 12.5h.01M15 12.5h.01" stroke-width="2.4" />
          <path d="M9.5 16.5h5" />
        </svg>
        <span
          v-if="!open"
          class="absolute -right-0.5 -top-0.5 h-3.5 w-3.5 rounded-full border-2 border-fisinor-dark"
          :class="isOnline ? 'bg-emerald-400' : 'bg-slate-400'"
          aria-hidden="true"
        ></span>
        <span
          v-if="unread > 0 && !open"
          class="absolute -left-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white"
          aria-hidden="true"
        >{{ unread > 9 ? '9+' : unread }}</span>
      </span>

      <span class="flex flex-col leading-tight">
        <span class="text-sm font-bold">{{ config.buttonLabel }}</span>
        <span class="text-xs font-semibold" :class="isOnline ? 'text-emerald-400' : 'text-fisinor-cyan'">
          {{ isOnline ? config.onlineStatus : config.chatStatus }}
        </span>
      </span>
    </button>
  </div>
</template>

<style scoped>
/* Input visiblemente apagado mientras el robot está desconectado */
.assistant-input--offline:disabled {
  background-color: #cbd5e1;
  border-color: #94a3b8;
  color: #64748b;
}
.assistant-input--offline:disabled::placeholder {
  color: #64748b;
}
</style>
