<template>
  <NuxtLayout>
    <NuxtLoadingIndicator color="#1669bb"/>
    <NuxtPage />
  </NuxtLayout>
</template>
<script setup lang="ts">
import { useUserStore } from '~/store/user-cache'

const userStore = useUserStore()
userStore.setUser()

</script>
