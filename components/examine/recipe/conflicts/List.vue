<template>
  <div class="flex flex-col space-y-1">
    <ExamineRecipeConflictsListItem
      v-for="item in conflictItems"
      :key="item.nrNumber"
      :conflict-item="item"
      :class="{ '!bg-sky-100': item === recipe.focused }"
      @toggled="(open) => $emit('toggled', item, open)"
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
  toggled: [conflict: ConflictListItem, open: boolean]
}>()

const recipe = useExaminationRecipe()
</script>
