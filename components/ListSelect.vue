<template>
  <div>
    <Listbox :modelValue="modelValue" @update:modelValue="updateModelValue" :multiple="multiple" v-slot="{ open }">
      <div class="relative w-full">
        <ListboxButton
          class="relative w-full rounded-md border border-gray-300 bg-white py-1.5 pl-3 pr-10 text-left transition hover:bg-gray-100 sm:text-sm"
        >
          <span class="block"><slot>Select</slot></span>
          <span class="absolute inset-y-0 right-0 flex items-center pr-3">
            <svg-icon
              v-if="!open"
              type="mdi"
              viewBox="0 -4 24 24"
              :path="mdiChevronDown"
            />
            <svg-icon
              v-else
              type="mdi"
              viewBox="0 -4 24 24"
              :path="mdiChevronUp"
            />
          </span>
        </ListboxButton>

        <transition
          leave-active-class="transition duration-100 ease-in"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
          enter-active-class="transition duration-50 ease-in"
          enter-from-class="opacity-0"
          enter-to-class="opacity-100"
        >
          <ListboxOptions
            class="absolute mt-1 max-h-[60vh] w-fit overflow-auto rounded-md bg-white py-1 text-base text-left shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
          >
            <ListboxOption
              v-slot="{ active, selected }"
              v-for="option in options"
              :key="option"
              :value="option"
              as="template"
            >
              <li
                :class="[
                  active ? 'bg-amber-100 text-amber-900' : 'text-gray-900',
                  'relative cursor-default select-none py-2 pl-10 pr-4',
                ]"
              >
                <span>{{ option }}</span>
                <span
                  v-if="selected"
                  class="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600"
                >
                  <svg-icon class="h-5 w-5" type="mdi" :path="mdiCheck" />
                </span>
              </li>
            </ListboxOption>
          </ListboxOptions>
        </transition>
      </div>
    </Listbox>
  </div>
</template>

<script setup lang="ts">
/**
 * A dropdown menu to select list options.
 */
import {
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
} from '@headlessui/vue'
import { mdiCheck, mdiChevronDown, mdiChevronUp } from '@mdi/js'

const { modelValue, options, multiple } = defineProps<{
  modelValue: Array<object> | any
  options: Array<any>
  multiple?: boolean
}>()

const emit = defineEmits()

const updateModelValue = (newValue: any) => {
  emit('update:modelValue', newValue)
}
</script>
