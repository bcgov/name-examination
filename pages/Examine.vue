<template>
  <div
    class="flex h-full flex-col"
    :class="{ 'bg-gray-100': examine.is_editing }"
  >
    <!-- <ExamineNoticeBanner type="warning">
      <span>
        Similar name previously <span class="font-bold">REJECTED</span>
      </span>
    </ExamineNoticeBanner> -->

    <!-- <ExamineNoticeBanner type="lock">
      <span>
        This NR is being examined by <span class="font-bold">test@idir</span>
      </span>
    </ExamineNoticeBanner> -->
    <ExamineHeader />
    <ExamineRequestInfo />

    <div class="flex justify-between p-4">
      <ExamineNamesList class="ml-4 basis-1/2" />
      <ExamineQuickActionButtons v-if="showQuickActionButtons" />
    </div>

    <div
      v-if="!examine.is_complete && !reservedOrCondReserved"
      class="flex grow flex-col space-x-3 bg-gray-100 p-4 xl:flex-row"
    >
      <ExamineRecipe class="basis-1/2" />
      <ExamineDecision v-if="examine.inProgress" class="basis-1/2" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useExamineStore } from '~/store/examine'
const examine = useExamineStore()

useHead({ title: 'BC Registry: Name Examination - Examine Names' })

const showQuickActionButtons = computed(
  () =>
    !examine.is_complete &&
    examine.is_making_decision &&
    examine.userHasApproverRole &&
    examine.is_my_current_nr
)

const reservedOrCondReserved = computed(() =>
  ['COND-RESERVE', 'RESERVED'].includes(examine.nr_status)
)
</script>
