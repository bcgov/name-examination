<template>
  <div class="flex flex-col space-y-2 overflow-auto">
    <div
      class="flex flex-col rounded-md border border-gray-400 bg-white p-2 text-sm"
      v-for="comment in comments"
    >
      <p>{{ comment.comment }}</p>
      <span class="italic">
        {{ comment.examiner }} &ndash; {{ comment.timestamp }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Comment } from '~/types'
defineProps<{
  comments: Array<Comment>
}>()
</script>
