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

import requestTypes from '~/data/request_types.json'
import requestTypeRulesJSON from '~/data/request_type_rules.json'
import jurisdictionsData from '~/data/jurisdictions.json'
import { ConsentFlag, RefundState, RequestTypeCode } from '~/enums/codes'
import { getTransactions, patchNameRequest } from '~/util/namex-api'
import { getEmptyNameChoice, sortNameChoices } from '~/util'
import { DateTime } from 'luxon'
import { fromMappedRequestType } from '~/util/request-type'
import { getDateFromDateTime, parseDate } from '~/util/date'

export const useExamineStore = defineStore('examine', () => {
  /** Username of the current user */
  const userId = ref(useNuxtApp().$userProfile.username)

  const priority = ref<'Y' | 'N'>('N')
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
  const examiner = ref<string>()
  const isCurrentExaminer = computed(() => examiner.value === userId.value)

  const exactMatchesConflicts = ref<Array<ConflictListItem>>([])
  const parsedSynonymConflicts = ref<Array<ConflictList>>([])
  const parsedCOBRSConflicts = ref<Array<ConflictList>>([])
  const parsedPhoneticConflicts = ref<Array<ConflictList>>([])

  const decisionFunctionalityDisabled = computed(
    () =>
      (customerMessageOverride.value != null &&
        customerMessageOverride.value != '') ||
      !isCurrentExaminer.value ||
      !is_making_decision.value
  )

  const conflictsAutoAdd = ref<boolean>()
  const autoAddDisabled = computed(
    () =>
      decisionFunctionalityDisabled.value ||
      selectedConflicts.value.length > 0 ||
      comparedConflicts.value.length > 0
  )

  const internalComments = ref<Array<Comment>>([])

  const conflicts = ref<Array<Conflict>>([])

  const corpConflictJSON = ref<CorpConflict>()
  const namesConflictJSON = ref<NameRequestConflict>()

  const selectedConflicts = ref<Array<ConflictListItem>>([])
  const comparedConflicts = ref<Array<ConflictListItem>>([])

  const listDecisionReasons = ref<Array<Macro>>([])

  const trademarksJSON = ref<TrademarkApiResponse>()

  const is_editing = ref<boolean>()
  const is_making_decision = ref<boolean>()
  const is_header_shown = ref<boolean>()
  const nrNumber = ref<string>('')
  const nr_status = ref(Status.Draft)
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
  const requestType = ref<RequestTypeCode>(listRequestTypes.value[0].value)
  const requestTypeObject = computed(
    () => listRequestTypes.value.find((r) => r.value == requestType.value)!
  )
  const requestTypeRules = ref<Array<RequestTypeRule>>(
    requestTypeRulesJSON as Array<RequestTypeRule>
  )

  const requestActionCd = computed(
    () => requestTypeObject.value.request_action_cd
  )
  const entityTypeCd = computed(() => requestTypeObject.value.entity_type_cd)

  const parseConditions = ref<Array<Condition>>([])

  const historiesJSON = ref<History>()

  const historiesInfoJSON = ref<NameRequestConflict>()

  const consentRequiredByUser = ref<boolean>()

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

  const compName1 = reactive<NameChoice>(getEmptyNameChoice(1))
  const compName2 = reactive<NameChoice>(getEmptyNameChoice(2))
  const compName3 = reactive<NameChoice>(getEmptyNameChoice(3))
  const nameChoices = computed(() => [compName1, compName2, compName3])

  const currentNameObj = ref<NameChoice>()
  const currentName = computed(() => currentNameObj.value?.name)
  const currentChoice = computed(() => currentNameObj.value?.choice)

  const userHasApproverRole = ref<boolean>()
  const userHasEditRole = ref<boolean>()
  const is_my_current_nr = computed(
    () => nr_status.value === Status.InProgress && isCurrentExaminer.value
  )
  const furnished = ref<'Y' | 'N'>('N')

  const listJurisdictions = ref<Array<Jurisdiction>>(jurisdictionsData)
  const jurisdiction = ref<string>()
  const jurisdictionNumber = ref<string>()
  const jurisdictionRequired = ref<boolean>()

  const previousNr = ref<string>()
  const prevNrRequired = ref<boolean>()

  const consumedBy = ref<string>()
  const consentDateForEdit = ref<string>()
  const consentFlag = ref<ConsentFlag>()

  const pendingTransactionRequest = ref<boolean>()
  const transactionsData = ref<Array<Transaction>>()

  const refundPaymentState = ref<RefundState>()

  const submittedDate = ref<string>()
  const corpNum = ref<string>()
  const corpNumRequired = ref<boolean>()
  const expiryDate = ref<string>()

  const additionalInfo = ref<string>()
  const additional_info_template = ref<string>()
  const natureOfBusiness = ref<string>()

  const clientFirstName = ref<string>()
  const clientLastName = ref<string>()
  const firstName = ref<string>()
  const middleName = ref<string>()
  const lastName = ref<string>()
  const addressLine1 = ref<string>()
  const addressLine2 = ref<string>()
  const addressLine3 = ref<string>()
  const city = ref<string>()
  const province = ref<string>()
  const postalCode = ref<string>()
  const country = ref<string>()
  const phone = ref<string>()
  const fax = ref<string>()
  const conEmail = ref<string>()
  const contactName = ref<string>()

  const forceConditional = ref<boolean>()

  const hasBeenReset = ref<boolean>()

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
    () => !isCurrentExaminer.value && nr_status.value === Status.InProgress
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

  const consumptionDate = computed(() =>
    nameChoices.value
      .map((d) => d.consumptionDate)
      .filter((d) => d != null)
      .at(0)
  )

  /** Status of an exact matches in history for alerting about previous submissions */
  const exactHistoryMatch = computed<Status | undefined>(() => {
    if (!historiesJSON.value) return

    let exactMatches = historiesJSON.value.names.filter(
      (entry) => currentName.value?.toUpperCase() === entry.name.toUpperCase()
    )

    for (const match of exactMatches) {
      if (
        match.name_state_type_cd === 'R' ||
        match.name_state_type_cd === 'REJECTED' ||
        match.submit_count > 3
      ) {
        return Status.Rejected
      }
    }

    if (exactMatches.length > 0) {
      return Status.Approved
    }
  })

  interface EditAction {
    /** Return whether an edit action's internal state is valid (e.g. a name field is not empty).
     * This function is called before saving. A save will not occur if at least one edit action's validation fails.
     */
    validate: (() => boolean) | (() => Promise<boolean>)
    /** Update the store's value with the new values. This function is called after all validations have succeeded. */
    update: () => void
    /** Called when the user cancels an edit. */
    cancel: () => void
  }
  const editActions: Array<EditAction> = []
  function addEditAction(action: EditAction) {
    editActions.push(action)
  }

  function parseIntoNameChoice(data: any, choice: NameChoice) {
    choice.choice = data.choice
    choice.name = data.name
    choice.state = data.state
    choice.consumptionDate = data.consumptionDate
    choice.corpNum = data.corpNum
    choice.conflict1 = data.conflict1
    choice.conflict2 = data.conflict2
    choice.conflict3 = data.conflict3
    choice.conflict1_num = data.conflict1_num
    choice.conflict2_num = data.conflict2_num
    choice.conflict3_num = data.conflict3_num
    choice.decision_text = data.decision_text
    choice.comment = data.comment
  }

  // TODO: give type to `info` param
  async function loadCompanyInfo(info: any) {
    consentFlag.value = undefined
    consentDateForEdit.value = undefined

    if (!info || !info.names) return

    if (info.names.length == 0) {
      return
    }

    resetNameChoice(compName1)
    resetNameChoice(compName2)
    resetNameChoice(compName3)

    info.names.forEach((nameChoice: NameChoice) =>
      parseIntoNameChoice(nameChoice, nameChoices.value[nameChoice.choice])
    )

    const newCurrentNameChoice =
      nameChoices.value
        .filter((choice) =>
          [Status.NotExamined, Status.Approved, Status.Condition].includes(
            choice.state
          )
        )
        .at(0) ?? compName1
    await setCurrentNameChoice(newCurrentNameChoice)

    nr_status.value = info.state
    previousStateCd.value = info.previousStateCd
    requestType.value = info.requestTypeCd

    const parsedConsentDate = parseDate(info.consent_dt)
    consentDateForEdit.value =
      getDateFromDateTime(parsedConsentDate) ?? undefined

    // if the current state is not INPROGRESS, HOLD, or DRAFT clear any existing name record in currentNameObj
    if (
      ![Status.InProgress, Status.Hold, Status.Draft].includes(nr_status.value)
    ) {
      await setCurrentNameChoice(undefined)
    }

    // we keep the original data so that if fields exist that we do not use, we don't lose that
    // data when we put new data
    clientFirstName.value = info.applicants.clientFirstName
    clientLastName.value = info.applicants.clientLastName
    firstName.value = info.applicants.firstName
    middleName.value = info.applicants.middleName
    lastName.value = info.applicants.lastName
    addressLine1.value = info.applicants.addrLine1
    addressLine2.value = info.applicants.addrLine2
    addressLine3.value = info.applicants.addrLine3
    city.value = info.applicants.city
    province.value = info.applicants.stateProvinceCd
    postalCode.value = info.applicants.postalCd
    country.value = info.applicants.countryTypeCd
    contactName.value = info.applicants.contact
    phone.value = info.applicants.phoneNumber
    conEmail.value = info.applicants.emailAddress
    fax.value = info.applicants.faxNumber

    jurisdiction.value = info.xproJurisdiction
    natureOfBusiness.value = info.natureBusinessInfo
    additionalInfo.value = info.additionalInfo
    internalComments.value = info.comments

    examiner.value = info.userId
    priority.value = info.priorityCd

    const parsedExpirationDate = parseDate(info.expirationDate)
    expiryDate.value = getDateFromDateTime(parsedExpirationDate) ?? undefined

    const parsedSubmittedDate = parseDate(info.submittedDate)
    submittedDate.value = getDateFromDateTime(parsedSubmittedDate) ?? undefined

    previousNr.value = info.previousNr
    corpNum.value = info.corpNum
    furnished.value = info.furnished
    hasBeenReset.value = info.hasBeenReset

    if (nr_status.value === Status.InProgress) {
      is_making_decision.value = true
    }

    await getPayments()
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

  function resetNameChoice(choice: NameChoice) {
    choice.state = Status.NotExamined
    choice.decision_text = null
    choice.conflict1 = null
    choice.conflict2 = null
    choice.conflict3 = null
    choice.consumptionDate = null
    choice.corpNum = null
    choice.conflict1_num = null
    choice.conflict2_num = null
    choice.conflict3_num = null
    choice.comment = null
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
    resetNameChoice(currentNameObj.value)
  }

  async function makeDecision(decision: Status) {
    if (!currentNameObj.value) return

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
    if (!currentNameObj.value) return

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
  async function setCurrentNameChoice(choice: NameChoice | undefined) {
    if (!choice) {
      currentNameObj.value = undefined
      return
    }
    if (!choice.state || choice.state !== Status.NotExamined) {
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
    if (examiner.value?.includes('account')) {
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

  async function revertToPreviousState() {
    await patchNameRequest(nrNumber.value, {
      state: previousStateCd.value,
      previousStateCd: null,
    })
    await getpostgrescompInfo(nrNumber.value)
    await setNewExaminer()
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

  function updateRequestTypeRules(requestTypeObject: RequestType) {
    let rules = requestTypeRules.value.find(
      (rule) => rule.request_type == requestTypeObject.value
    )
    prevNrRequired.value = Boolean(rules?.prev_nr_required)
    corpNumRequired.value = Boolean(rules?.corp_num_required)
    additional_info_template.value = rules?.additional_info_template
    jurisdictionRequired.value = Boolean(rules?.jurisdiction_required)
  }

  function setRequestType(requestTypeObject: RequestType) {
    requestType.value = fromMappedRequestType(
      requestTypeObject.value,
      requestTypeObject.request_action_cd
    )
  }

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

  async function cancelEdits() {
    if (previousStateCd.value === Status.Draft) {
      await revertToPreviousState()
    } else {
      await getpostgrescompInfo(nrNumber.value)
    }
    is_editing.value = false
    is_header_shown.value = false
    editActions.forEach((ea) => ea.cancel())
  }

  function getConflictData(item: ConflictListItem) {
    switch (item.source) {
      case 'CORP':
        return getCorpConflict(item.nrNumber)
      case 'NR':
        return getNamesConflict(item.nrNumber)
    }
  }

  function selectConflict(conflict: ConflictListItem) {
    comparedConflicts.value.push(conflict)
    if (conflictsAutoAdd.value) {
      selectedConflicts.value.push(conflict)
    }
  }

  function deselectConflict(conflict: ConflictListItem) {
    const notConflict = (c: ConflictListItem) => c !== conflict
    selectedConflicts.value = selectedConflicts.value.filter(notConflict)
    comparedConflicts.value = comparedConflicts.value.filter(notConflict)
  }

  /** Keep compared conflicts synchronized with selected conflicts when auto add is enabled. */
  function syncSelectedAndComparedConflicts() {
    if (conflictsAutoAdd.value) {
      comparedConflicts.value = selectedConflicts.value.slice()
    }
  }

  // ======================== start of todo functions ========================

  async function updateNRState(state: Status) {
    // TODO: push to api
    if (state === Status.Draft && nr_status.value === Status.InProgress) {
      is_making_decision.value = false
    }
    nr_status.value = state
  }

  async function cancelNr(commentText: string) {
    await postComment(commentText)
    is_making_decision.value = false
    nr_status.value = Status.Cancelled
    // TODO: push CANCELLED state to API
  }

  /** Send name request decision to API */
  async function pushAcceptReject() {
    // TODO: make a PUT call to api
  }

  async function updateRequest() {
    // TODO: implement
    console.log('updating request')
  }

  async function postComment(text: string) {
    // TODO: post to comments endpoint and add api response to internalComments
    internalComments.value.push({
      comment: text,
      examiner: examiner.value!,
      timestamp: DateTime.now().toISO(),
    })
  }

  // TODO: should this be the $reset method for this store?
  async function resetValues() {
    // TODO
  }

  function resetConflictList() {
    // TODO
  }

  async function getpostgrescompInfo(nrNumber: string) {
    // TODO: implement
    console.log(`getting ${nrNumber}`)
  }
  // ============================ END OF FIRST HALF ===========================

  // ============================ START OF STUBBED HELPERS ===========================

  // ============================= END OF STUBBED HELPERS ============================

  // ========================== START OF SECOND HALF ==========================

  async function getpostgrescompNo() {
    // TODO
  }

  function getShortJurisdiction(jurisdiction: string): string {
    // TODO
    throw 'unimplemented'
  }

  function runManualRecipe(searchStr: string, exactPhrase: string) {
    // TODO
  }

  function resetExaminationArea() {
    // TODO
  }

  async function getHistoryInfo(nrNumber: string) {
    // TODO
  }

  function getCorpConflict(nrNumber: string): CorpConflict {
    // TODO
    throw 'unimplemented'
  }

  function getNamesConflict(nrNumber: string): NameRequestConflict {
    // TODO
    throw 'unimplemented'
  }

  async function getPayments() {
    // TODO
  }

  // ======================== end of todo functions ========================

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
    examiner,
    isCurrentExaminer,
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
    otherExaminerInProgress,
    expired,
    isApprovedAndExpired,
    canCancel,
    canClaim,
    exactHistoryMatch,
    addEditAction,
    isUndoable,
    getHistoryInfo,
    getConflictInfo,
    getShortJurisdiction,
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
    cancelEdits,
    updateRequestTypeRules,
    setRequestType,
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
    getConflictData,
    selectConflict,
    deselectConflict,
    syncSelectedAndComparedConflicts,
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useExamineStore, import.meta.hot))
}
