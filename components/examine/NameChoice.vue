<template>
  <div class="flex items-center">
    <span class="mr-2" :class="{ 'font-bold': current }">{{ name }}</span>

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
</template>

<script setup lang="ts">
import { CheckIcon, XMarkIcon } from '@heroicons/vue/24/outline'

defineProps<{
  name: string
  state?: string
  undoable?: boolean
  current?: boolean
}>()
</script>
