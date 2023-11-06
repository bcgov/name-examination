<template>
  <div class="flex flex-col space-y-2">
    <div class="flex">
      <header class="text-2xl font-bold">Decision</header>

      <label class="ml-auto flex items-center space-x-1" for="consent">
        <input class="h-4 w-4" type="checkbox" id="consent" />
        <span>Consent</span>
      </label>
    </div>

    <div class="rounded border border-gray-400 bg-sky-100 p-2 text-xs">
      <b>Coop &ndash;</b> Use Of This Term Is Restricted Under The Cooperative
      Association Act R.S.B.C. 1999 C. 28, and only given for a Cooperative.
    </div>

    <div class="!mt-4 flex space-x-2">
      <!-- Layout the combo selects in reverse so they don't overlap each other https://stackoverflow.com/a/77210506 -->
      <div class="flex basis-1/2 flex-col-reverse gap-y-8">
        <div>
          <span class="font-semibold">Trademarks</span>
          <ListSelect
            v-model="selectedTrademarks"
            :options="[]"
            multiple
            :disabled="listSelectsDisabled"
          >
            <Chips
              v-if="selectedTrademarks.length > 0"
              v-model="selectedTrademarks"
            />
          </ListSelect>
        </div>

        <div>
          <span class="font-semibold">Macros</span>
          <ListSelect
            v-model="selectedMacros"
            :options="[]"
            multiple
            :disabled="listSelectsDisabled"
          >
            <Chips v-if="selectedMacros.length > 0" v-model="selectedMacros" />
          </ListSelect>
        </div>

        <div>
          <span class="font-semibold">Conflicts</span>
          <ListSelect
            v-model="selectedConflicts"
            :options="[]"
            multiple
            :disabled="listSelectsDisabled"
          >
            <Chips
              v-if="selectedConflicts.length > 0"
              v-model="selectedConflicts"
            />
            <template #no-data>{{
              examine.autoAdd
                ? 'No conflicts'
                : 'No conflicts selected (and auto add is off)'
            }}</template>
          </ListSelect>
        </div>

        <div>
          <span class="font-semibold">Conditions</span>
          <ListSelect
            v-model="selectedConditions"
            :options="['Cooperative']"
            :disabled="listSelectsDisabled"
            multiple
          >
            <Chips
              v-if="selectedConditions.length > 0"
              v-model="selectedConditions"
            />
          </ListSelect>
        </div>
      </div>

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
        <!-- <span class="text-sm">
          Characters Remaining: {{ characterLimit - decisionMessage.length }}
        </span> -->
      </div>
    </div>

    <div class="grow" aria-hidden></div>

    <div class="flex justify-between justify-self-end">
      <IconButton
        light
        class="bg-lime-600"
        mnemonic="a"
        @click="examine.isComplete = true"
      >
        <CheckIcon class="h-5 w-5 stroke-2" />
        <template #text><u>A</u>pprove Name</template>
      </IconButton>

      <IconButton light mnemonic="r" @click="examine.isComplete = true">
        <XMarkIcon class="h-5 w-5 stroke-2" />
        <template #text><u>R</u>eject Name</template>
      </IconButton>
    </div>

    <PopupDialog title="Edit Message" :show="showEditRequestorMessageDialog">
      <EditableTextBox
        lazy-update
        v-model="decisionMessage"
        @submit="onRequestorMessageEdit"
        @cancel="showEditRequestorMessageDialog = false"
        :character-limit="characterLimit"
      />
    </PopupDialog>
  </div>
</template>

<script setup lang="ts">
import {
  BackspaceIcon,
  CheckIcon,
  PencilSquareIcon,
  XMarkIcon,
} from '@heroicons/vue/24/outline'
import { useExamineStore } from '~/store/examine'

const selectedConditions = ref(['Cooperative'])
const selectedConflicts = ref([])
const selectedMacros = ref([])
const selectedTrademarks = ref([])

const examine = useExamineStore()

const decisionMessage = ref('COOPERATIVE - ')
const characterLimit = 955

const showEditRequestorMessageDialog = ref(false)
const listSelectsDisabled = computed(() => examine.requestMessageEdited)

function onRequestorMessageEdit(_text: string) {
  showEditRequestorMessageDialog.value = false
  examine.requestMessageEdited = true
}

function clearEdits() {
  examine.requestMessageEdited = false
  decisionMessage.value = ''
}
</script>
