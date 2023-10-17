<template>
  <div class="mx-4 my-2 flex text-gray-700">
    <header class="text-3xl font-bold">NR 1234567</header>
    <a href="#" class="inline-flex items-center px-2 text-bcgov-blue5">
      <ArrowTopRightOnSquareIcon class="h-6 w-6" />
    </a>

    <p class="mx-3 font-bold">Cooperative - Incorporation</p>

    <div class="ml-auto inline-flex items-center space-x-2">
      <IconButton inverted text="Edit Request" class="!py-1">
        <PencilSquareIcon class="h-5 w-5 stroke-2" />
      </IconButton>

      <IconButton
        inverted
        :text="showDetails ? 'Hide Details (b)' : 'Show Details (b)'"
        class="!py-1"
        @click="showDetails = !showDetails"
      >
        <ArrowsPointingOutIcon v-if="!showDetails" class="h-5 w-5 stroke-2" />
        <ArrowsPointingInIcon v-else class="h-5 w-5 stroke-2" />
      </IconButton>

      <div v-if="!inProgress" class="space-x-2">
        <IconButton inverted text="Get Next" class="!py-1">
          <ChevronDoubleRightIcon class="h-5 w-5 stroke-2" />
        </IconButton>

        <IconButton inverted text="Cancel Request" class="!py-1">
          <XMarkIcon class="h-5 w-5 stroke-2" />
        </IconButton>
      </div>

      <IconButton
        inverted
        :text="inProgress ? 'Hold Request' : 'Examine'"
        class="!py-1"
        @click="inProgress = !inProgress"
      >
        <PauseIcon v-if="inProgress" class="h-5 w-5 stroke-2" />
        <DocumentCheckIcon v-else class="h-5 w-5 stroke-2" />
      </IconButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ArrowTopRightOnSquareIcon,
  ArrowsPointingInIcon,
  ArrowsPointingOutIcon,
  ChevronDoubleRightIcon,
  DocumentCheckIcon,
  PauseIcon,
  PencilSquareIcon,
  XMarkIcon,
} from '@heroicons/vue/24/outline'

const inProgress = ref(false)
const showDetails = ref(false)
</script>
