<template>
  <History v-if="nr" :nr="nr">
    notifications
  </History>
</template>

<script setup lang="ts">
import type { NameRequest } from '~/types'
import { getNameRequest } from '~/util/namex-api'

useHead({ title: 'BC Registry: Name Examination - Notification History' })

definePageMeta({ layout: 'empty' })

const nr = ref<NameRequest>()

onMounted(async () => {
  const route = useRoute()
  const nrParam = route.query.nr as string
  nr.value = await (await getNameRequest(`NR ${nrParam}`)).json()
})
</script>
