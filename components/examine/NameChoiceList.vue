<template>
  <ol v-if="!examine.is_editing" class="list-decimal">
    <li>
      <ExamineNameChoice
        :choice="examine.compName1"
        :decision-text="decisionReasonOrConflictList(examine.compName1)"
        :undoable="examine.isUndoable(examine.compName1)"
        :current="isCurrent(1)"
      />
    </li>
    <li>
      <ExamineNameChoice
        :choice="examine.compName2"
        :decision-text="decisionReasonOrConflictList(examine.compName2)"
        :undoable="examine.isUndoable(examine.compName2)"
        :current="isCurrent(2)"
      />
    </li>
    <li>
      <ExamineNameChoice
        :choice="examine.compName3"
        :decision-text="decisionReasonOrConflictList(examine.compName3)"
        :undoable="examine.isUndoable(examine.compName3)"
        :current="isCurrent(3)"
      />
    </li>
  </ol>

  <ol v-else class="ml-4 basis-1/3 list-decimal space-y-2">
    <li><TextInput :value="examine.compName1.name" /></li>
    <li><TextInput :value="examine.compName2.name" /></li>
    <li><TextInput :value="examine.compName3.name" /></li>
  </ol>
</template>

<script setup lang="ts">
import { useExamineStore } from '~/store/examine'
import type { NameChoice } from '~/types'
const examine = useExamineStore()

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
