<template>
  <details
    id="details"
    :class="{ 'pointer-events-none': disabled }"
    ref="details"
  >
    <summary
      class="flex w-full cursor-pointer items-center justify-between rounded-md p-1 text-left text-sm font-medium transition"
      :class="buttonStyle"
      @click="onSummaryClick"
    >
      <slot name="title"></slot>
      <ChevronDownIcon
        v-if="arrow"
        :class="open ? 'rotate-180 transform' : ''"
        class="ml-1 h-5 w-5 stroke-2 transition"
      />
    </summary>
    <div class="p-1">
      <slot name="content"></slot>
    </div>
  </details>
</template>

<script setup lang="ts">
import { ChevronDownIcon } from '@heroicons/vue/24/outline'

const details = ref<HTMLDetailsElement | null>(null)
const open = ref<boolean>()

onMounted(() => (open.value = details.value?.open))

defineProps<{
  arrow?: boolean
  buttonStyle?: any
  disabled?: boolean
}>()

const emit = defineEmits<{
  toggled: [isOpen: boolean]
}>()

function onSummaryClick(_e: MouseEvent) {
  open.value = !open.value
  emit('toggled', open.value)
}
</script>
