<template>
  <div
    class="flex divide-x-2 bg-gray-100 px-4 py-2"
    :class="isExpanded ? 'h-full' : 'h-32'"
  >
    <ExamineRequestInfoStatus class="w-1/5 px-4" />
    <ExamineRequestInfoDatesAndExpiry class="w-1/5 px-4" />
    <ExamineRequestInfoAdditionalInfo class="w-1/5 px-4" />
    <ExamineRequestInfoNatureOfBusiness class="w-1/5 px-4" />
    <ExamineRequestInfoApplicant class="w-1/5 px-4" />
  </div>
</template>

<script setup lang="ts">
import { useExamineStore } from '~/store/examine'
const examine = useExamineStore()

const isExpanded = computed(() => examine.is_editing || examine.is_header_shown)
</script>
