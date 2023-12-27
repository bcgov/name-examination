<template>
  <div class="space-y-1 py-1 text-sm">
    <div
      v-if="examine.isPriority"
      class="flex items-center font-bold text-red-600"
    >
      <StarIcon class="h-4 w-4" />
      <p>Priority</p>
    </div>

    <div><b>Status: </b> {{ examine.nr_status }}</div>

    <div><b>Examiner: </b> {{ examine.examiner }}</div>

    <ExamineRequestInfoCommentsPopup />
  </div>
</template>

<script setup lang="ts">
import { StarIcon } from '@heroicons/vue/24/solid'
import { useExamineStore } from '~/store/examine'
const examine = useExamineStore()
</script>
