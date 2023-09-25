import { DateTime } from 'luxon'
import { defineStore } from 'pinia'
import { getFormattedDateFromDateTime } from '~/util/date'
import { callNamexApi, getNamexApiUrl } from '~/util/namex-api'

export const useStatusStore = defineStore('status', () => {
  const holdNum = ref(null)
  const notExaminedNum = ref(null)
  const todayStr = computed(() => getFormattedDateFromDateTime(DateTime.now()))

  /**
   * Return the number of name requests found from the given API call
   */
  async function getNumFound(endpoint: string) {
    const url = getNamexApiUrl(endpoint)
    try {
      const data = await callNamexApi(url)
      return data.response.numFound
    } catch (error) {
      console.error(error)
      return 0
    }
  }

  /**
   * Update the state of the status store
   */
  async function update() {
    const baseParams = new URLSearchParams({
      order: 'priorityCd:desc,submittedDate:asc',
      furnished: 'true',
      unfurnished: 'true',
      rows: '3',
      start: '0',
    })

    baseParams.set('queue', 'hold')
    const newHoldNum = await getNumFound(`/requests?${baseParams}`)

    baseParams.set('queue', 'draft')
    const newNotExaminedNum = await getNumFound(`/requests?${baseParams}`)

    holdNum.value = newHoldNum
    notExaminedNum.value = newNotExaminedNum
  }

  return { holdNum, notExaminedNum, todayStr, update }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useStatusStore, import.meta.hot))
}
