<template>
  <div class="m-4 flex">
    <div>
      <p class="font-bold">1. FIRST NAME CHOICE</p>
      <p>2. SECOND NAME CHOICE</p>
      <p>3. THIRD NAME CHOICE</p>
    </div>

    <div class="ml-auto flex h-9 space-x-2">
      <IconButton
        inverted
        class="border-none bg-white hover:bg-sky-100 hover:!text-black"
        text="Quick Approve"
      >
        <CheckCircleIcon class="h-7 w-7 text-lime-600" />
      </IconButton>

      <IconButton
        inverted
        class="border-none bg-white hover:bg-sky-100 hover:!text-black"
        text="Reject Distinctive"
      >
        <XCircleIcon class="h-7 w-7 text-sky-400" />
      </IconButton>

      <IconButton
        inverted
        class="border-none bg-white hover:bg-sky-100 hover:!text-black"
        text="Reject Descriptive"
      >
        <XCircleIcon class="h-7 w-7 text-sky-400" />
      </IconButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CheckCircleIcon, XCircleIcon } from '@heroicons/vue/24/solid'
</script>
