import {
  type NameRequest,
  type TransactionEntry,
  type Transactions,
} from '~/types'
import { emitter } from '~/util/emitter'
import { getNameRequest, getTransactions } from '~/util/namex-api'

export const useTransactions = defineStore('transactions', () => {
  const nr = ref<NameRequest>()
  const transactions = ref<Array<TransactionEntry>>([])
  const loadingNr = ref(false)
  const loadingTransactions = ref(false)

  async function loadNr(nrNumber: string) {
    loadingNr.value = true
    const nrResponse = await getNameRequest(nrNumber)
    nr.value = await nrResponse.json()
    loadingNr.value = false
  }

  async function loadTransactions(nrNumber: string) {
    loadingTransactions.value = true
    const transactionsResponse = await getTransactions(nrNumber)
    const transactionsJson = (await transactionsResponse.json()) as Transactions
    transactions.value = transactionsJson.transactions
    loadingTransactions.value = false
  }

  async function initialize(nrNumber: string) {
    try {
      await loadNr(nrNumber)
      await loadTransactions(nrNumber)
    } catch (e) {
      emitter.emit('error', {
        title: 'Transactions Error',
        message: 'Failed to retrieve transactions data.',
      })
    } finally {
      loadingNr.value = false
      loadingTransactions.value = false
    }
  }

  return { nr, transactions, loadingNr, loadingTransactions, initialize }
})
