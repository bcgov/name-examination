<template>
  <input
    :value="modelValue"
    @change="(e) => $emit('update:modelValue', (e.target as HTMLInputElement).value)"
    type="date"
    class="rounded-md border border-gray-300 px-3 py-1"
    :min="minToday ? today : undefined"
  />
</template>

<script setup lang="ts">
import { DateTime } from 'luxon'

defineProps<{
  modelValue: string
  minToday?: boolean
}>()

const today = computed(() => DateTime.now().toFormat('yyyy-MM-dd'))
</script>
