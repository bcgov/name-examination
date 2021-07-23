/* eslint-disable */
import { shallowMount } from '@vue/test-utils'
import Find from '@/components/application/Find'
import store from '@/store'

describe('Find.vue', () => {
  let component

  beforeEach(() => {
    component = shallowMount(Find, { store })
  })

  it("renders a Find component", () => {
    expect(component.element).toMatchSnapshot()
  })

  // Add other tests specific to this component and not its sub-components
})
