/* eslint-disable */
import { shallowMount } from '@vue/test-utils'
import StdHeader from '@/components/application/sections/StdHeader'
import store from '@/store'
import router from '@/router'

describe('StdHeader.vue', () => {
  let component

  beforeEach(() => {
    component = shallowMount(StdHeader, { store, router })
  })

  // FUTURE: fix
  xit("renders a StdHeader component", () => {
    expect(component.element).toMatchSnapshot()
  })

  // Add other tests specific to this component and not its sub-components
})
