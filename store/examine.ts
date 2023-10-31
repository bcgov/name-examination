export const useExamineStore = defineStore('examine', () => {
  const headerState = ref<'minimized' | 'maximized' | 'editable'>('minimized')
  const isPriority = ref(true)
  const inProgress = ref(true)
  const autoAdd = ref(true)

  return { headerState, isPriority, inProgress, autoAdd }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useExamineStore, import.meta.hot))
}
