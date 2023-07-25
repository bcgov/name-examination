import { DateTime } from 'luxon'

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
        const url = import.meta.env.VITE_APP_NAMEX_API_URL + import.meta.env.VITE_APP_NAMEX_API_VERSION +
        import.meta.env.VITE_APP_HOLD_QUEUE_URL
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
        const url = import.meta.env.VITE_APP_NAMEX_API_URL + import.meta.env.VITE_APP_NAMEX_API_VERSION +
        import.meta.env.VITE_APP_DRAFT_QUEUE_URL
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
