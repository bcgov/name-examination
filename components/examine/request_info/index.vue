<template>
  <div
    class="flex space-x-2 divide-x-2 bg-gray-100 px-8 py-2"
    :class="examine.showDetails ? 'h-[50vh]' : 'h-32'"
  >
    <ExamineRequestInfoStatus class="basis-1/5 px-4" />
    <ExamineRequestInfoDates class="basis-1/5 px-4" />
    <ExamineRequestInfoAdditionalInfo class="basis-1/5 px-4" />
    <ExamineRequestInfoNatureOfBusiness class="basis-1/5 px-4" />
    <ExamineRequestInfoApplicantInfo class="basis-1/5 px-4" />
  </div>
</template>

<script setup lang="ts">
import { useExamineStore } from '~/store/examine'
const examine = useExamineStore()
</script>
