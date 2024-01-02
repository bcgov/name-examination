<template>
  <div class="space-y-1 py-1 text-sm">
    <div
      v-if="examine.priority"
      class="flex items-center font-bold text-red-600"
    >
      <StarIcon class="h-4 w-4" />
      <p>Priority</p>
    </div>

    <div><b>Status: </b> {{ additionalStatus }}</div>

    <div><b>Examiner: </b> {{ examine.examiner }}</div>

    <ExamineRequestInfoCommentsPopup />
  </div>
</template>

<script setup lang="ts">
import { StarIcon } from '@heroicons/vue/24/solid'
import { Status } from '~/enums/nr-status'
import { useExamineStore } from '~/store/examine'
const examine = useExamineStore()

const isApprovedAndExpired = computed(
  // NR will move to 'EXPIRED' state once expiry date is reached for 'APPROVED', 'CONDITIONAL' state.
  // If currentState is 'EXPIRED', then it was approved and expired.
  () => examine.expiryDate && examine.nr_status === Status.Expired
)

const additionalStatus = computed(() => {
  const approvedName = examine.nameChoices.find((name) =>
    [Status.Approved, Status.Condition].includes(name.value.state)
  )
  if (approvedName) {
    const displayState =
      approvedName.value.state === Status.Condition
        ? 'CONDITIONALLY APPROVED'
        : 'APPROVED'
    if (examine.nr_status == Status.Consumed) {
      return `${displayState} - CONSUMED`
    } else if (isApprovedAndExpired.value) {
      return `${displayState} - EXPIRED`
    }
  }

  if (examine.nr_status == Status.RefundRequested) {
    return `CANCELLED - ${examine.refundPaymentState}`
  }

  return examine.nr_status
})
</script>
