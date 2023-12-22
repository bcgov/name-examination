<template>
  <div class="flex h-fit">
    <header class="text-3xl font-bold" :class="{ 'text-red-600': priority }">
      {{ nrNumber }}
    </header>

    <a
      v-if="showTransactionsLink"
      href="#"
      class="inline-flex items-center px-2 text-bcgov-blue5"
    >
      <ArrowTopRightOnSquareIcon class="h-6 w-6" />
    </a>
  </div>
</template>

<script setup lang="ts">
import { ArrowTopRightOnSquareIcon } from '@heroicons/vue/24/outline'
import { useExamineStore } from '~/store/examine'

defineProps<{
  nrNumber: string
  priority?: boolean
  showTransactionsLink?: boolean
}>()

const examine = useExamineStore()
</script>
