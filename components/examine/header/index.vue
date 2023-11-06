<template>
  <div
    class="flex space-x-2 divide-x-2 bg-gray-100 px-8 py-2"
    :class="
      examine.headerState === 'maximized' || examine.headerState === 'editable'
        ? 'h-full'
        : 'h-32'
    "
  >
    <ExamineHeaderStatus class="basis-1/5 px-4" />
    <ExamineHeaderDatesAndExpiry class="basis-1/5 px-4" />
    <ExamineHeaderAdditionalInfo class="basis-1/5" />
    <ExamineHeaderNatureOfBusiness class="basis-1/5 px-4" />
    <ExamineHeaderApplicantInfo class="basis-1/5 px-4" />
  </div>
</template>

<script setup lang="ts">
import { useExamineStore } from '~/store/examine'
const examine = useExamineStore()
</script>
