// https://v3.nuxtjs.org/api/configuration/nuxt.config
import path from 'path'

export default defineNuxtConfig({
  ssr: false,
  modules: ["@nuxt/content", "@nuxtjs/tailwindcss", "@pinia/nuxt"],
  css: ["@/assets/main.scss"],
  typescript: {
    typeCheck: true,
  },
  app:{
    baseURL: '/'
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
