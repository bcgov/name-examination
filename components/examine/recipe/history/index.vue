<template>
  <ExamineRecipeTable
    class="h-full w-full"
    :columns="['Name', 'Jurisdiction', 'NR', 'Submitted', 'Status']"
    :rows="
      computed(() => [
        ['NOT SO STEEP COOPERATIVE', 'BC', 'NR 5979354', '2008-09-16', 'R'],
        ['NOT SO STEEP COOPERATIVE', 'BC', 'NR 3252689', '2008-09-16', 'A'],
      ])
    "
  >
    <!-- TODO: when pulling data from store, this should be a for loop with dynamic slot names i.e. #[`hidden${n}`] -->
    <template #hidden0>
      <ExamineRecipeHistoryInfo />
    </template>

    <template #hidden1>
      <ExamineRecipeHistoryInfo />
    </template>
  </ExamineRecipeTable>
</template>
