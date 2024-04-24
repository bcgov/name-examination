<template>
  <History v-if="notifications.nr" :nr="notifications.nr" include-recipient>
    <NotificationsList
      :entries="notifications.notifications"
      :loading="notifications.loading"
    />
  </History>
</template>

<script setup lang="ts">
import { useNotifications } from '~/store/notifications'
import { emitter } from '~/util/emitter'

useHead({ title: 'BC Registry: Name Examination - Notification History' })

definePageMeta({ layout: 'empty' })

const notifications = useNotifications()

onMounted(async () => {
  const route = useRoute()
  const nrParam = route.query.nr as string
  const nrNumber = `NR ${nrParam}`
  try {
    await notifications.initialize(nrNumber)
  } catch (e) {
    emitter.emit('error', {
      title: 'Failed to load notifications page',
      message: e as string,
    })
  }
})
</script>
