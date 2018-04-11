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
    },
    compInfo: {
      nrNumber: null,
      compNames: {
        compName1: null,
        compName2: null,
        compName3: null
      },
      requestType: null,
    },
    applicantInfo: {
      applicantname: {
        firstName: null,
        lastname: null
      },
      contactInfo: {
        address: null,
        contactName: null,
        phone: null,
        email: null,
        fax: null
      },
    },
    additionalCompInfo: {
      jurisdiction: null,
      natureOfBussiness: null,
      nuans: null,
      sk_name: null,
      nr_status: null
    },
    examiner: null,
    priority: null,
    reSubmission: {
      reSubmissionYN: null,
      linkedNR: null
    },
    reservationCount: null,
    expiryDate: null,
    issueText: null,
    issue: {
        issue_Match: null,
        issue_Consent: null,
        issue_TradeMark: null,
        issue_History: null,
        issue_Format: null,
        issue_Match_Text: null,
        issue_Consent_Text: null,
        issue_TradeMark_Text: null,
        issue_History_Text: null,
        issue_Format_Text: null
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
    storeDbConfig: function (state, configSetup) {
      state.dbConfig.dbURL = configSetup.dbURL
      state.dbConfig.secKey = configSetup.secKey
      globalAxios.defaults.baseURL = state.dbConfig.dbURL
    },
    clearAuthData (state) {
      state.idToken = null
      state.userId = null
    },
    setIssueText (state,issue) {
      switch (issue) {
        case "M1":
          state.issueText = state.issue.issue_Match_Text;
          break;
        case "M2":
          state.issueText = state.issue.issue_Consent_Text;
          break;
        case "M3":
          state.issueText = state.issue.issue_TradeMark_Text;
          break;
        case "M4":
          state.issueText = state.issue.issue_History_Text;
          break;
        case "M5":
          state.issueText = state.issue.issue_Format_Text;
          break;
        default:
          state.issueText = state.issue.issue_Match_Text;
      }
    },
    loadCompanyInfo(state, dbcompanyInfo) {
      state.compInfo.nrNumber = dbcompanyInfo.nrNumber
      state.compInfo.compNames.compName1 = dbcompanyInfo.compName1
      state.compInfo.compNames.compName2 = dbcompanyInfo.compName2
      state.compInfo.compNames.compName3 = dbcompanyInfo.compName3
      state.compInfo.requestType = dbcompanyInfo.requestType
      state.applicantInfo.applicantname.firstName = dbcompanyInfo.firstName
      state.applicantInfo.applicantname.lastname = dbcompanyInfo.lastName
      state.applicantInfo.contactInfo.address = dbcompanyInfo.address
      state.applicantInfo.contactInfo.contactName = dbcompanyInfo.contactName
      state.applicantInfo.contactInfo.phone = dbcompanyInfo.phone
      state.applicantInfo.contactInfo.email = dbcompanyInfo.email
      state.applicantInfo.contactInfo.fax = dbcompanyInfo.fax
      state.additionalCompInfo.jurisdiction = dbcompanyInfo.jurisdiction
      state.additionalCompInfo.natureOfBussiness = dbcompanyInfo.natureOfBusiness
      state.additionalCompInfo.nuans = dbcompanyInfo.nuans
      state.additionalCompInfo.sk_name = dbcompanyInfo.sk_name
      state.additionalCompInfo.nr_status = dbcompanyInfo.nr_status
      state.examiner = dbcompanyInfo.examiner
      state.priority = dbcompanyInfo.priority
      state.reSubmission.reSubmissionYN = dbcompanyInfo.resubmissionYN
      state.reSubmission.linkedNR = dbcompanyInfo.linkedNR
      state.reservationCount = dbcompanyInfo.reservationCount
      state.expiryDate = dbcompanyInfo.expiryDate
      state.issue.issue_Match = dbcompanyInfo.isue_Match
      state.issue.issue_Match_Text = dbcompanyInfo.issue_Match_Text
      state.issue.issue_Consent = dbcompanyInfo.issue_Consent
      state.issue.issue_Consent_Text = dbcompanyInfo.issue_Consent_Text
      state.issue.issue_TradeMark = dbcompanyInfo.issue_TradeMark
      state.issue.issue_TradeMark_Text = dbcompanyInfo.issue_TradeMark_Text
      state.issue.issue_History = dbcompanyInfo.issue_History
      state.issue.issue_History_Text = dbcompanyInfo.issue_History_Text
      state.issue.issue_Format = dbcompanyInfo.issue_Format
      state.issue.issue_Format_Text = dbcompanyInfo.issue_Format_Text
    },
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
    storeActionPage ({commit, dispatch}, configSetup) {
      console.log('action: saving test values from action page')
      localStorage.setItem('t1', configSetup.t1)
      localStorage.setItem('t2', configSetup.t2)
    },
    selectNameIssue ({commit, dispatch, state}, divID) {
      console.log('action: selected issue control:' + divID)
      localStorage.setItem('issueText',divID )
      commit('setIssueText', divID)
    },
    selectNextCompany ({commit, dispatch, state}) {
      console.log('action: selected next company from DB')
      globalAxios.defaults.baseURL = "https://namer-77fa5.firebaseio.com"
      globalAxios.get('/CompanyInfo.json' + '?auth=' + state.idToken)
        .then(res => {
          console.log(res)
          const data = res.data
          commit('loadCompanyInfo',data)
        })
        .catch(error => console.log(error))
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
    user(state) {
      return state.user
    },
    email(state) {
      return state.email
    },
    issueText(state) {
      return state.issueText
    },
    isAuthenticated(state) {
      return state.idToken !== null
    },
    nrNumber(state) {
      return state.compInfo.nrNumber
    },
    compName1(state) {
     return state.compInfo.compNames.compName1
    },
    compName2(state) {
      return state.compInfo.compNames.compName2
    },
    compName3(state) {
      return state.compInfo.compNames.compName3
    },
    requestType(state) {
      return state.compInfo.requestType
    },
    firstName(state) {
      return state.applicantInfo.applicantname.firstName
    },
    lastName(state) {
      return state.applicantInfo.applicantname.lastname
    },
    address(state) {
      return state.applicantInfo.contactInfo.address
    },
    conEmail(state) {
      return  state.applicantInfo.contactInfo.email
    },
    contactName(state) {
      return state.applicantInfo.contactInfo.contactName
    },
    phone(state) {
      return state.applicantInfo.contactInfo.phone
    },
    fax(state) {
      return state.applicantInfo.contactInfo.fax
    },
    jurisdiction(state) {
      return  state.additionalCompInfo.jurisdiction
    },
    natureOfBusiness(state) {
      return state.additionalCompInfo.natureOfBussiness
    },
    nuans(state) {
      return state.additionalCompInfo.nuans
    },
    sk_name(state) {
      return state.additionalCompInfo.sk_name
    },
    nr_status(state) {
      return state.additionalCompInfo.nr_status
    },
    examiner(state) {
      return state.examiner
    },
    priority(state) {
      return state.priority
    },
    reSubmissionYN(state) {
      return state.reSubmission.reSubmissionYN
    },
    linkedNR(state) {
      return state.reSubmission.linkedNR
    },
    reservationCount(state) {
      return state.reservationCount
    },
    expiryDate(state) {
      return state.expiryDate
    },
    issue_Match(state) {
      return state.issue.issue_Match
    },
    issue_Match_Text(state) {
      return state.issue.issue_Match_Text
    },
    issue_Consent(state) {
      return state.issue.issue_Consent
    },
    issue_Consent_Text(state) {
      return state.issue.issue_Consent_Text
    },
    issue_TradeMark(state) {
      return state.issue.issue_TradeMark
    },
    issue_TradeMark_Text(state) {
      return state.issue.issue_TradeMark_Text
    },
    issue_History(state) {
      return state.issue.issue_History
    },
    issue_History_Text(state) {
      return state.issue.issue_History_Text
    },
    issue_Format(state) {
      return state.issue.issue_Format
    },
    issue_Format_Text(state) {
      return state.issue.issue_Format_Text
    }
  }
})
