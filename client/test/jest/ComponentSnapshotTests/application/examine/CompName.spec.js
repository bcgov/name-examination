/* eslint-disable */
import Vue from 'vue'
Vue.use(require('vue-shortkey'))
import { shallowMount } from '@vue/test-utils'
import CompName from '@/components/application/Examine/CompName'
import store from '@/store'

describe('CompName.vue ', () => {
  let component

  beforeEach(() => {
    component = shallowMount(CompName, { store })
  })

  // FUTURE: fix
  xit("renders a CompName component", () => {
    expect(component.element).toMatchSnapshot()
  })

  // Add other tests specific to this component and not its sub-components
})
