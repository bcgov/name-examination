<template>
  <div class="flex flex-col">
    <ExamineRecipeConflictsAccordion arrow>
      <template #header>
        <div class="flex w-full font-medium">
          <ExamineHighlightedSubText text="SO" :start="0" :end="3" />
          <span class="grow italic">&nbsp;- proximity search</span>
          <span>2</span>
        </div>
      </template>
      <ExamineRecipeConflictsList />
    </ExamineRecipeConflictsAccordion>

    <ExamineRecipeConflictsAccordion disabled>
      <template #header>
        <div class="flex w-full font-medium">
          <p>SO*</p>
          <span class="grow italic">&nbsp;- exact word order</span>
        </div>
      </template>
    </ExamineRecipeConflictsAccordion>
  </div>
</template>

<script setup lang="ts">
const data = ref([
  {
    text: 'SO STEEP COOPERATIVE',
    start: 0,
    end: 15,
  },
  {
    text: 'SO STEEP COOPERATIVE',
    start: 0,
    end: 15,
  },
])
</script>
