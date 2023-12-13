<template>
  <div>
    <header class="font-semibold">Conflicts</header>
    <ListSelect
      v-model="examine.selectedConflicts"
      :options="options"
      multiple
      options-style="!max-h-48"
      :options-display="(option: Conflict | ConflictListItem) => option.text"
      :disabled="examine.decisionSelectionsDisabled"
    >
      <Chips
        v-if="examine.selectedConflicts.length > 0"
        v-model="examine.selectedConflicts"
        :display="(conflict: Conflict) => conflict.text"
      />
      <template #no-data>
        {{
          examine.conflictsAutoAdd
            ? 'No conflicts'
            : 'No conflicts selected (and auto add is off)'
        }}
      </template>
    </ListSelect>
  </div>
</template>

<script setup lang="ts">
import { useExamineStore } from '~/store/examine'
import type { Conflict, ConflictListItem } from '~/types'
const examine = useExamineStore()

const options = computed<Array<Conflict | ConflictListItem>>(() => {
  if (!examine.conflictsAutoAdd) {
    return examine.comparedConflicts
  }

  const allConflicts = [
    ...examine.exactMatchesConflicts,
    ...examine.parsedSynonymConflicts.map((c) => c.children).flat(),
    ...examine.parsedCOBRSConflicts.map((c) => c.children).flat(),
    ...examine.parsedPhoneticConflicts.map((c) => c.children).flat(),
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
