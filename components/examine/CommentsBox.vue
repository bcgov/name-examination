/* eslint-disable vue/no-v-html */
<template>
  <div class="flex flex-col space-y-2 overflow-auto">
    <div
      class="comments-box-child flex flex-col rounded border border-gray-400 bg-white p-2 text-sm"
      v-for="comment in comments"
    >
      <p v-html="comment.html" />
      <span class="font-bold">
        {{ comment.examiner }}
      </span>
      <span class="italic">
        {{ getFormattedDateWithTime(comment.timestamp) }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Comment } from '~/types'
import { getFormattedDateWithTime } from '~/util/date'
defineProps<{
  comments: Array<Comment>
}>()
</script>
