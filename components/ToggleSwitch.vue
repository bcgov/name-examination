<template>
  <SwitchGroup>
    <div class="flex items-center">
      <Switch v-model="enabled">
        <button
          class="relative inline-flex h-6 w-11 items-center rounded-full transition"
          :class="enabled ? 'bg-bcgov-blue5 hover:bg-bcgov-blue4' : 'bg-gray-200'"
          @click="
            examineOptions[storeFieldName] = !examineOptions[storeFieldName]
          "
        >
          <span
            :class="enabled ? 'translate-x-6' : 'translate-x-1'"
            class="inline-block h-4 w-4 transform rounded-full bg-white transition"
          />
        </button>
      </Switch>
      <SwitchLabel class="ml-1">{{ label }}</SwitchLabel>
    </div>
  </SwitchGroup>
</template>

<script setup>
import { Switch, SwitchGroup, SwitchLabel } from '@headlessui/vue'
import { useExamineOptionsStore } from '../store/ExamineOptions'
const props = defineProps({
  label: String,
  storeFieldName: String, // name of the field that the toggle switch represents in the state store
})
const examineOptions = useExamineOptionsStore()
const enabled = computed(() => examineOptions[props.storeFieldName])
</script>
