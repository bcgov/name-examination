import { beforeEach, describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { useSearchStore } from '~/store/search'
import { clickDropdownOption } from '../util'
import SearchResultsControl from '~/components/search/ResultsControl.vue'
import { createTestingPinia } from '@pinia/testing'
import ListSelect from '~/components/ListSelect.vue'
import { ListboxButton } from '@headlessui/vue'
import IconButton from '~/components/IconButton.vue'
import ComboSelect from '~/components/ComboSelect.vue'

describe('Search Page', () => {
  let wrapper = mount(SearchResultsControl)
  let search = useSearchStore()

  beforeEach(() => {
    wrapper = mount(SearchResultsControl, {
      global: {
        plugins: [createTestingPinia({ stubActions: false, createSpy: vi.fn })],
      },
    })
    search = useSearchStore()
  })

  it('resets the filters', async () => {
    await wrapper
      .findWithText((wrapper.vm as any).CLEAR_FILTERS_TEXT)
      .trigger('click')
    expect(search.$reset).toHaveBeenCalledOnce()
  })

  it('sets the selected columns correctly when they are changed', async () => {
    const columnsDropdown = wrapper.findAllComponents(ListSelect)[0]
    expect(columnsDropdown).toBeDefined()

    await columnsDropdown.findComponent(ListboxButton).trigger('click')

    // gradually disbable very column and check if the selected columns is
    // updated accordingly. this assumes all columns are enabled by default
    const excluded = []
    for (let column of search.fixedColumns) {
      await columnsDropdown.findWithText(column).trigger('click')
      excluded.push(column)
      expect(
        excluded.every((c) => !search.selectedColumns.includes(c))
      ).toBeTruthy()
    }
  })

  it('sets the display count', async () => {
    const displayDropdown = wrapper.findAllComponents(ListSelect)[1]
    expect(displayDropdown).toBeDefined()

    await clickDropdownOption(displayDropdown, '10')
    expect(search.selectedDisplay).toBe(10)
  })

  it('has a page number combo select', async () => {
    const pageDropdown = wrapper.findComponent(ComboSelect)
    search.selectedDisplay = 10
    search.resultNum = 100

    const expectedOptions = Array.from({ length: 10 }, (_, key) => key + 1)
    expect(pageDropdown.vm.filteredOptions).toEqual(expectedOptions)
    expect(pageDropdown.exists()).toBe(true)
  })

  it('goes to the previous page when a button is pressed', async () => {
    const previousPageButton = wrapper.findAllComponents(IconButton)[0]
    await previousPageButton.trigger('click')
    expect(search.goToPreviousPage).toHaveBeenCalledOnce()
  })

  it('goes to the next page when a button is pressed', async () => {
    const nextPageButton = wrapper.findAllComponents(IconButton)[1]
    await nextPageButton.trigger('click')
    expect(search.goToNextPage).toHaveBeenCalledOnce()
  })
})
