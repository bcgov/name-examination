<template>
  <div>
    <header class="font-semibold">Trademarks</header>
    <ListSelect
      v-model="examine.selectedTrademarks"
      multiple
      :options="examine.trademarksJSON.names"
      options-style="!max-h-40"
      :options-display="displayTrademark"
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

const trademarkCounts = computed(() => {
  const counts: { [trademarkName: string]: number } = {}
  for (const trademark of examine.trademarksJSON.names) {
    if (trademark.name in counts) {
      counts[trademark.name] += 1
    } else {
      counts[trademark.name] = 1
    }
  }
  return counts
})

/**
 * Get the display string for a trademark object.
 * If there are multiple trademarks with the same name, append the application number.
 */
const displayTrademark = (trademark: Trademark) =>
  trademarkCounts.value[trademark.name] > 1
    ? `${trademark.name} (#${trademark.application_number})`
    : trademark.name
</script>
