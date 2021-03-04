/* eslint-disable */
import Vue from 'vue'
import Vuex from 'vuex'
import axios from '../axios-auth'
import moment from 'moment'

Vue.use(Vuex)

export const actions = {
  logout({ commit, state }) {
    commit( 'clearAuthData' )
    sessionStorage.removeItem( 'KEYCLOAK_REFRESH' )
    sessionStorage.removeItem( 'KEYCLOAK_TOKEN' )
    sessionStorage.removeItem( 'AUTHORIZED' )
    sessionStorage.removeItem( 'KEYCLOAK_EXPIRES' )
    sessionStorage.removeItem( 'USERNAME' )
    sessionStorage.removeItem( 'USER_ROLES' )
  },
  loadSetUp({ commit, dispatch }) {
    //TODO - reset everything and force login???
    // clear values from local storeage
    dispatch( 'logout' )
    //Read Configuration.json File
    readJFile( 'static/config/configuration.json', function (myArray) {
      axios.defaults.baseURL = myArray[0]['URL']
      commit('setBaseURL', myArray[0]['URL'])
      //load UI dropdowns from json files and database tables
      dispatch( 'loadDropdowns' )

      //load admin link
      dispatch( 'loadAdminLink', myArray )
    } )
  },
  checkToken({ dispatch, state }) {
    // checks if keycloak object exists - if not then state is unstable, force logout
    if ( state.myKeycloak == null ) {
      //TODO - reset everything and force login???
      //should only be null when first logging on (async keycloak)- if it becomes null somehow should we force another
      // login?
      dispatch( 'logout' )
      //
      return
    }
    // checks if keycloak object has tokenParsed yet, if not then just return as this only happens at login
    if ( state.myKeycloak.tokenParsed == null ) {
      return
    }
    var expiresIn = state.myKeycloak.tokenParsed['exp'] - Math.ceil( new Date().getTime() / 1000 )

    if ( expiresIn < 1700 && expiresIn > 0 ) {
      dispatch( 'updateToken' )
    }
    else if ( expiresIn < 0 ) {
      //TODO - reset everything and force login???
      dispatch( 'logout' )
      window.location.assign( '/' )
      //
    }
  },
  updateToken({ commit, state }) {
    const vm = this
    state.myKeycloak.updateToken( -1 )
         .success( function (refreshed) {
           if ( refreshed ) {
             sessionStorage.setItem( 'KEYCLOAK_TOKEN', state.myKeycloak.token )
             sessionStorage.setItem( 'KEYCLOAK_REFRESH', state.myKeycloak.refreshToken )
             sessionStorage.setItem( 'KEYCLOAK_EXPIRES', state.myKeycloak.tokenParsed.exp * 1000 )
           }
         } )
         .error( function () {
           console.log( 'Failed to refresh the token, or the session has expired' )
         } )
  },
  checkError({ commit }, responseJSON) {
    if ( responseJSON.warnings != null ) {
      commit( 'setErrorJSON', responseJSON )
    }
    if ( responseJSON.errors != null ) {
      commit( 'setErrorJSON', responseJSON )
    }
    if ( responseJSON.message != null ) {
      commit( 'setErrorJSON', responseJSON )
    }
  },
  setDetails({ commit, state }) {
    var detail = state.details ? null : '1'
    commit( 'saveDetail', detail )
  },
  getpostgrescompNo({ commit, dispatch, state }) {
    const myToken = sessionStorage.getItem( 'KEYCLOAK_TOKEN' )
    const url = '/api/v1/requests/queues/@me/oldest'
    const vm = this

    dispatch( 'checkToken' )
    return axios.get( url, { headers: { Authorization: `Bearer ${ myToken }` } } )
                .then( response => {
                  // response.data.nameRequest = 'NR 8270105';
                  //response.data.nameRequest = 'NR 0000021';
                  commit( 'loadpostgresNo', response.data )
                } )
  },
  getpostgrescompInfo({ dispatch, commit }, nrNumber) {
    const myToken = sessionStorage.getItem( 'KEYCLOAK_TOKEN' )
    const url = '/api/v1/requests/' + nrNumber
    dispatch( 'checkToken' )
    axios.get( url, { headers: { Authorization: `Bearer ${ myToken }` } } )
      .then( response => {
        commit( 'loadCompanyInfo', response.data )
      } )
      .catch( error => console.log( 'ERROR: ' + error ) )
  },
  updateNRState({ commit, state, dispatch }, nrState) {
    const myToken = sessionStorage.getItem( 'KEYCLOAK_TOKEN' )
    const url = '/api/v1/requests/' + state.compInfo.nrNumber

    axios.patch( url, { 'state': nrState }, { headers: { Authorization: `Bearer ${ myToken }` } } )
         .then( function (response) {
           dispatch( 'getpostgrescompInfo', state.compInfo.nrNumber )
         } ).catch( error => console.log( 'ERROR: ' + error ) )
  },
  cancelNr({ commit, state, dispatch }, nrState) {
    dispatch('resetExaminationArea')

    commit( 'is_making_decision', false )
    const myToken = sessionStorage.getItem( 'KEYCLOAK_TOKEN' )
    const url = '/api/v1/requests/' + state.compInfo.nrNumber

    axios.patch( url, {
      'state': nrState,
      'comments': state.internalComments,
    }, { headers: { Authorization: `Bearer ${ myToken }` } } )
         .then( function (response) {

           dispatch( 'getpostgrescompInfo', state.compInfo.nrNumber )
         } )
         .catch( error => console.log( 'ERROR: ' + error ) )
  },
  nameAcceptReject({ commit, dispatch, state }) {
    let savedName = state.currentName
    const myToken = sessionStorage.getItem( 'KEYCLOAK_TOKEN' )
    const url = '/api/v1/requests/' + state.compInfo.nrNumber + '/names/' + state.currentChoice
    axios.put( url, state.currentNameObj, { headers: { Authorization: `Bearer ${ myToken }` } } )
         .then( function (response) {
           dispatch( 'resetExaminationArea' )
           if (['APPROVED', 'CONDITION'].includes(state.currentNameObj.state)) {
             if (state.nrData.requestTypeCd === 'CR') {
               commit('setWordClassificationModalName', savedName)
               commit('toggleWordClassificationModal', true)
             }
           }
           // Was this an accept? If so complete the NR
           if (state.currentNameObj.state == 'APPROVED') {
             dispatch( 'updateNRState', 'APPROVED' )
           }
           // was this a conditional accept? If so complete the NR
           else if ( state.currentNameObj.state == 'CONDITION' ) {
             dispatch( 'updateNRState', 'CONDITIONAL' )
           }
           // This was a reject? If so check whether there are any more names
           else {
             if ( state.currentChoice == 1 ) {
               if ( state.compInfo.compNames.compName2.state == null || state.compInfo.compNames.compName2.state !== 'NE' ) {
                 dispatch( 'updateNRState', 'REJECTED' )
               }
               else {
                 // save updated name with new state, decision text, etc.
                 commit( 'compName1', state.currentNameObj )
                 // we'e got another choice to move on to so move to the next
                 commit( 'currentNameObj', state.compInfo.compNames.compName2 )
               }
               return
             }
             else if ( state.currentChoice == 2 ) {
               if ( state.compInfo.compNames.compName3.state == null || state.compInfo.compNames.compName3.state !== 'NE' ) {
                 dispatch( 'updateNRState', 'REJECTED' )
               }
               else {
                 // save updated name with new state, decision text, etc.
                 state.compInfo.compNames.compName2 = state.currentNameObj

                 // we'e got another choice to move on to so move to the next
                 commit( 'currentNameObj', state.compInfo.compNames.compName3 )
               }
               return
             }
             else {
               // this is choice 3 so we're definitely done, there are no more names to examine
               dispatch( 'updateNRState', 'REJECTED' )
             }
           }
         } )
         .catch( error => {
           dispatch( 'getpostgrescompInfo', state.compInfo.nrNumber )
         } )
  },
  //updates the names data, through the api, into the database
  updateRequest({ commit, state }) {
    const myToken = sessionStorage.getItem( 'KEYCLOAK_TOKEN' )
    commit( 'update_nrData' )
    const url = '/api/v1/requests/' + state.compInfo.nrNumber
    axios.put( url, state.nrData, { headers: { Authorization: `Bearer ${ myToken }` } } )
         .then( function (response) {

           // load updated data from response
           if ( response.data !== undefined && response.data.nrNum !== undefined ) {
             commit( 'loadCompanyInfo', response.data )
           }
         } )
         .catch( error => console.log( 'ERROR: ' + error ) )
  },
  undoDecision({ state, getters, dispatch }, nameChoice) {
    dispatch('resetExaminationArea')
    const myToken = sessionStorage.getItem( 'KEYCLOAK_TOKEN' )

    var objName = {}
    if ( nameChoice == 1 ) objName = getters.compName1
    if ( nameChoice == 2 ) objName = getters.compName2
    if ( nameChoice == 3 ) objName = getters.compName3

    objName.state = 'NE'
    objName.conflict1 = null
    objName.conflict2 = null
    objName.conflict3 = null
    objName.conflict1_num = null
    objName.conflict2_num = null
    objName.conflict3_num = null
    objName.decision_text = null
    objName.comment = null

    const url = '/api/v1/requests/' + state.compInfo.nrNumber + '/names/' + nameChoice
    axios.put( url, objName, { headers: { Authorization: `Bearer ${ myToken }` } } )
         .then( function (response) {

           // get full NR from scratch
           dispatch('getpostgrescompInfo', state.compInfo.nrNumber)
         } )
         .catch( error => console.log( 'ERROR: ' + error ) )
  },
  loadAdminLink({ state }, myArray) {
    //Set Admin URL
    if ( myArray[0]['NODE_ENV'] == 'production' ) {
      state.adminURL = 'https://namex-solr.pathfinder.gov.bc.ca'
    }
    else if ( myArray[0]['NODE_ENV'] == 'test' ) {
      state.adminURL = 'https://namex-solr-test.pathfinder.gov.bc.ca'
    }
    else {
      state.adminURL = 'https://namex-solr-dev.pathfinder.gov.bc.ca'
    }
  },
  loadDropdowns({ commit, state }) {
    var json_files_path = 'static/ui_dropdowns/'

    // jurisdictions - first list 1, then list 2
    if ( state.listJurisdictions === null ) {
      readJFile( json_files_path + 'jurisdiction 1.json', function (myArray) {
        commit( 'listJurisdictions', myArray )

        readJFile( json_files_path + 'jurisdiction 2.json', function (myArray) {

          // sort the country list alphabetically
          myArray.sort( function (a, b) {
            return ( a.text > b.text ) ? 1 : ( ( b.text > a.text ) ? -1 : 0 )
          } )

          commit( 'listJurisdictions', state.listJurisdictions.concat( myArray ) )
        } )
      } )
    }
    // request types
    if ( state.listRequestTypes === null ) {
      readJFile( json_files_path + 'requesttype.json', function (myArray) {
        commit( 'listRequestTypes', myArray )
      } )
    }
    // decision reasons
    if ( state.listDecisionReasons === null ) {
      const myToken = sessionStorage.getItem( 'KEYCLOAK_TOKEN' )
      const url = '/api/v1/requests/decisionreasons'
      axios.get( url, { headers: { Authorization: `Bearer ${ myToken }` } } )
           .then( response => {
             commit( 'listDecisionReasons', response.data )
           } )
    }

    // request type rules - from CSV, not JSON
    if ( state.requestTypeRules === null ) {
      readCsv( json_files_path + 'request_type_rules.csv', function (myArray) {
        commit( 'requestTypeRules', myArray )
      } )
    }
  },
  newNrNumber({ commit, dispatch }, payload) {
    let { search, router, refresh } = payload
    const myToken = sessionStorage.getItem( 'KEYCLOAK_TOKEN' )
    const url = '/api/v1/requests/' + search
    dispatch( 'checkToken' )
    return axios.get( url, { headers: { Authorization: `Bearer ${ myToken }` } } )
                .then( response => {
                  // setting showExaminationArea briefly to false causes the components to re-render when its set
                  // to true again and call their created() and mounted() life cycle methods. This is necessary to
                  // allow the act of searching for the same NR as is currently displayed to function as a refresh
                  // mechanism
                  if (refresh) {
                    commit( 'showExaminationArea', false )
                  }
                  if ( router && router.currentRoute.path !== '/nameExamination' ) {
                    router.push( '/nameExamination' )
                  }
                  dispatch( 'resetValues' ).then( () => {
                    commit( 'nrNumber', search )
                    commit( 'loadCompanyInfo', response.data )
                    commit( 'is_making_decision', false )
                    if (refresh) {
                      commit( 'showExaminationArea', true )
                    }
                  } )
                } )
                .catch( error => {
                  console.log( 'ERROR: ' + error )
                  return
                } )
  },
  getConflictInfo({ state, commit, dispatch }, conflict) {
    if (!conflict.source || !conflict.nrNumber) return
    $( '.conflict-detail-spinner' ).removeClass( 'hidden' )

    commit( 'currentConflict', conflict )

    if ( conflict.source === 'CORP' ) {
      commit( 'loadCorpConflictJSON', null )
      dispatch( 'getCorpConflict', conflict ).then( data => {
        commit( 'loadCorpConflictJSON', data )
      } ).finally( () => {
        $( '.conflict-detail-spinner' ).addClass( 'hidden' )
      } )
    }
    else {
      commit( 'loadNamesConflictJSON', null )
      dispatch( 'getNamesConflict', conflict ).then( data => {
        commit( 'loadNamesConflictJSON', data )
      } ).finally( () => {
        $( '.conflict-detail-spinner' ).addClass( 'hidden' )
      } )
    }
  },
  updateCompareList({ getters, commit, dispatch }, conflict) {
    if (state.conflictsAutoAdd && state.selectedConflicts.length >= 3) return
    let { nrNumber } = conflict
    if (getters.comparedConflicts.some(item => item.nrNumber === nrNumber)) {
      commit('removeComparedConflict', nrNumber)
      return
    }

    let baseConflictData = {
      nrNumber: conflict.nrNumber,
      jurisdiction: conflict.jurisdiction,
      startDate: conflict.startDate,
      text: conflict.text,
      invalidRecordInd: false,
    }
      if ( conflict.source === 'CORP' ) {
        dispatch('getCorpConflict', conflict).then(data => {
          data = { ...baseConflictData, ...data }
          data.type = 'corp'
          commit('addComparedConflict', data)
        }).catch(() => {
          //set the invlalid record indicator so that CorpMatch will render an error message instead of a CorpMatch
          //container with no data whatsoever
          let data = { ...data, ...baseConflictData}
          data.type = 'corp'
          data.invalidRecordInd = true
          commit('addComparedConflict', data)
        })
      }
      else {
        dispatch('getNamesConflict', conflict).then(data => {
          data = { ...baseConflictData, ...data }
          data.type = 'name'
          commit('addComparedConflict', data)
        }).catch(() => {
          //set the invlalid record indicator so that NamesMatch will render an error message instead of a NameMatch
          //container with no data whatsoever
          let data = { ...data, ...baseConflictData }
          data.type = 'name'
          data.invalidRecordInd = true
          commit('addComparedConflict', data)
        })
      }
  },
  getNamesConflict({ state, commit, dispatch }, conflict) {
    let myToken = sessionStorage.getItem( 'KEYCLOAK_TOKEN' )
    let url = '/api/v1/requests/' + conflict.nrNumber

    return new Promise( (resolve, reject) => {
      axios.get( url, { headers: { Authorization: `Bearer ${ myToken }` }, spinner: null, } )
           .then( response => {
             resolve( response.data )
           } ).catch( error => {
        dispatch( 'checkError', {
          errors: [
            {
              code: 404,
              message: {
                'NR Info Error': [`NR info couldn't be displayed as it isn't loaded in postgres yet`]
              }
            }
          ]
        } )
        reject()
      } )
    } )
  },
  getCorpConflict({ state, commit, dispatch }, conflict) {
    const myToken = sessionStorage.getItem( 'KEYCLOAK_TOKEN' )
    const url = '/api/v1/corporations/' + conflict.nrNumber

    return new Promise( (resolve, reject) => {
      axios.get( url, { headers: { Authorization: `Bearer ${ myToken }` }, spinner: false, } )
           .then( response => {
             resolve( response.data )
           } ).catch( error => {
        dispatch( 'checkError', {
          errors: [
            {
              code: 404,
              message: {
                'Corp Error': [`Corp info couldn't be displayed. It isn't in fdw-registries data.`]
              }
            }
          ]
        } )
        reject()
      } )
    } )
  },
  getHistoryInfo({ state, commit, dispatch }, value) {
    $( '.history-list-spinner' ).removeClass( 'hidden' )
    const myToken = sessionStorage.getItem( 'KEYCLOAK_TOKEN' )
    const url = '/api/v1/requests/' + value.nr_num
    const vm = this
    return axios.get( url, { headers: { Authorization: `Bearer ${ myToken }` }, spinner: false, } ).then( response => {
      commit( 'loadHistoriesInfoJSON', response.data )
      $( '.history-list-spinner' ).addClass( 'hidden' )
    } )
                .catch( error => {
                  $( '.history-list-spinner' ).addClass( 'hidden' )
                  dispatch( 'checkError', {
                    errors: [
                      {
                        code: 404,
                        message: { 'NR Info Error': ['NR info could not be displayed because it isn\'t loaded in postgres yet.'] }
                      }
                    ]
                  } )
                } )
  },
  getSearchDataJSON({ commit, state }, val) {
    const myToken = sessionStorage.getItem( 'KEYCLOAK_TOKEN' )
    // current hour passed in via front end because server is in utc time (for last update and submitted date filters
    var currentDate = new Date()
    const url = '/api/v1/requests' + val + '&hour=' + currentDate.getHours()

    const vm = this
    return axios.get( url, { headers: { Authorization: `Bearer ${ myToken }` } } )
                .then( response => {
                  commit( 'loadSearchDataJSON', response.data )
                } )
                .catch( error => console.log( 'ERROR: ' + error ) )
  },
  getStatsDataJSON({ commit, state }, stateCd) {
    const myToken = sessionStorage.getItem( 'KEYCLOAK_TOKEN' )
    var newQuery = '?order=priorityCd:desc,submittedDate:asc&queue=' + stateCd +
      '&furnished=true&unfurnished=true&rows=1&start=0'
    const url = '/api/v1/requests' + newQuery
    return axios.get( url, { headers: { Authorization: `Bearer ${ myToken }` } } )
                .then( response => {
                  var params = {
                    myState: stateCd, JSONdata: response.data,
                  }
                  //commit('loadStatsDataJSON', response.data)
                  commit( 'loadStatsDataJSON', params )
                } )
                .catch( error => console.log( 'ERROR: ' + error ) )
  },
  setCurrentName({ commit, state }, objName) {
    commit( 'currentNameObj', objName )
  },
  runManualRecipe({ dispatch, state, commit }, searchObj) {
    if ( state.currentChoice != null ) {
      $( '.conflict-container-spinner' ).removeClass( 'hidden' )
      commit( 'setConflictsReturnedStatus', false )
      let p1 = dispatch( 'checkManualExactMatches', searchObj.searchStr )
      let p2 = dispatch( 'checkManualSynonymMatches', searchObj )
      let p3 = dispatch( 'checkManualCobrsPhoneticMatches', searchObj )
      let p4 = dispatch( 'checkManualPhoneticMatches', searchObj )
      let p5 = dispatch('checkManualTrademarks', searchObj.searchStr)
      let p6 = dispatch('checkManualConditions', searchObj.searchStr)
      let p7 = dispatch('checkManualHistories', searchObj.searchStr)
      Promise.all( [p1, p2, p3, p4, p5, p6, p7] ).finally( () => {
        commit( 'setConflictsReturnedStatus', true )
        setTimeout(() => { $( '.conflict-container-spinner' ).addClass( 'hidden' ) }, 500)
      } )
      // this.dispatch('checkManualConflicts',searchStr)

    }
  },
  checkManualExactMatches({ commit, state }, query) {
    query = query.replace( ' \/', '\/' )
                 .replace( /(^|\s+)(\$+(\s|$)+)+/g, '$1DOLLAR$3' )
                 .replace( /(^|\s+)(¢+(\s|$)+)+/g, '$1CENT$3' )
                 .replace( /\$/g, 'S' )
                 .replace( /¢/g, 'C' )
                 .replace( /\\/g, '' )
                 .replace( /\//g, '' )
                 .replace( /(`|~|!|\||\(|\)|\[|\]|\{|\}|:|"|\^|#|%|\?)/g, '' )
                 .replace( /[\+\-]{2,}/g, '' )
                 .replace( /\s[\+\-]$/, '' )
    const myToken = sessionStorage.getItem( 'KEYCLOAK_TOKEN' )
    query = query.substring( 0, 1 ) == '+' ? query.substring( 1 ) : query
    query = encodeURIComponent( query )
    const url = '/api/v1/exact-match?query=' + query
    return axios.get( url, {
      headers: { Authorization: `Bearer ${ myToken }` },
      spinner: '.exact-match-spinner'
    } ).then( response => {
      commit( 'setExactMatchesConflicts', response.data )
    } ).catch( error => { console.log( 'ERROR (exact matches): ' + error ) } )
  },
  checkManualSynonymMatches({ dispatch, commit, state }, searchObj) {
    var searchStr = ( ( searchObj.searchStr == '' ) ? '*' : searchObj.searchStr )
    var exactPhrase = searchObj.exactPhrase
    searchStr = searchStr.replace( /\//g, ' ' )
                         .replace( /\\/g, ' ' )
                         .replace( /&/g, ' ' )
                         .replace( /\+/g, ' ' )
                         .replace( /\-/g, ' ' )
                         .replace( /(^| )(\$+(\s|$)+)+/g, '$1DOLLAR$3' )
                         .replace( /(^| )(¢+(\s|$)+)+/g, '$1CENT$3' )
                         .replace( /\$/g, 'S' )
                         .replace( /¢/g, 'C' )
                         .replace( /(`|~|!|\||\(|\)|\[|\]|\{|\}|:|"|\^|#|%|\?|,)/g, '' )
    if ( exactPhrase == '' ) exactPhrase = '*'
    const myToken = sessionStorage.getItem( 'KEYCLOAK_TOKEN' )
    const url = '/api/v1/requests/synonymbucket/' + searchStr + '/' + exactPhrase
    dispatch( 'checkToken' )
    return axios.get( url, {
      headers: { Authorization: `Bearer ${ myToken }` },
      spinner: '.synonym-match-spinner'
    } ).then( response => {
      commit( 'setSynonymMatchesConflicts', response.data )
    } ).catch( error => {
      console.log( 'ERROR (synonym matches): ' + error )
    } )
  },
  checkManualCobrsPhoneticMatches({ dispatch, commit, state }, searchObj) {
    var query = ( ( searchObj.searchStr == '' ) ? '*' : searchObj.searchStr )
    query = query.replace( /\//g, ' ' )
                 .replace( /\\/g, ' ' )
                 .replace( /&/g, ' ' )
                 .replace( /\+/g, ' ' )
                 .replace( /\-/g, ' ' )
                 .replace( /(^| )(\$+(\s|$)+)+/g, '$1DOLLAR$3' )
                 .replace( /(^| )(¢+(\s|$)+)+/g, '$1CENT$3' )
                 .replace( /\$/g, 'S' )
                 .replace( /¢/g, 'C' )
                 .replace( /(`|~|!|\||\(|\)|\[|\]|\{|\}|:|"|\^|#|%|\?)/g, '' )
    const myToken = sessionStorage.getItem( 'KEYCLOAK_TOKEN' )
    const url = '/api/v1/requests/cobrsphonetics/' + query + '/*'
    dispatch( 'checkToken' )
    return axios.get( url, {
      headers: { Authorization: `Bearer ${ myToken }` },
      spinner: '.cobrs-phonetic-match-spinner'
    } ).then( response => {
      commit( 'setCobrsPhoneticConflicts', response.data )
    } ).catch( error => {
      console.log( 'ERROR (CobrsPhonetic matches): ' + error )
    } )
  },
  checkManualPhoneticMatches({ dispatch, commit, state }, searchObj) {
    let query = ( ( searchObj.searchStr == '' ) ? '*' : searchObj.searchStr )
    query = query.replace( /\//g, ' ' )
                 .replace( /\\/g, ' ' )
                 .replace( /&/g, ' ' )
                 .replace( /\+/g, ' ' )
                 .replace( /\-/g, ' ' )
                 .replace( /(^| )(\$+(\s|$)+)+/g, '$1DOLLAR$3' )
                 .replace( /(^| )(¢+(\s|$)+)+/g, '$1CENT$3' )
                 .replace( /\$/g, 'S' )
                 .replace( /¢/g, 'C' )
                 .replace( /(`|~|!|\||\(|\)|\[|\]|\{|\}|:|"|\^|#|%|\?)/g, '' )
    const myToken = sessionStorage.getItem( 'KEYCLOAK_TOKEN' )
    const url = '/api/v1/requests/phonetics/' + query + '/*'
    dispatch( 'checkToken' )
    return axios.get( url, {
      headers: { Authorization: `Bearer ${ myToken }` }, spinner: '.phonetic-match-spinner'
    } )
                .then( response => {
                  commit( 'setPhoneticConflicts', response.data )
                } )
                .catch( error => {
                  console.log( 'ERROR (Phonetic matches): ' + error )
                } )
  },
  checkManualConditions({ commit, state }, searchStr) {
    if ( searchStr != '' ) {
      const myToken = sessionStorage.getItem( 'KEYCLOAK_TOKEN' )
      const myHeader = { headers: { Authorization: `Bearer ${ myToken }` }, spinner: '.conditions-spinner' }
      const url = `/api/v1/documents:restricted_words?content=${searchStr}`
      const vm = this
      return axios.get( url, myHeader ).then( response => {
        commit( 'loadConditionsJSON', response.data )
      } )
                  .catch( error => console.log( 'ERROR: ' + error ) )
    }
  },
  checkManualHistories({ commit, state }, searchStr) {
    if ( searchStr != '' ) {
      const myToken = sessionStorage.getItem( 'KEYCLOAK_TOKEN' )
      const myHeader = { headers: { Authorization: `Bearer ${ myToken }` }, spinner: '.history-spinner' }
      const url = '/api/v1/documents:histories'
      searchStr = searchStr.replace( /\//g, ' ' )
                           .replace( /\\/g, ' ' )
                           .replace( /&/g, ' ' )
                           .replace( /\+/g, ' ' )
                           .replace( /\-/g, ' ' )
                           .replace( /(^| )(\$+(\s|$)+)+/g, '$1DOLLAR$3' )
                           .replace( /(^| )(¢+(\s|$)+)+/g, '$1CENT$3' )
                           .replace( /\$/g, 'S' )
                           .replace( /¢/g, 'C' )
                           .replace( /(`|~|!|\||\(|\)|\[|\]|\{|\}|:|"|\^|#|%|\?)/g, '' )
      return axios.post( url, { type: 'plain_text', content: searchStr }, myHeader )
                  .then( response => {
                    commit( 'loadHistoriesJSON', response.data )
                  } )
                  .catch( error => console.log( 'ERROR: ' + error ) )
    }
  },
  checkManualTrademarks({ commit, state }, searchStr) {
    if ( searchStr != '' ) {
      const myToken = sessionStorage.getItem( 'KEYCLOAK_TOKEN' )
      const myHeader = { headers: { Authorization: `Bearer ${ myToken }` }, spinner: '.trademarks-spinner' }
      const url = '/api/v1/documents:trademarks'
      searchStr = searchStr.replace( /\//g, ' ' )
                           .replace( /\\/g, ' ' )
                           .replace( /&/g, ' ' )
                           .replace( /\+/g, ' ' )
                           .replace( /\-/g, ' ' )
                           .replace( /\(/g, '' )
                           .replace( /\)/g, '' )
                           .replace( /}/g, '' )
                           .replace( /{/g, '' )
                           .replace( /]/g, '' )
                           .replace( /\[/g, '' )
                           .replace( /\?/g, '' )
                           .replace( /#/g, '' )
                           .replace( /%/g, '' )
                           .replace( /(^| )(\$+(\s|$)+)+/g, '$1DOLLAR$3' )
                           .replace( /(^| )(¢+(\s|$)+)+/g, '$1CENT$3' )
                           .replace( /\$/g, 'S' )
                           .replace( /¢/g, 'C' )
                           .replace( /(`|~|!|\||\(|\)|\[|\]|\{|\}|:|"|\^|#|%|\?)/g, '' )
      return axios.post( url, { type: 'plain_text', content: searchStr }, myHeader )
                  .then( response => {
                    commit( 'loadTrademarksJSON', response.data )
                  } )
                  .catch( error => console.log( 'ERROR: ' + error ) )
    }
  },
  syncNR({ dispatch, commit }, nrNumber) {
    const myToken = sessionStorage.getItem( 'KEYCLOAK_TOKEN' )
    const url = '/api/v1/requests/' + nrNumber + '/syncnr'
    const vm = this
    dispatch( 'checkToken' )
    return axios.get( url, { headers: { Authorization: `Bearer ${ myToken }` } } )
                .then( response => {
                  commit( 'loadCompanyInfo', response.data )
                } )
                .catch( error => console.log( 'ERROR: ' + error ) )
  },
  resetValues({ state, commit, dispatch }) {
    // clear NR specific JSON data so that it can't get accidentally re-used by the next NR number
    dispatch('resetExaminationArea')
    commit( 'loadConflictsJSON', null )
    commit( 'setExactMatchesConflicts', null )
    commit( 'setSynonymMatchesConflicts', null )
    commit( 'setCobrsPhoneticConflicts', null )
    commit( 'setPhoneticConflicts', null )
    commit( 'currentConflict', null )
    commit( 'loadNamesConflictJSON', null )
    commit( 'loadCorpConflictJSON', null )
    commit( 'loadConditionsJSON', null )
    commit( 'loadHistoriesJSON', null )
    commit( 'loadHistoriesInfoJSON', null )
    commit( 'currentHistory', null )
    commit( 'currentTrademark', null )
    commit( 'loadTrademarksJSON', null )
    commit( 'setConflictsReturnedStatus', null )

    // reset all flags like editing, making decision, etc.
    state.is_editing = false
    state.is_making_decision = false
    state.decision_made = null
    state.is_header_shown = false
  },
  resetHistoriesInfo({ commit }) {
    commit( 'loadHistoriesInfoJSON', null )
  },
  postComment({ commit, state }) {
    const myToken = sessionStorage.getItem( 'KEYCLOAK_TOKEN' )
    const myHeader = { headers: { Authorization: `Bearer ${ myToken }` }, spinner: '.conditions-spinner' }
    const url = `/api/v1/requests/${ state.compInfo.nrNumber }/comments`
    let data = { comment: state.newComment }

    axios.post( url, data, { headers: { Authorization: `Bearer ${ myToken }` } } )
         .then( response => {
           let comments
           if ( state.internalComments && Array.isArray(
             state.internalComments ) && state.internalComments.length > 0 )
           {
             comments = Object.assign( [], state.internalComments )
           }
           else {
             comments = []
           }
           comments.push( response.data )
           commit( 'internalComments', comments )
           commit( 'setNewComment', null )
         } )
         .catch( error => console.log( 'ERROR: ' + error ) )
  },

  //added during namex-ui-enhnacement
  toggleConflictCheckbox({ state, commit, dispatch }, conflictData) {
    let { nrNumber } = conflictData
    if (state.selectedConflictNRs.includes(nrNumber)) {
      dispatch('removeComparedNR', nrNumber)
      return
    }
    if ( state.conflictsAutoAdd && state.selectedConflicts.length >= 3 ) return
    commit('addSelectedConflictNRs', nrNumber)

    dispatch('updateCompareList', conflictData).catch( () => {
      //if the NR data could not be retrieved from API, then remove the checkbox added by calling this function the
      //previous time.  Done like this so the checkbox will check immediately (for ui responsiveness) but uncheck
      //eventually if the conflict cannot be compared.
      commit('removeSelectedConflictNRs', nrNumber)
    })

    if (state.conflictsAutoAdd) {
      dispatch('updateSelectedConflicts', conflictData)
    }
  },
  updateSelectedConflicts({ state, commit }, conflictData) {
    let { nrNumber } = conflictData
    let index = state.selectedConflicts.findIndex(conflict => conflict.nrNumber === nrNumber)
    let listCopy = [ ...state.selectedConflicts ]
    if (index === -1) {
      listCopy.push(conflictData)
    } else {
      listCopy.splice(index, 1)
    }
    commit('setSelectedConflicts', listCopy)
  },
  removeComparedNR({ state, commit }, nrNumber) {
    if (state.selectedConflictNRs.includes(nrNumber)) {
      commit('removeSelectedConflictNRs', nrNumber)
    }

    let selectedIndex = state.selectedConflicts.findIndex(conflict => conflict.nrNumber === nrNumber)
    if ( selectedIndex >= 0) {
      let selectedCopy = [ ...state.selectedConflicts ]
      selectedCopy.splice(selectedIndex, 1)
      commit('setSelectedConflicts', selectedCopy)
    }

    let comparedIndex = state.comparedConflicts.findIndex(conflict => conflict.nrNumber === nrNumber)
    if ( comparedIndex >= 0 ) {
      let comparedCopy = [...state.comparedConflicts]
      comparedCopy.splice(comparedIndex, 1)
      commit('setComparedConflicts', comparedCopy)
    }
  },
  resetConflictList({ commit }) {
    commit('setConflictsChildIndex', null)
    commit('setConflictsChildren', [])
    commit('setConflictsIndex', null)
    commit('setConflictsScrollPosition', 0)
    commit('setExpandedConflictID', null)
    commit('setOpenBucket', null)
    commit('setSelectedConflictID', null)
    commit('setSelectedConflictNRs', [])
    commit('setComparedConflicts', [])
  },
  resetExaminationArea({ commit, dispatch }) {
    dispatch('resetConflictList')
    dispatch('resetDecision')
    commit('setConflictsAutoAdd', true)
    commit('setConsentRequiredByUser', false)
    commit('setCustomerMessageOverride', null)
    commit('resetTransactionModalState')
  },
  resetDecision({ commit }) {
    commit('setSelectedConditions', [])
    commit('setSelectedConflicts', [])
    commit('setSelectedReasons', [])
    commit('setSelectedTrademarks', [])
  },
  getTransactionsHistory({ commit, dispatch }, nrNumber) {
    const myToken = sessionStorage.getItem('KEYCLOAK_TOKEN')
    const url = '/api/v1/events/' + nrNumber
    commit('setTransactionsRequestStatus', 'pending')
    commit('toggleCommentsPopUp', false)
    commit('toggleRequestBannerPopUp', null)
    commit('toggleTransactionsModal', true)
    return new Promise((resolve, reject) => {
      axios.get(url, { headers: { Authorization: `Bearer ${ myToken }` }})
        .then(response => {
          let { transactions } = response.data
          let jsonDataFalse = [
            'Get NR Details from NRO',
            'Decision',
            'Load NR',
            'Updated NRO',
            'Hold Request',
            'Get Next NR',
            'Marked on Hold',
            'Migrated by NRO',
            'Set to Historical by NRO(Migration)',
            'Expired by NRO',
            'Cancelled in NRO',
          ]
          let data = []

          for (let entry in transactions) {
            let item = transactions[entry]
            if (!item.user_action) {
              item.user_action = item.action
            }
            if (typeof item.jsonData === 'string') {
              item.jsonData = JSON.parse(item.jsonData)
            }
            if (item.jsonData && Object.keys(item.jsonData).length > 0) {
              item.showJSONData = true
              if ( jsonDataFalse.includes(item.user_action) ) {
                item.showJSONData = false
              }
            } else {
              item.showJSONData = false
            }
            data.push(item)
          }
          commit('setTransactionsData', data)
          commit('setTransactionsRequestStatus', 'success')
          resolve()
        })
        .catch( () => {
          commit('setTransactionsData', 'No data')
          commit('setTransactionsRequestStatus', 'success')
          resolve()
        })
    })
  },

  postWordForClassification(context, payload) {
    const myToken = sessionStorage.getItem( 'KEYCLOAK_TOKEN' )
    const myHeader = { headers: { Authorization: `Bearer ${ myToken }` }, spinner: '.conditions-spinner' }
    const url = `/api/v1/word-classification/${payload.url}`
    let data = payload.data

    return axios.put( url, data, { headers: { Authorization: `Bearer ${ myToken }` } } )
  }
}

export const getters = {
  keycloak(state) {
    return state.myKeycloak
  },
  userId(state) {
    return state.userId
  },
  userHasEditRole(state) {
    let roles = state.user_roles
    return roles.includes( 'names_approver' ) || roles.includes( 'names_editor' )
  },
  userHasApproverRole(state) {
    let roles = state.user_roles
    return roles.includes( 'names_approver' )
  },
  is_my_current_nr(state) {
    // set flag indicating whether you own this NR and it's in progress
    if ( state.currentState == 'INPROGRESS' && state.examiner == state.userId ) {
      return true
    }
    else {
      return false
    }
  },
  furnished(state) {
    return state.furnished
  },
  hasBeenReset(state) {
    return state.hasBeenReset
  },
  is_complete(state) {
    // indicates a complete NR
    if ( ['APPROVED', 'REJECTED', 'CONDITIONAL', 'COMPLETED', 'CANCELLED', 'HISTORICAL', 'EXPIRED'].indexOf(
      state.currentState ) >= 0 )
    {
      return true
    }
    else {
      return false
    }
  },
  is_editing(state) {
    return state.is_editing
  },
  is_making_decision(state) {
    return state.is_making_decision
  },
  decision_made(state) {
    return state.decision_made
  },
  is_header_shown(state) {
    return state.is_header_shown
  },
  email(state) {
    return state.email
  },
  currentConflict(state) {
    return state.currentConflict
  },
  currentCondition(state) {
    return state.currentCondition
  },
  currentTrademark(state) {
    return state.currentTrademark
  },
  currentNameObj(state) {
    return state.currentNameObj
  },
  currentChoice(state) {
    return state.currentChoice
  },
  currentState(state) {
    return state.currentState
  },
  currentName(state) {
    return state.currentName
  },
  issueText(state) {
    return state.issueText
  },
  isAuthenticated(state) {
    //return sessionStorage.getItem("AUTHORIZED")
    return state.authorized
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
    return state.applicantInfo.contactInfo.email
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
    return state.additionalCompInfo.jurisdiction
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
    if ( state.priority == 'Y' ) {
      return true
    }
    else {
      return false
    }
  },
  reservationCount(state) {
    return state.reservationCount
  },
  expiryDate(state) {
    if ( state.expiryDate ) {
      return state.expiryDate
    }
    return null
  },
  expiryDateForEdit(state) {
    if ( state.expiryDateForEdit ) {
      return state.expiryDateForEdit
    }
    return null
  },
  submittedDate(state) {
    if ( state.submittedDate ) return state.submittedDate
    return null
  },
  consumptionDate(state) {
    /* Find the consumption date for the request from the individual name consumption date.
     */
    var thedate = null
    if ( state.compInfo.compNames.compName1.consumptionDate != null ) {
      thedate = state.compInfo.compNames.compName1.consumptionDate
    }
    else if ( state.compInfo.compNames.compName2.consumptionDate != null ) {
      thedate = state.compInfo.compNames.compName2.consumptionDate
    }
    else {
      thedate = state.compInfo.compNames.compName3.consumptionDate
    }

    if ( thedate != null ) {
      return thedate
    }
    return null

  },
  submitCount(state) {
    return state.submitCount
  },
  previousNr(state) {
    return state.previousNr
  },
  corpNum(state) {
    return state.corpNum
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
    return state.exactMatchesConflicts ? state.exactMatchesConflicts.length > 0 : false
  },
  synonymMatchesConflicts(state) {
    return state.synonymMatchesConflicts
  },
  cobrsPhoneticConflicts(state) {
    return state.cobrsPhoneticConflicts
  },
  phoneticConflicts(state) {
    return state.phoneticConflicts
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
  statsDataJSON(state) {
    return state.statsDataJSON
  },
  errorJSON(state) {
    return state.errorJSON
  },
  adminURL(state) {
    return state.adminURL
  },
  parseConditions(state) {
    function parseBoolean(cond) {
      if ( cond === 'Y' ) return true
      if ( cond === 'N' ) return false
      return ''
    }

    if ( state.conditionsJSON && state.conditionsJSON.restricted_words_conditions ) {
      let output = []
      for ( let restrictedWord of state.conditionsJSON.restricted_words_conditions ) {
        for ( let conditionInfo of restrictedWord.cnd_info ) {
          let object = {
            ...conditionInfo,
            consent_required_tf: parseBoolean( conditionInfo.consent_required ),
            allow_use_tf: parseBoolean( conditionInfo.allow_use ),
            phrase: restrictedWord.word_info.phrase,
          }
          output.push( object )
        }
      }
      return output
    }
    return []
  },

  //introduced in namex-ui-enhancements code-with-us
  selectedTrademarks: state => state.selectedTrademarks,
  selectedConflicts: state => state.selectedConflicts,
  selectedConditions: state => state.selectedConditions,
  editMessageModalVisible: state => state.editMessageModalVisible,
  selectedConflictID: state => state.selectedConflictID,
  expandedConflictID: state => state.expandedConflictID,
  openBucket: state => state.openBucket,
  conflictTitles(state, getters) {
    let output = []
    if ( state.conflictsReturnedStatus ) {

      //add exact matches
      output.push( { count: 0, highlightedText: 'Exact Match', class: 'conflict-heading' } )
      if ( state.exactMatchesConflicts.length > 0 ) {
        output.push( ...state.exactMatchesConflicts )
      }
      else {
        output.push( { highlightedText: 'No Exact Match', class: 'conflict-no-match' } )
      }

      //add synonym matches
      output.push( { count: 0, highlightedText: 'Exact Word Order + Synonym Match', class: 'conflict-heading' } )
      if ( state.parsedSynonymConflicts.length > 0 ) {
        output.push( ...state.parsedSynonymConflicts )
      }
      else {
        output.push( { highlightedText: 'No Match', class: 'conflict-no-match' } )
      }

      //add cobrs matches
      output.push( { count: 0, highlightedText: 'Character Swap Match', class: 'conflict-heading' } )
      if ( state.parsedCOBRSConflicts.length > 0 ) {
        output.push( ...state.parsedCOBRSConflicts )
      }
      else {
        output.push( { highlightedText: 'No Match', class: 'conflict-no-match' } )
      }

      //add phonetic matches
      output.push( { count: 0, highlightedText: 'Phonetic Match (experimental)', class: 'conflict-heading' } )
      if ( state.parsedPhoneticConflicts.length > 0 ) {
        output.push( ...state.parsedPhoneticConflicts )
      }
      else {
        output.push( { highlightedText: 'No Match', class: 'conflict-no-match' } )

      }
    }
    return output.filter(match => match.nrNumber !== getters.nrNumber)
  },
  selectedNRs(state) {
    if ( state.selectedConflicts && state.selectedConflicts.length > 0 ) {
      return state.selectedConflicts.map( conflict => conflict.nrNumber )
    }
    return []
  },
  conflictsChildIndex: state => state.conflictsChildIndex,
  conflictsIndex: state => state.conflictsIndex,
  conflictsChildren: state => state.conflictsChildren,
  conflictsAutoAdd: state => state.conflictsAutoAdd,
  autoAddDisabled: (state, getters) => {
    return (
      getters.decisionPanel.functionalityDisabled
      || state.selectedConflicts.length > 0
      || state.comparedConflicts.length > 0
    )
  },
  comparedConflicts: state => state.comparedConflicts,
  decisionPanel(state) {
    let show = true
    let functionalityDisabled = false
    if ( state.examiner !== state.userId || !state.is_making_decision ) show = false
    if ( state.customerMessageOverride || !show ) functionalityDisabled = true
    return { show, functionalityDisabled }
  },
  customerMessageOverride: state => state.customerMessageOverride,
  conflictsScrollPosition: state => state.conflictsScrollPosition,
  selectedConflictNRs: state => state.selectedConflictNRs,
  selectedReasons: state => state.selectedReasons,
  acceptanceWillBeConditional: state => {
    let checkConditions = () => {
      if (state.selectedConditions && Array.isArray(state.selectedConditions) ) {
        return state.selectedConditions.some(condition => condition.consent_required)
      }
      return false
    }
    return state.consentRequiredByUser || checkConditions() || false
  },
  getShortJurisdiction: state => jurisdiction => {
    jurisdiction = jurisdiction.toUpperCase()
    if ( jurisdiction.length === 2 ) return jurisdiction

    let index
    let textIndex = state.listJurisdictions.findIndex(opt => opt.text === jurisdiction)
    if ( textIndex >= 0 ) index = textIndex
    let shortIndex = state.listJurisdictions.findIndex(opt => opt.SHORT_DESC === jurisdiction)
    if ( shortIndex >= 0 ) index = shortIndex

    if ( typeof index === 'number' ) {
      return state.listJurisdictions[index].value
    }

    return '?'
  },
}

export const mutations = {
  requestType(state, value) {
    state.compInfo.requestType = value
  },
  is_my_current_nr(state, value) {
    state.is_my_current_nr = value
  },
  decision_made(state, value) {
    state.decision_made = value
  },
  currentState(state, value) {
    state.currentState = value
  },
  compName1(state, value) {
    state.compInfo.compNames.compName1 = value
  },
  compName2(state, value) {
    state.compInfo.compNames.compName2 = value
  },
  compName3(state, value) {
    state.compInfo.compNames.compName3 = value
  },
  clientFirstName(state, value) {
    state.applicantInfo.clientName.firstName = value
  },
  clientLastName(state, value) {
    state.applicantInfo.clientName.lastName = value
  },
  firstName(state, value) {
    state.applicantInfo.applicantName.firstName = value
  },
  middleName(state, value) {
    state.applicantInfo.applicantName.middleName = value
  },
  lastName(state, value) {
    state.applicantInfo.applicantName.lastName = value
  },
  addressLine1(state, value) {
    state.applicantInfo.contactInfo.addressLine1 = value
  },
  addressLine2(state, value) {
    state.applicantInfo.contactInfo.addressLine2 = value
  },
  addressLine3(state, value) {
    state.applicantInfo.contactInfo.addressLine3 = value
  },
  city(state, value) {
    state.applicantInfo.contactInfo.city = value
  },
  province(state, value) {
    state.applicantInfo.contactInfo.province = value
  },
  country(state, value) {
    state.applicantInfo.contactInfo.country = value
  },
  postalCode(state, value) {
    state.applicantInfo.contactInfo.postalCode = value
  },
  contactName(state, value) {
    state.applicantInfo.contactInfo.contactName = value
  },
  phone(state, value) {
    state.applicantInfo.contactInfo.phone = value
  },
  conEmail(state, value) {
    state.applicantInfo.contactInfo.email = value
  },
  fax(state, value) {
    state.applicantInfo.contactInfo.fax = value
  },
  jurisdiction(state, value) {
    state.additionalCompInfo.jurisdiction = value
  },
  natureOfBusiness(state, value) {
    state.additionalCompInfo.natureOfBussiness = value
  },
  nwpta_ab(state, value) {
    state.additionalCompInfo.nwpta_ab = value
  },
  nwpta_sk(state, value) {
    state.additionalCompInfo.nwpta_sk = value
  },
  nr_status(state, value) {
    state.additionalCompInfo.nr_status = value
  },
  reservationCount(state, value) {
    state.reservationCount = value
  },
  showExaminationArea (state, value) {
    state.showExaminationArea = value
  },
  expiryDate(state, value) {
    state.expiryDate = value
  },
  expiryDateForEdit(state, value) {
    state.expiryDateForEdit = value
  },
  details(state, value) {
    state.details = value
  },
  additionalInfo(state, value) {
    state.additionalInfo = value
  },
  internalComments(state, value) {
    state.internalComments = value
  },
  previousNr(state, value) {
    state.previousNr = value
  },
  corpNum(state, value) {
    state.corpNum = value
  },
  searchQuery(state, value) {
    state.searchQuery = value
  },
  searchQuerySpecial(state, value) {
    state.searchQuerySpecial = value
  },
  searchState(state, value) {
    state.searchState = value
  },
  searchNr(state, value) {
    state.searchNr = value
  },
  searchUsername(state, value) {
    state.searchUsername = value
  },
  searchCompName(state, value) {
    state.searchCompName = value
  },
  searchRanking(state, value) {
    state.searchRanking = value
  },
  searchNotification(state, value) {
    state.searchNotification = value
  },
  searchSubmittedInterval(state, value) {
    state.searchSubmittedInterval = value
  },
  searchLastUpdatedInterval(state, value) {
    state.searchLastUpdatedInterval = value
  },
  searchCurrentPage(state, value) {
    state.searchCurrentPage = value
  },
  searchPerPage(state, value) {
    state.searchPerPage = value
  },
  furnished(state, value) {
    state.furnished = value
  },
  hasBeenReset(state, value) {
    state.hasBeenReset = value
  },
  clearAuthData(state) {
    state.userId = null
    state.authorized = null
  },
  loadpostgresNo(state, postgresData) {
    state.compInfo.nrNumber = postgresData.nameRequest
  },
  loadCompanyInfo(state, dbcompanyInfo) {
    if (state.nrData && state.nrData.consent_dt) {
      state.nrData.consent_dt = null
    }
    if (state.nrData && state.nrData.consentFlag) {
      state.nrData.consentFlag = null
    }
    if (state.consentDateForEdit) {
      state.consentDateForEdit = null
    }
    if ( !dbcompanyInfo || !dbcompanyInfo.names ) return
    state.nrData = dbcompanyInfo

    if ( dbcompanyInfo.names.length == 0 ) {
      return
    }
    // clear name choices 2 and 3 in case they are blank - ie: don't keep previous NR's data
    state.compInfo.compNames.compName2.name = null
    state.compInfo.compNames.compName2.state = null
    state.compInfo.compNames.compName2.consumptionDate = null
    state.compInfo.compNames.compName2.corpNum = null
    state.compInfo.compNames.compName2.conflict1 = null
    state.compInfo.compNames.compName2.conflict2 = null
    state.compInfo.compNames.compName2.conflict3 = null
    state.compInfo.compNames.compName2.conflict1_num = null
    state.compInfo.compNames.compName2.conflict2_num = null
    state.compInfo.compNames.compName2.conflict3_num = null
    state.compInfo.compNames.compName2.decision_text = null
    state.compInfo.compNames.compName3.name = null
    state.compInfo.compNames.compName3.state = null
    state.compInfo.compNames.compName3.consumptionDate = null
    state.compInfo.compNames.compName3.corpNum = null
    state.compInfo.compNames.compName3.conflict1 = null
    state.compInfo.compNames.compName3.conflict2 = null
    state.compInfo.compNames.compName3.conflict3 = null
    state.compInfo.compNames.compName3.conflict1_num = null
    state.compInfo.compNames.compName3.conflict2_num = null
    state.compInfo.compNames.compName3.conflict3_num = null
    state.compInfo.compNames.compName3.decision_text = null

    // clear current name choice, to be reset by new data below
    state.currentNameObj = null
    state.currentName = null
    state.currentChoice = null

    for ( let record of dbcompanyInfo.names ) {

      switch (record.choice) {
        case 1:
          state.compInfo.compNames.compName1.choice = record.choice
          state.compInfo.compNames.compName1.name = record.name
          state.compInfo.compNames.compName1.state = record.state
          state.compInfo.compNames.compName1.consumptionDate = record.consumptionDate
          state.compInfo.compNames.compName1.corpNum = record.corpNum
          state.compInfo.compNames.compName1.conflict1 = record.conflict1
          state.compInfo.compNames.compName1.conflict2 = record.conflict2
          state.compInfo.compNames.compName1.conflict3 = record.conflict3
          state.compInfo.compNames.compName1.conflict1_num = record.conflict1_num
          state.compInfo.compNames.compName1.conflict2_num = record.conflict2_num
          state.compInfo.compNames.compName1.conflict3_num = record.conflict3_num
          state.compInfo.compNames.compName1.decision_text = record.decision_text
          state.compInfo.compNames.compName1.comment = record.comment

          // if this name is not yet examined or it is approved (in case of reset/re-open), set it as current name
          if ( record.state == 'NE' || record.state == 'APPROVED' ) {

            this.dispatch( 'setCurrentName', record )
          }

          break
        case 2:
          state.compInfo.compNames.compName2.choice = record.choice
          state.compInfo.compNames.compName2.name = record.name
          state.compInfo.compNames.compName2.state = record.state
          state.compInfo.compNames.compName2.consumptionDate = record.consumptionDate
          state.compInfo.compNames.compName2.corpNum = record.corpNum
          state.compInfo.compNames.compName2.conflict1 = record.conflict1
          state.compInfo.compNames.compName2.conflict2 = record.conflict2
          state.compInfo.compNames.compName2.conflict3 = record.conflict3
          state.compInfo.compNames.compName2.conflict1_num = record.conflict1_num
          state.compInfo.compNames.compName2.conflict2_num = record.conflict2_num
          state.compInfo.compNames.compName2.conflict3_num = record.conflict3_num
          state.compInfo.compNames.compName2.decision_text = record.decision_text
          state.compInfo.compNames.compName2.comment = record.comment

          // if this name is not yet examined or it is approved (in case of reset/re-open), set it as current name
          if ( ( record.state == 'NE' || record.state == 'APPROVED' ) &&
            ( record.choice < state.currentChoice || state.currentChoice == null ) )
          {

            this.dispatch( 'setCurrentName', record )
          }

          break
        case 3:
          state.compInfo.compNames.compName3.choice = record.choice
          state.compInfo.compNames.compName3.name = record.name
          state.compInfo.compNames.compName3.state = record.state
          state.compInfo.compNames.compName3.consumptionDate = record.consumptionDate
          state.compInfo.compNames.compName3.corpNum = record.corpNum
          state.compInfo.compNames.compName3.conflict1 = record.conflict1
          state.compInfo.compNames.compName3.conflict2 = record.conflict2
          state.compInfo.compNames.compName3.conflict3 = record.conflict3
          state.compInfo.compNames.compName3.conflict1_num = record.conflict1_num
          state.compInfo.compNames.compName3.conflict2_num = record.conflict2_num
          state.compInfo.compNames.compName3.conflict3_num = record.conflict3_num
          state.compInfo.compNames.compName3.decision_text = record.decision_text
          state.compInfo.compNames.compName3.comment = record.comment

          // if this name is not yet examined or it is approved (in case of reset/re-open), set it as current name
          if ( ( record.state == 'NE' || record.state == 'APPROVED' ) &&
            ( record.choice < state.currentChoice || state.currentChoice == null ) )
          {
            this.dispatch( 'setCurrentName', record )
          }
          break

        default:
          break
      }
    }



    //if no currentName selected choose 1st
    if ( state.currentName == null ) {

      this.dispatch( 'setCurrentName', dbcompanyInfo.names[0] )
    }

    state.currentState = dbcompanyInfo.state
    state.previousStateCd = dbcompanyInfo.previousStateCd
    state.compInfo.requestType = dbcompanyInfo.requestTypeCd

    if (dbcompanyInfo.consent_dt && moment(dbcompanyInfo.consent_dt).isValid()) {
      let dateString = new moment(dbcompanyInfo.consent_dt).format('YYYY-MM-DD')
      state.consentDateForEdit = dateString
    }

    // if the current state is not INPROGRESS, HOLD, or DRAFT clear any existing name record in currentNameObj
    if ( !['INPROGRESS', 'HOLD', 'DRAFT'].includes( state.currentState ) ) {

      this.dispatch( 'setCurrentName', {} )
    }

    // we keep the original data so that if fields exist that we do not use, we don't lose that
    // data when we put new data
    if ( dbcompanyInfo.applicants != '' ) {
      state.applicantOrigData = dbcompanyInfo.applicants
    }
    else {
      state.applicantOrigData = {
        'clientFirstName': null,
        'clientLastName': null,
        'firstName': null,
        'middleName': null,
        'lastName': null,
        'addrLine1': null,
        'addrLine2': null,
        'addrLine3': null,
        'city': null,
        'stateProvinceCd': null,
        'postalCd': null,
        'countryTypeCd': null,
        'contact': null,
        'phoneNumber': null,
        'emailAddress': null,
        'faxNumber': null,
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

    if ( dbcompanyInfo.expirationDate && moment( dbcompanyInfo.expirationDate ).isValid() ) {
      state.expiryDate = moment( dbcompanyInfo.expirationDate ).format( 'YYYY-MM-DD' )
    }
    else {
      state.expiryDate = null
    }

    if ( dbcompanyInfo.submittedDate && moment( dbcompanyInfo.submittedDate )
    .isValid() )
    {
      state.submittedDate = moment( dbcompanyInfo.submittedDate )
      .format( 'YYYY-MM-DD, h:mma' )
    }
    else {
      state.submittedDate = null
    }

    state.lastUpdate = dbcompanyInfo.lastUpdate

    state.submitCount = dbcompanyInfo.submitCount
    state.previousNr = dbcompanyInfo.previousNr
    state.corpNum = dbcompanyInfo.corpNum
    state.furnished = dbcompanyInfo.furnished
    state.hasBeenReset = dbcompanyInfo.hasBeenReset

    // cycle through nwpta entries
    // - first clear existing nwpta data that may persist from previous NR
    state.additionalCompInfo.nwpta_ab = {
      partnerJurisdictionTypeCd: null,
      partnerName: null,
      partnerNameDate: null,
      partnerNameNumber: null,
      partnerNameTypeCd: null,
    }
    state.additionalCompInfo.nwpta_sk = {
      partnerJurisdictionTypeCd: null,
      partnerName: null,
      partnerNameDate: null,
      partnerNameNumber: null,
      partnerNameTypeCd: null,
    }
    for ( let record of dbcompanyInfo.nwpta ) {

      // convert date from long form to YYYY-MM-DD
      if ( record.partnerNameDate ) {
        var nwpta_date = new moment( record.partnerNameDate )
        record.partnerNameDate = nwpta_date.clone()
                                           .format( 'YYYY-MM-DD' )
      }

      if ( record.partnerJurisdictionTypeCd == 'AB' ) state.additionalCompInfo.nwpta_ab = record
      if ( record.partnerJurisdictionTypeCd == 'SK' ) state.additionalCompInfo.nwpta_sk = record
    }

    // convert Expiry Date from timestamp to YYYY-MM-DD string for editing
    if ( state.expiryDate ) {
      state.expiryDateForEdit = state.expiryDate
    }
    else {
      state.expiryDateForEdit = null
    }
    if ( state.currentState === 'INPROGRESS' ) {
      state.is_making_decision = true
    }
  },
  loadConflictsJSON(state, JSONdata) {
    state.conflictsJSON = JSONdata
  },
  loadNamesConflictJSON(state, JSONdata) {
    state.namesConflictJSON = JSONdata
  },
  loadCorpConflictJSON(state, JSONdata) {
    state.corpConflictJSON = JSONdata
  },
  loadConditionsJSON(state, JSONdata) {
    state.conditionsJSON = JSONdata
  },
  loadHistoriesJSON(state, JSONdata) {
    state.historiesJSON = JSONdata
  },
  loadHistoriesInfoJSON(state, JSONdata) {
    state.historiesInfoJSON = JSONdata
  },
  loadTrademarksJSON(state, JSONdata) {
    state.trademarksJSON = JSONdata
  },
  loadSearchDataJSON(state, JSONdata) {
    state.searchDataJSON = JSONdata
  },
  loadStatsDataJSON(state, params) {
    state.statsDataJSON[params.myState] = params.JSONdata
  },
  update_nrData(state) {
    if ( state.nrData.names.length == 0 ) {

      return
    }
    else {
      for ( var i = 0; i < state.nrData.names.length; i++ ) {
        var record = state.nrData.names[i]
        switch (record.choice) {
          case 1:
            state.nrData.names[i] = state.compInfo.compNames.compName1
            break
          case 2:
            state.nrData.names[i] = state.compInfo.compNames.compName2
            break
          case 3:
            state.nrData.names[i] = state.compInfo.compNames.compName3
            break
        }
      }
      if ( state.nrData.names.length < 2 && state.compInfo.compNames.compName2.name != null ) {
        state.compInfo.compNames.compName2.choice = 2
        state.compInfo.compNames.compName2.state = 'NE'
        state.nrData.names[1] = state.compInfo.compNames.compName2
      }
      if ( state.nrData.names.length < 3 && state.compInfo.compNames.compName3.name != null ) {
        state.compInfo.compNames.compName3.choice = 3
        state.compInfo.compNames.compName3.state = 'NE'
        state.nrData.names[2] = state.compInfo.compNames.compName3
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

    if ( state.additionalInfo != '' && state.additionalInfo != null ) {
      state.additionalInfo = state.additionalInfo.substr( 0, 150 )
    }
    state.nrData.additionalInfo = state.additionalInfo

    state.nrData.comments = state.internalComments
    state.nrData.nwpta = []
    if ( state.additionalCompInfo.nwpta_ab.partnerJurisdictionTypeCd !== null ) {
      let nwptaObj = Object.assign( {}, state.additionalCompInfo.nwpta_ab )
      if ( nwptaObj.partnerNameDate ) {
        let date = moment( nwptaObj.partnerNameDate, 'YYYY-MM-DD' )
        .utc()
        .toISOString()
        nwptaObj.partnerNameDate = date
      }
      state.nrData.nwpta.push( nwptaObj )
    }
    if ( state.additionalCompInfo.nwpta_sk.partnerJurisdictionTypeCd !== null ) {
      let nwptaObj = Object.assign( {}, state.additionalCompInfo.nwpta_sk )
      if ( nwptaObj.partnerNameDate ) {
        let date = moment( nwptaObj.partnerNameDate, 'YYYY-MM-DD' )
        .utc()
        .toISOString()
        nwptaObj.partnerNameDate = date
      }
      state.nrData.nwpta.push( nwptaObj )
    }
    state.nrData.state = state.currentState
    state.nrData.previousStateCd = state.previousStateCd
    state.nrData.userId = state.examiner
    state.nrData.priorityCd = state.priority
    //state.reservationCount = dbcompanyInfo.reservationCount
    state.nrData.lastUpdate = state.lastUpdate

    if (state.consentDateForEdit) {
      let date = new moment(state.consentDateForEdit + ' 00:01:00')
      if (date) {
        date = date.utc().format('ddd, D MMM YYYY HH:mm:ss [GMT]')
        state.nrData.consent_dt = date
      }
    }

    if (state.expiryDateForEdit) {
      let date = new moment(state.expiryDateForEdit + ' 00:01:00')
      if (date) {
        date = date.utc().format('ddd, D MMM YYYY HH:mm:ss [GMT]')
        state.nrData.expirationDate = date
      }
    }
    else if ( state.expiryDate ) {
      let date = new moment(state.expiryDate + ' 00:01:00')
      if (date) {
        date = date.utc().format('ddd, D MMM YYYY HH:mm:ss [GMT]')
        state.nrData.expirationDate = date
      }
    } else {
      state.nrData.expirationDate = null
    }

    state.nrData.submittedDate =
      new moment( state.submittedDate, 'YYYY-MM-DD, h:mma' ).utc().format('ddd, D MMM YYYY HH:mm:ss [GMT]' )
    state.nrData.submitCount = state.submitCount
    state.nrData.previousNr = state.previousNr
    state.nrData.corpNum = state.corpNum
    state.nrData.furnished = state.furnished
    state.nrData.hasBeenReset = state.hasBeenReset
  },
  loadCompanyIssues(state, dbcompanyIssues) {
  },
  saveDetail(state, detail) {
    state.details = detail
  },
  listPriorities(state, value) {
    state.listPriorities = value
  },
  listJurisdictions(state, value) {
    state.listJurisdictions = value
  },
  listRequestTypes(state, value) {
    state.listRequestTypes = value
  },
  listDecisionReasons(state, value) {
    state.listDecisionReasons = value
  },
  requestTypeRules(state, value) {
    state.requestTypeRules = value
  },
  currentRecipeCard(state, value) {
    state.currentRecipeCard = value
  },
  currentNameObj(state, value) {
    state.currentNameObj = value

    if ( value != null ) {
      // also set currentName and currentChoice
      state.currentName = value.name
      state.currentChoice = value.choice
    }
    else {
      state.currentName = null
      state.currentChoice = null
    }
  },
  currentChoice(state, value) {
    state.currentChoice = value
    // also set in currentNameObj
    state.currentNameObj.choice = value
  },
  currentName(state, value) {
    state.currentName = value

    // also set in currentNameObj
    state.currentNameObj.name = value
  },
  setConfig(state, configValues) {
  },
  nrNumber(state, value) {

    state.compInfo.nrNumber = value
  },
  setExactMatchesConflicts(state, json) {
    if ( !json || !json.names ) {
      state.exactMatchesConflicts = []
      return
    }
    let exactMatchesConflicts = []
    let { names } = json
    let i = 0

    for ( let entry of names ) {
      exactMatchesConflicts.push( {
        text: entry.name,
        highlightedText: entry.name,
        nrNumber: entry.id,
        startDate: entry.start_date,
        jurisdiction: entry.jurisdiction,
        source: entry.source,
        id: `${ i }-exact`,
        class: 'conflict-result conflict-exact-match',
      } )
      i++
    }
    state.exactMatchesConflicts = exactMatchesConflicts
  },
  setSynonymMatchesConflicts(state, json) {
    if ( !json || !json.names ) {
      state.synonymMatchesConflicts = []
      state.parsedSynonymConflicts = []
      return
    }

    let entry = null
    let name_stems = []
    let synonym_stems = null
    let synonymMatchesConflicts = []
    let wildcard_stack = false
    let { names } = json

    for ( let i = 0; i < names.length; i++ ) {
      // remove any empty string stem values - they are not valid
      names[i].stems = names[i].stems.filter( function (elem) {
        return elem != ''
      } )

      if ( names[i].name_info.source ) {
        //stack conflict
        entry = names[i].name_info
        synonym_stems = names[i].stems
        entry.class = 'conflict-result'
      }
      else {
        // stack title
        name_stems = names[i].stems
        entry = names[i].name_info

        wildcard_stack = ( entry.name.lastIndexOf( '*' ) > 0 )

        entry.meta = entry.name.substring( entry.name.lastIndexOf( '-' ) + 1 ).trim()
        entry.class = 'conflict-synonym-title'
        entry.name = entry.name.replace( '----', '' ).toUpperCase()
        let syn_index = entry.name.indexOf( 'SYNONYMS:' )
        if ( syn_index !== -1 ) {
          let last_bracket_indx = entry.name.lastIndexOf( ')' )
          let synonym_clause = entry.name.substring( syn_index + 10, last_bracket_indx )
          let synonym_list = synonym_clause.split( ',' )

          for ( let syn = 0; syn < synonym_list.length; syn++ ) {
            for ( let wrd = 0; wrd < name_stems.length; wrd++ ) {
              if ( synonym_list[syn].toUpperCase().includes( name_stems[wrd].toUpperCase() ) ) {
                name_stems.splice( wrd, 1 )
                wrd--
              }
            }
            entry.name = entry.name.replace(
              synonym_list[syn].toUpperCase(),
              '<span class="synonym-stem-highlight">' + synonym_list[syn].toUpperCase() + '</span>'
            )
          }
          entry.name = entry.name.replace( 'SYNONYMS:', '' )
        }
        entry.name = entry.name.substring( 0, entry.name.lastIndexOf( '-' ) ).trim()

      }
      entry.name = ' ' + entry.name
      let k = 0
      for ( k = 0; k < name_stems.length; k++ ) {
        if ( !wildcard_stack ) {
          entry.name = entry.name.replace(
            ' ' + name_stems[k].toUpperCase(),
            '<span class="stem-highlight">' + ' ' + name_stems[k].toUpperCase() + '</span>'
          )
        }
        if ( synonym_stems != undefined && synonym_stems.indexOf( name_stems[k].toUpperCase() ) != -1 ) {
          synonym_stems.splice( synonym_stems.indexOf( name_stems[k].toUpperCase() ), 1 )
        }
      }
      if ( synonym_stems != undefined ) {
        for ( let k = 0; k < synonym_stems.length; k++ ) {
          entry.name = entry.name.replace(
            ' ' + synonym_stems[k].toUpperCase(),
            '<span class="synonym-stem-highlight">' + ' ' + synonym_stems[k].toUpperCase() + '</span>'
          )
        }
      }
      let output
      if ( entry.class === 'conflict-result' ) {
        output = {
          text: entry.name.replace(
            /<SPAN CLASS="SYNONYM\-STEM\-HIGHLIGHT">|<SPAN CLASS="STEM\-HIGHLIGHT">|<\/SPAN>/gi,
            '',
          ).trim(),
          highlightedText: entry.name.trim(),
          meta: entry.meta,
          nrNumber: entry.id,
          startDate: entry.start_date,
          jurisdiction: entry.jurisdiction,
          source: entry.source,
          class: entry.class,
          id: `${ i }-synonym`,
        }
      }
      else {
        output = {
          text: entry.name.replace(
            /<SPAN CLASS="SYNONYM\-STEM\-HIGHLIGHT">|<SPAN CLASS="STEM\-HIGHLIGHT">|<\/SPAN>/gi,
            '',
          ).trim(),
          highlightedText: entry.name.trim(),
          meta: entry.meta,
          class: entry.class,
          id: `${ i }-synonym`,
        }
      }
      synonymMatchesConflicts.push( output )
    }

    let output = []
    let conflictsOnly = []
    let prevIndex

    for ( let i = 0; i < synonymMatchesConflicts.length; i++ ) {
      let match = synonymMatchesConflicts[i]
      if ( match.class === 'conflict-synonym-title' ) {
        match.children = []
        match.count = 0
        output.push( match )
        prevIndex = output.length - 1
      }
      else {
        conflictsOnly.push( match )
        output[prevIndex].children.push( match )
        output[prevIndex].count = output[prevIndex].children.length
      }
    }
    state.parsedSynonymConflicts = output
    state.synonymMatchesConflicts = conflictsOnly
  },
  setCobrsPhoneticConflicts(state, json) {
    if ( !json || !json.names ) {
      state.cobrsPhoneticConflicts = []
      state.parsedCOBRSConflicts = []
      return
    }

    let cobrsPhoneticConflicts = []
    let { names } = json
    let i = 0

    for ( let name of names ) {
      let entry = name.name_info
      let output

      if ( !entry.source ) {
        entry.name = entry.name.replace( '----', '' )
        entry.name = entry.name.replace( 'synonyms:', '' )
        entry.class = 'conflict-cobrs-phonetic-title'
        output = {
          class: entry.class,
          meta: entry.meta,
          highlightedText: entry.name,
          text: entry.name,
          id: `${ i }-cobrs`,
        }
      }
      else {
        entry.class = 'conflict-result'
        output = {
          text: entry.name,
          highlightedText: entry.name,
          meta: entry.meta,
          nrNumber: entry.id,
          source: entry.source,
          class: entry.class,
          startDate: entry.start_date,
          jurisdiction: entry.jurisdiction,
          id: `${ i }-cobrs`,
        }
      }
      cobrsPhoneticConflicts.push( output )
      i++
    }

    let output = []
    let conflictsOnly = []
    let prevIndex

    for ( let i = 0; i < cobrsPhoneticConflicts.length; i++ ) {
      let match = cobrsPhoneticConflicts[i]
      if ( match.class === 'conflict-cobrs-phonetic-title' ) {
        match.children = []
        match.count = 0
        output.push( match )
        prevIndex = output.length - 1
      }
      else {
        conflictsOnly.push( match )
        output[prevIndex].children.push( match )
        output[prevIndex].count = output[prevIndex].children.length
      }
    }
    state.parsedCOBRSConflicts = output
    state.cobrsPhoneticConflicts = conflictsOnly
  },
  setPhoneticConflicts(state, json) {
    if ( !json || !json.names ) {
      state.phoneticConflicts = []
      state.parsedPhoneticConflicts = []
      return
    }

    let phoneticConflicts = []
    let { names } = json
    let i = 0

    for ( let name of names ) {
      let entry = name.name_info
      let output

      if ( !entry.source ) {
        entry.name = entry.name.replace( '----', '' )
        entry.name = entry.name.replace( 'synonyms:', '' )
        entry.class = 'conflict-phonetic-title'
        output = {
          text: entry.name,
          highlightedText: entry.name,
          meta: entry.meta,
          class: entry.class,
          id: `${ i }-phonetic`,
        }
      }
      else {
        entry.class = 'conflict-result'
        output = {
          startDate: entry.start_date,
          jurisdiction: entry.jurisdiction,
          text: entry.name,
          highlightedText: entry.name,
          meta: entry.meta,
          nrNumber: entry.id,
          source: entry.source,
          class: entry.class,
          id: `${ i }-phonetic`,
        }
      }
      phoneticConflicts.push( output )
      i++
    }

    let output = []
    let conflictsOnly = []
    let prevIndex

    for ( let n = 0; n < phoneticConflicts.length; n++ ) {
      let match = phoneticConflicts[n]
      if ( match.class === 'conflict-phonetic-title' ) {
        match.children = []
        match.count = 0
        output.push( match )
        prevIndex = output.length - 1
      }
      else {
        conflictsOnly.push( match )
        output[prevIndex].children.push( match )
        output[prevIndex].count = output[prevIndex].children.length
      }
    }
    state.parsedPhoneticConflicts = output
    state.phoneticConflicts = conflictsOnly
  },
  currentConflict(state, value) {
    state.currentConflict = value
  },
  currentCondition(state, value) {
    state.currentCondition = value
  },
  currentTrademark(state, value) {
    state.currentTrademark = value
  },
  currentHistory(state, value) {
    state.currentHistory = value
  },
  saveKeyCloak(state, value) {
    state.myKeycloak = value
  },
  setLoginValues(state) {
    state.userId = sessionStorage.getItem( 'USERNAME' )
    state.user_roles = sessionStorage.getItem( 'USER_ROLES' )
    state.authorized = sessionStorage.getItem( 'AUTHORIZED' )
  },
  setErrorJSON(state, value) {
    state.errorJSON = value
  },

  //introduced by name-examination code with us upgrade
  is_making_decision: (state, payload) => state.is_making_decision = payload,
  toggleRequestBannerPopUp: (state, payload) => state.activeRequestBannerPopUp = payload,//ReqInfoHeader active popup
  toggleCommentsPopUp: (state, payload) => state.showCommentsPopUp = payload,//app-wide comments popup visibility
  setNewComment: (state, payload) => state.newComment = payload,//captured user-input in app-wide comments popup
  setEditing: (state, payload) => state.is_editing = payload,
  setCurrentNameToCondition: (state, payload) => state.currentNameObj.state = 'CONDITION',
  setPartnerDate(state, { type, payload }) {
    state.additionalCompInfo[`nwpta_${ type }`].partnerNameDate = payload
  },
  toggleEditMessageModal: (state, payload) => state.editMessageModalVisible = payload,
  setSelectedConflicts: (state, conflicts) => state.selectedConflicts = conflicts,
  setSelectedConditions: (state, conditions) => state.selectedConditions = conditions,
  setSelectedTrademarks(state, trademarks) {
    Vue.set( state, 'selectedTrademarks', trademarks )
  },
  setSelectedConflictID: (state, payload) => state.selectedConflictID = payload,
  setExpandedConflictID: (state, payload) => state.expandedConflictID = payload,
  setOpenBucket: (state, payload) => state.openBucket = payload,
  setConsentDate: (state, payload) => state.consentDateForEdit = payload,
  setConsentFlag(state, payload) {
    state.nrData.consentFlag = payload
    if (payload === 'R') {
      let date = new moment().format('YYYY-MM-DD')
      state.consentDateForEdit = date
      return
    }
    state.nrData.consent_dt = null
    state.consentDateForEdit = null
  },
  setConflictsReturnedStatus: (state, payload) => state.conflictsReturnedStatus = payload,
  setComparedConflicts: (state, payload) => state.comparedConflicts = payload,
  setConflictsIndex: (state, payload) => state.conflictsIndex = payload,
  setConflictsChildIndex: (state, payload) => state.conflictsChildIndex = payload,
  setConflictsChildren: (state, payload) => state.conflictsChildren = payload,
  setConflictsScrollPosition: (state, payload) => state.conflictsScrollPosition = payload,
  setConflictsAutoAdd: (state, payload) => state.conflictsAutoAdd = payload,
  addComparedConflict: (state, payload) => {
    let index = state.comparedConflicts.length
    Vue.set(
      state.comparedConflicts,
      index,
      payload
    )
  },
  removeComparedConflict: (state, nrNumber) => {
    let index = state.comparedConflicts.findIndex(conflict => conflict.nrNumber === nrNumber)
    if (index >= 0) {
      let comparedConflictsCopy = [ ...state.comparedConflicts ]
      comparedConflictsCopy.splice(index, 1)
      state.comparedConflicts = comparedConflictsCopy
    }
  },
  resetConsent(state) {
    state.nrData.consent_dt = null
    state.nrData.consentFlag = null
    state.consentDateForEdit = null
  },
  setCustomerMessageOverride: (state, payload) => state.customerMessageOverride = payload,
  setSelectedConflictNRs: (state, payload) => state.selectedConflictNRs = payload,
  addSelectedConflictNRs(state, nrNumber) {
    let index = state.selectedConflictNRs.length
    Vue.set(
      state.selectedConflictNRs,
      index,
      nrNumber
    )
  },
  removeSelectedConflictNRs(state, nrNumber) {
    let index = state.selectedConflictNRs.indexOf(nrNumber)
    Vue.delete(
      state.selectedConflictNRs,
      index,
      nrNumber
    )
  },
  setSelectedReasons(state, payload) {
    Vue.set( state, 'selectedReasons', payload )
  },
  setConsentRequiredByUser: (state, payload) => state.consentRequiredByUser = payload,
  toggleTransactionsModal: (state, payload) => state.transactionsModalVisible = payload,
  setTransactionsData: (state, payload) => state.transactionsData = payload,
  setTransactionsRequestStatus: (state, payload) => state.transactionsRequestStatus = payload,
  setTransactionsModalState(state, {key, value}) {
    Vue.set(
      state.transactionsModalState,
      key,
      value
    )
  },
  resetTransactionModalState(state) {
    state.transactionsModalState = {
      maximized: true,
      page: 1,
      expand: null,
      scrollOffset: 0,
      sortDescending: true,
    }
  },
  toggleWordClassificationModal: (state, payload) => state.wordClassificationModalVisible = payload,
  setWordClassificationModalName: (state, payload) => state.wordClassificationModalName = payload,
  setCurrentNameState(state, payload) {
    if (state.currentNameObj && state.currentNameObj.state) {
      state.currentNameObj.state = payload
    }
  },

  setBaseURL: (state, payload) => state.baseURL = payload,
  mutateAllowWordClassificationModal: (state, payload) => state.allowWordClassificationModal = payload
}

export const state = {
  //User Info
  myKeycloak: null,
  userId: null,
  user_roles: [],
  authorized: false,
  email: null,
  errorJSON: null,
  adminURL: null,
  consentDateForEdit: null,

  //Interface settings
  currentChoice: null, // CURRENT NAME BEING EXAMINED (choice number)
  currentName: null, // CURRENT NAME BEING EXAMINED (string)
  currentNameObj: { // CURRENT NAME BEING EXAMINED (complete object)
    name: null, choice: null,
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
        corpNum: null,
        conflict1: null,
        conflict2: null,
        conflict3: null,
        conflict1_num: null,
        conflict2_num: null,
        conflict3_num: null,
        decision_text: null,
        comment: null,
      }, compName2: {
        choice: null,
        name: null,
        state: null,
        consumptionDate: null,
        corpNum: null,
        conflict1: null,
        conflict2: null,
        conflict3: null,
        conflict1_num: null,
        conflict2_num: null,
        conflict3_num: null,
        decision_text: null,
        comment: null,
      }, compName3: {
        choice: null,
        name: null,
        state: null,
        consumptionDate: null,
        corpNum: null,
        conflict1: null,
        conflict2: null,
        conflict3: null,
        conflict1_num: null,
        conflict2_num: null,
        conflict3_num: null,
        decision_text: null,
        comment: null,
      },
    }, requestType: null,
  },
  applicantInfo: {
    clientName: {
      firstName: null, lastName: null,
    }, applicantName: {
      firstName: null, lastName: null, middleName: null,
    }, contactInfo: {
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
      fax: null,
    },
  },
  additionalCompInfo: {
    jurisdiction: null, natureOfBussiness: null, nr_status: null, nwpta_ab: {
      partnerJurisdictionTypeCd: null,
      partnerName: null,
      partnerNameDate: null,
      partnerNameNumber: null,
      partnerNameTypeCd: null,
    }, nwpta_sk: {
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
    issue_Format_Text: null,
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
  statsDataJSON: {
    hold: { response: { numfound: '' } },
    draft: { response: { numfound: '' } },
    expired: { response: { numfound: '' } },
    cancelled: { response: { numfound: '' } },
    approved: { response: { numfound: '' } },
    conditional: { response: { numfound: '' } },
    rejected: { response: { numfound: '' } },
  },

  //introduced during name-examination code with us upgrade
  activeRequestBannerPopUp: null,
  comparedConflicts: [],
  conflictsAutoAdd: true,
  conflictsChildIndex: 0,
  conflictsChildren: [],
  conflictsIndex: 0,
  conflictsReturnedStatus: false,
  conflictsScrollPosition: 0,
  consentRequiredByUser: false,
  customerMessageOverride: null,
  expandedConflictID: null,
  newComment: null,
  openBucket: null,
  parsedCOBRSConflicts: [],
  parsedPhoneticConflicts: [],
  parsedSynonymConflicts: [],
  selectedConditions: [],
  selectedConflictID: null,
  selectedConflictNRs: [],
  selectedConflicts: [],
  selectedReasons: [],
  selectedTrademarks: [],
  showCommentsPopUp: false,
  transactionsModalVisible: false,
  transactionsData: null,
  transactionsRequestStatus: 'pending',
  transactionsModalState: {
    maximized: true,
    page: 1,
    expand: null,
    scrollOffset: 0,
    sortDescending: true,
  },
  conflictsPreserveMessage: false,
  wordClassificationModalVisible: false,
  wordClassificationModalName: '',

  baseURL:'',
  allowWordClassificationModal: true,
  showExaminationArea: true,
}

export default new Vuex.Store({ actions, getters, mutations, state, })

