<template>
  <div class="flex basis-1/2 flex-col space-y-2">
    <div class="flex justify-between">
      <header class="font-semibold">
        Message To Requestor
        <span
          v-if="examine.customerMessageOverride"
          class="font-bold text-red-600"
        >
          (Edited)
        </span>
      </header>
      <div class="flex space-x-1">
        <IconButton
          v-if="examine.customerMessageOverride"
          white
          class="h-7"
          text="Clear"
          @click="clearEdits"
        >
          <BackspaceIcon class="h-5 w-5" />
        </IconButton>
        <IconButton white class="h-7" text="Edit" @click="showEditDialog()">
          <PencilSquareIcon class="h-5 w-5" />
        </IconButton>
      </div>
    </div>
    <EditableTextBox
      class="grow"
      v-model="requestorMessage"
      readonly
      disable-buttons
      :character-limit="characterLimit"
    />
    <span
      v-if="requestorMessage.length > characterLimit"
      class="text-sm font-bold text-red-600"
    >
      Message cut off at {{ characterLimit }} characters
    </span>
  </div>

  <PopupDialog title="Edit Message" :show="showEditRequestorMessageDialog">
    <div class="flex flex-col">
      <EditableTextBox
        class="h-72"
        v-model="customerMessageOverrideTemp"
        :character-limit="characterLimit"
        @submit="onRequestorMessageSubmit()"
        @cancel="onRequestorMessageCancel()"
      />

      <span
        v-if="customerMessageOverrideTemp!.length > characterLimit"
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

const requestorMessage = computed(() => {
  if (examine.customerMessageOverride) {
    return examine.customerMessageOverride
  } else {
    return examine.requestorMessageStrings.join('\n\n')
  }
})

const characterLimit = 955
const showEditRequestorMessageDialog = ref(false)

const customerMessageOverrideTemp = ref(examine.customerMessageOverride)

function showEditDialog() {
  showEditRequestorMessageDialog.value = true
  customerMessageOverrideTemp.value = requestorMessage.value
}

function onRequestorMessageSubmit() {
  showEditRequestorMessageDialog.value = false
  if (customerMessageOverrideTemp.value !== requestorMessage.value)
    examine.customerMessageOverride = customerMessageOverrideTemp.value
}

function onRequestorMessageCancel() {
  showEditRequestorMessageDialog.value = false
}

function clearEdits() {
  examine.customerMessageOverride = undefined
}
</script>
