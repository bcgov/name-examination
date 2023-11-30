import { beforeEach, describe, it, expect, vitest } from 'vitest'
import LandingPage from '../pages/index.vue'
import { DOMWrapper, VueWrapper, mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import flushPromises from 'flush-promises'
import {
  createRouter,
  createMemoryHistory,
  type RouteRecordRaw,
} from 'vue-router'
import Home from '../pages/index.vue'
import { Routes } from '~/enums/routes'
/* eslint-disable require-jsdoc */

describe('Home page tests', () => {
  let wrapper: VueWrapper<any, any>
  let authModule: any

  beforeEach(() => {
    // To mock router
    const routes: RouteRecordRaw[] = [
      {
        path: '/',
        component: LandingPage,
      },
      {
        path: Routes.Home,
        component: Home,
      },
    ]
    const router = createRouter({
      history: createMemoryHistory(),
      routes,
    })
    // To mock pinia store
    const pinia = createTestingPinia({
      createSpy: vitest.fn,
    })
    wrapper = mount(LandingPage, {
      global: {
        plugins: [pinia, router],
      },
    })
  })

  it('shows an error when user not logged in', async () => {
    await flushPromises() // wait for updates
    // At this point, the 'p' element should exist in the DOM.
    expect(
      wrapper
        .findAll('p')
        .filter((node: DOMWrapper<HTMLParagraphElement>) =>
          node.text().match(/Please login/)
        ).length
    ).toBe(1)
    // And the home page should not.
    expect(wrapper.findComponent(Home).exists()).toBe(false)
  })

  it('shows welcome message when user is logged in', async () => {
    await flushPromises() // wait for updates
    // At this point, the 'header' element should exist in the DOM.
    expect(wrapper.find('header').text()).toBe('Welcome to Name X!')
    // And the 'p' should not.
    expect(
      wrapper
        .findAll('p')
        .filter((node: DOMWrapper<HTMLParagraphElement>) =>
          node.text().match(/Please login/)
        ).length
    ).toBe(0)
  })
})
