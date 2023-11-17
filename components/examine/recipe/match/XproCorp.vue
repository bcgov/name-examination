<template>
  <div class="flex p-2 text-sm">
    <div class="grid basis-1/2 grid-cols-2 gap-y-2 overflow-x-auto">
      <header class="font-bold">Type</header>
      <p>XPRO Corporation</p>

      <header class="font-bold">Corp Number</header>
      <p>{{ conflict['incorp #'] }}</p>

      <header class="font-bold">Attorneys</header>
      <div class="flex flex-col">
        <p v-for="attorney in conflict['attorney names']">{{ attorney }}</p>
      </div>

      <b>Nature of Business</b>
      <p>{{ conflict['nature of business'] }}</p>
    </div>

    <div class="grid basis-1/2 grid-cols-2 overflow-x-auto">
      <header class="font-bold">Directors</header>
      <div class="flex flex-col">
        <p v-for="director in conflict.directors">{{ director }}</p>
      </div>

      <header class="font-bold">Head Office</header>
      <div>
        <p>6407 CYPRESS STREET</p>
        <p>TORONTO ON CA L4S 3S4</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { XproConflict } from '~/types'

defineProps<{
  conflict: XproConflict
}>()

const isNotAvailable = (val: any) => val === 'Not Available'
</script>
