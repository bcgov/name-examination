<template>
  <TransactionsView v-if="nrNumber" :nr-number="nrNumber" />
  <span v-else>Invalid</span>
</template>

<script setup lang="ts">
const nrNumber = ref()

useHead({ title: 'BC Registry: Name Examination - Transactions' })

onMounted(() => {
  const route = useRoute()
  const nrParam = route.query.nr as string
  nrNumber.value = `NR ${nrParam}`
})
</script>
