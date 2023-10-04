import { beforeEach, describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import SearchResultsBox from '~/components/SearchResultsBox.vue'
import mockNameRequests from '../data/mockNameRequests.json'
import mockZeroNameRequests from '../data/mockZeroNameRequests.json'
import { FilterKey, useSearchStore } from '~/store/search'
import LoadingSpinner from '~/components/LoadingSpinner.vue'
import { createPinia, setActivePinia } from 'pinia'
import flushPromises from 'flush-promises'
import { SearchColumns } from '~/enums/search-columns'
import { clickDropdownOption, setFetchResponse } from '../util'
import {
  ConsentRequired,
  LastUpdate,
  Priority,
  Status,
  Submitted,
} from '~/enums/filter-dropdowns'

describe('Search Results Box Component', () => {
  let wrapper = mount(SearchResultsBox)
  let search = useSearchStore()

  /**
   * Get the filter input (i.e. dropdown, text input) for the given column in the table
   */
  function getFilterInput(filter: FilterKey) {
    return wrapper
      .findAll('thead > tr')
      .at(1)
      ?.findAll('th')
      .at(search.selectedColumns.indexOf(filter))
      ?.find('*') // get the first child element of the 'th' element
  }

  /**
   * Test a filter that uses a dropdown for filter values
   * @param filter The name of the column that the filter input is located
   * @param options The list of options that should be clicked in the dropdown
   */
  async function testDropdownFilter(filter: FilterKey, options: Array<any>) {
    const dropdown = getFilterInput(filter)!
    expect(dropdown).toBeDefined()
    expect(dropdown.exists()).toBe(true)

    for (let option of options) {
      await clickDropdownOption(dropdown, option)
      expect(search.filters[filter]).toBe(option)
      expect(dropdown.text()).toBe(option)
    }
  }

  /**
   * Test a filter that uses a text input for filter values
   * @param filter The name of the column that the text input filter is located
   * @param text The text that should be typed into the input
   */
  async function testTextInputFilter(filter: FilterKey, text = 'test') {
    const textInput = getFilterInput(filter)!
    expect(textInput).toBeDefined()
    expect(textInput.exists()).toBe(true)

    await textInput.setValue(text)
    await textInput.trigger('keyup.enter')
    expect(search.filters[filter]).toBe(text)
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

  it('displays the right columns when the columns are changed', async () => {
    for (let end = 1; end <= search.fixedColumns.length; end++) {
      search.selectedColumns = search.fixedColumns.slice(0, end)
      await flushPromises()

      const columnNameCells = wrapper
        .findAll('thead > tr')
        .at(0)
        ?.findAll('th')!
      const filterInputCells = wrapper
        .findAll('thead > tr')
        .at(1)
        ?.findAll('th')!

      expect(columnNameCells).toHaveLength(search.selectedColumns.length)
      expect(filterInputCells).toHaveLength(search.selectedColumns.length)

      search.selectedColumns.forEach((column, i) => {
        expect(columnNameCells[i].text().trim()).toBe(column.trim())
      })
    }
  })

  it('updates the status filter', async () => {
    await testDropdownFilter(SearchColumns.Status, Object.values(Status))
  })

  it('updates the modified by filter', async () => {
    await testTextInputFilter(SearchColumns.LastModifiedBy)
  })

  it('updates the NR number filter', async () => {
    await testTextInputFilter(SearchColumns.NameRequestNumber)
  })

  it('updates the names filter', async () => {
    await testTextInputFilter(SearchColumns.Names)
  })

  it('updates the first name filter', async () => {
    await testTextInputFilter(SearchColumns.ApplicantFirstName)
  })

  it('updates the last name filter', async () => {
    await testTextInputFilter(SearchColumns.ApplicantLastName)
  })

  it('updates the consent required filter', async () => {
    await testDropdownFilter(
      SearchColumns.ConsentRequired,
      Object.values(ConsentRequired)
    )
  })

  it('updates the priority filter', async () => {
    await testDropdownFilter(SearchColumns.Priority, Object.values(Priority))
  })

  it('updates the submitted date filter excluding custom dates', async () => {
    await testDropdownFilter(
      SearchColumns.Submitted,
      Object.values(Submitted).filter((v) => v !== Submitted.Custom)
    )
  })

  it('updates the submitted date filter with custom dates', async () => {
    // todo
  })

  it('updates the submitted date filter order', async () => {
    const columnNamesRow = wrapper.findAll('thead > tr').at(0)!

    search.submittedDateOrder = 'asc'
    await flushPromises()

    const submittedElement = columnNamesRow.findWithText(
      SearchColumns.Submitted
    )
    await submittedElement.find('a').trigger('click')
    await flushPromises()

    expect(search.submittedDateOrder).toBe('desc')
  })

  it('updates the last update filter', async () => {
    await testDropdownFilter(
      SearchColumns.LastUpdate,
      Object.values(LastUpdate)
    )
  })
})
