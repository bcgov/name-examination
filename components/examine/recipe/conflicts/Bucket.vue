<template>
  <div class="flex flex-col">
    <Accordion
      v-for="list in conflictLists"
      ref="listElems"
      :open="openLists.includes(list)"
      :arrow="list.children.length > 0"
      :disabled="list.children.length === 0"
      :button-style="{ 'bg-sky-100': list === recipe.focused }"
      @summary-clicked="onListSummaryClick(list)"
      disable-default-open-behaviour
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
          @toggled="(item, open) => $emit('toggled', item, open)"
        />
      </template>
    </Accordion>
  </div>
</template>

<script setup lang="ts">
/**
 * A conflicts bucket that holds a list of conflict lists
 */
import Accordion from '~/components/Accordion.vue'
import { useExaminationRecipe } from '~/store/examine/recipe'
import type { ConflictList, ConflictListItem } from '~/types'
import { isConflictList, isConflictListItem } from '~/util'
import { emitter } from '~/util/emitter'

const props = defineProps<{
  conflictLists: Array<ConflictList>
  /** Index of the `ConflictList` that should be open initially. */
  initiallyOpen?: number
}>()

const emit = defineEmits<{
  toggled: [obj: ConflictListItem | ConflictList, open: boolean]
}>()

const recipe = useExaminationRecipe()

const listElems = ref<Array<InstanceType<typeof Accordion>>>([])
const openLists = ref<Array<ConflictList>>([])

function onListSummaryClick(list: ConflictList) {
  if (openLists.value.includes(list)) {
    openLists.value = openLists.value.filter((l) => l !== list)
  } else {
    openLists.value.push(list)
  }
  emit('toggled', list, openLists.value.includes(list))
}

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

emitter.on('scrollToRecipeObject', (obj) => {
  if (isConflictList(obj) && props.conflictLists.includes(obj)) {
    const index = props.conflictLists.indexOf(obj)
    listElems.value[index].$el.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    })
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
