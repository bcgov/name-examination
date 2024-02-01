<template>
  <PopupDialog panel-style="border-red-600 border-2">
    <template #title>
      <span v-if="error" class="inline-flex items-center text-red-600">
        <ExclamationTriangleIcon class="mr-2 h-7 w-7 stroke-2" />
        {{ error.title }}
      </span>
    </template>
    <div v-if="error" class="flex flex-col space-y-2 rounded-md">
      <span>{{ error.message }}</span>
      <IconButton white @click="$emit('close')">Close</IconButton>
    </div>
  </PopupDialog>
</template>

<script setup lang="ts">
import { ExclamationTriangleIcon } from '@heroicons/vue/24/outline'
import type { AppError } from '~/types/errors'

defineProps<{
  error?: AppError
}>()

const emit = defineEmits<{
  close: []
}>()
</script>
