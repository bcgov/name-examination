<template>
  <div class="flex h-full flex-col">
    <p>Please provide comments to explain why the NR is being cancelled</p>
    <p v-if="showSubmitError" class="text-red-600">Please write a comment</p>
    <EditableTextBox
      class="grow"
      placeholder="Write comment..."
      confirm-text="Submit Cancellation"
      @submit="handleSubmit"
      @cancel="() => emit('cancel')"
    />
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  submit: [text: string]
  cancel: []
}>()

const showSubmitError = ref(false)

const handleSubmit = (text: string) => {
  if (text === '') {
    showSubmitError.value = true
  } else {
    showSubmitError.value = false
    emit('submit', text)
  }
}
</script>
