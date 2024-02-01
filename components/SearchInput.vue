<template>
  <form class="flex items-center" role="search">
    <div class="w-full">
      <input
        ref="searchTextField"
        type="search"
        class="w-full rounded-l-md border border-gray-300 px-2 py-1 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
        :placeholder="placeholder"
        :value="modelValue"
        @change="(e) => $emit('update:modelValue', (e.target as HTMLInputElement).value)"
        autocorrect="off"
        required
        aria-label="Search"
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

const searchTextField = ref<HTMLInputElement | null>(null)

if (focusMnemonic) {
  useMnemonic(focusMnemonic, () => searchTextField.value?.focus())
}
</script>
