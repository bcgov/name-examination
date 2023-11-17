<template>
  <Accordion open arrow button-style="bg-gray-200 p-2 hover:bg-gray-300">
    <template #title>
      <div
        class="flex w-full items-center justify-between space-x-10 font-bold"
      >
        <span>ADA SO LTD.</span>
        <div class="space-x-8">
          <span>0685772</span>
          <span>BC</span>
          <span>2004-01-22</span>
        </div>
      </div>
    </template>
    <template #content>
      <ExamineRecipeMatch :conflict="conflict" class="px-2" />
    </template>
  </Accordion>
</template>

<script setup lang="ts">
import type { Conflict } from '~/types'

defineProps<{
  conflict: Conflict
}>()
</script>
