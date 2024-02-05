<template>
  <div>
    <h3 class="font-semibold">Conflicts</h3>
    <ListSelect
      v-model="conflicts.selectedConflicts"
      :options="options"
      multiple
      options-style="!max-h-48"
      :options-display="(option: Conflict | ConflictListItem) => option.text"
      :disabled="examine.decisionSelectionsDisabled"
      @change="(_) => conflicts.syncSelectedAndComparedConflicts()"
    >
      <Chips
        v-if="conflicts.selectedConflicts.length > 0"
        v-model="conflicts.selectedConflicts"
        :display="(conflict: Conflict) => conflict.text"
        @chip-removed="conflicts.syncSelectedAndComparedConflicts()"
      />
      <template #no-data>
        {{
          conflicts.autoAdd
            ? 'No conflicts'
            : 'No conflicts selected (and auto add is off)'
        }}
      </template>
    </ListSelect>
  </div>
</template>

<script setup lang="ts">
import { useExamineStore } from '~/store/examine'
import { useConflicts } from '~/store/examine/conflicts';
import type { Conflict, ConflictListItem } from '~/types'

const examine = useExamineStore()
const conflicts = useConflicts()

const options = computed<Array<Conflict | ConflictListItem>>(() => {
  if (!conflicts.autoAdd) {
    return conflicts.comparedConflicts
  }

  const allConflicts = [
    ...conflicts.exactMatches,
    ...conflicts.synonymMatches.map((c) => c.children).flat(),
    ...conflicts.cobrsPhoneticMatches.map((c) => c.children).flat(),
    ...conflicts.phoneticMatches.map((c) => c.children).flat(),
  ]

  const seenNRs: Array<string> = []
  return allConflicts.filter((conflict) => {
    const alreadySeen = seenNRs.includes(conflict.nrNumber)
    if (!alreadySeen) {
      seenNRs.push(conflict.nrNumber)
      return true
    } else {
      return false
    }
  })
})
</script>
