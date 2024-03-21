import type { ConflictList, ConflictListItem } from '~/types'
import { useConflicts } from './conflicts'
import { emitter } from '~/util/emitter'
import { clamp, isConflictList, isConflictListItem } from '~/util'

export const useExaminationRecipe = defineStore('examine-recipe', () => {
  const conflicts = useConflicts()

  /** Index of currently selected tab in the recipe area. */
  const currentRecipeTabIndex = ref(0)

  /** The object which is currently being focused in the recipe area */
  const focused = ref<ConflictListItem | ConflictList>()

  /** Whether the focused object is currently expanded. */
  const focusedExpanded = ref(false)

  /** Object that was being focused before focus was lost */
  const savedFocus = ref<ConflictListItem | ConflictList>()

  /** Return all non-empty `ConflictList`s and `ConflictListItem`s in one flattened list, in order. */
  const allObjects = computed<Array<ConflictListItem | ConflictList>>(() => {
    /** Return a single array of all non-empty conflict lists and their children in order. */
    const flattenNonEmptyLists = (bucket: Array<ConflictList>) => {
      return bucket
        .filter((b) => b.children.length > 0)
        .flatMap((list) => [list, ...list.children])
    }
    return [
      ...conflicts.exactMatches,
      ...flattenNonEmptyLists(conflicts.synonymMatches),
      ...flattenNonEmptyLists(conflicts.cobrsPhoneticMatches),
      ...flattenNonEmptyLists(conflicts.phoneticMatches),
    ]
  })

  const nonEmptyConflictLists = computed<Array<ConflictList>>(
    () =>
      allObjects.value.filter((obj) =>
        isConflictList(obj)
      ) as Array<ConflictList>
  )

  /** Initialize focus for the entire recipe area */
  function focus() {
    if (savedFocus.value && !focused.value) {
      focused.value = savedFocus.value
      savedFocus.value = undefined
    } else {
      focused.value = conflicts.firstConflictItem
    }
  }

  /** Unfocus the entire recipe area */
  function unfocus() {
    savedFocus.value = focused.value
    focused.value = undefined
  }

  /** Expand the currently focused object. */
  function expandFocused() {
    if (focused.value) {
      emitter.emit('expandRecipeObject', focused.value)
      focusedExpanded.value = true
    }
  }

  /** Collapse the currently focused object. */
  function collapseFocused() {
    if (focused.value) {
      emitter.emit('collapseRecipeObject', focused.value)
      focusedExpanded.value = false
    }
  }

  /** If the current focused object is a `ConflictListItem`, collapse it. */
  function collapseFocusedIfConflictItem() {
    if (focused.value && isConflictListItem(focused.value)) {
      collapseFocused()
    }
  }

  /** Selects the currently focused object if it's a `ConflictListItem`. Otherwise, does nothing. */
  function selectFocusedConflict() {
    if (focused.value && isConflictListItem(focused.value)) {
      conflicts.toggleConflict(focused.value)
    }
  }

  /** Get the next/previous non-empty `ConflictList` (depending on `delta`) relative
   * to the given non-empty `ConflictList`. */
  function getRelativeConflictList(list: ConflictList, delta: number) {
    const currentIndex = nonEmptyConflictLists.value.indexOf(list)
    const maxIndex = nonEmptyConflictLists.value.length - 1
    const newindex = clamp(currentIndex + delta, 0, maxIndex)
    return nonEmptyConflictLists.value[newindex]
  }

  /** Focus a new object relative to the currently focused element.
   * If no object is currently focused, a default item will be selected. */
  function focusRelative(delta: number) {
    collapseFocusedIfConflictItem()
    if (!focused.value) {
      focused.value = conflicts.firstConflictItem
      return
    }
    if (isConflictList(focused.value) && !focusedExpanded.value) {
      focused.value = getRelativeConflictList(focused.value, delta)
    } else {
      const currIndex = allObjects.value.indexOf(focused.value)
      const maxIndex = allObjects.value.length - 1
      const newIndex = clamp(currIndex + delta, 0, maxIndex)
      focused.value = allObjects.value[newIndex]
      if (isConflictList(focused.value)) {
        collapseFocused()
      }
    }
  }

  /** Handle a keydown keyboard event in the recipe area. */
  function handleKeyDown(event: KeyboardEvent) {
    switch (event.code) {
      case 'ArrowDown':
        focusRelative(1)
        break
      case 'ArrowUp':
        focusRelative(-1)
        break
      case 'ArrowRight':
        expandFocused()
        break
      case 'ArrowLeft':
        collapseFocused()
        break
      case 'Space':
        selectFocusedConflict()
        break
    }
    event.preventDefault()
  }

  emitter.on('recipeTabChanged', (newIndex) => {
    currentRecipeTabIndex.value = newIndex
  })

  return {
    currentRecipeTabIndex,
    focused,
    focus,
    unfocus,
    handleKeyDown,
  }
})
