export const useExamineStore = defineStore('examine', () => {
  const headerState = ref<'minimized' | 'maximized' | 'editable'>('minimized')
  const isPriority = ref(true)
  const inProgress = ref(true)
  const autoAdd = ref(true)

  const requestorMessage = ref('')
  const requestMessageEdited = ref(false)

  const conflicts = ref([
    
  ])

  return {
    headerState,
    isPriority,
    inProgress,
    autoAdd,
    requestorMessage,
    requestMessageEdited,
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useExamineStore, import.meta.hot))
}
