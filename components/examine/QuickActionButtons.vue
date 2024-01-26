<template>
  <div class="flex h-9 space-x-1">
    <IconButton white class="border-none" @click="quickApprove">
      <CheckCircleIcon class="h-7 w-7 text-lime-600" />
      <template #text>Quick Approve</template>
    </IconButton>

    <IconButton
      white
      class="border-none"
      mnemonic="i"
      @click="rejectDistinctive"
    >
      <XCircleIcon class="h-7 w-7 text-bcgov-blue3" />
      <template #text>Reject D<u>i</u>stinctive</template>
    </IconButton>

    <IconButton
      white
      class="border-none"
      mnemonic="e"
      @click="rejectDescriptive"
    >
      <XCircleIcon class="h-7 w-7 text-bcgov-blue3" />
      <template #text>Reject D<u>e</u>scriptive</template>
    </IconButton>
  </div>
</template>

<script setup lang="ts">
import { CheckCircleIcon, XCircleIcon } from '@heroicons/vue/24/solid'
import { Status } from '~/enums/nr-status'
import { useExamineStore } from '~/store/examine.mock'
const examine = useExamineStore()

async function quickApprove() {
  if (examine.consentRequiredByUser) {
    examine.forceConditional = true
    await examine.makeDecision(Status.Approved)
  } else {
    examine.selectedConflicts = []
    await examine.makeQuickDecision(Status.Approved, '')
  }
}

async function rejectDescriptive() {
  await examine.makeQuickDecision(
    Status.Rejected,
    'Require descriptive second word or phrase * E.G. Construction, Gardening, Investments, Holdings, Etc.'
  )
}

async function rejectDistinctive() {
  await examine.makeQuickDecision(
    Status.Rejected,
    "Require distinctive, nondescriptive first word or prefix * E.G. Person's name, initials, geographic location, etc."
  )
}
</script>

<style scoped>
u {
  margin: 0 !important;
}
</style>
