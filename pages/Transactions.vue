<template>
  <div class="flex h-screen items-center justify-center">
    <div class="flex h-full w-2/3 flex-col border-x-2 border-neutral-300">
      <HistoryHeader
        v-if="transactions.nr"
        :nr="transactions.nr"
        :loading="transactions.loadingNr"
      />
      <TransactionsList
        :entries="transactions.transactions"
        :loading="transactions.loadingTransactions"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useTransactions } from '~/store/transactions'

useHead({ title: 'BC Registry: Name Examination - Transactions' })

definePageMeta({ layout: 'empty' })

const transactions = useTransactions()

onMounted(async () => {
  const route = useRoute()
  const nrParam = route.query.nr as string
  await transactions.initialize(`NR ${nrParam}`)
})
</script>
