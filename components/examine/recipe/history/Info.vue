<template>
  <div class="flex gap-x-2 p-4 text-sm">
    <div class="flex basis-2/3 flex-col">
      <div class="grid grid-cols-2 gap-y-1 overflow-x-auto">
        <header class="font-bold">Client</header>
        <p>Jane Frost</p>

        <header class="font-bold">Applicant</header>
        <div>
          <p>Jack Frost</p>
          <p>3434 Main Street</p>
          <p>Suite 303</p>
          <p>Top Floor</p>
          <p>Saywarn BC v8v8v8 CA</p>
        </div>

        <header class="font-bold">Phone</header>
        <p>305-343-3434</p>

        <header class="font-bold">Email</header>
        <p>anonymous@gov.bc.ca</p>

        <header class="font-bold">Contact</header>
        <p>jack frost</p>
      </div>

      <header class="font-bold">Comments</header>
      <ExamineCommentsBox
        class="max-h-48 overflow-auto rounded-md border border-gray-400 p-2 children:bg-sky-50"
      />
    </div>

    <div class="grid basis-1/3 grid-cols-2 gap-y-1 overflow-x-auto">
      <p class="font-bold">Name State</p>
      <p>REJECTED</p>
    </div>
  </div>
</template>

<script setup lang="ts"></script>
