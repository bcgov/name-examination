<template>
  <div
    class="flex w-full space-x-1 border-2 px-4 py-1.5 text-sm"
    :class="{
      'border-red-600 bg-red-200': type === 'warning',
      'border-bcgov-gold5 bg-yellow-200': type === 'lock',
    }"
  >
    <ExclamationTriangleIcon v-if="type === 'warning'" class="h-5 w-5 stroke-2" />
    <LockClosedIcon v-if="type === 'lock'" class="h-5 w-5 stroke-2" />
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
