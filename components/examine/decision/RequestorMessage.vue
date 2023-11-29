<template>
  <div class="flex basis-1/2 flex-col space-y-2">
    <div class="flex justify-between">
      <header class="font-semibold">
        Message To Requestor
        <span
          v-if="examine.requestMessageEdited"
          class="font-bold text-red-600"
        >
          (Edited)
        </span>
      </header>
      <div class="flex space-x-1">
        <IconButton
          v-if="examine.requestMessageEdited"
          white
          class="h-7"
          text="Clear"
          @click="clearEdits"
        >
          <BackspaceIcon class="h-5 w-5" />
        </IconButton>
        <IconButton
          white
          class="h-7"
          text="Edit"
          @click="showEditRequestorMessageDialog = true"
        >
          <PencilSquareIcon class="h-5 w-5" />
        </IconButton>
      </div>
    </div>
    <EditableTextBox
      class="grow"
      v-model="decisionMessage"
      readonly
      disable-buttons
      :character-limit="characterLimit"
    />
    <span
      v-if="decisionMessage.length > characterLimit"
      class="text-sm font-bold text-red-600"
    >
      Message cut off at {{ characterLimit }} characters
    </span>
  </div>

  <PopupDialog title="Edit Message" :show="showEditRequestorMessageDialog">
    <div class="flex flex-col">
      <EditableTextBox
        class="h-72"
        v-model="decisionMessageForEdit"
        :character-limit="characterLimit"
        @submit="onRequestorMessageEdit"
        @cancel="showEditRequestorMessageDialog = false"
      />

      <span
        v-if="decisionMessageForEdit.length > characterLimit"
        class="text-sm font-bold text-red-600"
      >
        Message cut off at {{ characterLimit }} characters
      </span>
    </div>
  </PopupDialog>
</template>

<script setup lang="ts">
import { useExamineStore } from '~/store/examine'
import { BackspaceIcon, PencilSquareIcon } from '@heroicons/vue/24/outline'

const examine = useExamineStore()

const decisionMessage = ref('COOPERATIVE - ')
const decisionMessageForEdit = ref(decisionMessage.value)
const characterLimit = 955
const showEditRequestorMessageDialog = ref(false)

function onRequestorMessageEdit(_text: string) {
  showEditRequestorMessageDialog.value = false
  examine.requestMessageEdited = true
  decisionMessage.value = decisionMessageForEdit.value
}

function clearEdits() {
  examine.requestMessageEdited = false
  decisionMessage.value = ''
  decisionMessageForEdit.value = ''
}
</script>
