<template>
  <div class="flex flex-col">
    <Accordion
      v-for="list in conflictLists"
      :arrow="list.children.length > 0"
      :disabled="list.children.length === 0"
    >
      <template #title>
        <div class="flex w-full font-medium">
          <span v-html="list.highlightedText"></span>
          <span class="grow italic">&nbsp;- {{ list.meta.toLowerCase() }}</span>
          <span v-if="list.children.length > 0">
            {{ list.children.length }}
          </span>
        </div>
      </template>
      <template #content>
        <ExamineRecipeConflictsList :conflict-items="list.children" />
      </template>
    </Accordion>
  </div>
</template>

<script setup lang="ts">
/**
 * A conflicts bucket that holds a list of conflict lists
 */
import type { ConflictList } from '~/types'

defineProps<{
  conflictLists: Array<ConflictList>
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
