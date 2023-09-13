import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('font-awesome-icon', FontAwesomeIcon)
})
