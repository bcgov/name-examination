<template>
  <div>
    <Listbox
      :modelValue="modelValue"
      @update:modelValue="updateModelValue"
      :multiple="multiple"
      v-slot="{ open }"
    >
      <div class="relative w-full">
        <ListboxButton
          class="relative w-full rounded-md border border-gray-300 bg-white py-1.5 pl-3 pr-10 text-left transition hover:bg-gray-100 sm:text-sm"
        >
          <span class="block"><slot>Select</slot></span>
          <span class="absolute inset-y-0 right-0 flex items-center pr-3">
            <ChevronDownIcon class="mt-0.5 h-5 transition" :class="open ? 'rotate-180' : ''" aria-hidden/>
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
            class="absolute mt-1 max-h-[60vh] w-fit overflow-auto rounded-md bg-white py-1 text-left text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
          >
            <ListboxOption
              v-slot="{ active, selected }"
              v-for="option in options"
              :key="option"
              :value="option"
              as="template"
              @click="emit('option_clicked', option)"
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
                  <CheckIcon class="h-5" />
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
import {
  ChevronDownIcon,
  CheckIcon,
} from '@heroicons/vue/24/outline'

const { modelValue, options, multiple } = defineProps<{
  modelValue: Array<object> | any
  options: Array<any>
  multiple?: boolean
}>()

const emit = defineEmits<{
  (e: 'option_clicked', option: any): void
  (e: 'update:modelValue', newValue: any): void
}>()

const updateModelValue = (newValue: any) => {
  emit('update:modelValue', newValue)
}
</script>
