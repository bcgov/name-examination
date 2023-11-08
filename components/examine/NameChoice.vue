<template>
  <div class="flex flex-col">
    <div class="flex items-center">
      <span
        class="mr-2 flex flex-col"
        :class="{
          'font-bold': current,
          'text-cyan-500': state === 'APPROVED' || state === 'CONDITION',
        }"
      >
        {{ name }}
      </span>

      <XMarkIcon v-if="state === 'REJECTED'" class="h-5 w-5 text-red-600" />
      <CheckIcon
        v-else-if="state === 'APPROVED' || state === 'CONDITION'"
        class="h-5 w-5 text-lime-600"
      />

      <IconButton
        v-if="undoable"
        white
        text="Undo Decision"
        class="border-none text-sm text-blue-800"
      />
    </div>

    <span v-if="state === 'CONDITION'" class="max-w-12 text-sm text-cyan-500">{{
      message
    }}</span>
  </div>
</template>

<script setup lang="ts">
import { CheckIcon, XMarkIcon } from '@heroicons/vue/24/outline'

defineProps<{
  name: string
  state?: string
  undoable?: boolean
  current?: boolean
  message?: string
}>()
</script>
