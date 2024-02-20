<template>
  <div
    class="flex h-full flex-col"
    :class="{ 'bg-gray-100': examine.isEditing }"
  >
    <NoticeBanner v-if="examine.otherExaminerInProgress" type="lock">
      <span>
        This NR is being examined by
        <span class="font-bold">{{ examine.examiner }}</span>
      </span>
    </NoticeBanner>

    <NoticeBanner v-if="examine.exactHistoryMatch" type="warning">
      <span>
        Similar name previously
        <span class="font-bold">{{ examine.exactHistoryMatch }}</span>
      </span>
    </NoticeBanner>

    <ExamineHeader />
    <ExamineRequestInfo />

    <div class="flex justify-between p-4">
      <ExamineNamesList
        v-if="!examine.isEditing"
        class="ml-4 basis-1/2"
        :choices="examine.nameChoices"
        :current-choice="examine.currentChoice"
        :complete="examine.isComplete"
        :undoable="examine.isUndoable"
        :undo="examine.undoNameChoiceDecision"
        highlight
      />
      <ExamineNamesListEditable v-else />

      <ExamineQuickActionButtons v-if="showQuickActionButtons" />
    </div>

    <div
      v-if="
        !examine.isComplete && !reservedOrCondReserved && !examine.isEditing
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
import { useExamination } from '~/store/examine'
const examine = useExamination()

const showQuickActionButtons = computed(
  () =>
    !examine.isComplete &&
    examine.isMakingDecision &&
    examine.userHasApproverRole &&
    examine.isMyCurrentNr &&
    !examine.isEditing
)

const showDecisionPanel = computed(
  () => examine.isCurrentExaminer && examine.isMakingDecision
)

const reservedOrCondReserved = computed(() =>
  [Status.ConditionalReserved, Status.Reserved].includes(examine.nrStatus)
)

onMounted(async () => {
  const route = useRoute()
  const nrParam = route.query.nr
  if (nrParam) {
    const nrNumber = `NR ${nrParam}`
    await examine.initialize(nrNumber)
  } else {
    if (!examine.nrNumber) {
      const nrNumber = await examine.getpostgrescompNo()
      await examine.initialize(nrNumber)
    } else {
      await examine.updateRoute()
    }
  }
})
</script>
