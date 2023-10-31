<template>
  <div
    class="flex flex-col"
    :class="{ 'bg-gray-100': examine.headerState === 'editable' }"
  >
    <ExamineRequestHeader />
    <ExamineHeader />

    <div class="flex justify-between p-4">
      <ExamineNameChoices />
      <ExamineQuickActionButtons v-if="examine.headerState !== 'editable'" />
    </div>

    <div
      v-if="examine.headerState !== 'editable'"
      class="flex grow flex-col space-x-3 bg-gray-100 p-4 xl:flex-row"
    >
      <ExamineRecipe class="basis-1/2" />
      <ExamineDecision v-if="examine.inProgress" class="basis-1/2" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useExamineStore } from '~/store/examine'
const examine = useExamineStore()
</script>
