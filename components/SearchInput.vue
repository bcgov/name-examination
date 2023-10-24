<template>
  <form class="flex items-center">
    <label for="textInput" class="sr-only">{{ placeholder }}</label>
    <div class="w-full">
      <input
        id="textInput"
        type="text"
        class="w-full rounded-l-md border border-gray-300 px-2 py-1 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
        :placeholder="placeholder"
        :value="value.value"
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
defineProps<{
  placeholder: string
  value: Ref<string>
}>()
</script>
