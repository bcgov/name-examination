import { BaseWrapper, DOMWrapper, VueWrapper, config, createWrapperError } from '@vue/test-utils'
import flushPromises from 'flush-promises'

/**
 * Click the given dropdown and choose a given option
 */
export async function clickDropdownOption(
  dropdown: DOMWrapper<any> | VueWrapper<any>,
  option: string
) {
  const dropdownButton = dropdown.find('button')
  await dropdownButton.trigger('click')

  const dropdownOption = dropdown.findWithText(option)
  await dropdownOption.trigger('click')

  await flushPromises()
}
