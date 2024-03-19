<template>
  <div class="flex flex-col space-y-1">
    <ExamineRecipeConflictsListItem
      class="target-detail"
      :key="item.nrNumber"
      v-for="item in conflictItems"
      :conflict-item="item"
    />
  </div>
</template>

<script setup lang="ts">
import ExamineRecipeConflictsListItem from '~/components/examine/recipe/conflicts/ListItem.vue'
import type { ConflictListItem } from '~/types'

defineProps<{
  conflictItems: Array<ConflictListItem>
}>()

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
