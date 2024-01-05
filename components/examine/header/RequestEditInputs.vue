<template>
  <div>
    <ListSelect
      v-model="selectedRequestType"
      :options="examine.listRequestTypes"
      :options-display="(rt: RequestType) => rt.text"
      @option-clicked="(rt: RequestType) => updateRequestTypeRules(rt)"
    >
      {{ selectedRequestType.text }}
    </ListSelect>

    <div class="flex flex-col space-x-1">
      <div v-if="jurisdictionRequired">
        <label for="jurisdiction" class="text-sm font-bold">
          Jurisdiction
          <span v-if="jurisdiction == null" class="text-red-600">
            (required)
          </span>
        </label>
        <ListSelect
          id="jurisdiction"
          v-model="jurisdiction"
          :options="examine.listJurisdictions"
          :options-display="(j: Jurisdiction) => j.text"
        >
          {{ jurisdiction ? jurisdiction.text : 'Select' }}
        </ListSelect>
      </div>

      <div v-if="examine.corpNumRequired">
        <label for="corpNum" class="text-sm font-bold">Related Corp #</label>
        <TextInput id="corpNum" v-model="corpNum" placeholder="Corp Number" />
      </div>

      <div v-if="examine.prevNrRequired">
        <label for="prevNr" class="text-sm font-bold">
          Previous NR
          <span
            class="text-red-600"
            v-if="examine.previousNr && !isValidNrFormat(examine.previousNr)"
          >
            (Format must be NR xxxxxxx)
          </span>
        </label>
        <TextInput
          id="prevNr"
          v-model="examine.previousNr"
          placeholder="NR Number"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useExamineStore } from '~/store/examine'
import type { Jurisdiction, RequestType } from '~/types'
import { isValidNrFormat } from '~/util'

const examine = useExamineStore()

const selectedRequestType = ref(examine.requestTypeObject)
const jurisdiction = ref()
const corpNum = ref('')

const jurisdictionRequired = ref(false)

function updateRequestTypeRules(requestType: RequestType) {
  let rules = examine.requestTypeRules.find(
    (rule) => rule.request_type == requestType.value
  )
  examine.prevNrRequired = Boolean(rules?.prev_nr_required)
  examine.corpNumRequired = Boolean(rules?.corp_num_required)
  jurisdictionRequired.value = Boolean(rules?.jurisdiction_required)
}
</script>
