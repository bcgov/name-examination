/* eslint-disable */
import Vue from 'vue'
import Router from 'vue-router'
import Vuex from 'vuex'
import store from '@/store'

const LandingPage = () => import(/* webpackChunkName: "home" */'@/components/LandingPage')
const Settings = () => import(/* webpackChunkName: "settings" */'@/components/application/sections/Settings')
const Signin = () => import(/* webpackChunkName: "signin" */'@/components/landing/auth/Signin')
const KeyCloak = () => import(/* webpackChunkName: "keycloak" */'@/components/landing/auth/keyCloak')
const SearchResults = () => import(/* webpackChunkName: "searchresults" */'@/components/dropdown/SearchResults')

Vue.use(Router)
Vue.use(Vuex)

let router = new Router({
  mode: 'history', // <-- removes the /#/
  routes: [
    {
      path: '/',
      name: 'LandingPage',
      component: LandingPage
    },
    {
      path: '/signin',
      name: 'Signin',
      component: Signin
    },
    {
      name: 'settings',
      component: Settings,
      path: '/settings',
      meta: {
        requiresAuth: true
      }
    },
    {
      name: 'searchresults',
      component: SearchResults,
      path: '/searchresults',
      meta: {
        requiresAuth: true
      }
    },
    {
      name: 'keycloak',
      component: KeyCloak,
      path: '/keycloak',
      meta: {
        requiresAuth: false
      },
    }
  ]
})

router.beforeResolve((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    console.log('Authorization check')
    // this route requires auth,
    // if not Authenticated, redirect to login page.
    if (store.state.kctoken == null) {
      console.log('Not authorized, redirect to /')
      next({
        path: '/'
      })
    } else {
      console.log('Authorized')
      next()
    }
  } else {
    next() // make sure to always call next()!
  }
})

export default router
