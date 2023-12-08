import { Status } from "~/enums/nr-status"
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

  const selectedConflicts = ref<Conflict[]>([])
  const comparedConflicts = ref<Conflict[]>([])

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

  async function getHistoryInfo(nrNumber: string) {
    historiesInfoJSON.value = conflicts.value[1] as NameRequestConflict
  }

  function toggleConflictCheckbox(conflictItem: ConflictListItem) {
    const conflict = conflicts.value.filter(
      (c) => c.nrNumber === conflictItem.nrNumber
    )[0]
    if (selectedConflicts.value.includes(conflict)) {
      selectedConflicts.value = selectedConflicts.value.filter(
        (c) => c.text !== conflictItem.text
      )
    } else {
      selectedConflicts.value.push(conflict)
    }
  }

  function getShortJurisdiction(jurisdiction: string) {
    return jurisdiction
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
    getHistoryInfo,
    getConflictInfo,
    toggleConflictCheckbox,
    getShortJurisdiction,

    isClosed,
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useExamineStore, import.meta.hot))
}
