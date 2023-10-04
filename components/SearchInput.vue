<template>
  <form class="mx-3 flex items-center">
    <label for="allowWordClassificationModal" class="sr-only"
      >NR Number Lookup</label
    >
    <div>
      <input
        id="allowWordClassificationModal"
        type="text"
        class="block w-40 rounded-l-md border border-gray-300 px-2 py-1.5 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
        placeholder="NR Number Lookup"
        required
      />
    </div>
    <IconButton class="rounded-none rounded-r-md border-bcgov-blue5 !px-2">
      <MagnifyingGlassIcon class="h-5 stroke-2" />
    </IconButton>
  </form>
</template>

<script setup lang="ts">
import { MagnifyingGlassIcon } from '@heroicons/vue/24/outline'
</script>
