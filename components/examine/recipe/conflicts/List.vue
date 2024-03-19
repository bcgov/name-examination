<template>
  <div class="flex flex-col space-y-1">
    <ExamineRecipeConflictsListItem
      ref="items"
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
const itemElements = computed(() =>
  items.value.map((i) => i.$el as HTMLDetailsElement)
)

onMounted(() => {
  // close all other list items (which are <details> elements) when one is clicked
  for (const targetDetail of itemElements.value) {
    targetDetail.addEventListener('click', () => {
      for (const detail of itemElements.value) {
        if (detail !== targetDetail) {
          detail.removeAttribute('open')
        }
      }
    })
  }
})
</script>
