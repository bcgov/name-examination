<template>
  <div>
    <h3 class="font-semibold">Conditions</h3>
    <ListSelect
      v-model="examine.selectedConditions"
      :options="options"
      :options-display="(condition: Condition) => condition.phrase"
      options-style="!max-h-48"
      :disabled="examine.decisionSelectionsDisabled"
      multiple
    >
      <Chips
        v-if="examine.selectedConditions.length > 0"
        v-model="examine.selectedConditions"
        :display="(condition: Condition) => condition.phrase"
      />
    </ListSelect>
  </div>
</template>

<script setup lang="ts">
import { useExamineStore } from '~/store/examine.mock'
import type { Condition } from '~/types'

const examine = useExamineStore()

const options = computed(() =>
  examine.parseConditions.filter((c) => c.instructions !== '')
)
</script>
