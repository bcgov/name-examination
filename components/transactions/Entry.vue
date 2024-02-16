<template>
  <div class="grid grid-cols-4">
    <span class="font-bold">Date/Time</span>
  </div>
</template>

<script setup lang="ts">
import type { TransactionEntry } from '~/types'

defineProps<{
  entry: TransactionEntry
}>()
</script>
