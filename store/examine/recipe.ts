import type { ConflictList, ConflictListItem } from '~/types'
import { useConflicts } from './conflicts'
import { emitter } from '~/util/emitter'
import { isConflictListItem } from '~/util'

export const useExamineRecipe = defineStore('examine-recipe', () => {
  const conflicts = useConflicts()
  /** Index of currently selected tab. Updated by UI. */
  const selectedTabIndex = ref(0)
  /** The object which is currently being focused in the recipe area */
  const recipeFocus = ref<ConflictListItem | ConflictList>()
  /** Object that was being focused before focus was lost */
  const savedRecipeFocus = ref<ConflictListItem | ConflictList>()

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

  const allConflictLists = computed<Array<ConflictList>>(() =>
    [
      conflicts.synonymMatches,
      conflicts.cobrsPhoneticMatches,
      conflicts.phoneticMatches,
    ].flat()
  )

  const firstConflictItemIndex = computed(() => {
    for (const [i, obj] of allConflictObjects.value.entries()) {
      if (isConflictListItem(obj)) {
        return i
      }
    }
    return 0
  })

  function onRecipeFocusIn(_e: FocusEvent) {
    if (savedRecipeFocus.value && !recipeFocus.value) {
      recipeFocus.value = savedRecipeFocus.value
      savedRecipeFocus.value = undefined
    } else {
      recipeFocus.value = allConflictObjects.value[firstConflictItemIndex.value]
    }
  }

  function onRecipeFocusOut(_e: FocusEvent) {
    savedRecipeFocus.value = recipeFocus.value
    recipeFocus.value = undefined
  }

  function handleRecipeKeyPress(event: KeyboardEvent) {
    let delta = 0
    if (event.code === 'ArrowDown') {
      delta = 1
    } else if (event.code === 'ArrowUp') {
      delta = -1
    } else if (event.code === 'ArrowRight') {
      if (recipeFocus.value)
        emitter.emit('expandRecipeObject', recipeFocus.value)
      return
    } else if (event.code === 'ArrowLeft') {
      if (recipeFocus.value) {
        emitter.emit('collapseRecipeObject', recipeFocus.value)
      }
      return
    } else if (
      event.code === 'Space' &&
      recipeFocus.value &&
      isConflictListItem(recipeFocus.value)
    ) {
      conflicts.toggleConflict(recipeFocus.value)
      event.preventDefault()
      return
    } else {
      return
    }
    if (recipeFocus.value && isConflictListItem(recipeFocus.value)) {
      emitter.emit('collapseRecipeObject', recipeFocus.value)
    }

    let newIndex = firstConflictItemIndex.value
    if (recipeFocus.value) {
      const index = allConflictObjects.value.indexOf(recipeFocus.value)
      newIndex = Math.max(0, (index + delta) % allConflictObjects.value.length)
    }
    recipeFocus.value = allConflictObjects.value[newIndex]
    if (!isConflictListItem(recipeFocus.value)) {
      emitter.emit('collapseAllConflictLists')
    }

    event.preventDefault()
  }

  return {
    selectedTabIndex,
    recipeFocus,
    savedRecipeFocus,
    onRecipeFocusIn,
    onRecipeFocusOut,
    handleRecipeKeyPress,
  }
})
