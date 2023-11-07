<template>
  <div class="flex flex-col gap-y-1">
    <div class="flex grow flex-col">
      <textarea
        class="grow resize-none rounded-t-md border border-gray-300 p-2 text-sm outline-none"
        :class="{ 'border-b-0': characterLimit }"
        :placeholder="placeholder"
        :readonly="readonly"
        :maxlength="characterLimit"
        :value="modelValue"
        @input="onTextAreaInput"
      />

      <span
        v-if="characterLimit"
        class="rounded-b-md border border-t-0 border-gray-300 bg-white p-2 text-sm text-gray-500"
      >
        {{ modelValue.length }} / {{ characterLimit }}
      </span>
    </div>

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
