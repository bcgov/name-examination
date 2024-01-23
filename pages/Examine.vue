<template>
  <div
    class="flex h-full flex-col"
    :class="{ 'bg-gray-100': examine.is_editing }"
  >
    <ExamineNoticeBanner v-if="examine.otherExaminerInProgress" type="lock">
      <span>
        This NR is being examined by
        <span class="font-bold">{{ examine.examiner }}</span>
      </span>
    </ExamineNoticeBanner>

    <ExamineNoticeBanner type="warning">
      <span>
        Similar name previously <span class="font-bold">REJECTED</span>
      </span>
    </ExamineNoticeBanner>

    <ExamineHeader />
    <ExamineRequestInfo />

    <div class="flex justify-between p-4">
      <ExamineNamesList class="ml-4 basis-1/2" />
      <ExamineQuickActionButtons v-if="showQuickActionButtons" />
    </div>

    <div
      v-if="
        !examine.is_complete && !reservedOrCondReserved && !examine.is_editing
      "
      class="flex grow flex-col space-x-3 bg-gray-100 p-4 xl:flex-row"
    >
      <ExamineRecipe class="basis-1/2" />
      <ExamineDecision v-if="showDecisionPanel" class="basis-1/2" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Status } from '~/enums/nr-status'
import { useExamineStore } from '~/store/examine'
const examine = useExamineStore()

useHead({ title: 'BC Registry: Name Examination - Examine Name Request' })

const showQuickActionButtons = computed(
  () =>
    !examine.is_complete &&
    examine.is_making_decision &&
    examine.userHasApproverRole &&
    examine.is_my_current_nr &&
    !examine.is_editing
)

const showDecisionPanel = computed(
  () => examine.isCurrentExaminer && examine.is_making_decision
)

const reservedOrCondReserved = computed(() =>
  [Status.ConditionalReserved, Status.Reserved].includes(examine.nr_status)
)
</script>
