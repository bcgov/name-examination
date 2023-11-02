<template>
  <div
    class="flex w-full space-x-1 px-4 py-1 text-sm border-2"
    :class="{
      'bg-red-200 border-red-600': type === 'warning',
      'bg-blue-200 border-blue-600': type === 'lock',
    }"
  >
    <ExclamationTriangleIcon v-if="type === 'warning'" class="h-5 w-5" />
    <LockClosedIcon v-if="type === 'lock'" class="h-5 w-5" />
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import {
  ExclamationTriangleIcon,
  LockClosedIcon,
} from '@heroicons/vue/24/outline'

defineProps<{
  type: 'warning' | 'lock'
}>()
</script>
