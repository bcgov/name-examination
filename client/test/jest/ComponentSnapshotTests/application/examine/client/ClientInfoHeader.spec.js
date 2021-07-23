/* eslint-disable */
import { shallowMount } from '@vue/test-utils'
import ClientInfoHeader from '@/components/application/Examine/client/ClientInfoHeader'
import store from '@/store'

describe('ClientInfoHeader.vue', () => {
  let component

  beforeEach(() => {
    component = shallowMount(ClientInfoHeader, { store })
  })

  it("renders a ClientInfoHeader component", () => {
    expect(component.element).toMatchSnapshot()
  })

  // Add other tests specific to this component and not its sub-components
})
