<template>
  <div class="flex flex-col space-y-1">
    <ExamineRecipeConflictsListItem
      v-for="item in conflictItems"
      ref="itemElems"
      :key="item.nrNumber"
      :conflict-item="item"
      :class="{ '!bg-sky-100': item === recipe.focused }"
      @click="$emit('selected', item)"
    />
  </div>
</template>

<script setup lang="ts">
import ExamineRecipeConflictsListItem from '~/components/examine/recipe/conflicts/ListItem.vue'
import { useExaminationRecipe } from '~/store/examine/recipe'
import type { ConflictListItem } from '~/types'
import { isConflictListItem } from '~/util'

const props = defineProps<{
  conflictItems: Array<ConflictListItem>
}>()

defineEmits<{
  selected: [conflict: ConflictListItem]
}>()

const itemElems = ref<
  Array<InstanceType<typeof ExamineRecipeConflictsListItem>>
>([])
const recipe = useExaminationRecipe()

watch(
  () => [recipe.focused],
  (_) => {
    if (recipe.focused && isConflictListItem(recipe.focused)) {
      const index = props.conflictItems.indexOf(recipe.focused)
      if (index !== -1) {
        itemElems.value[index].$el.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        })
      }
    }
  }
)
</script>
