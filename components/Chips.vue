<template>
  <div class="flex flex-wrap space-x-1 space-y-1">
    <div
      v-for="item in modelValue"
      class="flex w-fit items-center space-x-1 rounded-md border border-gray-700 bg-sky-100 p-0.5 px-1 text-sm"
    >
      <span>{{ item }}</span>
      <button @click="(event) => onRemove(event, item)" class="hover:bg-sky-200 rounded">
        <XMarkIcon class="h-4 w-4" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { XMarkIcon } from '@heroicons/vue/24/outline'

const { modelValue } = defineProps<{
  modelValue: Array<any>
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', newValue: any): void
}>()

function onRemove(event: MouseEvent, item: any) {
  event.stopPropagation()
  emit(
    'update:modelValue',
    modelValue.filter((c) => c !== item)
  )
}
</script>
