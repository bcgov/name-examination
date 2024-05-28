<template>
  <History v-if="transactions.nr" :nr="transactions.nr">
    <TransactionsList
      :entries="transactions.transactions"
      :loading="transactions.loadingTransactions"
    />
  </History>
</template>

<script setup lang="ts">
import { useTransactions } from '~/store/transactions'
import { emitter } from '~/util/emitter'

useHead({ title: 'BC Registry: Name Examination - Transactions' })

definePageMeta({ layout: 'empty' })

const transactions = useTransactions()

onMounted(async () => {
  const route = useRoute()
  const nrParam = route.query.nr as string
  try {
    await transactions.initialize(`NR ${nrParam}`)
  } catch (e) {
    emitter.emit('error', {
      title: 'Failed to load transactions page',
      message: e as string,
    })
  }
})
</script>
