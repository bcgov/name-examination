import { Route } from '~/enums/routes'
import { useExamination } from '.'
import { useExamineTabs } from './tabs'

/** Handles the focusing of elements in the Examine page */
export const useExaminationFocus = defineStore('examine-focus', () => {
  /** Array of element ids */
  const elements = ref<Array<string>>([])
  const focused = ref(-1)
  const examine = useExamination()

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
    // if the conflicts tab is not selected, do not handle any key presses
    if (useExamineTabs().selectedTabIndex !== 0) {
      return
    }

    const route = useRoute().path.toString().toLowerCase()
    if (route !== Route.Examine || event.code !== 'Tab' || examine.isEditing)
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
      focused.value = (focused.value + 1) % elements.value.length
      document.getElementById(elements.value[focused.value])?.focus()
    } else if (event.type === 'keydown') {
      event.preventDefault()
    }
  }

  document.addEventListener('keyup', handleKeyPress)
  document.addEventListener('keydown', handleKeyPress)

  return { register, handleKeyPress }
})
