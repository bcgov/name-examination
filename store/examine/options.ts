import { defineStore } from 'pinia'

export const useExaminationOptions = defineStore('examine-options', () => {
  const priorityQueue = ref(true)
  return { priorityQueue }
})
