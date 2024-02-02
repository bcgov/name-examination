<template>
  <div>
    <h3 class="font-semibold">Macros</h3>
    <ListSelect
      multiple
      v-model="examine.selectedMacros"
      :disabled="examine.decisionSelectionsDisabled"
      :options="examine.macros"
      :options-display="(option: Macro) => option.name"
      options-style="!max-h-48"
    >
      <Chips
        v-if="examine.selectedMacros.length > 0"
        v-model="examine.selectedMacros"
        :display="(macro: Macro) => macro.name"
      />
    </ListSelect>
  </div>
</template>

<script setup lang="ts">
import { useExamineStore } from '~/store/examine'
import type { Macro } from '~/types'

const examine = useExamineStore()
</script>
