<template>
  <h1 class="text-3xl font-bold" :class="{ 'text-red-600': priority }">
    {{ nrNumber }}
  </h1>
</template>

<script setup lang="ts">
defineProps<{
  nrNumber: string
  priority?: boolean
}>()
</script>
