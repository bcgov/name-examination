/* eslint-disable */
import Vue from 'vue'
import Router from 'vue-router'
import Vuex from 'vuex'
import store from '@/store'

const LandingPage = () => import(/* webpackChunkName: "home" */'@/components/LandingPage')
const Settings = () => import(/* webpackChunkName: "settings" */'@/components/application/sections/Settings')
const Signup = () => import(/* webpackChunkName: "signup" */'@/components/landing/auth/Signup')
const Signin = () => import(/* webpackChunkName: "signin" */'@/components/landing/auth/Signin')
const KeyCloak = () => import(/* webpackChunkName: "signin" */'@/components/landing/auth/keyCloak')
const MainPage = () => import(/* webpackChunkName: "mainPage" */'@/components/ApplicationPage')
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
      path: '/signup',
      name: 'Signup',
      component: Signup
    },
    {
      name: 'settings',
      component: Settings,
      path: '/settings',
    },
    {
      name: 'mainPage',
      component: MainPage,
      path: '/mainPage',
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
    console.log('Auth check')
    // this route requires auth,
    // if not Authenticated, redirect to login page.
    if (store.state.idToken === null) {
      console.log('redirect to /')
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

//router.get('/{vue_capture?}', function () {
//  return view('pages.home');
//}).where('vue_capture', '[\/\w\.-]*');
