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

    <div
      class="flex items-center"
      :class="{ 'text-gray-400': !examine.expiryDate }"
    >
      <h2 class="font-bold">Expiry:&nbsp;</h2>
      <span v-if="!examine.expiryDate">n/a</span>
      <span v-else-if="!examine.is_editing">
        {{ examine.expiryDate }}
      </span>
      <div v-else class="flex flex-col">
        <DateInput
          min-today
          v-model="expiry"
          :error-style="expiryDateErrorText != ''"
          @change="expiryDateErrorText = ''"
        />
        <span class="text-sm font-bold text-red-600">
          {{ expiryDateErrorText }}
        </span>
      </div>
    </div>

    <div class="flex" :class="{ 'text-gray-400': !consumptionDateDisplay }">
      <h2 class="font-bold">Consumed:&nbsp;</h2>
      <span>
        {{ consumptionDateDisplay ? consumptionDateDisplay : 'n/a' }}
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
            :options-display="(option: ConsentFlag) => consentDisplayStrings[option]"
          >
            {{
              selectedConsentOptionText ? selectedConsentOptionText : 'Select'
            }}
          </ListSelect>
        </div>

        <div
          v-if="consentFlag === ConsentFlag.Received"
          class="flex items-center"
        >
          <h2 class="font-bold">Consent Date:&nbsp;</h2>
          <div class="flex flex-col">
            <DateInput
              v-model="consentDate"
              :error-style="consentDateErrorText != ''"
              @change="consentDateErrorText = ''"
            />
            <span class="text-sm font-bold text-red-600">
              {{ consentDateErrorText }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ConsentFlag } from '~/enums/codes'
import { Status } from '~/enums/nr-status'
import { useExamineStore } from '~/store/examine'
import { getFormattedDate, parseDate } from '~/util/date'

const examine = useExamineStore()

const expiry = ref<string>()
const consentFlag = ref<ConsentFlag>()
const consentDate = ref<string>()

setDefaultInputValues()

const expiryDateErrorText = ref('')
const consentDateErrorText = ref('')

const consentOptions = computed(() => Object.values(ConsentFlag))

const consentDisplayStrings = {
  [ConsentFlag.Required]: 'Required',
  [ConsentFlag.Received]: 'Received',
  [ConsentFlag.Waived]: 'Waived',
}

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

const selectedConsentOptionText = computed(() =>
  consentFlag.value ? consentDisplayStrings[consentFlag.value] : undefined
)

const consumptionDateDisplay = computed(() => {
  if (examine.consumptionDate && parseDate(examine.consumptionDate).isValid) {
    return getFormattedDate(examine.consumptionDate)
  }
})

function setDefaultInputValues() {
  expiry.value = examine.expiryDate
  consentFlag.value = examine.consentFlag
  consentDate.value = examine.consentDateForEdit
}

examine.addEditAction({
  validate() {
    let isValid = true
    if (examine.expiryDate && !expiry.value) {
      expiryDateErrorText.value = 'Expiry date is required'
      isValid = false
    }
    if (consentFlag.value === ConsentFlag.Received && !consentDate.value) {
      consentDateErrorText.value = 'Consent date is required'
      isValid = false
    }
    return isValid
  },
  update() {
    examine.expiryDate = expiry.value

    if (examine.nr_status === Status.Conditional) {
      examine.consentFlag = consentFlag.value
    } else {
      examine.consentFlag = undefined
    }

    if (examine.consentFlag === ConsentFlag.Received) {
      examine.consentDateForEdit = consentDate.value
    } else {
      examine.consentDateForEdit = undefined
    }
  },
  cancel: setDefaultInputValues,
})
</script>
