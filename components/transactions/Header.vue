<template>
  <div class="flex items-center divide-x-2">
    <NRNumber
      :nr-number="nrData.nrNum"
      :priority="isPriority"
      class="px-2 text-xl"
    />
    <PriorityLabel v-if="isPriority" class="px-2"/>
    
  </div>
</template>

<script setup lang="ts">
import type { NameRequest } from '~/types'

const props = defineProps<{
  nrData: NameRequest
}>()

const isPriority = computed(() => props.nrData.priorityCd === 'Y')
</script>
