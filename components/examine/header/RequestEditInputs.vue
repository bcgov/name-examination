<template>
  <div>
    <ListSelect
      v-model="selectedRequestType"
      :options="examine.listRequestTypes"
      :options-display="(rt: RequestType) => rt.text"
      @option-clicked="(rt: RequestType) => updateRequestTypeRules(rt)"
      aria-label="Name Request Type"
    >
      {{ selectedRequestType.text }}
    </ListSelect>

    <div class="flex flex-col space-x-1">
      <div v-if="jurisdictionRequired" class="flex flex-col">
        <label for="jurisdiction" class="text-sm font-bold">
          Jurisdiction
        </label>
        <ListSelect
          id="jurisdiction"
          v-model="jurisdiction"
          :options="examine.listJurisdictions.map((j) => j.text)"
          @option-clicked="jursidictionErrorText = ''"
          :error-style="jursidictionErrorText != ''"
        >
          {{ jurisdiction ? jurisdiction : 'Select' }}
        </ListSelect>
        <span class="text-sm font-bold text-red-600">
          {{ jursidictionErrorText }}
        </span>
      </div>

      <div v-if="examine.corpNumRequired" class="flex flex-col py-0.5">
        <label for="corpNum" class="text-sm font-bold">Related Corp #</label>
        <TextInput
          id="corpNum"
          v-model="corpNum"
          placeholder="Corp Number"
          :error-style="corpNumError"
          @input="corpNumErrorText = ''"
        />
        <span class="text-sm font-bold text-red-600">
          {{ corpNumErrorText }}
        </span>
      </div>

      <div v-if="examine.prevNrRequired" class="flex flex-col">
        <label for="prevNr" class="text-sm font-bold"> Previous NR</label>
        <TextInput
          id="prevNr"
          v-model="previousNr"
          placeholder="NR Number"
          :error-style="previousNrErrorText != ''"
          @input="previousNrErrorText = ''"
        />

        <span class="text-sm font-bold text-red-600">
          {{ previousNrErrorText }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { RequestTypeCode } from '~/enums/codes'
import { useExamineStore } from '~/store/examine'
import type { Jurisdiction, RequestType } from '~/types'
import { isValidCorpNum, isValidNrFormat } from '~/util'

const examine = useExamineStore()

const selectedRequestType = ref(examine.requestTypeObject)

const jurisdiction = ref(examine.jurisdiction)
const jurisdictionRequired = ref(false)
const jursidictionErrorText = ref('')

const corpNum = ref('')
const corpNumErrorText = ref('')
const corpNumError = computed(() => corpNumErrorText.value != '')

const previousNr = ref(examine.previousNr)
const previousNrErrorText = ref('')

function resetErrorTexts() {
  jursidictionErrorText.value = ''
  corpNumErrorText.value = ''
  previousNrErrorText.value = ''
}

function updateRequestTypeRules(requestType: RequestType) {
  let rules = examine.requestTypeRules.find(
    (rule) => rule.request_type == requestType.value
  )
  examine.prevNrRequired = Boolean(rules?.prev_nr_required)
  examine.corpNumRequired = Boolean(rules?.corp_num_required)
  jurisdictionRequired.value = Boolean(rules?.jurisdiction_required)
  resetErrorTexts()
}

examine.addEditAction({
  async validate() {
    let isValid = true
    if (jurisdictionRequired.value && jurisdiction.value == null) {
      jursidictionErrorText.value = 'Please select a jurisdiction'
      isValid = false
    }
    if (examine.corpNumRequired && !(await isValidCorpNum(corpNum.value))) {
      corpNumErrorText.value = 'Please enter a valid Incorporation Number'
      isValid = false
    }
    if (
      examine.prevNrRequired &&
      previousNr.value &&
      !isValidNrFormat(previousNr.value)
    ) {
      previousNrErrorText.value = '(Format must be NR xxxxxxx)'
      isValid = false
    }
    return isValid
  },
  update() {
    resetErrorTexts()
    examine.requestType = selectedRequestType.value.value as RequestTypeCode
    if (jurisdictionRequired.value) {
      examine.jurisdiction = jurisdiction.value
    } else {
      examine.jurisdiction = undefined
    }
    if (examine.corpNumRequired) {
      examine.corpNum = corpNum.value
    } else {
      examine.corpNum = undefined
    }
    if (examine.prevNrRequired) {
      examine.previousNr = previousNr.value
    } else {
      examine.previousNr = undefined
    }
  },
})

onMounted(() => {
  updateRequestTypeRules(examine.requestTypeObject)
})
</script>
