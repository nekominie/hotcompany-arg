<script setup lang="ts">
defineProps<{
  rating: number
}>()
</script>

<template>
  <span
    class="relative inline-block leading-none select-none align-middle"
    :aria-label="`${rating} de 5 estrellas`"
    role="img"
  >
    <span class="text-slate-300" aria-hidden="true">★★★★★</span>
    <span
      class="absolute left-0 top-0 overflow-hidden whitespace-nowrap text-amber-400"
      :style="{ width: `${(rating / 5) * 100}%` }"
      aria-hidden="true"
    >
      ★★★★★
    </span>
  </span>
</template>
