<template>
  <div class="flex flex-col space-y-2 overflow-auto p-2">
    <ExamineRecipeCompareItem
      v-for="conflict in examine.comparedConflicts"
      :conflict="conflict"
    />
  </div>
</template>

<script setup lang="ts">
import { useExamineStore } from '~/store/examine'
const examine = useExamineStore()
</script>
