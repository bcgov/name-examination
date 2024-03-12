<template>
  <details :class="{ 'pointer-events-none': disabled }" ref="details">
    <summary
      class="flex w-full cursor-pointer items-center justify-between rounded p-1 text-left text-sm font-medium transition"
      :class="buttonStyle"
    >
      <slot name="title"></slot>
      <ChevronDownIcon
        v-if="arrow"
        :class="open ? 'rotate-180 transform' : ''"
        class="ml-1 h-5 w-5 stroke-2 transition"
      />
    </summary>
    <div v-if="open" class="p-1">
      <slot name="content"></slot>
    </div>
  </details>
</template>

<script setup lang="ts">
import { ChevronDownIcon } from '@heroicons/vue/24/outline'

const details = ref<HTMLDetailsElement>()
const open = ref(false)

onMounted(() => {
  open.value = Boolean(details.value?.open)
  details.value?.addEventListener('toggle', () => {
    open.value = Boolean(details.value?.open)
    emit('toggled', open.value)
  })
})

defineProps<{
  arrow?: boolean
  buttonStyle?: any
  disabled?: boolean
}>()

const emit = defineEmits<{
  toggled: [isOpen: boolean]
}>()
</script>
