import { Status } from '~/enums/filter-dropdowns'
import {
  type Trademark,
  type BCCorpConflict,
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
  type XproConflict,
} from '~/types'

export const useExamineStore = defineStore('examine', () => {
  const headerState = ref<'minimized' | 'maximized' | 'editable'>('minimized')

  const isPriority = ref(true)
  const inProgress = ref(true)
  const isComplete = ref(false)
  const isFurnished = ref(true)
  const nrStatus = ref(Status.InProgress)
  const examiner = ref('someone@idir')

  const exactMatchesConflicts = ref<Array<ConflictListItem>>([])
  const parsedSynonymConflicts = ref<Array<ConflictList>>([
    {
      text: 'SO',
      highlightedText: '<span class="stem-highlight">SO</span>',
      meta: 'PROXIMITY SEARCH',
      children: [
        {
          text: 'XYZ SO LTD.',
          highlightedText: 'XYZ <span class="stem-highlight">SO</span> LTD.',
          jurisdiction: 'BC',
          nrNumber: '0685772',
          startDate: '2004-01-22T00:00:00Z',
          source: 'CORP',
        },
        {
          text: 'SO COOL INC.',
          highlightedText: '<span class="stem-highlight">SO</span> COOL INC.',
          jurisdiction: 'BC',
          nrNumber: 'NR 0769877',
          startDate: '2006-09-25T00:00:00Z',
          source: 'NR',
        },
        {
          text: 'JOHNNY SO INC.',
          highlightedText: 'JOHNNY <span class="stem-highlight">SO</span> INC.',
          jurisdiction: 'ON',
          nrNumber: 'A4312694',
          startDate: '2006-09-25T00:00:00Z',
          source: 'CORP',
        },
      ],
    },
    {
      text: 'SO*',
      highlightedText: '<span class="stem-highlight">SO</span>*',
      meta: 'EXACT WORD ORDER',
      children: [],
    },
  ])
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

  const requestorMessage = ref('')
  const requestMessageEdited = ref(false)

  const comments: Array<Comment> = [
    {
      comment:
        'Name choice 3 changed from BLACK HILL PERSONAL REAL ESTATE CORPORATION to BLACK HILL PERSONAL COOP COOPERATIVE',
      examiner: 'anonymous@idir',
      timestamp: '2023-05-31, 10:00am',
    },
    {
      comment:
        'Name choice 3 changed from BLACK HILL to BLACK HILL PERSONAL REAL ESTATE CORPORATION',
      examiner: 'anonymous@idir',
      timestamp: '2023-05-31, 9:12am',
    },
    {
      comment:
        'Name choice 3 changed from BLACK HILL to BLACK HILL PERSONAL REAL ESTATE CORPORATION',
      examiner: 'anonymous@idir',
      timestamp: '2023-05-31, 9:12am',
    },
    {
      comment:
        'Name choice 3 changed from BLACK HILL to BLACK HILL PERSONAL REAL ESTATE CORPORATION',
      examiner: 'anonymous@idir',
      timestamp: '2023-05-31, 9:12am',
    },
  ]

  const conflicts = ref<Conflict[]>([
    {
      type: 'corp',
      startDate: '2004-01-22',
      nrNumber: '0685772',
      jurisdiction: 'BC',
      text: 'XYZ SO LTD.',
      invalidRecordInd: false,
      'incorp #': '0685772',
      directors: ['ADA SO', 'Paul James'],
      'nature of business': 'Not available',
      'records office delivery address': [
        '6407 CYPRESS STREET',
        'VANCOUVER BC CA V6M 3S4',
      ],
      'registered office delivery address': [
        '6407 CYPRESS STREET',
        'VANCOUVER BC CA V6M 3S4',
      ],
    } as BCCorpConflict,
    {
      type: 'name',
      startDate: '2006-09-25',
      nrNumber: 'NR 0769877',
      jurisdiction: 'BC',
      text: 'SO COOL INC.',
      invalidRecordInd: false,
      applicants: {
        firstName: 'John',
        lastName: 'Test',
        addrLine1: '6407 CYPRESS STREET',
        addrLine2: '',
        addrLine3: '',
        city: 'Vancouver',
        stateProvinceCd: 'BC',
        postalCd: 'V6M 3S4',
        countryTypeCd: 'CA',
        phoneNumber: '305-343-3434',
        emailAddress: 'test@example.com',
        clientFirstName: 'John',
        clientLastName: 'Test',
        contact: 'John Test',
      },
      state: 'APPROVED',
      comments: comments,
      names: [
        {
          name: 'SO COOL INC.',
          decision_text: 'accepted',
          state: 'APPROVED',
          conflict1: 'ADA SO LTD.',
        },
      ],
    } as NameRequestConflict,
    {
      type: 'corp',
      startDate: '2006-09-25',
      nrNumber: 'A4312694',
      jurisdiction: 'ON',
      text: 'JOHNNY SO INC.',
      invalidRecordInd: false,
      'incorp #': 'A4312694',
      'attorney names': 'Not Available',
      'nature of business': 'Not available',
      directors: ['ADA SO', 'Paul James'],
      'head office': ['6407 CYPRESS STREET', 'TORONTO ON CA L4S 3S4'],
    } as XproConflict,
  ])

  const corpConflictJSON = ref<CorpConflict>()
  const namesConflictJSON = ref<NameRequestConflict>()

  const selectedConflicts = ref<Conflict[]>([])
  const comparedConflicts = ref<Conflict[]>([])

  const listDecisionReasons = ref<Array<Macro>>([
    {
      id: 4,
      name: 'Amend ',
      reason: '*** Name Amended To Allow Acceptance ***',
    },
    {
      id: 3,
      name: 'Amend Real Estate ',
      reason: '***Name Amended To Allow Acceptance By Real Estate Council***',
    },
    {
      id: 5,
      name: 'Assumed Name',
      reason:
        'Assumed Name A Foreign Entity Whose Name Has Been Rejected For Use In Bc, May Register In Bc Under An Assumed Name.',
    },
    {
      id: 6,
      name: 'Assumed Yes ',
      reason:
        'A Foreign Entity That Is Registering In British Columbia As An Extraprovincial Company And Adopting An Assumed Name Must Provide The Registrar With A Covering Letter Attaching An Undertaking To Carry On Business Under The Assumed Name.  Sample Working For The Undertaking Can Be Found On Page 34 Of The Information For Registration Of An Extraprovincial Company In British Columbia   Information Package And Also In The Online Help Text At Www.Corporateonline.Gob Please Fax The Letter Containing The Undertaking To The Attention Of The Corporations Unit, Bc Registry Services (Fax Number:250 356-8923).',
    },
  ])

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

  const trademarksJSON = ref<TrademarkApiResponse>({
    names: [
      {
        application_number: '300000102764600',
        description: '(1) Fruit drinks and soft drinks containing fruit juices',
        name: 'STEEP',
        score: 82.06702,
        status: 'Registration published',
      },
      {
        application_number: '300000167106400',
        description:
          '(1) Structural thermal energy efficient panels for residential, commercial and industrial construction as exterior/interior walls, floors, ceilings and roofs. (2) Energy efficient windows.',
        name: 'STEEP',
        score: 82.06702,
        status: 'Registration published',
      },
      {
        application_number: '300000055451300',
        description:
          '(1) Games, namely board games, parlour games, puzzles, strategy games, card games.',
        name: 'CO-OPERATIVE',
        score: 78.5403,
        status: 'Registration published',
      },
    ],
  })

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

  const parseConditions = ref<Array<Condition>>([
    {
      allow_use: 'Y',
      consent_required: 'N',
      id: 4421,
      instructions: ' ',
      text: 'Use Of This Term Is Restricted Under The Cooperative Association Act R.S.B.C. 1999 C. 28, and only given for a Cooperative. ',
      consent_required_tf: false,
      allow_use_tf: true,
      phrase: 'COOPERATIVE',
    },
  ])

  const trademarkInfo = ref({ names: [] })
  const historiesJSON = ref<History>({
    names: [
      {
        name: 'NOT SO STEEP COOPERATIVE',
        jurisdiction: 'BC',
        nr_num: 'NR 5979354',
        start_date: '2008-09-16T16:41:29Z',
        name_state_type_cd: 'R',
      },
      {
        name: 'NOT SO STEEP COOPERATIVE',
        jurisdiction: 'BC',
        nr_num: 'NR 3252689',
        start_date: '2008-09-16T16:41:29Z',
        name_state_type_cd: 'A',
      },
    ],
  })

  const historiesInfoJSON = ref<NameRequestConflict>()

  const consentRequiredByUser = ref(false)

  const selectedConditions = ref<Array<Condition>>([])

  const customerMessageOverride = ref<string>()

  const decisionSelectionsDisabled = computed(
    () => customerMessageOverride.value != null
  )

  const selectedReasons = ref<Array<Macro>>([])

  const selectedTrademarks = ref<Array<Trademark>>([])

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
    requestorMessage,
    requestMessageEdited,

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
