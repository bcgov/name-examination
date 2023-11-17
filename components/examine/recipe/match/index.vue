<template>
  <ExamineRecipeMatchNames v-if="conflict.type === 'name'" />
  <ExamineRecipeMatchCorp
    v-else-if="conflict.type === 'corp' && conflict.jurisdiction === 'BC'"
    :conflict="conflict as BCCorpConflict"
  />
  <ExamineRecipeMatchXproCorp v-else :conflict="conflict as XproConflict" />
</template>

<script setup lang="ts">
import type { BCCorpConflict, Conflict, XproConflict } from '~/types'

defineProps<{
  conflict: Conflict
}>()
</script>
