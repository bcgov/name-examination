<!--eslint-disable -->
<template>
  <div class="w-10/12">
    <div
      v-if="!authModule.isAuthenticated"
      class="relative left-72 top-28 text-2xl font-semibold text-gray-800"
    >
      <p>Your authorization is missing or has expired. Please login.</p>
    </div>

    <HomePage
      v-else
    />
    </div>
</template>

<script setup>
/* eslint-disable vue/multi-word-component-names */
import { useAuthStore } from '../store/auth'
import HomePage from './HomePage.vue'

const authModule = useAuthStore()
</script>
