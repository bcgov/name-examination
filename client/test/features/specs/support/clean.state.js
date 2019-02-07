/*eslint-disable*/
module.exports = {
  cleanState: () => {
    return {
      //User Info

      myKeycloak: {},
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

      currentConflict: null, // the conflict name currently in focus
      currentCondition: null, // the condition currently in focus
      currentTrademark: null, // the trademark currently in focus
      currentHistory: null, //NR number of history name selected

      currentRecipeCard: null,
      is_my_current_nr: null,
      is_editing: false,
      is_making_decision: false,
      decision_made: null,
      acceptance_will_be_conditional: false,
      is_header_shown: false,
      furnished: null,
      listPriorities: null, // DROP LIST
      listJurisdictions: null, // DROP LIST
      listRequestTypes: null, // DROP LIST
      listDecisionReasons: null,

      requestTypeRules: [], // list of request type rules, internal use only no display

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

      searchQuery: '?order=priorityCd:desc,submittedDate:asc&queue=hold&furnished=true&unfurnished=true&rows=10',
      searchQuerySpecial: '?order=priorityCd:desc,submittedDate:asc&queue=hold&furnished=true&unfurnished=true&rows=10',
      searchState: 'HOLD',

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
        hold: {
          response: {
            numfound: ''
          }
        },
        draft: {
          response: {
            numfound: ''
          }
        },
        expired: {
          response: {
            numfound: ''
          }
        },
        cancelled: {
          response: {
            numfound: ''
          }
        },
        approved: {
          response: {
            numfound: ''
          }
        },
        conditional: {
          response: {
            numfound: ''
          }
        },
        rejected: {
          response: {
            numfound: ''
          }
        }
      }
    }
  }
}
