<template>
  <ol v-if="!examine.is_editing" class="list-decimal">
    <li v-for="choice in nameChoices">
      <ExamineNamesListChoice
        :choice="choice"
        :decision-text="decisionReasonOrConflictList(choice)"
        :undoable="examine.isUndoable(choice)"
        :current="isCurrent(choice.choice)"
      />
    </li>
  </ol>

  <ol v-else class="ml-4 basis-1/3 list-decimal space-y-2">
    <li v-for="choice in nameChoices"><TextInput :value="choice.name" /></li>
  </ol>
</template>

<script setup lang="ts">
import { useExamineStore } from '~/store/examine'
import type { NameChoice } from '~/types'
const examine = useExamineStore()

const nameChoices = [examine.compName1, examine.compName2, examine.compName3]

const isCurrent = (index: number) => examine.currentChoice === index

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
