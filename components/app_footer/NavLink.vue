<template>
  <li class="inline-block mr-1 xl:mr-2 lg:border-r lg:pr-2 border-solid border-bcgov-blue3">
    <nuxt-link
      :to="route"
      class="block py-1 px-2 text-white no-underline hover:underline xl:px-[0.25rem] xl:px-[0.5rem]"
      :target="target"
    >
      {{ text }}
    </nuxt-link>
  </li>
</template>

<script setup lang="ts">
/** A navigation link that takes you to another page. */
defineProps<{
  /** The text that the link should display */
  text: string
  /** The page this link should lead to */
  route: string
  /** Where to open the linked page  */
  target?: string
}>()
</script>
