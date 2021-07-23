/* eslint-disable */
import { shallowMount } from '@vue/test-utils'
import App from '@/App'
import store from '@/store'

describe('App.vue ', () => {
  let component

  beforeEach(() => {
    component = shallowMount(App, { store })
  })

  it("renders the App", () => {
    expect(component.element).toMatchSnapshot()
  })

  // Add other tests specific to this component and not its sub-components
})
