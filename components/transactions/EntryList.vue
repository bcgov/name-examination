<template>
  <div class="flex flex-col">
    <div class="flex justify-between border-y-2 px-8 py-1">
      <span class="text-xl font-bold">Transaction History</span>
      <label for="sys-transactions" class="flex items-center space-x-1">
        <input
          class="h-4 w-4"
          id="sys-transactions"
          type="checkbox"
          v-model="showSystemTransactions"
        />
        <span class="mb-0.5">System Transactions</span>
      </label>
    </div>

    <div v-if="loading" class="flex items-center justify-center">
      <LoadingSpinner />
    </div>

    <div
      v-else-if="entries.length === 0"
      class="flex items-center justify-center py-2"
    >
      <span class="text-xl font-bold">No transactions available</span>
    </div>

    <div v-else class="flex flex-col overflow-auto">
      <TransactionsEntry v-for="entry in entries" :entry="entry" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TransactionEntry } from '~/types'

const showSystemTransactions = ref(false)

defineProps<{
  entries: Array<TransactionEntry>
  loading?: boolean
}>()
</script>
