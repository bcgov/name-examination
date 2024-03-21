<template>
  <div class="flex flex-col">
    <Accordion
      v-for="list in conflictLists"
      :open="openLists.includes(list)"
      :arrow="list.children.length > 0"
      :disabled="list.children.length === 0"
      :button-style="{ 'bg-sky-100': list === recipe.focused }"
      @summary-clicked="$emit('selected', list)"
    >
      <template #title>
        <div class="flex w-full justify-between font-medium">
          <div>
            <span v-html="list.highlightedText"></span>
            <span v-if="list.meta" class="italic">
              &nbsp;&ndash;&nbsp;{{ list.meta.toLowerCase() }}
            </span>
          </div>
          <span v-if="list.children.length > 0">
            {{ list.children.length }}
          </span>
        </div>
      </template>
      <template #content>
        <ExamineRecipeConflictsList
          :conflict-items="list.children"
          @selected="(item) => $emit('selected', item)"
        />
      </template>
    </Accordion>
  </div>
</template>

<script setup lang="ts">
/**
 * A conflicts bucket that holds a list of conflict lists
 */
import { useExaminationRecipe } from '~/store/examine/recipe';
import type { ConflictList, ConflictListItem } from '~/types'
import { isConflictListItem } from '~/util'
import { emitter } from '~/util/emitter'

const props = defineProps<{
  conflictLists: Array<ConflictList>
  /** Index of the `ConflictList` that should be open initially. */
  initiallyOpen?: number
}>()

defineEmits<{
  selected: [obj: ConflictListItem | ConflictList]
}>()

const recipe = useExaminationRecipe()

const openLists = ref<Array<ConflictList>>([])

if (props.initiallyOpen) {
  openLists.value.push(props.conflictLists[props.initiallyOpen])
}

emitter.on('expandRecipeObject', (obj) => {
  if (!isConflictListItem(obj)) {
    openLists.value.push(obj)
  }
})

emitter.on('collapseRecipeObject', (obj) => {
  if (!isConflictListItem(obj)) {
    openLists.value = openLists.value.filter((x) => x !== obj)
  }
})

emitter.on('collapseAllConflictLists', () => {
  openLists.value = []
})
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
