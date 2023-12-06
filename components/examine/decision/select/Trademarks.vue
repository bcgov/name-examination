<template>
  <div>
    <header class="font-semibold">Trademarks</header>
    <ListSelect
      v-model="examine.selectedTrademarks"
      multiple
      :options="examine.trademarksJSON.names"
      options-style="!max-h-40"
      :options-display="(trademark: Trademark) => trademark.name"
      :disabled="examine.decisionSelectionsDisabled"
    >
      <Chips
        v-if="examine.selectedTrademarks.length > 0"
        :display="(trademark: Trademark) => trademark.name"
        v-model="examine.selectedTrademarks"
      />
    </ListSelect>
  </div>
</template>

<script setup lang="ts">
import { useExamineStore } from '~/store/examine'
import type { Trademark } from '~/types'

const examine = useExamineStore()
</script>
