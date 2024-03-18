<template>
  <div class="flex flex-col space-y-1" @keyup="handleKeyPress">
    <ExamineRecipeConflictsListItem
      ref="items"
      class="conflict-details"
      v-for="item in conflictItems"
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

const items = ref<Array<InstanceType<typeof ExamineRecipeConflictsListItem>>>(
  []
)
const focused = ref(0)

function handleKeyPress(event: KeyboardEvent) {
  console.log(event)
}

onMounted(() => {
  const focusedElem = items.value[focused.value].$el as HTMLDetailsElement
  focusedElem.focus()
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
