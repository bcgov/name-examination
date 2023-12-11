import { Status } from '~/enums/nr-status'
import {
  type Trademark,
  type Comment,
  type Condition,
  type Conflict,
  type ConflictList,
  type ConflictListItem,
  type CorpConflict,
  type History,
  type Macro,
  type NameRequestConflict,
  type TrademarkApiResponse,
  type NameChoice,
} from '~/types'

import mock from './examine.mock.json'

export const useExamineStore = defineStore('examine', () => {
  const headerState = ref<'minimized' | 'maximized' | 'editable'>('minimized')

  const isPriority = ref(true)
  const inProgress = ref(true)
  const isComplete = ref(false)
  const isFurnished = ref(true)
  const nrStatus = ref(Status.InProgress)
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

  const conflicts = ref<Array<Conflict>>(mock.conflicts as Array<Conflict>)

  const corpConflictJSON = ref<CorpConflict>()
  const namesConflictJSON = ref<NameRequestConflict>()

  const selectedConflicts = ref<Array<ConflictListItem>>([])
  const comparedConflicts = ref<Array<ConflictListItem>>([])

  const listDecisionReasons = ref<Array<Macro>>(mock.macros)

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

  const trademarksJSON = ref<TrademarkApiResponse>(mock.trademarkJSON)

  const is_editing = ref(false)
  const is_making_decision = ref(true)
  const is_header_shown = ref(false)
  const nrNumber = ref('NR 1234567')
  const nr_status = ref('INPROGRESS')
  const isClosed = computed(() =>
    ['REJECTED', 'APPROVED', 'CONDITIONAL', 'CONSUMED'].includes(
      nr_status.value
    )
  )
  const requestType = ref('')
  const listRequestTypes = ref<any[]>([])

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

  const selectedReasons = ref<Array<Macro>>([])

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
    selectedReasons.value.map((macro) => macro.reason)
  )

  const requestorMessageStrings = computed(() =>
    conflictMessages.value.concat(
      conditionMessages.value,
      trademarkMessages.value,
      macroMessages.value
    )
  )

  const acceptanceWillBeConditional = computed(
    () => consentRequiredByUser.value
  )

  const decision_made = ref<Status>()

  const compName1 = ref<NameChoice>(mock.compName1)
  const compName2 = ref<NameChoice>(mock.compName2)
  const compName3 = ref<NameChoice>(mock.compName3)

  const currentChoice = ref(2)
  let currentNameObj = compName2

  const userHasApprovedRole = ref(true)
  const is_my_current_nr = ref(true)
  const furnished = ref('N')

  async function getHistoryInfo(nrNumber: string) {
    historiesInfoJSON.value = conflicts.value[1] as NameRequestConflict
  }

  function toggleConflictCheckbox(conflictItem: ConflictListItem) {
    if (!conflictsAutoAdd.value) {
      if (comparedConflicts.value.includes(conflictItem)) {
        comparedConflicts.value = comparedConflicts.value.filter(
          (c) => c.nrNumber !== conflictItem.nrNumber
        )
        selectedConflicts.value = selectedConflicts.value.filter(
          (c) => c.nrNumber !== conflictItem.nrNumber
        )
      } else {
        comparedConflicts.value.push(conflictItem)
      }
    } else {
      if (selectedConflicts.value.includes(conflictItem)) {
        selectedConflicts.value = selectedConflicts.value.filter(
          (c) => c.nrNumber !== conflictItem.nrNumber
        )
      } else {
        selectedConflicts.value.push(conflictItem)
      }
    }
  }

  function getShortJurisdiction(jurisdiction: string) {
    return jurisdiction
  }

  function isUndoable(name: NameChoice): boolean {
    if (
      !userHasApprovedRole.value || // if the NR is closed in any way, a name is not undoable - the NR will have to be re-opened first
      !is_my_current_nr.value ||
      furnished.value === 'Y' || // if the NR is furnished, nothing is undoable
      name.state == 'NE' || // if this name is complete (ie: anything other than NE) it's undoable
      name.state == null
    ) {
      return false
    }

    if (name.choice === 1) {
      // if name choices 2 and 3 have not been decided, then 1 is undoable
      return (
        (compName2.value.state == 'NE' || compName2.value.state == null) &&
        (compName3.value.state == 'NE' || compName3.value.state == null)
      )
    } else if (name.choice === 2) {
      // if name choice 3 has not been decided, then 2 is undoable
      return compName3.value.state == 'NE' || compName3.value.state == null
    } else {
      return true
    }
  }

  function undoDecision(name: NameChoice) {
    // todo: replace this with just changing `currentNameObj`
    let newChoice: Ref<NameChoice>
    if (name.choice == 1) {
      newChoice = compName1
    } else if (name.choice == 2) {
      newChoice = compName2
    } else {
      newChoice = compName3
    }
    currentNameObj = newChoice
    currentChoice.value = newChoice.value.choice
    currentNameObj.value.state = 'NE'
  }

  return {
    headerState,
    isPriority,
    inProgress,
    isComplete,
    isFurnished,
    nrStatus,
    conflictsAutoAdd,
    conflicts,
    comments,
    examiner,
    trademarksJSON,
    selectedConflicts,

    is_editing,
    is_making_decision,
    is_header_shown,
    nrNumber,
    nr_status,
    listRequestTypes,
    requestType,
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
    selectedReasons,
    selectedTrademarks,
    requestorMessageStrings,
    acceptanceWillBeConditional,
    decision_made,
    compName1,
    compName2,
    compName3,
    currentChoice,
    userHasApprovedRole,
    is_my_current_nr,
    furnished,
    isUndoable,
    getHistoryInfo,
    getConflictInfo,
    toggleConflictCheckbox,
    getShortJurisdiction,
    undoDecision,

    isClosed,
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useExamineStore, import.meta.hot))
}
