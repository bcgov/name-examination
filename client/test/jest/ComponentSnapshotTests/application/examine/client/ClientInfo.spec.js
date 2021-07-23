/* eslint-disable */
import { shallowMount } from '@vue/test-utils'
import ClientInfo from '@/components/application/Examine/client/ClientInfo'
import store from '@/store'

describe('ClientInfo.vue', () => {
  let component

  beforeEach(() => {
    component = shallowMount(ClientInfo, { store })
  })

  it("renders a ClientInfo component", () => {
    expect(component.element).toMatchSnapshot()
  })

  // Add other tests specific to this component and not its sub-components
})
