<template>
  <div class="flex h-fit items-center space-x-1">
    <IconButton light mnemonic="s" @click="saveEdits">
      <CheckIcon v-if="!savingEdit" class="h-5 w-5 stroke-2" />
      <ArrowPathIcon v-else class="mr-0.5 h-5 w-5 animate-spin stroke-2" />
      <template #text><u>S</u>ave Edits</template>
    </IconButton>

    <IconButton light mnemonic="c" @click="cancelEdit">
      <XMarkIcon class="h-5 w-5 stroke-2" />
      <template #text><u>C</u>ancel</template>
    </IconButton>
  </div>
</template>

<script setup lang="ts">
import { useExamineStore } from '~/store/examine'
import { ArrowPathIcon, CheckIcon, XMarkIcon } from '@heroicons/vue/24/outline'
import { Status } from '~/enums/nr-status'

const examine = useExamineStore()

const savingEdit = ref(false)

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
