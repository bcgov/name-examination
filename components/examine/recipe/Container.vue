<template>
  <div class="flex flex-col">
    <div class="flex w-full space-x-2">
      <SearchInput
        :value="ref('WASD BLUEBERRY FARMERS COOP')"
        class="grow"
        placeholder="name"
      />
      <SearchInput :value="ref('')" placeholder="exact phrase" />
    </div>
    <ExamineRecipeTabs />
  </div>
</template>

<script setup lang="ts"></script>
