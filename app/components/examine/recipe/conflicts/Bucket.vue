<template>
  <div class="flex flex-col space-y-1">
    <div class="rounded bg-gray-200 p-2 text-sm font-semibold">
      {{ title }}
    </div>
    <div class="px-1">
      <div v-if="conflictItems" class="flex flex-col space-y-1">
        <ExamineRecipeConflictsListItem
          v-if="conflictItems.length > 0"
          v-for="item in conflictItems"
          :key="item.nrNumber"
          :conflict-item="item"
        />
        <span v-else class="px-1 italic">No results</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * A conflicts bucket that displays a list of conflict lists, or a list of conflict items
 */
import type { ConflictListItem } from '~/types'

defineProps<{
  title: string
  /** If a list of `ConflictListItem`s is provided, it will be displayed instead of the `ConflictList`s */
  conflictItems?: Array<ConflictListItem>
}>()
</script>
