<template>
  <div class="flex flex-wrap px-4 py-2 text-gray-700">
    <div class="flex h-fit">
      <header
        class="text-3xl font-bold"
        :class="{ 'text-red-600': examine.isPriority }"
      >
        {{ examine.nrNumber }}
      </header>

      <a href="#" class="inline-flex items-center px-2 text-bcgov-blue5">
        <ArrowTopRightOnSquareIcon class="h-6 w-6" />
      </a>
    </div>

    <div
      v-if="!examine.is_editing || examine.isClosed"
      class="mx-3 flex flex-col font-bold"
    >
      <p>
        {{ examine.requestTypeObject.text }}
      </p>
      <p class="text-sm">
        {{ jurisdictionDisplay }}
      </p>
    </div>

    <div v-else class="flex basis-5/12 flex-col">
      <ComboSelect
        class="z-20 grow"
        v-model="selectedRequestTypeText"
        :options="computed(() => examine.listRequestTypes.map((t) => t.text))"
      />

      <div class="flex flex-col space-x-1">
        <div class="grow" v-if="jurisdictionRequired">
          <label for="jurisdiction" class="text-sm font-bold">
            Jurisdiction
            <span v-if="jurisdiction == null" class="text-red-600">
              (required)
            </span>
          </label>
          <ComboSelect
            id="jurisdiction"
            v-model="jurisdiction"
            :options="
              computed(() => examine.listJurisdictions.map((j) => j.text))
            "
          />
        </div>

        <div v-if="corpNumRequired">
          <label for="corpNum" class="text-sm font-bold">Related Corp #</label>
          <TextInput id="corpNum" placeholder="Corp Number"/>
        </div>

        <div v-if="prevNrRequired">
          <label for="prevNr" class="text-sm font-bold">
            Previous NR
            <span
              class="text-red-600"
              v-if="examine.prevNr && !isValidNrFormat(examine.prevNr)"
            >
              (Format must be NR xxxxxxx)
            </span>
          </label>
          <TextInput
            id="prevNr"
            v-model="examine.prevNr"
            placeholder="NR Number"
          />
        </div>
      </div>
    </div>

    <ExamineActionButtons class="ml-auto" />
  </div>
</template>

<script setup lang="ts">
import { ArrowTopRightOnSquareIcon } from '@heroicons/vue/24/outline'
import {
  EntityTypeCode,
  RequestActionCode,
  RequestTypeCode,
} from '~/enums/codes'
import { useExamineStore } from '~/store/examine'
import { getMappedRequestType, isValidNrFormat } from '~/util'

const examine = useExamineStore()
const jurisdiction = ref()

const isViewing = computed(() => examine.is_header_shown && !examine.is_editing)
const isExpanded = computed(
  () => examine.is_editing || isViewing || examine.is_header_shown
)

const selectedRequestTypeText = ref(examine.requestTypeObject.text)
const selectedRequestType = computed(() =>
  examine.listRequestTypes.find(
    (rt) => rt.text === selectedRequestTypeText.value
  )
)

const prevNrRequired = ref(false)
const corpNumRequired = ref(false)
const jurisdictionRequired = ref(false)
const additionalInfoTemplate = ref<string>()

function checkReqTypeRules(requestType: string) {
  let rules = examine.requestTypeRules.find(
    (rule) => rule.request_type == requestType
  )
  additionalInfoTemplate.value = rules?.additional_info_template
  prevNrRequired.value = Boolean(rules?.prev_nr_required)
  corpNumRequired.value = Boolean(rules?.corp_num_required)
  jurisdictionRequired.value = Boolean(rules?.jurisdiction_required)
}

const requestType = computed(() =>
  getMappedRequestType(
    examine.requestType as RequestTypeCode,
    examine.requestActionCd as RequestActionCode,
    examine.entityTypeCd as EntityTypeCode
  )
)

const jurisdictionDisplay = computed(() => {
  if (!examine.jurisdiction) return ''

  let text = examine.jurisdiction
  if (examine.jurisdiction?.length === 2) {
    // if the jurisdiction name is two letters, it's likely a code for a province, so get the full name
    const province = examine.listJurisdictions.find(
      (j) => j.value === examine.jurisdiction
    )
    if (province) {
      text = province.text
    }
  }
  if (examine.jurisdictionNumber) {
    text = `${text} (${examine.jurisdictionNumber})`
  }
  return text
})

watch(
  [selectedRequestType],
  () => {
    checkReqTypeRules(selectedRequestType.value!.value)
  },
  { deep: true }
)
</script>
