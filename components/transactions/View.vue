<template>
  <div class="flex flex-col bg-white">
    <TransactionsHeader v-if="nrData" :data="nrData" />
  </div>
</template>

<script setup lang="ts">
import { type Transactions, type NameRequest } from '~/types'
import { getNameRequest, getTransactions } from '~/util/namex-api'

const props = defineProps<{
  nrNumber: string
}>()

const nrData = ref<NameRequest>()
const transactions = ref<Transactions>()

onMounted(async () => {
  const nrResponse = await getNameRequest(props.nrNumber)
  nrData.value = await nrResponse.json()

  const transactionsResponse = await getTransactions(props.nrNumber)
  transactions.value = await transactionsResponse.json()
})
</script>
