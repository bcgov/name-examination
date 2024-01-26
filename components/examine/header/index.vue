<template>
  <div class="flex flex-wrap px-4 py-2 text-gray-700">
    <ExamineHeaderNRNumber
      :nr-number="examine.nrNumber"
      :priority="examine.priority === 'Y'"
      show-transactions-link
    />

    <ExamineHeaderRequestTypeInfo
      v-if="!examine.is_editing || examine.isClosed"
      :jurisdiction="examine.jurisdiction"
      :jurisdiction-number="examine.jurisdictionNumber"
    />
    <ExamineHeaderRequestEditInputs v-else class="flex basis-5/12 flex-col" />

    <ExamineHeaderActionButtons class="ml-auto" />
  </div>
</template>

<script setup lang="ts">
import { useExamineStore } from '~/store/examine.mock'
const examine = useExamineStore()
</script>
