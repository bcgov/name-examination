<template>
  <input
    :value="modelValue"
    @change="(e) => $emit('update:modelValue', (e.target as HTMLInputElement).value)"
    type="date"
    class="rounded-md border border-gray-300 px-3 py-1"
    :class="{ 'border-2 border-red-600': errorStyle }"
    :min="minToday ? today : undefined"
  />
</template>

<script setup lang="ts">
import { DateTime } from 'luxon'

defineProps<{
  modelValue: string
  minToday?: boolean
  /** Style this input to show an error */
  errorStyle?: boolean
}>()

const today = computed(() => DateTime.now().toFormat('yyyy-MM-dd'))
</script>
