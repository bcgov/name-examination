<template>
  <div class="flex flex-col">
    <div class="flex items-center">
      <span
        class="mr-2 flex flex-col"
        :class="{
          'font-bold': (current || choiceApproved) && highlight,
          'text-bcgov-blue3': choiceApproved && highlight,
        }"
      >
        {{ choice.name }}
      </span>

      <CheckIcon v-if="choiceApproved" class="h-5 w-5 text-lime-600" />
      <XMarkIcon
        v-else-if="choice.state === Status.Rejected"
        class="h-5 w-5 text-red-600"
      />

      <IconButton
        v-if="undoable"
        @click="undo?.(choice)"
        white
        text="Undo Decision"
        class="border-none text-sm text-blue-800"
      />
    </div>

    <span
      class="max-w-1/2 text-sm"
      :class="{
        'text-[#1359A0]': choiceApproved,
      }"
    >
      {{ choice.decision_text }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { CheckIcon, XMarkIcon } from '@heroicons/vue/24/outline'
import { Status } from '~/enums/nr-status'
import type { NameChoice } from '~/types'

const props = defineProps<{
  choice: NameChoice
  decisionText: string
  undoable?: boolean
  undo?: (choice: NameChoice) => Promise<void>
  current?: boolean
  highlight?: boolean
}>()

const choiceApproved = computed(
  () =>
    props.choice.state === Status.Approved ||
    props.choice.state === Status.Condition
)
</script>
