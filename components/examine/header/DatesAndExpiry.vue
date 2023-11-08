<template>
  <div class="flex flex-col overflow-hidden py-1 text-sm">
    <div class="flex">
      <h2 class="font-bold">Submit:&nbsp;</h2>
      <span>{{ submittedDate }}</span>
    </div>

    <div v-if="corpNum" class="flex">
      <h2 class="font-bold">Corp Num:&nbsp;</h2>
      <span>{{ corpNum }}</span>
    </div>

    <div class="flex items-center" :class="{ 'text-gray-400': !expiry }">
      <h2 class="font-bold">Expiry:&nbsp;</h2>
      <span v-if="examine.headerState !== 'editable'">
        {{ expiry ? expiry : 'n/a' }}
      </span>
      <DateInput v-else min-today :value="expiry" />
    </div>

    <div class="flex" :class="{ 'text-gray-400': !consumed }">
      <h2 class="font-bold">Consumed:&nbsp;</h2>
      <span>{{ consumed ? consumed : 'n/a' }}</span>
    </div>

    <div class="flex" :class="{ 'text-gray-400': !consumedBy }">
      <h2 class="font-bold">Consumed By:&nbsp;</h2>
      <span>{{ consumedBy ? consumedBy : 'n/a' }}</span>
    </div>

    <div
      v-if="examine.nrStatus === Status.Conditional"
      class="flex flex-col space-y-1"
    >
      <div class="flex items-center">
        <h2 class="font-bold">Consent:&nbsp;</h2>
        <span v-if="examine.headerState !== 'editable'">{{
          consent ? consent : 'n/a'
        }}</span>
        <ListSelect
          v-else
          class="w-1/2"
          v-model="consent"
          :options="consentOptions"
        >
          {{ consent }}
        </ListSelect>
      </div>

      <div v-if="examine.headerState === 'editable'" class="flex items-center">
        <h2 class="font-bold">Consent Date:&nbsp;</h2>
        <DateInput :value="consentDate" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Status } from '~/enums/filter-dropdowns'
import { useExamineStore } from '~/store/examine'

const examine = useExamineStore()

const submittedDate = ref('2008-09-16, 4:44pm')
const corpNum = ref(23132)
const expiry = ref('2008-09-18')
const consumed = ref(null)
const consumedBy = ref(null)

const consent = ref('-')
const consentDate = ref('2008-09-18')
const consentOptions = ['Required', 'Received', 'Waived', '-']
</script>
