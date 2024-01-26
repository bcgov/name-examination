<template>
  <ExamineRecipeTable
    class="h-full w-full"
    :columns="[
      'Word',
      'Allow',
      'Consent',
      'Examiner Information',
      'Instructions',
    ]"
    :rows="rows"
  />
</template>

<script setup lang="ts">
import { useExamineStore } from '~/store/examine.mock'
const examine = useExamineStore()
const rows = computed(() =>
  examine.parseConditions.map((item) => [
    item.phrase,
    item.allow_use,
    item.consent_required,
    item.text,
    item.instructions,
  ])
)
</script>
