import { Status } from '~/enums/filter-dropdowns'

export const useExamineStore = defineStore('examine', () => {
  const headerState = ref<'minimized' | 'maximized' | 'editable'>('minimized')

  const isPriority = ref(true)
  const inProgress = ref(true)
  const isComplete = ref(false)
  const isFurnished = ref(true)
  const nrStatus = ref(Status.Conditional)

  const autoAdd = ref(true)

  const requestorMessage = ref('')
  const requestMessageEdited = ref(false)

  const conflicts = ref([])

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

    requestorMessage,
    requestMessageEdited,
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useExamineStore, import.meta.hot))
}
