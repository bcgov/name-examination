<template>
  <div class="flex flex-col">
    <Accordion
      v-for="list in conflictLists"
      :arrow="list.children.length > 0"
      :disabled="list.children.length === 0"
    >
      <template #title>
        <div class="flex w-full font-medium">
          <HighlightedSubText :text="list.text" :start="0" :end="3" />
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
