<template>
  <div class="flex flex-col">
    <Accordion
      v-for="list in conflictLists"
      ref="listElems"
      :open="list.ui.open"
      :arrow="list.children.length > 0"
      :disabled="list.children.length === 0"
      :button-style="{ 'bg-sky-100': list.ui.focused }"
      @toggle="(e) => recipe.toggleObject(list, e.newState === 'open')"
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
        <ExamineRecipeConflictsList :conflict-items="list.children" />
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
import type { ConflictList } from '~/types'
import { isConflictList } from '~/util'
import { emitter } from '~/util/emitter'

const recipe = useExaminationRecipe()

const props = defineProps<{
  conflictLists: Array<ConflictList>
}>()

const listElems = ref<Array<InstanceType<typeof Accordion>>>([])

emitter.on('scrollToRecipeObject', (obj) => {
  if (isConflictList(obj) && props.conflictLists.includes(obj)) {
    const index = props.conflictLists.indexOf(obj)
    listElems.value[index].$el.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    })
  }
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
