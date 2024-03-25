<template>
  <div
    id="conflicts-tab"
    class="h-full w-full outline-none"
    tabindex="0"
    @keydown="recipe.handleKeyDown"
    @focus="recipe.focusArea"
    @focusout="recipe.unfocusArea"
  >
    <div
      v-if="conflicts.loading"
      class="flex h-full items-center justify-center"
    >
      <LoadingSpinner />
    </div>
    <div v-else class="flex w-full flex-col space-y-2 rounded bg-white p-2">
      <Accordion open arrow button-style="bg-gray-200 p-2 hover:bg-gray-300">
        <template #title>Exact match</template>
        <template #content>
          <ExamineRecipeConflictsList
            v-if="conflicts.exactMatches.length > 0"
            :conflict-items="conflicts.exactMatches"
          />
          <span v-else class="p-1">No exact match</span>
        </template>
      </Accordion>

      <Accordion open arrow button-style="bg-gray-200 p-2 hover:bg-gray-300">
        <template #title>Exact Word Order + Synonym Match</template>
        <template #content>
          <ExamineRecipeConflictsBucket
            v-if="conflicts.synonymMatches.length > 0"
            :conflict-lists="conflicts.synonymMatches"
          />
          <span v-else class="p-1">No results</span>
        </template>
      </Accordion>

      <Accordion open arrow button-style="bg-gray-200 p-2 hover:bg-gray-300">
        <template #title>Character Swap Match</template>

        <template #content>
          <ExamineRecipeConflictsBucket
            v-if="conflicts.cobrsPhoneticMatches.length > 0"
            :conflict-lists="conflicts.cobrsPhoneticMatches"
          />
          <span v-else class="p-1">No results</span>
        </template>
      </Accordion>

      <Accordion open arrow button-style="bg-gray-200 p-2 hover:bg-gray-300">
        <template #title>Phonetic Match (experimental)</template>

        <template #content>
          <ExamineRecipeConflictsBucket
            v-if="conflicts.phoneticMatches.length > 0"
            :conflict-lists="conflicts.phoneticMatches"
          />
          <span v-else class="p-1">No results</span>
        </template>
      </Accordion>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useConflicts } from '~/store/examine/conflicts'
import { useExaminationRecipe } from '~/store/examine/recipe'
import { useExaminationTabCyle } from '~/store/examine/tab-cycle'

const conflicts = useConflicts()
const recipe = useExaminationRecipe()

onMounted(() => {
  useExaminationTabCyle().register(2, 'conflicts-tab')
})
</script>
