import { beforeEach, describe, it, expect, vitest } from 'vitest'
import LandingPage from '../pages/LandingPage.vue'
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import { useAuthStore } from '../store/auth'
import flushPromises from 'flush-promises'
/* eslint-disable require-jsdoc */

describe('Welcome Message', () => {
  let wrapper: any = null
  let authModule: any = null
  beforeEach(() => {
    const pinia = createTestingPinia({
      createSpy: vitest.fn
    })
    wrapper = mount(LandingPage, {
      global: {
        plugins: [pinia]
      }
    })
    authModule = useAuthStore(pinia)
  })

  it('shows error when user not logged in', async () => {
    authModule.isAuthenticated = false // simulate not being logged in
    await flushPromises()// wait for updates
    // At this point, the 'p' element should exist in the DOM.
    expect(wrapper.find('p').text()).toBe('Your authorization is missing or has expired. Please login.')
    // And the 'header' should not.
    expect(wrapper.find('header').exists()).toBe(false)
  })

  it('shows welcome message when user is logged in', async () => {
    authModule.isAuthenticated = true // simulate being logged in
    await flushPromises()// wait for updates
    // At this point, the 'header' element should exist in the DOM.
    expect(wrapper.find('header').text()).toBe('Welcome to Name X!')
    // And the 'p' should not.
    expect(wrapper.find('p').exists()).toBe(false)
  })
})
