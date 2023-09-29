import { defineVitestConfig } from 'nuxt-vitest/config'

export default defineVitestConfig({
  test: {
    environment: 'nuxt',
    setupFiles: './__tests__/vue-test-utils-plugins.ts'
  },
})
