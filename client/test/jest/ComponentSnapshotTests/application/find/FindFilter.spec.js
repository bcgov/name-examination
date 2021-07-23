/* eslint-disable */
import { shallowMount } from '@vue/test-utils'
import FindFilter from '@/components/application/Find/findFilter'
import store from '@/store'

describe('FindFilter.vue', () => {
  let component

  beforeEach(() => {
    component = shallowMount(FindFilter, { store })
  })

  // FUTURE: fix
  xit("renders a FindFilter component", () => {
    expect(component.element).toMatchSnapshot()
  })

  // Add other tests specific to this component and not its sub-components
})
