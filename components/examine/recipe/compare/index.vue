<template>
  <div class="flex flex-col space-y-2 overflow-auto p-2">
    <ExamineRecipeCompareItem
      v-for="conflict in conflicts.comparedConflicts"
      :conflict="conflict"
    />

    <p v-if="conflicts.comparedConflicts.length === 0">
      No conflicts have been added for comparison.
    </p>
  </div>
</template>

<script setup lang="ts">
import { useConflicts } from '~/store/examine/conflicts'
const conflicts = useConflicts()
</script>
