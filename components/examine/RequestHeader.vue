<template>
  <div class="flex flex-wrap px-4 py-2 text-gray-700">
    <div class="flex h-fit">
      <header
        class="text-3xl font-bold"
        :class="{ 'text-red-600': examine.isPriority }"
      >
        {{ examine.nrNumber }}
      </header>

      <a href="#" class="inline-flex items-center px-2 text-bcgov-blue5">
        <ArrowTopRightOnSquareIcon class="h-6 w-6" />
      </a>
    </div>

    <p v-if="!examine.is_editing || examine.isClosed" class="mx-3 font-bold">
      Cooperative - Incorporation
    </p>

    <div v-else class="flex basis-5/12 flex-col">
      <ComboSelect
        class="z-20 grow"
        v-model="nrType"
        :options="
          computed(() => [
            'Cooperative - Incorporation',
            'Cooperative - Extraprovincial',
            'Cooperative - Restore',
          ])
        "
      />

      <div class="flex space-x-1">
        <div class="grow" v-if="nrType === 'Cooperative - Extraprovincial'">
          <span class="text-sm font-bold"
            >Jurisdiction
            <span v-if="jurisdiction == null" class="text-red-600">
              (required)
            </span>
          </span>
          <ComboSelect
            v-model="jurisdiction"
            :options="computed(() => ['Alberta', 'Manitoba'])"
          />
        </div>

        <div class="grow" v-if="nrType === 'Cooperative - Restore'">
          <span class="text-sm font-bold">Related Corp #</span>
          <TextInput />
        </div>
      </div>
    </div>

    <ExamineActionButtons class="ml-auto" />
  </div>
</template>

<script setup lang="ts">
import { ArrowTopRightOnSquareIcon } from '@heroicons/vue/24/outline'
import { useExamineStore } from '~/store/examine'
const examine = useExamineStore()
const nrType = ref('Cooperative - Incorporation')
const jurisdiction = ref(null)

const isViewing = computed(() => examine.is_header_shown && !examine.is_editing)
const isExpanded = computed(
  () => examine.is_editing || isViewing || examine.is_header_shown
)

const requestType = ref('')

const requestTypeDesc = computed(() => {
  try {
    return examine.listRequestTypes.filter(
      (lrt: any) => requestType.value == lrt.value
    )[0].text
  } catch (_err) {
    return 'ERROR'
  }
})
</script>
