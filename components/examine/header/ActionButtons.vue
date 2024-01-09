<template>
  <div v-if="examine.is_editing" class="flex h-fit items-center space-x-1">
    <IconButton light mnemonic="s" @click="saveEdits">
      <CheckIcon v-if="!savingEdit" class="h-5 w-5 stroke-2" />
      <ArrowPathIcon v-else class="h-5 w-5 stroke-2 animate-spin mr-0.5"/>
      <template #text><u>S</u>ave Edits</template>
    </IconButton>

    <IconButton light mnemonic="c" @click="cancelEdit">
      <XMarkIcon class="h-5 w-5 stroke-2" />
      <template #text><u>C</u>ancel</template>
    </IconButton>
  </div>

  <div v-else class="flex items-center space-x-1">
    <IconButton v-if="canEdit && showButtons" light @click="edit" mnemonic="d">
      <PencilSquareIcon class="h-5 w-5 stroke-2" />
      <template #text>E<u>d</u>it Request</template>
    </IconButton>

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

    <IconButton
      v-if="!examine.inProgress || examine.is_complete"
      light
      mnemonic="n"
    >
      <ChevronDoubleRightIcon class="h-5 w-5 stroke-2" />
      <template #text>Get&nbsp;<u>N</u>ext</template>
    </IconButton>

    <IconButton
      v-if="!examine.inProgress && !examine.is_complete"
      light
      text="Cancel Request"
      @click="showCancelRequestDialog = true"
    >
      <XMarkIcon class="h-5 w-5 stroke-2" />
    </IconButton>

    <div v-if="!examine.is_complete" class="space-x-1">
      <IconButton
        v-if="!examine.inProgress"
        light
        @click="examine.inProgress = true"
        mnemonic="x"
      >
        <DocumentCheckIcon class="h-5 w-5 stroke-2" />
        <template #text>E<u>x</u>amine</template>
      </IconButton>

      <IconButton v-else light @click="examine.inProgress = false" mnemonic="h">
        <PauseIcon class="h-5 w-5 stroke-2" />
        <template #text><u>H</u>old Request</template>
      </IconButton>
    </div>

    <div v-if="examine.is_complete" class="space-x-1">
      <IconButton
        v-if="examine.isFurnished"
        light
        text="Reopen"
        @click="examine.is_complete = false"
      >
        <PowerIcon class="h-5 w-5 stroke-2" />
      </IconButton>

      <IconButton v-else light text="Reset">
        <ArrowUturnLeftIcon class="h-5 w-5 stroke-2" />
      </IconButton>
    </div>

    <PopupDialog title="Cancel Name Request" :show="showCancelRequestDialog">
      <ExamineCancelRequestForm
        @submit="showCancelRequestDialog = false"
        @cancel="showCancelRequestDialog = false"
      />
    </PopupDialog>
  </div>
</template>

<script setup lang="ts">
import {
ArrowPathIcon,
  ArrowUturnLeftIcon,
  ArrowsPointingInIcon,
  ArrowsPointingOutIcon,
  CheckIcon,
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

const canEdit = computed(() => {
  if (examine.consumptionDate) return false
  if (examine.is_my_current_nr) return true
  return (
    examine.userHasEditRole &&
    [
      Status.Draft,
      Status.Hold,
      Status.Rejected,
      Status.Approved,
      Status.Conditional,
    ].includes(examine.nr_status)
  )
})

const savingEdit = ref(false)

function toggleDetails() {
  examine.is_header_shown = !examine.is_header_shown
}

function edit() {
  // if this isn't the user's INPROGRESS, make it that
  if (!examine.is_my_current_nr && !examine.isClosed) {
    // track the previous state if it's currently in DRAFT (otherwise do not)
    if (examine.nr_status == Status.Draft) {
      examine.updateNRStatePreviousState(Status.InProgress, Status.Draft)
    } else {
      examine.updateNRState(Status.InProgress)
    }
  }
  examine.is_editing = true
}

async function saveEdits() {
  savingEdit.value = true
  await examine.saveEdits()
  savingEdit.value = false
}

async function cancelEdit() {
  if (examine.previousStateCd === Status.Draft) {
    await examine.revertToPreviousState()
  } else {
    await examine.getpostgrescompInfo(examine.nrNumber)
  }
  examine.is_editing = false
  examine.is_header_shown = false
}
</script>

<style scoped>
u {
  margin: 0 !important;
}
</style>
