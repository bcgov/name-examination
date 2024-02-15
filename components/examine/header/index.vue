<template>
  <div class="flex flex-wrap px-4 py-2 text-gray-700">
    <div class="flex items-center">
      <NRNumber :nr-number="examine.nrNumber" :priority="examine.priority" />

      <a
        :href="`/transactions?nr=${examine.nrNumber.split(' ')[1]}`"
        target="_blank"
        rel="noopener noreferrer"
        class="px-2 text-bcgov-blue5"
      >
        <ArrowTopRightOnSquareIcon class="h-6 w-6" />
      </a>
    </div>

    <NameRequestTypeInfo
      v-if="!examine.isEditing || examine.isClosed"
      :request-type-text="examine.requestTypeObject.text"
      :jurisdiction="examine.jurisdiction"
      :jurisdiction-number="examine.jurisdictionNumber"
    />
    <ExamineHeaderRequestEditInputs v-else class="flex basis-5/12 flex-col" />

    <ExamineHeaderActionButtons class="ml-auto" />
  </div>
</template>

<script setup lang="ts">
import { ArrowTopRightOnSquareIcon } from '@heroicons/vue/24/outline'
import { useExamination } from '~/store/examine'
const examine = useExamination()
</script>
