<template>
  <div
    class="flex divide-x-2 bg-gray-100 px-4 py-2"
    :class="examine.is_header_shown || examine.is_editing ? 'h-full' : 'h-32'"
  >
    <ExamineRequestInfoStatus class="basis-1/5 px-4" />
    <ExamineRequestInfoDatesAndExpiry class="basis-1/5 px-4" />
    <ExamineRequestInfoAdditionalInfo class="basis-1/5 px-4" />
    <ExamineRequestInfoNatureOfBusiness class="basis-1/5 px-4" />
    <ExamineRequestInfoApplicant class="basis-1/5 px-4" />
  </div>
</template>

<script setup lang="ts">
import { useExamineStore } from '~/store/examine'
const examine = useExamineStore()
</script>
