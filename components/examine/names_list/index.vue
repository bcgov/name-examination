<template>
  <ol class="list-decimal">
    <li v-for="choice in choices">
      <ExamineNamesListChoice
        :choice="choice"
        :decision-text="decisionReasonOrConflictList(choice)"
        :undoable="undoable?.(choice)"
        :undo="undo"
        :current="isCurrent(choice.choice)"
        :highlight="highlight"
      />
    </li>
  </ol>
</template>

<script setup lang="ts">
import type { NameChoice } from '~/types'

const props = defineProps<{
  choices: Array<NameChoice>
  /** Number representing the current selected choice (1, 2, 3) */
  currentChoice?: number
  /** Whether the NR containing the name choices is complete (e.g. Approved, Rejected...) */
  complete?: boolean
  /** Function that checks if a name choice is undoable. Will show an undo button next to the name choice. */
  undoable?: (choice: NameChoice) => boolean
  /** Function thats called when a user undos a name choice. */
  undo?: (choice: NameChoice) => Promise<void>
  /** Whether to highlight/bolden name choices for being the current name choice or accepted */
  highlight?: boolean
}>()

const isCurrent = (choice: number) => props.currentChoice === choice

/**
 * Gets the decision reason(s) whether or not there's anything in the decision text field.
 * In some older NRs, there is no decision reason text. In these cases we want to display the list of conflicts instead
 */
function decisionReasonOrConflictList(name: NameChoice): string {
  if (props.complete) {
    if (name.decision_text) {
      return name.decision_text
    } else {
      return getConflictList(name)
    }
  } else {
    return name.decision_text ? name.decision_text : ''
  }
}

function getConflictList(name: NameChoice): string {
  const conflicts = [name.conflict1, name.conflict2, name.conflict3]
    .filter((c) => c != null)
    .join(', ')
  return 'Rejected due to conflicts:\n' + conflicts
}
</script>
