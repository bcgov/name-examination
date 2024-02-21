<template>
  <div class="flex w-full space-x-2">
    <SearchInput
      v-model="searchString"
      class="grow"
      placeholder="name"
      @submit.prevent="onSearchSubmit"
      focus-mnemonic="s"
      :clear="examine.currentName ?? undefined"
      input-required
    />
    <SearchInput
      v-model="exactSearchString"
      placeholder="exact phrase"
      @submit.prevent="onSearchSubmit"
      clear=""
    />
  </div>
</template>

<script setup lang="ts">
import { useExamination } from '~/store/examine'

const examine = useExamination()

const searchString = ref(examine.currentName ?? '')
const exactSearchString = ref('')

function onSearchSubmit(_event: Event) {
  examine.runManualRecipe(searchString.value, exactSearchString.value)
}

watch(
  () => [examine.currentName],
  async (_state) => {
    searchString.value = examine.currentName ?? ''
    exactSearchString.value = ''
    await examine.runManualRecipe(searchString.value, exactSearchString.value)
  },
  { deep: true }
)
</script>
