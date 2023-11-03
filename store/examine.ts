export const useExamineStore = defineStore('examine', () => {
  const headerState = ref<'minimized' | 'maximized' | 'editable'>('minimized')
  const isPriority = ref(true)
  const inProgress = ref(true)
  const autoAdd = ref(true)

  const requestorMessage = ref('')
  const requestMessageEdited = ref(false)

  const conflicts = ref([])

  const comments = [
    {
      content:
        'Name choice 3 changed from BLACK HILL PERSONAL REAL ESTATE CORPORATION to BLACK HILL PERSONAL COOP COOPERATIVE',
      author: 'anonymous@idir',
      time: '2023-05-31, 10:00am',
    },
    {
      content:
        'Name choice 3 changed from BLACK HILL to BLACK HILL PERSONAL REAL ESTATE CORPORATION',
      author: 'anonymous@idir',
      time: '2023-05-31, 9:12am',
    },
    {
      content:
        'Name choice 3 changed from BLACK HILL to BLACK HILL PERSONAL REAL ESTATE CORPORATION',
      author: 'anonymous@idir',
      time: '2023-05-31, 9:12am',
    },
    {
      content:
        'Name choice 3 changed from BLACK HILL to BLACK HILL PERSONAL REAL ESTATE CORPORATION',
      author: 'anonymous@idir',
      time: '2023-05-31, 9:12am',
    },
  ]

  return {
    headerState,
    isPriority,
    inProgress,
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
