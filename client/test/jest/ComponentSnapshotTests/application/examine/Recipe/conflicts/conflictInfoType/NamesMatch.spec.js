/* eslint-disable */
import { shallowMount } from '@vue/test-utils'
import NamesMatch from '@/components/application/Examine/Recipe/conflicts/conflictInfoType/namesMatch'
import store from '@/store'

describe('NamesMatch.vue', () => {
  let component

  beforeEach(() => {
    component = shallowMount(NamesMatch, { store })
  })

  it("renders a NamesMatch component", () => {
    expect(component.element).toMatchSnapshot()
  })

  // Add other tests specific to this component and not its sub-components
})
