<template>
  <form
    @submit.prevent="emit('submit', startDate, endDate)"
    class="flex w-fit flex-col"
  >
    <label for="start_date" class="font-medium">Start date: </label>
    <input
      v-model="startDate"
      type="date"
      id="start_date"
      :max="endDate"
      required
    />

    <label for="end_date" class="font-medium">End date: </label>
    <input
      v-model="endDate"
      type="date"
      id="end_date"
      :min="startDate"
      required
    />

    <div class="mt-6 space-x-2">
      <IconButton type="submit">Ok</IconButton>
      <IconButton @click="emit('cancel')">Cancel</IconButton>
    </div>
  </form>
</template>

<script setup lang="ts">
const props = defineProps<{
  initialStart: string
  initialEnd: string
}>()

const emit = defineEmits<{
  (e: 'submit', startDate: string, endDate: string): void
  (e: 'cancel'): void
}>()

const startDate = ref(props.initialStart)
const endDate = ref(props.initialEnd)
</script>
