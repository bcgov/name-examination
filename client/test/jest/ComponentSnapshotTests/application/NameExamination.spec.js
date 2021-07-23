/* eslint-disable */
import Vue from 'vue'
Vue.use(require('vue-shortkey'))
import NameExamination from '@/components/application/NameExamination'
import store from '@/store'
import { shallowMount } from "@vue/test-utils"

describe('NameExamination.vue', () => {
  let component

  beforeEach(() => {
    component = shallowMount(NameExamination, { store })
  })

  // FUTURE: fix
  xit("renders a NameExamination view", () => {
    expect(component.element).toMatchSnapshot()
  })
})
