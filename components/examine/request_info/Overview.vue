<template>
  <div class="flex flex-col text-sm">
    <div v-if="isPriority" class="flex items-center font-bold text-red-600">
      <StarIcon class="h-4 w-4" />
      <p>Priority</p>
    </div>

    <div>
      <b>Status: </b> INPROGRESS
    </div>

    <div>
      <b>Examiner: </b> anonymous@idir
    </div>

  </div>
</template>

<script setup lang="ts">
import { StarIcon } from '@heroicons/vue/24/solid'

const isPriority = ref(true)
</script>
