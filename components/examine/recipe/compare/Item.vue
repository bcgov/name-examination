<template>
  <Accordion open arrow button-style="bg-gray-200 p-2 hover:bg-gray-300">
    <template #title>
      <div
        class="flex w-full items-center justify-between space-x-10 font-bold"
      >
        <span>{{ conflict.text }}</span>
        <div class="space-x-8">
          <span>{{ conflict.nrNumber }}</span>
          <span>{{ formatJurisdiction(conflict.jurisdiction) }}</span>
          <span>{{ getFormattedDate(conflict.startDate) }}</span>
        </div>
      </div>
    </template>
    <template #content>
      <ExamineRecipeMatch :conflict="conflict" class="px-2 [&_.comments-box-child]:bg-white" />
    </template>
  </Accordion>
</template>

<script setup lang="ts">
import type { Conflict } from '~/types'
import { getFormattedDate } from '~/util/date'

defineProps<{
  conflict: Conflict
}>()

const formatJurisdiction = (text: string) =>
  text.includes('-') ? text.split('-')[0].trim() : text
</script>
