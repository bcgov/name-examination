<template>
  <div class="flex p-4">
    <ol v-if="examine.headerState !== 'editable'" class="ml-4 list-decimal">
      <li>
        <div class="flex items-center gap-x-1">
          <span>FIRST NAME CHOICE</span>
          <IconButton white text="Undo Decision" class="border-none text-sm">
            <XMarkIcon class="h-5 w-5 text-red-600" />
          </IconButton>
        </div>
      </li>
      <li class="font-bold">SECOND NAME CHOICE</li>
      <li>THIRD NAME CHOICE</li>
    </ol>

    <ol v-else class="ml-4 basis-1/3 list-decimal space-y-2">
      <li><TextInput value="FIRST NAME CHOICE" /></li>
      <li><TextInput value="SECOND NAME CHOICE" /></li>
      <li><TextInput value="THIRD NAME CHOICE" /></li>
    </ol>

    <div
      v-if="examine.headerState !== 'editable'"
      class="ml-auto flex h-9 space-x-2"
    >
      <IconButton white class="border-none">
        <CheckCircleIcon class="h-7 w-7 text-lime-600" />
        <template #text><u>Q</u>uick Approve</template>
      </IconButton>

      <IconButton white class="border-none">
        <XCircleIcon class="h-7 w-7 text-bcgov-blue3" />
        <template #text>Reject D<u>i</u>stinctive</template>
      </IconButton>

      <IconButton white class="border-none">
        <XCircleIcon class="h-7 w-7 text-bcgov-blue3" />
        <template #text>Reject D<u>e</u>scriptive</template>
      </IconButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { XMarkIcon } from '@heroicons/vue/24/outline'
import { CheckCircleIcon, XCircleIcon } from '@heroicons/vue/24/solid'
import { useExamineStore } from '~/store/examine'
const examine = useExamineStore()
</script>

<style scoped>
u {
  margin: 0 !important;
}
</style>
