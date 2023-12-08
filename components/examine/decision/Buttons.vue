<template>
  <div class="flex justify-between justify-self-end">
    <IconButton light class="bg-lime-600" mnemonic="a" @click="approveName">
      <CheckIcon class="h-5 w-5 stroke-2" />
      <template v-if="examine.acceptanceWillBeConditional" #text>
        Conditionally <u>A</u>pprove
      </template>
      <template v-else #text><u>A</u>pprove Name</template>
    </IconButton>

    <IconButton light mnemonic="r" @click="rejectName">
      <XMarkIcon class="h-5 w-5 stroke-2" />
      <template #text><u>R</u>eject Name</template>
    </IconButton>
  </div>
</template>

<script setup lang="ts">
import { useExamineStore } from '~/store/examine'
import { CheckIcon, XMarkIcon } from '@heroicons/vue/24/outline'
import { Status } from '~/enums/nr-status'
const examine = useExamineStore()

async function approveName() {
  examine.decision_made = Status.Approved
  await nextTick()
}

async function rejectName() {
  examine.decision_made = Status.Rejected
  await nextTick()
}
</script>
