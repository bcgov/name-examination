<template>
  <div v-if="conflict && applicants" class="flex gap-x-2 p-4 text-sm">
    <div class="flex basis-2/3 flex-col">
      <div class="grid grid-cols-2 gap-y-1 overflow-x-auto">
        <header class="font-bold">Client</header>
        <p>{{ applicants.clientFirstName }} {{ applicants.clientLastName }}</p>

        <header class="font-bold">Applicant</header>
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

        <header class="font-bold">Phone</header>
        <p>{{ applicants.phoneNumber }}</p>

        <header class="font-bold">Email</header>
        <p>{{ applicants.emailAddress }}</p>

        <header class="font-bold">Contact</header>
        <p>{{ applicants.contact }}</p>
      </div>

      <div v-if="conflict.comments && conflict.comments.length > 0">
        <header class="font-bold">Comments</header>
        <ExamineCommentsBox
          :comments="conflict.comments"
          class="max-h-48 overflow-auto rounded-md border border-gray-400 p-2 children:bg-sky-50"
        />
      </div>
    </div>

    <div
      class="grid basis-1/3 auto-rows-min grid-cols-2 gap-y-1 overflow-x-auto"
    >
      <header class="font-bold">Name State</header>
      <p>{{ nameState }}</p>

      <header v-if="conflicts.length > 0" class="font-bold">Conflicts</header>
      <ol v-if="conflicts.length > 0" class="list-decimal list-inside">
        <li v-for="c in conflicts">{{ c }}</li>
      </ol>

      <header class="font-bold">Decision</header>
      <div class="flex flex-col">
        <p>{{ decisionText }}</p>
      </div>
    </div>
  </div>
  <div v-else class="p-4 font-bold text-red-600">Failed to retrieve info.</div>
</template>

<script setup lang="ts">
import { useExamineStore } from '~/store/examine'

const examine = useExamineStore()

const conflict = computed(() => examine.historiesInfoJSON)
const applicants = computed(() => conflict.value?.applicants)

const nameState = computed(() => {
  if (conflict.value == null) return null

  for (const nameChoice of conflict.value.names)
    if (nameChoice.name === conflict.value.text) return nameChoice.state

  return null
})

const decisionText = computed(() => {
  if (conflict.value == null) return null

  for (const nameChoice of conflict.value.names) {
    if (
      nameChoice.name === conflict.value.text &&
      nameChoice.decision_text != ''
    ) {
      return nameChoice.decision_text
    }
  }
  return null
})

const conflicts = computed(() => {
  if (conflict.value == null) return []

  for (const nameChoice of conflict.value.names)
    if (nameChoice.name === conflict.value.text) {
      return [
        nameChoice.conflict1,
        nameChoice.conflict2,
        nameChoice.conflict3,
      ].filter((choice) => choice != null && choice != '')
    }

  return []
})
</script>
