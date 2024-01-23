<template>
  <div class="flex w-full space-x-2">
    <SearchInput
      v-model="searchString"
      class="grow"
      placeholder="name"
      @submit.prevent="onNormalSearchSubmit"
      focus-mnemonic="s"
    />
    <SearchInput
      v-model="exactSearchString"
      placeholder="exact phrase"
      @submit.prevent="onExactSearchSubmit"
    />
  </div>
</template>

<script setup lang="ts">
import { useExamineStore } from '~/store/examine'

const examine = useExamineStore()

const searchString = ref(examine.currentNameObj.name)
const exactSearchString = ref('')

function onNormalSearchSubmit(_event: Event) {
  runManualRecipe()
}

function onExactSearchSubmit(event: Event) {
  if (exactSearchString.value) {
    runManualRecipe()
  } else {
    event.preventDefault()
    event.stopImmediatePropagation()
  }
}

function runManualRecipe() {
  examine.resetExaminationArea()
  examine.runManualRecipe(searchString.value, exactSearchString.value)
}

watch(
  () => [examine.currentName],
  async (_state) => {
    searchString.value = examine.currentName
    exactSearchString.value = ''
  },
  { deep: true }
)
</script>
