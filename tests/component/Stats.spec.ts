import { beforeEach, describe, it, expect, vitest } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import { useStatusStore } from '~/store/status'
import StatusBox from '~/components/StatusBox.vue'
/* eslint-disable require-jsdoc */

describe('Stats', () => {
  let wrapper: any = null
  let status: any = null
  beforeEach(() => {
    const pinia = createTestingPinia({
      createSpy: vitest.fn,
    })
    wrapper = mount(StatusBox, {
      global: {
        plugins: [pinia],
      },
    })
    status = useStatusStore(pinia)
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
