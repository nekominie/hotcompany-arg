<template>
  <a
    href="distribucion.html"
    class="fixed bottom-4 right-4 z-50 flex items-center gap-3 rounded-full bg-fisinor-dark p-2 pr-5 text-white shadow-2xl transition-all duration-200 hover:scale-105 hover:shadow-fisinor-cyan/30 focus:outline-none focus:ring-2 focus:ring-fisinor-cyan focus:ring-offset-2"
    aria-label="Programa HydroSoma, gratis. Ir a la página de distribución."
  >
    <span class="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-fisinor-cyan">
      <span
        class="absolute -left-1 -top-1 rounded-full bg-fisinor-desert px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-fisinor-dark shadow animate-pulse"
      >
        GRATIS
      </span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="h-6 w-6 text-white"
        aria-hidden="true"
      >
        <path d="M9 2h6v4H9z" />
        <path d="M8 8h8l2 3v9a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V11l2-3z" />
        <path d="M9 12h6" />
      </svg>
    </span>

    <span class="flex flex-col leading-tight">
      <span class="text-sm font-bold">Programa HydroSoma</span>
      <span class="text-xs font-semibold text-fisinor-cyan underline-offset-2 hover:underline">
        Me interesa
      </span>
    </span>
  </a>
</template>
