<template>
  <form class="flex items-center" role="search">
    <label :for="TEXT_INPUT_ID" class="sr-only">{{ placeholder }}</label>
    <div class="w-full">
      <input
        :id="TEXT_INPUT_ID"
        type="search"
        class="w-full rounded-l-md border border-gray-300 px-2 py-1 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
        :placeholder="placeholder"
        :value="modelValue"
        @change="(e) => $emit('update:modelValue', (e.target as HTMLInputElement).value)"
        autocorrect="off"
        required
      />
    </div>
    <IconButton
      class="rounded-none rounded-r-md !border border-bcgov-blue5 !p-1.5"
    >
      <MagnifyingGlassIcon class="h-5 w-5 stroke-2" />
    </IconButton>
  </form>
</template>

<script setup lang="ts">
import { MagnifyingGlassIcon } from '@heroicons/vue/24/outline'
const { focusMnemonic } = defineProps<{
  modelValue: string
  placeholder: string
  /** Mnemonic letter for focusing the search's input field. */
  focusMnemonic?: string
}>()

const TEXT_INPUT_ID = 'searchInputTextField'

if (focusMnemonic) {
  useMnemonic(focusMnemonic, () =>
    document.getElementById(TEXT_INPUT_ID)?.focus()
  )
}
</script>
