<template>
  <div class="flex h-full flex-col overflow-y-auto">
    <div class="flex justify-between border-y-2 px-4 py-1">
      <span class="text-xl font-bold">{{ headerText }}</span>
    </div>

    <div v-if="loading" class="flex items-center justify-center">
      <LoadingSpinner />
    </div>

    <div
      v-else-if="entries.length === 0"
      class="flex items-center justify-center py-2"
    >
      <span class="text-xl font-bold">No notifications available</span>
    </div>

    <div v-else class="flex flex-col overflow-y-auto">
      <NotificationsListEntry
        v-for="(entry, i) in entries"
        :key="entry.status + entry.sentDate + entry.subject + i"
        :entry="entry"
        :class="{ 'bg-neutral-100': i % 2 == 0 }"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Notification } from '~/types'

defineProps<{
  entries: Array<Notification>
  loading?: boolean
}>()

const headerText = computed(() => 'Notification History')
</script>
