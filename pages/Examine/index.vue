<template>
  <Examine />
</template>

<script setup lang="ts">
import { useExamineStore } from '~/store/examine'

useHead({ title: 'BC Registry: Name Examination - Examine Name Request' })

const examine = useExamineStore()

onMounted(async () => {
  const nrNumber = await examine.getpostgrescompNo()
  await examine.initialize(nrNumber)
})
</script>
