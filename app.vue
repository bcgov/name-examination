<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
<script setup lang="ts">
import { useUserStore } from '~/store/user-cache'

const userStore = useUserStore()
await userStore.setUser()

</script>
