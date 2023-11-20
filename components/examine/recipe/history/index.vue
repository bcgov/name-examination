<template>
  <ExamineRecipeTable
    class="h-full w-full"
    :columns="['Name', 'Jurisdiction', 'NR', 'Submitted', 'Status']"
    :rows="rows"
  >
    <template v-slot="{ index, row }">
      <ExamineRecipeHistoryInfo
        :conflict="examine.conflicts[1] as NameRequestConflict"
      />
    </template>
  </ExamineRecipeTable>
</template>

<script setup lang="ts">
import { useExamineStore } from '~/store/examine'
import type { NameRequestConflict } from '~/types'

const examine = useExamineStore()

const rows = computed(() => [
  ['NOT SO STEEP COOPERATIVE', 'BC', 'NR 5979354', '2008-09-16', 'R'],
  ['NOT SO STEEP COOPERATIVE', 'BC', 'NR 3252689', '2008-09-12', 'A'],
])
</script>
