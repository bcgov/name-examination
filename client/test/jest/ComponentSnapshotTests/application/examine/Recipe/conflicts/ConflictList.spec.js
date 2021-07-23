/* eslint-disable */
import { shallowMount } from '@vue/test-utils'
import ConflictList from '@/components/application/Examine/Recipe/conflicts/conflictList'
import store from '@/store'

describe('ConflictList.vue', () => {
  let component

  beforeEach(() => {
    component = shallowMount(ConflictList, { store })
  })

  it("renders a ConflictList component", () => {
    expect(component.element).toMatchSnapshot()
  })

  // Add other tests specific to this component and not its sub-components
})
