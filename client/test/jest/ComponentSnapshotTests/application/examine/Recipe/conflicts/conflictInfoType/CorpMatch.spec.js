/* eslint-disable */
import { shallowMount } from '@vue/test-utils'
import CorpMatch from '@/components/application/Examine/Recipe/conflicts/conflictInfoType/CorpMatch.vue'
import store from '@/store'

describe('CorpMatch.vue', () => {
  let component

  beforeEach(() => {
    component = shallowMount(CorpMatch, { store })
  })

  it("renders a CorpMatch component", () => {
    expect(component.element).toMatchSnapshot()
  })

  // Add other tests specific to this component and not its sub-components
})
