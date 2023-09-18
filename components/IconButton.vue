<template>
  <button
    class="w-20 rounded-lg border bg-bcgov-blue5 px-4 py-0.5 text-white transition hover:bg-bcgov-gold5 hover:text-black"
  >
    <svg-icon type="mdi" viewBox="0 -3 24 24" :path="iconPath" />
  </button>
</template>

<script setup lang="ts">
defineProps<{
  iconPath: string
}>()
</script>
