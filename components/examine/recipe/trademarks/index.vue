<template>
  <ExamineRecipeTable
    class="h-full w-full"
    :columns="['Name', 'Description', 'Status']"
    :rows="rows"
  />
</template>

<script setup lang="ts">
import { useExamineStore } from '~/store/examine'
const examine = useExamineStore()

const rows = computed(() => {
  if (examine.trademarksJSON && examine.trademarksJSON.names) {
    return examine.trademarksJSON.names.map((tm) => [
      tm.name,
      tm.description,
      tm.status,
    ])
  } else {
    return []
  }
})
</script>
