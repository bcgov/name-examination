<template>
  <div class="flex flex-col space-y-2 p-2 text-sm">
    <div class="flex space-x-2">
      <div class="grid basis-2/3 grid-cols-[30%_70%] overflow-x-auto">
        <header class="font-bold">Applicant</header>
        <div>
          <p>
            {{ applicants.firstName }}
            {{ applicants.lastName }}
          </p>
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
      </div>

      <div class="grid basis-1/3 grid-cols-2 overflow-x-auto">
        <header class="font-bold">Client</header>
        <p>{{ applicants.clientFirstName }} {{ applicants.clientLastName }}</p>

        <header class="font-bold">Contact</header>
        <p>{{ applicants.contact }}</p>

        <header class="font-bold">Name State</header>
        <p>{{ conflict.state }}</p>
      </div>
    </div>

    <div>
      <header class="font-bold">Comments</header>
      <ExamineCommentsBox
        :comments="conflict.comments"
        class="max-h-48 overflow-auto rounded-md border border-gray-400 p-2 children:bg-sky-50"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { NameRequestConflict } from '~/types'

const { conflict } = defineProps<{
  conflict: NameRequestConflict
}>()

const applicants = conflict.applicants
</script>
