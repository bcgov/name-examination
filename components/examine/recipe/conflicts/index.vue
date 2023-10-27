<template>
  <div class="w-full">
    <div class="flex w-full flex-col space-y-2 rounded-md bg-white p-2">
      <ExamineRecipeConflictsAccordion
        open
        arrow
        button-style="bg-gray-200 p-2 hover:bg-gray-300"
      >
        <template #header>Exact match</template>
        <span class="p-2 text-gray-400">No exact match</span>
      </ExamineRecipeConflictsAccordion>

      <ExamineRecipeConflictsAccordion
        open
        arrow
        button-style="bg-gray-200 p-2 hover:bg-gray-300"
      >
        <template #header>Exact Word Order + Synonym Match</template>
        <ExamineRecipeConflictsBucket />
      </ExamineRecipeConflictsAccordion>

      <ExamineRecipeConflictsAccordion
        open
        arrow
        button-style="bg-gray-200 p-2 hover:bg-gray-300"
      >
        <template #header>Character Swap Match</template>
        <span class="p-2 text-gray-400">No results</span>
      </ExamineRecipeConflictsAccordion>

      <ExamineRecipeConflictsAccordion
        open
        arrow
        button-style="bg-gray-200 p-2 hover:bg-gray-300"
      >
        <template #header>Phonetic Match (experimental)</template>

        <span class="p-2 text-gray-400">No results</span>
      </ExamineRecipeConflictsAccordion>
    </div>
  </div>
</template>
