<template>
  <div class="flex flex-col space-y-1">
    <ExamineRecipeConflictsListItem
      v-for="item in conflictItems"
      :key="item.nrNumber"
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
</script>
