<template>
  <div v-if="conflict.invalidRecordInd">
    <p v-if="conflict.type === 'corp'">
      Corporation info could not be retrieved. It isn't in the fdw-registries
      data.
    </p>
    <p v-else-if="conflict.type === 'name'">
      NR info could not be retrieved. It does not appear to be in the postgres
      data.
    </p>
  </div>

  <div v-else>
    <ExamineRecipeMatchNames
      v-if="conflict.type === 'name'"
      :conflict="conflict as NameRequestConflict"
    />
    <ExamineRecipeMatchCorp
      v-else-if="conflict.type === 'corp' && conflict.jurisdiction === 'BC'"
      :conflict="conflict as BCCorpConflict"
    />
    <ExamineRecipeMatchXproCorp
      v-else-if="conflict.type === 'corp' && conflict.jurisdiction !== 'BC'"
      :conflict="conflict as XproConflict"
    />
  </div>
</template>

<script setup lang="ts">
import type {
  BCCorpConflict,
  Conflict,
  NameRequestConflict,
  XproConflict,
} from '~/types'

defineProps<{
  conflict: Conflict
}>()
</script>
