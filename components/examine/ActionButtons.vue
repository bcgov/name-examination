<template>
  <div
    v-if="examine.headerState === 'editable'"
    class="flex h-fit items-center space-x-1"
  >
    <IconButton light mnemonic="s">
      <CheckIcon class="h-5 w-5 stroke-2" />
      <template #text><u>S</u>ave Edits</template>
    </IconButton>

    <IconButton light text="Cancel" @click="examine.headerState = 'minimized'">
      <XMarkIcon class="h-5 w-5 stroke-2" />
    </IconButton>
  </div>

  <div v-else class="flex items-center space-x-1">
    <IconButton light @click="examine.headerState = 'editable'" mnemonic="d">
      <PencilSquareIcon class="h-5 w-5 stroke-2" />
      <template #text>E<u>d</u>it Request</template>
    </IconButton>

    <IconButton
      light
      @click="
        examine.headerState =
          examine.headerState === 'minimized' ? 'maximized' : 'minimized'
      "
      mnemonic="b"
    >
      <ArrowsPointingInIcon
        v-if="examine.headerState === 'maximized'"
        class="h-5 w-5 stroke-2"
      />
      <ArrowsPointingOutIcon v-else class="h-5 w-5 stroke-2" />

      <template #text v-if="examine.headerState === 'maximized'"
        >Hide Details (<u>b</u>)</template
      >
      <template #text v-else>Show Details (<u>b</u>)</template>
    </IconButton>

    <div v-if="!examine.inProgress" class="space-x-1">
      <IconButton light mnemonic="n">
        <ChevronDoubleRightIcon class="h-5 w-5 stroke-2" />
        <template #text>Get&nbsp;<u>N</u>ext</template>
      </IconButton>

      <IconButton
        light
        text="Cancel Request"
        @click="showCancelRequestDialog = true"
      >
        <XMarkIcon class="h-5 w-5 stroke-2" />
      </IconButton>

      <IconButton
        light
        @click="examine.inProgress = !examine.inProgress"
        mnemonic="x"
      >
        <DocumentCheckIcon class="h-5 w-5 stroke-2" />
        <template #text>E<u>x</u>amine</template>
      </IconButton>
    </div>

    <IconButton v-else light @click="examine.inProgress = false" mnemonic="h">
      <PauseIcon class="h-5 w-5 stroke-2" />
      <template #text><u>H</u>old Request</template>
    </IconButton>

    <PopupDialog title="Cancel Name Request" :show="showCancelRequestDialog">
      <ExamineCancelRequestForm @cancel="showCancelRequestDialog = false" />
    </PopupDialog>
  </div>
</template>

<script setup lang="ts">
import {
  ArrowsPointingInIcon,
  ArrowsPointingOutIcon,
  CheckIcon,
  ChevronDoubleRightIcon,
  DocumentCheckIcon,
  PauseIcon,
  PencilSquareIcon,
  XMarkIcon,
} from '@heroicons/vue/24/outline'
import { useExamineStore } from '~/store/examine'

const examine = useExamineStore()
const showCancelRequestDialog = ref(false)
</script>

<style scoped>
u {
  margin: 0 !important;
}
</style>
