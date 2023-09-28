import { beforeEach, describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import SearchResultsBox from '~/components/SearchResultsBox.vue'
import mockNameRequests from './mockNameRequests.json'
import mockZeroNameRequests from './mockZeroNameRequests.json'
import { useSearchStore } from '~/store/search'
import LoadingSpinner from '~/components/LoadingSpinner.vue'
import { createPinia, setActivePinia } from 'pinia'
import flushPromises from 'flush-promises'
import { SearchColumns } from '~/enums/SearchColumns'
import { findWithText } from './util'
import { Status } from '~/enums/dropdownEnums'

const TEST_INPUT_STRING = 'test123'

describe('Search Results Box Component', () => {
  let wrapper = mount(SearchResultsBox)
  let search = useSearchStore()

  /**
   * Set the return value of the next call to `fetch`
   */
  function setFetchResponse(data: any) {
    global.fetch = vi.fn().mockResolvedValueOnce({ json: () => data })
  }

  /**
   * Get the filter input (i.e. dropdown, text input) for the given column in the table
   */
  function getFilterInput(column: SearchColumns) {
    return wrapper
      .findAll('thead > tr')
      .at(1)
      ?.findAll('th')
      .at(search.selectedColumns.indexOf(column))
      ?.find('*') // get the first child element of the 'th' element
  }

  beforeEach(() => {
    setActivePinia(createPinia())
    search = useSearchStore()
    wrapper = mount(SearchResultsBox)
  })

  it('displays the correct rows in the table', async () => {
    setFetchResponse(mockNameRequests)
    await search.updateRows()

    const tableRows = wrapper.findAll('tbody > tr')
    expect(tableRows).toHaveLength(search.rows.length)

    tableRows.forEach((row, i) => {
      const expectedRow = search.rows[i] // actual row in the search store that the tr element is modeling
      row.findAll('td').forEach((cell, j) => {
        const expectedValue = expectedRow[search.selectedColumns[j]]
        expect(cell.text()).contains(expectedValue.trim())
      })
    })
  })

  it('displays no rows when there are no name requests to show', async () => {
    setFetchResponse(mockZeroNameRequests)
    await search.updateRows()

    expect(wrapper.findAll('tbody > tr')).toHaveLength(1)
    expect(wrapper.find('tbody > tr').html()).contains(
      (wrapper.vm as any).NO_DATA_STRING
    )
  })

  it('displays a loading spinner when an api fetch is loading', async () => {
    search.isLoading = true
    await flushPromises()
    expect(wrapper.findAllComponents(LoadingSpinner)).toHaveLength(1)
  })

  it('updates the status filter', async () => {
    const statusDropdown = getFilterInput(SearchColumns.Status)!
    expect(statusDropdown).toBeDefined()

    for (let status of Object.values(Status)) {
      await statusDropdown.find('button').trigger('click')
      await findWithText(statusDropdown, status).trigger('click')

      expect(search.filters[SearchColumns.Status]).toBe(status)

      await flushPromises() // wait for ui updates

      expect(statusDropdown.text()).toBe(status)
    }
  })

  it('updates the modified by filter', async () => {
    const modifiedByInput = getFilterInput(SearchColumns.LastModifiedBy)!
    expect(modifiedByInput).toBeDefined()

    await modifiedByInput.setValue(TEST_INPUT_STRING)
    await modifiedByInput.trigger('keyup.enter')
    expect(search.filters[SearchColumns.LastModifiedBy]).toBe(TEST_INPUT_STRING)
  })
})
