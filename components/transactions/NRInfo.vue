<template>
  <div class="flex text-sm">
    <div class="grid grow grid-cols-4">
      <span class="font-bold">Submitted Date</span>
      <span>{{ formatDate(data.submittedDate) }}</span>

      <span class="font-bold">Expiry Date</span>
      <span>
        {{ data.expirationDate ? formatDate(data.expirationDate) : 'N/A' }}
      </span>

      <span class="font-bold">Request Status</span>
      <span>{{ stateDisplay }}</span>

      <span class="font-bold">Consent</span>
      <span>{{ consentDisplay }}</span>

      <span class="font-bold">Additional Information</span>
      <span>{{ data.additionalInfo }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Status } from '~/enums/nr-status'
import type { NameRequest } from '~/types'
import { parseDate, TIMESTAMP_FORMAT } from '~/util/date'

const { data } = defineProps<{
  data: NameRequest
}>()

function formatDate(date: string) {
  return parseDate(date).toFormat(`${TIMESTAMP_FORMAT} ZZZZ`)
}

const stateDisplay = computed(() => {
  if (!data.stateCd) return 'N/A'

  let displayState = data.stateCd
  if (data.stateCd === Status.Conditional) {
    displayState = 'CONDITIONAL APPROVED'
  } else if (
    data.stateCd === Status.Consumed &&
    data.names &&
    data.names.length > 0
  ) {
    const approvedName = data.names.find((name) =>
      [Status.Approved, Status.Condition].includes(name.state)
    )
    displayState =
      approvedName?.state === Status.Condition
        ? 'CONDITIONAL APPROVED'
        : 'APPROVED'
    displayState += ` / Used for ${approvedName?.corpNum}`
  }
  return displayState
})

const consentDisplay = computed(() =>
  data.consent_dt
    ? 'Required. Received.'
    : data.consentFlag === 'Y'
    ? 'Required. Not yet received.'
    : 'Not required'
)
</script>
