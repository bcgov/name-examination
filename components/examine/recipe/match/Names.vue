<template>
  <div class="flex flex-col space-y-2 p-2 text-sm">
    <div class="flex space-x-2">
      <div class="grid basis-2/3 grid-cols-[30%_70%] overflow-x-auto">
        <header class="font-bold">Applicant</header>
        <div>
          <p>John Test</p>
          <p>6407 CYPRESS STREET</p>
          <p>VANCOUVER BC CA V6M 3S4</p>
        </div>

        <header class="font-bold">Phone</header>
        <p>305-343-3434</p>

        <header class="font-bold">Email</header>
        <p>test@example.com</p>
      </div>

      <div class="grid basis-1/3 grid-cols-2 overflow-x-auto">
        <header class="font-bold">Client</header>
        <p>John Test</p>

        <header class="font-bold">Contact</header>
        <p>John Test</p>

        <header class="font-bold">Name State</header>
        <p>APPROVED</p>
      </div>
    </div>

    <div>
      <header class="font-bold">Comments</header>
      <ExamineCommentsBox
        class="max-h-48 overflow-auto rounded-md border border-gray-400 p-2 children:bg-sky-50"
      />
    </div>
  </div>
</template>
