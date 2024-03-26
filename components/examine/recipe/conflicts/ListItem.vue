<template>
  <Accordion
    :key="conflictItem.nrNumber"
    ref="accordion"
    class="rounded p-1 transition-all open:!bg-sky-100 hover:bg-gray-100"
    :open="conflictItem.ui.open"
    :class="{ '!bg-sky-100': conflictItem.ui.focused }"
    @summary-clicked="recipe.toggleObject(conflictItem)"
    disable-default-open-behaviour
  >
    <template #title>
      <div class="flex w-full items-center gap-x-2">
        <input
          type="checkbox"
          :disabled="examine.conflictSelectionDisabled"
          class="max-h-4 min-h-4 min-w-4 max-w-4"
          :checked="conflicts.isConflictSelected(conflictItem)"
          @change="conflicts.toggleConflict(conflictItem)"
          tabindex="-1"
          aria-label="Select conflict checkbox"
        />
        <span
          class="grow truncate"
          v-html="conflictItem.highlightedText"
        ></span>
        <div class="flex w-52 gap-4">
          <span class="w-24">{{ conflictItem.nrNumber }}</span>
          <span class="w-4">
            {{
              conflictItem.jurisdiction
                ? examine.getShortJurisdiction(conflictItem.jurisdiction) || '?'
                : '?'
            }}
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
import type Accordion from '~/components/Accordion.vue'
import { useExamination } from '~/store/examine'
import { useConflicts } from '~/store/examine/conflicts'
import { useExaminationRecipe } from '~/store/examine/recipe'
import type { ConflictListItem } from '~/types'
import { getFormattedDate } from '~/util/date'
import { emitter } from '~/util/emitter'

const examine = useExamination()
const recipe = useExaminationRecipe()
const conflicts = useConflicts()

const accordion = ref<InstanceType<typeof Accordion>>()

const props = defineProps<{
  conflictItem: ConflictListItem
}>()

emitter.on('scrollToConflictObject', (obj) => {
  if (obj === props.conflictItem) {
    accordion.value?.$el.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    })
  }
})
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
