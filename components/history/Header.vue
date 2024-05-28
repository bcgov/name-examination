<template>
  <div class="flex flex-col">
    <IconButton
      v-if="includeBackButton"
      white
      class="mx-4 my-2 w-fit border-none !p-1"
      @click="
        navigateTo({
          path: Route.Examine,
          query: { nr: nr.nrNum.split(' ')[1] },
        })
      "
    >
      <ArrowLeftIcon class="h-5 w-5 text-bcgov-blue3" />
    </IconButton>

    <div
      class="flex flex-col space-y-4 px-4 pb-4"
      :class="{ 'pt-4': !includeBackButton }"
    >
      <div class="flex items-center divide-x-2 divide-gray-300">
        <NRNumber
          :nr-number="nr.nrNum"
          :priority="isPriority"
          class="pr-2 !text-xl"
        />
        <PriorityLabel
          v-if="isPriority"
          class="px-2 text-xl"
          icon-style="h-5 w-5"
        />
        <NameRequestTypeInfo
          class="!flex-row items-center space-x-2 pl-2 text-xl"
          :request-type-text="requestTypeDisplay"
          :jurisdiction="nr.xproJurisdiction || undefined"
          :jurisdiction-number="nr.homeJurisNum || undefined"
        />
      </div>
      <ExamineNamesList class="pl-4" :choices="nr.names" highlight />

      <div class="flex w-full text-sm">
        <div class="grid grow grid-cols-4">
          <span class="font-bold">Submitted Date</span>
          <span>{{ submittedDate }}</span>

          <span class="font-bold">Expiry Date</span>
          <span>
            {{ expirationDate }}
          </span>

          <span class="font-bold">Request Status</span>
          <span>{{ statusDisplay }}</span>

          <span class="font-bold">Consent</span>
          <span>{{ consentDisplay }}</span>

          <span class="font-bold">Additional Information</span>
          <span>{{ nr.additionalInfo }}</span>

          <span v-if="includeRecipient" class="font-bold">Recipient</span>
          <span v-if="includeRecipient">{{ nr.applicants.emailAddress }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { NameRequest } from '~/types'
import NameRequestTypeInfo from '../NameRequestTypeInfo.vue'
import { ConsentFlag } from '~/enums/codes'
import { Status } from '~/enums/nr-status'
import { parseDate, getFormattedDateWithTimeAndZone } from '~/util/date'
import {
  getRequestTypeDisplay,
  getStatusDisplay,
  getConsentDisplay,
} from '~/util/display-format'
import { ArrowLeftIcon } from '@heroicons/vue/24/outline'
import { Route } from '~/enums/routes'

const { nr } = defineProps<{
  nr: NameRequest
  /** Include the `recipient` field in the NR info of the header. */
  includeRecipient?: boolean
  /** Include a back button to go back to the examine page. */
  includeBackButton?: boolean
}>()

const isPriority = computed(() => nr.priorityCd === 'Y')

const requestTypeDisplay = computed(() =>
  getRequestTypeDisplay(
    nr.requestTypeCd,
    nr.request_action_cd,
    nr.entity_type_cd
  )
)

const submittedDate = computed(() =>
  getFormattedDateWithTimeAndZone(parseDate(nr.submittedDate))
)

const expirationDate = computed(() =>
  nr.expirationDate
    ? getFormattedDateWithTimeAndZone(parseDate(nr.expirationDate))
    : 'N/A'
)

const statusDisplay = computed(() =>
  getStatusDisplay(nr.stateCd as Status, nr.names)
)

const consentDisplay = computed(() =>
  getConsentDisplay(nr.consent_dt, nr.consentFlag || ConsentFlag.Waived)
)
</script>
