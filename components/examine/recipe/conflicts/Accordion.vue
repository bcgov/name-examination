<template>
  <details id="details" :class="{ 'pointer-events-none': disabled }">
    <summary
      class="flex w-full cursor-pointer items-center justify-between rounded-md p-1 text-left text-sm font-medium transition"
      :class="buttonStyle"
    >
      <slot name="header"></slot>
      <ChevronDownIcon
        v-if="arrow"
        :class="open ? 'rotate-180 transform' : ''"
        class="ml-1 h-5 w-5 stroke-2 transition"
      />
    </summary>
    <div class="p-1">
      <slot></slot>
    </div>
  </details>
</template>

<script setup lang="ts">
import { ChevronDownIcon } from '@heroicons/vue/24/outline'

const details = ref<HTMLDetailsElement | null>(null)
const open = computed(() => details.value?.open)

defineProps<{
  arrow?: boolean
  buttonStyle?: any
  disabled?: boolean
}>()
</script>
