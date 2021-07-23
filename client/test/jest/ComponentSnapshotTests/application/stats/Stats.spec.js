/* eslint-disable */
import { shallowMount } from '@vue/test-utils'
import Stats from '@/components/application/stats/Stats'
import store from '@/store'

describe('Stats.vue', () => {
  let component

  beforeEach(() => {
    component = shallowMount(Stats, { store })
  })

  it("renders a Stats component", () => {
    expect(component.element).toMatchSnapshot()
  })

  // Add other tests specific to this component and not its sub-components
})
