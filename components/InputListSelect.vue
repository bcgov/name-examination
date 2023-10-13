<template>
  <div>
    <Combobox
      :model-value="modelValue"
      @update:model-value="(newValue) => $emit('update:modelValue', newValue)"
      :multiple="multiple"
      :virtual="virtual"
      v-slot="{ open }"
    >
      <div class="relative w-full">
        <div
          class="relative cursor-default overflow-hidden bg-white text-left sm:text-sm"
        >
          <ComboboxButton class="m-0.5 flex items-center rounded-md" as="div">
            <ComboboxInput
              class="w-full rounded-md border border-gray-300 py-1.5 pl-2 pr-7 text-sm leading-5 text-gray-900 focus:ring-0"
              :displayValue="(item: any) => item"
              @change="query = $event.target.value"
            />
            <ChevronUpDownIcon
              class="absolute right-2 h-5 w-5 cursor-pointer"
              aria-hidden="true"
            />
          </ComboboxButton>
        </div>
        <TransitionRoot
          leave="transition duration-100 ease-in"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          enter="transition duration-50 ease-in"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          @after-leave="query = ''"
        >
          <ComboboxOptions
            v-if="filteredOptions.length > 0"
            class="absolute mt-1 max-h-[60vh] w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
            v-slot="{ option }"
          >
            <ComboboxOption
              as="template"
              class="w-full"
              :value="option"
              v-slot="{ selected, active }"
            >
              <li
                :class="[
                  active ? 'bg-amber-100 text-amber-900' : 'text-gray-900',
                  'relative cursor-default select-none py-2 pl-10 pr-4',
                ]"
              >
                <span class="block">
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
          <div
            v-else
            class="absolute mt-1 max-h-[60vh] w-full overflow-auto rounded-md bg-white px-4 py-2 shadow-lg sm:text-sm"
          >
            Nothing found.
          </div>
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
  options: ComputedRef<Array<any>>
  multiple?: boolean
}>()

const query = ref('')
const filteredOptions = computed(() =>
  query.value === ''
    ? options.value
    : options.value.filter((option: any) =>
        option
          .toString()
          .toLowerCase()
          .replace(/\s+/g, '')
          .includes(query.value.toLowerCase().replace(/\s+/g, ''))
      )
)

const virtual = ref({ options: filteredOptions })
</script>
