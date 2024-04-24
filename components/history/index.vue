<template>
  <div class="flex h-screen items-center justify-center">
    <div class="flex h-full w-2/3 flex-col border-x-2 border-neutral-300">
      <HistoryHeader :nr="nr" :include-recipient="includeRecipient" />
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
/** Component for showing a list of history entries of any type, e.g. transactions or notifications. */
import type { NameRequest } from '~/types'

defineProps<{
  nr: NameRequest
  /** Show the `recipient` field in the header. */
  includeRecipient?: boolean
}>()
</script>
