<template>
  <div class="flex flex-col gap-y-1">
    <textarea
      :placeholder="placeholder"
      class="w-full grow resize-none rounded-md border border-gray-300 p-2 text-sm outline-none"
      :value="initialValue"
    />
    <div v-if="!disableButtons" class="flex space-x-1">
      <IconButton white text="Save" class="h-7" />
      <IconButton white text="Cancel" class="h-7" />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  initialValue?: string
  placeholder?: string
  disableButtons?: boolean
}>()
</script>
