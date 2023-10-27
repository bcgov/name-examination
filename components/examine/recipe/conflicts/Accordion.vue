<template>
  <Disclosure as="div" v-slot="{ open }">
    <DisclosureButton
      :disabled="disabled"
      class="flex w-full items-center justify-between rounded-md p-1 text-left text-sm font-medium transition"
      :class="buttonStyle"
    >
      <slot name="header"></slot>
      <ChevronDownIcon
        v-if="arrow"
        :class="open ? 'rotate-180 transform' : ''"
        class="ml-1 h-5 w-5 stroke-2 transition"
      />
    </DisclosureButton>
    <DisclosurePanel class="p-1">
      <slot></slot>
    </DisclosurePanel>
  </Disclosure>
</template>

<script setup lang="ts">
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/vue'
import { ChevronDownIcon } from '@heroicons/vue/24/outline'

defineProps<{
  arrow?: boolean
  buttonStyle?: any
  disabled?: boolean
  id?: number
}>()

const emit = defineEmits<{
  accordionClicked: [id: number]
}>()
</script>
