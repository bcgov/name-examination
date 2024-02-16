<template>
  <div class="flex h-full flex-col bg-white">
    <TransactionsHeader
      class="h-1/4"
      v-if="transactions.nr"
      :data="transactions.nr"
    />
    <TransactionsEntryList
      class="h-3/4"
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
