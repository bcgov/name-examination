import { Status } from '~/enums/filter-dropdowns'
import type { BCCorpConflict, Conflict } from '~/types'

export const useExamineStore = defineStore('examine', () => {
  const headerState = ref<'minimized' | 'maximized' | 'editable'>('minimized')

  const isPriority = ref(true)
  const inProgress = ref(true)
  const isComplete = ref(false)
  const isFurnished = ref(true)
  const nrStatus = ref(Status.InProgress)
  const examiner = ref('someone@idir')

  const cobrsPhoneticConflicts = ref([])
  const exactMatchesConflicts = ref([])
  const synonymMatchesConflicts = ref([])
  const phoneticConflicts = ref([])

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

  const comments = [
    {
      content:
        'Name choice 3 changed from BLACK HILL PERSONAL REAL ESTATE CORPORATION to BLACK HILL PERSONAL COOP COOPERATIVE',
      author: 'anonymous@idir',
      date: '2023-05-31, 10:00am',
    },
    {
      content:
        'Name choice 3 changed from BLACK HILL to BLACK HILL PERSONAL REAL ESTATE CORPORATION',
      author: 'anonymous@idir',
      date: '2023-05-31, 9:12am',
    },
    {
      content:
        'Name choice 3 changed from BLACK HILL to BLACK HILL PERSONAL REAL ESTATE CORPORATION',
      author: 'anonymous@idir',
      date: '2023-05-31, 9:12am',
    },
    {
      content:
        'Name choice 3 changed from BLACK HILL to BLACK HILL PERSONAL REAL ESTATE CORPORATION',
      author: 'anonymous@idir',
      date: '2023-05-31, 9:12am',
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
      text: 'SO COOL INC.',
      nrNumber: 'NR 0769877',
      jurisdiction: 'BC',
      startDate: '2006-09-25',
      type: 'name',
      invalidRecordInd: false,
    },
    {
      type: 'corp',
      text: 'JOHNNY SO INC.',
      nrNumber: 'A4312694',
      jurisdiction: 'ON',
      startDate: '2006-09-25',
      invalidRecordInd: false,
    },
  ])

  const selectedConflicts = ref<string[]>([])
  const comparedConflicts = ref<Conflict[]>([conflicts.value[0]])

  const trademarksJSON = ref({
    names: [
      {
        name: 'FARMERS',
        description: '(1) Produits laitiers. (2) Jus de fruits. (3) T-shirts.',
        status: 'Registration published',
        score: 9,
        application_number: 0,
      },
      {
        name: "FARMER'S",
        description: '(1) Alcoholic beverages, namely gin.',
        status: 'Registration published',
        score: 7,
        application_number: 1,
      },
    ],
  })

  const is_editing = ref(false)
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

  const parseConditions = ref([
    {
      phrase: 'COOP',
      allow_use: 'Y',
      consent_required: 'N',
      text: 'Use Of This Term Is Restricted Under The Cooperative Association Act R.S.B.C. 1999 C. 28, and only given for a Cooperative.',
      instructions: '',
    },
  ])

  const trademarkInfo = ref({ names: [] })
  const historiesJSON = ref({ names: [{ name_state_type_cd: 'R' }] })

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
    is_header_shown,
    nrNumber,
    nr_status,
    listRequestTypes,
    requestType,
    cobrsPhoneticConflicts,
    exactMatchesConflicts,
    synonymMatchesConflicts,
    phoneticConflicts,
    conditionsJSON,
    trademarkInfo,
    historiesJSON,
    autoAddDisabled,
    decisionFunctionalityDisabled,
    parseConditions,
    comparedConflicts,

    isClosed,
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useExamineStore, import.meta.hot))
}
