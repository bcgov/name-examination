<template>
  <div class="flex h-full w-full flex-col space-y-2">
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
          <ComboSelect
            v-model="selectedTrademarks"
            :options="computed(() => [])"
            multiple
          />
        </div>

        <div>
          <span class="font-semibold">Macros</span>
          <ComboSelect
            v-model="selectedMacros"
            :options="computed(() => [])"
            multiple
          />
        </div>

        <div>
          <span class="font-semibold">Conflicts</span>
          <ComboSelect
            v-model="selectedConflicts"
            :options="computed(() => [])"
            multiple
          />
        </div>

        <div class="flex flex-col space-y-1">
          <span class="font-semibold">Conditions</span>
          <ComboSelect
            v-model="selectedConditions"
            :options="computed(() => [])"
            multiple
          />
          <Chips v-model="selectedConditions"/>
        </div>
      </div>

      <div class="flex basis-1/2 flex-col">
        <div class="flex justify-between">
          <header class="font-semibold">Message To Requestor</header>
          <IconButton
            white
            class="ml-auto h-6 border-none !bg-transparent !text-bcgov-blue3"
            text="Edit"
          >
            <PencilSquareIcon class="h-5 w-5" />
          </IconButton>
        </div>
        <textarea
          readonly
          class="mt-1 h-full w-full resize-none rounded-t-md border border-b-0 border-gray-300 p-2 text-sm outline-none"
        />
        <p
          class="block rounded-b-md border border-t-0 border-gray-300 bg-white p-2 text-sm text-gray-400"
        >
          Characters Remaining: 955
        </p>
      </div>
    </div>

    <div class="!mt-20 flex">
      <IconButton light class="!bg-lime-600" mnemonic="a">
        <CheckIcon class="h-5 w-5 stroke-2" />
        <template #text><u>A</u>pprove Name</template>
      </IconButton>

      <IconButton light class="ml-auto" mnemonic="r">
        <XMarkIcon class="h-5 w-5 stroke-2" />
        <template #text><u>R</u>eject Name</template>
      </IconButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  CheckIcon,
  PencilSquareIcon,
  XMarkIcon,
} from '@heroicons/vue/24/outline'

const selectedConditions = ref(['Cooperative'])
const selectedConflicts = ref([])
const selectedMacros = ref([])
const selectedTrademarks = ref([])
</script>
