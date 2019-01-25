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

    myKeycloak: null,
    userId: null,
    user_roles: [],
    authorized: false,
    email: null,
    errorJSON: null,

    //Interface settings
    currentChoice: null, // CURRENT NAME BEING EXAMINED (choice number)
    currentName: null, // CURRENT NAME BEING EXAMINED (string)
    currentNameObj: { // CURRENT NAME BEING EXAMINED (complete object)
      name: null,
      choice: null,
    },
    currentState: null, // NR - APPROVED, REJECTED, INPROGRESS ETC...
    previousStateCd: null,

    currentConflict: null, // the conflict name currently in focus
    currentCondition: null, // the condition currently in focus
    currentTrademark: null, // the trademark currently in focus
    currentHistory: null,  //NR number of history name selected

    currentRecipeCard: null,
    is_my_current_nr: false,
    is_editing: false,
    is_making_decision: false,
    decision_made: null,
    acceptance_will_be_conditional: false,
    is_header_shown: false,
    furnished: null,
    hasBeenReset: null,
    listPriorities: null, // DROP LIST
    listJurisdictions: null, // DROP LIST
    listRequestTypes: null, // DROP LIST
    listDecisionReasons: null,

    requestTypeRules: null, // list of request type rules, internal use only no display

    //Names Data
    //nr_conflict: null,
    details: null,
    additionalInfo: null,
    internalComments: [],
    applicantsOrigData: null,
    nrData: null,
    compInfo: {
      nrNumber: null,
      compNames: {
        compName1: {
          choice: null,
          name: null,
          state: null,
          consumptionDate: null,
          conflict1: null,
          conflict2: null,
          conflict3: null,
          decision_text: null,
          comment: null,
        },
        compName2: {
          choice: null,
          name: null,
          state: null,
          consumptionDate: null,
          conflict1: null,
          conflict2: null,
          conflict3: null,
          decision_text: null,
          comment: null,
        },
        compName3: {
          choice: null,
          name: null,
          state: null,
          consumptionDate: null,
          conflict1: null,
          conflict2: null,
          conflict3: null,
          decision_text: null,
          comment: null,
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
      nr_status: null,
      nwpta_ab: {
        partnerJurisdictionTypeCd: null,
        partnerName: null,
        partnerNameDate: null,
        partnerNameNumber: null,
        partnerNameTypeCd: null,
      },
      nwpta_sk: {
        partnerJurisdictionTypeCd: null,
        partnerName: null,
        partnerNameDate: null,
        partnerNameNumber: null,
        partnerNameTypeCd: null,
      },
    },
    examiner: null,
    priority: null,
    reservationCount: null,
    submitCount: null,
    previousNr: null,
    corpNum: null,
    submittedDate: null,
    expiryDate: null,
    expiryDateForEdit: null,
    lastUpdate: null,
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

    searchQuery: '?order=priorityCd:desc,submittedDate:asc&queue=hold&ranking=All&notification=All&' +
                 'submittedInterval=30 days&lastUpdateInterval=All&rows=10',
    searchState: 'HOLD',
    searchNr: '',
    searchUsername: '',
    searchCompName: '',
    searchRanking: 'All',
    searchNotification: 'All',
    searchSubmittedInterval: 'All',
    searchLastUpdatedInterval: 'All',
    searchCurrentPage: 1,
    searchPerPage: 10,

    exactMatchesConflicts: [],
    synonymMatchesConflicts: [],
    cobrsPhoneticConflicts: [],
    phoneticConflicts: [],
    conflictList: [],
    conflictHighlighting: [],
    conflictNames: [],
    conflictResponse: null,

    conflictsJSON: null,
    corpConflictJSON: null,
    namesConflictJSON: null,
    trademarksJSON: null,
    historiesJSON: null,
    historiesInfoJSON: null,
    searchDataJSON: null,
    conditionsJSON: null,
    statsDataJSON: {hold: {response: {numfound: ''}},
                    draft: {response: {numfound: ''}},
                    expired: {response: {numfound: ''}},
                    cancelled: {response: {numfound: ''}},
                    approved: {response: {numfound: ''}},
                    conditional: {response: {numfound: ''}},
                    rejected: {response: {numfound: ''}}
    },
  },
  mutations: {
    requestType (state, value) {
      state.compInfo.requestType = value;
    },
    is_my_current_nr (state, value) {
      state.is_my_current_nr = value;
    },
    is_making_decision(state, value) {
      state.is_making_decision = value;
    },
    decision_made(state, value) {
      state.decision_made = value;
    },
    acceptance_will_be_conditional(state, value) {
      state.acceptance_will_be_conditional = value;
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
    nwpta_ab (state, value) {
      state.additionalCompInfo.nwpta_ab = value;
    },
    nwpta_sk (state, value) {
      state.additionalCompInfo.nwpta_sk = value;
    },
    nr_status (state, value) {
      state.additionalCompInfo.nr_status = value;
    },
    reservationCount (state, value) {
      state.reservationCount = value;
    },
    expiryDate (state, value) {
      state.expiryDate = value;
    },
    expiryDateForEdit (state, value) {
      state.expiryDateForEdit = value;
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
    previousNr(state, value) {
      state.previousNr = value;
    },
    corpNum(state, value) {
      state.corpNum = value;
    },
    searchQuery(state, value) {
      state.searchQuery = value;
    },
    searchQuerySpecial(state, value) {
      state.searchQuerySpecial = value;
    },
    searchState(state,value) {
      state.searchState = value;
    },
    searchNr(state,value) {
      state.searchNr = value;
    },
    searchUsername(state,value) {
      state.searchUsername = value;
    },
    searchCompName(state,value) {
      state.searchCompName = value;
    },
    searchRanking(state,value) {
      state.searchRanking = value;
    },
    searchNotification(state,value) {
      state.searchNotification = value;
    },
    searchSubmittedInterval(state,value) {
      state.searchSubmittedInterval = value;
    },
    searchLastUpdatedInterval(state,value) {
      state.searchLastUpdatedInterval = value;
    },
    searchCurrentPage(state,value) {
      state.searchCurrentPage = value;
    },
    searchPerPage(state,value) {
      state.searchPerPage = value;
    },
    furnished(state,value) {
      state.furnished = value;
    },
    hasBeenReset(state,value) {
      state.hasBeenReset = value;
    },
    clearAuthData (state) {
      state.userId = null
      state.authorized = null
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

      // clear name choices 2 and 3 in case they are blank - ie: don't keep previous NR's data
      state.compInfo.compNames.compName2.name = null
      state.compInfo.compNames.compName2.state = null
      state.compInfo.compNames.compName2.consumptionDate = null
      state.compInfo.compNames.compName2.conflict1 = null
      state.compInfo.compNames.compName2.conflict2 = null
      state.compInfo.compNames.compName2.conflict3 = null
      state.compInfo.compNames.compName2.decision_text = null
      state.compInfo.compNames.compName3.name = null
      state.compInfo.compNames.compName3.state = null
      state.compInfo.compNames.compName3.consumptionDate = null
      state.compInfo.compNames.compName3.conflict1 = null
      state.compInfo.compNames.compName3.conflict2 = null
      state.compInfo.compNames.compName3.conflict3 = null
      state.compInfo.compNames.compName3.decision_text = null

      // clear current name choice, to be reset by new data below
      state.currentNameObj = null;
      state.currentName = null;
      state.currentChoice = null;


      for (let record of dbcompanyInfo.names) {
        console.log('Company Info->switch record.choice:' + record.choice)
        switch (record.choice) {
          case 1:
            state.compInfo.compNames.compName1.choice = record.choice
            state.compInfo.compNames.compName1.name = record.name
            state.compInfo.compNames.compName1.state = record.state
            state.compInfo.compNames.compName1.consumptionDate = record.consumptionDate
            state.compInfo.compNames.compName1.conflict1 = record.conflict1
            state.compInfo.compNames.compName1.conflict2 = record.conflict2
            state.compInfo.compNames.compName1.conflict3 = record.conflict3
            state.compInfo.compNames.compName1.decision_text = record.decision_text
            state.compInfo.compNames.compName1.comment = record.comment

            // if this name is not yet examined or it is approved (in case of reset/re-open), set it as current name
            if (record.state == 'NE' || record.state == 'APPROVED') {
              console.log('Set current name to name #1');
              this.dispatch('setCurrentName',record);
            }

            break;
          case 2:
            state.compInfo.compNames.compName2.choice = record.choice
            state.compInfo.compNames.compName2.name = record.name
            state.compInfo.compNames.compName2.state = record.state
            state.compInfo.compNames.compName2.consumptionDate = record.consumptionDate
            state.compInfo.compNames.compName2.conflict1 = record.conflict1
            state.compInfo.compNames.compName2.conflict2 = record.conflict2
            state.compInfo.compNames.compName2.conflict3 = record.conflict3
            state.compInfo.compNames.compName2.decision_text = record.decision_text
            state.compInfo.compNames.compName2.comment = record.comment

            // if this name is not yet examined or it is approved (in case of reset/re-open), set it as current name
            if ((record.state == 'NE' || record.state == 'APPROVED') &&
              (record.choice < state.currentChoice || state.currentChoice == null)
            ) {
              console.log('Set current name to name #2');
              this.dispatch('setCurrentName',record);
            }

            break;
          case 3:
            state.compInfo.compNames.compName3.choice = record.choice
            state.compInfo.compNames.compName3.name = record.name
            state.compInfo.compNames.compName3.state = record.state
            state.compInfo.compNames.compName3.consumptionDate = record.consumptionDate
            state.compInfo.compNames.compName3.conflict1 = record.conflict1
            state.compInfo.compNames.compName3.conflict2 = record.conflict2
            state.compInfo.compNames.compName3.conflict3 = record.conflict3
            state.compInfo.compNames.compName3.decision_text = record.decision_text
            state.compInfo.compNames.compName3.comment = record.comment

            // if this name is not yet examined or it is approved (in case of reset/re-open), set it as current name
            if ((record.state == 'NE' || record.state == 'APPROVED') &&
              (record.choice < state.currentChoice || state.currentChoice == null)
            ) {
              this.dispatch('setCurrentName',record);
            }

            break;
          default:
            console.log('got to a name record with null choice - moving on');
            break;
        }
      }

      //if no currentName selected choose 1st
      if(state.currentName == null){
        console.log('No currentName set => use 1st choice: ', state.currentChoice)
        this.dispatch('setCurrentName',dbcompanyInfo.names[0])
      }

      console.log('Still loading')
      state.currentState = dbcompanyInfo.state;
      state.previousStateCd = dbcompanyInfo.previousStateCd;
      state.compInfo.requestType = dbcompanyInfo.requestTypeCd


      // if the current state is not INPROGRESS, HOLD, or DRAFT clear any existing name record in currentNameObj
      if (!['INPROGRESS','HOLD','DRAFT'].includes(state.currentState)) {
        console.log('Clearing currentName')
        this.dispatch('setCurrentName',{});
      }

      console.log('Setting company data in state variables')
      // we keep the original data so that if fields exist that we do not use, we don't lose that
      // data when we put new data
      if (dbcompanyInfo.applicants != '')
        state.applicantOrigData = dbcompanyInfo.applicants
      else {
        state.applicantOrigData = {
          'clientFirstName':null,
          'clientLastName':null,
          'firstName':null,
          'middleName':null,
          'lastName':null,
          'addrLine1':null,
          'addrLine2':null,
          'addrLine3':null,
          'city':null,
          'stateProvinceCd':null,
          'postalCd':null,
          'countryTypeCd':null,
          'contact':null,
          'phoneNumber':null,
          'emailAddress':null,
          'faxNumber':null,
        }
      }
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

      state.additionalCompInfo.nr_status = dbcompanyInfo.state
      state.examiner = dbcompanyInfo.userId
      state.priority = dbcompanyInfo.priorityCd
      //state.reservationCount = dbcompanyInfo.reservationCount

      state.expiryDate = dbcompanyInfo.expirationDate;
      state.submittedDate = dbcompanyInfo.submittedDate;
      state.lastUpdate = dbcompanyInfo.lastUpdate;

      state.submitCount = dbcompanyInfo.submitCount
      state.previousNr = dbcompanyInfo.previousNr
      state.corpNum = dbcompanyInfo.corpNum
      state.furnished = dbcompanyInfo.furnished
      state.hasBeenReset = dbcompanyInfo.hasBeenReset

      console.log('Setting nwpta data in state variables')
      // cycle through nwpta entries
      // - first clear existing nwpta data that may persist from previous NR
      state.additionalCompInfo.nwpta_ab = {
        partnerJurisdictionTypeCd: null,
        partnerName: null,
        partnerNameDate: null,
        partnerNameNumber: null,
        partnerNameTypeCd: null,
      };
      state.additionalCompInfo.nwpta_sk = {
        partnerJurisdictionTypeCd: null,
        partnerName: null,
        partnerNameDate: null,
        partnerNameNumber: null,
        partnerNameTypeCd: null,
      };
      for (let record of dbcompanyInfo.nwpta) {

        // convert date from long form to DD-MM-YYYY
        if (record.partnerNameDate != null && record.partnerNameDate != '') {
          var nwpta_date = new Date(record.partnerNameDate);
          record.partnerNameDate =
            padWithZeroes(nwpta_date.getUTCDate(), 2) + "-" +
            padWithZeroes((nwpta_date.getUTCMonth() + 1), 2) + "-" +
            nwpta_date.getFullYear();
        }

        if (record.partnerJurisdictionTypeCd == 'AB') state.additionalCompInfo.nwpta_ab = record;
        if (record.partnerJurisdictionTypeCd == 'SK') state.additionalCompInfo.nwpta_sk = record;
      }

      // convert Expiry Date from timestamp to DD-MM-YYYY string for editing
      if (state.expiryDate != null) {
        var thedate = new Date(state.expiryDate);
        state.expiryDateForEdit = padWithZeroes(thedate.getUTCDate(), 2) + "-" + padWithZeroes(thedate.getUTCMonth() + 1, 2) + "-" + thedate.getFullYear();
      }
      else state.expiryDateForEdit = null;

    },

    loadConflictsJSON(state,JSONdata){
      state.conflictsJSON = JSONdata
    },

    loadNamesConflictJSON(state,JSONdata){
      state.namesConflictJSON = JSONdata
    },

    loadCorpConflictJSON(state,JSONdata){
      state.corpConflictJSON = JSONdata
    },

    loadConditionsJSON(state,JSONdata){
      state.conditionsJSON = JSONdata
    },

    loadHistoriesJSON(state,JSONdata){
      state.historiesJSON = JSONdata
    },

    loadHistoriesInfoJSON(state, JSONdata){
      state.historiesInfoJSON = JSONdata;
    },

    loadTrademarksJSON(state,JSONdata){
      state.trademarksJSON = JSONdata
    },

    loadSearchDataJSON(state,JSONdata){
      state.searchDataJSON = JSONdata
    },

    loadStatsDataJSON(state,params){
      state.statsDataJSON[params.myState] = params.JSONdata
    },

    update_nrData(state) {
      if(state.nrData.names.length == 0) {
        console.log('Error, No company names found')
        return
      } else {
        for (var i = 0; i < state.nrData.names.length; i++) {
          var record = state.nrData.names[i];
          switch (record.choice) {
            case 1:
              state.nrData.names[i] = state.compInfo.compNames.compName1;
              break;
            case 2:
              state.nrData.names[i] = state.compInfo.compNames.compName2;
              break;
            case 3:
              state.nrData.names[i] = state.compInfo.compNames.compName3;
              break;
          }
        }
        if (state.nrData.names.length < 2 && state.compInfo.compNames.compName2.name != null) {
          state.compInfo.compNames.compName2.choice = 2;
          state.compInfo.compNames.compName2.state = 'NE';
          state.nrData.names[1] = state.compInfo.compNames.compName2;
        }
        if (state.nrData.names.length < 3 && state.compInfo.compNames.compName3.name != null) {
          state.compInfo.compNames.compName3.choice = 3;
          state.compInfo.compNames.compName3.state = 'NE';
          state.nrData.names[2] = state.compInfo.compNames.compName3;
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

      if (state.additionalInfo != '' && state.additionalInfo != null)
        state.additionalInfo = state.additionalInfo.substr(0, 150);
      state.nrData.additionalInfo = state.additionalInfo;

      state.nrData.comments = state.internalComments
      state.nrData.nwpta = []
      if (state.additionalCompInfo.nwpta_ab.partnerJurisdictionTypeCd !== null) state.nrData.nwpta.push(state.additionalCompInfo.nwpta_ab);
      if (state.additionalCompInfo.nwpta_sk.partnerJurisdictionTypeCd !== null) state.nrData.nwpta.push(state.additionalCompInfo.nwpta_sk);
      state.nrData.state =  state.currentState
      state.nrData.previousStateCd = state.previousStateCd;
      state.nrData.userId = state.examiner
      state.nrData.priorityCd = state.priority
      //state.reservationCount = dbcompanyInfo.reservationCount
      state.nrData.lastUpdate = state.lastUpdate
      state.nrData.expirationDate = state.expiryDate
      state.nrData.submittedDate = state.submittedDate
      state.nrData.submitCount = state.submitCount
      state.nrData.previousNr = state.previousNr
      state.nrData.corpNum = state.corpNum
      state.nrData.furnished = state.furnished
      state.nrData.hasBeenReset = state.hasBeenReset
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
    requestTypeRules(state, value) {
      state.requestTypeRules = value;
    },
    currentRecipeCard(state,value){
      state.currentRecipeCard = value
    },
    currentNameObj(state,value){
      state.currentNameObj = value
      console.log('setting currentNameObj')
      if (value != null) {
        // also set currentName and currentChoice
        state.currentName = value.name;
        state.currentChoice = value.choice;
      }
      else {
        state.currentName = null;
        state.currentChoice = null;
      }
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
      console.log('Changing NR Number to ' + value)
      state.compInfo.nrNumber = value
    },

    // not used
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

    setExactMatchesConflicts(state, jsonValue) {
      var names = jsonValue['names']
      state.exactMatchesConflicts = []
      for (var i=0; i<names.length; i++) {
        var entry = names[i];
        state.exactMatchesConflicts.push({
          text:entry.name,
          nrNumber:entry.id,
          source:entry.source,
          class: 'conflict-result conflict-exact-match',
        })
      }
    },

    setSynonymMatchesConflicts(state, json) {
      state.synonymMatchesConflicts = [];
      let names = json.names;
      let additionalRow = null;
      let entry = null;
      let name_stems = []
      let synonym_stems = null
      let wildcard_stack = false
      for (let i=0; i<names.length; i++) {
        if (names[i].name_info.source != null) {
          //stack conflict
          entry = names[i].name_info;
          synonym_stems = names[i].stems

        } else {
          // stack title
          name_stems = names[i].stems;
          entry = names[i].name_info;

          wildcard_stack = (entry.name.lastIndexOf('*') > 0)
        }
        additionalRow = null;
        if (entry.source == null) {
		      entry.meta = entry.name.substring(entry.name.lastIndexOf('-')+1).trim();
          entry.class = 'conflict-synonym-title';
		      entry.name = entry.name.replace('----', '');
		      let syn_index = entry.name.indexOf('synonyms:');
		      if (syn_index != -1) {
		        let last_bracket_indx = entry.name.lastIndexOf(')');
            let synonym_clause = entry.name.substring(syn_index+10, last_bracket_indx);
            // '<span class="synonym-stem-highlight">' + entry.name.substring(syn_index, entry.name.length) + '</span>');
            let synonym_list = synonym_clause.split(',');

            for (var syn=0; syn<synonym_list.length; syn++) {
              for (var wrd = 0; wrd < name_stems.length; wrd++) {
                if (synonym_list[syn].toUpperCase().includes(name_stems[wrd].toUpperCase())) {
                  name_stems.splice(wrd, 1);
                  wrd--;
                }
              }
              entry.name = entry.name.toUpperCase().replace(synonym_list[syn].toUpperCase(),'<span class="synonym-stem-highlight">'+ synonym_list[syn].toUpperCase() +'</span>');
            }
            entry.name = entry.name.toUpperCase().replace('SYNONYMS:', '');
          }
		      entry.name = entry.name.substring(0, entry.name.lastIndexOf('-')).trim();

        } else {
          entry.class = 'conflict-result';
        }

        let k=0;
        for (k = 0; k < name_stems.length; k++) {
          if (!wildcard_stack) {
            entry.name = entry.name.toUpperCase().replace(name_stems[k].toUpperCase(), '<span class="stem-highlight">' + name_stems[k].toUpperCase() + '</span>');
          }
          if (synonym_stems != undefined && synonym_stems.indexOf(name_stems[k].toUpperCase()) != -1) {
            synonym_stems.splice(synonym_stems.indexOf(name_stems[k].toUpperCase()), 1);
          }
        }
        if (synonym_stems != undefined) {
          for (k = 0; k < synonym_stems.length; k++) {
            entry.name = entry.name.toUpperCase().replace(synonym_stems[k].toUpperCase(), '<span class="synonym-stem-highlight">' + synonym_stems[k].toUpperCase() + '</span>');
          }
        }
        entry.name = entry.name.replace(/SYNONYM-STEM-HIGHLIGHT/g,'synonym-stem-highlight');
        entry.name = entry.name.replace(/STEM-HIGHLIGHT/g,'stem-highlight');
        state.synonymMatchesConflicts.push({
		      count:0,
          text:entry.name,
		      meta:entry.meta,
          nrNumber:entry.id,
          source:entry.source,
          class: entry.class,
        });
      }
      var count = 0
      var stopCollapsing = false
      var collapseCount = 2
      for (let i=state.synonymMatchesConflicts.length-1; i>=0; i--){
        let entry = state.synonymMatchesConflicts[i]
        if (! stopCollapsing) {
          if (entry.class == 'conflict-result') {
            entry.class = 'conflict-result conflict-result-hidden'
            count ++
          }
          if (entry.class == 'conflict-synonym-title') {
            entry.count = count
            count = 0
            collapseCount --
            if (collapseCount == 0) {
              stopCollapsing = true
            }
            if (entry.count > 0) {
              entry.class = 'conflict-synonym-title collapsible collapsed'
            }
          }
        }
        else {
          if (entry.class == 'conflict-result') {
            entry.class = 'conflict-result conflict-result-displayed'
            count ++
          }
          if (entry.class == 'conflict-synonym-title') {
            entry.count = count
            count = 0
            if (entry.count > 0) {
              entry.class = 'conflict-synonym-title collapsible expanded'
            }
          }
        }
      }
    },

    setCobrsPhoneticConflicts(state, json) {
      state.cobrsPhoneticConflicts = [];
      let names = json.names;
      let additionalRow = null;
      for (let i=0; i<names.length; i++) {
        let entry = names[i]['name_info'];
        additionalRow = null;

        if (entry.source == null) {
          entry.name = entry.name.replace('----', '');
          entry.name = entry.name.replace('synonyms:', '');
          entry.class = 'conflict-cobrs-phonetic-title';
        }
        else {
          entry.class = 'conflict-result';
        }
        state.cobrsPhoneticConflicts.push({
          count:0,
          text:entry.name,
          meta:entry.meta,
          nrNumber:entry.id,
          source:entry.source,
          class: entry.class,
        });
      }
      var count = 0
      var stopCollapsing = false
      var collapseCount = 2
      for (let i=state.cobrsPhoneticConflicts.length-1; i>=0; i--){
        let entry = state.cobrsPhoneticConflicts[i]
        if (! stopCollapsing) {
          if (entry.class == 'conflict-result') {
            entry.class = 'conflict-result conflict-result-hidden'
            count ++
          }
          if (entry.class == 'conflict-cobrs-phonetic-title') {
            entry.count = count
            count = 0
            collapseCount --
            if (collapseCount == 0) {
              stopCollapsing = true
            }
            if (entry.count > 0) {
              entry.class = 'conflict-cobrs-phonetic-title collapsible collapsed'
            }
          }
        } else {
          if (entry.class == 'conflict-result') {
            entry.class = 'conflict-result conflict-result-displayed'
            count ++
          }
          if (entry.class == 'conflict-cobrs-phonetic-title') {
            entry.count = count
            count = 0
            if (entry.count > 0) {
              entry.class = 'conflict-cobrs-phonetic-title collapsible expanded'
            }
          }
        }
      }
    },

    setPhoneticConflicts(state, json) {
      state.phoneticConflicts = [];
      let names = json.names;
      let additionalRow = null;

      for (let i=0; i<names.length; i++) {
        let entry = names[i]['name_info'];
        additionalRow = null;

        if (entry.source == null) {
          entry.name = entry.name.replace('----', '');
          entry.name = entry.name.replace('synonyms:', '');
          entry.class = 'conflict-phonetic-title';
        }
        else {
          entry.class = 'conflict-result';
        }

        state.phoneticConflicts.push({
          count:0,
          text:entry.name,
          meta:entry.meta,
          nrNumber:entry.id,
          source:entry.source,
          class: entry.class,
        });
      }
      var count = 0
      var stopCollapsing = false
      var collapseCount = 2
      for (let i=state.phoneticConflicts.length-1; i>=0; i--){
        let entry = state.phoneticConflicts[i]
        if (! stopCollapsing) {
          if (entry.class == 'conflict-result') {
            entry.class = 'conflict-result conflict-result-hidden'
            count ++
          }
          if (entry.class == 'conflict-phonetic-title') {
            entry.count = count
            count = 0
            collapseCount --
            if (collapseCount == 0) {
              stopCollapsing = true
            }
            if (entry.count > 0) {
              entry.class = 'conflict-phonetic-title collapsible collapsed'
            }
          }
        } else {
          if (entry.class == 'conflict-result') {
            entry.class = 'conflict-result conflict-result-displayed'
            count ++
          }
          if (entry.class == 'conflict-phonetic-title') {
            entry.count = count
            count = 0
            if (entry.count > 0) {
              entry.class = 'conflict-phonetic-title collapsible expanded'
            }
          }
        }
      }
    },

    currentConflict(state,value){
      state.currentConflict = value
    },
    currentCondition(state,value){
      state.currentCondition = value
    },
    currentTrademark (state,value){
      state.currentTrademark = value
    },

    currentHistory(state,value){
      state.currentHistory = value
    },

    saveKeyCloak(state,value){
      state.myKeycloak = value
    },

    setLoginValues(state){
      state.userId=sessionStorage.getItem('USERNAME')
      state.user_roles=sessionStorage.getItem('USER_ROLES')
      state.authorized=sessionStorage.getItem('AUTHORIZED')
    },

    setErrorJSON(state,value) {
      state.errorJSON = value
    }

  },
  actions: {
    logout({commit, state}) {

      commit('clearAuthData')

      sessionStorage.removeItem('KEYCLOAK_REFRESH')
      sessionStorage.removeItem('KEYCLOAK_TOKEN')
      sessionStorage.removeItem('AUTHORIZED')
      sessionStorage.removeItem('KEYCLOAK_EXPIRES')
      sessionStorage.removeItem('USERNAME')
      sessionStorage.removeItem('USER_ROLES')

    },

    loadSetUp({dispatch}){

        //TODO - reset everything and force login???
        // clear values from local storeage
        dispatch('logout')
        //console.log('Logout 660')

        //Read Configuration.json File
        readJFile('static/config/configuration.json', function (myArray) {
        axios.defaults.baseURL = myArray[0]['URL']
        console.log("Setting axios.baseURL to: " + axios.defaults.baseURL)

        //load UI dropdowns from json files and database tables
        dispatch('loadDropdowns');

      })
    },

    tryAutoLogin ({commit}) {
    },

    checkToken({dispatch, state}) {
      // checks if keycloak object exists - if not then state is unstable, force logout
      if (state.myKeycloak==null) {
        console.log('myKeycloak is null')
        //TODO - reset everything and force login???
        //should only be null when first logging on (async keycloak)- if it becomes null somehow should we force another login?
        dispatch('logout')
        //console.log('Logout 682')
       return
      }
      // checks if keycloak object has tokenParsed yet, if not then just return as this only happens at login
      if(state.myKeycloak.tokenParsed==null){ return }

      var expiresIn = state.myKeycloak.tokenParsed['exp'] - Math.ceil(new Date().getTime() / 1000)

      console.log('Token expires in ' + expiresIn + 'seconds, updating')

      if (expiresIn < 1700 && expiresIn > 0) {
        console.log('Updating Token')
        dispatch('updateToken')

      } else if(expiresIn < 0) {
        //TODO - reset everything and force login???
        console.log('Force Logout')
        dispatch('logout')
        window.location.assign("/");
        //console.log('Logout 696')
      }
    },

    updateToken({commit, state}) {
      const vm = this;
      state.myKeycloak.updateToken(-1).success(function (refreshed) {
        if (refreshed) {
          sessionStorage.setItem('KEYCLOAK_TOKEN', state.myKeycloak.token);
          sessionStorage.setItem('KEYCLOAK_REFRESH', state.myKeycloak.refreshToken);
          sessionStorage.setItem('KEYCLOAK_EXPIRES', state.myKeycloak.tokenParsed.exp * 1000);
        } else {
          console.log('Token is still valid, not refreshed');
        }
      }).error(function () {
        console.log('Failed to refresh the token, or the session has expired');
      });
    },

    checkError({commit},responseJSON){
      console.log("ErrorChecking: ", responseJSON)
      if( responseJSON.warnings != null ){
        commit('setErrorJSON',responseJSON)
      }
      if( responseJSON.errors != null ){
        commit('setErrorJSON',responseJSON)
      }
      if( responseJSON.message != null){
        commit('setErrorJSON',responseJSON)
      }
    },

    setDetails({commit, state}) {
     var detail = state.details?null:"1";
     commit('saveDetail',detail)
    },

    getpostgrescompNo ({commit, dispatch, state}) {
      console.log('action: select next company number from postgres')
      const myToken = sessionStorage.getItem('KEYCLOAK_TOKEN')
      const url = '/api/v1/requests/queues/@me/oldest'
      console.log('URL:' + axios.defaults.baseURL + url)
      const vm = this
      console.log('Next company - checkToken')
      dispatch('checkToken')
      return axios.get(url, {headers: {Authorization: `Bearer ${myToken}`}}).then(response => {
        // response.data.nameRequest = 'NR 8270105';
        //response.data.nameRequest = 'NR 0000021';
        console.log('Comp No Response:');
        console.log(response);
        commit('loadpostgresNo',response.data)
      })
    },
    getpostgrescompInfo ({dispatch,commit},nrNumber) {
      console.log('action: getting data for company number: ' + nrNumber + ' from postgres')
      const myToken = sessionStorage.getItem('KEYCLOAK_TOKEN')
      const url = '/api/v1/requests/' + nrNumber
      console.log('URL:' + url)
      const vm = this
      dispatch('checkToken')
      return axios.get(url, {headers: {Authorization: `Bearer ${myToken}`}}).then(response => {
        console.log('Comp Info Response:' + response.data)
        commit('loadCompanyInfo',response.data)
      })
      .catch(error => console.log('ERROR: ' + error))
    },

    updateNRState ({commit, state, dispatch},nrState) {
      console.log('Updating Examination state for number ' + state.compInfo.nrNumber + ' to ' + nrState)
      const myToken = sessionStorage.getItem('KEYCLOAK_TOKEN')
      const url = '/api/v1/requests/' + state.compInfo.nrNumber

      axios.patch(url,{"state": nrState} ,{headers: {Authorization: `Bearer ${myToken}`}})
           .then(function(response){
                console.log('state updated to ' + nrState + ' for ' + state.compInfo.nrNumber);
                dispatch('getpostgrescompInfo', state.compInfo.nrNumber);

            })
            .catch(error => console.log('ERROR: ' + error))
      },

    cancelNr({commit, state, dispatch},nrState) {
      console.log('Cancelling for number ' + state.compInfo.nrNumber)
      const myToken = sessionStorage.getItem('KEYCLOAK_TOKEN')
      const url = '/api/v1/requests/' + state.compInfo.nrNumber

      axios.patch(url,{"state": nrState, "comments": state.internalComments} ,{headers: {Authorization: `Bearer ${myToken}`}})
           .then(function(response){
                console.log('CANCELLED ' + state.compInfo.nrNumber);
                dispatch('getpostgrescompInfo', state.compInfo.nrNumber);

            })
            .catch(error => console.log('ERROR: ' + error))
      },

    nameAcceptReject( {commit, dispatch, state}) {
      console.log('Name Accepted/Rejected for ' + state.compInfo.nrNumber + ", " + state.currentName)
      console.log(state.currentNameObj);
      const myToken = sessionStorage.getItem('KEYCLOAK_TOKEN')
      const url = '/api/v1/requests/' + state.compInfo.nrNumber + '/names/' + state.currentChoice;
      axios.put(url, state.currentNameObj, {headers: {Authorization: `Bearer ${myToken}`}})
        .then(function(response){
          console.log('Name ' + state.currentChoice + ' accepted/rejected for ' + state.compInfo.nrNumber);

          // Was this an accept? If so complete the NR
          if (state.currentNameObj.state == 'APPROVED') {
            dispatch('updateNRState', 'APPROVED');
          }
          // was this a conditional accept? If so complete the NR
          else if (state.currentNameObj.state == 'CONDITION') {
            dispatch('updateNRState', 'CONDITIONAL');
          }
          // This was a reject? If so check whether there are any more names
          else {

            if (state.currentChoice == 1) {
              if (state.compInfo.compNames.compName2.state == null || state.compInfo.compNames.compName2.state !== 'NE') {
                dispatch('updateNRState', 'REJECTED');
              } else {

                // save updated name with new state, decision text, etc.
                commit('compName1', state.currentNameObj);

                // we'e got another choice to move on to so move to the next
                commit('currentNameObj', state.compInfo.compNames.compName2);
              }
            } else if (state.currentChoice == 2) {
              if (state.compInfo.compNames.compName3.state == null || state.compInfo.compNames.compName3.state !== 'NE') {
                dispatch('updateNRState', 'REJECTED');
              } else {
                // save updated name with new state, decision text, etc.
                state.compInfo.compNames.compName2 = state.currentNameObj;

                // we'e got another choice to move on to so move to the next
                commit('currentNameObj', state.compInfo.compNames.compName3);
              }
            } else {
              // this is choice 3 so we're definitely done, there are no more names to examine
              dispatch('updateNRState', 'REJECTED');
            }
          }
        })
        .catch(error => {
          console.log('ERROR: ' + error);
          dispatch('getpostgrescompInfo', state.compInfo.nrNumber);
        })
    },

    //updates the names data, through the api, into the database
    updateRequest( {commit, state}) {

      const myToken = sessionStorage.getItem('KEYCLOAK_TOKEN')
      commit('update_nrData')
      const url = '/api/v1/requests/' + state.compInfo.nrNumber
      axios.put(url, state.nrData, {headers: {Authorization: `Bearer ${myToken}`}})
           .then(function(response){
             console.log('Request updated for ' + state.compInfo.nrNumber)

             // load updated data from response
             if (response.data !== undefined && response.data.nrNum !== undefined) {
               commit('loadCompanyInfo',response.data);
             }
           })
           .catch(error => console.log('ERROR: ' + error))
    },

    undoDecision({state}, nameChoice) {
      console.log('Undo decision for name #' + nameChoice);
      const myToken = sessionStorage.getItem('KEYCLOAK_TOKEN');

      var objName = {}
      if (nameChoice == 1) objName = this.getters.compName1;
      if (nameChoice == 2) objName = this.getters.compName2;
      if (nameChoice == 3) objName = this.getters.compName3;

      objName.state = 'NE';
      objName.conflict1 = null;
      objName.conflict2 = null;
      objName.conflict3 = null;
      objName.conflict1_num = null;
      objName.conflict2_num = null;
      objName.conflict3_num = null;
      objName.decision_text = null;
      objName.comment = null;


      const url = '/api/v1/requests/' + state.compInfo.nrNumber + '/names/' + nameChoice;
      axios.put(url, objName, {headers: {Authorization: `Bearer ${myToken}`}})
           .then(function(response){

             // get full NR from scratch
             this.getpostgrescompInfo(state.compInfo.nrNumber);
            })
            .catch(error => console.log('ERROR: ' + error))
      },

    loadDropdowns( {commit, state} ) {
      var json_files_path = 'static/ui_dropdowns/';

      console.log("Load Drop Downs");
      console.log("Jurisdictions");

      // jurisdictions - first list 1, then list 2
      if (state.listJurisdictions === null) {
        readJFile(json_files_path + 'jurisdiction 1.json', function (myArray) {
          commit('listJurisdictions', myArray);

          readJFile(json_files_path + 'jurisdiction 2.json', function (myArray) {

            // sort the country list alphabetically
            myArray.sort(function(a,b) {return (a.text > b.text) ? 1 : ((b.text > a.text) ? -1 : 0);} );

            commit('listJurisdictions', state.listJurisdictions.concat(myArray));
          });
        });
      }

      console.log("Request Types")
      // request types
      if (state.listRequestTypes === null) {
        readJFile(json_files_path + 'requesttype.json', function (myArray) { commit('listRequestTypes', myArray);})
      }

      console.log("Decision Reasons")
      // decision reasons
      if (state.listDecisionReasons === null) {
        const myToken = sessionStorage.getItem('KEYCLOAK_TOKEN')
        const url = '/api/v1/requests/decisionreasons'
        axios.get(url, {headers: {Authorization: `Bearer ${myToken}`}}).then(response => {
          commit('listDecisionReasons',response.data)
        })
      }

      // request type rules - from CSV, not JSON
      if (state.requestTypeRules === null) {
        readCsv(json_files_path + 'request_type_rules.csv', function (myArray) {
          commit('requestTypeRules', myArray);
        });
      }
    },

    newNrNumber({commit,dispatch},nrNum) {
      //save current state ??

      // reset the store values to null
      console.log('Setting current state JSON to null')
      dispatch('resetValues')

      // By setting the NR number, this should(doesn't) trigger the watcher located on the RequestInfoHeader.vue component to fire
      commit('nrNumber',nrNum)
      console.log('nrNumber updated to ' + nrNum)

      console.log('Getting NR data')
      dispatch('getpostgrescompInfo',nrNum)

      //TODO: this is called in reset values already -- take out and test
      commit('is_making_decision', false);
    },

    getConflictInfo ({state,commit},value) {
      if (value == null || value.nrNumber == null) { return; }

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
      const myToken = sessionStorage.getItem('KEYCLOAK_TOKEN')
      const url = '/api/v1/requests/' + value.nrNumber
      const vm = this
      return axios.get(url, {headers: {Authorization: `Bearer ${myToken}`}}).then(response => {
        console.log('Names Conflict response:' + response.data)
        commit('loadNamesConflictJSON',response.data )
      })
        .catch(error => this.dispatch('checkError',{errors:[{code:404, message:{"NR Info Error":["NR info could not be displayed because it isn't loaded in postgres yet."]}}]}))
    },

    getCorpConflict ({state,commit,dispatch},value) {
      console.log('action: getting data for company number: ' + value.nrNumber )
      const myToken = sessionStorage.getItem('KEYCLOAK_TOKEN')
      const url = '/api/v1/corporations/' + value.nrNumber
      const vm = this
      return axios.get(url, {headers: {Authorization: `Bearer ${myToken}`}}).then(response => {
        console.log('Corp Conflict response:' + response.data)
        commit('loadCorpConflictJSON',response.data)
      })
        .catch(error => this.dispatch('checkError',{errors:[{code:404, message:{"Corp Info Error":["Corporation info could not be displayed because it isn't in fdw-registries data."]}}]}))
    },

    getHistoryInfo ({state,commit,dispatch},value) {
      console.log('action: getting HistoryInfo for company number: ' + value.nr_num)
      const myToken = sessionStorage.getItem('KEYCLOAK_TOKEN')
      const url = '/api/v1/requests/' + value.nr_num
      const vm = this
      return axios.get(url, {headers: {Authorization: `Bearer ${myToken}`}}).then(response => {
        console.log('History info response:' + response.data)
        commit('loadHistoriesInfoJSON',response.data )
      })
        .catch(error => this.dispatch('checkError',{errors:[{code:404, message:{"NR Info Error":["NR info could not be displayed because it isn't loaded in postgres yet."]}}]}))
    },

    getSearchDataJSON( {commit, state}, val) {
     console.log('action: get search Data');
     const myToken = sessionStorage.getItem('KEYCLOAK_TOKEN');
     // current hour passed in via front end because server is in utc time (for last update and submitted date filters
     var currentDate = new Date();
     const url = '/api/v1/requests' + val + '&hour=' + currentDate.getHours();
     console.log('Search Query:' + val);
     const vm = this;
     return axios.get(url, {headers: {Authorization: `Bearer ${myToken}`}}).then(response => {
       console.log('Search Data Response:' + response.data)
       commit('loadSearchDataJSON',response.data)
     })
       .catch(error => console.log('ERROR: ' + error))
    },

    getStatsDataJSON( {commit, state},stateCd ) {
      const myToken = sessionStorage.getItem('KEYCLOAK_TOKEN');
      var newQuery = '?order=priorityCd:desc,submittedDate:asc&queue=' + stateCd + '&furnished=true&unfurnished=true&rows=1&start=0'
      const url = '/api/v1/requests' + newQuery
      console.log('Query:' + state.searchQuery);
      const vm = this;
      return axios.get(url, {headers: {Authorization: `Bearer ${myToken}`}}).then(response => {
        console.log('Stats Data Response:' + response.data)
        var params ={
          myState: stateCd,
          JSONdata: response.data
        }
        //commit('loadStatsDataJSON', response.data)
        commit('loadStatsDataJSON',params)
      })
        .catch(error => console.log('ERROR: ' + error))
    },

    setCurrentName({commit, state},objName ) {
      commit('currentNameObj', objName);
    },

    runManualRecipe({dispatch,state},searchStr) {
      console.log('running manual recipe with: ', searchStr);
      if( state.currentChoice != null) {
        this.dispatch('checkManualExactMatches',searchStr)
        this.dispatch('checkManualSynonymMatches',searchStr)
        this.dispatch('checkManualCobrsPhoneticMatches',searchStr)
        this.dispatch('checkManualPhoneticMatches',searchStr)
        // this.dispatch('checkManualConflicts',searchStr)
        this.dispatch('checkManualTrademarks',searchStr)
        this.dispatch('checkManualConditions',searchStr)
        this.dispatch('checkManualHistories',searchStr)
      }
    },

    checkManualExactMatches( {commit, state}, query ) {

      console.log('action: getting exact matches for number: ' + state.compInfo.nrNumber + ' from solr')
      query = query.replace(' \/','\/')
          .replace(/(^|\s+)(\$+(\s|$)+)+/g, '$1DOLLAR$3')
          .replace(/(^|\s+)(¢+(\s|$)+)+/g, '$1CENT$3')
          .replace(/\$/g, 'S')
          .replace(/¢/g, 'C')
          .replace(/\\/g, '')
          .replace(/\//g, '')
          .replace(/(`|~|!|\||\(|\)|\[|\]|\{|\}|:|"|\^|#|%|\?)/g, '')
      const myToken = sessionStorage.getItem('KEYCLOAK_TOKEN')
      query = query.substring(0, 1) == '+' ? query.substring(1) : query;
      query = encodeURIComponent(query)
      console.log('query', query)
      const url = '/api/v1/exact-match?query='+query
      console.log('URL:' + url)
      const vm = this
      return axios.get(url, {headers: {Authorization: `Bearer ${myToken}`}}).then(response => {
        console.log('Check Exact Match Response:', JSON.stringify(response.data))
        commit('setExactMatchesConflicts', response.data)
      })
        .catch(error => console.log('ERROR (exact matches): ' + error))
    },

    checkManualSynonymMatches( {dispatch,commit,state}, query ) {

      console.log('action: getting synonym matches for number: ' + state.compInfo.nrNumber + ' from solr')
      query = query.replace(/\//g,' ')
                .replace(/\\/g,' ')
                .replace(/&/g, ' ')
                .replace(/\+/g, ' ')
                .replace(/\-/g, ' ')
                .replace(/(^| )(\$+(\s|$)+)+/g, '$1DOLLAR$3')
                .replace(/(^| )(¢+(\s|$)+)+/g, '$1CENT$3')
                .replace(/\$/g, 'S')
                .replace(/¢/g,'C')
                .replace(/(`|~|!|\||\(|\)|\[|\]|\{|\}|:|"|\^|#|%|\?)/g, '')
      const myToken = sessionStorage.getItem('KEYCLOAK_TOKEN');
      const url = '/api/v1/requests/synonymbucket/' + query;
      console.log('URL:' + url);
      const vm = this;
      dispatch('checkToken');
      return axios.get(url, {headers: {Authorization: `Bearer ${myToken}`}}).then(response => {
        commit('setSynonymMatchesConflicts', response.data)
      })
        .catch(error => console.log('ERROR (synonym matches): ' + error))
    },

    checkManualCobrsPhoneticMatches( {dispatch,commit,state}, query ) {

      console.log('action: getting CobrsPhonetic matches for number: ' + state.compInfo.nrNumber + ' from solr')
      query = query.replace(/\//g,' ')
          .replace(/\\/g,' ')
          .replace(/&/g, ' ')
          .replace(/\+/g, ' ')
          .replace(/\-/g, ' ')
          .replace(/(^| )(\$+(\s|$)+)+/g, '$1DOLLAR$3')
          .replace(/(^| )(¢+(\s|$)+)+/g, '$1CENT$3')
          .replace(/\$/g, 'S')
          .replace(/¢/g,'C')
          .replace(/(`|~|!|\||\(|\)|\[|\]|\{|\}|:|"|\^|#|%|\?)/g, '')
      const myToken = sessionStorage.getItem('KEYCLOAK_TOKEN');
      const url = '/api/v1/requests/cobrsphonetics/' + query;
      console.log('URL:' + url);
      const vm = this;
      dispatch('checkToken');
      return axios.get(url, {headers: {Authorization: `Bearer ${myToken}`}}).then(response => {
        commit('setCobrsPhoneticConflicts', response.data)
      })
        .catch(error => console.log('ERROR (CobrsPhonetic matches): ' + error))
    },

    checkManualPhoneticMatches( {dispatch,commit,state}, query ) {

      console.log('action: getting Phonetic matches for number: ' + state.compInfo.nrNumber + ' from solr')
      query = query.replace(/\//g,' ')
          .replace(/\\/g,' ')
          .replace(/&/g, ' ')
          .replace(/\+/g, ' ')
          .replace(/\-/g, ' ')
          .replace(/(^| )(\$+(\s|$)+)+/g, '$1DOLLAR$3')
          .replace(/(^| )(¢+(\s|$)+)+/g, '$1CENT$3')
          .replace(/\$/g, 'S')
          .replace(/¢/g,'C')
          .replace(/(`|~|!|\||\(|\)|\[|\]|\{|\}|:|"|\^|#|%|\?)/g, '')
      const myToken = sessionStorage.getItem('KEYCLOAK_TOKEN');
      const url = '/api/v1/requests/phonetics/' + query;
      console.log('URL:' + url);
      const vm = this;
      dispatch('checkToken');
      return axios.get(url, {headers: {Authorization: `Bearer ${myToken}`}}).then(response => {
        commit('setPhoneticConflicts', response.data)
      })
        .catch(error => console.log('ERROR (Phonetic matches): ' + error))
    },

    // not used
    checkManualConflicts( {commit, state},searchStr ) {
      console.log('action: manual check of conflicts for company number: ' + state.compInfo.nrNumber + ' from solr')
      const myToken = sessionStorage.getItem('KEYCLOAK_TOKEN')
      const myHeader =  {headers: {Authorization: `Bearer ${myToken}`}};
      const url = '/api/v1/documents:conflicts'
      console.log('URL:' + url)
      const vm = this
      return axios.post(url, {type: 'plain_text', content: searchStr }, myHeader).then(response => {
        console.log('Check Manual Conflicts for ' + searchStr + ' - Response:' + response.data)
        commit('loadConflictsJSON',response.data)
        commit('setConflicts',response.data)
      })
        .catch(error => console.log('ERROR: ' + error))
    },

    checkManualConditions( {commit, state},searchStr ) {
      console.log('action: manual check of restricted words and conditions for company number: ' + state.compInfo.nrNumber )
      const myToken = sessionStorage.getItem('KEYCLOAK_TOKEN')
      const myHeader =  {headers: {Authorization: `Bearer ${myToken}`}};
      const url = '/api/v1/documents:restricted_words'
      console.log('URL:' + url)
      const vm = this
      return axios.post(url, {type: 'plain_text', content: searchStr }, myHeader).then(response => {
        console.log('Check Manual Conditions Response:' + response.data)
        commit('loadConditionsJSON',response.data)
      })
        .catch(error => console.log('ERROR: ' + error))
    },

    checkManualHistories( {commit, state},searchStr ) {
      console.log('action: manual check of history for company number: ' + state.compInfo.nrNumber + ' from solr')
      const myToken = sessionStorage.getItem('KEYCLOAK_TOKEN')
      const myHeader =  {headers: {Authorization: `Bearer ${myToken}`}};
      const url = '/api/v1/documents:histories'
      console.log('URL:' + url)
      searchStr = searchStr.replace(/\//g,' ')
          .replace(/\\/g,' ')
          .replace(/&/g, ' ')
          .replace(/\+/g, ' ')
          .replace(/\-/g, ' ')
          .replace(/(^| )(\$+(\s|$)+)+/g, '$1DOLLAR$3')
          .replace(/(^| )(¢+(\s|$)+)+/g, '$1CENT$3')
          .replace(/\$/g, 'S')
          .replace(/¢/g,'C')
          .replace(/(`|~|!|\||\(|\)|\[|\]|\{|\}|:|"|\^|#|%|\?)/g, '')
      const vm = this
      return axios.post(url, {type: 'plain_text', content: searchStr }, myHeader).then(response => {
        console.log('Check Manual Histories Response:' + response.data)
        commit('loadHistoriesJSON',response.data)
      })
        .catch(error => console.log('ERROR: ' + error))
    },

    checkManualTrademarks( {commit, state},searchStr ) {
      console.log('action: manual check of trademarks for company number: ' + state.compInfo.nrNumber + ' from solr')
      const myToken = sessionStorage.getItem('KEYCLOAK_TOKEN')
      const myHeader =  {headers: {Authorization: `Bearer ${myToken}`}};
      const url = '/api/v1/documents:trademarks'
      console.log('URL:' + url)
      searchStr = searchStr.replace(/\//g,' ')
          .replace(/\\/g,' ')
          .replace(/&/g, ' ')
          .replace(/\+/g, ' ')
          .replace(/\-/g, ' ')
          .replace(/\(/g, '')
          .replace(/\)/g, '')
          .replace(/}/g, '')
          .replace(/{/g, '')
          .replace(/]/g, '')
          .replace(/\[/g, '')
          .replace(/\?/g,'')
          .replace(/#/g,'')
          .replace(/%/g, '')
          .replace(/(^| )(\$+(\s|$)+)+/g, '$1DOLLAR$3')
          .replace(/(^| )(¢+(\s|$)+)+/g, '$1CENT$3')
          .replace(/\$/g, 'S')
          .replace(/¢/g,'C')
          .replace(/(`|~|!|\||\(|\)|\[|\]|\{|\}|:|"|\^|#|%|\?)/g, '')
      const vm = this
      return axios.post(url, {type: 'plain_text', content: searchStr }, myHeader).then(response => {
        console.log('Check Manual Trademarks Response:' + response.data)
        commit('loadTrademarksJSON',response.data)
      })
        .catch(error => console.log('ERROR: ' + error))
    },

    syncNR({dispatch,commit},nrNumber) {
      console.log('action: syncing data for nr number: ' + nrNumber + ' from with nro')
      const myToken = sessionStorage.getItem('KEYCLOAK_TOKEN')
      const url = '/api/v1/requests/' + nrNumber + '/syncnr'
      console.log('URL:' + url)
      const vm = this
      dispatch('checkToken')
      return axios.get(url, {headers: {Authorization: `Bearer ${myToken}`}}).then(response => {
        console.log('Comp Info Response:' + response.data)
        commit('loadCompanyInfo',response.data)
      })
      .catch(error => console.log('ERROR: ' + error))
    },

    resetValues({state, commit}){
      // clear NR specific JSON data so that it can't get accidentally re-used by the next NR number
      console.log('Deleting conflictsJSON from state')
      commit('loadConflictsJSON',null)
      commit('currentConflict', null)

      console.log('Deleting NamesConflictJSON from state')
      commit('loadNamesConflictJSON',null)

      console.log('Deleting CorpConflictJSON from state')
      commit('loadCorpConflictJSON',null)

      console.log('Deleting conditionsJSON from state')
      commit('loadConditionsJSON',null)

      console.log('Deleting HistoriesJSON from state')
      commit('loadHistoriesJSON',null)

      console.log('Deleting HistoriesInfoJSON from state')
      commit('loadHistoriesInfoJSON',null)
      commit('currentHistory',null)

      console.log('Deleting TrademarksJSON from state')
      commit('currentTrademark',null)
      commit('loadTrademarksJSON',null)

      // reset all flags like editing, making decision, etc.
      state.is_editing = false;
      state.is_making_decision = false;
      state.decision_made = null;
      state.acceptance_will_be_conditional = false;
      state.is_header_shown = false;

    },
    resetHistoriesInfo({commit}) {
      commit('loadHistoriesInfoJSON',null)
    },

  },
  getters: {
    keycloak(state) {
      return state.myKeycloak
    },
    userId(state) {
      return state.userId;
    },
    userHasEditRole(state) {
       let roles = state.user_roles;
       return roles.includes('names_approver') || roles.includes('names_editor')
    },
    userHasApproverRole(state) {
       let roles = state.user_roles;
       return roles.includes('names_approver')
    },
    is_my_current_nr(state) {
      // set flag indicating whether you own this NR and it's in progress
      if (state.currentState == 'INPROGRESS' && state.examiner == state.userId) return true;
      else return false;
    },
    furnished(state) {
      return state.furnished;
    },
    hasBeenReset(state) {
      return state.hasBeenReset;
    },
    is_complete(state) {
      // indicates a complete NR
      if (['APPROVED', 'REJECTED', 'CONDITIONAL','COMPLETED','CANCELLED','HISTORICAL','EXPIRED'].
           indexOf(state.currentState) >= 0 ) return true;
      else return false;
    },
    is_editing(state) {
      return state.is_editing
    },
    is_making_decision(state) {
      return state.is_making_decision
    },
    decision_made(state) {
      return state.decision_made;
    },
    acceptance_will_be_conditional(state) {
      return state.acceptance_will_be_conditional;
    },
    is_header_shown(state) {
      return state.is_header_shown
    },
    email(state) {
      return state.email
    },
    currentConflict(state) {
      return state.currentConflict;
    },
    currentCondition(state) {
      return state.currentCondition;
    },
    currentTrademark(state) {
      return state.currentTrademark;
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
      //return localStorage.getItem("AUTHORIZED")
      return state.authorized
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
    nwpta_ab(state) {
      return state.additionalCompInfo.nwpta_ab
    },
    nwpta_sk(state) {
      return state.additionalCompInfo.nwpta_sk
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
    reservationCount(state) {
      return state.reservationCount
    },
    expiryDate(state) {
      if (state.expiryDate != null) {
        // try converting from timestamp string
        var retval = new Date(state.expiryDate).toLocaleString('en-ca',{hour:'2-digit',minute:'2-digit',day:'2-digit',month:'2-digit',year:'numeric'});
        if (retval == 'Invalid Date') {
          retval = null;
        }
        return retval;
      }

      return null
    },
    expiryDateForEdit(state) {
      return state.expiryDateForEdit;
    },
    submittedDate(state) {
      if (state.submittedDate != null)
        return new Date(state.submittedDate).toLocaleString('en-ca',{hour:'2-digit',minute:'2-digit',day:'2-digit',month:'2-digit',year:'numeric'});
      return null
    },
    consumptionDate(state) {
      /* Find the consumption date for the request from the individual name consumption date.
       */
      var thedate = null;
      if (state.compInfo.compNames.compName1.consumptionDate != null) {
        thedate = state.compInfo.compNames.compName1.consumptionDate;
      }
      else if (state.compInfo.compNames.compName2.consumptionDate != null) {
        thedate = state.compInfo.compNames.compName2.consumptionDate;
      }
      else thedate = state.compInfo.compNames.compName3.consumptionDate;

      if (thedate != null)
        return new Date(thedate).toLocaleString('en-ca',{hour:'2-digit',minute:'2-digit',day:'2-digit',month:'2-digit',year:'numeric'});
      return null

    },
    submitCount(state) {
      return state.submitCount;
    },
    previousNr(state) {
      return state.previousNr;
    },
    corpNum(state) {
      return state.corpNum;
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
    requestTypeRules(state) {
      return state.requestTypeRules
    },
    exactMatchesConflicts(state) {
      return state.exactMatchesConflicts
    },
    hasExactMatches(state) {
      return state.exactMatchesConflicts ? state.exactMatchesConflicts.length > 0 : false;
    },
    synonymMatchesConflicts(state) {
      return state.synonymMatchesConflicts;
    },
    cobrsPhoneticConflicts(state) {
      return state.cobrsPhoneticConflicts;
    },
    phoneticConflicts(state) {
      return state.phoneticConflicts;
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
    historiesInfoJSON(state) {
      return state.historiesInfoJSON
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
    searchState(state) {
      return state.searchState
    },
    searchDataJSON(state) {
      return state.searchDataJSON
    },
    searchQuerySpecial(state) {
      return state.searchQuerySpecial
    },
    statsDataJSON(state){
      return state.statsDataJSON
    },
    errorJSON(state) {
      return state.errorJSON
    },
  }
})
