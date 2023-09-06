import { DateTime } from 'luxon'
import { defineStore } from 'pinia'

export const Fetchstatus = defineStore({
  id: 'status',
  state: () => {
    return {
      holdNum: null,
      notExaminedNum: null
    }
  },

  getters: {
    todayStr: () => {
      const now = DateTime.now()
      return now.toFormat('yyyy-MM-dd, h:mm a')
    }
  },
  actions: {
    async getHoldedNum () {
      try {
        const NAMEX_API = `${useRuntimeConfig().public.namexAPIURL}${useRuntimeConfig().public.namexAPIVersion}`
        const HOLD_QUEUE_URL = '/requests?order=priorityCd:desc,submittedDate:asc&' +
                                'queue=hold&furnished=true&unfurnished=true&rows=3&start=0'
        const url = NAMEX_API + HOLD_QUEUE_URL
        const token = sessionStorage.getItem('KEYCLOAK_TOKEN')
        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        const data = await response.json()
        this.holdNum = data.response.numFound
      } catch (error) {
        console.error(error)
      }
    },
    async getExaminedNum () {
      try {
        const NAMEX_API = `${useRuntimeConfig().public.namexAPIURL}${useRuntimeConfig().public.namexAPIVersion}`
        const DRAFT_QUEUE_URL = '/requests?order=priorityCd:desc,submittedDate:asc&' +
                                'queue=draft&furnished=true&unfurnished=true&rows=3&start=0'
        const url = NAMEX_API + DRAFT_QUEUE_URL
        const token = sessionStorage.getItem('KEYCLOAK_TOKEN')
        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        const data = await response.json()
        this.notExaminedNum = data.response.numFound
      } catch (error) {
        console.error(error)
      }
    }
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(Fetchstatus, import.meta.hot))
}
