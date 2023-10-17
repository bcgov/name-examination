<template>
  <button
    class="inline-flex items-center justify-center space-x-1 rounded-md border border-bcgov-blue5 p-2 font-semibold transition"
    :class="[
      inverted
        ? 'bg-sky-300 text-black hover:bg-sky-200'
        : 'bg-bcgov-blue5 text-white hover:bg-bcgov-blue4',
    ]"
  >
    <slot></slot>
    <span>{{ text }}</span>
  </button>
</template>

<script setup lang="ts">
/**
 * A styled button that contains an icon and/or text
 */
defineProps<{
  text?: string
  inverted?: boolean
}>()
</script>
