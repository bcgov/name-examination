<template>
  <div class="flex flex-col space-y-4 border-y px-8 py-4 text-sm">
    <div class="grid grid-cols-4 gap-y-1">
      <span class="font-bold">Notification Status</span>
      <span>{{ entry.status }}</span>

      <IconButton
        light
        class="col-span-2 row-span-2 h-[2.25rem] w-fit justify-self-end"
      >
        <PaperAirplaneIcon class="h-5 w-5" />
        <template #text>Resend Notification</template>
      </IconButton>

      <span class="font-bold">Sent Date</span>
      <span>{{ entry.sentDate }}</span>

      <span class="font-bold">Subject</span>
      <span class="col-span-3">{{ entry.subject }}</span>

      <span class="font-bold">Content</span>
      <span
        v-html="mdToHtml(entry.content)"
        class="col-span-3 line-clamp-[15] list-inside overflow-auto"
      ></span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PaperAirplaneIcon } from '@heroicons/vue/24/outline'
import type { Notification } from '~/types'
import { mdToHtml } from '~/util'

defineProps<{
  entry: Notification
}>()
</script>

<style>
h1 {
  font-weight: bold;
  font-size: 1rem;
}

ul,
ol {
  list-style: revert;
  padding-left: 1rem;
}

a {
  color: revert;
}

hr {
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
}
</style>
