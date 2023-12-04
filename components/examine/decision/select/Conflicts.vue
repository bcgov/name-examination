<template>
  <div>
    <header class="font-semibold">Conflicts</header>
    <ListSelect
      v-model="examine.selectedConflicts"
      :options="examine.conflicts"
      multiple
      options-style="!max-h-48"
      :options-display="(option: Conflict) => option.text"
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
import type { Conflict } from '~/types'
const examine = useExamineStore()
</script>
