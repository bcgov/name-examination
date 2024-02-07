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
          @change="e => toggleConflictCheckbox((e.target as HTMLInputElement).checked)"
        />
        <span class="grow" v-html="conflictItem.highlightedText"></span>
        <div class="space-x-8">
          <span>{{ conflictItem.nrNumber }}</span>
          <span>
            {{ examine.getShortJurisdiction(conflictItem.jurisdiction) }}
          </span>
          <span>{{ getFormattedDate(conflictItem.startDate) }}</span>
        </div>
      </div>
    </template>
    <template #content>
      <div class="flex justify-center">
        <LoadingSpinner v-if="isLoading" />
        <ExamineRecipeMatch
          v-else-if="conflictData"
          :conflict="conflictData"
          class="grow"
        />
      </div>
    </template>
  </Accordion>
</template>

<script setup lang="ts">
import { useExamination } from '~/store/examine'
import { useConflicts } from '~/store/examine/conflicts'
import type { Conflict, ConflictListItem } from '~/types'
import { getFormattedDate } from '~/util/date'

const examine = useExamination()
const conflicts = useConflicts()

const isLoading = ref(false)

const { conflictItem } = defineProps<{
  conflictItem: ConflictListItem
}>()

const isChecked = computed(() => {
  const conflictsList = conflicts.autoAdd
    ? conflicts.selectedConflicts
    : conflicts.comparedConflicts
  return conflictsList.map((c) => c.nrNumber).includes(conflictItem.nrNumber)
})

const conflictData = computed<Conflict | undefined>(() =>
  conflictItem.source === 'CORP'
    ? examine.corpConflictJSON
    : conflictItem.source === 'NR'
    ? examine.namesConflictJSON
    : undefined
)

async function onAccordionToggle(isOpen: boolean) {
  if (isOpen) {
    isLoading.value = true
    await examine.updateConflictInfo(conflictItem)
    isLoading.value = false
  }
}

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
