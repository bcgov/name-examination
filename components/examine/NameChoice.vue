<template>
  <div class="flex flex-col">
    <div class="flex items-center">
      <span
        class="mr-2 flex flex-col"
        :class="{
          'font-bold': current,
          'text-cyan-500':
            choice.state === 'APPROVED' || choice.state === 'CONDITION',
        }"
      >
        {{ choice.name }}
      </span>

      <CheckIcon
        v-if="choice.state === 'APPROVED' || choice.state === 'CONDITION'"
        class="h-5 w-5 text-lime-600"
      />
      <XMarkIcon
        v-else-if="choice.state === 'REJECTED'"
        class="h-5 w-5 text-red-600"
      />

      <IconButton
        v-if="undoable"
        @click="examine.undoDecision(choice)"
        white
        text="Undo Decision"
        class="border-none text-sm text-blue-800"
      />
    </div>

    <span class="max-w-1/2 text-sm">
      {{ choice.decision_text }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { CheckIcon, XMarkIcon } from '@heroicons/vue/24/outline'
import { useExamineStore } from '~/store/examine'
import type { NameChoice } from '~/types'

const examine = useExamineStore()

defineProps<{
  choice: NameChoice
  decisionText: string
  undoable?: boolean
  current?: boolean
}>()
</script>
