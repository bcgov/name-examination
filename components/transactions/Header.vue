<template>
  <div class="flex flex-col">
    <div class="flex items-center divide-x-2 divide-gray-300">
      <NRNumber
        :nr-number="data.nrNum"
        :priority="isPriority"
        class="pr-2 text-xl"
      />
      <PriorityLabel v-if="isPriority" class="px-2" />
      <NameRequestTypeInfo
        class="!flex-row items-center space-x-2 pl-2"
        :request-type-text="requestTypeText"
        :jurisdiction="data.xproJurisdiction"
        :jurisdiction-number="data.homeJurisNum || undefined"
      />
    </div>
    <ExamineNamesList :choices="data.names" />
  </div>
</template>

<script setup lang="ts">
import type { NameRequest } from '~/types'
import { toMappedRequestType } from '~/util/request-type'
import NameRequestTypeInfo from '../NameRequestTypeInfo.vue'
import requestTypes from '~/data/request_types.json'

const { data } = defineProps<{
  data: NameRequest
}>()

const isPriority = computed(() => data.priorityCd === 'Y')
const requestType = computed(() =>
  toMappedRequestType(
    data.requestTypeCd,
    data.request_action_cd,
    data.entity_type_cd
  )
)
const requestTypeText = computed(
  () => requestTypes.find((r) => r.value == requestType.value)?.text || 'N/A'
)
</script>
