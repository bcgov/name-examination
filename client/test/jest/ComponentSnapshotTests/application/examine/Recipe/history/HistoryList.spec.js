/* eslint-disable */
import { shallowMount } from '@vue/test-utils'
import HistoryList from '@/components/application/Examine/Recipe/history/historyList'
import store from '@/store'

describe('HistoryList.vue', () => {
  let component

  beforeEach(() => {
    component = shallowMount(HistoryList, { store })
  })

  it("renders a HistoryList component", () => {
    expect(component.element).toMatchSnapshot()
  })

  // Add other tests specific to this component and not its sub-components
})
