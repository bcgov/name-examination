/* eslint-disable */
import { shallowMount } from '@vue/test-utils'
import InternalComments from '@/components/application/Examine/InternalComments'
import store from '@/store'

describe('InternalComments.vue', () => {
  let component

  beforeEach(() => {
    component = shallowMount(InternalComments, { store })
  })

  it("renders an internal comments component", () => {
    expect(component.element).toMatchSnapshot()
  })

  // Add other tests specific to this component and not its sub-components
})
