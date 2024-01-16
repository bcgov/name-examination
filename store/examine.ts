import { Status } from '~/enums/nr-status'
import type {
  Trademark,
  Comment,
  Condition,
  Conflict,
  ConflictList,
  ConflictListItem,
  CorpConflict,
  History,
  Macro,
  NameRequestConflict,
  TrademarkApiResponse,
  NameChoice,
  RequestType,
  RequestTypeRule,
  Jurisdiction,
  Transaction,
} from '~/types'

import mockJson from './examine.mock.json'
import requestTypes from '~/data/request_types.json'
import requestTypeRulesJSON from '~/data/request_type_rules.json'
import jurisdictionsData from '~/data/jurisdictions.json'
import {
  ConsentFlag,
  EntityTypeCode,
  RefundState,
  RequestActionCode,
  RequestTypeCode,
} from '~/enums/codes'
import { getTransactions, patchNameRequest } from '~/util/namex-api'
import { sortNameChoices } from '~/util'
import { DateTime } from 'luxon'

export const useExamineStore = defineStore('examine', () => {
  const mock = mockJson

  /** Username of the current user */
  const userId = ref('someone@idir')

  const priority = ref(true)
  const is_complete = computed(() =>
    [
      Status.Approved,
      Status.Rejected,
      Status.Conditional,
      Status.Consumed,
      Status.Completed,
      Status.Cancelled,
      Status.Historical,
      Status.Expired,
    ].includes(nr_status.value)
  )
  const examiner = ref('someone@idir')

  const exactMatchesConflicts = ref<Array<ConflictListItem>>([])
  const parsedSynonymConflicts = ref<Array<ConflictList>>(
    mock.parsedSynonymConflicts as Array<ConflictList>
  )
  const parsedCOBRSConflicts = ref<Array<ConflictList>>([])
  const parsedPhoneticConflicts = ref<Array<ConflictList>>([])

  const decisionFunctionalityDisabled = ref(false)

  const conflictsAutoAdd = ref(true)
  const autoAddDisabled = computed(
    () =>
      decisionFunctionalityDisabled.value ||
      selectedConflicts.value.length > 0 ||
      comparedConflicts.value.length > 0
  )

  const comments = ref<Array<Comment>>(mock.comments)
  const internalComments = ref<Array<Comment>>(mock.comments)

  const conflicts = ref<Array<Conflict>>(mock.conflicts as Array<Conflict>)

  const corpConflictJSON = ref<CorpConflict>()
  const namesConflictJSON = ref<NameRequestConflict>()

  const selectedConflicts = ref<Array<ConflictListItem>>([])
  const comparedConflicts = ref<Array<Conflict>>([])

  const listDecisionReasons = ref<Array<Macro>>(mock.macros)

  const trademarksJSON = ref<TrademarkApiResponse>(mock.trademarkJSON)

  const is_editing = ref(false)
  const is_making_decision = ref(true)
  const is_header_shown = ref(false)
  const nrNumber = ref('NR 1234567')
  const nr_status = ref(Status.InProgress)
  const isClosed = computed(() =>
    [
      Status.Rejected,
      Status.Approved,
      Status.Conditional,
      Status.Consumed,
    ].includes(nr_status.value)
  )
  const previousStateCd = ref<Status>()
  const listRequestTypes = ref<Array<RequestType>>(
    requestTypes as Array<RequestType>
  )
  const requestType = ref<RequestTypeCode>(RequestTypeCode.CP)
  const requestTypeObject = computed(
    () => listRequestTypes.value.find((r) => r.value == requestType.value)!
  )
  const requestTypeRules = ref<Array<RequestTypeRule>>(
    requestTypeRulesJSON as Array<RequestTypeRule>
  )

  const requestActionCd = computed<RequestActionCode>(
    () => requestTypeObject.value.request_action_cd
  )
  const entityTypeCd = computed<EntityTypeCode>(
    () => requestTypeObject.value.entity_type_cd
  )

  const conditionsJSON = ref({
    restricted_words_conditions: [
      { cnd_info: [{ allow_use: 'N', consent_required: '' }] },
    ],
  })

  const parseConditions = ref<Array<Condition>>(
    mock.parseConditions as Array<Condition>
  )

  const trademarkInfo = ref({ names: [] })
  const historiesJSON = ref<History>(mock.historiesJSON)

  const historiesInfoJSON = ref<NameRequestConflict>()

  const consentRequiredByUser = ref(false)

  const selectedConditions = ref<Array<Condition>>([])

  const customerMessageOverride = ref<string>()

  const decisionSelectionsDisabled = computed(
    () => customerMessageOverride.value != null
  )

  const selectedMacros = ref<Array<Macro>>([])

  const selectedTrademarks = ref<Array<Trademark>>([])

  const conditionMessages = computed(() =>
    selectedConditions.value.map((condition) =>
      condition.phrase !== undefined && condition.phrase !== ''
        ? `${condition.phrase} - ${condition.instructions}`
        : condition.instructions
    )
  )

  const conflictMessages = computed(() => {
    if (selectedConflicts.value.length === 0 && consentRequiredByUser.value) {
      return ['Consent Required \n']
    } else {
      return selectedConflicts.value.map((conflict) =>
        consentRequiredByUser.value
          ? `Consent required from ${conflict.text}`
          : `Rejected due to conflict with ${conflict.text}`
      )
    }
  })

  const trademarkMessages = computed(() =>
    selectedTrademarks.value.map(
      (trademark) =>
        `Registered Trademark: ${trademark.name} - Application #${trademark.application_number}`
    )
  )

  const macroMessages = computed(() =>
    selectedMacros.value.map((macro) => macro.reason)
  )

  const requestorMessageStrings = computed(() =>
    conflictMessages.value.concat(
      conditionMessages.value,
      trademarkMessages.value,
      macroMessages.value
    )
  )

  const requestorMessage = computed(() => {
    if (customerMessageOverride.value) {
      return customerMessageOverride.value
    } else {
      return requestorMessageStrings.value.join('\n\n')
    }
  })

  const acceptanceWillBeConditional = computed(
    () => consentRequiredByUser.value
  )

  const decision_made = ref<Status>()

  const compName1 = reactive<NameChoice>(mock.compName1 as NameChoice)
  const compName2 = reactive<NameChoice>(mock.compName2 as NameChoice)
  const compName3 = reactive<NameChoice>(mock.compName3 as NameChoice)
  const nameChoices = computed(() => [compName1, compName2, compName3])

  const currentNameObj = ref(compName2)
  const currentName = computed(() => currentNameObj.value.name)
  const currentChoice = computed(() => currentNameObj.value.choice)

  const userHasApproverRole = ref(true)
  const userHasEditRole = ref(true)
  const is_my_current_nr = computed(
    () =>
      nr_status.value === Status.InProgress && userId.value === examiner.value
  )
  const furnished = ref<'Y' | 'N'>('N')

  const listJurisdictions = ref<Array<Jurisdiction>>(jurisdictionsData)
  const jurisdiction = ref<string>()
  const jurisdictionNumber = ref<string>()
  const jurisdictionRequired = ref(false)

  const previousNr = ref<string>()
  const prevNrRequired = ref(false)

  const consumptionDate = ref<string>()
  const consumedBy = ref<string>()
  const consentDateForEdit = ref<string>()
  const consentFlag = ref<ConsentFlag>()

  const pendingTransactionRequest = ref(false)
  const transactionsData = ref<Array<Transaction>>()

  const refundPaymentState = ref<RefundState>()

  const submittedDate = ref('2008-09-16, 4:44pm')
  const corpNum = ref<string>()
  const corpNumRequired = ref(false)
  const expiryDate = ref<string>()

  const additionalInfo = ref(mock.additionalInfo)
  const additional_info_template = ref<string>()
  const natureOfBusiness = ref(mock.natureOfBusiness)

  const clientFirstName = ref(mock.clientFirstName)
  const clientLastName = ref(mock.clientLastName)
  const firstName = ref(mock.firstName)
  const middleName = ref(mock.middleName)
  const lastName = ref(mock.lastName)
  const addressLine1 = ref(mock.addressLine1)
  const addressLine2 = ref(mock.addressLine2)
  const addressLine3 = ref(mock.addressLine3)
  const city = ref(mock.city)
  const province = ref(mock.province)
  const postalCode = ref(mock.postalCode)
  const country = ref(mock.country)
  const phone = ref(mock.phone)
  const fax = ref(mock.fax)
  const conEmail = ref(mock.conEmail)
  const contactName = ref(mock.contactName)

  const forceConditional = ref(false)

  const hasBeenReset = ref(false)

  const additionalInfoTransformedTemplate = computed(() => {
    return additional_info_template.value
      ?.split('||')
      .map((template) =>
        template
          .replaceAll('<corp_num>', corpNum.value || '')
          .replaceAll('<prev_nr>', previousNr.value || '')
      )
      .join(' ')
  })

  const canEdit = computed(() => {
    if (consumptionDate.value) return false
    if (is_my_current_nr.value) return true
    return (
      userHasEditRole.value &&
      [
        Status.Draft,
        Status.Hold,
        Status.Rejected,
        Status.Approved,
        Status.Conditional,
      ].includes(nr_status.value)
    )
  })

  const otherExaminerInProgress = computed(
    () =>
      userId.value !== examiner.value && nr_status.value === Status.InProgress
  )

  const expired = computed(
    () =>
      expiryDate.value &&
      DateTime.fromISO(expiryDate.value).endOf('day') < DateTime.now()
  )

  const isApprovedAndExpired = computed(
    // NR will move to 'EXPIRED' state once expiry date is reached for 'APPROVED', 'CONDITIONAL' state.
    // If currentState is 'EXPIRED', then it was approved and expired.
    () => expiryDate.value && nr_status.value === Status.Expired
  )

  const canCancel = computed(
    () =>
      userHasEditRole.value &&
      !otherExaminerInProgress.value &&
      !expired.value &&
      !is_making_decision.value &&
      nr_status.value !== Status.Cancelled &&
      !isApprovedAndExpired.value
  )

  /** Can the current user claim the current name request for examination? */
  const canClaim = computed(
    () =>
      userHasApproverRole.value &&
      [Status.Draft, Status.Hold].includes(nr_status.value)
  )

  interface EditAction {
    /** Return whether an edit action's internal state is valid (e.g. a name field is not empty).
     * This function is called before saving. A save will not occur if at least one edit action's validation fails.
     */
    validate: (() => boolean) | (() => Promise<boolean>)
    /** Update the store's value with the new values. This function is called after all validations have succeeded */
    update: () => void
  }
  const editActions: Array<EditAction> = []
  function addEditAction(action: EditAction) {
    editActions.push(action)
  }

  async function getHistoryInfo(nrNumber: string) {
    historiesInfoJSON.value = conflicts.value[1] as NameRequestConflict
  }

  async function getConflictInfo(item: ConflictListItem) {
    corpConflictJSON.value = undefined
    namesConflictJSON.value = undefined
    const conflict = conflicts.value.filter(
      (conflict) => conflict.nrNumber === item.nrNumber
    )[0]
    if (item.source === 'CORP') {
      corpConflictJSON.value = conflict as CorpConflict
    } else {
      namesConflictJSON.value = conflict as NameRequestConflict
    }
  }

  function toggleConflictCheckbox(conflictItem: ConflictListItem) {
    const selectedNRs = comparedConflicts.value.map((c) => c.nrNumber)
    if (selectedNRs.includes(conflictItem.nrNumber)) {
      selectedConflicts.value = selectedConflicts.value.filter(
        (c) => c.nrNumber !== conflictItem.nrNumber
      )
      comparedConflicts.value = comparedConflicts.value.filter(
        (c) => c.nrNumber !== conflictItem.nrNumber
      )
    } else {
      const conflict = mock.conflicts.filter(
        (c) => c.nrNumber === conflictItem.nrNumber
      )[0]
      comparedConflicts.value.push(conflict as Conflict)
      if (conflictsAutoAdd.value) {
        selectedConflicts.value.push(conflictItem)
      }
    }
  }

  function getShortJurisdiction(jurisdiction: string) {
    return jurisdiction
  }

  function setConsentFlag(flag: ConsentFlag | undefined) {
    consentFlag.value = flag
    if (flag === ConsentFlag.Received) {
    }
  }

  function isUndoable(name: NameChoice): boolean {
    if (
      !userHasApproverRole.value || // if the NR is closed in any way, a name is not undoable - the NR will have to be re-opened first
      !is_my_current_nr.value ||
      furnished.value === 'Y' || // if the NR is furnished, nothing is undoable
      name.state == Status.NotExamined || // if this name is complete (ie: anything other than NE) it's undoable
      name.state == null
    ) {
      return false
    }

    if (name.choice === 1) {
      // if name choices 2 and 3 have not been decided, then 1 is undoable
      return (
        (compName2.state == Status.NotExamined || compName2.state == null) &&
        (compName3.state == Status.NotExamined || compName3.state == null)
      )
    } else if (name.choice === 2) {
      // if name choice 3 has not been decided, then 2 is undoable
      return compName3.state == Status.NotExamined || compName3.state == null
    } else {
      return true
    }
  }

  function undoNameChoiceDecision(name: NameChoice) {
    resetExaminationArea()
    if (name.choice == 1) {
      currentNameObj.value = compName1
    } else if (name.choice == 2) {
      currentNameObj.value = compName2
    } else {
      currentNameObj.value = compName3
    }
    currentNameObj.value.state = Status.NotExamined
    currentNameObj.value.conflict1 = null
    currentNameObj.value.conflict2 = null
    currentNameObj.value.conflict3 = null
    currentNameObj.value.conflict1_num = null
    currentNameObj.value.conflict2_num = null
    currentNameObj.value.conflict3_num = null
    currentNameObj.value.decision_text = null
    currentNameObj.value.comment = null
  }

  async function makeDecision(decision: Status) {
    decision_made.value = decision
    if (decision_made.value === Status.Approved) {
      if (acceptanceWillBeConditional.value || forceConditional.value) {
        currentNameObj.value.state = Status.Condition
        forceConditional.value = false
      } else {
        currentNameObj.value.state = Status.Approved
        // If there were conflicts selected but this is an approval, remove the selected conflicts.
        // Do NOT clear the conflicts if the "Consent Required" condition is also set - then it's intentional.
        selectedConflicts.value = []
      }
    } else {
      currentNameObj.value.state = Status.Rejected
    }

    if (selectedConflicts.value.length > 0) {
      // Populate the current name object's conflicts
      for (const n of [0, 1, 2]) {
        const conflict = selectedConflicts.value[n]
        if (conflict == null) break

        switch (n) {
          case 0:
            currentNameObj.value.conflict1 = conflict.text
            currentNameObj.value.conflict1_num = conflict.nrNumber
            break
          case 1:
            currentNameObj.value.conflict2 = conflict.text
            currentNameObj.value.conflict2_num = conflict.nrNumber
            break
          case 2:
            currentNameObj.value.conflict3 = conflict.text
            currentNameObj.value.conflict3_num = conflict.nrNumber
            break
        }
      }
    }
    currentNameObj.value.name = currentNameObj.value.name.trimEnd()
    currentNameObj.value.decision_text = requestorMessage.value.substring(
      0,
      955
    )
    await pushAcceptReject()

    if (currentNameObj.value.state === Status.Approved) {
      await updateNRState(Status.Approved)
    } else if (currentNameObj.value.state === Status.Condition) {
      await updateNRState(Status.Conditional)
    } else {
      await examineNextNameChoice()
    }
    decision_made.value = undefined
  }

  async function makeQuickDecision(decision: Status, decisionText: string) {
    currentNameObj.value.decision_text = decisionText
    decision_made.value = decision
    if (decision_made.value === Status.Approved) {
      currentNameObj.value.state = Status.Approved
    } else {
      currentNameObj.value.state = Status.Rejected
    }
    await pushAcceptReject()
    decision_made.value = undefined
  }

  /** Attempt to set the given name choice as the current one. Will throw an error if the choice cannot be examined. */
  async function setCurrentNameChoice(choice: NameChoice) {
    if (!choice.state || choice.state !== 'NE') {
      throw new Error(`Name choice ${choice.choice} cannot be examined`)
    } else {
      currentNameObj.value = choice
    }
  }

  /** Attempts to examine the next name choice in the name request. */
  async function examineNextNameChoice() {
    const attempt = async (choice: NameChoice) => {
      try {
        await setCurrentNameChoice(choice)
      } catch (e) {
        await updateNRState(Status.Rejected)
      }
    }
    if (currentChoice.value === 1) {
      await attempt(compName2)
    } else if (currentChoice.value === 2) {
      await attempt(compName3)
    } else {
      await updateNRState(Status.Rejected)
    }
  }

  /** Send name request decision to API */
  async function pushAcceptReject() {
    // TODO: make a PUT call to api
  }

  function runManualRecipe(searchStr: string, exactPhrase: string) {}

  function resetExaminationArea() {}

  async function getpostgrescompInfo(nrNumber: string) {
    console.log(`getting ${nrNumber}`)
  }

  async function updateNRStatePreviousState(
    nrState: Status,
    previousState: Status
  ) {
    const patch = { previousStateCd: previousState, state: nrState }
    await patchNameRequest(nrNumber.value, patch)

    await getpostgrescompInfo(nrNumber.value)
    await setNewExaminer()
  }

  async function getTransactionsHistory(nrNumber: string) {
    pendingTransactionRequest.value = true
    try {
      const transactions = await getTransactions(nrNumber)
      transactions.forEach((t) => sortNameChoices(t.names))
      transactionsData.value = transactions
    } catch (error) {
      console.error(`Error while retrieving transactions: ${error}`)
      transactionsData.value = undefined
    } finally {
      pendingTransactionRequest.value = false
    }
  }

  async function setNewExaminer() {
    if (examiner.value.includes('account')) {
      await getTransactionsHistory(nrNumber.value)
      if (transactionsData.value == null) {
        return
      }

      for (const transaction of transactionsData.value) {
        if (
          transaction.user_name.split('@').at(1)?.includes('idir') &&
          transaction.user_action.includes('Decision')
        ) {
          examiner.value = transaction.user_name
          break
        }
      }
    }
  }

  async function updateNRState(state: Status) {
    nr_status.value = state
  }

  async function revertToPreviousState() {
    await patchNameRequest(nrNumber.value, {
      state: previousStateCd.value,
      previousStateCd: null,
    })
    await getpostgrescompInfo(nrNumber.value)
    await setNewExaminer()
  }

  async function updateRequest() {
    console.log('updating request')
  }

  /** Runs all edit actions, ensuring all actions have valid internal state before updating the store state.
   * @returns whether all the actions ran successfully
   */
  async function runEditActions(): Promise<boolean> {
    for (const action of editActions) {
      if (!(await action.validate())) {
        return false
      }
    }
    editActions.forEach((ea) => ea.update())
    return true
  }

  async function saveEdits() {
    if (!(await runEditActions())) {
      return
    }

    if (previousStateCd.value === Status.Draft) {
      nr_status.value = previousStateCd.value
      previousStateCd.value = undefined
    }

    await updateRequest()

    is_editing.value = false
    is_header_shown.value = true
  }

  function updateRequestTypeRules(requestType: RequestType) {
    let rules = requestTypeRules.value.find(
      (rule) => rule.request_type == requestType.value
    )
    prevNrRequired.value = Boolean(rules?.prev_nr_required)
    corpNumRequired.value = Boolean(rules?.corp_num_required)
    additional_info_template.value = rules?.additional_info_template
    jurisdictionRequired.value = Boolean(rules?.jurisdiction_required)
  }

  async function getpostgrescompNo() {}

  // TODO: should this be the $reset method for this store?
  async function resetValues() {}

  function resetConflictList() {}

  async function getNextCompany() {
    await resetValues()
    await getpostgrescompNo()
    resetConflictList()
  }

  async function edit() {
    // if this isn't the user's INPROGRESS, make it that
    if (!is_my_current_nr.value && !isClosed.value) {
      // track the previous state if it's currently in DRAFT (otherwise do not)
      if (nr_status.value == Status.Draft) {
        await updateNRStatePreviousState(Status.InProgress, Status.Draft)
      } else {
        await updateNRState(Status.InProgress)
      }
    }
    is_editing.value = true
  }

  async function holdRequest() {
    is_making_decision.value = false
    await updateNRState(Status.Hold)
    resetConflictList()
  }

  function clearSelectedDecisionReasons() {
    selectedConditions.value = []
    selectedConflicts.value = []
    selectedMacros.value = []
    selectedTrademarks.value = []
  }

  function clearConsent() {
    consentDateForEdit.value = undefined
    consentFlag.value = undefined
  }

  function resetNrDecision() {
    resetConflictList()
    clearSelectedDecisionReasons()

    nr_status.value = Status.InProgress
    if (!userHasApproverRole.value) {
      // initialize user in edit mode, with previous state set so NR gets set back to draft
      // when user is done changing name, adding comment, etc.
      previousStateCd.value = Status.Draft
      is_editing.value = true
    }
  }

  async function reOpen() {
    resetNrDecision()
    // set reset flag so name data is managed between Namex and NRO correctly
    hasBeenReset.value = true
    await updateRequest()
  }

  async function resetNr() {
    resetNrDecision()
    clearConsent()
    furnished.value = 'N'
    await updateRequest()
  }

  async function claimNr() {
    await updateNRState(Status.InProgress)
    is_making_decision.value = true
  }

  async function postComment(text: string) {
    // TODO: post to comments endpoint and add api response to internalComments
    internalComments.value.push({
      comment: text,
      examiner: examiner.value,
      timestamp: DateTime.now().toISO(),
    })
  }

  async function cancelNr(commentText: string) {
    await postComment(commentText)
    is_making_decision.value = false
    nr_status.value = Status.Cancelled
    // TODO: push CANCELLED state to API
  }

  watch(
    () => [selectedConflicts],
    (_state) => {
      // compared conflicts should be kept the same as selected conflicts when auto add is enabled
      if (conflictsAutoAdd.value) {
        const selectedNRs = selectedConflicts.value.map((c) => c.nrNumber)
        comparedConflicts.value = comparedConflicts.value.filter((c) =>
          selectedNRs.includes(c.nrNumber)
        )
      }
    },
    { deep: true }
  )

  watch(
    () => [nrNumber],
    async (_state) => {
      await getpostgrescompInfo(nrNumber.value)
      await setNewExaminer()
      updateRequestTypeRules(requestTypeObject.value)
    },
    { deep: true }
  )

  return {
    priority,
    is_complete,
    conflictsAutoAdd,
    conflicts,
    comments,
    examiner,
    trademarksJSON,
    selectedConflicts,

    internalComments,
    isClosed,
    is_editing,
    is_making_decision,
    is_header_shown,
    nrNumber,
    nr_status,
    previousStateCd,
    listRequestTypes,
    requestType,
    requestTypeObject,
    requestTypeRules,
    requestActionCd,
    entityTypeCd,
    parsedCOBRSConflicts,
    exactMatchesConflicts,
    parsedSynonymConflicts,
    parsedPhoneticConflicts,
    corpConflictJSON,
    namesConflictJSON,
    conditionsJSON,
    trademarkInfo,
    historiesJSON,
    autoAddDisabled,
    decisionFunctionalityDisabled,
    parseConditions,
    comparedConflicts,
    historiesInfoJSON,
    consentRequiredByUser,
    selectedConditions,
    customerMessageOverride,
    decisionSelectionsDisabled,
    listDecisionReasons,
    selectedMacros,
    selectedTrademarks,
    requestorMessageStrings,
    requestorMessage,
    acceptanceWillBeConditional,
    decision_made,
    compName1,
    compName2,
    compName3,
    nameChoices,
    currentNameObj,
    currentChoice,
    currentName,
    userHasApproverRole,
    userHasEditRole,
    is_my_current_nr,
    furnished,
    forceConditional,
    listJurisdictions,
    previousNr,
    prevNrRequired,
    jurisdiction,
    jurisdictionRequired,
    jurisdictionNumber,
    consumptionDate,
    consumedBy,
    transactionsData,
    expiryDate,
    refundPaymentState,
    submittedDate,
    corpNum,
    corpNumRequired,
    consentDateForEdit,
    consentFlag,
    additionalInfo,
    additionalInfoTransformedTemplate,
    additional_info_template,
    natureOfBusiness,
    clientFirstName,
    clientLastName,
    firstName,
    middleName,
    lastName,
    addressLine1,
    addressLine2,
    addressLine3,
    city,
    province,
    postalCode,
    country,
    phone,
    fax,
    conEmail,
    contactName,
    canEdit,
    expired,
    isApprovedAndExpired,
    canCancel,
    canClaim,
    addEditAction,
    isUndoable,
    getHistoryInfo,
    getConflictInfo,
    toggleConflictCheckbox,
    getShortJurisdiction,
    setConsentFlag,
    makeDecision,
    undoNameChoiceDecision,
    makeQuickDecision,
    runManualRecipe,
    resetExaminationArea,
    getpostgrescompInfo,
    setNewExaminer,
    updateNRState,
    updateNRStatePreviousState,
    revertToPreviousState,
    saveEdits,
    updateRequestTypeRules,
    getpostgrescompNo,
    resetValues,
    resetConflictList,
    getNextCompany,
    edit,
    holdRequest,
    reOpen,
    resetNr,
    claimNr,
    postComment,
    cancelNr,
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useExamineStore, import.meta.hot))
}
