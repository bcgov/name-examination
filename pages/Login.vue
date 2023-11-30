<template>
  <div class="mt-20 flex grow justify-center">
    <p class="px-3 text-3xl font-bold">
      Your authorization is missing or has expired. Please login.
    </p>
  </div>
</template>

<script setup lang="ts">
import { Routes } from '~/enums/routes'

definePageMeta({
  auth: {
    unauthenticatedOnly: true,
    navigateAuthenticatedTo: Routes.Home,
  },
  layout: 'login',
})
</script>
