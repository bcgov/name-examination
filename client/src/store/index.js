/* eslint-disable */
import Vue from 'vue'
import Vuex from 'vuex'
import axios from '../axios-auth'
import globalAxios from 'axios'
import router from '@/router'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    nrNum: null,
    authorized: null,
    userId: null,
    email: null,
    kctoken: null,
    nr_conflict: null,
    user_role: null,
    currentChoice: null,
    currentName: null,
    currentState: null,
    is_editing: false,
    nrData: null,
    details: null,
   // formData: {
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
  //  },
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
      state.kctoken = userData
      //state.kctoken = userData.client_session
      //state.userRole = userData.user_role
      //state.idToken = userData.client_session
    },

    clearAuthData (state) {
      state.kcToken = null
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

    loadpostgresNo(state, postgresData) {
        state.compInfo.nrNumber = postgresData.nameRequest
    },

    loadCompanyInfo(state, dbcompanyInfo) {
      console.log('Loading Company Info into state')

      state.nrData = dbcompanyInfo

      if (dbcompanyInfo.names.length == 0) {
        console.log('Error, No company names found')
        return
      } else {
        for (let record of dbcompanyInfo.names) {
          switch (record.choice) {
            case 1:
              state.compInfo.compNames.compName1 = record.name
              break;
            case 2:
              state.compInfo.compNames.compName2 = record.name
              break;
            case 3:
              state.compInfo.compNames.compName3 = record.name
              break;
            default:
              console.log('Error with company name structure')
              return
          }
        }
      }

      state.compInfo.requestType = dbcompanyInfo.requestTypeCd
      state.applicantInfo.applicantname.firstName = dbcompanyInfo.applicant
      //state.applicantInfo.applicantname.lastname = dbcompanyInfo.lastName
      //state.applicantInfo.contactInfo.address = dbcompanyInfo.address
      state.applicantInfo.contactInfo.contactName = dbcompanyInfo.contact
      state.applicantInfo.contactInfo.phone = dbcompanyInfo.phoneNumber
      //state.applicantInfo.contactInfo.email = dbcompanyInfo.email
      //state.applicantInfo.contactInfo.fax = dbcompanyInfo.fax
      state.additionalCompInfo.jurisdiction = dbcompanyInfo.xproJurisdiction
      state.additionalCompInfo.natureOfBussiness = dbcompanyInfo.natureBusinessInfo
      state.additionalCompInfo.nuans = dbcompanyInfo.nuansNum
      state.additionalCompInfo.sk_name = dbcompanyInfo.skPartner
      state.additionalCompInfo.nr_status = dbcompanyInfo.state
      state.examiner = dbcompanyInfo.userId
      state.priority = dbcompanyInfo.priorityCD
      //state.reSubmission.reSubmissionYN = dbcompanyInfo.resubmissionYN
      //state.reSubmission.linkedNR = dbcompanyInfo.linkedNR
      //state.reservationCount = dbcompanyInfo.reservationCount
      state.expiryDate = dbcompanyInfo.expiryDate
    },

    loadCompanyIssues(state, dbcompanyIssues) {
      //state.issue.issue_Match = dbcompanyIssues.isue_Match
      //state.issue.issue_Match_Text = dbcompanyIssues.issue_Match_Text
      //state.issue.issue_Consent = dbcompanyIssues.issue_Consent
      //state.issue.issue_Consent_Text = dbcompanyIssues.issue_Consent_Text
      //state.issue.issue_TradeMark = dbcompanyIssues.issue_TradeMark
      //state.issue.issue_TradeMark_Text = dbcompanyIssues.issue_TradeMark_Text
      //state.issue.issue_History = dbcompanyIssues.issue_History
      //state.issue.issue_History_Text = dbcompanyIssues.issue_History_Text
      //state.issue.issue_Format = dbcompanyIssues.issue_Format
      //state.issue.issue_Format_Text = dbcompanyIssues.issue_Format_Text
    },

    update_nrData(state){

      if(state.nrData.names.length == 0) {
        console.log('Error, No company names found')
        return
      } else {
        for (let record of state.nrData.names) {
          switch (record.choice) {
            case 1:
              state.nrData.names[0].name = state.compInfo.compNames.compName1
              break;
            case 2:
              state.nrData.names[0].name = state.compInfo.compNames.compName2
              break;
            case 3:
              state.nrData.names[0].name = state.compInfo.compNames.compName3
              break;
          }
        }
      }

      state.nrData.requestTypeCd = state.compInfo.requestType
      state.nrData.applicant = state.applicantInfo.applicantname.firstName
      //state.applicantInfo.applicantname.lastname = dbcompanyInfo.lastName
      //state.applicantInfo.contactInfo.address = dbcompanyInfo.address
      state.nrData.contact = state.applicantInfo.contactInfo.contactName
      state.nrData.phoneNumber =  state.applicantInfo.contactInfo.phone
      //state.applicantInfo.contactInfo.email = dbcompanyInfo.email
      //state.applicantInfo.contactInfo.fax = dbcompanyInfo.fax
      state.nrData.xproJurisdiction = state.additionalCompInfo.jurisdiction
      state.nrData.natureBusinessInfo = state.additionalCompInfo.natureOfBussiness
      state.nrData.nuansNum = state.additionalCompInfo.nuans
      state.nrData.skPartner = state.additionalCompInfo.sk_name
      //state.nrData.state =  state.additionalCompInfo.nr_status
      state.nrData.userId = state.examiner
      state.nrData.priorityCD = state.priority
      //state.reSubmission.reSubmissionYN = dbcompanyInfo.resubmissionYN
      //state.reSubmission.linkedNR = dbcompanyInfo.linkedNR
      //state.reservationCount = dbcompanyInfo.reservationCount
      state.nrData.expiryDate = state.expiryDate
    },

    saveDetail(state,detail){
      state.details = detail
    }
  },

  actions: {
    kcauth ({commit, dispatch, state}) {
      const kc = localStorage.getItem('KEYCLOAK_TOKEN')
      state.kctoken = kc
      //console.log(authData)
      //state.user_role =  authData.realm_access.roles,
      state.user_role = ''
      state.idToken = kc
      localStorage.setItem('kctoken',state.kctoken)
      localStorage.setItem('user_role',state.user_role)

      if (state.kctoken){
        console.log('KC Authorized user roles')
        commit('authUser', {
          //user_role: state.user_role,
          kctoken: state.kctoken
        })
      }
    },

    logout ({commit,state}) {

      commit('clearAuthData')

      localStorage.removeItem('expirationDate')
      localStorage.removeItem('token')
      localStorage.removeItem('user_role')
      localStorage.removeItem('userId')
      localStorage.removeItem('email')
      localStorage.removeItem('COMPINFO')

      localStorage.removeItem('kctoken')
      localStorage.removeItem('KEYCLOAK_TOKEN')
      localStorage.removeItem('AUTHORIZED')
      localStorage.removeItem('USERNAME')

    },

    tryAutoLogin ({commit}) {
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
    },

    setDetails({commit, state}) {
     var detail = state.details?null:"1";
     commit('saveDetail',detail)
    },

    selectNameIssue ({commit, dispatch, state}, divID) {
      console.log('action: selected issue control:' + divID)
      localStorage.setItem('issueText',divID )
      commit('setIssueText', divID)
    },

    getpostgrescompNo ({commit, dispatch, state}) {
      console.log('action: select next company number from postgres')
      const myToken = localStorage.getItem('KEYCLOAK_TOKEN')
      const url = '/api/v1/requests/queues/@me/oldest'
      const vm = this
      return axios.get(url, {headers: {Authorization: `Bearer ${myToken}`}}).then(response => {
        console.log('Comp No Response:' + response)
        commit('loadpostgresNo',response.data)
      })
    },

    getpostgrescompInfo ({commit},nrNumber) {
      console.log('action: getting data for company number: ' + nrNumber + ' from postgres')
      const myToken = localStorage.getItem('KEYCLOAK_TOKEN')
      const url = '/api/v1/requests/' + nrNumber
      console.log('URL:' + url)
      const vm = this
      return axios.get(url, {headers: {Authorization: `Bearer ${myToken}`}}).then(response => {
        console.log('Comp Info Response:' + response.data)
        localStorage.setItem('COMPINFO',response.data)
        commit('loadCompanyInfo',response.data)
      })
      .catch(error => console.log('ERROR: ' + error))
    },

    updateNRState ({state},nrState) {
      console.log('Updating Examination state for number: ' + state.compInfo.nrNumber)
      const myToken = localStorage.getItem('KEYCLOAK_TOKEN')
      const url = '/api/v1/requests/' + state.compInfo.nrNumber

      axios.patch(url,{headers: {Authorization: `Bearer ${myToken}`}},{"state": nrState} )
           .then(function(response){
                console.log('state updated to ' + nrState + ' for ' + state.compInfo.nrNumber)
            })
            .catch(error => console.log('ERROR: ' + error))
      },

    nameApproved( {commit, state}) {
      console.log('Name Approved for ' + state.compInfo.nrNumber + ", " + state.currentName)
      const myToken = localStorage.getItem('KEYCLOAK_TOKEN')
      state.nrData.state = 'APPROVED'
      commit('update_nrData')
      const url = '/api/v1/requests/' + state.compInfo.nrNumber
      axios.put(url, state.nrData, {headers: {Authorization: `Bearer ${myToken}`}})
           .then(function(response){
              console.log('Name approved for ' + state.compInfo.nrNumber)
           })
           .catch(error => console.log('ERROR: ' + error))
    },

    nameRejected({commit, state}) {
      console.log('Name Rejected for NR #' + state.compInfo.nrNumber)
      const myToken = localStorage.getItem('KEYCLOAK_TOKEN')
      state.nrData.state = 'REJECTED'
      commit('update_nrData')
      const url = '/api/v1/requests/' + state.compInfo.nrNumber
      axios.put(url,state.nrData, {headers: {Authorization: `Bearer ${myToken}`}})
           .then(function(response){
              console.log('Name rejected for ' +  state.compInfo.nrNumber)
            })
            .catch(error => console.log('ERROR: ' + error))
    }
  },

  getters: {
    is_editing(state) {
      return state.is_editing
    },
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
      return localStorage.getItem("AUTHORIZED")
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
    },
    details(state) {
      return state.details
    },
    addInfo(state) {
      return state.details
    }
  }
})
