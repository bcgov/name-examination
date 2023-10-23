<template>
  <div class="flex items-center space-x-2">
    <IconButton light>
      <PencilSquareIcon class="h-5 w-5 stroke-2" />
      <template #text>E<u>d</u>it Request</template>
    </IconButton>

    <IconButton
      light
      @click="
        examine.headerState =
          examine.headerState === 'minimized' ? 'maximized' : 'minimized'
      "
    >
      <ArrowsPointingInIcon
        v-if="examine.headerState === 'maximized'"
        class="h-5 w-5 stroke-2"
      />
      <ArrowsPointingOutIcon v-else class="h-5 w-5 stroke-2" />

      <template #text v-if="examine.headerState === 'maximized'"
        >Hide Details (<u>b</u>)</template
      >
      <template #text v-else>Show Details (<u>b</u>)</template>
    </IconButton>

    <IconButton v-if="!inProgress" light>
      <ChevronDoubleRightIcon class="h-5 w-5 stroke-2" />
      <template #text>Get&nbsp;<u>N</u>ext</template>
    </IconButton>

    <IconButton v-if="!inProgress" light text="Cancel Request">
      <XMarkIcon class="h-5 w-5 stroke-2" />
    </IconButton>

    <IconButton light @click="inProgress = !inProgress">
      <PauseIcon v-if="inProgress" class="h-5 w-5 stroke-2" />
      <DocumentCheckIcon v-else class="h-5 w-5 stroke-2" />

      <template #text v-if="inProgress"><u>H</u>old Request</template>
      <template #text v-else>E<u>x</u>amine</template>
    </IconButton>
  </div>
</template>

<script setup lang="ts">
import {
  ArrowsPointingInIcon,
  ArrowsPointingOutIcon,
  ChevronDoubleRightIcon,
  DocumentCheckIcon,
  PauseIcon,
  PencilSquareIcon,
  XMarkIcon,
} from '@heroicons/vue/24/outline'
import { useExamineStore } from '~/store/examine'

const examine = useExamineStore()
const inProgress = ref(false)
</script>

<style scoped>
u {
  margin: 0 !important;
}
</style>
