// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  ssr: false,
  modules: ["@nuxt/content", "@nuxtjs/tailwindcss", "@pinia/nuxt"],
  css: ["@/assets/main.scss"],
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
});
