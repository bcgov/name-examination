<template>
  <div class="flex flex-col">
    <div class="flex justify-between bg-neutral-700 px-8 py-1 text-white">
      <span class="text-lg font-bold">Transaction History</span>
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
  </div>
</template>

<script setup lang="ts">
const showSystemTransactions = ref(false)
</script>
