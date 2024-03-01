<template>
  <div class="flex flex-wrap items-center gap-1">
    <div
      v-for="item in modelValue"
      :key="getKey ? getKey(item) : undefined"
      class="flex h-fit w-fit flex-nowrap items-center space-x-1 rounded-md border border-gray-400 bg-sky-100 p-0.5 px-1 text-sm"
    >
      <span>{{ display ? display(item) : item }}</span>
      <button
        @click="(event) => onChipRemove(event, modelValue, item)"
        class="rounded hover:bg-sky-200"
      >
        <XMarkIcon class="h-4 w-4" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { XMarkIcon } from '@heroicons/vue/24/outline'

defineProps<{
  modelValue: Array<any>
  display?: (input: any) => string
  getKey?: (input: any) => string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', newValue: any): void
  (e: 'chipRemoved', item: any): void
}>()

// NOTE: The `modelValue` variable from the `defineProps` call above doesn't update properly for some reason.
// The workaround is to pass the modelValue as a parameter when calling this function from the template.
function onChipRemove(event: MouseEvent, items: Array<any>, item: any) {
  event.stopPropagation()
  emit(
    'update:modelValue',
    items.filter((c) => c !== item)
  )
  emit('chipRemoved', item)
}
</script>
