<template>
  <ExamineRecipeTable
    class="h-full w-full"
    :columns="['Name', 'Jurisdiction', 'NR', 'Submitted', 'Status']"
    :rows="rows"
    @row-click="onRowClick"
  >
    <template v-slot="{ index, row }">
      <ExamineRecipeHistoryInfo :history-entry="examine.histories[index]" />
    </template>
  </ExamineRecipeTable>
</template>

<script setup lang="ts">
import { useExamination } from '~/store/examine'
import { getFormattedDate } from '~/util/date'

const examine = useExamination()

const rows = computed(
  () =>
    examine.histories.map((entry) => [
      entry.name,
      entry.jurisdiction,
      entry.nr_num,
      getFormattedDate(entry.start_date),
      entry.name_state_type_cd,
    ]) ?? []
)

async function onRowClick(row: Array<string>) {
  const nrNumber = row[2]
  await examine.getHistoryInfo(nrNumber)
}
</script>
