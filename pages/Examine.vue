<template>
  <div
    class="flex flex-col"
    :class="{ 'bg-gray-100': examine.headerState === 'editable' }"
  >
    <ExamineRequestHeader />
    <ExamineHeader />
    <ExamineNamesContainer />

    <div
      v-if="examine.headerState !== 'editable'"
      class="flex grow flex-col space-x-2 bg-gray-100 xl:flex-row"
    >
      <ExamineRecipe class="m-4 basis-1/2" />
      <ExamineDecision class="!m-4 basis-1/2" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useExamineStore } from '~/store/examine'
const examine = useExamineStore()
</script>
