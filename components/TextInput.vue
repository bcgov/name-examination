<template>
  <input
    type="text"
    class="w-full rounded-md border border-gray-300 px-2 py-1"
    :value="modelValue"
    @input="
      $emit('update:modelValue', ($event.target as HTMLInputElement).value)
    "
  />
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue?: string
}>()
</script>
