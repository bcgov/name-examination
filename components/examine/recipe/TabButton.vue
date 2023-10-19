<template>
  <Tab v-slot="{ selected }">
    <IconButton
      white
      :class="[
        'h-8 w-full border bg-white hover:!bg-gray-200',
        selected
          ? 'border-2 border-gray-700 !bg-sky-100 hover:!bg-sky-100'
          : '',
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
