import {
  type NameRequest,
  type Notification,
} from '~/types'
import { sortNameChoices } from '~/util'
import { getNameRequest, getNotifications } from '~/util/namex-api'

export const useNotifications = defineStore('notifications', () => {
  const nr = ref<NameRequest>()
  const notifications = ref<Array<Notification>>([])
  const loading = ref(false)

  async function loadNr(nrNumber: string) {
    const nrResponse = await getNameRequest(nrNumber)
    nr.value = await nrResponse.json()
    if (nr.value) sortNameChoices(nr.value.names)
  }

  async function loadNotifications(nrNumber: string) {
    loading.value = true
    /** TODO: when getNotifications is updated to actually call the API, edit the code to something like this:
     * const notificationsResponse = await getNotifications(nrNumber)
     * const notificationsJson = (await notificationsResponse.json()) as NotificationsResponse
     */
    const notificationsJson = await getNotifications(nrNumber)
    notifications.value = notificationsJson.notifications
    loading.value = false
  }

  /** Initialize this store with NR and notifications data. */
  async function initialize(nrNumber: string) {
    try {
      await loadNr(nrNumber)
      await loadNotifications(nrNumber)
    } catch (e) {
      if (!nr.value) {
        throw new Error(`Failed to fetch data for ${nrNumber}`)
      } else {
        throw new Error(`Failed to fetch notifications data`)
      }
    } finally {
      loading.value = false
    }
  }

  return { nr, notifications, loading, initialize }
})
