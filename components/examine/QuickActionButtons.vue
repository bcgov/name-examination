<template>
  <div class="flex h-9 space-x-1">
    <!-- A mnemonic is displayed but not implemented for this button since the Approve Name button in the 
    decision panel also has a mnemonic of 'a' and they will always appear on the screen at the same time,
    so only one of them needs to have a mnemonic attribute so the action doesn't trigger twice-->
    <IconButton white class="border-none" @click="examine.isComplete = true">
      <CheckCircleIcon class="h-7 w-7 text-lime-600" />
      <template #text>Quick&nbsp;<u>A</u>pprove</template>
    </IconButton>

    <IconButton
      white
      class="border-none"
      mnemonic="i"
      @click="examine.isComplete = true"
    >
      <XCircleIcon class="h-7 w-7 text-bcgov-blue3" />
      <template #text>Reject D<u>i</u>stinctive</template>
    </IconButton>

    <IconButton
      white
      class="border-none"
      mnemonic="e"
      @click="examine.isComplete = true"
    >
      <XCircleIcon class="h-7 w-7 text-bcgov-blue3" />
      <template #text>Reject D<u>e</u>scriptive</template>
    </IconButton>
  </div>
</template>

<script setup lang="ts">
import { CheckCircleIcon, XCircleIcon } from '@heroicons/vue/24/solid'
import { useExamineStore } from '~/store/examine'
const examine = useExamineStore()
</script>

<style scoped>
u {
  margin: 0 !important;
}
</style>
