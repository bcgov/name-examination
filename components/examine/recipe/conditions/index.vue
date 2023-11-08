<template>
  <ExamineRecipeTable
    class="h-full w-full"
    :columns="[
      'Word',
      'Allow',
      'Consent',
      'Examiner Information',
      'Instructions',
    ]"
    :rows="
      computed(() => [
        [
          'COOP',
          'Y',
          'N',
          'Use Of This Term Is Restricted Under The Cooperative Association Act R.S.B.C. 1999 C. 28, and only given for a Cooperative.',
          '',
        ],
      ])
    "
  />
</template>
