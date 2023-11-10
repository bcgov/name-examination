import { Status } from '~/enums/filter-dropdowns'

export const useExamineStore = defineStore('examine', () => {
  const headerState = ref<'minimized' | 'maximized' | 'editable'>('minimized')

  const isPriority = ref(true)
  const inProgress = ref(true)
  const isComplete = ref(false)
  const isFurnished = ref(true)
  const nrStatus = ref(Status.InProgress)
  const examiner = ref('someone@idir')

  const autoAdd = ref(true)

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

  const conflicts = [
    {
      name: 'XYZ SO LTD.',
      number: '0685772',
      jurisdiction: 'BC',
      date: '2004-01-22',
      start: 4,
      end: 6,
      type: 'corp',
    },
    {
      name: 'SO COOL INC.',
      number: 'NR 0769877',
      jurisdiction: 'BC',
      date: '2006-09-25',
      start: 0,
      end: 3,
      type: 'nr',
    },
    {
      name: 'JOHNNY SO INC.',
      number: 'A4312694',
      jurisdiction: 'ON',
      date: '2006-09-25',
      start: 7,
      end: 10,
      type: 'xprocorp',
    },
  ]

  const selectedConflicts = ref<string[]>([])

  const trademarks = [
    [
      'FARMERS',
      '(1) Produits laitiers. (2) Jus de fruits. (3) T-shirts.',
      'Registration published',
    ],
    [
      "FARMER'S",
      '(1) Alcoholic beverages, namely gin.',
      'Registration published',
    ],
  ]

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

  const cobrsPhoneticConflicts = ref([])
  const exactMatchesConflicts = ref([])
  const synonymMatchesConflicts = ref([])
  const phoneticConflicts = ref([])

  return {
    headerState,
    isPriority,
    inProgress,
    isComplete,
    isFurnished,
    nrStatus,
    autoAdd,
    conflicts,
    comments,
    examiner,
    trademarks,
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

    isClosed,
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useExamineStore, import.meta.hot))
}
