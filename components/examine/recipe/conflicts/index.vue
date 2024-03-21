<template>
  <div
    id="conflicts-tab"
    class="h-full w-full outline-none"
    tabindex="0"
    @keydown="recipe.handleKeyEvent"
    @focus="recipe.focus"
    @focusout="recipe.unfocus"
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
            @selected="(item) => (recipe.focused = item)"
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
            :initially-open="getFirstOpenListIndex(0)"
            @selected="(obj) => (recipe.focused = obj)"
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
            :initially-open="getFirstOpenListIndex(1)"
            @selected="(obj) => (recipe.focused = obj)"
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
            :initially-open="getFirstOpenListIndex(2)"
            @selected="(obj) => (recipe.focused = obj)"
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
import { useExaminationTabCyle } from '~/store/examine/tab-cycle';

const conflicts = useConflicts()
const recipe = useExaminationRecipe()

/** Array of buckets that are not the exact matches bucket */
const buckets = computed(() => [
  conflicts.synonymMatches,
  conflicts.cobrsPhoneticMatches,
  conflicts.phoneticMatches,
])

/** Returns the index of the conflict list that should be open in the corresponding bucket, or undefined if no lists should be open. */
function getFirstOpenListIndex(bucketIndex: number) {
  if (!firstNonEmptyConflictList.value) return undefined
  const [containingBucket, firstNonEmptyIndex] = firstNonEmptyConflictList.value
  return containingBucket === bucketIndex ? firstNonEmptyIndex : undefined
}

/** Returns the index of the first non-empty conflict list across all buckets, and the index of the bucket that contains the list. */
const firstNonEmptyConflictList = computed<[number, number] | undefined>(() => {
  for (const [i, bucket] of buckets.value.entries()) {
    const firstNonEmptyIndex = bucket.findIndex((cl) => cl.children.length > 0)
    if (firstNonEmptyIndex !== -1) {
      return [i, firstNonEmptyIndex]
    }
  }
})

onMounted(() => {
  useExaminationTabCyle().register(2, 'conflicts-tab')
})
</script>
