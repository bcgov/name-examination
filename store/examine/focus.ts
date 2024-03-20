import { Route } from '~/enums/routes'
import { useExamination } from '.'
import { useExamineTabs } from './tabs'
import { getCircularIndex } from '~/util'
import type { ConflictList, ConflictListItem } from '~/types'
import { useConflicts } from './conflicts'

/** Handles the focusing of elements in the Examine page */
export const useExaminationFocus = defineStore('examine-focus', () => {
  /** Array of element ids */
  const elements = ref<Array<string>>([])
  const focused = ref(-1)
  const examine = useExamination()
  const conflicts = useConflicts()
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

  /** Register an element to be a part of the focus cycle. */
  function register(index: number, elementId: string) {
    if (index > elements.value.length - 1) {
      elements.value.length = index + 1
    }
    if (elements.value[index] && elements.value[index] !== elementId) {
      console.warn(
        `Overwriting previously registered focus item '${elements.value[index]}' with '${elementId}' at index ${index}`
      )
    }
    elements.value[index] = elementId
  }

  /** Handle an incoming `KeyboardEvent`.
   * Will focus the proper element in the focus cycle when the `Tab` key is pressed.
   */
  function handleKeyPress(event: KeyboardEvent) {
    const route = useRoute().path.toString().toLowerCase()
    if (
      route !== Route.Examine ||
      useExamineTabs().selectedTabIndex !== 0 || // if the conflicts tab is not selected, do not handle any key presses
      event.code !== 'Tab' ||
      examine.isEditing
    )
      return

    // handle tab key
    if (event.type === 'keyup') {
      // update the focused element if it was changed through some means other than the tab key
      const activeElemIndex = elements.value.indexOf(
        document.activeElement?.id || ''
      )
      if (activeElemIndex !== -1) {
        focused.value = activeElemIndex
      }
      const delta = event.shiftKey ? -1 : 1
      focused.value = getCircularIndex(
        focused.value + delta,
        elements.value.length
      )
      document.getElementById(elements.value[focused.value])?.focus()
    } else if (event.type === 'keydown') {
      event.preventDefault()
    }
  }

  document.addEventListener('keyup', handleKeyPress)
  document.addEventListener('keydown', handleKeyPress)

  return {
    register,
    handleKeyPress,
    recipeFocus,
    savedRecipeFocus,
    onRecipeFocusIn,
    onRecipeFocusOut,
    handleRecipeKeyPress,
  }
})
