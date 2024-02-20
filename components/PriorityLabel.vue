<template>
  <div class="flex items-center font-bold text-red-600">
    <StarIcon :class="iconStyle ?? 'h-4 w-4'" />
    <p>Priority</p>
  </div>
</template>

<script setup lang="ts">
import { StarIcon } from '@heroicons/vue/24/solid'
defineProps<{
  iconStyle?: string
}>()
</script>
