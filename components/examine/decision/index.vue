<template>
  <div v-if="examine.is_making_decision" class="flex flex-col justify-between">
    <div class="flex flex-col space-y-2">
      <ExamineDecisionHeader />

      <ExamineDecisionConditions :conditions="examine.parseConditions" />

      <div class="!mt-4 flex space-x-2">
        <ExamineDecisionSelections />
        <ExamineDecisionRequestorMessage />
      </div>
    </div>

    <ExamineDecisionButtons />
  </div>
</template>

<script setup lang="ts">
import { useExamineStore } from '~/store/examine'
const examine = useExamineStore()
</script>
