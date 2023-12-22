<template>
  <div class="text-sm">
    <ExamineRequestInfoExpandable title="Applicant Information">
      <template #minimized>
        <p>Jack Frost</p>
        <p>3434 Main Street</p>
        <p>Suite 303</p>
      </template>

      <template #popup>
        <ExamineRequestInfoApplicantComplete />
      </template>

      <template #maximized>
        <ExamineRequestInfoApplicantComplete />
      </template>

      <template #editable>
        <ExamineRequestInfoApplicantEditable />
      </template>
    </ExamineRequestInfoExpandable>
  </div>
</template>

<script setup lang="ts">
import { useExamineStore } from '~/store/examine'
const examine = useExamineStore()
</script>
