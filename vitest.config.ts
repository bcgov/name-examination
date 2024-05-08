import { defineVitestConfig } from 'nuxt-vitest/config'

export default defineVitestConfig({
  test: {
    environment: 'nuxt',
    setupFiles: ['./tests/vue-test-utils-plugins.ts', './tests/setup.ts'],
    coverage: {
      reporter: ['text', 'json', 'html'],
      reportsDirectory: './tests/unit/coverage',
    },
  },
})
