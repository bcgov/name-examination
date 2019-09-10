/* eslint-disable */
// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuelidate from 'vuelidate'
import Vuetify from 'vuetify'
import VDragged from 'v-dragged'
import { Plugin } from 'vue-fragment'

import App from './App'
import router from '@/router'
import store from '@/store'

import 'vuetify/dist/vuetify.min.css'
import '../static/stylus/overrides.styl'

Vue.use(Plugin)
Vue.use(require('vue-shortkey'))
Vue.use(Vuelidate)
Vue.use(Vuetify)
Vue.use(VDragged)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
