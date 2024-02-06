<template>
  <div class="flex flex-col space-y-2 overflow-auto p-2">
    <ExamineRecipeCompareItem
      v-for="conflict in comparedConflictsData"
      :conflict="conflict"
    />

    <p v-if="conflicts.comparedConflicts.length === 0">
      No conflicts have been added for comparison.
    </p>
  </div>
</template>

<script setup lang="ts">
import { useExamineStore } from '~/store/examine'
import { useConflicts } from '~/store/examine/conflicts'
import type { Conflict } from '~/types'
const examine = useExamineStore()
const conflicts = useConflicts()

const comparedConflictsData = ref<Array<Conflict>>([])

watch(
  () => [conflicts.comparedConflicts],
  async (_state) => {
    comparedConflictsData.value = []
    for (const conflict of conflicts.comparedConflicts) {
      const data = (await examine.getConflictData(conflict)) as Conflict
      comparedConflictsData.value.push(data)
    }
  },
  { deep: true }
)
</script>
