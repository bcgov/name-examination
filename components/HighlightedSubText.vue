<template>
  <span :aria-label="text">
    <span aria-hidden>
      <span>{{ left }}</span>
      <span class="font-bold text-green-600">{{ highlighted }}</span>
      <span>{{ right }}</span>
    </span>
  </span>
</template>

<script setup lang="ts">
const { text, start, end } = defineProps<{
  text: string
  start: number
  end: number
}>()

const left = ref(text.substring(0, start))
const highlighted = ref(text.substring(start, end))
const right = ref(text.substring(end, text.length))
</script>
