<template>
  <h1>Notfications page</h1>
</template>

<script setup lang="ts">
const nrNumber = ref()

useHead({ title: 'BC Registry: Name Examination - Notification History' })

definePageMeta({ layout: 'empty' })

onMounted(() => {
  const route = useRoute()
  const nrParam = route.query.nr as string
  nrNumber.value = `NR ${nrParam}`
})
</script>
