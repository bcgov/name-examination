<template>
  <div :aria-label="text">
    <div aria-hidden>
      <span>{{ left }}</span>
      <span class="font-bold text-green-600">{{ highlighted }}</span>
      <span>{{ right }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
const { text, start, end } = defineProps<{
  text: string
  start: number
  end: number
}>()

const left = text.substring(0, start)
const highlighted = text.substring(start, end)
const right = text.substring(end, text.length)
</script>
