<template>
  <div
    id="conflicts-tab"
    class="h-full w-full outline-none"
    tabindex="0"
    @keydown="handleKeyPress"
    @focus="onFocusIn"
    @focusout="onFocusOut"
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
            :focused="focused"
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
            :focused="focused"
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
            :focused="focused"
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
            :focused="focused"
          />
          <span v-else class="p-1">No results</span>
        </template>
      </Accordion>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useConflicts } from '~/store/examine/conflicts'
import { useExaminationFocus } from '~/store/examine/focus'
import type { ConflictList, ConflictListItem } from '~/types'
const conflicts = useConflicts()

/** Array of buckets that are not the exact matches bucket */
const buckets = computed(() => [
  conflicts.synonymMatches,
  conflicts.cobrsPhoneticMatches,
  conflicts.phoneticMatches,
])

/** Return a single array of all non-empty conflict lists and their children in order. */
function flattenNonEmptyLists(bucket: Array<ConflictList>) {
  return bucket
    .filter((b) => b.children.length > 0)
    .flatMap((list) => [list, ...list.children])
}

const allConflictObjects = computed<Array<ConflictListItem | ConflictList>>(
  () => [
    ...conflicts.exactMatches,
    ...flattenNonEmptyLists(conflicts.synonymMatches),
    ...flattenNonEmptyLists(conflicts.cobrsPhoneticMatches),
    ...flattenNonEmptyLists(conflicts.phoneticMatches),
  ]
)

/** Object that was being focused before focus was lost */
const savedFocus = ref<ConflictListItem | ConflictList>()

const focused = ref<ConflictListItem | ConflictList>()

function handleKeyPress(event: KeyboardEvent) {
  let delta = 0
  if (event.code === 'ArrowDown') {
    delta = 1
  } else if (event.code === 'ArrowUp') {
    delta = -1
  } else {
    return
  }

  let newIndex = 0
  if (focused.value) {
    const index = allConflictObjects.value.indexOf(focused.value)
    newIndex = (index + delta) % allConflictObjects.value.length
  }
  focused.value = allConflictObjects.value[newIndex]

  event.preventDefault()
}

function onFocusIn(_e: FocusEvent) {
  if (savedFocus.value && !focused.value) {
    focused.value = savedFocus.value
    savedFocus.value = undefined
  } else {
    focused.value = allConflictObjects.value[0]
  }
}

function onFocusOut(_e: FocusEvent) {
  savedFocus.value = focused.value
  focused.value = undefined
}

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
  const focus = useExaminationFocus()
  focus.register(2, 'conflicts-tab')
})
</script>
