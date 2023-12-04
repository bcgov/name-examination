<template>
  <div>
    <header class="font-semibold">Macros</header>
    <ListSelect
      v-model="selectedMacros"
      :options="[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]"
      multiple
      options-style="!max-h-48"
      :disabled="examine.decisionSelectionsDisabled"
    >
      <Chips v-if="selectedMacros.length > 0" v-model="selectedMacros" />
    </ListSelect>
  </div>
</template>

<script setup lang="ts">
import { useExamineStore } from '~/store/examine'

const examine = useExamineStore()

const selectedMacros = ref([])
</script>
