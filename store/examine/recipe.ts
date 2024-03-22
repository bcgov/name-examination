import type { ConflictList, ConflictListItem } from '~/types'
import { useConflicts } from './conflicts'
import { emitter } from '~/util/emitter'
import { clamp, isConflictList, isConflictListItem } from '~/util'

export const useExaminationRecipe = defineStore('examine-recipe', () => {
  const CAPTURED_KEYS = [
    'ArrowDown',
    'ArrowUp',
    'ArrowRight',
    'ArrowLeft',
    'Space',
  ]
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

  /** Maps every `ConflictListItem` to its parent `ConflictList` if it exists. */
  const conflictListMap = computed<
    Map<ConflictListItem, ConflictList | undefined>
  >(() => {
    const map = new Map<ConflictListItem, ConflictList | undefined>()
    let currentList: ConflictList | undefined = undefined
    for (const obj of allObjects.value) {
      if (isConflictList(obj)) {
        currentList = obj
      } else {
        map.set(obj, currentList)
      }
    }
    return map
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

  function clickObject(obj: ConflictListItem | ConflictList) {
    focused.value = obj
    focusedExpanded.value = true
  }

  /** Get the parent `ConflictList` from the given `ConflictListItem` if it exists. */
  function getParentConflictList(item: ConflictListItem) {
    return conflictListMap.value.get(item)
  }

  /** Expand the currently focused object. */
  function expandFocused() {
    if (focused.value) {
      emitter.emit('expandRecipeObject', focused.value)
      focusedExpanded.value = true
    }
  }

  /** Collapse the currently focused object.
   * If the focused object is a `ConflictList`, then all other conflict lists will also be collapsed.*/
  function collapseFocused() {
    if (focused.value) {
      if (isConflictList(focused.value)) {
        emitter.emit('collapseAllConflictLists')
      } else {
        emitter.emit('collapseRecipeObject', focused.value)
      }
      focusedExpanded.value = false
    }
  }

  /** Handle the user requesting the current object to be collapsed. */
  function handleCollapse() {
    if (!focused.value) return
    if (!focusedExpanded.value && isConflictListItem(focused.value)) {
      focused.value = getParentConflictList(focused.value)
    }
    collapseFocused()
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
    if (
      isConflictList(focused.value) &&
      (!focusedExpanded.value || delta < 0)
    ) {
      focused.value = getRelativeConflictList(focused.value, delta)
    } else {
      const currIndex = allObjects.value.indexOf(focused.value)
      const maxIndex = allObjects.value.length - 1
      const newIndex = clamp(currIndex + delta, 0, maxIndex)
      focused.value = allObjects.value[newIndex]
    }
    collapseFocused()
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
        handleCollapse()
        break
      case 'Space':
        selectFocusedConflict()
        break
    }
    if (CAPTURED_KEYS.includes(event.code)) {
      event.preventDefault()
    }
    console.log(focused.value?.text, focusedExpanded.value)
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
    clickObject,
  }
})
