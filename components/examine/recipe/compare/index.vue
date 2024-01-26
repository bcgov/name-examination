<template>
  <div class="flex flex-col space-y-2 overflow-auto p-2">
    <ExamineRecipeCompareItem
      v-for="conflict in examine.comparedConflicts"
      :conflict="(examine.getConflictData(conflict) as Conflict)"
    />

    <p v-if="examine.comparedConflicts.length === 0">
      No conflicts have been added for comparison.
    </p>
  </div>
</template>

<script setup lang="ts">
import { useExamineStore } from '~/store/examine.mock'
import type { Conflict } from '~/types'
const examine = useExamineStore()
</script>
