import {
  BaseWrapper,
  DOMWrapper,
  VueWrapper,
  createWrapperError,
} from '@vue/test-utils'
import flushPromises from 'flush-promises'

/**
 * Returns the first descendant of the wrapper with the given text
 */
export function findWithText(
  wrapper: BaseWrapper<any>,
  text: string
): DOMWrapper<any> {
  for (let elem of wrapper.findAll('*')) {
    if (elem.text().trim() === text.trim()) {
      return elem
    }
  }
  return createWrapperError('DOMWrapper')
}

/**
 * Click the given dropdown and choose a given option
 */
export async function clickDropdownOption(
  dropdown: BaseWrapper<any>,
  option: string
) {
  const dropdownButton = dropdown.find('button')
  await dropdownButton.trigger('click')

  const dropdownOption = findWithText(dropdown, option)
  await dropdownOption.trigger('click')

  await flushPromises()
}
