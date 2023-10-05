import {defineStore} from 'pinia'

export const useExamineOptionsStore = defineStore('examineOptions', () => {
    const classifyWords = ref(true)
    const priorityQueue = ref(true)
    return { classifyWords, priorityQueue }
})