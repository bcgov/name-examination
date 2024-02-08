<template>
  <div v-if="isLoading" class="flex items-center justify-center">
    <LoadingSpinner />
  </div>
  <div v-else-if="conflictData">
    <ExamineRecipeMatchNames
      v-if="conflict.source === 'NR'"
      :conflict="(conflictData as NameRequest)"
    />
    <ExamineRecipeMatchBCCorp
      v-else-if="conflict.source === 'CORP' && conflict.jurisdiction === 'BC'"
      :data="(conflictData as BCCorporation)"
    />
    <ExamineRecipeMatchXproCorp
      v-else-if="conflict.source === 'CORP' && conflict.jurisdiction !== 'BC'"
      :conflict="(conflictData as XproCorporation)"
    />
  </div>
  <div v-else>
    <p class="text-red-600">Failed to retrieve conflict info</p>
  </div>
</template>

<script setup lang="ts">
import { useExamination } from '~/store/examine'
import type {
  BCCorporation,
  ConflictListItem,
  ConflictData,
  NameRequest,
  XproCorporation,
} from '~/types'

const examine = useExamination()

const props = defineProps<{
  conflict: ConflictListItem
}>()

const conflictData = ref<ConflictData>()

const isLoading = ref(false)

onMounted(async () => {
  isLoading.value = true
  conflictData.value = await examine.getConflictData(props.conflict)
  isLoading.value = false
})

onUnmounted(() => {
  conflictData.value = undefined
})
</script>
