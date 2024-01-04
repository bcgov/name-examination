<template>
  <div class="text-sm">
    <ExamineRequestInfoExpandable title="Nature of Business">
      <template #minimized>
        <p>{{ examine.natureOfBusiness }}</p>
      </template>

      <template #popup>
        <p>{{ examine.natureOfBusiness }}</p>
      </template>

      <template #maximized>
        <p>{{ examine.natureOfBusiness }}</p>
      </template>

      <template #editable>
        <p>{{ examine.natureOfBusiness }}</p>
      </template>
    </ExamineRequestInfoExpandable>
  </div>
</template>

<script setup lang="ts">
import { useExamineStore } from '~/store/examine'
const examine = useExamineStore()
</script>
