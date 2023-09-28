import { DOMWrapper, VueWrapper, createWrapperError } from '@vue/test-utils'

/**
 * Returns the first descendant of the wrapper with the given text
 */
export function findWithText(wrapper: DOMWrapper<any>, text: string): DOMWrapper<any> {
  for (let elem of wrapper.findAll('*')) {
    if (elem.text().trim() === text.trim()) {
      return elem
    }
  }
  return createWrapperError('DOMWrapper')
}
