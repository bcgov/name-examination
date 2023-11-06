<template>
  <input
    type="date"
    class="rounded-md border border-gray-300 px-3 py-1"
    :min="minToday ? today : undefined"
  />
</template>

<script setup lang="ts">
import { DateTime } from 'luxon'

defineProps<{
  minToday?: boolean
}>()

const today = computed(() => DateTime.now().toFormat('yyyy-MM-dd'))
</script>
