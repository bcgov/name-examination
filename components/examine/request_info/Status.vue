<template>
  <div class="flex flex-col justify-start text-sm space-y-1">
    <div v-if="isPriority" class="flex items-center font-bold text-red-600">
      <StarIcon class="h-4 w-4" />
      <p>Priority</p>
    </div>

    <div><b>Status: </b> INPROGRESS</div>

    <div><b>Examiner: </b> anonymous@idir</div>

    <ExamineRequestInfoCommentsPopup />
  </div>
</template>

<script setup lang="ts">
import { StarIcon } from '@heroicons/vue/24/solid'

const isPriority = ref(true)
</script>
