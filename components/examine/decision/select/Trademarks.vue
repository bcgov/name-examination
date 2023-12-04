<template>
  <div>
    <header class="font-semibold">Trademarks</header>
    <ListSelect
      v-model="selectedTrademarks"
      :options="examine.trademarksJSON.names.map((t) => t.name)"
      multiple
      options-style="!max-h-40"
      :disabled="examine.decisionSelectionsDisabled"
    >
      <Chips
        v-if="selectedTrademarks.length > 0"
        v-model="selectedTrademarks"
      />
    </ListSelect>
  </div>
</template>

<script setup lang="ts">
import { useExamineStore } from '~/store/examine'

const examine = useExamineStore()

const selectedTrademarks = ref([])
</script>
