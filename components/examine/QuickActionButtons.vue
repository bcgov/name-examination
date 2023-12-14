<template>
  <div class="flex h-9 space-x-1">
    <!-- A mnemonic is displayed but not implemented for this button since the Approve Name button in the 
    decision panel also has a mnemonic of 'a' and they will always appear on the screen at the same time,
    so only one of them needs to have a mnemonic attribute so the action doesn't trigger twice-->
    <IconButton white class="border-none" @click="quickApprove">
      <CheckCircleIcon class="h-7 w-7 text-lime-600" />
      <template #text>Quick&nbsp;<u>A</u>pprove</template>
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
import { useExamineStore } from '~/store/examine'
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
  // When this was written, the 16th index of listDecisionReasons was the string needed for a distinctive term missing
  // it was decided to HARD CODE this value until another solution is found
  // var distinctiveStr = this.listDecisionReasons[16].reason
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
