<template>
  <div class="flex">
    <header class="text-2xl font-bold">Decision</header>

    <label class="ml-auto flex items-center space-x-1" for="consent">
      <input
        class="h-4 w-4"
        type="checkbox"
        v-model="examine.consentRequiredByUser"
      />
      <span>Consent</span>
    </label>
  </div>
</template>

<script setup lang="ts">
import { useExamineStore } from '~/store/examine'
const examine = useExamineStore()
</script>
