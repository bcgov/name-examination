<template>
  <div class="flex flex-col space-y-1">
    <ExamineRecipeConflictsListItem
      v-for="item in conflictItems"
      :key="item.nrNumber"
      :conflict-item="item"
      class="target-detail"
      :class="{ '!bg-sky-100': item === recipe.focused }"
      @click="$emit('selected', item)"
    />
  </div>
</template>

<script setup lang="ts">
import ExamineRecipeConflictsListItem from '~/components/examine/recipe/conflicts/ListItem.vue'
import { useExaminationRecipe } from '~/store/examine/recipe'
import type { ConflictListItem } from '~/types'

defineProps<{
  conflictItems: Array<ConflictListItem>
}>()

defineEmits<{
  selected: [conflict: ConflictListItem]
}>()

const recipe = useExaminationRecipe()

onMounted(() => {
  // close all other list items (which are <details> elements) when one is clicked
  const details = document.getElementsByClassName('target-detail')
  for (const targetDetail of details) {
    targetDetail.addEventListener('click', () => {
      for (const detail of details) {
        if (detail !== targetDetail) {
          detail.removeAttribute('open')
        }
      }
    })
  }
})
</script>
