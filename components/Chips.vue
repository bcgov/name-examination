<template>
  <div class="flex flex-wrap items-center gap-1">
    <div
      v-for="item in modelValue"
      class="flex h-fit w-fit flex-nowrap items-center space-x-1 rounded-md border border-gray-400 bg-sky-100 p-0.5 px-1 text-sm"
    >
      <span>{{ display ? display(item) : item }}</span>
      <button
        @click="(event) => onChipRemove(event, item)"
        class="rounded hover:bg-sky-200"
      >
        <XMarkIcon class="h-4 w-4" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { XMarkIcon } from '@heroicons/vue/24/outline'

const { modelValue } = defineProps<{
  modelValue: Array<any>
  display?: (input: any) => string
}>()

// setInterval(() => console.log(modelValue), 1000)

const emit = defineEmits<{
  (e: 'update:modelValue', newValue: any): void
  (e: 'chipRemoved', item: any): void
}>()

function onChipRemove(event: MouseEvent, item: any) {
  console.log(modelValue)
  console.log('removed chip ', item)
  event.stopPropagation()
  emit(
    'update:modelValue',
    modelValue.filter((c) => c !== item)
  )
  emit('chipRemoved', item)
}
</script>
