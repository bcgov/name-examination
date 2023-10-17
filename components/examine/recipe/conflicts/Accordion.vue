<template>
  <Disclosure default-open as="div" class="mt-2" v-slot="{ open }">
    <DisclosureButton
      class="flex w-full justify-between rounded-md bg-gray-200 px-4 py-2 text-left text-sm font-medium text-gray-900 hover:bg-sky-100"
    >
      <span>{{ text }}</span>
      <ChevronDownIcon
        :class="open ? 'rotate-180 transform' : ''"
        class="h-5 w-5 stroke-2"
      />
    </DisclosureButton>
    <DisclosurePanel class="px-4 pb-2 pt-4 text-sm">
      <slot></slot>
    </DisclosurePanel>
  </Disclosure>
</template>

<script setup lang="ts">
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/vue'
import { ChevronDownIcon } from '@heroicons/vue/24/outline'

defineProps<{
  text: string
}>()
</script>
