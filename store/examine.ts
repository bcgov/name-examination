export const useExamineStore = defineStore('examine', () => {
  const headerState = ref<'minimized' | 'maximized' | 'editable'>('minimized')
  const isPriority = ref(true)

  return { headerState, isPriority }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useExamineStore, import.meta.hot))
}
