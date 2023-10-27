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
        :text="confirmText"
        class="h-7"
        @click="emit('submit', text)"
      />
      <IconButton
        white
        :text="cancelText"
        class="h-7"
        @click="emit('cancel')"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    initialValue?: string
    placeholder?: string
    disableButtons?: boolean
    confirmText?: string
    cancelText?: string
  }>(),
  {
    confirmText: 'Save',
    cancelText: 'Cancel',
  }
)

const text = ref(props.initialValue ? props.initialValue : '')

const emit = defineEmits<{
  submit: [text: string]
  cancel: []
}>()
</script>
