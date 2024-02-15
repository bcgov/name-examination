<template>
  <span class="text-3xl font-bold" :class="{ 'text-red-600': priority }">
    {{ nrNumber }}
  </span>
</template>

<script setup lang="ts">
defineProps<{
  nrNumber: string
  priority?: boolean
}>()
</script>
