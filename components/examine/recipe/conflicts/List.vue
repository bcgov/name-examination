<template>
  <div class="flex flex-col space-y-1">
    <ExamineRecipeConflictsListItem
      v-for="conflict in examine.conflicts"
      :conflict="conflict"
    />
  </div>
</template>

<script setup lang="ts">
import { useExamineStore } from '~/store/examine'
const examine = useExamineStore()

onMounted(() => {
  // close all other list items (which are <details> elements) when one is clicked
  const details = document.getElementsByClassName('conflict-details')
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
