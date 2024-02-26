<template>
  <div class="flex flex-col gap-y-1">
    <div class="flex grow flex-col">
      <textarea
        ref="textArea"
        class="grow resize-none text-ellipsis rounded-md border border-gray-300 p-2 text-sm"
        :class="{
          'rounded-b-none border-b-0 outline-none': characterLimit,
        }"
        :placeholder="placeholder"
        :readonly="readonly"
        :value="modelValue"
        @input="onTextAreaInput"
      />

      <span
        v-if="characterLimit"
        class="rounded-b-md border border-t-0 border-gray-300 bg-white p-2 text-sm text-gray-600"
      >
        {{ modelValue.length }} / {{ characterLimit }}
      </span>
    </div>

    <div class="flex space-x-1">
      <component :is="usePopoverButtons ? PopoverButton : 'div'">
        <IconButton
          v-if="!hideSubmit"
          white
          class="h-7"
          @click="onSubmit"
          :mnemonic="submitMnemonic"
        >
          <template #text>
            <slot name="submitText">Save</slot>
          </template>
        </IconButton>
      </component>

      <component :is="usePopoverButtons ? PopoverButton : 'div'">
        <IconButton
          v-if="!hideCancel"
          white
          class="h-7"
          @click="emit('cancel')"
          :mnemonic="cancelMnemonic"
        >
          <template #text>
            <slot name="cancelText">Cancel</slot>
          </template>
        </IconButton>
      </component>
    </div>

    <p
      v-if="textRequired && showSubmitError"
      class="text-sm font-bold text-red-600"
    >
      <slot name="errorText"></slot>
    </p>
  </div>
</template>

<script setup lang="ts">
import { PopoverButton } from '@headlessui/vue'

const { modelValue, characterLimit, textRequired } = defineProps<{
  modelValue: string
  placeholder?: string
  hideSubmit?: boolean
  hideCancel?: boolean
  submitMnemonic?: string
  cancelMnemonic?: string
  readonly?: boolean
  /** Display the number of characters in the text area and a character limit. Does not enforce the character limit. */
  characterLimit?: number
  /** Prevents the user from submitting if the text field is empty. */
  textRequired?: boolean
  /** Whether to use `PopoverButton`s from HeadlessUI, useful if using text box in a Popover and buttons should close Popover when clicked. */
  usePopoverButtons?: boolean
}>()

const showSubmitError = ref(false)
const textArea = ref<HTMLTextAreaElement>()

const emit = defineEmits<{
  (e: 'submit', text: string): void
  (e: 'cancel'): void
  (e: 'input', event: Event): void
  (e: 'update:modelValue', newValue: string): void
}>()

function onSubmit() {
  if (!textArea.value) return
  if (textRequired && textArea.value.value.trim() === '') {
    showSubmitError.value = true
    return
  }
  emit('submit', textArea.value.value)
}

function onTextAreaInput(event: Event) {
  const text = (event.target as HTMLTextAreaElement).value
  showSubmitError.value = false
  emit('update:modelValue', text)
  emit('input', event)
}

onMounted(() => {
  textArea.value?.focus()
})
</script>
