<template>
  <div class="flex flex-col space-y-2">
    <div class="flex w-full space-x-2">
      <SearchInput
        :value="ref('NOT SO STEEP COOPERATIVE')"
        class="grow"
        placeholder="name"
      />
      <SearchInput :value="ref('')" placeholder="exact phrase" />
    </div>
    <ExamineRecipeTabs />
  </div>
</template>

<script setup lang="ts"></script>
