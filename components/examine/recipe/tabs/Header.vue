<template>
  <TabList class="flex space-x-1 rounded-md bg-gray-100 p-1">
    <ExamineRecipeTabsButton
      class="basis-1/6"
      text="Conflicts"
      :type="conflictsIconType"
    />

    <ExamineRecipeTabsButton
      class="basis-1/6"
      text="Conditions"
      :type="conditionsIconType"
    />

    <ExamineRecipeTabsButton
      class="basis-1/6"
      text="Trademarks"
      :type="trademarksIconType"
    />

    <ExamineRecipeTabsButton
      class="basis-1/6"
      text="History"
      :type="historyIconType"
    />

    <ExamineRecipeTabsButton class="basis-1/6" text="Compare" type="custom">
      <DocumentDuplicateIcon class="h-5 w-5 stroke-2 text-bcgov-blue5" />
    </ExamineRecipeTabsButton>

    <label class="flex items-center space-x-1" for="auto-add">
      <input
        class="h-4 w-4"
        type="checkbox"
        id="auto-add"
        v-model="examine.conflictsAutoAdd"
        :disabled="examine.autoAddDisabled"
      />
      <span>auto add</span>
    </label>
  </TabList>
</template>

<script setup lang="ts">
import { DocumentDuplicateIcon } from '@heroicons/vue/24/outline'
import { TabList } from '@headlessui/vue'
import { useExamineStore } from '~/store/examine'

const examine = useExamineStore()

const conflictsIconType = computed(() =>
  [
    examine.parsedCOBRSConflicts,
    examine.exactMatchesConflicts,
    examine.parsedSynonymConflicts,
    examine.parsedPhoneticConflicts,
  ].some((arr) => arr.length > 0)
    ? 'error'
    : 'ok'
)

const conditionsIconType = computed(() => {
  if (examine.parseConditions.length === 0) return 'ok'
  if (
    examine.parseConditions.every((c) => c.allow_use === 'N') ||
    examine.parseConditions.every((c) => c.consent_required === 'Y')
  ) {
    return 'error'
  }
  if (examine.parseConditions.length > 0) {
    return 'warning'
  }
  return 'ok'
})

const trademarksIconType = computed(() => {
  return !examine.trademarksJSON || examine.trademarksJSON.names.length === 0
    ? 'ok'
    : 'error'
})

const historyIconType = computed(() => {
  if (!examine.historiesJSON || examine.historiesJSON.names.length === 0) {
    return 'ok'
  }
  for (let historyItem of examine.historiesJSON.names) {
    if (
      historyItem.name_state_type_cd === 'R' ||
      historyItem.name_state_type_cd === 'REJECTED'
    ) {
      return 'error'
    }
  }
  return 'warning'
})
</script>
