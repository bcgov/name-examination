import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

export default (nuxtApp: any) => {
  nuxtApp.vueApp.component('font-awesome-icon', FontAwesomeIcon, {})
}
