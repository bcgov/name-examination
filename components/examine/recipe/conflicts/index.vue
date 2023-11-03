<template>
  <div class="w-full">
    <div class="flex w-full flex-col space-y-2 rounded-md bg-white p-2">
      <Accordion
        open
        arrow
        button-style="bg-gray-200 p-2 hover:bg-gray-300"
      >
        <template #title>Exact match</template>
        <template #content>
          <span class="p-2 text-gray-400">No exact match</span>
        </template>
      </Accordion>

      <Accordion
        open
        arrow
        button-style="bg-gray-200 p-2 hover:bg-gray-300"
      >
        <template #title>Exact Word Order + Synonym Match</template>
        <template #content><ExamineRecipeConflictsBucket /></template>
      </Accordion>

      <Accordion
        open
        arrow
        button-style="bg-gray-200 p-2 hover:bg-gray-300"
      >
        <template #title>Character Swap Match</template>

        <template #content>
          <span class="p-2 text-gray-400">No results</span>
        </template>
      </Accordion>

      <Accordion
        open
        arrow
        button-style="bg-gray-200 p-2 hover:bg-gray-300"
      >
        <template #title>Phonetic Match (experimental)</template>

        <template #content>
          <span class="p-2 text-gray-400">No results</span>
        </template>
      </Accordion>
    </div>
  </div>
</template>
