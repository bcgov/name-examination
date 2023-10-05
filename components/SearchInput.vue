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
    <button
      type="submit"
      class="delay-120 flex items-center rounded-r-md bg-bcgov-blue5 p-1 text-white transition duration-300 ease-in-out hover:bg-bcgov-gold5 focus:outline-none focus:ring-4 focus:ring-amber-300"
    >
      <svg-icon type="mdi" viewBox="0 -4 24 24" :path="mdiMagnify" />
    </button>
  </form>
</template>

<script setup>
import { mdiMagnify } from '@mdi/js'
</script>
