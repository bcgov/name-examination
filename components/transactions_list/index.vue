<template>
  <div class="flex h-full flex-col overflow-y-auto">
    <div class="flex justify-between border-y-2 px-4 py-1">
      <span class="text-xl font-bold">{{ headerText }}</span>
      <label for="sys-transactions" class="flex items-center space-x-1">
        <input
          class="h-4 w-4"
          id="sys-transactions"
          type="checkbox"
          v-model="showSystemTransactions"
        />
        <span class="mb-0.5">Show system transactions</span>
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

    <div v-else class="flex flex-col overflow-y-auto">
      <TransactionsListEntry
        v-for="(entry, i) in filteredEntries"
        :key="entry.eventDate + entry.user_action + entry.stateCd"
        :entry="entry"
        :class="{ 'bg-neutral-100': i % 2 == 0 }"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TransactionEntry } from '~/types'

const props = defineProps<{
  entries: Array<TransactionEntry>
  loading?: boolean
}>()

const DEFAULT_TRANSACTIONS = [
  'Cancelled in Name Request',
  'Created NR (Payment Completed)',
  'Created NR (Unknown)',
  'Decision',
  'Edit NR Details (Name Request)',
  'Edit NR Details (NameX)',
  'Edit NR Details after Completion',
  'Marked on Hold',
  'Reapplied NR (Unknown)',
  'Reset',
  'Staff Comment',
]

const showSystemTransactions = ref(false)

const filteredEntries = computed(() =>
  showSystemTransactions.value
    ? props.entries
    : props.entries.filter((item) =>
        DEFAULT_TRANSACTIONS.includes(item.user_action)
      )
)

const headerText = computed(() => {
  const baseText = 'Transaction History'
  const count = filteredEntries.value.length
  if (count > 0) {
    const itemsText = `${count} item${count === 1 ? '' : 's'}`
    return `${baseText} (${itemsText})`
  } else {
    return baseText
  }
})
</script>
