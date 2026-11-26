<template>
  <div
    :id="recipe.CONFLICTS_AREA_ID"
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
      <div v-if="conflicts.search.type" data-testid="search-summary">
        <p>Search type: <span class="font-bold">{{ conflicts.search.type }}</span></p>
        <p>Search term: <span class="font-bold">"{{ conflicts.search.term }}"</span></p>
        <template v-if="conflicts.search.distinctive">
          <p>Distinctive: <span class="font-bold">"{{ conflicts.search.distinctive }}"</span></p>
          <p>Descriptive: <span class="font-bold">"{{ conflicts.search.descriptive }}"</span></p>
        </template>
      </div>
      <ExamineRecipeConflictsBucket
        title="Exact Match"
        :conflict-items="conflicts.exactMatches"
      />

      <ExamineRecipeConflictsBucket
        title="Exact Word Order + Synonym Match"
        :conflict-lists="conflicts.synonymMatches"
      />

      <ExamineRecipeConflictsBucket
        title="Character Swap Match"
        :conflict-lists="conflicts.cobrsPhoneticMatches"
      />

      <ExamineRecipeConflictsBucket
        title="Phonetic Match (experimental)"
        :conflict-lists="conflicts.phoneticMatches"
      />

    </div>
  </div>
</template>

<script setup lang="ts">
/** Conflicts tab in the recipe area */
import { useConflicts } from '~/store/examine/conflicts'
import { useExaminationRecipe } from '~/store/examine/recipe'
import { useExaminationTabCyle } from '~/store/examine/tab-cycle'

const conflicts = useConflicts()
const recipe = useExaminationRecipe()

onMounted(() => {
  useExaminationTabCyle().register(2, 'conflicts-tab')
})
</script>
