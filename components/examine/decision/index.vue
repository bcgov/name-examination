<template>
  <div class="flex flex-col justify-between">
    <div class="flex flex-col space-y-2">
      <ExamineDecisionHeader />

      <ExamineDecisionConditionsInfo :conditions="examine.parseConditions" />

      <div class="!mt-4 flex space-x-2">
        <!-- Layout the combo selects in reverse so they don't overlap each other https://stackoverflow.com/a/77210506 -->
        <div class="flex basis-1/2 flex-col-reverse gap-y-8">
          <ExamineDecisionSelectTrademarks />
          <ExamineDecisionSelectMacros />
          <ExamineDecisionSelectConflicts />
          <ExamineDecisionSelectConditions />
        </div>

        <ExamineDecisionRequestorMessage />
      </div>
    </div>

    <ExamineDecisionButtons />
  </div>
</template>

<script setup lang="ts">
import { useExamineStore } from '~/store/examine.mock'
const examine = useExamineStore()
</script>
