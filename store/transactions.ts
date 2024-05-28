import {
  type NameRequest,
  type TransactionEntry,
  type Transactions,
} from '~/types'
import { getNameRequest, getTransactions } from '~/util/namex-api'
import { sortNameChoices } from '~/util'

export const useTransactions = defineStore('transactions', () => {
  const nr = ref<NameRequest>()
  const transactions = ref<Array<TransactionEntry>>([])
  const loadingTransactions = ref(false)

  async function loadNr(nrNumber: string) {
    const nrResponse = await getNameRequest(nrNumber)
    nr.value = await nrResponse.json()
    if (nr.value) sortNameChoices(nr.value.names)
  }

  async function loadTransactions(nrNumber: string) {
    loadingTransactions.value = true
    const transactionsResponse = await getTransactions(nrNumber)
    const transactionsJson = (await transactionsResponse.json()) as Transactions
    transactionsJson.transactions.forEach((t) => sortNameChoices(t.names))
    transactions.value = transactionsJson.transactions
    loadingTransactions.value = false
  }

  /** Initialize this store with NR and transactions data. */
  async function initialize(nrNumber: string) {
    try {
      await loadNr(nrNumber)
      await loadTransactions(nrNumber)
    } catch (e) {
      if (!nr.value) {
        throw new Error(`Failed to fetch data for ${nrNumber}`)
      } else {
        throw new Error(`Failed to fetch transactions data`)
      }
    } finally {
      loadingTransactions.value = false
    }
  }

  return {
    nr,
    transactions,
    loadingTransactions,
    initialize,
  }
})
