<template>
  <ExamineHeaderEditActionButtons v-if="examine.is_editing" />

  <div v-else class="flex items-center space-x-1">
    <!-- Edit Button -->
    <IconButton
      v-if="examine.canEdit && showButtons"
      light
      @click="examine.edit"
      mnemonic="d"
    >
      <PencilSquareIcon class="h-5 w-5 stroke-2" />
      <template #text>E<u>d</u>it Request</template>
    </IconButton>

    <!-- Toggle Details Button -->
    <IconButton light @click="toggleDetails" mnemonic="b">
      <ArrowsPointingInIcon
        v-if="examine.is_header_shown"
        class="h-5 w-5 stroke-2"
      />
      <ArrowsPointingOutIcon v-else class="h-5 w-5 stroke-2" />

      <template #text v-if="examine.is_header_shown"
        >Hide Details (<u>b</u>)
      </template>
      <template #text v-else>Show Details (<u>b</u>)</template>
    </IconButton>

    <!-- Get Next Button -->
    <IconButton
      v-if="examine.userHasApproverRole && !examine.is_my_current_nr"
      @click="examine.getNextCompany"
      light
      mnemonic="n"
    >
      <ChevronDoubleRightIcon class="h-5 w-5 stroke-2" />
      <template #text>Get&nbsp;<u>N</u>ext</template>
    </IconButton>

    <!-- Cancel Request Button -->
    <IconButton
      v-if="examine.canCancel && showButtons"
      light
      text="Cancel Request"
      @click="showCancelDialog"
    >
      <XMarkIcon class="h-5 w-5 stroke-2" />
    </IconButton>

    <!-- Hold Button -->
    <IconButton
      v-if="examine.is_my_current_nr"
      light
      @click="examine.holdRequest"
      mnemonic="h"
    >
      <PauseIcon class="h-5 w-5 stroke-2" />
      <template #text><u>H</u>old Request</template>
    </IconButton>

    <div v-if="showReopenAndResetButtons && showButtons" class="space-x-1">
      <!-- Reopen (unfurnished) Button -->
      <IconButton
        v-if="examine.furnished === 'N'"
        light
        text="Reopen"
        @click="examine.reOpen"
      >
        <PowerIcon class="h-5 w-5 stroke-2" />
      </IconButton>

      <!-- Reset (from furnished) Button -->
      <IconButton v-else @click="examine.resetNr" light text="Reset">
        <ArrowUturnLeftIcon class="h-5 w-5 stroke-2" />
      </IconButton>
    </div>

    <!-- Examine Button -->
    <IconButton
      v-if="examine.canClaim && showButtons"
      light
      @click="examine.claimNr"
      mnemonic="x"
    >
      <DocumentCheckIcon class="h-5 w-5 stroke-2" />
      <template #text>E<u>x</u>amine</template>
    </IconButton>

    <PopupDialog :show="showCancelRequestDialog">
      <template #title>Cancel Name Request</template>
      <ExamineCancelRequestForm
        @submit="showCancelRequestDialog = false"
        @cancel="showCancelRequestDialog = false"
      />
    </PopupDialog>
  </div>
</template>

<script setup lang="ts">
import {
  ArrowUturnLeftIcon,
  ArrowsPointingInIcon,
  ArrowsPointingOutIcon,
  ChevronDoubleRightIcon,
  DocumentCheckIcon,
  PauseIcon,
  PencilSquareIcon,
  PowerIcon,
  XMarkIcon,
} from '@heroicons/vue/24/outline'
import { Status } from '~/enums/nr-status'
import { useExamineStore } from '~/store/examine'

const examine = useExamineStore()
const showCancelRequestDialog = ref(false)

const showButtons = computed(
  () =>
    ![Status.Historical, Status.ConditionalReserved, Status.Reserved].includes(
      examine.nr_status
    ) && !examine.consumptionDate
)

const showReopenAndResetButtons = computed(
  () =>
    examine.userHasEditRole &&
    examine.is_complete &&
    examine.nr_status !== Status.Cancelled &&
    !examine.isApprovedAndExpired
)

function toggleDetails() {
  examine.is_header_shown = !examine.is_header_shown
}

function showCancelDialog() {
  showCancelRequestDialog.value = true
}
</script>

<style scoped>
u {
  margin: 0 !important;
}
</style>
