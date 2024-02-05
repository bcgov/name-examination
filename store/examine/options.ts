import { defineStore } from 'pinia'

export const useExamineOptionsStore = defineStore('examine-options', () => {
  const classifyWords = ref(true)
  const priorityQueue = ref(true)
  return { classifyWords, priorityQueue }
})
