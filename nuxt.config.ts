// https://v3.nuxtjs.org/api/configuration/nuxt.config
import path from 'path'

export default defineNuxtConfig({
  ssr: false,
  devServer: {
    port: 8080
  },
  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      title: 'BC Registry: Name Examination'
    },
    baseURL: '/'
  },
  modules: ["@nuxt/content", "@nuxtjs/tailwindcss", "@pinia/nuxt"],
  css: ["@/assets/main.scss"],
  typescript: {
    typeCheck: true,
  },
  pinia: {
    autoImports: [
      // automatically imports `defineStore`
      'defineStore', // import { defineStore } from 'pinia'
      ['defineStore', 'definePiniaStore'], // import { defineStore as definePiniaStore } from 'pinia'
      'acceptHMRUpdate' //import `acceptHMRUpdate` from 'pinia
    ],
  },
  vite: {
    mode: "spa",
    css: {
      preprocessorOptions: {
        sass: {
          additionalData: '@import "@/assets/theme.scss"',
        },
      },
    },
  },
  nitro: {
    output: {
      publicDir: path.join(__dirname, 'dist')
    }
  },
});
