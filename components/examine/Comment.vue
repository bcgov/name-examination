<template>
  <div class="flex flex-col py-2 text-sm">
    <p>{{ content }}</p>
    <span class="italic">{{ author }} &ndash; {{ date }}</span>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  content: string
  author: string
  date: string
}>()
</script>
