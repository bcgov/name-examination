export const useExamineStore = defineStore('examine', () => {
  const headerState = ref<'minimized' | 'maximized' | 'editable'>('minimized')
  const isPriority = ref(true)

  /**
   * Cancel the current active name request
   * @param comment The comment explaining why the NR was cancelled
   */
  function cancelNR(comment: string) {
    console.log(`cancelling nr: ${comment}`)
  }

  return { headerState, isPriority, cancelNR }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useExamineStore, import.meta.hot))
}
