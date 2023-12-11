<template>
  <Accordion
    :key="conflictItem.nrNumber"
    class="conflict-details rounded-md p-1 open:!bg-sky-100 hover:bg-gray-100"
    @toggled="onAccordionToggle"
  >
    <template #title>
      <div class="flex w-full items-center gap-x-2">
        <input
          type="checkbox"
          :disabled="examine.decisionFunctionalityDisabled"
          class="h-4 w-4"
          :checked="isChecked"
          @change.prevent.stop="examine.toggleConflictCheckbox(conflictItem)"
        />
        <span class="grow" v-html="conflictItem.highlightedText"></span>
        <div class="space-x-8">
          <span>{{ conflictItem.nrNumber }}</span>
          <span>
            {{ examine.getShortJurisdiction(conflictItem.jurisdiction) }}
          </span>
          <span>{{ getFormattedDateFromString(conflictItem.startDate) }}</span>
        </div>
      </div>
    </template>
    <template #content>
      <div class="flex justify-center">
        <ExamineRecipeMatch
          v-if="conflictData"
          :conflict="conflictData"
          class="grow"
        />
        <LoadingSpinner v-else />
      </div>
    </template>
  </Accordion>
</template>

<script setup lang="ts">
import { useExamineStore } from '~/store/examine'
import type { Conflict, ConflictListItem } from '~/types'
import { getFormattedDateFromString } from '~/util/date'

const examine = useExamineStore()

const { conflictItem } = defineProps<{
  conflictItem: ConflictListItem
}>()

const isChecked = computed(() => {
  const conflictsList = examine.conflictsAutoAdd
    ? examine.selectedConflicts
    : examine.comparedConflicts
  return conflictsList.map((c) => c.nrNumber).includes(conflictItem.nrNumber)
})

const conflictData = computed<Conflict | undefined>(() =>
  conflictItem.source === 'CORP'
    ? examine.corpConflictJSON
    : conflictItem.source === 'NR'
    ? examine.namesConflictJSON
    : undefined
)

function onAccordionToggle(isOpen: boolean) {
  if (isOpen) examine.getConflictInfo(conflictItem)
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
