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

  <!-- <table class="w-full text-sm">
    <thead>
      <tr class="border-b-2 text-left text-gray-600">
        <th class="px-4 py-2 font-normal">Name</th>
        <th class="px-4 py-2 font-normal">Description</th>
        <th class="px-4 py-2 font-normal">Status</th>
      </tr>
    </thead>
    <tbody class="text-sm">
      <tr class="cursor-pointer transition hover:bg-gray-100">
        <td class="px-4 py-2">FARMERS</td>
        <td class="px-4 py-2">FARMERS</td>
        <td class="px-4 py-2">FARMERS</td>
      </tr>
      <slot name="hidden0"></slot>
      <tr>
        <td colspan="3">
          <div class="inline-flex w-full justify-center">hello</div>
        </td>
      </tr>

      <tr class="transition hover:bg-gray-100">
        <td class="px-4 py-2">FARMERS</td>
        <td class="px-4 py-2">FARMERS</td>
        <td class="px-4 py-2">FARMERS</td>
      </tr>
      <slot name="hidden1"></slot>
    </tbody>
  </table> -->
</template>

<script setup lang="ts">
const rows = [
  ['FARMERS1', 'FARMERS2', 'FARMERS3'],
  ['FARMERS4', 'FARMERS5', 'FARMERS6'],
]
</script>
