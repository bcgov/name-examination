<template>
  <Tab v-slot="{ selected }">
    <IconButton
      inverted
      :class="[
        'h-8 w-full !border bg-white hover:!bg-gray-100 hover:!text-black',
        selected ? '!border-2 !bg-sky-100 hover:!bg-sky-100' : '',
      ]"
      :text="text"
    >
      <slot></slot>
    </IconButton>
  </Tab>
</template>

<script setup lang="ts">
import { Tab } from '@headlessui/vue'

defineProps<{
  text: string
}>()
</script>
