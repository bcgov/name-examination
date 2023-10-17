<template>
  <div class="my-2 w-full sm:px-0">
    <TabGroup>
      <TabList class="flex space-x-1 rounded-md bg-gray-100 p-1">
        <ExamineRecipeTabButton class="basis-1/6" text="Conflicts">
          <CheckCircleIcon class="h-5 w-5 stroke-2 text-green-600" />
        </ExamineRecipeTabButton>

        <ExamineRecipeTabButton class="basis-1/6" text="Conditions">
          <ExclamationCircleIcon class="h-5 w-5 stroke-2 text-yellow-600" />
        </ExamineRecipeTabButton>

        <ExamineRecipeTabButton class="basis-1/6" text="Trademarks">
          <XCircleIcon class="h-5 w-5 stroke-2 text-red-600" />
        </ExamineRecipeTabButton>

        <ExamineRecipeTabButton class="basis-1/6" text="History">
          <CheckCircleIcon class="h-5 w-5 stroke-2 text-lime-600" />
        </ExamineRecipeTabButton>

        <ExamineRecipeTabButton class="basis-1/6" text="Compare">
          <Bars3Icon class="h-5 w-5 stroke-2 text-bcgov-blue5" />
        </ExamineRecipeTabButton>

        <label class="flex items-center space-x-1" for="auto-add">
          <input class="w-4 h-4" type="checkbox" id="auto-add" />
          <span>auto add</span>
        </label>
      </TabList>

      <TabPanels class="mt-2 rounded-md bg-white border border-gray-300 overflow-auto h-[29rem]">
        <TabPanel>
          <!-- Conflicts tab -->
          <ExamineRecipeConflictsContainer />
        </TabPanel>
      </TabPanels>
    </TabGroup>
  </div>
</template>

<script setup>
import { TabGroup, TabList, TabPanels, TabPanel } from '@headlessui/vue'
import {
  Bars3Icon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  XCircleIcon,
} from '@heroicons/vue/24/outline'
</script>
