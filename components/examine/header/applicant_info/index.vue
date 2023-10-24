<template>
  <div class="text-sm">
    <ExamineHeaderItem title="Applicant Information">
      <template #minimized>
        <p>Jack Frost</p>
        <p>3434 Main Street</p>
        <p>Suite 303</p>
      </template>

      <template #popup>
        <ExamineHeaderApplicantInfoComplete />
      </template>

      <template #maximized>
        <ExamineHeaderApplicantInfoComplete />
      </template>

      <template #editable>
        <ExamineHeaderApplicantInfoEditable />
      </template>
    </ExamineHeaderItem>
  </div>
</template>

<script setup lang="ts">
import { useExamineStore } from '~/store/examine'
const examine = useExamineStore()
</script>
