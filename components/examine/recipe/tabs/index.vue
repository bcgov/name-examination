<template>
  <div class="sm:px-0">
    <TabGroup>
      <ExamineRecipeTabsHeader />

      <TabPanels
        class="mt-2 h-[29rem] overflow-auto rounded-md border border-gray-300 bg-white"
      >
        <!-- Conflicts tab -->
        <TabPanel :unmount="false">
          <ExamineRecipeConflicts />
        </TabPanel>

        <!-- Conditions tab -->
        <TabPanel :unmount="false">
          <ExamineRecipeConditions />
        </TabPanel>

        <!-- Trademarks tab -->
        <TabPanel :unmount="false">
          <ExamineRecipeTrademarks />
        </TabPanel>

        <!-- History tab -->
        <TabPanel :unmount="false">
          <ExamineRecipeHistory />
        </TabPanel>

        <!-- Compare tab -->
        <TabPanel :unmount="false">
          <ExamineRecipeCompare />
        </TabPanel>
      </TabPanels>
    </TabGroup>
  </div>
</template>

<script setup lang="ts">
import { TabGroup, TabPanels, TabPanel } from '@headlessui/vue'
</script>
