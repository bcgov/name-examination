<template>
  <Accordion
    :key="conflictItem.nrNumber"
    class="conflict-details rounded-md p-1 open:!bg-sky-100 hover:bg-gray-100"
  >
    <template #title>
      <div class="flex w-full items-center gap-x-2">
        <input
          type="checkbox"
          :disabled="examine.conflictSelectionDisabled"
          class="h-4 w-4"
          :checked="isChecked"
          @change="e => toggleConflictCheckbox((e.target as HTMLInputElement).checked)"
        />
        <span class="grow truncate" v-html="conflictItem.highlightedText"></span>
        <div class="flex w-52 gap-4">
          <span class="w-24">{{ conflictItem.nrNumber }}</span>
          <span class="w-4">
            {{ examine.getShortJurisdiction(conflictItem.jurisdiction) || '?' }}
          </span>
          <span class="w-24">
            {{ getFormattedDate(conflictItem.startDate) }}
          </span>
        </div>
      </div>
    </template>
    <template #content>
      <div class="flex justify-center">
        <ExamineRecipeMatch :conflict="conflictItem" class="grow" />
      </div>
    </template>
  </Accordion>
</template>

<script setup lang="ts">
import { useExamination } from '~/store/examine'
import { useConflicts } from '~/store/examine/conflicts'
import type { ConflictListItem } from '~/types'
import { getFormattedDate } from '~/util/date'

const examine = useExamination()
const conflicts = useConflicts()

const { conflictItem } = defineProps<{
  conflictItem: ConflictListItem
}>()

const isChecked = computed(() => {
  const conflictsList = conflicts.autoAdd
    ? conflicts.selectedConflicts
    : conflicts.comparedConflicts
  return conflictsList.map((c) => c.nrNumber).includes(conflictItem.nrNumber)
})

function toggleConflictCheckbox(checked: boolean) {
  if (checked) {
    conflicts.selectConflict(conflictItem)
  } else {
    conflicts.deselectConflict(conflictItem)
  }
}
</script>

<style>
.stem-highlight {
  color: #28a745;
  font-weight: bold;
}

.synonym-stem-highlight {
  color: #e0a800;
  font-weight: bold;
}
</style>
