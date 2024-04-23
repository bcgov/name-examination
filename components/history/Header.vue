<template>
  <div v-if="loading" class="flex items-center justify-center">
    <LoadingSpinner />
  </div>

  <div v-else class="flex flex-col space-y-4 p-4">
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
    <TransactionsNRInfo :data="nr" class="w-full" />
  </div>
</template>

<script setup lang="ts">
import type { NameRequest } from '~/types'
import NameRequestTypeInfo from '../NameRequestTypeInfo.vue'
import { getRequestTypeDisplay } from '~/util/request-type'

const { nr } = defineProps<{
  nr: NameRequest
  loading?: boolean
}>()

const isPriority = computed(() => nr.priorityCd === 'Y')

const requestTypeDisplay = computed(() =>
  getRequestTypeDisplay(
    nr.requestTypeCd,
    nr.request_action_cd,
    nr.entity_type_cd
  )
)
</script>
