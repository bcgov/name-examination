<template>
  <ExamineRecipeTable
    class="h-full w-full"
    :columns="['Name', 'Description', 'Status']"
    :rows="
      computed(() => [
        [
          'FARMERS',
          '(1) Produits laitiers. (2) Jus de fruits. (3) T-shirts.',
          'Registration published',
        ],
        [
          'FARMER\'S',
          '(1) Alcoholic beverages, namely gin.',
          'Registration published',
        ],
      ])
    "
  />
</template>
