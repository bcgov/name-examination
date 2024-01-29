<template>
  <div class="w-full">
    <div class="flex w-full flex-col space-y-2 rounded-md bg-white p-2">
      <Accordion open arrow button-style="bg-gray-200 p-2 hover:bg-gray-300">
        <template #title>Exact match</template>
        <template #content>
          <ExamineRecipeConflictsList
            v-if="examine.exactMatchesConflicts.length > 0"
            :conflict-items="examine.exactMatchesConflicts"
          />
          <span v-else class="p-1">No exact match</span>
        </template>
      </Accordion>

      <Accordion open arrow button-style="bg-gray-200 p-2 hover:bg-gray-300">
        <template #title>Exact Word Order + Synonym Match</template>
        <template #content>
          <ExamineRecipeConflictsBucket
            v-if="examine.parsedSynonymConflicts.length > 0"
            :conflict-lists="examine.parsedSynonymConflicts"
          />
          <span v-else class="p-1">No results</span>
        </template>
      </Accordion>

      <Accordion open arrow button-style="bg-gray-200 p-2 hover:bg-gray-300">
        <template #title>Character Swap Match</template>

        <template #content>
          <ExamineRecipeConflictsBucket
            v-if="examine.parsedCOBRSConflicts.length > 0"
            :conflict-lists="examine.parsedCOBRSConflicts"
          />
          <span v-else class="p-1">No results</span>
        </template>
      </Accordion>

      <Accordion open arrow button-style="bg-gray-200 p-2 hover:bg-gray-300">
        <template #title>Phonetic Match (experimental)</template>

        <template #content>
          <ExamineRecipeConflictsBucket
            v-if="examine.parsedPhoneticConflicts.length > 0"
            :conflict-lists="examine.parsedPhoneticConflicts"
          />
          <span v-else class="p-1">No results</span>
        </template>
      </Accordion>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useExamineStore } from '~/store/examine'
const examine = useExamineStore()
</script>
