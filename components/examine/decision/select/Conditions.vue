<template>
  <div>
    <header class="font-semibold">Conditions</header>
    <ListSelect
      v-model="examine.selectedConditions"
      :options="['Cooperative']"
      :disabled="listSelectsDisabled"
      multiple
      options-style="!max-h-48"
    >
      <Chips
        v-if="examine.selectedConditions.length > 0"
        v-model="examine.selectedConditions"
      />
    </ListSelect>
  </div>
</template>

<script setup lang="ts">
import { useExamineStore } from '~/store/examine'

const examine = useExamineStore()

const listSelectsDisabled = computed(() => examine.requestMessageEdited)
</script>
