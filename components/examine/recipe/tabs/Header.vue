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
import { useExamineStore } from '~/store/examine'

const examine = useExamineStore()

const conflictsIconType = computed(() =>
  [
    examine.cobrsPhoneticConflicts,
    examine.exactMatchesConflicts,
    examine.synonymMatchesConflicts,
    examine.phoneticConflicts,
  ].some((arr) => arr.length > 0)
    ? 'error'
    : 'ok'
)

const conditionsIconType = computed(() => {
  if (examine.conditionsJSON) {
    let { restricted_words_conditions } = examine.conditionsJSON
    if (restricted_words_conditions.length > 0) {
      for (let resWord of restricted_words_conditions) {
        if (
          resWord.cnd_info.every((con) => con.allow_use === 'N') ||
          resWord.cnd_info.every((con) => con.consent_required === 'Y')
        )
          return 'error'
      }
      return 'warning'
    }
  }
  return 'ok'
})

const trademarksIconType = computed(() => {
  return !examine.trademarkInfo || examine.trademarkInfo.names.length === 0
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
