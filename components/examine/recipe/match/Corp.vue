<template>
  <div class="flex p-2 text-sm">
    <div class="grid basis-1/2 grid-cols-2 gap-y-2 overflow-x-auto">
      <header class="font-bold">Type</header>
      <p>BC Corporation</p>

      <header class="font-bold">Corp Number</header>
      <p>{{ conflict['incorp #'] }}</p>

      <header class="font-bold">Directors</header>
      <div class="flex flex-col">
        <p v-if="isNotAvailable(conflict.directors)">Not Available</p>
        <p v-else v-for="director in conflict.directors">{{ director }}</p>
      </div>

      <header class="font-bold">Nature of Business</header>
      <p>{{ conflict['nature of business'] }}</p>
    </div>

    <div class="grid basis-1/2 grid-cols-2 overflow-x-auto">
      <header class="font-bold">Records Office Delivery Address</header>
      <div>
        <p v-if="isNotAvailable(conflict['records office delivery address'])">
          Not Available
        </p>
        <p v-else v-for="addrLine in conflict['records office delivery address']">
          {{ addrLine }}
        </p>
      </div>

      <header class="font-bold">Registered Office Delivery Address</header>
      <div>
        <p v-for="addrLine in conflict['registered office delivery address']">
          {{ addrLine }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { BCCorpConflict } from '~/types'

defineProps<{
  conflict: BCCorpConflict
}>()

const isNotAvailable = (val: any) => val === 'Not Available'
</script>
