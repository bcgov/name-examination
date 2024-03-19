<template>
  <div class="flex flex-col">
    <Accordion
      v-for="(list, i) in conflictLists"
      :open="i === initiallyOpen"
      :arrow="list.children.length > 0"
      :disabled="list.children.length === 0"
      :button-style="{ 'bg-sky-100': list === focused }"
    >
      <template #title>
        <div class="flex w-full justify-between font-medium">
          <div>
            <span v-html="list.highlightedText"></span>
            <span v-if="list.meta" class="italic">
              &nbsp;- {{ list.meta.toLowerCase() }}
            </span>
          </div>
          <span v-if="list.children.length > 0">
            {{ list.children.length }}
          </span>
        </div>
      </template>
      <template #content>
        <ExamineRecipeConflictsList :conflict-items="list.children" :focused="focused" />
      </template>
    </Accordion>
  </div>
</template>

<script setup lang="ts">
/**
 * A conflicts bucket that holds a list of conflict lists
 */
import type { ConflictList, ConflictListItem } from '~/types'

defineProps<{
  conflictLists: Array<ConflictList>
  /** Index of the `ConflictList` that should be open initially. */
  initiallyOpen?: number
  /** Object that is currently focused in the recipe area */
  focused?: ConflictListItem | ConflictList
}>()
</script>

<style>
.stem-highlight {
  color: #28a745;
  font-weight: bold;
}

.synonym-stem-highlight {
  color: #e0a800;
  font-weight: bold;
}
</style>
