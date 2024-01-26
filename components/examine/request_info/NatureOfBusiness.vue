<template>
  <div class="text-sm">
    <ExamineRequestInfoExpandable title="Nature of Business">
      <p>{{ examine.natureOfBusiness }}</p>
      <div v-if="examine.prevNrRequired" class="flex items-center">
        <h2 class="font-bold">Previous NR:&nbsp;</h2>
        <span>{{ examine.previousNr }}</span>
      </div>

      <div v-if="examine.corpNumRequired" class="flex items-center">
        <h2 class="font-bold">Related Corp #:&nbsp;</h2>
        <span>{{ examine.corpNum }}</span>
      </div>
    </ExamineRequestInfoExpandable>
  </div>
</template>

<script setup lang="ts">
import { useExamineStore } from '~/store/examine.mock'
const examine = useExamineStore()
</script>
