import { defineStore } from 'pinia'

export const useExaminationOptions = defineStore('examine-options', () => {
  const classifyWords = ref(true)
  const priorityQueue = ref(true)
  return { classifyWords, priorityQueue }
})
