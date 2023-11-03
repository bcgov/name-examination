<template>
  <div class="flex flex-col space-y-2 overflow-auto">
    <div
      class="flex flex-col rounded-md border border-gray-400 bg-white p-2 text-sm"
      v-for="comment in examine.comments"
    >
      <p>{{ comment.content }}</p>
      <span class="italic">
        {{ comment.author }} &ndash; {{ comment.date }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useExamineStore } from '~/store/examine'
const examine = useExamineStore()
</script>
