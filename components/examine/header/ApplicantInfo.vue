<template>
  <div class="text-sm">
    <ExamineHeaderPopover
      title="Applicant Information"
      v-if="examine.headerState === 'minimized'"
    >
      <template #minimized>
        <p>Jack Frost</p>
        <p>3434 Main Street</p>
        <p>Suite 303</p>
      </template>

      <template #expanded>
        <div class="flex flex-col gap-y-2">
          <div>
            <b>Client</b>
            <p>Jane Frost</p>
          </div>

          <div>
            <b>Applicant</b>
            <p>Jack Frost</p>
          </div>

          <div>
            <b>Address</b>
            <p>3434 Main Street</p>
            <p>Suite 303</p>
            <p>Top Floor</p>
            <p>Saywarn BC</p>
            <p>v8v8v8</p>
            <p>CA</p>
          </div>
          <div>
            <b>Phone</b>
            <p>305-343-3434</p>
          </div>
          <div>
            <b>Fax</b>
            <p>306-343-3333</p>
          </div>
          <div>
            <b>Email</b>
            <p>test@gov.bc.ca</p>
          </div>
          <div>
            <b>Contact</b>
            <p>Jack Frost</p>
          </div>
        </div>
      </template>
    </ExamineHeaderPopover>
    <div v-else class="overflow-auto">
      <span class="font-bold">Applicant Information</span>
      <div class="flex flex-col gap-y-2">
        <div>
          <b>Client</b>
          <p>Jane Frost</p>
        </div>

        <div>
          <b>Applicant</b>
          <p>Jack Frost</p>
        </div>

        <div>
          <b>Address</b>
          <p>3434 Main Street</p>
          <p>Suite 303</p>
          <p>Top Floor</p>
          <p>Saywarn BC</p>
          <p>v8v8v8</p>
          <p>CA</p>
        </div>
        <div>
          <b>Phone</b>
          <p>305-343-3434</p>
        </div>
        <div>
          <b>Fax</b>
          <p>306-343-3333</p>
        </div>
        <div>
          <b>Email</b>
          <p>test@gov.bc.ca</p>
        </div>
        <div>
          <b>Contact</b>
          <p>Jack Frost</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useExamineStore } from '~/store/examine'
const examine = useExamineStore()
</script>
