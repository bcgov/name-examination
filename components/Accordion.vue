<template>
  <details
    :class="{ 'pointer-events-none': disabled }"
    ref="details"
    @toggle="(e: ToggleEvent) => open = e.newState === 'open'"
  >
    <summary
      class="flex w-full cursor-pointer items-center justify-between rounded p-1 text-left text-sm font-medium outline-none transition"
      :class="buttonStyle"
      @click="onSummaryClicked"
    >
      <slot name="title"></slot>
      <ChevronDownIcon
        v-if="arrow"
        :class="open ? 'rotate-180 transform' : ''"
        class="ml-1 h-5 w-5 stroke-2 transition"
      />
    </summary>
    <div class="p-1">
      <slot v-if="open" name="content"></slot>
    </div>
  </details>
</template>

<script setup lang="ts">
import { ChevronDownIcon } from '@heroicons/vue/24/outline'

const details = ref<HTMLDetailsElement>()
const open = ref(Boolean(details.value?.open))

const props = defineProps<{
  arrow?: boolean
  buttonStyle?: any
  disabled?: boolean
  /** Disable the default behaviour when the title element is clicked, allowing manual control of opening/closing */
  disableDefaultOpenBehaviour?: boolean
}>()

const emit = defineEmits<{
  summaryClicked: []
}>()

function onSummaryClicked(event: MouseEvent) {
  emit('summaryClicked')
  if (props.disableDefaultOpenBehaviour) event.preventDefault()
}
</script>
