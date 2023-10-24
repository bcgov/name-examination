<template>
  <TransitionRoot appear :show="isOpen" as="template">
    <Dialog as="div" @close="$emit('cancel')" class="relative z-10">
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black bg-opacity-25" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div
          class="flex min-h-full items-center justify-center p-4 text-center"
        >
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel
              class="w-full max-w-md transform space-y-4 overflow-hidden rounded-md bg-white p-6 text-left align-middle shadow-xl transition-all"
            >
              <DialogTitle as="h3" class="text-lg font-bold text-gray-900">
                Select Date Range
              </DialogTitle>

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
                  <IconButton @click="$emit('cancel')">Cancel</IconButton>
                </div>
              </form>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup lang="ts">
/**
 * A dialog for choosing a date range.
 */
import { ref } from 'vue'
import {
  TransitionRoot,
  TransitionChild,
  Dialog,
  DialogPanel,
  DialogTitle,
} from '@headlessui/vue'

const props = defineProps<{
  isOpen: boolean
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
