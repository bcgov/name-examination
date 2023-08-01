import vue from '@vitejs/plugin-vue'

export default {
  plugins: [vue()],
  test: {
    // simulate DOM with happy-dom
    environment: 'jsdom',
    globals: true
  }
}
