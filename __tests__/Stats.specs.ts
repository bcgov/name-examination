import { beforeEach, describe, it, expect, vitest } from 'vitest'
import StatsBox from '../components/StatsBox.vue'
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import { Fetchstatus } from '../store/fetchstatus'
/* eslint-disable require-jsdoc */

describe('Stats', () => {
  let wrapper: any = null
  let status: any = null
  beforeEach(() => {
    const pinia = createTestingPinia({
      createSpy: vitest.fn
    })
    wrapper = mount(StatsBox, {
      global: {
        plugins: [pinia]
      }
    })
    status = Fetchstatus(pinia)
    status.holdNum = '1378'
    status.notExaminedNum = '15691'
  })

  it('the it shows the correct date', () => {
    expect(wrapper.find('#date').text()).toBe(status.todayStr)
  })
  it('the it shows the correct hold number', async () => {
    expect(wrapper.find('#hold').text()).toBe('1378')
  })
  it('the it shows the examined number', () => {
    expect(wrapper.find('#notExamined').text()).toBe('15691')
  })
})
