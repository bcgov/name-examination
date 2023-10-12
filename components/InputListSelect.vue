<template>
  <div>
    <Combobox
      :model-value="modelValue"
      @update:model-value="(newValue) => $emit('update:modelValue', newValue)"
      :multiple="multiple"
    >
      <div class="relative">
        <div
          class="relative w-20 cursor-default overflow-hidden bg-white text-left sm:text-sm"
        >
          <ComboboxInput
            class="w-full rounded-md border border-gray-300 py-1.5 pl-2 text-sm leading-5 text-gray-900 focus:ring-0"
            :displayValue="(_) => modelValue"
            @change="query = $event.target.value"
          />
          <ComboboxButton
            class="absolute inset-y-0 right-0 flex items-center pr-2"
          >
            <ChevronUpDownIcon class="h-5 w-5" aria-hidden="true" />
          </ComboboxButton>
        </div>
        <TransitionRoot
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          @after-leave="query = ''"
        >
          <ComboboxOptions
            class="absolute mt-1 max-h-[60vh] w-fit overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
          >
            <div
              v-if="filteredOptions.length === 0 && query !== ''"
              class="relative select-none px-4 py-2"
            >
              Nothing found.
            </div>

            <ComboboxOption
              v-for="option in filteredOptions"
              as="template"
              :key="option"
              :value="option"
              v-slot="{ selected, active }"
            >
              <li
                :class="[
                  active ? 'bg-amber-100 text-amber-900' : 'text-gray-900',
                  'relative cursor-default select-none py-2 pl-10 pr-4',
                ]"
              >
                <span class="block truncate">
                  {{ option }}
                </span>
                <span
                  v-if="selected"
                  class="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600"
                >
                  <CheckIcon class="h-5 w-5" aria-hidden="true" />
                </span>
              </li>
            </ComboboxOption>
          </ComboboxOptions>
        </TransitionRoot>
      </div>
    </Combobox>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  Combobox,
  ComboboxInput,
  ComboboxButton,
  ComboboxOptions,
  ComboboxOption,
  TransitionRoot,
} from '@headlessui/vue'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/vue/20/solid'

const { options, multiple } = defineProps<{
  modelValue: any
  options: any
  multiple?: boolean
}>()

const query = ref('')
const filteredOptions = computed(() =>
  query.value === ''
    ? options
    : options.filter((option: any) =>
        option
          .toString()
          .toLowerCase()
          .replace(/\s+/g, '')
          .includes(query.value.toLowerCase().replace(/\s+/g, ''))
      )
)
</script>
