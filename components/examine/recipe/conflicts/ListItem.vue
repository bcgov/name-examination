<template>
  <Accordion
    :key="conflict.nrNumber"
    class="conflict-details rounded-md p-1 open:!bg-sky-100 hover:bg-gray-100"
    @toggled="onAccordionToggle"
  >
    <template #title>
      <div class="flex w-full items-center gap-x-2">
        <input
          type="checkbox"
          :disabled="!examine.inProgress"
          :checked="examine.selectedConflicts.includes(conflict.text)"
          class="h-4 w-4"
          @change.prevent.stop="onItemCheckboxChange"
        />
        <HighlightedSubText
          class="grow"
          :text="conflict.text"
          :start="0"
          :end="1"
        />
        <div class="space-x-8">
          <span>{{ conflict.nrNumber }}</span>
          <span>{{ conflict.jurisdiction }}</span>
          <span>{{ getFormattedDateFromString(conflict.startDate) }}</span>
        </div>
      </div>
    </template>
    <template #content>
      <div class="flex justify-center">
        <ExamineRecipeMatch
          v-if="conflictJSON"
          :conflict="conflictJSON"
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

const { conflict } = defineProps<{
  conflict: ConflictListItem
}>()

const conflictJSON = computed<Conflict | undefined>(() =>
  conflict.source === 'CORP'
    ? examine.corpConflictJSON
    : conflict.source === 'NR'
    ? examine.namesConflictJSON
    : undefined
)

function onItemCheckboxChange(event: Event) {
  event.stopPropagation()
  const checked = (event.target as HTMLInputElement).checked
  if (checked && !examine.selectedConflicts.includes(conflict.text)) {
    examine.selectedConflicts.push(conflict.text)
  } else if (!checked) {
    examine.selectedConflicts = examine.selectedConflicts.filter(
      (c) => c !== conflict.text
    )
  }
}

function onAccordionToggle(isOpen: boolean) {
  if (isOpen) examine.getConflictInfo(conflict)
}
</script>
