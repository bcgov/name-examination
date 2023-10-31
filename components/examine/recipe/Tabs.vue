<template>
  <div class="sm:px-0">
    <TabGroup>
      <TabList class="flex space-x-1 rounded-md bg-gray-100 p-1">
        <ExamineRecipeTabButton class="basis-1/6" text="Conflicts">
          <CheckCircleIcon class="h-5 w-5 stroke-2 text-lime-600" />
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
          <input
            class="h-4 w-4"
            type="checkbox"
            id="auto-add"
            v-model="examine.autoAdd"
            :disabled="!examine.inProgress"
          />
          <span>auto add</span>
        </label>
      </TabList>

      <TabPanels
        class="mt-2 h-[29rem] overflow-auto rounded-md border border-gray-300 bg-white"
      >
        <!-- Conflicts tab -->
        <TabPanel>
          <ExamineRecipeConflicts />
        </TabPanel>

        <!-- Conditions tab -->
        <TabPanel>
          <ExamineRecipeConditions />
        </TabPanel>

        <!-- Trademarks tab -->
        <TabPanel>
          <ExamineRecipeTrademarks />
        </TabPanel>

        <!-- History tab -->
        <TabPanel>
          <ExamineRecipeHistory />
        </TabPanel>

        <!-- Compare tab -->
        <TabPanel>
          <ExamineRecipeCompare />
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
import { useExamineStore } from '~/store/examine'

const examine = useExamineStore()
</script>
