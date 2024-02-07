<template>
  <div v-if="histories && applicants" class="flex-col p-4">
    <div class="flex gap-x-2 text-sm">
      <div class="flex basis-2/3 flex-col">
        <div class="grid grid-cols-2 gap-y-1 overflow-x-auto">
          <h3 class="font-bold">Client</h3>
          <p>
            {{ applicants.clientFirstName }} {{ applicants.clientLastName }}
          </p>

          <h3 class="font-bold">Applicant</h3>
          <div>
            <p>{{ applicants.firstName }} {{ applicants.lastName }}</p>
            <p>{{ applicants.addrLine1 }}</p>
            <p>{{ applicants.addrLine2 }}</p>
            <p>{{ applicants.addrLine3 }}</p>
            <p>
              {{ applicants.city }}
              {{ applicants.stateProvinceCd }}
              {{ applicants.postalCd }}
              {{ applicants.countryTypeCd }}
            </p>
          </div>

          <h3 class="font-bold">Phone</h3>
          <p>{{ applicants.phoneNumber }}</p>

          <h3 class="font-bold">Email</h3>
          <p>{{ applicants.emailAddress }}</p>

          <h3 class="font-bold">Contact</h3>
          <p>{{ applicants.contact }}</p>
        </div>
      </div>

      <div
        class="grid basis-1/3 auto-rows-min grid-cols-2 gap-y-1 overflow-x-auto"
      >
        <h3 class="font-bold">Name State</h3>
        <p>{{ nameState }}</p>

        <h3 v-if="conflicts.length > 0" class="font-bold">Conflicts</h3>
        <ol v-if="conflicts.length > 0" class="list-inside list-decimal">
          <li v-for="c in conflicts">{{ c }}</li>
        </ol>

        <h3 class="font-bold">Decision</h3>
        <div class="flex flex-col">
          <p>{{ decisionText }}</p>
        </div>
      </div>
    </div>

    <div
      v-if="histories.comments && histories.comments.length > 0"
      class="mt-2 w-full"
    >
      <h3 class="font-bold">Comments</h3>
      <ExamineCommentsBox
        :comments="histories.comments"
        class="max-h-48 w-full overflow-auto rounded-md border border-gray-400 p-2 children:bg-sky-50"
      />
    </div>
  </div>
  <div v-else class="p-4 font-bold text-red-600">Failed to retrieve info.</div>
</template>

<script setup lang="ts">
import { useExamination } from '~/store/examine'

const examine = useExamination()

const histories = computed(() => examine.historiesInfoJSON)
const applicants = computed(() => histories.value?.applicants)

const nameState = computed(() => {
  if (histories.value == null) return null

  for (const nameChoice of histories.value.names)
    if (nameChoice.name === histories.value.text) return nameChoice.state

  return null
})

const decisionText = computed(() => {
  if (histories.value == null) return null

  for (const nameChoice of histories.value.names) {
    if (
      nameChoice.name === histories.value.text &&
      nameChoice.decision_text != ''
    ) {
      return nameChoice.decision_text
    }
  }
  return null
})

const conflicts = computed(() => {
  if (histories.value == null) return []

  for (const nameChoice of histories.value.names)
    if (nameChoice.name === histories.value.text) {
      return [
        nameChoice.conflict1,
        nameChoice.conflict2,
        nameChoice.conflict3,
      ].filter((choice) => choice != null && choice != '')
    }

  return []
})
</script>
