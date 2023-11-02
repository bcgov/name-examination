<template>
  <div class="flex flex-col gap-y-1">
    <textarea
      class="grow resize-none rounded-md border border-gray-300 p-2 text-sm outline-none"
      :placeholder="placeholder"
      :readonly="readonly"
      :maxlength="characterLimit"
      :value="lazyUpdate ? text : modelValue"
      @input="onTextAreaInput"
    />
    <span v-if="characterLimit != null" class="text-sm">
      Characters Remaining: {{ charactersLeft }}
    </span>
    <div v-if="!disableButtons" class="flex space-x-1">
      <IconButton
        white
        class="h-7"
        @click="onSubmitButtonClick"
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
const { modelValue, lazyUpdate, characterLimit } = defineProps<{
  modelValue: any
  placeholder?: string
  disableButtons?: boolean
  submitMnemonic?: string
  cancelMnemonic?: string
  readonly?: boolean
  lazyUpdate?: boolean
  characterLimit?: number
}>()

const text = ref(modelValue)
const charactersLeft = computed(() => {
  if (characterLimit == null) {
    return 0
  } else if (lazyUpdate) {
    return characterLimit - text.value.length
  } else {
    return characterLimit - modelValue.length
  }
})

const emit = defineEmits<{
  (e: 'submit', text: string): void
  (e: 'cancel'): void
  (e: 'update:modelValue', newValue: string): void
}>()

function onSubmitButtonClick() {
  // emit two events, one to update the model value, and the other to indicate
  // the submit button was pressed, in case the component user wants to do something else
  // when the submit button is pressed
  emit('update:modelValue', text.value)
  emit('submit', text.value)
}

function onTextAreaInput(event: Event) {
  text.value = (event.target as HTMLTextAreaElement).value
  if (!lazyUpdate) {
    emit('update:modelValue', text.value)
  }
}
</script>
