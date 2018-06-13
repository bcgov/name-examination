/* eslint-disable */
import Vue from 'vue'
import Vuex from 'vuex'
import axios from '../axios-auth'
import globalAxios from 'axios'
import router from '@/router'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    //User Info
    userId: null,
    authorized: null,
    email: null,
    kctoken: null,
    user_role: null,

    //Interface settings
    currentChoice: 1,
    currentName: null, // CURRENT NAME BEING EXAMINED
    currentState: null, // APPROVED, REJECTED, INPROGRESS ETC...

    currentConflictNumber: null, // nrNumber of the conflict name currently in focus
    currentConflictName: null, // name of the current conflict
    currentConflictSource: null, // the type of nr; corps or names

    is_editing: false,
    is_header_shown: false,
    is_my_current: false,
    furnished: null,
    listPriorities: null, // DROP LIST
    listJurisdictions: null, // DROP LIST
    listRequestTypes: null, // DROP LIST

    //Names Data
    //nr_conflict: null,
    details: null,
    additionalInfo: null,
    internalComments: null,
    applicantsOrigData: null,
    nrData: null,
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
      clientName: {
        firstName: null,
        lastName: null,
      },
      applicantName: {
        firstName: null,
        lastName: null,
        middleName: null
      },
      contactInfo: {
        addressLine1: null,
        addressLine2: null,
        addressLine3: null,
        city: null,
        province: null,
        postalCode: null,
        country: null,
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
    submittedDate: null,
    expiryDate: null,
    issueText: null,

    //TODO
    conflictList: null,
    conflictHighlighting: null,
    conflictNames: null,
    conflictResponse: null,
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
    },
    CONFLICT: {
      nrNumber: null,
      compNames: {
        compName1: null,
        compName2: null,
        compName3: null
      },
      applicantInfo: {
        clientName: {
          firstName: null,
          lastName: null,
        },
        applicantName: {
          firstName: null,
          lastName: null,
          middleName: null
        },
        contactInfo: {
          addressLine1: null,
          addressLine2: null,
          addressLine3: null,
          city: null,
          province: null,
          postalCode: null,
          country: null,
          contactName: null,
          phone: null,
          email: null,
          fax: null
        },
      },
      additionalCompInfo: {
        natureOfBussiness: null,
        nr_status: null
      }
    },
    corpConflictInfo: null
  },

  mutations: {
    requestType (state, value) {
      state.compInfo.requestType = value;
    },
    currentState(state, value) {
      state.currentState = value;
    },
    compName1(state, value) {
      state.compInfo.compNames.compName1 = value;
    },
    compName2(state, value) {
      state.compInfo.compNames.compName2 = value;
    },
    compName3(state, value) {
      state.compInfo.compNames.compName3 = value;
    },
    clientFirstName (state, value) {
      state.applicantInfo.clientName.firstName = value;
    },
    clientLastName(state, value) {
      state.applicantInfo.clientName.lastName = value;
    },
    firstName (state, value) {
      state.applicantInfo.applicantName.firstName = value;
    },
    middleName(state, value) {
      state.applicantInfo.applicantName.middleName = value;
    },
    lastName (state, value) {
      state.applicantInfo.applicantName.lastName = value;
    },
    addressLine1 (state, value) {
      state.applicantInfo.contactInfo.addressLine1 = value;
    },
    addressLine2 (state, value) {
      state.applicantInfo.contactInfo.addressLine2 = value;
    },
    addressLine3 (state, value) {
      state.applicantInfo.contactInfo.addressLine3 = value;
    },
    city (state, value) {
      state.applicantInfo.contactInfo.city = value;
    },
    province (state, value) {
      state.applicantInfo.contactInfo.province = value;
    },
    country (state, value) {
      state.applicantInfo.contactInfo.country = value;
    },
    postalCode (state, value) {
      state.applicantInfo.contactInfo.postalCode = value;
    },
    contactName (state, value) {
      state.applicantInfo.contactInfo.contactName = value;
    },
    phone (state, value) {
      state.applicantInfo.contactInfo.phone = value;
    },
    conEmail (state, value) {
      state.applicantInfo.contactInfo.email = value;
    },
    fax (state, value) {
      state.applicantInfo.contactInfo.fax = value;
    },
    jurisdiction (state, value) {
      state.additionalCompInfo.jurisdiction = value;
    },
    natureOfBusiness (state, value) {
      state.additionalCompInfo.natureOfBussiness = value;
    },
    nuans (state, value) {
      state.additionalCompInfo.nuans = value;
    },
    sk_name (state, value) {
      state.additionalCompInfo.sk_name = value;
    },
    nr_status (state, value) {
      state.additionalCompInfo.nr_status = value;
    },
    resubmissionYN (state, value) {
      state.reSubmission.reSubmissionYN = value;
    },
    linkedNR (state, value) {
      state.reSubmission.linkedNR = value;
    },
    reservationCount (state, value) {
      state.reservationCount = value;
    },
    expiryDate (state, value) {
      state.expiryDate = value;
    },
    details (state, value) {
      state.details = value;
    },
    additionalInfo (state, value) {
      state.additionalInfo = value;
    },
    internalComments (state, value) {
      state.internalComments = value;
    },
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


      state.currentState = dbcompanyInfo.state;
      state.compInfo.requestType = dbcompanyInfo.requestTypeCd

      // we keep the original data so that if fields exist that we do not use, we don't lose that
      // data when we put new data
      state.applicantOrigData = dbcompanyInfo.applicants
      state.applicantInfo.clientName.firstName = dbcompanyInfo.applicants.clientFirstName
      state.applicantInfo.clientName.lastName = dbcompanyInfo.applicants.clientLastName
      state.applicantInfo.applicantName.firstName = dbcompanyInfo.applicants.firstName
      state.applicantInfo.applicantName.middleName = dbcompanyInfo.applicants.middleName
      state.applicantInfo.applicantName.lastName = dbcompanyInfo.applicants.lastName
      state.applicantInfo.contactInfo.addressLine1 = dbcompanyInfo.applicants.addrLine1
      state.applicantInfo.contactInfo.addressLine2 = dbcompanyInfo.applicants.addrLine2
      state.applicantInfo.contactInfo.addressLine3 = dbcompanyInfo.applicants.addrLine3
      state.applicantInfo.contactInfo.city = dbcompanyInfo.applicants.city
      state.applicantInfo.contactInfo.province = dbcompanyInfo.applicants.stateProvinceCd
      state.applicantInfo.contactInfo.postalCode = dbcompanyInfo.applicants.postalCd
      state.applicantInfo.contactInfo.country = dbcompanyInfo.applicants.countryTypeCd
      state.applicantInfo.contactInfo.contactName = dbcompanyInfo.applicants.contact
      state.applicantInfo.contactInfo.phone = dbcompanyInfo.applicants.phoneNumber
      state.applicantInfo.contactInfo.email = dbcompanyInfo.applicants.emailAddress
      state.applicantInfo.contactInfo.fax = dbcompanyInfo.applicants.faxNumber




      state.additionalCompInfo.jurisdiction = dbcompanyInfo.xproJurisdiction
      state.additionalCompInfo.natureOfBussiness = dbcompanyInfo.natureBusinessInfo
      //state.details = dbcompanyInfo.details
      state.additionalInfo = dbcompanyInfo.additionalInfo
      state.internalComments = dbcompanyInfo.comments
      state.additionalCompInfo.nuans = dbcompanyInfo.nuansNum
      state.additionalCompInfo.sk_name = dbcompanyInfo.skPartner
      state.additionalCompInfo.nr_status = dbcompanyInfo.state
      state.examiner = dbcompanyInfo.userId
      state.priority = dbcompanyInfo.priorityCd
      //state.reSubmission.reSubmissionYN = dbcompanyInfo.resubmissionYN
      //state.reSubmission.linkedNR = dbcompanyInfo.linkedNR
      //state.reservationCount = dbcompanyInfo.reservationCount
      state.expiryDate = dbcompanyInfo.expiryDate
      state.submittedDate = dbcompanyInfo.submittedDate
    },

    loadNamesConflictInfo(state,conflictInfoData){
      console.log('Loading conflict Info into state')
      'CONFLICT'
      if (conflictInfoData.names.length == 0) {
        console.log('Error, No conflict data found')
        return
      } else {
        //USE STATE TO DETERMINE WHICH NAME IS VALID
        state.currentState = conflictInfoData.state;
        for (let record of conflictInfoData.names) {
          switch (record.choice) {
            case 1:
              state.CONFLICT.compInfo.compNames.compName1 = record.name
              break;
            case 2:
              state.CONFLICT.compInfo.compNames.compName2 = record.name
              break;
            case 3:
              state.CONFLICT.compInfo.compNames.compName3 = record.name
              break;
            default:
              console.log('Error with company name structure')
              return
          }
        }
      }

      state.CONFLICT.applicantInfo.clientName.firstName = conflictInfoData.applicants.clientFirstName
      state.CONFLICT.applicantInfo.clientName.lastName = conflictInfoData.applicants.clientLastName
      state.CONFLICT.applicantInfo.applicantName.firstName = conflictInfoData.applicants.firstName
      state.CONFLICT.applicantInfo.applicantName.middleName = conflictInfoData.applicants.middleName
      state.CONFLICT.applicantInfo.applicantName.lastName = conflictInfoData.applicants.lastName
      state.CONFLICT.applicantInfo.contactInfo.addressLine1 = conflictInfoData.applicants.addrLine1
      state.CONFLICT.applicantInfo.contactInfo.addressLine2 = conflictInfoData.applicants.addrLine2
      state.CONFLICT.applicantInfo.contactInfo.addressLine3 = conflictInfoData.applicants.addrLine3
      state.CONFLICT.applicantInfo.contactInfo.city = conflictInfoData.applicants.city
      state.CONFLICT.applicantInfo.contactInfo.province = conflictInfoData.applicants.stateProvinceCd
      state.CONFLICT.applicantInfo.contactInfo.postalCode = conflictInfoData.applicants.postalCd
      state.CONFLICT.applicantInfo.contactInfo.country = conflictInfoData.applicants.countryTypeCd
      state.CONFLICT.applicantInfo.contactInfo.contactName = conflictInfoData.applicants.contact
      state.CONFLICT.applicantInfo.contactInfo.phone = conflictInfoData.applicants.phoneNumber
      state.CONFLICT.applicantInfo.contactInfo.email = conflictInfoData.applicants.emailAddress
      state.CONFLICT.applicantInfo.contactInfo.fax = conflictInfoData.applicants.faxNumber
      state.CONFLICT.additionalCompInfo.natureOfBussiness = conflictInfoData.natureBusinessInfo

    },

    loadCorpConflictInfo(state,conflictInfoData){
      console.log('Loading conflict Info into state')
      'CONFLICT'
      state.corpConflictInfo = conflictInfoData
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
              state.nrData.names[1].name = state.compInfo.compNames.compName2
              break;
            case 3:
              state.nrData.names[2].name = state.compInfo.compNames.compName3
              break;
          }
        }
      }

      state.nrData.requestTypeCd = state.compInfo.requestType

      state.applicantOrigData.clientFirstName = state.applicantInfo.clientName.firstName
      state.applicantOrigData.clientLastName = state.applicantInfo.clientName.lastName
      state.applicantOrigData.firstName = state.applicantInfo.applicantName.firstName
      state.applicantOrigData.lastName = state.applicantInfo.applicantName.lastName
      state.applicantOrigData.middleName = state.applicantInfo.applicantName.middleName
      state.applicantOrigData.addrLine1 = state.applicantInfo.contactInfo.addressLine1
      state.applicantOrigData.addrLine2 = state.applicantInfo.contactInfo.addressLine2
      state.applicantOrigData.addrLine3 = state.applicantInfo.contactInfo.addressLine3
      state.applicantOrigData.city = state.applicantInfo.contactInfo.city
      state.applicantOrigData.stateProvinceCd = state.applicantInfo.contactInfo.province
      state.applicantOrigData.postalCd = state.applicantInfo.contactInfo.postalCode
      state.applicantOrigData.countryTypeCd = state.applicantInfo.contactInfo.country
      state.applicantOrigData.contact = state.applicantInfo.contactInfo.contactName
      state.applicantOrigData.phoneNumber = state.applicantInfo.contactInfo.phone
      state.applicantOrigData.emailAddress = state.applicantInfo.contactInfo.email
      state.applicantOrigData.faxNumber = state.applicantInfo.contactInfo.fax
      state.nrData.applicants = state.applicantOrigData

      state.nrData.xproJurisdiction = state.additionalCompInfo.jurisdiction
      state.nrData.natureBusinessInfo = state.additionalCompInfo.natureOfBussiness
      state.nrData.details = state.details
      state.nrData.additionalInfo = state.additionalInfo
      state.nrData.comments = state.internalComments
      state.nrData.nuansNum = state.additionalCompInfo.nuans
      state.nrData.skPartner = state.additionalCompInfo.sk_name
      //state.nrData.state =  state.additionalCompInfo.nr_status
      state.nrData.userId = state.examiner
      state.nrData.priorityCd = state.priority
      //state.reSubmission.reSubmissionYN = dbcompanyInfo.resubmissionYN
      //state.reSubmission.linkedNR = dbcompanyInfo.linkedNR
      //state.reservationCount = dbcompanyInfo.reservationCount
      state.nrData.expiryDate = state.expiryDate
      state.nrData.submittedDate = state.submittedDate
    },

    loadCompanyIssues(state, dbcompanyIssues) {
    },

    saveDetail(state,detail){
      state.details = detail
    },
    listPriorities (state, value) {
      state.listPriorities = value;
    },
    listJurisdictions (state, value) {
      state.listJurisdictions = value;
    },
    listRequestTypes (state, value) {
      state.listRequestTypes = value;
    },
    is_my_current(state, value) {
      state.is_my_current = value;
    },

    setNextChoice(state,values){
      console.log('Setting Next choice values')
      state.currentChoice = values.value
      state.currentName = state.nrData.names[state.currentChoice-1].name
    },

    setConfig(state,configValues) {
    },

    setConflicts(state,conflictJSon) {
      console.log('setting conflict values')
      //TODO - Mutations: interate thru list of conflicts
      state.solrConflicts = conflictJSon

      //3 sections from the solr json array :
      // Highlights : used for colouring results
      // Names : the actual names found that might be conflicting
      // Response : statistics on the results found; max score; number of conflicts found;
      state.conflictHighlighting =  state.solrConflicts['highlighting']
      state.conflictNames =  state.solrConflicts['names']
      state.conflictResponse =  state.solrConflicts['response']

      var k
      var c = 0
      state.conflictList = new Array()
      for( k in state.conflictNames) {
        var mID = state.conflictNames[c].id
        //Iterate through the list of names to create a new object that has the fields needed
        //state.conflictList.push({nrNumber: mID, text: conflictJSon['highlighting'][mID]['name'][0]})
        state.conflictList.push({nrNumber: mID, text: state.conflictNames[c].name, source: state.conflictNames[c].source})
        c++
      }
    },

    currentMatch(state,value){
      state.currentConflictNumber = value.value
      state.currentConflictName = value.text
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
        console.log('Comp No Response:');
        console.log(response);
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
        commit('is_my_current', true);
      })
      .catch(error => console.log('ERROR: ' + error))
    },

    updateNRState ({state},nrState) {
      console.log('Updating Examination state for number ' + state.compInfo.nrNumber + ' to ' + nrState)
      const myToken = localStorage.getItem('KEYCLOAK_TOKEN')
      const url = '/api/v1/requests/' + state.compInfo.nrNumber

      axios.patch(url,{headers: {Authorization: `Bearer ${myToken}`}},{"state": nrState} )
           .then(function(response){
                console.log('state updated to ' + nrState + ' for ' + state.compInfo.nrNumber);
                commit('currentState', nrState); // TODO - need this?
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
    },

    //updates the names data, throught the api, into the database
    updateRequest( {commit, state}) {
      const myToken = localStorage.getItem('KEYCLOAK_TOKEN')
      commit('update_nrData')
      const url = '/api/v1/requests/' + state.compInfo.nrNumber
      axios.put(url, state.nrData, {headers: {Authorization: `Bearer ${myToken}`}})
           .then(function(response){
              console.log('Request updated for ' + state.compInfo.nrNumber)
           })
           .catch(error => console.log('ERROR: ' + error))
    },

    loadDropdowns( {commit, state} ) {
      var json_files_path = 'static/ui_dropdowns/';
      // jurisdictions - first list 1, then list 2
      if (state.listJurisdictions === null) {
        readJFile(json_files_path + 'jurisdiction 1.json', function (myArray) {
          commit('listJurisdictions', myArray);

          readJFile(json_files_path + 'jurisdiction 2.json', function (myArray) {
            commit('listJurisdictions', state.listJurisdictions.concat(myArray));
          });
        });
      }

      // request types
      if (state.listRequestTypes === null) {
        readJFile(json_files_path + 'requesttype.json', function (myArray) { commit('listRequestTypes', myArray);})
      }

    },

    loadConfig( {commit, state}) {
      //TODO - Actions: finish loading config values
      if(state.config===null) {
        readJFile('static/config/config.json', function (myArray) {
          commit('setConfig', myArray);
        });
      }
    },

    checkConflicts( {commit, state} ) {
      //TODO - Actions: finish loading conflict list
      console.log('action: getting conflicts for company number: ' + state.compInfo.nrNumber + ' from solr')
      const myToken = localStorage.getItem('KEYCLOAK_TOKEN')
      const url = '/api/v1/requests/' + state.compInfo.nrNumber + '/analysis/' + state.currentChoice + '/conflicts'
      console.log('URL:' + url)
      const vm = this
      return axios.get(url, {headers: {Authorization: `Bearer ${myToken}`}}).then(response => {
        console.log('Comp Info Response:' + response.data)
        commit('setConflicts',response.data)
      })
        .catch(error => console.log('ERROR: ' + error))
    },

    nextChoice({commit, state},value) {
      console.log('Getting next choice values')
      var currName = state.nrData.names[value-1].name
      commit('setNextChoice',{value,currName})
    },


    getConflictInfo ({state,commit}) {
      console.log('Getting Conflict Info')
      if(state.currentConflictSource == "corp" ){
          this.dispatch('getNamesConflict')
      }else{
          this.dispatch('getCorpConflict')
      }
    },

    getNamesConflict ({state,commit}) {
      console.log('action: getting data for company number: ' + state.currentConflictNumber + ' from postgres')
      const myToken = localStorage.getItem('KEYCLOAK_TOKEN')
      const url = '/api/v1/requests/' + state.currentConflictNumber
      const vm = this
      return axios.get(url, {headers: {Authorization: `Bearer ${myToken}`}}).then(response => {
        console.log('Names Conflict Info:' + response.data)
        commit('loadNamesConflictInfo',response.data)
      })
        .catch(error => console.log('ERROR: ' + error))
    },


    getCorpConflict ({state,commit}) {
      console.log('action: getting data for company number: ' + state.currentConflictNumber + ' from postgres')
      const myToken = localStorage.getItem('KEYCLOAK_TOKEN')
      const url = '/api/v1/requests/' + state.currentConflictNumber
      const vm = this
      return axios.get(url, {headers: {Authorization: `Bearer ${myToken}`}}).then(response => {
        console.log('Corp Conflict Info:' + response.data)
        commit('loadCorpConflictInfo',response.data)
      })
        .catch(error => console.log('ERROR: ' + error))
    },

  },

  getters: {
    is_editing(state) {
      return state.is_editing
    },
    is_header_shown(state) {
      return state.is_header_shown
    },
    is_my_current(state) {
      return state.is_my_current
    },
    user(state) {
      return state.user
    },
    email(state) {
      return state.email
    },
    currentChoice(state) {
      return state.currentChoice;
    },
    currentState(state) {
      return state.currentState;
    },
    currentName(state) {
      return state.currentName;
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
    clientFirstName(state) {
      return state.applicantInfo.clientName.firstName
    },
    clientLastName(state) {
      return state.applicantInfo.clientName.lastName
    },
    firstName(state) {
      return state.applicantInfo.applicantName.firstName
    },
    middleName(state) {
      return state.applicantInfo.applicantName.middleName
    },
    lastName(state) {
      return state.applicantInfo.applicantName.lastName
    },
    addressLine1(state) {
      return state.applicantInfo.contactInfo.addressLine1
    },
    addressLine2(state) {
      return state.applicantInfo.contactInfo.addressLine2
    },
    addressLine3(state) {
      return state.applicantInfo.contactInfo.addressLine3
    },
    city(state) {
      return state.applicantInfo.contactInfo.city
    },
    province(state) {
      return state.applicantInfo.contactInfo.province
    },
    postalCode(state) {
      return state.applicantInfo.contactInfo.postalCode
    },
    country(state) {
      return state.applicantInfo.contactInfo.country
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
      if (state.priority == 'Y') return true;
      else return false;
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
    submittedDate(state) {
      return state.submittedDate;
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
    additionalInfo(state) {
      return state.additionalInfo
    },
    internalComments(state) {
      return state.internalComments
    },
    listPriorities(state) {
      return state.listPriorities
    },
    listJurisdictions(state) {
      return state.listJurisdictions
    },
    listRequestTypes(state) {
      return state.listRequestTypes
    },
    conflictList(state) {
      return state.conflictList
    },
    currentConflictNumber(state) {
      return state.currentConflictNumber
    },
    currentConflictName(state) {
      return state.currentConflictName
    },
    CONFLICTclientFirstName(state) {
      return state.CONFLICT.applicantInfo.clientName.firstName
    },
    CONFLICTclientLastName(state) {
      return state.CONFLICT.applicantInfo.clientName.lastName
    },
    CONFLICTfirstName(state) {
      return state.CONFLICT.applicantInfo.applicantName.firstName
    },
    CONFLICTmiddleName(state) {
      return state.CONFLICT.applicantInfo.applicantName.middleName
    },
    CONFLICTlastName(state) {
      return state.CONFLICT.applicantInfo.applicantName.lastName
    },
    CONFLICTaddressLine1(state) {
      return state.CONFLICT.applicantInfo.contactInfo.addressLine1
    },
    CONFLICTaddressLine2(state) {
      return state.CONFLICT.applicantInfo.contactInfo.addressLine2
    },
    CONFLICTaddressLine3(state) {
      return state.CONFLICT.applicantInfo.contactInfo.addressLine3
    },
    CONFLICTcity(state) {
      return state.CONFLICT.applicantInfo.contactInfo.city
    },
    CONFLICTprovince(state) {
      return state.CONFLICT.applicantInfo.contactInfo.province
    },
    CONFLICTpostalCode(state) {
      return state.CONFLICT.applicantInfo.contactInfo.postalCode
    },
    CONFLICTcountry(state) {
      return state.CONFLICT.applicantInfo.contactInfo.country
    },
    CONFLICTconEmail(state) {
      return  state.CONFLICT.applicantInfo.contactInfo.email
    },
    CONFLICTcontactName(state) {
      return state.CONFLICT.applicantInfo.contactInfo.contactName
    },
    CONFLICTphone(state) {
      return state.CONFLICT.applicantInfo.contactInfo.phone
    },
    CONFLICTfax(state) {
      return state.CONFLICT.applicantInfo.contactInfo.fax
    },
    CONFLICTnatureOfBusiness(state) {
      return state.additionalCompInfo.natureOfBussiness
    }
  }
})
