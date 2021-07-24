/* eslint-disable */
import { shallowMount } from '@vue/test-utils'
import RequestInfoHeader from '@/components/application/Examine/RequestInfoHeader'
import store from '@/store'

describe('RequestInfoHeader.vue', () => {
  let component

  beforeEach(() => {
    component = shallowMount(RequestInfoHeader, { store })
  })

  // FUTURE: fix
  xit("renders a RequestInfoHeader component", () => {
    expect(component.element).toMatchSnapshot()
  })

  // Add other tests specific to this component and not its sub-components
})
