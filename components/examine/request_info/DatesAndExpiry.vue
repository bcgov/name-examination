<template>
  <div class="flex flex-col overflow-auto py-1 text-sm">
    <div class="flex">
      <h2 class="font-bold">Submit:&nbsp;</h2>
      <span>{{ examine.submittedDate }}</span>
    </div>

    <div v-if="examine.corpNum" class="flex">
      <h2 class="font-bold">Corp Num:&nbsp;</h2>
      <span>{{ examine.corpNum }}</span>
    </div>

    <div class="flex items-center" :class="{ 'text-gray-400': !expiry }">
      <h2 class="font-bold">Expiry:&nbsp;</h2>
      <span v-if="!examine.is_editing">
        {{ expiry ? expiry : 'n/a' }}
      </span>
      <DateInput v-else min-today v-model="expiry" />
    </div>

    <div class="flex" :class="{ 'text-gray-400': !examine.consumptionDate }">
      <h2 class="font-bold">Consumed:&nbsp;</h2>
      <span>
        {{ examine.consumptionDate ? examine.consumptionDate : 'n/a' }}
      </span>
    </div>

    <div class="flex" :class="{ 'text-gray-400': !examine.consumedBy }">
      <h2 class="font-bold">Consumed By:&nbsp;</h2>
      <span>{{ examine.consumedBy ? examine.consumedBy : 'n/a' }}</span>
    </div>

    <div v-if="examine.nr_status === Status.Conditional">
      <div v-if="!examine.is_editing" class="flex items-center">
        <h2 class="font-bold">Consent:&nbsp;</h2>
        <span>{{ consentText }}</span>
      </div>

      <div v-else class="flex flex-col space-y-1">
        <div class="flex items-center">
          <h2 class="font-bold">Consent:&nbsp;</h2>
          <ListSelect
            class="w-1/2"
            v-model="consentFlag"
            :options="consentOptions"
            :options-display="(option: ConsentOption) => option.text"
            :options-model="(option: ConsentOption) => option.value"
          >
            {{ consentOptionText ? consentOptionText : 'Select' }}
          </ListSelect>
        </div>

        <div
          v-if="examine.consentFlag === ConsentFlag.Received"
          class="flex items-center"
        >
          <h2 class="font-bold">Consent Date:&nbsp;</h2>
          <DateInput v-model="consentDate" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { DateTime } from 'luxon'
import { ConsentFlag } from '~/enums/codes'
import { Status } from '~/enums/nr-status'
import { useExamineStore } from '~/store/examine'

const examine = useExamineStore()

const expiry = ref(examine.expiryDate)

type ConsentOption = { text: string; value: ConsentFlag | undefined }
const consentOptions: Array<ConsentOption> = [
  { text: 'Required', value: ConsentFlag.Required },
  { text: 'Received', value: ConsentFlag.Received },
  { text: 'Waived', value: ConsentFlag.Waived },
]
const consentOptionText = computed(
  () => consentOptions.find((o) => o.value === examine.consentFlag)?.text
)

const consentFlag = computed({
  get: () => examine.consentFlag,
  set: (flag) => examine.setConsentFlag(flag),
})

const consentDate = computed(() =>
  examine.consentDateForEdit
    ? examine.consentDateForEdit
    : DateTime.now().toFormat('yyyy-MM-dd')
)

const consentText = computed(() => {
  switch (examine.consentFlag) {
    case ConsentFlag.Received:
      return consentDate.value
    case ConsentFlag.Required:
      return 'Required'
    case ConsentFlag.Waived:
      return 'Waived'
    default:
      return '-'
  }
})
</script>
