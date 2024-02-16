import { Status } from '~/enums/nr-status'
import {
  type Trademark,
  type Comment,
  type Condition,
  type Histories,
  type Macro,
  type TrademarksObject,
  type NameChoice,
  type RequestType,
  type RequestTypeRule,
  type Jurisdiction,
  type TransactionEntry,
  type NameRequest,
  type HistoryEntry,
  type ConditionsList,
  type Transactions,
} from '~/types'

import requestTypes from '~/data/request_types.json'
import requestTypeRulesJSON from '~/data/request_type_rules.json'
import jurisdictionsData from '~/data/jurisdictions.json'
import { ConsentFlag, RequestTypeCode } from '~/enums/codes'
import {
  getDecisionReasons,
  getNameRequest,
  getNextNrNumber,
  getTransactions,
  patchNameRequest,
  postConditions,
  postHistories,
  postNewComment,
  postTrademarks,
  putNameChoice,
  putNameRequest,
} from '~/util/namex-api'
import { getEmptyNameChoice, sortNameChoices } from '~/util'
import { DateTime } from 'luxon'
import { fromMappedRequestType } from '~/util/request-type'
import { getDateFromDateTime, parseDate } from '~/util/date'
import { useConflicts } from './conflicts'
import { usePayments } from './payments'
import { useExaminationOptions } from './options'
import { Route } from '~/enums/routes'

export const useExamination = defineStore('examine', () => {
  const conflicts = useConflicts()
  const payments = usePayments()

  /** Username of the current user */
  const userId = ref(useNuxtApp().$userProfile.username)
  const userRoles = ref(useNuxtApp().$auth.realmAccess?.roles ?? [])

  const priority = ref<boolean>(false)
  const isComplete = computed(() =>
    [
      Status.Approved,
      Status.Rejected,
      Status.Conditional,
      Status.Consumed,
      Status.Completed,
      Status.Cancelled,
      Status.Historical,
      Status.Expired,
    ].includes(nrStatus.value)
  )
  const examiner = ref<string>()
  const isCurrentExaminer = computed(() => examiner.value === userId.value)

  const conflictSelectionDisabled = computed(
    () =>
      (customerMessageOverride.value != null &&
        customerMessageOverride.value != '') ||
      !isCurrentExaminer.value ||
      !isMakingDecision.value
  )
  const autoAddDisabled = computed(
    () =>
      conflictSelectionDisabled.value ||
      conflicts.selectedConflicts.length > 0 ||
      conflicts.comparedConflicts.length > 0
  )

  const comments = ref<Array<Comment>>([])

  const macros = ref<Array<Macro>>([])

  const trademarks = ref<Array<Trademark>>([])

  const isEditing = ref<boolean>()
  const isMakingDecision = ref<boolean>()
  const isHeaderShown = ref<boolean>()
  const nrNumber = ref<string>('')
  const nrStatus = ref(Status.Draft)
  const isClosed = computed(() =>
    [
      Status.Rejected,
      Status.Approved,
      Status.Conditional,
      Status.Consumed,
    ].includes(nrStatus.value)
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

  const conditions = ref<Array<Condition>>([])

  const histories = ref<Array<HistoryEntry>>([])

  const consentRequired = ref<boolean>()

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
    if (conflicts.selectedConflicts.length === 0 && consentRequired.value) {
      return ['Consent Required \n']
    } else {
      return conflicts.selectedConflicts.map((conflict) =>
        consentRequired.value
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

  const compName1 = reactive<NameChoice>(getEmptyNameChoice(1))
  const compName2 = reactive<NameChoice>(getEmptyNameChoice(2))
  const compName3 = reactive<NameChoice>(getEmptyNameChoice(3))
  const nameChoices = computed(() => [compName1, compName2, compName3])

  const currentNameObj = ref<NameChoice>()
  const currentName = computed(() => currentNameObj.value?.name || null)
  const currentChoice = computed(() => currentNameObj.value?.choice)

  const userHasApproverRole = computed(() =>
    userRoles.value.includes('names_approver')
  )
  const userHasEditRole = computed(
    () => userHasApproverRole.value || userRoles.value.includes('names_editor')
  )
  const isMyCurrentNr = computed(
    () => nrStatus.value === Status.InProgress && isCurrentExaminer.value
  )
  const furnished = ref<'Y' | 'N'>('N')

  const listJurisdictions = ref<Array<Jurisdiction>>(jurisdictionsData)
  const jurisdiction = ref<string>()
  const jurisdictionNumber = ref<string>()
  const jurisdictionRequired = ref<boolean>()

  const previousNr = ref<string>()
  const prevNrRequired = ref<boolean>()

  const consumedBy = ref<string>()
  const consentDate = ref<string>()
  const consentFlag = ref<ConsentFlag>()

  const pendingTransactionRequest = ref<boolean>()
  const transactionsData = ref<Array<TransactionEntry>>()

  const submittedDate = ref<DateTime>()
  const corpNum = ref<string>()
  const corpNumRequired = ref<boolean>()
  const expiryDate = ref<string>()

  const additionalInfo = ref<string>('')
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
    if (isMyCurrentNr.value) return true
    return (
      userHasEditRole.value &&
      [
        Status.Draft,
        Status.Hold,
        Status.Rejected,
        Status.Approved,
        Status.Conditional,
      ].includes(nrStatus.value)
    )
  })

  const otherExaminerInProgress = computed(
    () => !isCurrentExaminer.value && nrStatus.value === Status.InProgress
  )

  const expired = computed(
    () =>
      expiryDate.value &&
      DateTime.fromISO(expiryDate.value).endOf('day') < DateTime.now()
  )

  const isApprovedAndExpired = computed(
    // NR will move to 'EXPIRED' state once expiry date is reached for 'APPROVED', 'CONDITIONAL' state.
    // If currentState is 'EXPIRED', then it was approved and expired.
    () => expiryDate.value && nrStatus.value === Status.Expired
  )

  const canCancel = computed(
    () =>
      userHasEditRole.value &&
      !otherExaminerInProgress.value &&
      !expired.value &&
      !isMakingDecision.value &&
      nrStatus.value !== Status.Cancelled &&
      !isApprovedAndExpired.value
  )

  /** Can the current user claim the current name request for examination? */
  const canClaim = computed(
    () =>
      userHasApproverRole.value &&
      [Status.Draft, Status.Hold].includes(nrStatus.value)
  )

  const consumptionDate = computed(() =>
    nameChoices.value
      .map((d) => d.consumptionDate)
      .filter((d) => d != null)
      .at(0)
  )

  /** Status of an exact matches in history for alerting about previous submissions */
  const exactHistoryMatch = computed<Status | undefined>(() => {
    if (!histories.value) return

    let exactMatches = histories.value.filter(
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

  /** Get the state of this store formatted as a name request object from the NameX API */
  async function getNrData(): Promise<NameRequest> {
    const data = (await (
      await getNameRequest(nrNumber.value)
    ).json()) as NameRequest

    // NOTE: at this point, all store variables should be defined, but we will fallback to the API value just in case
    const applicant = data.applicants
    applicant.clientFirstName = clientFirstName.value || null
    applicant.clientLastName = clientLastName.value || null
    applicant.firstName = firstName.value || applicant.firstName
    applicant.lastName = lastName.value || applicant.lastName
    applicant.middleName = middleName.value || null
    applicant.addrLine1 = addressLine1.value || applicant.addrLine1
    applicant.addrLine2 = addressLine2.value || null
    applicant.addrLine3 = addressLine3.value || null
    applicant.city = city.value || applicant.city
    applicant.stateProvinceCd = province.value || applicant.stateProvinceCd
    applicant.postalCd = postalCode.value || applicant.postalCd
    applicant.countryTypeCd = country.value || applicant.countryTypeCd
    applicant.contact = contactName.value || ''
    applicant.phoneNumber = phone.value || applicant.phoneNumber
    applicant.emailAddress = conEmail.value || applicant.emailAddress
    applicant.faxNumber = fax.value || null

    nameChoices.value.forEach((choice) => {
      if (!choice.name) resetNameChoice(choice)
    })
    data.names = nameChoices.value

    data.requestTypeCd = requestType.value
    data.entity_type_cd = entityTypeCd.value
    data.request_action_cd = requestActionCd.value
    data.xproJurisdiction = jurisdiction.value || ''
    data.natureBusinessInfo = natureOfBusiness.value || data.natureBusinessInfo
    data.additionalInfo = additionalInfo.value || ''
    data.comments = comments.value
    data.state = nrStatus.value
    data.previousStateCd = previousStateCd.value || null
    data.previousNr = previousNr.value || null
    data.corpNum = corpNum.value || null
    data.furnished = furnished.value
    data.hasBeenReset = hasBeenReset.value || false
    data.consentFlag = consentFlag.value || null
    data.consent_dt = consentDate.value || null
    data.details = null

    const toFormattedDate = (dt: DateTime) =>
      dt.toUTC().toFormat('EEE, d MMM yyyy TTT')
    if (consentDate.value) {
      data.consent_dt = toFormattedDate(
        parseDate(consentDate.value).startOf('day')
      )
    }
    if (expiryDate.value) {
      data.expirationDate = toFormattedDate(
        parseDate(expiryDate.value).endOf('day')
      )
    }
    if (submittedDate.value) {
      const submitDate = toFormattedDate(submittedDate.value)
      if (submitDate) data.submittedDate = submitDate
    }

    return data
  }

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

  async function loadCompanyInfo(info: NameRequest) {
    if (!info || !info.names || info.names.length === 0) return

    consentFlag.value = undefined
    consentDate.value = undefined

    resetNameChoice(compName1)
    resetNameChoice(compName2)
    resetNameChoice(compName3)

    sortNameChoices(info.names).forEach((nameChoice: NameChoice) =>
      parseIntoNameChoice(nameChoice, nameChoices.value[nameChoice.choice - 1])
    )

    const newCurrentNameChoice =
      nameChoices.value
        .filter((choice) =>
          [Status.NotExamined, Status.Approved, Status.Condition].includes(
            choice.state
          )
        )
        .at(0) ?? compName1
    setCurrentNameChoice(newCurrentNameChoice)

    nrStatus.value = info.state
    previousStateCd.value = info.previousStateCd ?? undefined
    requestType.value = info.requestTypeCd

    consentFlag.value = info.consentFlag ?? undefined
    if (info.consent_dt) {
      const parsedConsentDate = parseDate(info.consent_dt)
      consentDate.value = getDateFromDateTime(parsedConsentDate) ?? undefined
    }

    // if the current state is not INPROGRESS, HOLD, or DRAFT clear any existing name record in currentNameObj
    if (
      ![Status.InProgress, Status.Hold, Status.Draft].includes(nrStatus.value)
    ) {
      setCurrentNameChoice(undefined)
    }

    // we keep the original data so that if fields exist that we do not use, we don't lose that
    // data when we put new data
    clientFirstName.value = info.applicants.clientFirstName ?? undefined
    clientLastName.value = info.applicants.clientLastName ?? undefined
    firstName.value = info.applicants.firstName
    middleName.value = info.applicants.middleName ?? undefined
    lastName.value = info.applicants.lastName
    addressLine1.value = info.applicants.addrLine1
    addressLine2.value = info.applicants.addrLine2 ?? undefined
    addressLine3.value = info.applicants.addrLine3 ?? undefined
    city.value = info.applicants.city
    province.value = info.applicants.stateProvinceCd
    postalCode.value = info.applicants.postalCd
    country.value = info.applicants.countryTypeCd
    contactName.value = info.applicants.contact
    phone.value = info.applicants.phoneNumber
    conEmail.value = info.applicants.emailAddress
    fax.value = info.applicants.faxNumber ?? undefined

    jurisdiction.value = info.xproJurisdiction
    jurisdictionNumber.value = info.homeJurisNum ?? undefined
    natureOfBusiness.value = info.natureBusinessInfo ?? undefined
    additionalInfo.value = info.additionalInfo
    comments.value = info.comments

    examiner.value = info.userId
    priority.value = info.priorityCd === 'Y'

    if (info.expirationDate) {
      const parsedExpirationDate = parseDate(info.expirationDate)
      expiryDate.value = getDateFromDateTime(parsedExpirationDate) ?? undefined
    }

    submittedDate.value = parseDate(info.submittedDate)

    previousNr.value = info.previousNr ?? undefined
    corpNum.value = info.corpNum ?? undefined
    furnished.value = info.furnished
    hasBeenReset.value = info.hasBeenReset

    if (nrStatus.value === Status.InProgress) {
      isMakingDecision.value = true
    }

    await payments.initialize(info.id)
  }

  function isUndoable(name: NameChoice): boolean {
    if (
      !userHasApproverRole.value || // if the NR is closed in any way, a name is not undoable - the NR will have to be re-opened first
      !isMyCurrentNr.value ||
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

  /** Reset the given `NameChoice`.
   * @param keepName choose to preserve the name property instead of setting it to `null`.
   */
  function resetNameChoice(choice: NameChoice, keepName = false) {
    choice.state = Status.NotExamined
    choice.name = keepName ? choice.name : ''
    choice.decision_text = ''
    choice.conflict1 = ''
    choice.conflict2 = ''
    choice.conflict3 = ''
    choice.conflict1_num = ''
    choice.conflict2_num = ''
    choice.conflict3_num = ''
    choice.consumptionDate = null
    choice.corpNum = null
    choice.comment = null
  }

  async function undoNameChoiceDecision(name: NameChoice) {
    resetExaminationArea()
    currentNameObj.value = nameChoices.value[name.choice - 1]
    resetNameChoice(currentNameObj.value, true)
    await pushCurrentNameChoice()
    await getpostgrescompInfo(nrNumber.value)
  }

  /** Populate the currently examining name choice with selected conflicts and decision text. */
  function populateNameChoice(choice: NameChoice) {
    if (conflicts.selectedConflicts.length > 0) {
      // Populate the current name object's conflicts
      for (const n of [0, 1, 2]) {
        const conflict = conflicts.selectedConflicts[n]
        if (conflict == null) break

        switch (n) {
          case 0:
            choice.conflict1 = conflict.text
            choice.conflict1_num = conflict.nrNumber
            break
          case 1:
            choice.conflict2 = conflict.text
            choice.conflict2_num = conflict.nrNumber
            break
          case 2:
            choice.conflict3 = conflict.text
            choice.conflict3_num = conflict.nrNumber
            break
        }
      }
    }
    choice.name = choice.name?.trimEnd() ?? null
    choice.decision_text = requestorMessage.value.substring(0, 955)
  }

  /** Attempts to examine the next name choice. If that is not possible, rejects the entire NR. */
  async function attemptNextNameChoice() {
    try {
      await examineNextNameChoice()
    } catch (e) {
      await updateNRState(Status.Rejected)
    }
  }

  async function pushDecision(choice: NameChoice) {
    await pushCurrentNameChoice()
    if (choice.state === Status.Approved) {
      await updateNRState(Status.Approved)
    } else if (choice.state === Status.Condition) {
      await updateNRState(Status.Conditional)
    }
  }

  async function makeDecision(decision: Status) {
    if (!currentNameObj.value) return

    if (decision === Status.Approved) {
      if (consentRequired.value) {
        currentNameObj.value.state = Status.Condition
      } else {
        currentNameObj.value.state = Status.Approved
        // If there were conflicts selected but this is an approval, remove the selected conflicts.
        // Do NOT clear the conflicts if the "Consent Required" condition is also set - then it's intentional.
        conflicts.clearSelectedConflicts()
      }
    } else {
      currentNameObj.value.state = Status.Rejected
    }
    populateNameChoice(currentNameObj.value)

    await pushDecision(currentNameObj.value)
    if (
      ![Status.Approved, Status.Condition].includes(currentNameObj.value.state)
    ) {
      await attemptNextNameChoice()
    }
  }

  async function makeQuickDecision(decision: Status, decisionText: string) {
    if (!currentNameObj.value) return

    currentNameObj.value.decision_text = decisionText || null
    if (decision === Status.Approved) {
      currentNameObj.value.state = Status.Approved
    } else {
      currentNameObj.value.state = Status.Rejected
    }

    await pushDecision(currentNameObj.value)
    await attemptNextNameChoice()
  }

  /** Attempt to set the given name choice as the current one. Will throw an error if the choice cannot be set. */
  function setCurrentNameChoice(choice: NameChoice | undefined) {
    if (!choice) {
      currentNameObj.value = undefined
      return
    }
    const choiceHasAcceptableStatus = [
      Status.NotExamined,
      Status.Approved,
      Status.Condition,
    ].includes(choice.state)
    if (choiceHasAcceptableStatus) {
      currentNameObj.value = choice
    } else {
      throw new Error(`Name choice ${choice.choice} cannot be examined`)
    }
  }

  /** Examine the next name choice in the name request. Throws an error if no name choice can be examined. */
  async function examineNextNameChoice() {
    const attempt = async (choice: NameChoice) => {
      try {
        setCurrentNameChoice(choice)
      } catch (e) {
        throw e
      }
    }
    if (currentChoice.value === 1) {
      await attempt(compName2)
    } else if (currentChoice.value === 2) {
      await attempt(compName3)
    } else {
      throw new Error('Cannot examine next name choice')
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
      const transactionsResponse = await getTransactions(nrNumber)
      const transactions = (await transactionsResponse.json()) as Transactions
      transactions.transactions.forEach((t) => sortNameChoices(t.names))
      transactionsData.value = transactions.transactions
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
      nrStatus.value = previousStateCd.value
      previousStateCd.value = undefined
    }

    await updateRequest()

    isEditing.value = false
    isHeaderShown.value = true
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
    resetValues()
    conflicts.resetConflictList()
    const nextNr = await getpostgrescompNo()
    await initialize(nextNr)
  }

  async function edit() {
    // if this isn't the user's INPROGRESS, make it that
    if (!isMyCurrentNr.value && !isClosed.value) {
      // track the previous state if it's currently in DRAFT (otherwise do not)
      if (nrStatus.value == Status.Draft) {
        await updateNRStatePreviousState(Status.InProgress, Status.Draft)
      } else {
        await updateNRState(Status.InProgress)
      }
    }
    isEditing.value = true
  }

  async function holdRequest() {
    isMakingDecision.value = false
    await updateNRState(Status.Hold)
    conflicts.resetConflictList()
  }

  function clearSelectedDecisionReasons() {
    conflicts.clearSelectedConflicts()
    selectedConditions.value = []
    selectedMacros.value = []
    selectedTrademarks.value = []
  }

  function clearConsent() {
    consentDate.value = undefined
    consentFlag.value = undefined
  }

  function resetNrDecision() {
    conflicts.resetConflictList()
    clearSelectedDecisionReasons()

    nrStatus.value = Status.InProgress
    if (!userHasApproverRole.value) {
      // initialize user in edit mode, with previous state set so NR gets set back to draft
      // when user is done changing name, adding comment, etc.
      previousStateCd.value = Status.Draft
      isEditing.value = true
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
    isMakingDecision.value = true
  }

  async function cancelEdits() {
    if (previousStateCd.value === Status.Draft) {
      await revertToPreviousState()
    } else {
      await getpostgrescompInfo(nrNumber.value)
    }
    isEditing.value = false
    isHeaderShown.value = false
    editActions.forEach((ea) => ea.cancel())
  }

  async function getTrademarks(query: string) {
    const response = await postTrademarks(query)
    const json = (await response.json()) as TrademarksObject
    return json.names
  }

  async function getConditions(query: string) {
    const response = await postConditions(query)
    const json = (await response.json()) as ConditionsList
    return json
  }

  async function getHistories(query: string) {
    const response = await postHistories(query)
    const json = (await response.json()) as Histories
    return json.names
  }

  async function getMacros(): Promise<Array<Macro>> {
    const response = await getDecisionReasons()
    return response.status === 200 ? await response.json() : []
  }

  function parseConditions(data: ConditionsList): Array<Condition> {
    const conditions = []
    for (const word of data.restricted_words_conditions) {
      for (const cond of word.cnd_info) {
        conditions.push({
          ...cond,
          phrase: word.word_info.phrase,
        })
      }
    }
    return conditions
  }

  async function updateNRState(state: Status) {
    if (state === Status.Draft && nrStatus.value === Status.InProgress) {
      isMakingDecision.value = false
    }
    nrStatus.value = state
    await patchNameRequest(nrNumber.value, { state: state })
    await getpostgrescompInfo(nrNumber.value)
  }

  async function cancelNr(commentText: string) {
    await postComment(commentText)
    resetExaminationArea()
    isMakingDecision.value = false
    await updateNRState(Status.Cancelled)
  }

  /** Send name choice data to API */
  async function pushCurrentNameChoice() {
    if (currentNameObj.value)
      await putNameChoice(nrNumber.value, currentNameObj.value)
  }

  async function updateRequest() {
    const data = await getNrData()
    const response = await putNameRequest(nrNumber.value, data)
    if (response.status === 200) {
      await loadCompanyInfo(await response.json())
    }
  }

  async function postComment(text: string) {
    const response = await postNewComment(nrNumber.value, text)
    if (response.status === 200) {
      comments.value.push(await response.json())
    }
  }

  function resetValues() {
    resetExaminationArea()
    conflicts.resetMatches()
    conditions.value = []
    histories.value = []
    trademarks.value = []
    isEditing.value = false
    isMakingDecision.value = false
    isHeaderShown.value = false
  }

  async function getpostgrescompInfo(nrNumber: string) {
    const response = await getNameRequest(nrNumber)
    await loadCompanyInfo(await response.json())
  }

  async function runManualRecipe(searchQuery: string, exactPhrase: string) {
    if (!currentNameObj.value) return

    resetExaminationArea()

    trademarks.value = await getTrademarks(searchQuery)
    histories.value = await getHistories(searchQuery)
    macros.value = await getMacros()
    const conditionsJson = await getConditions(searchQuery)
    conditions.value = parseConditions(conditionsJson)

    await conflicts.initialize(searchQuery, exactPhrase)
  }

  async function getpostgrescompNo(): Promise<string> {
    const priorityQueue = useExaminationOptions().priorityQueue
    const response = await getNextNrNumber(priorityQueue)
    const json = await response.json()
    return json.nameRequest
  }

  function getShortJurisdiction(jurisdiction: string): string {
    jurisdiction = jurisdiction.toUpperCase()
    if (jurisdiction.length === 2) return jurisdiction

    let index
    const textIndex = listJurisdictions.value.findIndex(
      (opt) => opt.text === jurisdiction
    )
    if (textIndex >= 0) index = textIndex
    const shortIndex = listJurisdictions.value.findIndex(
      (opt) => opt.short_desc === jurisdiction
    )
    if (shortIndex >= 0) index = shortIndex

    if (typeof index === 'number') {
      return listJurisdictions.value[index].value
    }

    return '?'
  }

  function resetExaminationArea() {
    conflicts.resetConflictList()
    clearSelectedDecisionReasons()
    conflicts.autoAdd = true
    consentRequired.value = false
    customerMessageOverride.value = undefined
  }

  async function getHistoryInfo(nrNumber: string): Promise<NameRequest> {
    const response = await getNameRequest(nrNumber)
    return response.json()
  }

  async function updateRoute() {
    await navigateTo({
      path: Route.Examine,
      query: { nr: nrNumber.value.split(' ')[1] },
    })
  }

  async function initialize(newNrNumber: string) {
    resetValues()
    nrNumber.value = newNrNumber
    await updateRoute()
    await getpostgrescompInfo(newNrNumber)
    await setNewExaminer()
    updateRequestTypeRules(requestTypeObject.value)
  }

  return {
    initialize,
    updateRoute,
    priority,
    isComplete,
    examiner,
    isCurrentExaminer,
    trademarks,
    comments,
    isClosed,
    isEditing,
    isMakingDecision,
    isHeaderShown,
    nrNumber,
    nrStatus,
    previousStateCd,
    listRequestTypes,
    requestType,
    requestTypeObject,
    requestTypeRules,
    requestActionCd,
    entityTypeCd,
    histories,
    autoAddDisabled,
    conflictSelectionDisabled,
    conditions,
    consentRequired,
    selectedConditions,
    customerMessageOverride,
    decisionSelectionsDisabled,
    macros,
    selectedMacros,
    selectedTrademarks,
    requestorMessageStrings,
    requestorMessage,
    compName1,
    compName2,
    compName3,
    nameChoices,
    currentNameObj,
    currentChoice,
    currentName,
    userHasApproverRole,
    userHasEditRole,
    isMyCurrentNr,
    furnished,
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
    submittedDate,
    corpNum,
    corpNumRequired,
    consentDate,
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
    updateRequest,
    cancelEdits,
    updateRequestTypeRules,
    setRequestType,
    getpostgrescompNo,
    resetValues,
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
  import.meta.hot.accept(acceptHMRUpdate(useExamination, import.meta.hot))
}
