<template>
  <div class="w-full">
    <div class="w-full rounded-md bg-white p-2">
      <ExamineRecipeConflictsAccordion text="Exact Match">
        <span class="text-gray-400">No exact match</span>
      </ExamineRecipeConflictsAccordion>

      <ExamineRecipeConflictsAccordion text="Exact Word Order + Synonym Match">
        <span class="text-gray-400">No results</span>
      </ExamineRecipeConflictsAccordion>

      <ExamineRecipeConflictsAccordion text="Character Swap Match">
        <span class="text-gray-400">No results</span>
      </ExamineRecipeConflictsAccordion>

      <ExamineRecipeConflictsAccordion text="Phonetic Match (experimental)">
        <span class="text-gray-400">No results</span>
      </ExamineRecipeConflictsAccordion>
    </div>
  </div>
</template>
