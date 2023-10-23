<template>
  <div class="text-sm">
    <ExamineRequestInfoPopover
      title="Additional Info"
      v-if="!examine.showDetails"
    >
      <template #minimized>
        <p>
          Here's some additional info. This one is made long so we can see what
          it looks like when additional info is long. So here's some more text.
          And some more.
        </p>
      </template>

      <template #expanded>
        <p>
          Here's some additional info. This one is made long so we can see what
          it looks like when additional info is long. So here's some more text.
          And some more.
        </p>
      </template>
    </ExamineRequestInfoPopover>
    <div v-else>
      <span class="font-bold">Additional Info</span>
      <p>
        Here's some additional info. This one is made long so we can see what it
        looks like when additional info is long. So here's some more text. And
        some more.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useExamineStore } from '~/store/examine'
const examine = useExamineStore()
</script>
