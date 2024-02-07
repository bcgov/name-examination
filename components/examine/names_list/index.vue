<template>
  <ol v-if="!examine.is_editing" class="list-decimal">
    <li v-for="choice in examine.nameChoices">
      <ExamineNamesListChoice
        :choice="choice"
        :decision-text="decisionReasonOrConflictList(choice)"
        :undoable="examine.isUndoable(choice)"
        :current="isCurrent(choice.choice)"
      />
    </li>
  </ol>

  <ExamineNamesListEditable v-else />
</template>

<script setup lang="ts">
import { useExamination } from '~/store/examine'
import type { NameChoice } from '~/types'
const examine = useExamination()

const isCurrent = (choice: number) => examine.currentChoice === choice

/**
 * Gets the decision reason(s) whether or not there's anything in the decision text field.
 * In some older NRs, there is no decision reason text. In these cases we want to display the list of conflicts instead
 */
function decisionReasonOrConflictList(name: NameChoice): string {
  if (examine.is_complete) {
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
