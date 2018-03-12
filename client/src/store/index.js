/* eslint-disable */
import Vue from 'vue'
import Vuex from 'vuex'
import axios from '../axios-auth'
import globalAxios from 'axios'

import router from '@/router'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    idToken: null,
    userId: null,
    user: null,
    email: null,
    dbConfig:{
      dbURL: null,
      secKey:null
    }
  },
  mutations: {
    authUser (state, userData) {
      state.idToken = userData.token
      state.userId = userData.userId
      state.email = userData.email
      state.user = userData.email
    },
    storeUser (state, user) {
      state.user = user
    },
    storeDbConfig(state, configSetup){
      state.dbConfig.dbURL = configSetup.dbURL
      state.dbConfig.secKey = configSetup.secKey
      globalAxios.defaults.baseURL = state.dbConfig.dbURL
    },
    clearAuthData (state) {
      state.idToken = null
      state.userId = null
    }
  },
  actions: {
    signup ({commit, dispatch, state}, authData) {
      axios.post('/signupNewUser?key='+state.dbConfig.secKey, {
        email: authData.email,
        password: authData.password,
        returnSecureToken: true
      })
        .then(res => {
          console.log(res)
          commit('authUser', {
            token: res.data.idToken,
            userId: res.data.localId,
            email:authData.email
          })
          const now = new Date()
          const expirationDate = new Date(now.getTime() + res.data.expiresIn * 1000)
          localStorage.setItem('token', res.data.idToken)
          localStorage.setItem('userId', res.data.localId)
          localStorage.setItem('expirationDate', expirationDate)
          localStorage.setItem('email', authData.email)
          dispatch('storeUser', authData)
        })
        .catch(error => console.log(error))
    },
    dbConfigSetup ({commit, dispatch}, configSetup) {
      console.log('action: setting the DB Config')

      localStorage.setItem('dbURL', configSetup.dbURL)
      localStorage.setItem('secKey', configSetup.secKey)
      commit('storeDbConfig', configSetup)
    },
    login ({commit, dispatch, state}, authData) {
        axios.post('/verifyPassword?key='+ state.dbConfig.secKey, {
        email: authData.email,
        password: authData.password,
        returnSecureToken: true
      })
        .then(res => {
          console.log(res)
          const now = new Date()
          const expirationDate = new Date(now.getTime() + res.data.expiresIn * 1000)
          localStorage.setItem('token', res.data.idToken)
          localStorage.setItem('userId', res.data.localId)
          localStorage.setItem('expirationDate', expirationDate)
          localStorage.setItem('email', authData.email)
          commit('authUser', {
            token: res.data.idToken,
            userId: res.data.localId,
            email:authData.email
          })
        })
        .catch(error => console.log(error))
      router.push('/mainPage')
    },
    tryAutoLogin ({commit}) {

      const dbURL = localStorage.getItem('dbURL')
      const secKey = localStorage.getItem('secKey')
      if (dbURL){
        console.log('Autoloading dbConfig', dbURL)
        commit('storeDbConfig', {
          dbURL: dbURL,
          secKey: secKey
        })
      }

      console.log('trying to load user')
      const token = localStorage.getItem('token')
      if (!token) {
        return
      }
      const expirationDate = localStorage.getItem('expirationDate')
      const now = new Date()
      if (now >= expirationDate) {
        return
      }
      const userId = localStorage.getItem('userId')
      const email = localStorage.getItem('email')
      commit('authUser', {
        token: token,
        userId: userId,
        email: email
      })
    },
    logout ({commit}) {
      commit('clearAuthData')
      localStorage.removeItem('expirationDate')
      localStorage.removeItem('token')
      localStorage.removeItem('userId')
      localStorage.removeItem('email')
      router.replace('/signin')
    },
    storeUser ({commit, state}, userData) {
      if (!state.idToken) {
        return
      }
      globalAxios.post('/users.json' + '?auth=' + state.idToken, userData)
        .then(res => console.log(res))
        .catch(error => console.log(error))
    },
    fetchUser ({commit, state}) {
      if (!state.idToken) {
        return
      }
      globalAxios.get('/users.json' + '?auth=' + state.idToken)
        .then(res => {
          console.log(res)
          const data = res.data
          const users = []
          for (let key in data) {
            const user = data[key]
            user.id = key
            users.push(user)
          }
          console.log(users)
          commit('storeUser', users[0])
        })
        .catch(error => console.log(error))
    }
  },
  getters: {

    user (state) {
      return state.user
    },
    email (state) {
      return state.email
    },
    isAuthenticated (state) {
      return state.idToken !== null
    }
  }
})
