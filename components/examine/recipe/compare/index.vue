<template>
  <div class="flex flex-col space-y-2 overflow-auto p-2">
    <ExamineRecipeCompareItem
      v-for="conflict in examine.comparedConflicts"
      :conflict="conflict"
    />

    <p v-if="examine.comparedConflicts.length === 0">
      No conflicts have been added for comparison.
    </p>
  </div>
</template>

<script setup lang="ts">
import { useExamineStore } from '~/store/examine'
const examine = useExamineStore()
</script>
