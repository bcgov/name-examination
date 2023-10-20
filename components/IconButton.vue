<template>
  <button
    class="inline-flex items-center justify-center space-x-1 rounded-md border p-2 transition hover:opacity-90 hover:text-opacity-100"
    :class="[
      light
        ? 'bg-bcgov-blue3 text-white'
        : white
        ? 'bg-white text-gray-800 hover:bg-gray-200'
        : 'bg-bcgov-blue5 text-white',
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
  light?: boolean
  white?: boolean
}>()
</script>
