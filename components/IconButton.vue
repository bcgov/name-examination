<template>
  <button
    class="inline-flex items-center justify-center space-x-1 rounded-md border px-2 py-1 transition hover:text-opacity-100 hover:opacity-90"
    ref="button"
    :class="[
      light
        ? 'bg-bcgov-blue3 text-white'
        : white
        ? 'border-gray-300 bg-white text-black hover:bg-gray-200'
        : 'bg-bcgov-blue5 text-white',
    ]"
  >
    <slot></slot>

    <!-- User of the component can pass in the text either as a prop or as a template (for custom styled text) -->
    <slot name="text"></slot>
    <span>{{ text }}</span>
  </button>
</template>

<script setup lang="ts">
/**
 * A styled button that contains an icon and/or text
 */
const props = defineProps<{
  text?: string
  light?: boolean
  white?: boolean
  mnemonic?: string
}>()

const button = ref<HTMLButtonElement | null>(null)

if (props.mnemonic) {
  useMnemonic(props.mnemonic, () => button?.value?.click())
}
</script>
