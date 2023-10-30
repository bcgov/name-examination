<template>
  <div class="flex flex-wrap space-x-1 space-y-1">
    <div
      v-for="item in modelValue"
      class="flex w-fit items-center space-x-1 rounded-md border border-gray-700 bg-sky-100 p-0.5 px-1 text-sm"
    >
      <span>{{ item }}</span>
      <button
        @click="
          $emit(
            'update:modelValue',
            modelValue.filter((c) => c !== item)
          )
        "
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
}>()
</script>
