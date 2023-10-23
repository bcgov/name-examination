<template>
  <div class="text-sm">
    <ExamineHeaderPopover
      title="Nature of Business"
      v-if="examine.headerState === 'minimized'"
    >
      <template #minimized>
        <p>
          Here's our nature of business. This one is made long so we can see
          what it looks like when nature of business is long. So here's some
          more text. And some more.
        </p>
      </template>

      <template #expanded>
        <p>
          Here's our nature of business. This one is made long so we can see
          what it looks like when nature of business is long. So here's some
          more text. And some more.
        </p>
      </template>
    </ExamineHeaderPopover>
    <div v-else>
      <span class="font-bold">Nature of Business</span>
      <p>
        Here's our nature of business. This one is made long so we can see what
        it looks like when nature of business is long. So here's some more text.
        And some more.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useExamineStore } from '~/store/examine'
const examine = useExamineStore()
</script>
