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
    currentChoice: null, // CURRENT NAME BEING EXAMINED (choice number)
    currentName: null, // CURRENT NAME BEING EXAMINED (string)
    currentNameObj: { // CURRENT NAME BEING EXAMINED (complete object)
      name: null,
      choice: null,
    },
    currentState: null, // NR - APPROVED, REJECTED, INPROGRESS ETC...

    currentConflict: null, // the conflict name currently in focus
    currentHistory: null,  //NR number of history name selected

    currentRecipeCard: null,
    is_editing: false,
    is_making_decision: false,
    decision_made: null,
    is_header_shown: false,
    furnished: null,
    listPriorities: null, // DROP LIST
    listJurisdictions: null, // DROP LIST
    listRequestTypes: null, // DROP LIST
    listDecisionReasons: null,

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
        compName1: {
          name: null,
          state: null,
          consumptionDate: null,
          conflict1: null,
          conflict2: null,
          conflict3: null,
          decision_text: null,
        },
        compName2: {
          name: null,
          state: null,
          consumptionDate: null,
          conflict1: null,
          conflict2: null,
          conflict3: null,
          decision_text: null,
        },
        compName3: {
          name: null,
          state: null,
          consumptionDate: null,
          conflict1: null,
          conflict2: null,
          conflict3: null,
          decision_text: null,
        },
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

    //TODO
    conflictList: null,
    conflictHighlighting: null,
    conflictNames: null,
    conflictResponse: null,

    conflictsJSON: null,
    corpConflictJSON: null,
    namesConflictJSON: null,
    trademarksJSON: null,
    historiesJSON: null,
    searchDataJSON: null,
    conditionsJSON: null
},
mutations: {
    requestType (state, value) {
      state.compInfo.requestType = value;
    },
    is_making_decision(state, value) {
      state.is_making_decision = value;
    },
    decision_made(state, value) {
      state.decision_made = value;
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
      }

      for (let record of dbcompanyInfo.names) {
        switch (record.choice) {
          case 1:
            state.compInfo.compNames.compName1.name = record.name
            state.compInfo.compNames.compName1.state = record.state
            state.compInfo.compNames.compName1.consumptionDate = record.consumptionDate
            state.compInfo.compNames.compName1.conflict1 = record.conflict1
            state.compInfo.compNames.compName1.conflict2 = record.conflict2
            state.compInfo.compNames.compName1.conflict3 = record.conflict3
            state.compInfo.compNames.compName1.decision_text = record.decision_text

            // if this name is not yet examined, set it as current name
            if (record.state == 'NE') {
              console.log('Set current name to name #1');
              this.dispatch('setCurrentName',record);
            }

            break;
          case 2:
            state.compInfo.compNames.compName2.name = record.name
            state.compInfo.compNames.compName2.state = record.state
            state.compInfo.compNames.compName2.consumptionDate = record.consumptionDate
            state.compInfo.compNames.compName2.conflict1 = record.conflict1
            state.compInfo.compNames.compName2.conflict2 = record.conflict2
            state.compInfo.compNames.compName2.conflict3 = record.conflict3
            state.compInfo.compNames.compName2.decision_text = record.decision_text

            // if this name is not yet examined, set it as current name
            if (record.state == 'NE' &&
              (record.choice < state.currentChoice || state.currentChoice == null)
            ) {
              console.log('Set current name to name #2');
              this.dispatch('setCurrentName',record);
            }

            break;
          case 3:
            state.compInfo.compNames.compName3.name = record.name
            state.compInfo.compNames.compName3.state = record.state
            state.compInfo.compNames.compName3.consumptionDate = record.consumptionDate
            state.compInfo.compNames.compName3.conflict1 = record.conflict1
            state.compInfo.compNames.compName3.conflict2 = record.conflict2
            state.compInfo.compNames.compName3.conflict3 = record.conflict3
            state.compInfo.compNames.compName3.decision_text = record.decision_text

            // if this name is not yet examined, set it as current name
            if (record.state == 'NE' &&
              (record.choice < state.currentChoice || state.currentChoice == null)
            ) {
              this.dispatch('setCurrentName',record);
            }

            break;
          default:
            console.log('Error with company name structure')
            return
        }
      }


      state.currentState = dbcompanyInfo.state;
      state.compInfo.requestType = dbcompanyInfo.requestTypeCd


      // if the current state is not INPROGRESS, clear any existing name record in currentNameObj
      if (state.currentState !== 'INPROGRESS') this.dispatch('setCurrentName',{});


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

    loadConflictsJSON(state,conflictData){
      console.log('Loading conflictsJSON into state')
      state.conflictsJSON = conflictData
    },

    loadNamesConflictJSON(state,conflictInfoData){
      console.log('Loading names conflict Info into state')
      state.namesConflictJSON = conflictInfoData
    },

    loadCorpConflictJSON(state,corpData){
      console.log('Loading corp conflict Info into state')
      state.corpConflictJSON = corpData
    },

    loadConditionsJSON(state,conditionsData){
      console.log('Loading conditions Info into state')
      state.conditionsJSON = conditionsData
    },

    loadHistoriesJSON(state,historiesData){
      console.log('Loading histories Data into state')
      state.historiesJSON = historiesData
    },

    loadTrademarksJSON(state,trademarksData){
     console.log('Loading trademarks data into state')
      state.trademarksJSON = trademarksData
    },

    loadSearchDataJSON(state,searchData){
      console.log('Loading search Data into state')
      state.searchDataJSON = searchData
    },

    update_nrData(state) {
      if(state.nrData.names.length == 0) {
        console.log('Error, No company names found')
        return
      } else {
        for (let record of state.nrData.names) {
          switch (record.choice) {
            case 1:
              state.nrData.names[0] = state.compInfo.compNames.compName1;
              break;
            case 2:
              state.nrData.names[1] = state.compInfo.compNames.compName2;
              break;
            case 3:
              state.nrData.names[2] = state.compInfo.compNames.compName3;
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
    listDecisionReasons (state, value) {
      state.listDecisionReasons = value;
    },
    currentRecipeCard(state,value){
      state.currentRecipeCard = value
    },
    currentNameObj(state,value){
      state.currentNameObj = value

      // also set currentName and currentChoice
      state.currentName = value.name;
      state.currentChoice = value.choice;
    },
    currentChoice(state,value){
      console.log('Setting current choice to ' + value)
      state.currentChoice = value

      // also set in currentNameObj
      state.currentNameObj.choice = value
    },
    currentName(state,value){
      state.currentName = value

      // also set in currentNameObj
      state.currentNameObj.name = value
    },
    setConfig(state,configValues) {
    },
    nrNumber(state,value){
      state.compInfo.nrNumber = value
    },

    setConflicts(state,conflictJSon) {
      console.log('setting conflict values')
      //TODO - Mutations: interate thru list of conflicts

      //3 sections from the solr json array :
      // Highlights : used for colouring results
      // Names : the actual names found that might be conflicting
      // Response : statistics on the results found; max score; number of conflicts found;
      state.conflictHighlighting =  conflictJSon['highlighting']
      state.conflictNames =  conflictJSon['names']
      state.conflictResponse =  conflictJSon['response']

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

    currentConflict(state,value){
      state.currentConflict = value
    },

    historyMatch(state,value){
      state.currentHistory = value
    },

    nrNumber(state,value) {
      state.compInfo.nrNumber = value;
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

    getpostgrescompNo ({commit, dispatch, state}) {
      console.log('action: select next company number from postgres')
      const myToken = localStorage.getItem('KEYCLOAK_TOKEN')
      const url = '/api/v1/requests/queues/@me/oldest'
      const vm = this
      return axios.get(url, {headers: {Authorization: `Bearer ${myToken}`}}).then(response => {
        //response.data.nameRequest = 'NR 8270105';
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
      })
      .catch(error => console.log('ERROR: ' + error))
    },

    updateNRState ({commit, state, dispatch},nrState) {
      console.log('Updating Examination state for number ' + state.compInfo.nrNumber + ' to ' + nrState)
      const myToken = localStorage.getItem('KEYCLOAK_TOKEN')
      const url = '/api/v1/requests/' + state.compInfo.nrNumber

      axios.patch(url,{"state": nrState} ,{headers: {Authorization: `Bearer ${myToken}`}})
           .then(function(response){
                console.log('state updated to ' + nrState + ' for ' + state.compInfo.nrNumber);
                commit('currentState', nrState);
                dispatch('getpostgrescompInfo', state.compInfo.nrNumber);

            })
            .catch(error => console.log('ERROR: ' + error))
      },

    nameAcceptReject( {commit, dispatch, state}) {
      console.log('Name Accepted/Rejected for ' + state.compInfo.nrNumber + ", " + state.currentName)
      console.log(state.currentNameObj);
      const myToken = localStorage.getItem('KEYCLOAK_TOKEN')
      const url = '/api/v1/requests/' + state.compInfo.nrNumber + '/names/' + state.currentChoice;
      axios.put(url, state.currentNameObj, {headers: {Authorization: `Bearer ${myToken}`}})
        .then(function(response){
          console.log('Name ' + state.currentChoice + ' accepted/rejected for ' + state.compInfo.nrNumber);

          // Was this an accept? If so complete the NR
          if (state.currentNameObj.state == 'A') {
            dispatch('updateNRState', 'APPROVED');
          }
          // was this a conditional accept? If so complete the NR
          else if (state.currentNameObj.state == 'C') {
            dispatch('updateNRState', 'CONDITIONAL');
          }
          // This was a reject? If so check whether there are any more names
          else {

            if (state.currentChoice == 1) {
              if (state.compInfo.compNames.compName2.state == null || state.compInfo.compNames.compName2.state !== 'NE') {
                dispatch('updateNRState', 'REJECTED');
              } else {
                // we'e got another choice to move on to so move to the next
                commit('currentNameObj', state.compInfo.compNames.compName2);
              }
            } else if (state.currentChoice == 2) {
              if (state.compInfo.compNames.compName3.state == null || state.compInfo.compNames.compName3.state !== 'NE') {
                dispatch('updateNRState', 'REJECTED');
              } else {
                // we'e got another choice to move on to so move to the next
                commit('currentNameObj', state.compInfo.compNames.compName3);
              }
            } else {
              // this is choice 3 so we're definitely done, there are no more names to examine
              dispatch('updateNRState', 'REJECTED');
            }
          }

          dispatch('getpostgrescompInfo', state.compInfo.nrNumber);
        })
        .catch(error => {
          console.log('ERROR: ' + error);
          dispatch('getpostgrescompInfo', state.compInfo.nrNumber);
        })
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

    revertLastDecision({state}) {
      // TODO - RE-EVALUATE IN TERMS OF 'UNDO' VS 'REVERT'
      console.log('Revert last decision');
      const myToken = localStorage.getItem('KEYCLOAK_TOKEN');
      const url = '/api/v1/requests/' + state.compInfo.nrNumber + '/names/' + nameNumber;

      axios.put(url, {headers: {Authorization: `Bearer ${myToken}`}},{"name": nameData} )
           .then(function(response){
             console.log(response);

             // get full NR from scratch
             this.getpostgrescompInfo(state.compInfo.nrNumber);
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

      // decision reasons
      if (state.listDecisionReasons === null) {
        console.log('action: get decision reasons list from API')
        const myToken = localStorage.getItem('KEYCLOAK_TOKEN')
        const url = '/api/v1/requests/decisionreasons'
        return axios.get(url, {headers: {Authorization: `Bearer ${myToken}`}}).then(response => {
          console.log(response);
          commit('listDecisionReasons',response.data)
        })
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
        console.log('Conflicts Info Response:' + response.data)
        commit('loadConflictsJSON',response.data)
        commit('setConflicts',response.data)
      })
        .catch(error => console.log('ERROR: ' + error))
    },

    getConflictInfo ({state,commit},value) {
      console.log('Getting Conflict Info')
      commit('currentConflict', value);
      if(value.source == "CORP" ){
          state.corpConflictJSON = null
          this.dispatch('getCorpConflict',value)
      }else{
        console.log('Getting NAMES Conflict Info -' + value.source )
        state.namesConflictJSON = null
        this.dispatch('getNamesConflict',value)
      }
    },

    getNamesConflict ({state,commit},value) {
      console.log('action: getting data for company number: ' + value.nrNumber)
      const myToken = localStorage.getItem('KEYCLOAK_TOKEN')
      const url = '/api/v1/requests/' + value.nrNumber
      const vm = this
      return axios.get(url, {headers: {Authorization: `Bearer ${myToken}`}}).then(response => {
        console.log('Names Conflict response:' + response.data)
        commit('loadNamesConflictJSON',response.data )
      })
        .catch(error => console.log('ERROR: getNamesConflict' + error))
    },

    getCorpConflict ({state,commit},value) {
      console.log('action: getting data for company number: ' + value.nrNumber )
      const myToken = localStorage.getItem('KEYCLOAK_TOKEN')
      const url = '/api/v1/corporations/' + value.nrNumber
      const vm = this
      return axios.get(url, {headers: {Authorization: `Bearer ${myToken}`}}).then(response => {
        console.log('Corp Conflict response:' + response.data)
        commit('loadCorpConflictJSON',response.data)
      })
        .catch(error => console.log('ERROR: getCorpConflict ' + error))
    },

    getHistoryInfo ({state,commit},value) {
      console.log('action: getting HistoryInfo for company number: ' + value.nrNumber)
      const myToken = localStorage.getItem('KEYCLOAK_TOKEN')
      const url = '/api/v1/requests/' + value.nrNumber
      const vm = this
      return axios.get(url, {headers: {Authorization: `Bearer ${myToken}`}}).then(response => {
        console.log('Names Conflict response:' + response.data)
        commit('loadHistoryInfoJSON',response.data )
      })
        .catch(error => console.log('ERROR: getNamesConflict' + error))
    },

    checkConditions( {commit, state} ) {

      console.log('action: getting restricted words and conditions for company number: ' + state.compInfo.nrNumber + ' from solr')
      const myToken = localStorage.getItem('KEYCLOAK_TOKEN')
      const url = '/api/v1/requests/' + state.compInfo.nrNumber + '/analysis/' + state.currentChoice + '/restricted_words'
      console.log('URL:' + url)
      const vm = this
      return axios.get(url, {headers: {Authorization: `Bearer ${myToken}`}}).then(response => {
        console.log('Conditions Info Response:' + response.data)
        commit('loadConditionsJSON',response.data)
      })
        .catch(error => console.log('ERROR: ' + error))
    },

    checkHistories( {commit, state} ) {
      console.log('action: getting history for company number: ' + state.compInfo.nrNumber + ' from solr')
      const myToken = localStorage.getItem('KEYCLOAK_TOKEN')
      const url = '/api/v1/requests/' + state.compInfo.nrNumber + '/analysis/' + state.currentChoice + '/histories'
      console.log('URL:' + url)
      const vm = this
      return axios.get(url, {headers: {Authorization: `Bearer ${myToken}`}}).then(response => {
        console.log('Histories Info Response:' + response.data)
        commit('loadHistoriesJSON',response.data)
      })
        .catch(error => console.log('ERROR: ' + error))
    },

    checkTrademarks( {commit, state} ) {
      console.log('action: getting trademarks for company number: ' + state.compInfo.nrNumber + ' from solr')
      const myToken = localStorage.getItem('KEYCLOAK_TOKEN')
      const url = '/api/v1/requests/' + state.compInfo.nrNumber + '/analysis/' + state.currentChoice + '/trademarks'
      console.log('URL:' + url)
      const vm = this
      return axios.get(url, {headers: {Authorization: `Bearer ${myToken}`}}).then(response => {
        console.log('Trademarks Info Response:' + response.data)
        commit('loadTrademarksJSON',response.data)
      })
        .catch(error => console.log('ERROR: ' + error))
    },

    //getSearchDataJSON( {commit, state} ) {
    //  console.log('action: get search Data')
    //  const myToken = localStorage.getItem('KEYCLOAK_TOKEN')
    //  const url = '/api/v1/requests/'
    //  console.log('URL:' + url)
    //  const vm = this
    //  return axios.get(url, {headers: {Authorization: `Bearer ${myToken}`}}).then(response => {
    //    console.log('Search Data Response:' + response.data)
    //    commit('loadSearchDataJSON',response.data)
    //  })
    //    .catch(error => console.log('ERROR: ' + error))
    //},

    setCurrentName({commit, state},objName ) {
      commit('currentNameObj', objName);
    },

    runRecipe({dispatch,state}) {
      console.log('Running Recipe')
      if( state.currentChoice != null) {
        this.dispatch('checkConflicts')
        this.dispatch('checkTrademarks')
        this.dispatch('checkConditions')
        this.dispatch('checkHistories')
      }
    },

    resetValues({commit}){
      commit('loadNamesConflictJSON',null)
      commit('loadCorpConflictJSON',null)
      commit('loadConditionsJSON',null)
      commit('loadHistoriesJSON',null)
      commit('loadTrademarksJSON',null)
      commit('loadSearchDataJSON',null)
    },

  },
  getters: {
    is_editing(state) {
      return state.is_editing
    },
    is_making_decision(state) {
      return state.is_making_decision
    },
    decision_made(state) {
      return state.decision_made;
    },
    is_header_shown(state) {
      return state.is_header_shown
    },
    user(state) {
      return state.user
    },
    email(state) {
      return state.email
    },
    currentNameObj(state) {
      return state.currentNameObj;
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
      return state.compInfo.compNames.compName1;
    },
    compName2(state) {
      return state.compInfo.compNames.compName2;
    },
    compName3(state) {
      return state.compInfo.compNames.compName3;
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
    listDecisionReasons(state) {
      return state.listDecisionReasons
    },
    conflictList(state) {
      return state.conflictList
    },
    currentHistory(state) {
      return state.currentHistory
    },
    conflictsJSON(state) {
      return state.conflictsJSON
    },
    corpConflictJSON(state) {
     return state.corpConflictJSON
    },
    namesConflictJSON(state) {
      return state.namesConflictJSON
    },
    conditionsJSON(state) {
      return state.conditionsJSON
    },
    historiesJSON(state) {
      return state.historiesJSON
    },
    trademarksJSON(state) {
      return state.trademarksJSON
    },
    currentRecipeCard(state) {
      return state.currentRecipeCard
    },
    nrData(state) {
      return state.nrData
    },
    searchDataJSON(state) {
      return state.searchDataJSON
    }
  }
})
