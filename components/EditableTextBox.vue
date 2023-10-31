<template>
  <div class="flex flex-col gap-y-1">
    <textarea
      :placeholder="placeholder"
      class="h-48 w-full grow resize-none rounded-md border border-gray-300 p-2 text-sm outline-none"
      v-model="text"
    />
    <div v-if="!disableButtons" class="flex space-x-1">
      <IconButton
        white
        class="h-7"
        @click="emit('submit', text)"
        :mnemonic="confirmMnemonic"
      >
        <template #text>
          <slot name="confirmText">Save</slot>
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
const props = defineProps<{
  initialValue?: string
  placeholder?: string
  disableButtons?: boolean
  confirmMnemonic?: string
  cancelMnemonic?: string
}>()

const text = ref(props.initialValue ? props.initialValue : '')

const emit = defineEmits<{
  submit: [text: string]
  cancel: []
}>()
</script>
