<script setup>
defineProps({
  inputId: String,
  display: String,
})
</script>

<template>
  <label
    :for="inputId"
    class="relative inline-flex cursor-pointer items-center"
  >
    <input :id="inputId" type="checkbox" value="" class="peer sr-only" />
    <div
      class="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300"
    />
    <span class="ml-3 font-medium">{{ display }}</span>
  </label>
</template>
