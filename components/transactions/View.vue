<template>
  <div class="flex h-full flex-col">
    <HistoryHeader
      v-if="transactions.nr"
      :nr="transactions.nr"
      :loading="transactions.loadingNr"
    />
    <TransactionsEntryList
      :entries="transactions.transactions"
      :loading="transactions.loadingTransactions"
    />
  </div>
</template>

<script setup lang="ts">
import { useTransactions } from '~/store/transactions'

const props = defineProps<{
  nrNumber: string
}>()

const transactions = useTransactions()

onMounted(async () => {
  await transactions.initialize(props.nrNumber)
})
</script>
