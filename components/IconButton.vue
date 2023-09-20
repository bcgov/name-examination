<template>
  <button
    class="inline-flex items-center justify-center w-20 rounded-md border bg-bcgov-blue5 px-4 py-0.5 text-white transition hover:bg-bcgov-blue8"
  >
    <svg-icon
      v-if="iconPath"
      type="mdi"
      viewBox="0 -3 24 24"
      :path="iconPath"
    />
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
defineProps<{
  iconPath?: string
}>()
</script>
