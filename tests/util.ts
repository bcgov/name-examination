import { DOMWrapper, VueWrapper } from '@vue/test-utils'
import flushPromises from 'flush-promises'
import { vi } from 'vitest'

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

/**
 * Set the return value of the next call to `fetch`
 */
export function setFetchResponse(data: any) {
  global.fetch = vi.fn().mockResolvedValueOnce({ json: () => data })
}
