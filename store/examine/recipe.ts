import type { ConflictList, ConflictListItem } from '~/types'
import { useConflicts } from './conflicts'
import { emitter } from '~/util/emitter'
import { isConflictListItem } from '~/util'

export const useExaminationRecipe = defineStore('examine-recipe', () => {
  const conflicts = useConflicts()

  /** Index of currently selected tab in the recipe area. */
  const currentRecipeTabIndex = ref(0)

  /** The object which is currently being focused in the recipe area */
  const focused = ref<ConflictListItem | ConflictList>()

  /** Object that was being focused before focus was lost */
  const savedFocus = ref<ConflictListItem | ConflictList>()

  const currentListIndex = ref<number>()
  const currentItemIndex = ref<number>()

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

  function focusNextObject() {}

  function focusPreviousObject() {}

  /** Expand the currently focused object. */
  function expandFocused() {
    if (focused.value) emitter.emit('expandRecipeObject', focused.value)
  }

  /** Collapse the currently focused object. */
  function collapseFocused() {
    if (focused.value) emitter.emit('collapseRecipeObject', focused.value)
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

  /** Handle a keyboard event in the recipe area. */
  function handleKeyEvent(event: KeyboardEvent) {
    switch (event.code) {
      case 'ArrowDown':
        collapseFocusedIfConflictItem()
        focusNextObject()
        break
      case 'ArrowUp':
        collapseFocusedIfConflictItem()
        focusPreviousObject()
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
    handleKeyEvent,
  }
})
