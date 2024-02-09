<template>
  <div class="flex p-2 text-sm">
    <div class="grid basis-1/2 grid-cols-2 gap-y-2 overflow-x-auto">
      <h3 class="font-bold">Type</h3>
      <p>BC Corporation</p>

      <h3 class="font-bold">Corp Number</h3>
      <p>{{ data['incorp #'] }}</p>

      <h3 class="font-bold">Directors</h3>
      <div class="flex flex-col">
        <p v-if="data.directors === 'Not Available'">Not Available</p>
        <p v-else v-for="director in data.directors">{{ director }}</p>
      </div>

      <h3 class="font-bold">Nature of Business</h3>
      <p>{{ data['nature of business'] }}</p>
    </div>

    <div class="grid basis-1/2 grid-cols-2 overflow-x-auto">
      <h3 class="font-bold">Records Office Delivery Address</h3>
      <div>
        <p v-if="data['records office delivery address'] === 'Not Available'">
          Not Available
        </p>
        <p
          v-else
          v-for="addrLine in parseAddress(
            data['records office delivery address']
          )"
        >
          {{ addrLine }}
        </p>
      </div>

      <h3 class="font-bold">Registered Office Delivery Address</h3>
      <div>
        <p
          v-for="addrLine in parseAddress(
            data['registered office delivery address']
          )"
        >
          {{ addrLine }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { BCCorporation } from '~/types'

defineProps<{
  data: BCCorporation
}>()

function parseAddress(lines: Array<string>) {
  const firstTwoLines = lines.slice(0, lines.length - 4)
  const lastFourLines = lines.slice(lines.length - 4).join(' ')
  const output = [...firstTwoLines, lastFourLines]
  if (
    output[0].toUpperCase() === 'N' &&
    output[1].toUpperCase() === 'O' &&
    output[2].toUpperCase() === 'T'
  ) {
    return ['Address not', 'available']
  }
  return output
}
</script>
