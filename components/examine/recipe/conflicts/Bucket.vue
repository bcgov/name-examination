<template>
  <div class="flex flex-col">
    <Accordion arrow>
      <template #title>
        <div class="flex w-full font-medium">
          <HighlightedSubText text="SO" :start="0" :end="3" />
          <span class="grow italic">&nbsp;- proximity search</span>
          <span>2</span>
        </div>
      </template>
      <template #content>
        <ExamineRecipeConflictsList />
      </template>
    </Accordion>

    <Accordion disabled>
      <template #title>
        <div class="flex w-full font-medium">
          <p>SO*</p>
          <span class="grow italic">&nbsp;- exact word order</span>
        </div>
      </template>
    </Accordion>
  </div>
</template>

<script setup lang="ts">
/**
 * A conflicts bucket that holds a list of conflicts
 */
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
