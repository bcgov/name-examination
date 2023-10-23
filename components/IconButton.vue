<template>
  <button
    class="inline-flex items-center justify-center space-x-1 rounded-md border p-2 transition hover:text-opacity-100 hover:opacity-90"
    :class="[
      light
        ? 'bg-bcgov-blue3 text-white'
        : white
        ? 'border-gray-300 bg-white text-black hover:bg-gray-200'
        : 'bg-bcgov-blue5 text-white',
    ]"
  >
    <slot></slot>

    <!-- User of the component can pass in the text either as a prop or as a template (for custom styled text) -->
    <slot name="text"></slot>
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
