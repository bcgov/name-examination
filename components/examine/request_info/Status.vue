<template>
  <div class="space-y-1 py-1 text-sm">
    <div
      v-if="examine.priority === 'Y'"
      class="flex items-center font-bold text-red-600"
    >
      <StarIcon class="h-4 w-4" />
      <p>Priority</p>
    </div>

    <div class="flex items-center">
      <h2 class="font-bold">Status:&nbsp;</h2>
      <p>{{ additionalStatus }}</p>
    </div>

    <div class="flex items-center">
      <h2 class="font-bold">Examiner:&nbsp;</h2>
      <p>{{ examine.examiner }}</p>
    </div>

    <ExamineRequestInfoCommentsPopup />
  </div>
</template>

<script setup lang="ts">
import { StarIcon } from '@heroicons/vue/24/solid'
import { Status } from '~/enums/nr-status'
import { useExamineStore } from '~/store/examine'
const examine = useExamineStore()

const additionalStatus = computed(() => {
  const approvedName = examine.nameChoices.find((name) =>
    [Status.Approved, Status.Condition].includes(name.state)
  )
  if (approvedName) {
    const displayState =
      approvedName.state === Status.Condition
        ? 'CONDITIONALLY APPROVED'
        : 'APPROVED'
    if (examine.nr_status == Status.Consumed) {
      return `${displayState} - CONSUMED`
    } else if (examine.isApprovedAndExpired) {
      return `${displayState} - EXPIRED`
    }
  }

  if (examine.nr_status == Status.RefundRequested) {
    return `CANCELLED - ${examine.refundPaymentState}`
  }

  return examine.nr_status
})
</script>
