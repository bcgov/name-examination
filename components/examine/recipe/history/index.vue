<template>
  <ExamineRecipeTable
    class="h-full w-full"
    :columns="['Name', 'Jurisdiction', 'NR', 'Submitted', 'Status']"
    :rows="rows"
    @row-click="onRowClick"
  >
    <template v-slot="{ index, row }">
      <ExamineRecipeHistoryInfo />
    </template>
  </ExamineRecipeTable>
</template>

<script setup lang="ts">
import { useExamineStore } from '~/store/examine'
import { getFormattedDateFromString } from '~/util/date'

const examine = useExamineStore()

const rows = computed(() =>
  examine.historiesJSON.names.map((entry) => [
    entry.name,
    entry.jurisdiction,
    entry.nr_num,
    getFormattedDateFromString(entry.start_date),
    entry.name_state_type_cd,
  ])
)

async function onRowClick(row: Array<string>) {
  const nrNumber = row[2]
  await examine.getHistoryInfo(nrNumber)
}
</script>
