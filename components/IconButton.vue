<template>
  <button
    class="inline-flex items-center justify-center space-x-1 rounded-md border bg-bcgov-blue5 px-3 py-2 text-white transition hover:bg-bcgov-blue4"
  >
    <slot></slot>
    <span>{{ text }}</span>
  </button>
</template>

<script setup lang="ts">
defineProps<{
  text?: string
}>()
</script>
