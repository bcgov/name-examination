<template>
  <div class="flex flex-col gap-y-1">
    <textarea
      class="grow resize-none rounded-md border border-gray-300 p-2 text-sm outline-none"
      :placeholder="placeholder"
      :readonly="readonly"
      :maxlength="characterLimit"
      :value="modelValue"
      @input="onTextAreaInput"
    />
    <div v-if="!disableButtons" class="flex space-x-1">
      <IconButton
        white
        class="h-7"
        @click="emit('submit', modelValue)"
        :mnemonic="submitMnemonic"
      >
        <template #text>
          <slot name="submitText">Save</slot>
        </template>
      </IconButton>
      <IconButton
        white
        class="h-7"
        @click="emit('cancel')"
        :mnemonic="cancelMnemonic"
      >
        <template #text>
          <slot name="cancelText">Cancel</slot>
        </template>
      </IconButton>
    </div>
  </div>
</template>

<script setup lang="ts">
const { modelValue, characterLimit } = defineProps<{
  modelValue: any
  placeholder?: string
  disableButtons?: boolean
  submitMnemonic?: string
  cancelMnemonic?: string
  readonly?: boolean
  characterLimit?: number
}>()

const emit = defineEmits<{
  (e: 'submit', text: string): void
  (e: 'cancel'): void
  (e: 'update:modelValue', newValue: string): void
}>()

function onTextAreaInput(event: Event) {
  const text = (event.target as HTMLTextAreaElement).value
  emit('update:modelValue', text)
}
</script>
