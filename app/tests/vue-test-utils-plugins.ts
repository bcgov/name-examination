import { BaseWrapper, config, createWrapperError } from '@vue/test-utils'

const findWithTextPlugin = (wrapper: BaseWrapper<any>) => {
  /**
   * Returns the first descendant of the wrapper with the given text
   */
  function findWithText(text: string): BaseWrapper<any> {
    for (let elem of wrapper.findAll('*')) {
      if (elem.text().trim() === text.trim()) {
        return elem
      }
    }
    return createWrapperError('DOMWrapper')
  }
  return { findWithText }
}

config.plugins.DOMWrapper.install(findWithTextPlugin)
config.plugins.VueWrapper.install(findWithTextPlugin)
