import type { ConflictList, ConflictListItem } from '~/types'
import { useConflicts } from './conflicts'

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

  function onRecipeFocusIn(_e: FocusEvent) {
    if (savedRecipeFocus.value && !recipeFocus.value) {
      recipeFocus.value = savedRecipeFocus.value
      savedRecipeFocus.value = undefined
    } else {
      recipeFocus.value = allConflictObjects.value[0]
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
    } else if (
      event.code === 'Space' &&
      recipeFocus.value &&
      'nrNumber' in recipeFocus.value
    ) {
      conflicts.toggleConflict(recipeFocus.value)
      event.preventDefault()
      return
    } else {
      return
    }

    let newIndex = 0
    if (recipeFocus.value) {
      const index = allConflictObjects.value.indexOf(recipeFocus.value)
      newIndex = Math.max(0, (index + delta) % allConflictObjects.value.length)
    }
    recipeFocus.value = allConflictObjects.value[newIndex]

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
