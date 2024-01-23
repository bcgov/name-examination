/* eslint-disable */
import Vue from 'vue'
import Router from 'vue-router'
import Vuex from 'vuex'
import store from '@/store'

const LandingPage = () => import(/* webpackChunkName: "home" */'@/components/LandingPage')
const Signin = () => import(/* webpackChunkName: "signin" */'@/components/auth/Signin')
const NameExamination = () => import(/* webpackChunkName: "nameexamination" */'@/components/application/NameExamination')
const Transactions = () => import(/* webpackChunkName: "nameexamination" */'@/components/application/Transactions')
const findFilter = () => import(/* webpackChunkName: "find" */'@/components/application/Find/findFilter')
const Stats = () => import(/* webpackChunkName: "stats" */'@/components/application/Stats/Stats.vue')

Vue.use(Router)
Vue.use(Vuex)

let router = new Router({
  mode: 'history', // <-- removes the /#/
  routes: [
    {
      path: '/',
      name: 'home',
      component: LandingPage
    },
    {
      path: '/home',
      name: 'LandingPage',
      component: LandingPage
    },
    {
      path: '/signin',
      name: 'Signin',
      component: Signin
    },
    {
      name: 'nameexamination',
      component: NameExamination,
      path: '/nameExamination/:param',
      meta: {
        requiresAuth: true
      },
      beforeEnter: (to, from, next) => {
        if (from.path == '/') {  // reload the page
          next({
            path: '/signin',
            query: { redirect: to.fullPath},
          })
        }
        next()
      }
    },
    {
      name: 'transactions',
      component: Transactions,
      path: '/transactions',
      props: true,
      meta: {
        requiresAuth: false
      }
    },
    {
      name: 'find',
      component: findFilter,
      path: '/find',
      meta: {
        requiresAuth: true
      }
    },
    {
      name: 'stats',
      component: Stats,
      path: '/stats',
      meta: {
        requiresAuth: true
      }
    },
  ]
})

router.beforeResolve((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {

    // this route requires auth,
    // if not Authenticated, redirect to login page.
    let auth = sessionStorage.getItem('AUTHORIZED')
    if (auth == 'true') {
      if (to.name == 'nameexamination' && from.name == 'Signin' && to.params.param) {
        let match = /(?:\s+|\s|)(\D|\D+|)(?:\s+|\s|)(\d+)(?:\s+|\s|)/
        let rtnNR = () => ( 'NR ' )
        const search = to.params.param.replace(match, rtnNR('$1') + '$2')
        let payload = {
          search,
          router: to,
          refresh: false
        }
        store.commit('nrNumber', search)
        store.dispatch('getpostgrescompInfo', search)
        store.dispatch('newNrNumber', payload)
      }
      next()
    } else {
        store.dispatch("checkError",{"message": "Not Authorized please login."});
        next({
          path: '/'
        })
    }
  } else {
    next() // make sure to always call next()!
  }
})

export default router
